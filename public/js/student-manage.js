const token = localStorage.getItem('token');

function showMessage(message, type = 'success') {
    const messageBox = document.getElementById('studentMessage');
    if (!messageBox) return;
    messageBox.textContent = message;
    messageBox.className = `message-box ${type}`;
    messageBox.style.display = 'block';
}

function clearMessage() {
    const messageBox = document.getElementById('studentMessage');
    if (!messageBox) return;
    messageBox.style.display = 'none';
}

function logout() {
    localStorage.clear();
    window.location.href = 'login.html';
}

async function loadStudents() {
    try {
        const response = await fetch('/api/students', {
            headers: { Authorization: `Bearer ${token}` },
            cache: 'no-store'
        });

        if (!response.ok) {
            throw new Error('Không thể tải danh sách sinh viên.');
        }

        const students = await response.json();
        const tableBody = document.getElementById('studentTableBody');
        const studentCount = document.getElementById('studentCount');
        tableBody.innerHTML = '';

        students.forEach(student => {
            tableBody.innerHTML += `
                <tr>
                    <td>${student.student_code}</td>
                    <td>${student.full_name}</td>
                    <td>${student.email}</td>
                    <td>${student.major}</td>
                    <td>${student.username || 'N/A'}</td>
                    <td>
                        <button class="btn btn-danger" style="font-size:0.85rem; padding:8px 12px;" onclick="deleteStudent(${student.student_id})">Xóa</button>
                    </td>
                </tr>`;
        });

        studentCount.innerText = students.length;
    } catch (error) {
        showMessage(error.message || 'Lỗi hệ thống khi tải dữ liệu.', 'error');
    }
}

async function createStudent(event) {
    event.preventDefault();
    clearMessage();

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const studentCode = document.getElementById('studentCode').value.trim();
    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim();
    const major = document.getElementById('major').value.trim();

    if (!username || !password || !studentCode || !fullName || !email || !major) {
        showMessage('Vui lòng điền đầy đủ thông tin sinh viên.', 'error');
        return;
    }

    try {
        const response = await fetch('/api/students', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ username, password, studentCode, fullName, email, major })
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Không thể thêm sinh viên.');
        }

        showMessage('Thêm sinh viên thành công.', 'success');
        document.getElementById('studentForm').reset();
        loadStudents();
    } catch (error) {
        showMessage(error.message || 'Lỗi khi thêm sinh viên.', 'error');
    }
}

async function deleteStudent(studentId) {
    if (!confirm('Bạn có chắc chắn muốn xóa sinh viên này? Tất cả dữ liệu đăng ký sẽ bị xóa.')) return;

    try {
        const response = await fetch(`/api/students/${studentId}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` }
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Không thể xóa sinh viên.');
        }

        alert(data.message);
        loadStudents();
    } catch (error) {
        alert(error.message || 'Lỗi khi xóa sinh viên.');
    }
}

function initPage() {
    if (!token || localStorage.getItem('role') !== 'admin') {
        logout();
        return;
    }

    const studentForm = document.getElementById('studentForm');
    if (studentForm) {
        studentForm.addEventListener('submit', createStudent);
    }

    loadStudents();
}

document.addEventListener('DOMContentLoaded', initPage);
