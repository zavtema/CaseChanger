document.getElementById("loginForm").addEventListener('submit', async function(e) {
    e.preventDefault();

    const login = document.getElementById('login').value;
    const password = document.getElementById('password').value;

    if (login == "") {
        document.getElementById('login').classList.add('error-input');
        document.getElementById('loginError').textContent = 'Имя не может быть пустым';
        document.getElementById('loginError').classList.add('show');
        return;
    } else if (login.length <= 3) {
        document.getElementById('login').classList.add('error-input');
        document.getElementById('loginError').textContent = 'Имя должно содержать хотя бы 4 символа';
        document.getElementById('loginError').classList.add('show');
        return;
    } else if (!/^[a-zA-Z0-9_]+$/.test(login)) {
        document.getElementById('login').classList.add('error-input');
        document.getElementById('loginError').textContent = 'Имя содержит недопустимые символы';
        document.getElementById('loginError').classList.add('show');
        return;
    }

    if (password == "") {
        document.getElementById('password').classList.add('error-input');
        document.getElementById('confirmPasswordError').textContent = 'Пароль не может быть пустым';
        document.getElementById('confirmPasswordError').classList.add('show');
        return;
    } else if (password.length <= 7) {
        document.getElementById('password').classList.add('error-input');
        document.getElementById('confirmPasswordError').textContent = 'Пароль должен содержать хотя бы 8 символов';
        document.getElementById('confirmPasswordError').classList.add('show');
        return;
    }

    const response = await fetch('http://localhost:8080/api/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ login , password })
    });

    if (response.ok) {

    } else {
        document.getElementById('login').classList.add('error-input');
        document.getElementById('password').classList.add('error-input');
        document.getElementById('confirmPasswordError').textContent = 'Неверный логин или пароль';
        document.getElementById('confirmPasswordError').classList.add('show');
    }
});

//document.addEventListener('DOMContentLoaded', function() {
//
//    const loginForm = document.getElementById('loginForm');
//    const loginInput = document.getElementById('login');
//    const passwordInput = document.getElementById('password');
//    const loginError = document.getElementById('loginError');
//    const passwordError = document.getElementById('passwordError');
//    const urlParams = new URLSearchParams(window.location.search);
//
//    if (urlParams.has('error')) {
//        loginInput.classList.add('error-input');
//        passwordInput.classList.add('error-input');
//        passwordError.classList.add('show');
//        passwordError.textContent = 'Неверный логин или пароль';
//    }
//
//    loginInput.addEventListener('input', function() {
//        loginInput.classList.remove('error-input');
//        loginError.classList.remove('show');
//        loginError.textContent = '';
//        passwordInput.classList.remove('error-input');
//        passwordError.classList.remove('show');
//        passwordError.textContent = '';
//    })
//
//    passwordInput.addEventListener('input', function() {
//        loginInput.classList.remove('error-input');
//        loginError.classList.remove('show');
//        loginError.textContent = '';
//        passwordInput.classList.remove('error-input');
//        passwordError.classList.remove('show');
//        passwordError.textContent = '';
//    })
//
//    loginForm.addEventListener('submit', function(e) {
//        e.preventDefault();
//
//        const login = loginInput.value.trim();
//        const password = passwordInput.value.trim();
//
//        if (login == "") {
//            loginInput.classList.add('error-input');
//            loginError.classList.add('show');
//            loginError.textContent = 'Имя не может быть пустым';
//            return;
//        } else if (login.length <= 3) {
//            loginInput.classList.add('error-input');
//            loginError.classList.add('show');
//            loginError.textContent = 'Имя должно содержать хотя бы 4 символа';
//            return;
//        } else if (!/^[a-zA-Z0-9_]+$/.test(login)) {
//            loginInput.classList.add('error-input');
//            loginError.classList.add('show');
//            loginError.textContent = 'Имя содержит недопустимые символы';
//            return;
//        }
//
//        if (password == "") {
//            passwordInput.classList.add('error-input');
//            passwordError.classList.add('show');
//            passwordError.textContent = 'Пароль не может быть пустым';
//            return;
//        } else if (password.length <= 7) {
//            passwordInput.classList.add('error-input');
//            passwordError.classList.add('show');
//            passwordError.textContent = 'Пароль должен содержать хотя бы 8 символов';
//            return;
//        }
//
//        // Реальная отправка формы
//        const realForm = document.createElement('form');
//        realForm.method = 'POST';
//        realForm.action = '/login';
//
//        const usernameField = document.createElement('input');
//        usernameField.type = 'hidden';
//        usernameField.name = 'username';
//        usernameField.value = login;
//
//        const passwordField = document.createElement('input');
//        passwordField.type = 'hidden';
//        passwordField.name = 'password';
//        passwordField.value = password;
//
//        realForm.appendChild(usernameField);
//        realForm.appendChild(passwordField);
//
//        document.body.appendChild(realForm);
//        realForm.submit();
//    });
//});
