const db = require('../config/db');

const StudentModel = {
    findAll: async () => {
        const query = `
            SELECT s.*, u.username 
            FROM Student s
            LEFT JOIN User u ON s.user_id = u.user_id
            ORDER BY s.student_id DESC`;
        const [rows] = await db.execute(query);
        return rows;
    },
    findById: async (id) => {
        const [rows] = await db.execute('SELECT * FROM Student WHERE student_id = ?', [id]);
        return rows[0];
    },
    findByUserId: async (userId) => {
        const [rows] = await db.execute('SELECT * FROM Student WHERE user_id = ?', [userId]);
        return rows[0];
    },
    create: async (userId, studentCode, fullName, email, major) => {
        const [result] = await db.execute('INSERT INTO Student (user_id, student_code, full_name, email, major) VALUES (?, ?, ?, ?, ?)', [userId, studentCode, fullName, email, major]);
        return result.insertId;
    },
    update: async (id, fullName, email, major) => {
        await db.execute('UPDATE Student SET full_name = ?, email = ?, major = ? WHERE student_id = ?', [fullName, email, major, id]);
    },
    delete: async (id) => {
        // Lấy user_id trước khi xóa để clear bảng User
        const [rows] = await db.execute('SELECT user_id FROM Student WHERE student_id = ?', [id]);
        if(rows.length > 0) {
            await db.execute('DELETE FROM User WHERE user_id = ?', [rows[0].user_id]);
        }
    }
};

module.exports = StudentModel;