# ⚡ Quick Start Guide - Hệ Thống Đăng Ký Môn Học

> Bắt đầu chạy hệ thống trong 5 phút! 🚀

## 🔧 Điều Kiện Tiên Quyết

- ✅ Node.js 18+ installed
- ✅ MySQL 5.7+ running
- ✅ npm 9+ available

## 📝 5 Bước Cài Đặt

### 1️⃣ Cài Đặt Dependencies (1 phút)
```bash
cd Course_Registration
npm install
```

### 2️⃣ Tạo Database (1 phút)
```bash
mysql -u root -p course_registration < database/schema.sql
```

### 3️⃣ Tạo File .env (30 giây)
```bash
cat > .env << EOF
DB_HOST=localhost
DB_USER=root
DB_PASS=root
DB_NAME=course_registration
JWT_SECRET=mysupersecretsecret1234567890abcdef
PORT=3000
EOF
```

### 4️⃣ Chạy Server (30 giây)
```bash
npm start
```

**Expected Output**:
```
✅ Kết nối MySQL thành công!
===========================================================
 SERVER ĐANG CHẠY ỔN ĐỊNH TRÊN CỔNG: http://localhost:3000
 PHỤC VỤ ĐỒ ÁN KIỂM THỬ: READY FOR POSTMAN & JEST & SELENIUM
===========================================================
```

### 5️⃣ Truy Cập Ứng Dụng (30 giây)
```
Open: http://localhost:3000
```

## 🔐 Đăng Nhập Ngay

### Admin Account
```
Username: admin1
Password: admin123
```

### Student Account
```
Username: student1
Password: pass123
```

---

## 📱 Các Trang Admin

| Trang | URL | Chức Năng |
|-------|-----|----------|
| Dashboard | /admin-dashboard.html | Thống kê, stats |
| Quản lý Môn | /admin-courses.html | CRUD courses |
| Quản lý SV | /student-manage.html | CRUD students |
| Quản lý Lịch | /timeslot-manage.html | CRUD timeslots |

## 📚 Các Trang Student

| Trang | URL | Chức Năng |
|-------|-----|----------|
| Đăng ký môn | /student-dashboard.html | Register/drop courses |

---

## 🧪 Kiểm Thử Nhanh

### Test 1: Admin Dashboard
1. Login: admin1 / admin123
2. Xem stats (students, courses, registrations)
3. Click "Quản lý Môn học" → Load successful ✅

### Test 2: Tạo Sinh Viên
1. Click "Quản lý Sinh viên"
2. Nhập: username=test, password=123, code=SV999, name=Test User, email=test@test.com, major=IT
3. Click "Thêm Sinh viên" → Success ✅

### Test 3: Tạo Lịch Học
1. Click "Quản lý Lịch học"
2. Chọn một môn từ dropdown
3. Chọn "Thứ 2", nhập "08:00", "10:00", "A101"
4. Click "Thêm Lịch học" → Success ✅

### Test 4: Student Registration
1. Logout
2. Login: student1 / pass123
3. Xem danh sách môn học
4. Click "Chọn Đăng Ký" → Success ✅

---

## 🐛 Troubleshooting

### ❌ MySQL Error
```bash
# Verify MySQL is running
sudo service mysql status

# If not running:
sudo service mysql start
```

### ❌ Port 3000 Already In Use
```bash
# Use different port
PORT=3001 npm start
```

### ❌ npm install errors
```bash
# Clear npm cache
npm cache clean --force

# Reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## 📚 Documentation

- 📖 **README.md** - Full setup guide
- 🧪 **TEST_GUIDE.md** - 100+ test cases
- ✅ **COMPLETION_REPORT.md** - What's been done
- 🚀 **This file** - Quick start

---

## 🎯 Next Steps

After running:

1. **Read TEST_GUIDE.md** - Comprehensive test checklist
2. **Follow test cases** - Verify all features work
3. **Try API endpoints** - Use Postman or curl
4. **Review documentation** - Understand architecture

---

## 💡 Pro Tips

### Use Nodemon for Development
```bash
npm install -D nodemon
npx nodemon server.js
```

### View MySQL Queries
Add to .env:
```
DEBUG=true
```

### Test API with Postman
```
Import collection from examples in TEST_GUIDE.md
```

---

## ✅ Verification Checklist

- [ ] npm install successful
- [ ] .env file created
- [ ] MySQL database created
- [ ] Server running on port 3000
- [ ] Login page loads at http://localhost:3000
- [ ] Admin1 login works
- [ ] Student1 login works
- [ ] Admin dashboard shows stats
- [ ] All 4 admin pages accessible
- [ ] Student registration page loads

---

## 🎉 Ready to Go!

Your Course Registration System is now running! 

- 👉 Login with admin1 / admin123
- 👉 Explore all features
- 👉 Follow TEST_GUIDE.md for detailed testing

**Status**: ✅ READY FOR TESTING

---

*Questions? Check README.md or TEST_GUIDE.md*
