document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const loginInput = document.getElementById('login');  // ТУТ login, а не username
    const passwordInput = document.getElementById('password');
    const loginError = document.getElementById('loginError');
    const passwordError = document.getElementById('passwordError');

    function clearErrors() {
        loginInput.classList.remove('error-input');
        passwordInput.classList.remove('error-input');
        loginError.classList.remove('show');
        passwordError.classList.remove('show');
        loginError.textContent = '';
        passwordError.textContent = '';
    }

    function showError(input, errorElement, message) {
        input.classList.add('error-input');
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        clearErrors();

        const login = loginInput.value.trim();
        const password = passwordInput.value.trim();

        let hasError = false;

        if (login === "") {
            showError(loginInput, loginError, 'Имя не может быть пустым');
            hasError = true;
        } else if (login.length <= 3) {
            showError(loginInput, loginError, 'Имя должно содержать хотя бы 4 символа');
            hasError = true;
        } else if (!/^[a-zA-Z0-9_]+$/.test(login)) {
            showError(loginInput, loginError, 'Имя содержит недопустимые символы');
            hasError = true;
        }

        if (password === "") {
            showError(passwordInput, passwordError, 'Пароль не может быть пустым');
            hasError = true;
        } else if (password.length <= 7) {
            showError(passwordInput, passwordError, 'Пароль должен содержать хотя бы 8 символов');
            hasError = true;
        }

        if (hasError) {
            return;
        }

        // Реальная отправка формы
        const realForm = document.createElement('form');
        realForm.method = 'POST';
        realForm.action = '/login';

        const usernameField = document.createElement('input');
        usernameField.type = 'hidden';
        usernameField.name = 'username';
        usernameField.value = login;

        const passwordField = document.createElement('input');
        passwordField.type = 'hidden';
        passwordField.name = 'password';
        passwordField.value = password;

        realForm.appendChild(usernameField);
        realForm.appendChild(passwordField);

        document.body.appendChild(realForm);
        realForm.submit();
    });

    loginInput.addEventListener('input', function() {
        loginInput.classList.remove('error-input');
        loginError.textContent = "";
    });

    passwordInput.addEventListener('input', function() {
        passwordInput.classList.remove('error-input');
        passwordError.textContent = "";
    });
});
