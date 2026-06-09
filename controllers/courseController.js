const CourseModel = require('../models/courseModel');

const CourseController = {
    getAll: async (req, res) => {
        try {
            const courses = await CourseModel.findAll();
            res.json(courses);
        } catch (e) { res.status(500).json({ message: e.message }); }
    },
    create: async (req, res) => {
        try {
            const { courseCode, courseName, credits, maxStudents, semesterId } = req.body;
            const existingCode = await CourseModel.findByCode(courseCode);
            if (existingCode) return res.status(400).json({ message: 'Mã môn học đã tồn tại. Vui lòng sử dụng mã khác.' });
            const existingName = await CourseModel.findByName(courseName);
            if (existingName) return res.status(400).json({ message: 'Tên môn học đã tồn tại. Vui lòng nhập tên khác.' });
            await CourseModel.create(courseCode, courseName, credits, maxStudents, semesterId);
            res.status(201).json({ message: 'Thêm môn học thành công' });
        } catch (e) { res.status(500).json({ message: e.message }); }
    },
    update: async (req, res) => {
        try {
            const { courseCode, courseName, credits, maxStudents, semesterId } = req.body;
            const courseId = req.params.id;
            const existingCode = await CourseModel.findByCodeExceptId(courseCode, courseId);
            if (existingCode) return res.status(400).json({ message: 'Mã môn học đã tồn tại. Vui lòng sử dụng mã khác.' });
            const existingName = await CourseModel.findByNameExceptId(courseName, courseId);
            if (existingName) return res.status(400).json({ message: 'Tên môn học đã tồn tại. Vui lòng nhập tên khác.' });
            await CourseModel.update(courseId, courseCode, courseName, credits, maxStudents, semesterId);
            res.json({ message: 'Cập nhật môn học thành công' });
        } catch (e) { res.status(500).json({ message: e.message }); }
    },
    delete: async (req, res) => {
        try {
            await CourseModel.delete(req.params.id);
            res.json({ message: 'Xóa môn học thành công' });
        } catch (e) { res.status(500).json({ message: e.message }); }
    }
};

module.exports = CourseController;