const db = require('../config/db');

const TimeSlotModel = {
    findAll: async () => {
        const query = `
            SELECT t.*, c.course_name, c.course_code 
            FROM TimeSlot t 
            JOIN Course c ON t.course_id = c.course_id`;
        const [rows] = await db.execute(query);
        return rows;
    },
    findByCourseId: async (courseId) => {
        const [rows] = await db.execute('SELECT * FROM TimeSlot WHERE course_id = ?', [courseId]);
        return rows;
    },
    findByCourseIds: async (courseIds) => {
        if (!courseIds || courseIds.length === 0) return [];
        const placeholders = courseIds.map(() => '?').join(',');
        const [rows] = await db.execute(`SELECT * FROM TimeSlot WHERE course_id IN (${placeholders})`, courseIds);
        return rows;
    },
    findExactDuplicate: async (dayOfWeek, startTime, endTime) => {
        const [rows] = await db.execute('SELECT * FROM TimeSlot WHERE day_of_week = ? AND start_time = ? AND end_time = ?', [dayOfWeek, startTime, endTime]);
        return rows[0];
    },
    findRoomConflict: async (dayOfWeek, startTime, endTime, room) => {
        const [rows] = await db.execute(
            'SELECT * FROM TimeSlot WHERE day_of_week = ? AND room = ? AND ((start_time < ? AND end_time > ?) OR (start_time = ? AND end_time = ?))',
            [dayOfWeek, room, endTime, startTime, startTime, endTime]
        );
        return rows[0];
    },
    create: async (courseId, dayOfWeek, startTime, endTime, room) => {
        const [result] = await db.execute('INSERT INTO TimeSlot (course_id, day_of_week, start_time, end_time, room) VALUES (?, ?, ?, ?, ?)', [courseId, dayOfWeek, startTime, endTime, room]);
        return result.insertId;
    },
    update: async (id, dayOfWeek, startTime, endTime, room) => {
        await db.execute('UPDATE TimeSlot SET day_of_week = ?, start_time = ?, end_time = ?, room = ? WHERE timeslot_id = ?', [dayOfWeek, startTime, endTime, room, id]);
    },
    delete: async (id) => {
        await db.execute('DELETE FROM TimeSlot WHERE timeslot_id = ?', [id]);
    }
};

module.exports = TimeSlotModel;