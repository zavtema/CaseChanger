document.addEventListener('DOMContentLoaded', function() {

    const loginForm = document.getElementById('loginForm');
    const loginInput = document.getElementById('login');
    const passwordInput = document.getElementById('password');
    const loginError = document.getElementById('loginError');
    const passwordError = document.getElementById('passwordError');
    const urlParams = new URLSearchParams(window.location.search);
    const csrfToken = document.querySelector('meta[name="_csrf"]').getAttribute('content');
    const csrfParam = document.querySelector('meta[name="_csrf_parameter"]').getAttribute('content');

    grecaptcha.ready(() => {
        grecaptcha.execute('6Ld11jIrAAAAAMUoUlb7feesE9uDp4ASpCHqbEG2', { action: 'login' })
            .then(token => {
                document.getElementById('recaptchaToken').value = token;
            });
    });

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
    })

    passwordInput.addEventListener('input', function() {
        loginInput.classList.remove('error-input');
        loginError.classList.remove('show');
        loginError.textContent = '';
        passwordInput.classList.remove('error-input');
        passwordError.classList.remove('show');
        passwordError.textContent = '';
    })

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const login = loginInput.value.trim();
        const password = passwordInput.value.trim();

        grecaptcha.ready(() => {
            grecaptcha.execute('6Ld11jIrAAAAAMUoUlb7feesE9uDp4ASpCHqbEG2', { action: 'login' })
                .then(token => {
                    document.getElementById('recaptchaToken').value = token;
                });
        });

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

        // Реальная отправка формы
        const realForm = document.createElement('form');
        realForm.method = 'POST';
        realForm.action = '/api/users/login';

        const usernameField = document.createElement('input');
        usernameField.type = 'hidden';
        usernameField.name = 'username';
        usernameField.value = login;

        const passwordField = document.createElement('input');
        passwordField.type = 'hidden';
        passwordField.name = 'password';
        passwordField.value = password;

        const csrfField = document.createElement('input');
        csrfField.type = 'hidden';
        csrfField.name = csrfParam;
        csrfField.value = csrfToken;

        realForm.appendChild(usernameField);
        realForm.appendChild(passwordField);
        realForm.appendChild(csrfField);

        document.body.appendChild(realForm);
        realForm.submit();
    });
});