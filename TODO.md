# Front:
- [ ] сделать ебанный фронтэнд 

# Back:
- [ ] захуячить качественный бэк

# Bot:
- [ ] хули бот до сих пор не робит

# Popularity:
- [ ] заработать многа деняк

На 28.04.25:
Регистрация
Авторизация
Подключение Spring Security соотвественно
Шифровка паролей (хэширование) и Post запросов(csrf token)
Проверка работоспособности базы данных
Возможность перехода пользователя на свой аккаунт и отображение некоторой информации
"Возможно" создание модели предмета, кейса и т.п.

На следующее число:
Переброс на свой аккаунт, с показом данных
csrf_token, его включение
все анимации (фронтэнд)
фикс анимаций chat gpt
создание профиля игрока

back:
src/
└── main/
├── java/
│   └── com/example/casechanger/
│       ├── config/
│       │   ├── SecurityConfig.java         <-- Настройки безопасности (Steam login, защита маршрутов)
│       │   └── WebMvcConfig.java            <-- Конфигурация MVC (например, ресурсы, локализация)
│       │
│       ├── controller/
│       │   ├── AuthController.java          <-- Логика авторизации через Steam
│       │   ├── UserController.java          <-- Профиль пользователя, инвентарь
│       │   ├── ExchangeController.java      <-- Обмен кейсами: создание, просмотр
│       │   └── AdminController.java         <-- Админка (если будет нужна)
│       │
│       ├── entity/
│       │   ├── User.java                    <-- Модель пользователя
│       │   ├── Case.java                    <-- Модель кейса
│       │   └── Exchange.java                <-- Модель заявки на обмен
│       │
│       ├── repository/
│       │   ├── UserRepository.java          <-- Репозиторий для User
│       │   ├── CaseRepository.java          <-- Репозиторий для Case
│       │   └── ExchangeRepository.java      <-- Репозиторий для Exchange
│       │
│       ├── service/
│       │   ├── SteamService.java             <-- Работа с Steam API (авторизация, загрузка инвентаря)
│       │   ├── UserService.java              <-- Логика пользователя
│       │   ├── CaseService.java              <-- Логика обработки кейсов
│       │   └── ExchangeService.java          <-- Логика создания/подтверждения обменов
│       │
│       └── CaseChangerApplication.java       <-- Главный файл запуска Spring Boot
│
└── resources/
├── static/
│   ├── css/
│   ├── js/
│   └── images/
│
├── templates/
│   ├── index.html              <-- Главная страница
│   ├── login.html              <-- Страница входа
│   ├── inventory.html          <-- Инвентарь пользователя
│   ├── create-exchange.html    <-- Создание обмена
│   ├── my-exchanges.html       <-- Мои обмены
│   └── error.html              <-- Ошибки
│
├── application.properties      <-- Настройки проекта (DB, Steam API и т.д.)
└── application-dev.properties  <-- Локальные настройки для разработки
