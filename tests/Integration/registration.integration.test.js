const request = require('supertest');
const app = require('../../server');

let token;

beforeAll(async () => {

    const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
            username: 'student1',
            password: '123456'
        });

    token = loginResponse.body.token;

});

describe('Registration Integration Test', () => {

    test('IT-REG-01: Thiếu token', async () => {

        const response = await request(app)
            .post('/api/registrations/register-course')
            .send({
                courseId: 1
            });

        expect(response.status).toBe(403);

        expect(response.body.message)
            .toBe('Token không được cung cấp!');

    });

    test('IT-REG-02: Token không hợp lệ', async () => {

        const response = await request(app)
            .post('/api/registrations/register-course')
            .set('Authorization', 'Bearer fake-token')
            .send({
                courseId: 1
            });

        expect(response.status).toBe(401);

        expect(response.body.message)
            .toBe('Token không hợp lệ hoặc đã hết hạn!');

    });

    test('IT-REG-03: Môn học không tồn tại', async () => {

        const response = await request(app)
            .post('/api/registrations/register-course')
            .set('Authorization', `Bearer ${token}`)
            .send({
                courseId: 99999
            });

        expect(response.status).toBe(444);

        expect(response.body.message)
            .toBe('Môn học không tồn tại!');

    });
    test('IT-REG-04: Từ chối đăng ký do trùng lịch', async () => {

    const response = await request(app)
        .post('/api/registrations/register-course')
        .set('Authorization', `Bearer ${token}`)
        .send({
            courseId: 1
        });

    expect(response.status).toBe(400);

    expect(response.body.message)
        .toBe('Trùng lịch học môn khác vào ngày Monday!');

});
test('IT-REG-05: Đăng ký môn đã đăng ký', async () => {

    const response = await request(app)
        .post('/api/registrations/register-course')
        .set('Authorization', `Bearer ${token}`)
        .send({
            courseId: 2
        });
    
    expect(response.status).toBe(400);

    expect(response.body.message)
        .toBe('Bạn đã đăng ký môn học này rồi!');

});
});