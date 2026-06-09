const express = require('express');
const path = require('path');
const dotenv = require('dotenv');


// Cấu hình môi trường biến
dotenv.config();
const db = require('./config/db');

// Test kết nối MySQL khi khởi động server
(async () => {
    try {
        const connection = await db.getConnection();
        console.log('✅ Kết nối MySQL thành công!');
        connection.release();
    } catch (error) {
        console.error('❌ Lỗi kết nối MySQL:', error.message);
    }
})();

const app = express();

// Bộ phân giải dữ liệu JSON
app.use(express.json());

// Định tuyến cấu hình các thư mục tĩnh cho giao diện Frontend
app.use(express.static(path.join(__dirname, 'public')));

// Đăng ký API endpoints hệ thống
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/students', require('./routes/studentRoutes'));
app.use('/api/courses', require('./routes/courseRoutes'));
app.use('/api/timeslots', require('./routes/timeslotRoutes'));
app.use('/api/registrations', require('./routes/registrationRoutes'));

// Trả về trang đăng nhập làm mặc định khi truy cập gốc của trình duyệt
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

module.exports = app;

if (require.main === module) {

    const PORT = process.env.PORT || 3000;

    app.listen(PORT, () => {
        console.log(`===========================================================`);
        console.log(` SERVER ĐANG CHẠY ỔN ĐỊNH TRÊN CỔNG: http://localhost:${PORT}`);
        console.log(` PHỤC VỤ ĐỒ ÁN KIỂM THỬ: READY FOR POSTMAN & JEST & SELENIUM`);
        console.log(`===========================================================`);
    });

}