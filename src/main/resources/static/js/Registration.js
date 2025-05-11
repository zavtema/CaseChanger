document.getElementById('registerForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const login = document.getElementById('login').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const csrfToken = document.querySelector('meta[name="_csrf"]').getAttribute('content');
    const csrfParam = document.querySelector('meta[name="_csrf_parameter"]').getAttribute('content');
    const rememberMeCheckbox = document.querySelector('input[name="remember-me"]');

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

    if (email == "") {
        document.getElementById('email').classList.add('error-input');
        document.getElementById('emailError').textContent = 'Email не может быть пустым';
        document.getElementById('emailError').classList.add('show');
        return;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        document.getElementById('email').classList.add('error-input');
        document.getElementById('emailError').textContent = 'Не верный формат почты';
        document.getElementById('emailError').classList.add('show');
        return;
    }

    if (password == "") {
        document.getElementById('password').classList.add('error-input');
        document.getElementById('confirmPasswordError').textContent = 'Пароль не может быть пустым';
        document.getElementById('confirmPasswordError').classList.add('show');
        return;
    } else if (confirmPassword == "") {
        document.getElementById('confirmPassword').classList.add('error-input');
        document.getElementById('confirmPasswordError').textContent = 'Пароль не может быть пустым';
        document.getElementById('confirmPasswordError').classList.add('show');
        return;
    } else if (password.length <= 7) {
        document.getElementById('password').classList.add('error-input');
        document.getElementById('confirmPasswordError').textContent = 'Пароль должен содержать хотя бы 8 символов';
        document.getElementById('confirmPasswordError').classList.add('show');
        return;
    } else if (confirmPassword.length <= 7) {
        document.getElementById('confirmPassword').classList.add('error-input');
        document.getElementById('confirmPasswordError').textContent = 'Пароль должен содержать хотя бы 8 символов';
        document.getElementById('confirmPasswordError').classList.add('show');
        return;
    } else if (password !== confirmPassword) {
        document.getElementById('password').classList.add('error-input');
        document.getElementById('confirmPassword').classList.add('error-input');
        document.getElementById('confirmPasswordError').textContent = 'Пароли не совпадают';
        document.getElementById('confirmPasswordError').classList.add('show');
        return;
    }

    grecaptcha.ready(() => {
        grecaptcha.execute('6Ld11jIrAAAAAMUoUlb7feesE9uDp4ASpCHqbEG2', { action: 'register' }).then(async function (token) {
            const response = await fetch('http://localhost:8080/api/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken
                },
                body: JSON.stringify({ email, login, password, recaptchaToken: token })
            });

            if (response.ok) {
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

                        if (rememberMeCheckbox && rememberMeCheckbox.checked) {
                            realForm.appendChild(createHiddenField('remember-me', 'on'));
                        }

                        document.body.appendChild(realForm);
                        realForm.submit();
                    });
                });
            } else {
                const errorText = await response.text();
                if (errorText == "Логин занят!") {
                    document.getElementById('login').classList.add('error-input');
                    document.getElementById('loginError').textContent = 'Пользователь с таким именем уже существует';
                    document.getElementById('loginError').classList.add('show');
                    return;
                } else if (errorText == "Email занят!") {
                    document.getElementById('email').classList.add('error-input');
                    document.getElementById('emailError').textContent = 'Email занят';
                    document.getElementById('emailError').classList.add('show');
                    return;
                }
            }
        });
    });
});

document.getElementById('password').addEventListener('input', function() {
    document.getElementById('password').classList.remove('error-input');
    document.getElementById('confirmPassword').classList.remove('error-input');
    document.getElementById('confirmPasswordError').innerText = ""
})

document.getElementById('confirmPassword').addEventListener('input', function() {
    document.getElementById('password').classList.remove('error-input');
    document.getElementById('confirmPassword').classList.remove('error-input');
    document.getElementById('confirmPasswordError').innerText = ""
})

document.getElementById('login').addEventListener('input', function() {
    document.getElementById('login').classList.remove('error-input');
    document.getElementById('loginError').innerText = ""
})

document.getElementById('email').addEventListener('input', function() {
    document.getElementById('email').classList.remove('error-input');
    document.getElementById('emailError').innerText = ""
})