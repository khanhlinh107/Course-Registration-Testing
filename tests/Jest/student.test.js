const StudentController = require('../../controllers/studentController');
const StudentModel = require('../../models/studentModel');
const UserModel = require('../../models/userModel');
const db = require('../../config/db');
const bcrypt = require('bcryptjs');

jest.mock('../../models/studentModel');
jest.mock('../../models/userModel');
jest.mock('../../config/db');
jest.mock('bcryptjs');

describe('Student Controller', () => {

    test('TC-STU-01: Lấy danh sách sinh viên thành công', async () => {

        StudentModel.findAll.mockResolvedValue([
            {
                student_id: 1,
                full_name: 'Nguyen Van A'
            }
        ]);

        const req = {};

        const res = {
            json: jest.fn()
        };

        await StudentController.getAll(req, res);

        expect(StudentModel.findAll)
            .toHaveBeenCalled();

        expect(res.json)
            .toHaveBeenCalledWith([
                {
                    student_id: 1,
                    full_name: 'Nguyen Van A'
                }
            ]);

    });
test('TC-STU-02: Thêm sinh viên thành công', async () => {

    bcrypt.hash.mockResolvedValue('hashedPassword');

    UserModel.create.mockResolvedValue(10);

    StudentModel.create.mockResolvedValue(20);

    const req = {
        body: {
            username: 'student3',
            password: '123456',
            studentCode: 'SV003',
            fullName: 'Nguyen Van C',
            email: 'c@gmail.com',
            major: 'Software Engineering'
        }
    };

    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
    };

    await StudentController.create(req, res);

    expect(bcrypt.hash)
        .toHaveBeenCalledWith('123456', 10);

    expect(UserModel.create)
        .toHaveBeenCalled();

    expect(StudentModel.create)
        .toHaveBeenCalled();

    expect(res.status)
        .toHaveBeenCalledWith(211);

    expect(res.json)
        .toHaveBeenCalledWith({
            message: 'Sinh viên đã được tạo!',
            studentId: 20
        });

});
test('TC-STU-03: Cập nhật sinh viên thành công', async () => {

    StudentModel.update.mockResolvedValue();

    const req = {
        params: {
            id: 1
        },
        body: {
            fullName: 'Nguyen Van A Updated',
            email: 'new@gmail.com',
            major: 'Computer Science'
        }
    };

    const res = {
        json: jest.fn()
    };

    await StudentController.update(req, res);

    expect(StudentModel.update)
        .toHaveBeenCalledWith(
            1,
            'Nguyen Van A Updated',
            'new@gmail.com',
            'Computer Science'
        );

    expect(res.json)
        .toHaveBeenCalledWith({
            message: 'Cập nhật thành công!'
        });

});
test('TC-STU-04: Xóa sinh viên thành công', async () => {

    db.execute.mockResolvedValue();

    StudentModel.delete.mockResolvedValue();

    const req = {
        params: {
            id: 1
        }
    };

    const res = {
        json: jest.fn()
    };

    await StudentController.delete(req, res);

    expect(db.execute)
        .toHaveBeenCalledWith(
            'DELETE FROM Registration WHERE student_id = ?',
            [1]
        );

    expect(StudentModel.delete)
        .toHaveBeenCalledWith(1);

    expect(res.json)
        .toHaveBeenCalledWith({
            message: 'Xóa sinh viên thành công!'
        });

});
test('TC-STU-05: Lỗi khi lấy danh sách sinh viên', async () => {

    StudentModel.findAll.mockRejectedValue(
        new Error('Database Error')
    );

    const req = {};

    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
    };

    await StudentController.getAll(req, res);

    expect(res.status)
        .toHaveBeenCalledWith(500);

    expect(res.json)
        .toHaveBeenCalledWith({
            message: 'Database Error'
        });

});
test('TC-STU-06: Lỗi khi thêm sinh viên', async () => {

    bcrypt.hash.mockResolvedValue('hashedPassword');

    UserModel.create.mockRejectedValue(
        new Error('Insert User Failed')
    );

    const req = {
        body: {
            username: 'student10',
            password: '123456',
            studentCode: 'SV010',
            fullName: 'Test Student',
            email: 'test@gmail.com',
            major: 'IT'
        }
    };

    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
    };

    await StudentController.create(req, res);

    expect(res.status)
        .toHaveBeenCalledWith(500);

    expect(res.json)
        .toHaveBeenCalledWith({
            message: 'Insert User Failed'
        });

});
test('TC-STU-07: Lỗi khi cập nhật sinh viên', async () => {

    StudentModel.update.mockRejectedValue(
        new Error('Update Failed')
    );

    const req = {
        params: {
            id: 1
        },
        body: {
            fullName: 'Nguyen Van A',
            email: 'a@gmail.com',
            major: 'IT'
        }
    };

    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
    };

    await StudentController.update(req, res);

    expect(res.status)
        .toHaveBeenCalledWith(500);

    expect(res.json)
        .toHaveBeenCalledWith({
            message: 'Update Failed'
        });

});
test('TC-STU-08: Lỗi khi xóa sinh viên', async () => {

    db.execute.mockRejectedValue(
        new Error('Delete Failed')
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

    await StudentController.delete(req, res);

    expect(res.status)
        .toHaveBeenCalledWith(500);

    expect(res.json)
        .toHaveBeenCalledWith({
            message: 'Delete Failed'
        });

});
});