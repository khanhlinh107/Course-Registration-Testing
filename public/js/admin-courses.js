const token = localStorage.getItem('token');
const toastContainer = document.getElementById('toastContainer');

function showCourseMessage(message, type = 'success') {
    const messageBox = document.getElementById('courseMessage');
    if (!messageBox) return;
    messageBox.textContent = message;
    messageBox.className = `message-box ${type}`;
    messageBox.style.display = 'block';
}

function showToast(message, type = 'success') {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = `toast-message ${type}`;
    toast.innerText = message;
    if (toastContainer.children.length >= 4) {
        toastContainer.removeChild(toastContainer.firstElementChild);
    }
    toastContainer.appendChild(toast);
    setTimeout(() => {
        toast.style.animation = 'toastOut 0.3s forwards';
        toast.addEventListener('animationend', () => toast.remove());
    }, 5000);
}

function clearCourseMessage() {
    const messageBox = document.getElementById('courseMessage');
    if (!messageBox) return;
    messageBox.style.display = 'none';
}

function logout() {
    localStorage.clear();
    window.location.href = 'login.html';
}

async function loadCourses() {
    try {
        const response = await fetch('/api/courses', {
            headers: { Authorization: `Bearer ${token}` },
            cache: 'no-store'
        });

        if (!response.ok) {
            throw new Error('Không thể tải dữ liệu môn học. Vui lòng đăng nhập lại.');
        }

        const courses = await response.json();
        const tableBody = document.getElementById('courseTableBody');
        const courseCount = document.getElementById('courseCount');
        tableBody.innerHTML = '';

        courses.forEach(course => {
            tableBody.innerHTML += `
                <tr>
                    <td>${course.course_code}</td>
                    <td>${course.course_name}</td>
                    <td>${course.credits}</td>
                    <td>${course.max_students}</td>
                    <td>${course.semester_name || course.semester_id}</td>
                    <td><button class="btn btn-danger" style="font-size:0.85rem; padding:8px 12px;" onclick="deleteCourse(${course.course_id})">Xóa</button></td>
                </tr>`;
        });

        courseCount.innerText = courses.length;
    } catch (error) {
        showCourseMessage(error.message || 'Lỗi hệ thống khi tải môn học.', 'error');
    }
}

async function createCourse(event) {
    event.preventDefault();
    clearCourseMessage();

    const courseCode = document.getElementById('courseCode').value.trim();
    const courseName = document.getElementById('courseName').value.trim();
    const credits = Number(document.getElementById('credits').value);
    const maxStudents = Number(document.getElementById('maxStudents').value);
    const semesterId = Number(document.getElementById('semesterId').value);

    if (!courseCode || !courseName || !credits || !maxStudents || !semesterId) {
        showCourseMessage('Vui lòng điền đầy đủ thông tin môn học.', 'error');
        return;
    }

    try {
        const response = await fetch('/api/courses', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ courseCode, courseName, credits, maxStudents, semesterId })
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Không thể thêm môn học.');
        }

        showCourseMessage('Thêm môn học thành công.', 'success');
        showToast('Thêm môn học thành công.', 'success');
        document.getElementById('courseForm').reset();
        loadCourses();
    } catch (error) {
        showCourseMessage(error.message || 'Lỗi khi thêm môn học.', 'error');
        showToast(error.message || 'Lỗi khi thêm môn học.', 'error');
    }
}

async function deleteCourse(courseId) {
    if (!confirm('Bạn có chắc chắn muốn xóa môn học này?')) return;
    try {
        const response = await fetch(`/api/courses/${courseId}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` }
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Không thể xóa môn học.');
        }
        showCourseMessage('Xóa môn học thành công.', 'success');
        showToast('Xóa môn học thành công.', 'success');
        loadCourses();
    } catch (error) {
        showCourseMessage(error.message || 'Lỗi khi xóa môn học.', 'error');
        showToast(error.message || 'Lỗi khi xóa môn học.', 'error');
    }
}

function initPage() {
    if (!token || localStorage.getItem('role') !== 'admin') {
        logout();
        return;
    }

    const courseForm = document.getElementById('courseForm');
    if (courseForm) {
        courseForm.addEventListener('submit', createCourse);
    }

    loadCourses();
}

document.addEventListener('DOMContentLoaded', initPage);
