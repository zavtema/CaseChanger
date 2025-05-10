document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');
    const loginInput = document.getElementById('login');
    const passwordInput = document.getElementById('password');
    const loginError = document.getElementById('loginError');
    const passwordError = document.getElementById('passwordError');
    const urlParams = new URLSearchParams(window.location.search);
    const csrfToken = document.querySelector('meta[name="_csrf"]').getAttribute('content');
    const csrfParam = document.querySelector('meta[name="_csrf_parameter"]').getAttribute('content');

    if (urlParams.has('error')) {
        loginInput.classList.add('error-input');
        passwordInput.classList.add('error-input');
        passwordError.classList.add('show');
        passwordError.textContent = 'Неверный логин или пароль';
    }

    function clearErrors() {
        loginInput.classList.remove('error-input');
        passwordInput.classList.remove('error-input');
        loginError.classList.remove('show');
        passwordError.classList.remove('show');
        loginError.textContent = '';
        passwordError.textContent = '';
    }

    loginInput.addEventListener('input', clearErrors);
    passwordInput.addEventListener('input', clearErrors);

    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const login = loginInput.value.trim();
        const password = passwordInput.value.trim();

        clearErrors();

        let hasError = false;

        if (!login) {
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

        if (!password) {
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

        grecaptcha.ready(() => {
            grecaptcha.execute('6Ld11jIrAAAAAMUoUlb7feesE9uDp4ASpCHqbEG2', { action: 'login' }).then(token => {
                const realForm = document.createElement('form');
                realForm.method = 'POST';
                realForm.action = '/api/users/login';

                const createHiddenField = (name, value) => {
                    const input = document.createElement('input');
                    input.type = 'hidden';
                    input.name = name;
                    input.value = value;
                    return input;
                };

                realForm.appendChild(createHiddenField('username', login));
                realForm.appendChild(createHiddenField('password', password));
                realForm.appendChild(createHiddenField(csrfParam, csrfToken));
                realForm.appendChild(createHiddenField('recaptchaToken', token));

                document.body.appendChild(realForm);
                realForm.submit();
            });
        });
    });
});
