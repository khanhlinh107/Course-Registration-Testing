const jwt = require('jsonwebtoken');

const authMiddleware = {
    verifyToken: (req, res, next) => {
        const token = req.headers['authorization']?.split(' ')[1];
        if (!token) return res.status(403).json({ message: 'Token không được cung cấp!' });

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
            next();
        } catch (err) {
            return res.status(401).json({ message: 'Token không hợp lệ hoặc đã hết hạn!' });
        }
    },
    isStudent: (req, res, next) => {
        if (req.user.role !== 'student') return res.status(433).json({ message: 'Yêu cầu quyền truy cập của Sinh Viên!' });
        next();
    },
    isAdmin: (req, res, next) => {
        if (req.user.role !== 'admin') return res.status(433).json({ message: 'Yêu cầu quyền truy cập của Quản Trị Viên!' });
        next();
    }
};

module.exports = authMiddleware;