const db = require('../config/db');

const AdminModel = {
    findByUserId: async (userId) => {
        const [rows] = await db.execute('SELECT * FROM Admin WHERE user_id = ?', [userId]);
        return rows[0];
    }
};

module.exports = AdminModel;