# 🧪 Hướng Dẫn Kiểm Thử Hệ Thống Đăng Ký Môn Học

## 📋 Danh Sách Kiểm Thử Toàn Diện

### 1️⃣ KIỂM THỬ AUTHENTICATION (Đăng Nhập)
- [ ] Truy cập http://localhost:3000 → Redirect về login.html
- [ ] Nhập username/password sai → Hiển thị lỗi
- [ ] Đăng nhập admin: username=`admin1`, password=`admin123`
- [ ] Kiểm tra adminName hiển thị trong navbar
- [ ] Đăng nhập student: username=`student1`, password=`pass123`
- [ ] Verify token được lưu trong localStorage

### 2️⃣ KIỂM THỬ ADMIN DASHBOARD (Bảng Điều Khiển)
**Đăng nhập với admin1**
- [ ] Trang tải thành công, không lỗi 500
- [ ] Hiển thị 3 stat cards: Tổng số sinh viên, môn học, đăng ký
- [ ] Bảng "Tình trạng sĩ số đăng ký" hiển thị danh sách các môn với sĩ số
- [ ] Bảng "Gần đây - Đăng ký mới nhất" hiển thị 8 đăng ký gần nhất
- [ ] Sidebar navigation: Bảng điều khiển, Quản lý Môn học, Quản lý Sinh viên, Quản lý Lịch học
- [ ] Click từng link sidebar → Điều hướng thành công

### 3️⃣ KIỂM THỬ QUẢN LÝ MÔN HỌC
**Đăng nhập admin1 → Click "Quản lý Môn học"**
- [ ] Trang tải thành công, hiển thị form tạo môn
- [ ] Form fields: Mã môn, Tên môn, Tín chỉ, Sĩ số tối đa, Học kỳ (dropdown)
- [ ] Table hiển thị tất cả các môn học hiện có
- [ ] Tạo môn học mới (cấp dữ liệu hợp lệ)
  - [ ] Nhập "IT301" vào "Mã môn"
  - [ ] Nhập "Lập trình Web" vào "Tên môn"
  - [ ] Nhập "3" vào "Tín chỉ"
  - [ ] Nhập "30" vào "Sĩ số tối đa"
  - [ ] Chọn "Semester 1" từ dropdown
  - [ ] Click "Thêm Môn học" → Hiển thị thông báo success
  - [ ] Verify môn mới xuất hiện trong bảng
- [ ] Kiểm thử form validation: Submit form trống → Thông báo error
- [ ] Đếm số môn học: "Tổng số: X môn"
- [ ] Sidebar navigation hoạt động

### 4️⃣ KIỂM THỬ QUẢN LÝ SINH VIÊN
**Đăng nhập admin1 → Click "Quản lý Sinh viên"**
- [ ] Trang tải thành công, hiển thị form tạo sinh viên
- [ ] Form fields (2 cột): Username, Password, Mã SV, Họ tên, Email, Chuyên ngành
- [ ] Table hiển thị danh sách sinh viên với: Mã SV, Họ tên, Email, Chuyên ngành, Tên đăng nhập, button Xóa
- [ ] **[KIỂM THỬ FIX]** Username column hiển thị tên thực (không phải N/A)
- [ ] Tạo sinh viên mới:
  - [ ] Nhập username "newstudent", password "pass123"
  - [ ] Nhập "SV003", "Nguyễn Văn C", "c@example.com", "Công nghệ thông tin"
  - [ ] Click "Thêm Sinh viên" → Success message
  - [ ] Verify sinh viên mới xuất hiện trong bảng
- [ ] Xóa sinh viên: Click "Xóa" → Confirm → Sinh viên bị xóa
- [ ] Kiểm thử form validation: Submit form trống → Error
- [ ] Đếm: "Tổng số: X sinh viên"
- [ ] Sidebar navigation hoạt động
- [ ] **[ADMIN-ONLY]** Logout → Login as student1 → Thử truy cập student-manage.html → Redirect login

