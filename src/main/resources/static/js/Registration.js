document.getElementById('registerForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    // Получаем значения полей
    const login = document.getElementById('login').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const csrfToken = document.querySelector('meta[name="_csrf"]').content;

    // Сбрасываем предыдущие ошибки
    resetErrors();

    // Валидация логина
    if (!login) {
        showError('login', 'Имя не может быть пустым');
        return;
    } else if (login.length < 4) {
        showError('login', 'Имя должно содержать хотя бы 4 символа');
        return;
    } else if (!/^[a-zA-Z0-9_]+$/.test(login)) {
        showError('login', 'Имя содержит недопустимые символы');
        return;
    }

    // Валидация email
    if (!email) {
        showError('email', 'Email не может быть пустым');
        return;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showError('email', 'Неверный формат почты');
        return;
    }

    // Валидация пароля
    if (!password) {
        showError('password', 'Пароль не может быть пустым', 'confirmPasswordError');
        return;
    } else if (password.length < 8) {
        showError('password', 'Пароль должен содержать хотя бы 8 символов', 'confirmPasswordError');
        return;
    } else if (password !== confirmPassword) {
        showError('confirmPassword', 'Пароли не совпадают', 'confirmPasswordError');
        return;
    }

    try {
        // Отправка данных на сервер
        const response = await fetch('/api/users/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrfToken
            },
            body: JSON.stringify({
                email,
                login,
                password
            })
        });

        if (response.ok) {
            // Перенаправление после успешной регистрации
            window.location.href = '/login?registered=true';
        } else {
            const errorText = await response.text();
            handleServerError(errorText);
        }
    } catch (error) {
        console.error('Ошибка при отправке формы:', error);
        showError('confirmPassword', 'Произошла ошибка при отправке формы', 'confirmPasswordError');
    }
});

// Вспомогательные функции
function showError(fieldId, message, errorContainerId = null) {
    const field = document.getElementById(fieldId);
    const errorElement = errorContainerId ?
        document.getElementById(errorContainerId) :
        document.getElementById(`${fieldId}Error`);

    field.classList.add('error-input');
    errorElement.textContent = message;
    errorElement.classList.add('show');
}

function resetErrors() {
    const errorElements = document.querySelectorAll('.error');
    const inputElements = document.querySelectorAll('.error-input');

    errorElements.forEach(el => {
        el.textContent = '';
        el.classList.remove('show');
    });

    inputElements.forEach(el => el.classList.remove('error-input'));
}

function handleServerError(errorText) {
    if (errorText.includes("Логин занят")) {
        showError('login', 'Пользователь с таким именем уже существует');
    } else if (errorText.includes("Email занят")) {
        showError('email', 'Email уже используется');
    } else {
        showError('confirmPassword', 'Ошибка сервера: ' + errorText, 'confirmPasswordError');
    }
}

// Обработчики событий для сброса ошибок при вводе
['login', 'email', 'password', 'confirmPassword'].forEach(fieldId => {
    document.getElementById(fieldId).addEventListener('input', function() {
        this.classList.remove('error-input');
        const errorId = fieldId === 'password' || fieldId === 'confirmPassword' ?
            'confirmPasswordError' : `${fieldId}Error`;
        document.getElementById(errorId).textContent = '';
    });
});