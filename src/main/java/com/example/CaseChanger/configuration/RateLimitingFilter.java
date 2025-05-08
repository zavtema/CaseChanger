package com.example.CaseChanger.configuration;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

import java.io.IOException;

import org.springframework.web.filter.OncePerRequestFilter;

import java.time.Duration;
import java.util.Set;


@Component
public class RateLimitingFilter extends OncePerRequestFilter {

    private final StringRedisTemplate redisTemplate; // строковый тип данных, для общения с redis (данные redis представлены в виде строк)
    private static final int LIMIT = 100;
    private static final int WINDOW_SECONDS = 60;

    public RateLimitingFilter(StringRedisTemplate redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        logger.info("Фильтр сработал для URI: " + request.getRequestURI() + " [" + request.getMethod() + "]");

        String ip = request.getHeader("X-Forwarded-For");

        if (ip == null || ip.isEmpty()) {
            ip = request.getRemoteAddr();
        }

        logger.info("Получен IP клиента: " + ip);

        String redisKey = "ratelimit:req:" + ip;
        String blockKey = "ratelimit:block:" + ip;
        String banCountKey = "ratelimit:banCount:" + ip;
        try {
            Boolean isBlocked = redisTemplate.hasKey(blockKey);
            logger.info("IP заблокирован? " + isBlocked);

            if (Boolean.TRUE.equals(isBlocked)) {
                logger.info("IP уже в блокировке: " + ip);
                response.setStatus(HttpStatus.FORBIDDEN.value());
                response.getWriter().write("Ваш IP заблокирован.");
                return;
            }

            Long count = redisTemplate.opsForValue().increment(redisKey);
            logger.info("Текущее количество запросов с IP " + ip + ": " + count);

            if (count == 1) {
                redisTemplate.expire(redisKey, Duration.ofSeconds(WINDOW_SECONDS));
                logger.info("Установлен TTL на ключ: " + redisKey);
            }

            if (count != null && count > LIMIT) {
                Long banCount = redisTemplate.opsForValue().increment(banCountKey);
                int banMinutes = (int) Math.pow(5, banCount);
                redisTemplate.opsForValue().set(blockKey, "1", Duration.ofMinutes(banMinutes));
                logger.info("Превышен лимит. IP: " + ip + ", Кол-во: " + count + ", Блокировка на " + banMinutes + " минут.");

                response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
                response.getWriter().write("Слишком много запросов. Вы заблокированы на " + banMinutes + " минут.");
                return;
            }

            if ("/api/users/login".equalsIgnoreCase(request.getRequestURI()) && "POST".equalsIgnoreCase(request.getMethod())) {
                logger.info("Обнаружена попытка входа.");

                String username = extractUsernameFromRequest(request);
                logger.info("Полученный username: " + username);
                logger.info("Имя пользователя из запроса: " + username);

                if (username != null && !username.isEmpty()) {
                    String ipSetKey = "loginIPs:" + username.toLowerCase();
                    redisTemplate.opsForSet().add(ipSetKey, ip);
                    redisTemplate.expire(ipSetKey, Duration.ofMinutes(20));
                    logger.info("Сохранён IP: " + ip + " для пользователя: " + username);

                    Long ipCount = redisTemplate.opsForSet().size(ipSetKey);
                    logger.info("Количество уникальных IP для пользователя '" + username + "': " + ipCount);

                    if (ipCount != null && ipCount > 3) {
                        Set<String> allIps = redisTemplate.opsForSet().members(ipSetKey);
                        for (String suspiciousIp : allIps) {
                            redisTemplate.opsForValue().set("block:" + suspiciousIp, "1", Duration.ofMinutes(20));
                            logger.info("Заблокирован IP из-за подозрительной активности: " + suspiciousIp);
                        }
                        response.setStatus(HttpStatus.FORBIDDEN.value());
                        response.getWriter().write("Обнаружена подозрительная активность входа. Все связанные IP были заблокированы.");
                        return;
                    }
                }
            }
        } catch (Exception e) {
            logger.error("Ошибка Redis: ", e);
            response.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
            response.getWriter().write("Ошибка сервера. Попробуйте позже.");
            return;
        }

        logger.info("Запрос прошёл проверку. Продолжаем выполнение цепочки фильтров.");
        filterChain.doFilter(request, response);
    }


    private String extractUsernameFromRequest(HttpServletRequest request) {
        try {
            return request.getParameter("username"); // это работает и для form-urlencoded, и даже для query params
        } catch (Exception e) {
            logger.error("Failed to extract username", e);
            return null;
        }
    }
}