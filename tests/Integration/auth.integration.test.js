const request = require('supertest');
const app = require('../../server');

describe('Auth Integration Test', () => {

    test('IT-AUTH-01: Login thành công', async () => {

        const response = await request(app)
            .post('/api/auth/login')
            .send({
                username: 'admin1',
                password: '123456'
            });

        expect(response.status).toBe(200);

        expect(response.body.message)
            .toBe('Đăng nhập thành công');

        expect(response.body.token)
            .toBeDefined();

        expect(response.body.role)
            .toBe('admin');

    });
    test('IT-AUTH-02: Sai mật khẩu', async () => {

    const response = await request(app)
        .post('/api/auth/login')
        .send({
            username: 'admin1',
            password: 'saimatkhau'
        });

    expect(response.status).toBe(401);

    expect(response.body.message)
        .toBe('Mật khẩu không chính xác!');

});
test('IT-AUTH-03: Username không tồn tại', async () => {

    const response = await request(app)
        .post('/api/auth/login')
        .send({
            username: 'khong_ton_tai_12345',
            password: '123456'
        });

    expect(response.status).toBe(401);

    expect(response.body.message)
        .toBe('Tên đăng nhập không chính xác!');

});
test('IT-AUTH-04: Thiếu dữ liệu đăng nhập', async () => {

    const response = await request(app)
        .post('/api/auth/login')
        .send({
            username: 'admin1'
        });

    expect(response.status).toBe(400);

    expect(response.body.message)
        .toBe('Vui lòng điền đầy đủ thông tin!');

});
});