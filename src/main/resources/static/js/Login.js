document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const loginInput = document.getElementById('login');
    const passwordInput = document.getElementById('password');
    const loginError = document.getElementById('loginError');
    const passwordError = document.getElementById('passwordError');
    const urlParams = new URLSearchParams(window.location.search);

    if (urlParams.has('error')) {
        loginInput.classList.add('error-input');
        passwordInput.classList.add('error-input');
        passwordError.classList.add('show');
        passwordError.textContent = 'Неверный логин или пароль';
    }

    loginInput.addEventListener('input', function() {
        loginInput.classList.remove('error-input');
        loginError.classList.remove('show');
        loginError.textContent = '';
        passwordInput.classList.remove('error-input');
        passwordError.classList.remove('show');
        passwordError.textContent = '';
    });

    passwordInput.addEventListener('input', function() {
        loginInput.classList.remove('error-input');
        loginError.classList.remove('show');
        loginError.textContent = '';
        passwordInput.classList.remove('error-input');
        passwordError.classList.remove('show');
        passwordError.textContent = '';
    });

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const login = loginInput.value.trim();
        const password = passwordInput.value.trim();

        // Валидация
        if (login == "") {
            loginInput.classList.add('error-input');
            loginError.classList.add('show');
            loginError.textContent = 'Имя не может быть пустым';
            return;
        } else if (login.length <= 3) {
            loginInput.classList.add('error-input');
            loginError.classList.add('show');
            loginError.textContent = 'Имя должно содержать хотя бы 4 символа';
            return;
        } else if (!/^[a-zA-Z0-9_]+$/.test(login)) {
            loginInput.classList.add('error-input');
            loginError.classList.add('show');
            loginError.textContent = 'Имя содержит недопустимые символы';
            return;
        }

        if (password == "") {
            passwordInput.classList.add('error-input');
            passwordError.classList.add('show');
            passwordError.textContent = 'Пароль не может быть пустым';
            return;
        } else if (password.length <= 7) {
            passwordInput.classList.add('error-input');
            passwordError.classList.add('show');
            passwordError.textContent = 'Пароль должен содержать хотя бы 8 символов';
            return;
        }

        // Получаем CSRF-токен из исходной формы
        const csrfToken = document.querySelector('input[name="_csrf"]').value;  // Thymeleaf автоматически добавит CSRF-токен

        // Отправляем данные через fetch с CSRF-токеном
        fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `username=${encodeURIComponent(login)}&password=${encodeURIComponent(password)}&_csrf=${encodeURIComponent(csrfToken)}` // Thymeleaf автоматически добавит CSRF-токен
        })
        .then(response => {
            if (response.redirected) {
                window.location.href = response.url; // Редирект на страницу после успешного входа
            } else if (!response.ok) {
                throw new Error('Ошибка авторизации');
            }
        })
        .catch(error => {
            loginInput.classList.add('error-input');
            passwordInput.classList.add('error-input');
            passwordError.classList.add('show');
            passwordError.textContent = 'Неверный логин или пароль';
        });
    });
});