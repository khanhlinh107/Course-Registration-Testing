const db = require('../config/db');

const CourseModel = {
    findAll: async () => {
        const query = `
            SELECT c.*, s.semester_name, s.academic_year,
                   GROUP_CONCAT(CONCAT(t.day_of_week, '|', DATE_FORMAT(t.start_time, '%H:%i'), '|', DATE_FORMAT(t.end_time, '%H:%i'), '|', t.room) SEPARATOR '||') AS schedule_details
            FROM Course c
            LEFT JOIN Semester s ON c.semester_id = s.semester_id
            LEFT JOIN TimeSlot t ON t.course_id = c.course_id
            GROUP BY c.course_id
            ORDER BY c.course_id DESC`;
        const [rows] = await db.execute(query);
        return rows.map(course => ({
            ...course,
            timeslots: course.schedule_details ? course.schedule_details.split('||').map(item => {
                const [day_of_week, start_time, end_time, room] = item.split('|');
                return { day_of_week, start_time, end_time, room };
            }) : []
        }));
    },
    findById: async (id) => {
        const [rows] = await db.execute('SELECT * FROM Course WHERE course_id = ?', [id]);
        return rows[0];
    },
    findByCode: async (courseCode) => {
        const [rows] = await db.execute('SELECT * FROM Course WHERE LOWER(course_code) = LOWER(?)', [courseCode]);
        return rows[0];
    },
    findByName: async (courseName) => {
        const [rows] = await db.execute('SELECT * FROM Course WHERE LOWER(course_name) = LOWER(?)', [courseName]);
        return rows[0];
    },
    findByCodeExceptId: async (courseCode, courseId) => {
        const [rows] = await db.execute('SELECT * FROM Course WHERE LOWER(course_code) = LOWER(?) AND course_id != ?', [courseCode, courseId]);
        return rows[0];
    },
    findByNameExceptId: async (courseName, courseId) => {
        const [rows] = await db.execute('SELECT * FROM Course WHERE LOWER(course_name) = LOWER(?) AND course_id != ?', [courseName, courseId]);
        return rows[0];
    },
    create: async (courseCode, courseName, credits, maxStudents, semesterId) => {
        const [result] = await db.execute('INSERT INTO Course (course_code, course_name, credits, max_students, semester_id) VALUES (?, ?, ?, ?, ?)', [courseCode, courseName, credits, maxStudents, semesterId]);
        return result.insertId;
    },
    update: async (id, courseCode, courseName, credits, maxStudents, semesterId) => {
        await db.execute('UPDATE Course SET course_code = ?, course_name = ?, credits = ?, max_students = ?, semester_id = ? WHERE course_id = ?', [courseCode, courseName, credits, maxStudents, semesterId, id]);
    },
    delete: async (id) => {
        await db.execute('DELETE FROM Registration WHERE course_id = ?', [id]);
        await db.execute('DELETE FROM TimeSlot WHERE course_id = ?', [id]);
        await db.execute('DELETE FROM Course WHERE course_id = ?', [id]);
    }
};

module.exports = CourseModel;