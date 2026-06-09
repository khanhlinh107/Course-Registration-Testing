document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('role', data.role);
            localStorage.setItem('fullName', data.fullName);
            
            if (data.role === 'student') {
                window.location.href = 'student-dashboard.html';
            } else {
                window.location.href = 'admin-dashboard.html';
            }
        } else {
            alert(data.message);
        }
    } catch (err) {
        alert('Lỗi kết nối API máy chủ!');
    }
});

function logout() {
    localStorage.clear();
    window.location.href = 'login.html';
}