document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    document.getElementById('login').classList.remove('error-input');
    document.getElementById('password').classList.remove('error-input');

    document.getElementById('loginError').classList.remove('show');
    document.getElementById('passwordError').classList.remove('show');

    document.getElementById('loginError').textContent = '';
    document.getElementById('passwordError').textContent = '';


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
        document.getElementById('passwordError').textContent = 'Пароль не может быть пустым';
        document.getElementById('passwordError').classList.add('show');
        return;
    } else if (password.length <= 7) {
        document.getElementById('password').classList.add('error-input');
        document.getElementById('passwordError').textContent = 'Пароль должен содержать хотя бы 8 символов';
        document.getElementById('passwordError').classList.add('show');
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
        window.location.assign("/");
    } else {
        const errorText = await response.text();
        if (errorText == "Пользователь с таким именем не найден") {
            document.getElementById('login').classList.add('error-input');
            document.getElementById('loginError').textContent = 'Пользователь с таким именем не найден';
            document.getElementById('loginError').classList.add('show');
        } else if (errorText == "Неверный логин или пароль") {
            document.getElementById('login').classList.add('error-input');
            document.getElementById('password').classList.add('error-input');
            document.getElementById('passwordError').textContent = 'Неверный логин или пароль';
            document.getElementById('passwordError').classList.add('show');
       }
    }
});

document.getElementById('password').addEventListener('input', function() {
    document.getElementById('password').classList.remove('error-input');
    document.getElementById('confirmPasswordError').innerText = ""
})

document.getElementById('login').addEventListener('input', function() {
    document.getElementById('login').classList.remove('error-input');
    document.getElementById('loginError').innerText = ""
})