### 5️⃣ KIỂM THỬ QUẢN LÝ LỊCH HỌC
**Đăng nhập admin1 → Click "Quản lý Lịch học"**
- [ ] Trang tải thành công
- [ ] Form fields: Môn học (dropdown), Thứ (select), Giờ bắt đầu (time), Giờ kết thúc (time), Phòng học
- [ ] Dropdown "Môn học" load danh sách tất cả các môn
- [ ] Table 1: Hiển thị tất cả timeslot với: Mã môn, Tên môn, Thứ, Giờ bắt đầu, Giờ kết thúc, Phòng
- [ ] Table 2: Thống kê lịch học theo ngày (Thứ, Số lớp, Danh sách các môn)
- [ ] Tạo lịch học mới:
  - [ ] Chọn một môn từ dropdown
  - [ ] Chọn "Thứ 2" từ select
  - [ ] Nhập "08:00" vào giờ bắt đầu
  - [ ] Nhập "10:00" vào giờ kết thúc
  - [ ] Nhập "A101" vào phòng
  - [ ] Click "Thêm Lịch học" → Success message
  - [ ] Verify lịch mới xuất hiện trong Table 1
  - [ ] Verify thống kê Table 2 cập nhật (Thứ 2 tăng count)
- [ ] Validate: Nhập giờ bắt đầu >= giờ kết thúc → Error "Giờ bắt đầu phải nhỏ hơn giờ kết thúc"
- [ ] Xóa lịch học: Click "Xóa" → Confirm → Lịch bị xóa → Table cập nhật
- [ ] **[ADMIN-ONLY]** Logout → Thử access timeslot-manage.html → Redirect login

### 6️⃣ KIỂM THỬ STUDENT DASHBOARD (Học sinh)
**Đăng nhập student1**
- [ ] Trang tải thành công, không lỗi 500
- [ ] **[FIXED BUG CHECK]** Bảng không bị lệch, cột thẳng hàng với header
- [ ] Hiển thị 2 stat cards: Tổng tín chỉ (computed), Số môn đã đăng ký
- [ ] Bảng "Các môn học đang mở": Mã môn, Tên môn, Tín chỉ, Học kỳ, Sĩ số tối đa, button "Chọn Đăng Ký"
- [ ] Bảng "Các môn đã đăng ký": Mã môn, Tên môn, Tín chỉ, button "Hủy đăng ký"
- [ ] **[TABLE ALIGNMENT CHECK]** Verify table text-align left, padding consistent, no overflow
- [ ] Đăng ký môn học:
  - [ ] Click "Chọn Đăng Ký" trên một môn
  - [ ] Success message: "Đã đăng ký môn học thành công!"
  - [ ] Môn được chuyển sang bảng "Các môn đã đăng ký"
  - [ ] Tổng tín chỉ cập nhật
  - [ ] Số môn cập nhật
- [ ] Validate business rules:
  - [ ] Đăng ký cùng môn lần 2 → Error "Đã đăng ký môn này rồi"
  - [ ] Đăng ký vượt quá 24 tín chỉ → Error "Không thể vượt quá 24 tín chỉ"
  - [ ] Đăng ký môn có xung đột lịch → Error "Có xung đột với lịch học hiện tại"
  - [ ] Đăng ký môn đầy sĩ số → Error "Lớp học đã đầy"
- [ ] Hủy đăng ký: Click "Hủy đăng ký" → Confirm → Môn bị xóa khỏi bảng → Stats cập nhật
- [ ] Logout thành công

### 7️⃣ KIỂM THỬ API ENDPOINTS (POSTMAN / CURL)

#### Authentication
```bash
POST /api/auth/login
Body: { "username": "admin1", "password": "admin123" }
Expected: { "token": "...", "role": "admin", "fullName": "..." }
```

#### Students CRUD (Require Admin Token)
```bash
GET /api/students
Authorization: Bearer <admin_token>
Expected: Array of students with username field

POST /api/students
Body: { username, password, studentCode, fullName, email, major }

DELETE /api/students/:id
```

#### Courses CRUD (Require Admin Token)
```bash
GET /api/courses
Expected: Array of courses with semester_name

POST /api/courses
Body: { courseCode, courseName, credits, maxStudents, semesterId }
```

#### Timeslots CRUD (Require Admin Token)
```bash
GET /api/timeslots
Expected: Array of timeslots with course_code and course_name

POST /api/timeslots
Body: { courseId, dayOfWeek, startTime, endTime, room }

DELETE /api/timeslots/:id
```

#### Registration Endpoints (Require Student Token)
```bash
GET /api/registrations/student-dashboard
Expected: { registered, available, studentInfo }

POST /api/registrations/register-course
Body: { courseId }

POST /api/registrations/drop-course
Body: { courseId }
```

