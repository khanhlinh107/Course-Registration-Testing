const request = require('supertest');
const app = require('../../server');

let adminToken;
let studentToken;

beforeAll(async () => {

    const adminLogin = await request(app)
        .post('/api/auth/login')
        .send({
            username: 'admin1',
            password: '123456'
        });

    adminToken = adminLogin.body.token;

    const studentLogin = await request(app)
        .post('/api/auth/login')
        .send({
            username: 'student1',
            password: '123456'
        });

    studentToken = studentLogin.body.token;

});

describe('Course Integration Test', () => {

    test('IT-COURSE-01: Lấy danh sách môn học', async () => {

        const response = await request(app)
            .get('/api/courses')
            .set('Authorization', `Bearer ${adminToken}`);

        expect(response.status).toBe(200);

        expect(Array.isArray(response.body))
            .toBe(true);

    });

    test('IT-COURSE-02: Lấy danh sách môn học khi thiếu token', async () => {

        const response = await request(app)
            .get('/api/courses');

        expect(response.status).toBe(403);

        expect(response.body.message)
            .toBe('Token không được cung cấp!');

    });

    test('IT-COURSE-03: Student không được thêm môn học', async () => {

        const response = await request(app)
            .post('/api/courses')
            .set('Authorization', `Bearer ${studentToken}`)
            .send({
                courseCode: 'TEST999',
                courseName: 'Integration Test',
                credits: 3,
                maxStudents: 40,
                semesterId: 1
            });

        expect(response.status).toBe(433);

    });

    test('IT-COURSE-04: Thêm môn học trùng mã', async () => {

        const response = await request(app)
            .post('/api/courses')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                courseCode: 'IT001',
                courseName: 'Mon Hoc Moi',
                credits: 3,
                maxStudents: 40,
                semesterId: 1
            });

        expect(response.status).toBe(400);

        expect(response.body.message)
            .toBe('Mã môn học đã tồn tại. Vui lòng sử dụng mã khác.');

    });

    test('IT-COURSE-05: Thêm môn học thành công', async () => {

        const response = await request(app)
            .post('/api/courses')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                courseCode: `IT${Date.now()}`,
                courseName: `Môn học kiểm thử ${Date.now()}`,
                credits: 3,
                maxStudents: 40,
                semesterId: 1
            });

        expect(response.status).toBe(201);

        expect(response.body.message)
            .toBe('Thêm môn học thành công');

    });

});