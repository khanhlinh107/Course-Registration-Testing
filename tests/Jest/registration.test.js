const RegistrationController = require('../../controllers/registrationController');
const CourseModel = require('../../models/courseModel');
const RegistrationModel = require('../../models/registrationModel');
const TimeSlotModel = require('../../models/timeslotModel');

jest.mock('../../models/courseModel');
jest.mock('../../models/registrationModel');
jest.mock('../../models/timeslotModel');

describe('Registration Controller', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('TC-REG-02: Môn học không tồn tại', async () => {

        CourseModel.findById.mockResolvedValue(null);

        const req = {
            user: {
                profileId: 1,
                role: 'student'
            },
            body: {
                courseId: 999
            }
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await RegistrationController.registerCourse(req, res);

        expect(res.status).toHaveBeenCalledWith(444);

        expect(res.json).toHaveBeenCalledWith({
            message: 'Môn học không tồn tại!'
        });

    });

    test('TC-REG-03: Đã đăng ký môn học rồi', async () => {

        CourseModel.findById.mockResolvedValue({
            course_id: 1,
            course_code: 'IT001',
            credits: 3,
            max_students: 40
        });

        RegistrationModel.checkAlreadyRegistered.mockResolvedValue(true);

        const req = {
            user: {
                profileId: 1,
                role: 'student'
            },
            body: {
                courseId: 1
            }
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await RegistrationController.registerCourse(req, res);

        expect(res.status).toHaveBeenCalledWith(400);

        expect(res.json).toHaveBeenCalledWith({
            message: 'Bạn đã đăng ký môn học này rồi!'
        });

    });

});
test('TC-REG-05: Lớp học đã đầy', async () => {

    CourseModel.findById.mockResolvedValue({
        course_id: 1,
        course_code: 'IT001',
        credits: 3,
        max_students: 2
    });

    RegistrationModel.checkAlreadyRegistered.mockResolvedValue(false);

    RegistrationModel.findSameCourseCodeRegistered.mockResolvedValue(null);

    RegistrationModel.countRegisteredStudents.mockResolvedValue(2);

    const req = {
        user: {
            profileId: 1,
            role: 'student'
        },
        body: {
            courseId: 1
        }
    };

    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
    };

    await RegistrationController.registerCourse(req, res);

    expect(res.status).toHaveBeenCalledWith(400);

    expect(res.json).toHaveBeenCalledWith({
        message: 'Lớp học đã đầy sĩ số tối đa!'
    });

});
test('TC-REG-06: Vượt quá giới hạn 24 tín chỉ', async () => {

    CourseModel.findById.mockResolvedValue({
        course_id: 1,
        course_code: 'IT001',
        credits: 3,
        max_students: 40
    });

    RegistrationModel.checkAlreadyRegistered.mockResolvedValue(false);

    RegistrationModel.findSameCourseCodeRegistered.mockResolvedValue(null);

    RegistrationModel.countRegisteredStudents.mockResolvedValue(10);

    RegistrationModel.getCurrentCredits.mockResolvedValue(22);

    const req = {
        user: {
            profileId: 1,
            role: 'student'
        },
        body: {
            courseId: 1
        }
    };

    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
    };

    await RegistrationController.registerCourse(req, res);

    expect(res.status).toHaveBeenCalledWith(400);

    expect(res.json).toHaveBeenCalledWith({
        message: 'Vượt quá giới hạn 24 tín chỉ của học kỳ!'
    });

});
test('TC-REG-07: Trùng lịch học', async () => {

    CourseModel.findById.mockResolvedValue({
        course_id: 1,
        course_code: 'IT001',
        credits: 3,
        max_students: 40
    });

    RegistrationModel.checkAlreadyRegistered.mockResolvedValue(false);

    RegistrationModel.findSameCourseCodeRegistered.mockResolvedValue(null);

    RegistrationModel.countRegisteredStudents.mockResolvedValue(10);

    RegistrationModel.getCurrentCredits.mockResolvedValue(6);

    TimeSlotModel.findByCourseId.mockResolvedValue([
        {
            day_of_week: 'Monday',
            start_time: '08:30:00',
            end_time: '11:00:00'
        }
    ]);

    RegistrationModel.getStudentSchedule.mockResolvedValue([
        {
            day_of_week: 'Monday',
            start_time: '07:30:00',
            end_time: '10:00:00'
        }
    ]);

    const req = {
        user: {
            profileId: 1,
            role: 'student'
        },
        body: {
            courseId: 1
        }
    };

    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
    };

    await RegistrationController.registerCourse(req, res);

    expect(res.status).toHaveBeenCalledWith(400);

    expect(res.json).toHaveBeenCalledWith({
        message: 'Trùng lịch học môn khác vào ngày Monday!'
    });

});
test('TC-REG-08: Đăng ký môn học thành công', async () => {

    CourseModel.findById.mockResolvedValue({
        course_id: 1,
        course_code: 'IT001',
        credits: 3,
        max_students: 40
    });

    RegistrationModel.checkAlreadyRegistered.mockResolvedValue(false);

    RegistrationModel.findSameCourseCodeRegistered.mockResolvedValue(null);

    RegistrationModel.countRegisteredStudents.mockResolvedValue(10);

    RegistrationModel.getCurrentCredits.mockResolvedValue(6);

    TimeSlotModel.findByCourseId.mockResolvedValue([
        {
            day_of_week: 'Monday',
            start_time: '07:30:00',
            end_time: '10:00:00'
        }
    ]);

    RegistrationModel.getStudentSchedule.mockResolvedValue([
        {
            day_of_week: 'Wednesday',
            start_time: '13:30:00',
            end_time: '16:00:00'
        }
    ]);

    RegistrationModel.register.mockResolvedValue();

    const req = {
        user: {
            profileId: 1,
            role: 'student'
        },
        body: {
            courseId: 1
        }
    };

    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
    };

    await RegistrationController.registerCourse(req, res);

    expect(RegistrationModel.register).toHaveBeenCalledWith(1, 1);

    expect(res.status).toHaveBeenCalledWith(200);

    expect(res.json).toHaveBeenCalledWith({
        message: 'Đăng ký môn học thành công!'
    });

});
test('TC-REG-04: Đăng ký cùng mã môn ở học kỳ khác', async () => {

    CourseModel.findById.mockResolvedValue({
        course_id: 2,
        course_code: 'IT001',
        credits: 3,
        max_students: 40
    });

    RegistrationModel.checkAlreadyRegistered.mockResolvedValue(false);

    RegistrationModel.findSameCourseCodeRegistered.mockResolvedValue({
        registration_id: 5,
        student_id: 1,
        course_id: 1
    });

    const req = {
        user: {
            profileId: 1,
            role: 'student'
        },
        body: {
            courseId: 2
        }
    };

    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
    };

    await RegistrationController.registerCourse(req, res);

    expect(res.status).toHaveBeenCalledWith(400);

    expect(res.json).toHaveBeenCalledWith({
        message: 'Bạn đã đăng ký môn học này ở một học kỳ khác. Không thể đăng ký cùng lúc hai học kỳ.'
    });

});
test('TC-REG-01: Xem dashboard sinh viên thành công', async () => {

    RegistrationModel.getStudentDashboardData.mockResolvedValue([
        {
            course_id: 1,
            course_code: 'IT001',
            course_name: 'Software Testing'
        }
    ]);

    TimeSlotModel.findByCourseIds.mockResolvedValue([
        {
            course_id: 1,
            day_of_week: 'Monday',
            start_time: '07:30:00',
            end_time: '10:00:00',
            room: 'Lab 401'
        }
    ]);

    RegistrationModel.getCurrentCredits.mockResolvedValue(3);

    const req = {
        user: {
            profileId: 1
        }
    };

    const res = {
        json: jest.fn()
    };

    await RegistrationController.getStudentDashboard(req, res);

    expect(res.json).toHaveBeenCalled();

});
test('TC-REG-09: Hủy đăng ký môn học thành công', async () => {

    RegistrationModel.drop.mockResolvedValue();

    const req = {
        user: {
            profileId: 1
        },
        body: {
            courseId: 1
        }
    };

    const res = {
        json: jest.fn()
    };

    await RegistrationController.dropCourse(req, res);

    expect(RegistrationModel.drop)
        .toHaveBeenCalledWith(1, 1);

    expect(res.json)
        .toHaveBeenCalledWith({
            message: 'Hủy đăng ký môn học thành công!'
        });

});
test('TC-REG-10: Xem dashboard admin thành công', async () => {

    RegistrationModel.getAdminDashboardStats.mockResolvedValue({
        totalStudents: 2,
        totalCourses: 3,
        totalRegistrations: 5
    });

    RegistrationModel.getCourseStatsForAdmin.mockResolvedValue([
        {
            course_code: 'IT001',
            registered_count: 2
        }
    ]);

    RegistrationModel.getAllRegistrationsDetails.mockResolvedValue([
        {
            registration_id: 1
        }
    ]);

    RegistrationModel.getCanceledRegistrationsDetails.mockResolvedValue([
        {
            registration_id: 2
        }
    ]);

    const req = {};

    const res = {
        json: jest.fn()
    };

    await RegistrationController.getAdminStats(req, res);

    expect(res.json).toHaveBeenCalledWith({
        stats: {
            totalStudents: 2,
            totalCourses: 3,
            totalRegistrations: 5
        },
        courseStats: [
            {
                course_code: 'IT001',
                registered_count: 2
            }
        ],
        allRegistrations: [
            {
                registration_id: 1
            }
        ],
        canceledRegistrations: [
            {
                registration_id: 2
            }
        ]
    });

});