#### Admin Stats (Require Admin Token)
```bash
GET /api/registrations/admin-stats
Expected: { stats: { totalStudents, totalCourses, totalRegistrations }, 
            courseStats: [...], 
            allRegistrations: [...] }
```

### 8️⃣ KIỂM THỬ ERROR HANDLING

- [ ] **500 Error trên Student Dashboard**: Load thành công (không 500)
- [ ] **Table Alignment**: Bảng hiển thị thẳng, không bị lệch
- [ ] Expired Token: Logout → Wait → Try action → Redirect login
- [ ] Network Error: Browser DevTools → Offline → Try action → Show error message
- [ ] Invalid Requests: Missing required fields → 400/500 error response
- [ ] Authorization: Student token + Admin endpoint → 403 Forbidden
- [ ] SQL Injection: Input `' OR '1'='1` → Không có lỗi (parameterized queries)

### 9️⃣ KIỂM THỬ RESPONSIVE DESIGN

- [ ] Desktop (1920x1080): Layout normal, tất cả elements hiển thị
- [ ] Tablet (768x1024): Sidebar responsive, table scrollable
- [ ] Mobile (375x667): Hamburger menu (nếu có), vertical layout
- [ ] Check breakpoints: 980px, 640px

### 🔟 KIỂM THỬ DATA SYNCHRONIZATION (Đồng Bộ Dữ Liệu)

1. **Tạo môn học IT301 từ Admin → Student Dashboard**
   - [ ] Admin tạo môn → Save
   - [ ] Student reload page → IT301 xuất hiện trong "Các môn học đang mở"

2. **Tạo sinh viên → Login → Đăng ký môn**
   - [ ] Admin tạo newstudent2
   - [ ] Login newstudent2 → Student dashboard tải
   - [ ] Đăng ký một môn
   - [ ] Admin dashboard → Stats update, courseStats.registered_count tăng

3. **Tạo lịch học → Student xem**
   - [ ] Admin tạo lịch học cho IT301 vào Thứ 3 08:00-10:00
   - [ ] Đăng ký IT301 + IT302 trùng Thứ 3 08:00-09:30
   - [ ] Đăng ký IT301 success, IT302 → Error "Xung đột lịch"

4. **Xóa sinh viên → Kiểm tra cascade**
   - [ ] Admin xóa newstudent2
   - [ ] Verify: User bị xóa, Registration bị xóa, Student bị xóa
   - [ ] Admin stats.totalStudents, totalRegistrations giảm

5. **Xóa lịch học → Timeslot statistics update**
   - [ ] Admin xóa lịch Thứ 3 của IT301
   - [ ] Table 2 "Thống kê lịch" → Thứ 3 count giảm hoặc không có IT301

## 📊 Tiêu Chí Đạt Yêu Cầu

- ✅ **0 Lỗi Syntax**: Không lỗi JavaScript/HTML/CSS
- ✅ **0 Lỗi 500**: Tất cả endpoints trả về dữ liệu hoặc error message rõ ràng
- ✅ **0 Lỗi Bảng**: Tables hiển thị thẳng, không bị lệch
- ✅ **Đồng Bộ Dữ Liệu**: Admin action → Student xem được ngay
- ✅ **Bảo Mật**: Admin/Student endpoints được bảo vệ bằng token + role
- ✅ **Navigation**: Sidebar hoạt động trên tất cả admin pages
- ✅ **Business Rules**: Validate 24-credit, capacity, conflict, duplicate checks
- ✅ **User Experience**: Message boxes, error handling, form validation

## 🛠️ Troubleshooting

**Lỗi kết nối MySQL**:
- Kiểm tra .env: DB_HOST, DB_USER, DB_PASS, DB_NAME
- MySQL service đang chạy?
- Database "course_registration" tồn tại?

**Lỗi token expired**:
- Check JWT_SECRET trong .env
- Verify bearer token format: "Authorization: Bearer <token>"

**Bảng không load data**:
- Check browser console: Network tab, find request to API
- Response status 401? Token invalid/expired
- Response status 500? Backend error - check server console

**Sidebar không điều hướng**:
- Verify href paths: admin-dashboard.html, admin-courses.html, student-manage.html, timeslot-manage.html
- Check localStorage: role === 'admin' để hiển thị admin pages

---

**Last Updated**: 2026
**Status**: Ready for Testing ✅
