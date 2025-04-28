document.getElementById('registerForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const login = document.getElementById('login').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
        alert('Пароли не совпадают!');
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
        alert('Регистрация успешна!');
    } else {
        const errorText = await response.text();
        alert('Ошибка: ' + errorText);
    }
});