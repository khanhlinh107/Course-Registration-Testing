const CourseController = require('../../controllers/courseController');
const CourseModel = require('../../models/courseModel');

jest.mock('../../models/courseModel');

describe('Course Controller', () => {
     beforeEach(() => {
        jest.clearAllMocks();
    });

    test('TC-COURSE-01: Lấy danh sách môn học thành công', async () => {

        CourseModel.findAll.mockResolvedValue([
            {
                course_id: 1,
                course_code: 'INT2204',
                course_name: 'Web Development'
            }
        ]);

        const req = {};

        const res = {
            json: jest.fn()
        };

        await CourseController.getAll(req, res);

        expect(CourseModel.findAll)
            .toHaveBeenCalled();

        expect(res.json)
            .toHaveBeenCalledWith([
                {
                    course_id: 1,
                    course_code: 'INT2204',
                    course_name: 'Web Development'
                }
            ]);

    });
test('TC-COURSE-02: Thêm môn học thành công', async () => {

    CourseModel.findByCode.mockResolvedValue(null);

    CourseModel.findByName.mockResolvedValue(null);

    CourseModel.create.mockResolvedValue(1);

    const req = {
        body: {
            courseCode: 'INT2205',
            courseName: 'Software Testing',
            credits: 3,
            maxStudents: 40,
            semesterId: 1
        }
    };

    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
    };

    await CourseController.create(req, res);

    expect(CourseModel.findByCode)
        .toHaveBeenCalledWith('INT2205');

    expect(CourseModel.findByName)
        .toHaveBeenCalledWith('Software Testing');

    expect(CourseModel.create)
        .toHaveBeenCalledWith(
            'INT2205',
            'Software Testing',
            3,
            40,
            1
        );

    expect(res.status)
        .toHaveBeenCalledWith(201);

    expect(res.json)
        .toHaveBeenCalledWith({
            message: 'Thêm môn học thành công'
        });

});
test('TC-COURSE-03: Thêm môn học bị trùng mã môn', async () => {

    CourseModel.findByCode.mockResolvedValue({
        course_id: 1,
        course_code: 'INT2205'
    });

    const req = {
        body: {
            courseCode: 'INT2205',
            courseName: 'Software Testing',
            credits: 3,
            maxStudents: 40,
            semesterId: 1
        }
    };

    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
    };

    await CourseController.create(req, res);

    expect(res.status)
        .toHaveBeenCalledWith(400);

    expect(res.json)
        .toHaveBeenCalledWith({
            message: 'Mã môn học đã tồn tại. Vui lòng sử dụng mã khác.'
        });

    expect(CourseModel.create)
        .not.toHaveBeenCalled();

});
test('TC-COURSE-04: Thêm môn học bị trùng tên', async () => {

    CourseModel.findByCode.mockResolvedValue(null);

    CourseModel.findByName.mockResolvedValue({
        course_id: 5,
        course_name: 'Software Testing'
    });

    const req = {
        body: {
            courseCode: 'INT9999',
            courseName: 'Software Testing',
            credits: 3,
            maxStudents: 40,
            semesterId: 1
        }
    };

    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
    };

    await CourseController.create(req, res);

    expect(res.status)
        .toHaveBeenCalledWith(400);

    expect(res.json)
        .toHaveBeenCalledWith({
            message: 'Tên môn học đã tồn tại. Vui lòng nhập tên khác.'
        });

});
test('TC-COURSE-05: Cập nhật môn học thành công', async () => {

    CourseModel.findByCodeExceptId.mockResolvedValue(null);

    CourseModel.findByNameExceptId.mockResolvedValue(null);

    CourseModel.update.mockResolvedValue();

    const req = {
        params: {
            id: 1
        },
        body: {
            courseCode: 'INT2205',
            courseName: 'Software Testing Updated',
            credits: 4,
            maxStudents: 50,
            semesterId: 2
        }
    };

    const res = {
        json: jest.fn()
    };

    await CourseController.update(req, res);

    expect(CourseModel.findByCodeExceptId)
        .toHaveBeenCalledWith('INT2205', 1);

    expect(CourseModel.findByNameExceptId)
        .toHaveBeenCalledWith(
            'Software Testing Updated',
            1
        );

    expect(CourseModel.update)
        .toHaveBeenCalledWith(
            1,
            'INT2205',
            'Software Testing Updated',
            4,
            50,
            2
        );

    expect(res.json)
        .toHaveBeenCalledWith({
            message: 'Cập nhật môn học thành công'
        });

});
test('TC-COURSE-06: Cập nhật bị trùng mã môn học', async () => {

    CourseModel.findByCodeExceptId.mockResolvedValue({
        course_id: 99,
        course_code: 'INT2205'
    });

    const req = {
        params: {
            id: 1
        },
        body: {
            courseCode: 'INT2205',
            courseName: 'Software Testing',
            credits: 3,
            maxStudents: 40,
            semesterId: 1
        }
    };

    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
    };

    await CourseController.update(req, res);

    expect(res.status)
        .toHaveBeenCalledWith(400);

    expect(res.json)
        .toHaveBeenCalledWith({
            message: 'Mã môn học đã tồn tại. Vui lòng sử dụng mã khác.'
        });

});
test('TC-COURSE-07: Cập nhật bị trùng tên môn học', async () => {

    CourseModel.findByCodeExceptId.mockResolvedValue(null);

    CourseModel.findByNameExceptId.mockResolvedValue({
        course_id: 50,
        course_name: 'Software Testing'
    });

    const req = {
        params: {
            id: 1
        },
        body: {
            courseCode: 'INT2205',
            courseName: 'Software Testing',
            credits: 3,
            maxStudents: 40,
            semesterId: 1
        }
    };

    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
    };

    await CourseController.update(req, res);

    expect(res.status)
        .toHaveBeenCalledWith(400);

    expect(res.json)
        .toHaveBeenCalledWith({
            message: 'Tên môn học đã tồn tại. Vui lòng nhập tên khác.'
        });

});
test('TC-COURSE-08: Xóa môn học thành công', async () => {

    CourseModel.delete.mockResolvedValue();

    const req = {
        params: {
            id: 1
        }
    };

    const res = {
        json: jest.fn()
    };

    await CourseController.delete(req, res);

    expect(CourseModel.delete)
        .toHaveBeenCalledWith(1);

    expect(res.json)
        .toHaveBeenCalledWith({
            message: 'Xóa môn học thành công'
        });

});
test('TC-COURSE-09: Lỗi lấy danh sách môn học', async () => {

    CourseModel.findAll.mockRejectedValue(
        new Error('Database Error')
    );

    const req = {};

    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
    };

    await CourseController.getAll(req, res);

    expect(res.status)
        .toHaveBeenCalledWith(500);

    expect(res.json)
        .toHaveBeenCalledWith({
            message: 'Database Error'
        });

});
test('TC-COURSE-10: Lỗi thêm môn học', async () => {

    CourseModel.findByCode.mockResolvedValue(null);

    CourseModel.findByName.mockResolvedValue(null);

    CourseModel.create.mockRejectedValue(
        new Error('Insert Course Failed')
    );

    const req = {
        body: {
            courseCode: 'INT2205',
            courseName: 'Software Testing',
            credits: 3,
            maxStudents: 40,
            semesterId: 1
        }
    };

    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
    };

    await CourseController.create(req, res);

    expect(res.status)
        .toHaveBeenCalledWith(500);

    expect(res.json)
        .toHaveBeenCalledWith({
            message: 'Insert Course Failed'
        });

});
test('TC-COURSE-11: Lỗi cập nhật môn học', async () => {

    CourseModel.findByCodeExceptId.mockResolvedValue(null);

    CourseModel.findByNameExceptId.mockResolvedValue(null);

    CourseModel.update.mockRejectedValue(
        new Error('Update Course Failed')
    );

    const req = {
        params: {
            id: 1
        },
        body: {
            courseCode: 'INT2205',
            courseName: 'Software Testing',
            credits: 3,
            maxStudents: 40,
            semesterId: 1
        }
    };

    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
    };

    await CourseController.update(req, res);

    expect(res.status)
        .toHaveBeenCalledWith(500);

    expect(res.json)
        .toHaveBeenCalledWith({
            message: 'Update Course Failed'
        });

});
test('TC-COURSE-12: Lỗi xóa môn học', async () => {

    CourseModel.delete.mockRejectedValue(
        new Error('Delete Course Failed')
    );

    const req = {
        params: {
            id: 1
        }
    };

    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
    };

    await CourseController.delete(req, res);

    expect(res.status)
        .toHaveBeenCalledWith(500);

    expect(res.json)
        .toHaveBeenCalledWith({
            message: 'Delete Course Failed'
        });

});
});