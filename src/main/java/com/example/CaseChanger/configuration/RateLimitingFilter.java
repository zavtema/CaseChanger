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


@Component
public class RateLimitingFilter extends OncePerRequestFilter {

    private final StringRedisTemplate redisTemplate; // строковый тип данных, для общения с redis (данные redis представлены в виде строк)
    private static final int LIMIT = 300;
    private static final int WINDOW_SECONDS = 10;

    public RateLimitingFilter(StringRedisTemplate redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            // HttpServletRequest - запрос, который объект шлет на сервер, можно получать инф. о запросе
            // HttpServletResponse - ответ сервера на запрос
            // FilterChain - цепочка фильтров, через которые проходит запрос-ответ.
            throws ServletException, IOException {

        String ip = request.getRemoteAddr();
        String redisKey = "req:" + ip; // получили ip и преобразовали в ключ redis(а)
        try {
            Long count = redisTemplate.opsForValue().increment(redisKey); // метод opsForValue предоставил доступ к операциям со строковыми значениями, increment дал +1

            if (count == 1) {         // Если это первый запрос (count == 1), устанавливаем TTL (Time To Live на ключ в Redis на 10 секунд по ключу в redis
                redisTemplate.expire(redisKey, Duration.ofSeconds(WINDOW_SECONDS));
            }

            if (count != null && count > LIMIT) {
                response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value()); // Отправляем клиенту статус 429 (слишком много запросов)
                response.getWriter().write("Too many requests, try again later.");
                return; // Прерываем цепочку фильтров
            }
        }
        catch (Exception e) {
            logger.error("Redis error: ", e);
            response.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
            response.getWriter().write("Server error. Please try again later.");
            return;
        }
        // Если лимит не превышен — продолжаем цепочку фильтров
        filterChain.doFilter(request, response);
        /*
        Когда фильтры заканчиваются: Если в цепочке нет других фильтров, выполнение передается конечному обработчику запроса — это обычно контроллер в Spring,
        который отвечает за выполнение логики приложения и формирование ответа.
         */
    }
}