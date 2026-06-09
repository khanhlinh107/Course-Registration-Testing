const token = localStorage.getItem('token');
if (!token || localStorage.getItem('role') !== 'admin') {
    window.location.href = 'login.html';
}

document.getElementById('adminName').innerText = localStorage.getItem('fullName');

async function loadAdminDashboard() {
    try {
        const response = await fetch('/api/registrations/admin-stats', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) {
            window.location.href = 'login.html';
            return;
        }

        const data = await response.json();
        document.getElementById('statStudents').innerText = data.stats.totalStudents;
        document.getElementById('statCourses').innerText = data.stats.totalCourses;
        document.getElementById('statRegistrations').innerText = data.stats.totalRegistrations;

        const courseStatsTable = document.getElementById('courseStatsTable');
        courseStatsTable.innerHTML = '';
        data.courseStats.forEach(cs => {
            courseStatsTable.innerHTML += `
                <tr>
                    <td>${cs.course_code}</td>
                    <td>${cs.course_name}</td>
                    <td><strong>${cs.registered_count}</strong> sinh viên</td>
                    <td>${cs.max_students}</td>
                </tr>`;
        });

        const recentTable = document.getElementById('recentRegistrationsTable');
        if (recentTable) {
            recentTable.innerHTML = '';
            (data.allRegistrations || []).slice(0, 8).forEach(reg => {
                recentTable.innerHTML += `
                    <tr>
                        <td>${new Date(reg.register_date).toLocaleDateString('vi-VN')}</td>
                        <td>${reg.student_code}</td>
                        <td>${reg.full_name}</td>
                        <td>${reg.course_code}</td>
                        <td>${reg.course_name}</td>
                    </tr>`;
            });
            if ((data.allRegistrations || []).length === 0) {
                recentTable.innerHTML = '<tr><td colspan="5" style="text-align:center; color:#64748b; padding:24px;">Chưa có đăng ký mới.</td></tr>';
            }
        }

        const canceledTable = document.getElementById('canceledRegistrationsTable');
        if (canceledTable) {
            canceledTable.innerHTML = '';
            (data.canceledRegistrations || []).slice(0, 8).forEach(reg => {
                canceledTable.innerHTML += `
                    <tr>
                        <td>${new Date(reg.register_date).toLocaleDateString('vi-VN')}</td>
                        <td>${reg.student_code}</td>
                        <td>${reg.full_name}</td>
                        <td>${reg.course_code}</td>
                        <td>${reg.course_name}</td>
                    </tr>`;
            });
            if ((data.canceledRegistrations || []).length === 0) {
                canceledTable.innerHTML = '<tr><td colspan="5" style="text-align:center; color:#64748b; padding:24px;">Chưa có hủy gần đây.</td></tr>';
            }
        }
    } catch (error) {
        console.error('Lỗi khi tải dashboard admin:', error);
        window.location.href = 'login.html';
    }
}

function logout() {
    localStorage.clear();
    window.location.href = 'login.html';
}

loadAdminDashboard();