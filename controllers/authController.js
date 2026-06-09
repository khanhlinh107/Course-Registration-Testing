const UserModel = require('../models/userModel');
const StudentModel = require('../models/studentModel');
const AdminModel = require('../models/adminModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const AuthController = {
    login: async (req, res) => {
        try {
            const { username, password } = req.body;
            if (!username || !password) {
                return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin!' });
            }

            const user = await UserModel.findByUsername(username);
            if (!user) {
                return res.status(401).json({ message: 'Tên đăng nhập không chính xác!' });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ message: 'Mật khẩu không chính xác!' });
            }

            let profileInfo = {};
            if (user.role === 'student') {
                profileInfo = await StudentModel.findByUserId(user.user_id);
            } else if (user.role === 'admin') {
                profileInfo = await AdminModel.findByUserId(user.user_id);
            }

            const token = jwt.sign(
                { userId: user.user_id, role: user.role, profileId: profileInfo.student_id || profileInfo.admin_id },
                process.env.JWT_SECRET,
                { expiresIn: '2h' }
            );

            return res.status(200).json({
                message: 'Đăng nhập thành công',
                token,
                role: user.role,
                fullName: profileInfo.full_name
            });
        } catch (error) {
            return res.status(500).json({ message: 'Lỗi server hệ thống.', error: error.message });
        }
    }
};

module.exports = AuthController;