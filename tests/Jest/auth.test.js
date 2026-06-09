const AuthController = require('../../controllers/authController');
const UserModel = require('../../models/userModel');
const StudentModel = require('../../models/studentModel');
const AdminModel = require('../../models/adminModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

jest.mock('../../models/userModel');
jest.mock('../../models/studentModel');
jest.mock('../../models/adminModel');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('Auth Controller', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });
    test('TC-AUTH-01: Đăng nhập thành công với tài khoản sinh viên', async () => {

    UserModel.findByUsername.mockResolvedValue({
        user_id: 1,
        username: 'student1',
        password: 'hashedPassword',
        role: 'student'
    });

    bcrypt.compare.mockResolvedValue(true);

    StudentModel.findByUserId.mockResolvedValue({
        student_id: 10,
        full_name: 'Nguyen Van A'
    });

    jwt.sign.mockReturnValue('fake-jwt-token');

    const req = {
        body: {
            username: 'student1',
            password: '123456'
        }
    };

    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
    };

    await AuthController.login(req, res);

    expect(UserModel.findByUsername)
        .toHaveBeenCalledWith('student1');

    expect(bcrypt.compare)
        .toHaveBeenCalledWith(
            '123456',
            'hashedPassword'
        );

    expect(StudentModel.findByUserId)
        .toHaveBeenCalledWith(1);

    expect(jwt.sign)
        .toHaveBeenCalled();

    expect(res.status)
        .toHaveBeenCalledWith(200);

    expect(res.json)
        .toHaveBeenCalledWith({
            message: 'Đăng nhập thành công',
            token: 'fake-jwt-token',
            role: 'student',
            fullName: 'Nguyen Van A'
        });

});
test('TC-AUTH-02: Đăng nhập thành công với tài khoản admin', async () => {

    UserModel.findByUsername.mockResolvedValue({
        user_id: 2,
        username: 'admin1',
        password: 'hashedPassword',
        role: 'admin'
    });

    bcrypt.compare.mockResolvedValue(true);

    AdminModel.findByUserId.mockResolvedValue({
        admin_id: 99,
        full_name: 'System Admin'
    });

    jwt.sign.mockReturnValue('admin-token');

    const req = {
        body: {
            username: 'admin1',
            password: '123456'
        }
    };

    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
    };

    await AuthController.login(req, res);

    expect(UserModel.findByUsername)
        .toHaveBeenCalledWith('admin1');

    expect(AdminModel.findByUserId)
        .toHaveBeenCalledWith(2);

    expect(jwt.sign)
        .toHaveBeenCalled();

    expect(res.status)
        .toHaveBeenCalledWith(200);

    expect(res.json)
        .toHaveBeenCalledWith({
            message: 'Đăng nhập thành công',
            token: 'admin-token',
            role: 'admin',
            fullName: 'System Admin'
        });

});
test('TC-AUTH-03: Thiếu username hoặc password', async () => {

    const req = {
        body: {
            username: 'student1'
            // thiếu password
        }
    };

    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
    };

    await AuthController.login(req, res);

    expect(res.status)
        .toHaveBeenCalledWith(400);

    expect(res.json)
        .toHaveBeenCalledWith({
            message: 'Vui lòng điền đầy đủ thông tin!'
        });

    expect(UserModel.findByUsername)
        .not.toHaveBeenCalled();

});
test('TC-AUTH-04: Tên đăng nhập không tồn tại', async () => {

    UserModel.findByUsername.mockResolvedValue(null);

    const req = {
        body: {
            username: 'unknown',
            password: '123456'
        }
    };

    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
    };

    await AuthController.login(req, res);

    expect(UserModel.findByUsername)
        .toHaveBeenCalledWith('unknown');

    expect(res.status)
        .toHaveBeenCalledWith(401);

    expect(res.json)
        .toHaveBeenCalledWith({
            message: 'Tên đăng nhập không chính xác!'
        });

    expect(bcrypt.compare)
        .not.toHaveBeenCalled();

});
test('TC-AUTH-06: Sinh JWT Token thành công', async () => {

    UserModel.findByUsername.mockResolvedValue({
        user_id: 1,
        username: 'student1',
        password: 'hashedPassword',
        role: 'student'
    });

    bcrypt.compare.mockResolvedValue(true);

    StudentModel.findByUserId.mockResolvedValue({
        student_id: 10,
        full_name: 'Nguyen Van A'
    });

    jwt.sign.mockReturnValue('generated-token');

    const req = {
        body: {
            username: 'student1',
            password: '123456'
        }
    };

    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
    };

    await AuthController.login(req, res);

    expect(jwt.sign)
        .toHaveBeenCalledWith(
            {
                userId: 1,
                role: 'student',
                profileId: 10
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '2h'
            }
        );

});
test('TC-AUTH-07: Lỗi hệ thống', async () => {

    UserModel.findByUsername.mockRejectedValue(
        new Error('Database Connection Failed')
    );

    const req = {
        body: {
            username: 'student1',
            password: '123456'
        }
    };

    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
    };

    await AuthController.login(req, res);

    expect(res.status)
        .toHaveBeenCalledWith(500);

    expect(res.json)
        .toHaveBeenCalledWith({
            message: 'Lỗi server hệ thống.',
            error: 'Database Connection Failed'
        });

});
});