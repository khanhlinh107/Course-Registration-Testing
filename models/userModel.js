const db = require('../config/db');

const UserModel = {
    findByUsername: async (username) => {
        const [rows] = await db.execute('SELECT * FROM User WHERE username = ?', [username]);
        return rows[0];
    },
    create: async (username, hashedPassword, role) => {
        const [result] = await db.execute('INSERT INTO User (username, password, role) VALUES (?, ?, ?)', [username, hashedPassword, role]);
        return result.insertId;
    }
};

module.exports = UserModel;