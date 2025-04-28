document.getElementById('registerForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const login = document.getElementById('login').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

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

    const response = await fetch('http://localhost:8080/api/users/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, login , password }) // Без confirmPassword!
    });

    if (response.ok) {
        window.location.assign("/");
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