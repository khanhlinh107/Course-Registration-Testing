const token = localStorage.getItem('token');
const toastContainer = document.getElementById('toastContainer');

function showMessage(message, type = 'success') {
    const messageBox = document.getElementById('timeslotMessage');
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

function clearMessage() {
    const messageBox = document.getElementById('timeslotMessage');
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
            headers: { Authorization: `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Không thể tải danh sách môn học.');
        const courses = await response.json();
        const select = document.getElementById('courseId');
        select.innerHTML = '<option value="">-- Chọn môn học --</option>';
        courses.forEach(course => {
            select.innerHTML += `<option value="${course.course_id}">${course.course_code} - ${course.course_name}</option>`;
        });
    } catch (error) {
        showMessage(error.message, 'error');
        showToast(error.message, 'error');
    }
}

async function loadTimeslots() {
    try {
        const response = await fetch('/api/timeslots', {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Không thể tải dữ liệu lịch học.');
        const timeslots = await response.json();
        const tableBody = document.getElementById('timeslotTableBody');
        const timeslotCount = document.getElementById('timeslotCount');
        tableBody.innerHTML = '';

        timeslots.forEach(slot => {
            tableBody.innerHTML += `
                <tr>
                    <td>${slot.course_code}</td>
                    <td>${slot.course_name}</td>
                    <td>${getDayName(slot.day_of_week)}</td>
                    <td>${slot.start_time.substring(0, 5)}</td>
                    <td>${slot.end_time.substring(0, 5)}</td>
                    <td>${slot.room}</td>
                    <td>
                        <button class="btn btn-danger" style="font-size:0.85rem; padding:8px 12px;" onclick="deleteTimeslot(${slot.timeslot_id})">Xóa</button>
                    </td>
                </tr>`;
        });

        timeslotCount.innerText = timeslots.length;
        loadScheduleStats(timeslots);
    } catch (error) {
        showMessage(error.message, 'error');
        showToast(error.message, 'error');
    }
}

function getDayName(day) {
    const days = {
        'Monday': 'Thứ 2',
        'Tuesday': 'Thứ 3',
        'Wednesday': 'Thứ 4',
        'Thursday': 'Thứ 5',
        'Friday': 'Thứ 6',
        'Saturday': 'Thứ 7',
        'Sunday': 'Chủ nhật'
    };
    return days[day] || day;
}

function loadScheduleStats(timeslots) {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const stats = {};
    
    days.forEach(day => {
        stats[day] = timeslots.filter(t => t.day_of_week === day);
    });

    const statsTableBody = document.getElementById('scheduleStatsTableBody');
    statsTableBody.innerHTML = '';
    
    Object.entries(stats).forEach(([day, slots]) => {
        if (slots.length > 0) {
            const details = slots.map(s => `${s.course_code} (${s.start_time.substring(0, 5)}-${s.end_time.substring(0, 5)})`).join(', ');
            statsTableBody.innerHTML += `
                <tr>
                    <td><strong>${getDayName(day)}</strong></td>
                    <td>${slots.length}</td>
                    <td>${details}</td>
                </tr>`;
        }
    });

    if (Object.values(stats).every(s => s.length === 0)) {
        statsTableBody.innerHTML = '<tr><td colspan="3" style="text-align:center; color:#64748b; padding:24px;">Chưa có lịch học nào.</td></tr>';
    }
}

async function createTimeslot(event) {
    event.preventDefault();
    clearMessage();

    const courseId = Number(document.getElementById('courseId').value);
    const dayOfWeek = document.getElementById('dayOfWeek').value.trim();
    const startTime = document.getElementById('startTime').value.trim();
    const endTime = document.getElementById('endTime').value.trim();
    const room = document.getElementById('room').value.trim();

    if (!courseId || !dayOfWeek || !startTime || !endTime || !room) {
        showMessage('Vui lòng điền đầy đủ thông tin lịch học.', 'error');
        return;
    }

    if (startTime >= endTime) {
        showMessage('Giờ bắt đầu phải nhỏ hơn giờ kết thúc.', 'error');
        return;
    }

    try {
        const response = await fetch('/api/timeslots', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ courseId, dayOfWeek, startTime, endTime, room })
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Không thể thêm lịch học.');
        }

        showMessage('Thêm lịch học thành công.', 'success');
        showToast('Thêm lịch học thành công.', 'success');
        document.getElementById('timeslotForm').reset();
        loadTimeslots();
    } catch (error) {
        showMessage(error.message || 'Lỗi khi thêm lịch học.', 'error');
        showToast(error.message || 'Lỗi khi thêm lịch học.', 'error');
    }
}

async function deleteTimeslot(timeslotId) {
    if (!confirm('Bạn có chắc chắn muốn xóa lịch học này?')) return;

    try {
        const response = await fetch(`/api/timeslots/${timeslotId}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` }
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Không thể xóa lịch học.');
        }

        showToast(data.message, 'success');
        loadTimeslots();
    } catch (error) {
        showToast(error.message || 'Lỗi khi xóa lịch học.', 'error');
    }
}

function initPage() {
    if (!token || localStorage.getItem('role') !== 'admin') {
        logout();
        return;
    }

    const timeslotForm = document.getElementById('timeslotForm');
    if (timeslotForm) {
        timeslotForm.addEventListener('submit', createTimeslot);
    }

    loadCourses();
    loadTimeslots();
}

document.addEventListener('DOMContentLoaded', initPage);
