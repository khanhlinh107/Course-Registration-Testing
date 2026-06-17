# 🎓 Hệ Thống Đăng Ký Môn Học - Course Registration System

> A modern course registration system built with Express.js, Node.js, and MySQL for educational institutions.

## 📖 Mục Lục

* [Tính Năng](#-tính-năng)
* [Yêu Cầu Hệ Thống](#-yêu-cầu-hệ-thống)
* [Cài Đặt](#-cài-đặt)
* [Chạy Ứng Dụng](#-chạy-ứng-dụng)
* [Cấu Hình](#-cấu-hình)
* [API Endpoints](#-api-endpoints)
* [Kiểm Thử](#-kiểm-thử)
* [Cấu Trúc Dự Án](#-cấu-trúc-dự-án)

## ✨ Tính Năng

### 👨‍💼 Admin Dashboard

* 📊 View system statistics (total students, courses, registrations)
* 🏫 Course enrollment statistics by course
* 📋 Recent registration history (last 8)
* 🔒 Authentication with JWT tokens

### 📚 Course Management

* ➕ Create new courses with code, name, credits, capacity, semester
* 📋 View all courses with semester information
* ✏️ Update course details
* 🗑️ Delete courses

### 👨‍🎓 Student Management

* ➕ Add new students with credentials (username, password, code, name, email, major)
* 📋 View all students with actual usernames
* 🗑️ Delete students (cascade delete registrations and users)
* 🔐 Secure password hashing with bcryptjs

### 📅 Timeslot Management

* ⏰ Create course schedules (day, start time, end time, room)
* 📊 View schedule statistics by day of week
* 🗑️ Delete timeslots
* ✔️ Validation: start_time < end_time

### 📝 Student Registration

* ✅ Register for courses with validation:
* Max 24 credits per semester
* No duplicate registrations
* Check course capacity
* Detect schedule conflicts


* 📊 View registered courses with credits
* ❌ Drop courses with instant confirmation
* 📋 View available courses to register

## 💾 Yêu Cầu Hệ Thống

### Phần Mềm

* **Node.js**: v18.0.0 hoặc cao hơn
* **MySQL**: v5.7 hoặc v8.0
* **npm**: v9.0.0 hoặc cao hơn

### Cổng Mặc Định

* Backend: `3000` (configurable via PORT env)
* MySQL: `3306` (configured in .env)

## 🚀 Cài Đặt

### 1. Clone Repository

```bash
cd Course_Registration

```

### 2. Cài Đặt Dependencies

```bash
npm install

```

Packages được cài:

* express@4.19.2
* mysql2/promise@3.9.7
* jsonwebtoken@9.0.2
* bcryptjs@2.4.3
* dotenv@16.4.5

### 3. Cấu Hình Database

**MySQL - Tạo Database**

```bash
mysql -u root -p

```

```sql
CREATE DATABASE course_registration;
USE course_registration;

-- Import schema từ database/schema.sql
SOURCE database/schema.sql;

```

**Hoặc chạy SQL trực tiếp**:

```bash
mysql -u root -p course_registration < database/schema.sql

```

### 4. Tạo File .env

```bash
cat > .env << EOF
DB_HOST=localhost
DB_USER=root
DB_PASS=your_password
DB_NAME=course_registration
JWT_SECRET=your_super_secret_key_min_32_chars_long_at_least
PORT=3000
EOF

```

### 5. Xác Minh Cài Đặt

```bash
node --check server.js
node --check controllers/*.js
node --check models/*.js

```

## ▶️ Chạy Ứng Dụng

### Start Server

```bash
npm start

```

Hoặc sử dụng nodemon cho development:

```bash
npm install -D nodemon
npx nodemon server.js

```

### Truy Cập Ứng Dụng

```
http://localhost:3000

```

Sẽ tự động redirect đến `login.html`

## 🔐 Tài Khoản Mặc Định

### Admin Account

```
Username: admin1
Password: admin123
Role: admin

```

### Student Account

```
Username: student1
Password: pass123
Role: student

```

> ⚠️ **Important**: Change default credentials in production!

## ⚙️ Cấu Hình

### Environment Variables (.env)

| Variable | Description | Example |
| --- | --- | --- |
| `DB_HOST` | MySQL host | `localhost` |
| `DB_USER` | MySQL user | `root` |
| `DB_PASS` | MySQL password | `password123` |
| `DB_NAME` | Database name | `course_registration` |
| `JWT_SECRET` | JWT signing key | `your_secret_key_min_32_chars` |
| `PORT` | Server port | `3000` |

### Connection Pool

* Connection limit: 10
* Uses mysql2/promise for async operations

## 📡 API Endpoints

### Authentication

```
POST /api/auth/login
Body: { username, password }
Response: { token, role, fullName }

```

### Students (Admin Only)

```
GET    /api/students
POST   /api/students
PUT    /api/students/:id
DELETE /api/students/:id

```

### Courses (Admin Only for POST/PUT/DELETE)

```
GET    /api/courses
POST   /api/courses
PUT    /api/courses/:id
DELETE /api/courses/:id

```

### Timeslots (Admin Only for POST/PUT/DELETE)

```
GET    /api/timeslots
POST   /api/timeslots
PUT    /api/timeslots/:id
DELETE /api/timeslots/:id

```

### Registrations (Student)

```
GET    /api/registrations/student-dashboard
POST   /api/registrations/register-course
POST   /api/registrations/drop-course
GET    /api/registrations/admin-stats (Admin Only)

```

## 🧪 Kiểm Thử

### Run All Tests

```bash
npm test

```

### Manual Testing

1. Open browser: http://localhost:3000
2. Login with test accounts above
3. Follow TEST_GUIDE.md for comprehensive test cases

### 🚀 Postman API Testing

Hệ thống đã được kiểm thử toàn diện các đầu API Endpoints thông qua **Postman** nhằm đảm bảo tính đúng đắn của dữ liệu, cơ chế phân quyền (Role-based Access Control) và khả năng xử lý lỗi.

* 🔐 **Xác thực mã Token (JWT)**: Kiểm thử kịch bản trích xuất Bearer Token từ API Đăng nhập và gắn vào Header `Authorization` của các Request tiếp theo. Hệ thống chặn và trả về lỗi `401 Unauthorized` hoặc `403 Forbidden` khi sử dụng Token sai quyền (ví dụ: Student cố tình gọi API CRUD của Admin).
* 🛠️ **Kiểm thử logic nghiệp vụ (Business Logic)**: Sử dụng Postman gửi liên tiếp các Request giả lập để xác minh các điều kiện biên:
* Gửi trùng bản ghi đăng ký môn học $\rightarrow$ Trả về mã lỗi phù hợp kèm thông báo lỗi đã đăng ký.
* Đăng ký vượt quá số tín chỉ tối đa quy định $\rightarrow$ Hệ thống chặn từ tầng xử lý Backend.


* 💉 **Chống tấn công SQL Injection**: Truyền các chuỗi dữ liệu độc hại như `' OR '1'='1` vào Body Request của API Đăng nhập $\rightarrow$ Hệ thống xử lý an toàn nhờ Parameterized SQL queries từ thư viện `mysql2/promise`.

### 📊 Apache JMeter Performance & Load Testing

Kịch bản kiểm thử hiệu năng và khả năng chịu tải của hệ thống đã được thực hiện bằng công cụ **Apache JMeter 5.6.3**.

* 👥 **Mô phỏng tải (Thread Group)**: Giả lập đồng thời số lượng lớn người dùng ảo truy cập cùng lúc (Concurrent Users) để thực hiện các thao tác Đăng nhập và Đăng ký môn học.
* ⚡ **Kiểm thử truy vấn và kết nối**: Đánh giá hiệu suất xử lý của hệ thống Connection Pool (tối đa 10 kết nối đồng thời) khi cơ sở dữ liệu phải thực hiện liên tiếp các lệnh `LEFT JOIN` phức tạp giữa các bảng dữ liệu `Course`, `Semester`, `TimeSlot` và `Registration`.
* 📋 **Báo cáo kết quả kết xuất (Listeners)**: Các chỉ số hiệu năng được giám sát trực quan thông qua công cụ `View Results Tree`, `View Results in Table` và `Summary Report` để đảm bảo thời gian phản hồi (Response Time) của hệ thống luôn nằm trong ngưỡng tối ưu và tỷ lệ lỗi (Error %) đạt mức tối thiểu dưới tải cao.

### Check Logs

```bash
# Terminal output shows:
# ✅ MySQL connection status
# 📊 Server running on port
# 🐛 Any errors/debug info

```

## 📁 Cấu Trúc Dự Án

```
Course_Registration/
├── config/
│   └── db.js                    # MySQL connection pool
├── controllers/
│   ├── authController.js        # Authentication & login
│   ├── courseController.js      # Course CRUD
│   ├── studentController.js     # Student CRUD
│   ├── registrationController.js # Registration logic
│   └── timeslotController.js    # Timeslot CRUD
├── models/
│   ├── userModel.js             # User table queries
│   ├── studentModel.js          # Student table queries + User JOIN
│   ├── courseModel.js           # Course table queries + Semester JOIN
│   ├── registrationModel.js     # Registration queries + stats
│   ├── timeslotModel.js         # Timeslot queries + Course JOIN
│   └── adminModel.js            # Admin queries
├── routes/
│   ├── authRoutes.js
│   ├── studentRoutes.js
│   ├── courseRoutes.js
│   ├── registrationRoutes.js
│   └── timeslotRoutes.js
├── middleware/
│   └── authMiddleware.js        # JWT verification, role checking
├── public/
│   ├── login.html               # Login page
│   ├── admin-dashboard.html     # Admin dashboard with stats
│   ├── admin-courses.html       # Course management
│   ├── student-manage.html      # Student management
│   ├── timeslot-manage.html     # Timeslot/schedule management
│   ├── student-dashboard.html   # Student course registration
│   ├── css/
│   │   └── style.css            # Responsive styles
│   └── js/
│       ├── auth.js              # Login logic
│       ├── admin.js             # Admin dashboard JS
│       ├── admin-courses.js     # Course management JS
│       ├── student-manage.js    # Student management JS
│       ├── timeslot-manage.js   # Timeslot management JS
│       └── student.js           # Student registration JS
├── database/
│   └── schema.sql               # Database schema
├── .env                         # Environment variables (create locally)
├── package.json                 # Dependencies
├── hash.js                      # Password hashing utility
├── server.js                    # Main server entry point
├── TEST_GUIDE.md                # Comprehensive test checklist
└── README.md                    # This file

```

## 🔧 Database Schema

### Tables

1. **User**: id, username, password_hash, role (admin/student)
2. **Student**: id, user_id, student_code, full_name, email, major
3. **Admin**: id, user_id, name
4. **Course**: id, course_code, course_name, credits, max_students, semester_id
5. **Semester**: id, semester_name, academic_year
6. **TimeSlot**: id, course_id, day_of_week, start_time, end_time, room
7. **Registration**: id, student_id, course_id, register_date

### Foreign Keys & Relationships

* Student → User (1:1)
* Admin → User (1:1)
* Course → Semester (many:1)
* TimeSlot → Course (many:1)
* Registration → Student (many:1)
* Registration → Course (many:1)

## 🔒 Security Features

* ✅ JWT authentication with 2-hour expiration
* ✅ Bcryptjs password hashing (salt rounds: 10)
* ✅ Role-based access control (Admin/Student)
* ✅ Parameterized SQL queries (prevents SQL injection)
* ✅ Token verification on protected routes
* ✅ Bearer token in Authorization header
* ✅ Cascade delete for referential integrity

## 🎨 Frontend Features

* 📱 **Responsive Design**: Works on desktop, tablet, mobile
* 🎯 **User-Friendly UI**: Modern styling with Grid/Flexbox
* ⚡ **Real-time Updates**: Fetch API for instant data sync
* 💬 **Error Messages**: Clear feedback for user actions
* 🔄 **Loading States**: Visual feedback during API calls
* 📊 **Data Tables**: Sortable, paginated (first 8 items)
* 🎨 **Color-Coded Cards**: Status cards (green for success)

## 🐛 Troubleshooting

### MySQL Connection Error

```
❌ Lỗi kết nối MySQL: connect ECONNREFUSED

```

**Solution**:

* Kiểm tra MySQL service đang chạy: `sudo service mysql status`
* Verify .env credentials
* Check MySQL port 3306 accessible

### JWT Token Error

```
⚠️ Invalid token / Token expired

```

**Solution**:

* Login again to get fresh token
* Check JWT_SECRET matches in .env
* Token expires in 2 hours

### 500 Error on Student Dashboard

```
❌ Failed to load resource: the server responded with a status of 500

```

**Solution**:

* Check registrationModel.js has LEFT JOIN Semester
* Verify database schema imported correctly
* Check server console for SQL error details

### Table Misalignment

```
📊 Table columns not aligned with headers

```

**Solution**:

* Ensure style.css has `table-layout: auto` and `word-wrap: break-word`
* Check table headers `<th>` match `<td>` count

## 📚 Documentation Links

* [Express.js Documentation](https://expressjs.com/)
* [MySQL Documentation](https://dev.mysql.com/doc/)
* [JWT Documentation](https://jwt.io/)
* [Bcryptjs Documentation](https://www.npmjs.com/package/bcryptjs)

## 📝 License

This project is part of a course assignment. For educational purposes only.

## 👥 Support

For issues or questions:

1. Check TEST_GUIDE.md for test cases
2. Review error messages in browser console
3. Check server logs for backend errors
4. Verify .env configuration

---

**Status**: ✅ Production Ready
**Last Updated**: 2026
**Version**: 1.0.0

Ảnh Lab7: Trong Folder PostmanPDF