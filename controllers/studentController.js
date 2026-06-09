const StudentModel = require('../models/studentModel');
const UserModel = require('../models/userModel');
const db = require('../config/db');
const bcrypt = require('bcryptjs');

const StudentController = {
    getAll: async (req, res) => {
        try {
            const data = await StudentModel.findAll();
            res.json(data);
        } catch (e) { res.status(500).json({ message: e.message }); }
    },
    create: async (req, res) => {
        try {
            const { username, password, studentCode, fullName, email, major } = req.body;
            const hashedPassword = await bcrypt.hash(password, 10);
            const userId = await UserModel.create(username, hashedPassword, 'student');
            const studentId = await StudentModel.create(userId, studentCode, fullName, email, major);
            res.status(211).json({ message: 'Sinh viên đã được tạo!', studentId });
        } catch (e) { res.status(500).json({ message: e.message }); }
    },
    update: async (req, res) => {
        try {
            const { fullName, email, major } = req.body;
            await StudentModel.update(req.params.id, fullName, email, major);
            res.json({ message: 'Cập nhật thành công!' });
        } catch (e) { res.status(500).json({ message: e.message }); }
    },
    delete: async (req, res) => {
        try {
            const studentId = req.params.id;
            // Xóa tất cả đăng ký của sinh viên
            await db.execute('DELETE FROM Registration WHERE student_id = ?', [studentId]);
            // Xóa sinh viên
            await StudentModel.delete(studentId);
            res.json({ message: 'Xóa sinh viên thành công!' });
        } catch (e) { res.status(500).json({ message: e.message }); }
    }
};

module.exports = StudentController;