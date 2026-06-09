const token = localStorage.getItem('token');
if (!token || localStorage.getItem('role') !== 'student') {
    window.location.href = 'login.html';
}

document.getElementById('studentName').innerText = localStorage.getItem('fullName');
const toastContainer = document.getElementById('toastContainer');

function showToast(message, type = 'success') {
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

function formatSchedule(timeslots) {
    if (!timeslots || timeslots.length === 0) return 'Chưa có lịch học';
    return timeslots.map(slot => `${slot.day_of_week}, ${slot.start_time}-${slot.end_time} (${slot.room})`).join('\n');
}

async function loadStudentDashboard() {
    try {
        const resReg = await fetch('/api/registrations/student-dashboard', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!resReg.ok) {
            const error = await resReg.json();
            throw new Error(error.message || 'Không thể tải dữ liệu sinh viên.');
        }
        const dataReg = await resReg.json();

        document.getElementById('totalCredits').innerText = dataReg.totalCredits;
        const registeredCount = dataReg.registeredCourses.length || 0;
        document.getElementById('registeredCourseCount').innerText = registeredCount;

        const regTable = document.getElementById('registeredCoursesTable');
        regTable.innerHTML = '';
        if (registeredCount === 0) {
            regTable.innerHTML = '<tr><td colspan="8" style="text-align:center; color:#64748b; padding:24px;">Bạn chưa đăng ký môn học nào.</td></tr>';
        } else {
            dataReg.registeredCourses.forEach(c => {
                const roomText = c.timeslots && c.timeslots.length ? c.timeslots.map(slot => slot.room).join(', ') : 'Chưa có';
                const dayText = c.timeslots && c.timeslots.length ? c.timeslots.map(slot => slot.day_of_week).join(', ') : 'Chưa có';
                const startText = c.timeslots && c.timeslots.length ? c.timeslots.map(slot => slot.start_time).join(', ') : 'Chưa có';
                const endText = c.timeslots && c.timeslots.length ? c.timeslots.map(slot => slot.end_time).join(', ') : 'Chưa có';
                regTable.innerHTML += `
                    <tr>
                        <td>${c.course_code}</td>
                        <td>${c.course_name}</td>
                        <td>${c.credits}</td>
                        <td>${roomText}</td>
                        <td>${dayText}</td>
                        <td>${startText}</td>
                        <td>${endText}</td>
                        <td><button class="btn btn-danger" onclick="dropCourse(${c.course_id})">Hủy đăng ký</button></td>
                    </tr>`;
            });
        }

        const resAll = await fetch('/api/courses', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!resAll.ok) {
            const error = await resAll.json();
            throw new Error(error.message || 'Không thể tải danh sách môn học.');
        }
        const courses = await resAll.json();
        const availableTable = document.getElementById('availableCoursesTable');
        availableTable.innerHTML = '';
        if (courses.length === 0) {
            availableTable.innerHTML = '<tr><td colspan="9" style="text-align:center; color:#64748b; padding:24px;">Chưa có môn học nào mở đăng ký.</td></tr>';
        } else {
            courses.forEach(c => {
                const roomText = c.timeslots && c.timeslots.length ? c.timeslots.map(slot => slot.room).join(', ') : 'Chưa có';
                const dayText = c.timeslots && c.timeslots.length ? c.timeslots.map(slot => slot.day_of_week).join(', ') : 'Chưa có';
                const startText = c.timeslots && c.timeslots.length ? c.timeslots.map(slot => slot.start_time).join(', ') : 'Chưa có';
                const endText = c.timeslots && c.timeslots.length ? c.timeslots.map(slot => slot.end_time).join(', ') : 'Chưa có';
                availableTable.innerHTML += `
                    <tr>
                        <td>${c.course_code}</td>
                        <td>${c.course_name}</td>
                        <td>${c.credits} Tín chỉ</td>
                        <td>${c.semester_name || c.semester_id}${c.academic_year ? ` (${c.academic_year})` : ''}</td>
                        <td>${roomText}</td>
                        <td>${dayText}</td>
                        <td>${startText}</td>
                        <td>${endText}</td>
                        <td><button class="btn btn-primary" onclick="registerCourse(${c.course_id})">Chọn Đăng Ký</button></td>
                    </tr>`;
            });
        }
    } catch (error) {
        showToast(error.message || 'Lỗi hệ thống, vui lòng thử lại sau.', 'error');
    }
}

async function registerCourse(courseId) {
    try {
        const response = await fetch('/api/registrations/register-course', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ courseId })
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Lỗi khi đăng ký môn học.');
        }
        showToast(data.message, 'success');
        loadStudentDashboard();
    } catch (error) {
        showToast(error.message || 'Lỗi khi đăng ký môn học.', 'error');
    }
}

async function dropCourse(courseId) {
    if (!confirm('Bạn có chắc chắn muốn hủy học phần này?')) return;
    try {
        const response = await fetch('/api/registrations/drop-course', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ courseId })
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Lỗi khi hủy đăng ký.');
        }
        showToast(data.message, 'success');
        loadStudentDashboard();
    } catch (error) {
        showToast(error.message || 'Lỗi khi hủy đăng ký.', 'error');
    }
}

function logout() {
    localStorage.clear();
    window.location.href = 'login.html';
}

loadStudentDashboard();