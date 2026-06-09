const RegistrationModel = require('../models/registrationModel');
const CourseModel = require('../models/courseModel');
const TimeSlotModel = require('../models/timeslotModel');

const RegistrationController = {
    getStudentDashboard: async (req, res) => {
        try {
            const studentId = req.user.profileId;
            const registeredCourses = await RegistrationModel.getStudentDashboardData(studentId);
            const courseIds = registeredCourses.map(item => item.course_id);
            const allTimeSlots = await TimeSlotModel.findByCourseIds(courseIds);
            const scheduleMap = allTimeSlots.reduce((acc, slot) => {
                const key = slot.course_id;
                if (!acc[key]) acc[key] = [];
                acc[key].push({
                    day_of_week: slot.day_of_week,
                    start_time: slot.start_time.substring(0, 5),
                    end_time: slot.end_time.substring(0, 5),
                    room: slot.room
                });
                return acc;
            }, {});
            const registeredWithSchedule = registeredCourses.map(course => ({
                ...course,
                timeslots: scheduleMap[course.course_id] || []
            }));
            const totalCredits = await RegistrationModel.getCurrentCredits(studentId);
            res.json({ registeredCourses: registeredWithSchedule, totalCredits });
        } catch (e) { res.status(500).json({ message: e.message }); }
    },

    registerCourse: async (req, res) => {
        try {
            const studentId = req.user.profileId;
            const { courseId } = req.body;

            // 1. Kiểm tra cấu hình môn học tồn tại
            const course = await CourseModel.findById(courseId);
            if (!course) return res.status(444).json({ message: 'Môn học không tồn tại!' });

            // 2. Nghiệp vụ: Đã đăng ký môn học này chưa
            const isRegistered = await RegistrationModel.checkAlreadyRegistered(studentId, courseId);
            if (isRegistered) return res.status(400).json({ message: 'Bạn đã đăng ký môn học này rồi!' });

            // 2b. Nghiệp vụ: Kiểm tra trùng mã môn giữa các học kỳ
            const sameCodeRegistered = await RegistrationModel.findSameCourseCodeRegistered(studentId, course.course_code);
            if (sameCodeRegistered) {
                return res.status(400).json({ message: 'Bạn đã đăng ký môn học này ở một học kỳ khác. Không thể đăng ký cùng lúc hai học kỳ.' });
            }

            // 3. Kiểm tra sĩ số tối đa lớp học còn chỗ trống hay không
            const currentStudents = await RegistrationModel.countRegisteredStudents(courseId);
            if (currentStudents >= course.max_students) {
                return res.status(400).json({ message: 'Lớp học đã đầy sĩ số tối đa!' });
            }

            // 4. Kiểm tra vượt quá số tín chỉ giới hạn (Ví dụ: Max 24 tín chỉ)
            const currentCredits = Number(await RegistrationModel.getCurrentCredits(studentId)) || 0;
            const courseCredits = Number(course.credits) || 0;
            if (currentCredits + courseCredits > 24) {
                return res.status(400).json({ message: 'Vượt quá giới hạn 24 tín chỉ của học kỳ!' });
            }

            // 5. Kiểm tra trùng lịch học
            const newCourseSlots = await TimeSlotModel.findByCourseId(courseId);
            const studentSchedule = await RegistrationModel.getStudentSchedule(studentId);

            for (const newSlot of newCourseSlots) {
                for (const oldSlot of studentSchedule) {
                    if (newSlot.day_of_week === oldSlot.day_of_week) {
                        if ((newSlot.start_time < oldSlot.end_time) && (newSlot.end_time > oldSlot.start_time)) {
                            return res.status(400).json({ message: `Trùng lịch học môn khác vào ngày ${newSlot.day_of_week}!` });
                        }
                    }
                }
            }

            await RegistrationModel.register(studentId, courseId);
            res.status(200).json({ message: 'Đăng ký môn học thành công!' });
        } catch (e) {
            res.status(500).json({ message: e.message });
        }
    },

    dropCourse: async (req, res) => {
        try {
            const studentId = req.user.profileId;
            const { courseId } = req.body;
            await RegistrationModel.drop(studentId, courseId);
            res.json({ message: 'Hủy đăng ký môn học thành công!' });
        } catch (e) { res.status(500).json({ message: e.message }); }
    },

    getAdminStats: async (req, res) => {
        try {
            const stats = await RegistrationModel.getAdminDashboardStats();
            const courseStats = await RegistrationModel.getCourseStatsForAdmin();
            const allRegistrations = await RegistrationModel.getAllRegistrationsDetails();
            const canceledRegistrations = await RegistrationModel.getCanceledRegistrationsDetails();
            res.json({ stats, courseStats, allRegistrations, canceledRegistrations });
        } catch (e) { res.status(500).json({ message: e.message }); }
    }
};

module.exports = RegistrationController;