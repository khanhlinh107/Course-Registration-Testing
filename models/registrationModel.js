const db = require('../config/db');

const RegistrationModel = {
    getStudentDashboardData: async (studentId) => {
        const query = `
            SELECT r.registration_id, r.register_date, r.status, c.*, s.semester_name 
            FROM Registration r
            JOIN Course c ON r.course_id = c.course_id
            LEFT JOIN Semester s ON c.semester_id = s.semester_id
            WHERE r.student_id = ? AND r.status = 'Registered'`;
        const [rows] = await db.execute(query, [studentId]);
        return rows;
    },
    checkAlreadyRegistered: async (studentId, courseId) => {
        const [rows] = await db.execute('SELECT * FROM Registration WHERE student_id = ? AND course_id = ? AND status = "Registered"', [studentId, courseId]);
        return rows.length > 0;
    },
    getCurrentCredits: async (studentId) => {
        const query = `
            SELECT SUM(c.credits) AS total_credits 
            FROM Registration r 
            JOIN Course c ON r.course_id = c.course_id 
            WHERE r.student_id = ? AND r.status = 'Registered'`;
        const [rows] = await db.execute(query, [studentId]);
        const total = rows[0].total_credits;
        return Number(total) || 0;
    },
    countRegisteredStudents: async (courseId) => {
        const [rows] = await db.execute('SELECT COUNT(*) AS current_total FROM Registration WHERE course_id = ? AND status = "Registered"', [courseId]);
        return rows[0].current_total;
    },
    getStudentSchedule: async (studentId) => {
        const query = `
            SELECT t.day_of_week, t.start_time, t.end_time 
            FROM Registration r
            JOIN TimeSlot t ON r.course_id = t.course_id
            WHERE r.student_id = ? AND r.status = 'Registered'`;
        const [rows] = await db.execute(query, [studentId]);
        return rows;
    },
    findSameCourseCodeRegistered: async (studentId, courseCode) => {
        const query = `
            SELECT r.*
            FROM Registration r
            JOIN Course c ON r.course_id = c.course_id
            WHERE r.student_id = ? AND r.status = 'Registered' AND LOWER(c.course_code) = LOWER(?)`;
        const [rows] = await db.execute(query, [studentId, courseCode]);
        return rows[0];
    },
    register: async (studentId, courseId) => {
        await db.execute('INSERT INTO Registration (student_id, course_id, status) VALUES (?, ?, "Registered") ON DUPLICATE KEY UPDATE status="Registered"', [studentId, courseId]);
    },
    drop: async (studentId, courseId) => {
        await db.execute('UPDATE Registration SET status = "Dropped" WHERE student_id = ? AND course_id = ?', [studentId, courseId]);
    },
    getAdminDashboardStats: async () => {
        const [students] = await db.execute('SELECT COUNT(*) AS count FROM Student');
        const [courses] = await db.execute('SELECT COUNT(*) AS count FROM Course');
        const [registrations] = await db.execute('SELECT COUNT(*) AS count FROM Registration WHERE status = "Registered"');
        return {
            totalStudents: students[0].count,
            totalCourses: courses[0].count,
            totalRegistrations: registrations[0].count
        };
    },
    getCourseStatsForAdmin: async () => {
        const query = `
            SELECT c.course_code, c.course_name, c.max_students,
            (SELECT COUNT(*) FROM Registration r WHERE r.course_id = c.course_id AND r.status = 'Registered') AS registered_count
            FROM Course c`;
        const [rows] = await db.execute(query);
        return rows;
    },
    getAllRegistrationsDetails: async () => {
        const query = `
            SELECT r.registration_id, r.register_date, s.student_code, s.full_name, c.course_code, c.course_name
            FROM Registration r
            JOIN Student s ON r.student_id = s.student_id
            JOIN Course c ON r.course_id = c.course_id
            WHERE r.status = 'Registered'
            ORDER BY r.register_date DESC`;
        const [rows] = await db.execute(query);
        return rows;
    },
    getCanceledRegistrationsDetails: async () => {
        const query = `
            SELECT r.registration_id, r.register_date, s.student_code, s.full_name, c.course_code, c.course_name
            FROM Registration r
            JOIN Student s ON r.student_id = s.student_id
            JOIN Course c ON r.course_id = c.course_id
            WHERE r.status = 'Dropped'
            ORDER BY r.register_date DESC`;
        const [rows] = await db.execute(query);
        return rows;
    }
};

module.exports = RegistrationModel;