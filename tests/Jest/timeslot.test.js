const TimeSlotController = require('../../controllers/timeslotController');
const TimeSlotModel = require('../../models/timeslotModel');

jest.mock('../../models/timeslotModel');

describe('TimeSlot Controller', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });
    test('TC-TIME-01: Lấy danh sách lịch học thành công', async () => {

    TimeSlotModel.findAll.mockResolvedValue([
        {
            timeslot_id: 1,
            course_id: 1,
            day_of_week: 'Monday',
            start_time: '07:00',
            end_time: '09:00',
            room: 'A101'
        }
    ]);

    const req = {};

    const res = {
        json: jest.fn()
    };

    await TimeSlotController.getAll(req, res);

    expect(TimeSlotModel.findAll)
        .toHaveBeenCalled();

    expect(res.json)
        .toHaveBeenCalledWith([
            {
                timeslot_id: 1,
                course_id: 1,
                day_of_week: 'Monday',
                start_time: '07:00',
                end_time: '09:00',
                room: 'A101'
            }
        ]);

});
test('TC-TIME-02: Tạo lịch học thành công', async () => {

    TimeSlotModel.findExactDuplicate.mockResolvedValue(null);

    TimeSlotModel.findRoomConflict.mockResolvedValue(null);

    TimeSlotModel.create.mockResolvedValue(1);

    const req = {
        body: {
            courseId: 1,
            dayOfWeek: 'Monday',
            startTime: '07:00',
            endTime: '09:00',
            room: 'A101'
        }
    };

    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
    };

    await TimeSlotController.create(req, res);

    expect(TimeSlotModel.findExactDuplicate)
        .toHaveBeenCalledWith(
            'Monday',
            '07:00',
            '09:00'
        );

    expect(TimeSlotModel.findRoomConflict)
        .toHaveBeenCalledWith(
            'Monday',
            '07:00',
            '09:00',
            'A101'
        );

    expect(TimeSlotModel.create)
        .toHaveBeenCalledWith(
            1,
            'Monday',
            '07:00',
            '09:00',
            'A101'
        );

    expect(res.status)
        .toHaveBeenCalledWith(201);

    expect(res.json)
        .toHaveBeenCalledWith({
            message: 'Tạo lịch học thành công'
        });

});
test('TC-TIME-03: Thiếu thông tin khi tạo lịch học', async () => {

    const req = {
        body: {
            courseId: 1,
            dayOfWeek: 'Monday',
            startTime: '07:00',
            endTime: '09:00'
            // thiếu room
        }
    };

    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
    };

    await TimeSlotController.create(req, res);

    expect(res.status)
        .toHaveBeenCalledWith(400);

    expect(res.json)
        .toHaveBeenCalledWith({
            message: 'Vui lòng điền đầy đủ thông tin lịch học.'
        });

    expect(TimeSlotModel.create)
        .not.toHaveBeenCalled();

});
test('TC-TIME-04: Giờ bắt đầu lớn hơn hoặc bằng giờ kết thúc', async () => {

    const req = {
        body: {
            courseId: 1,
            dayOfWeek: 'Monday',
            startTime: '09:00',
            endTime: '09:00',
            room: 'A101'
        }
    };

    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
    };

    await TimeSlotController.create(req, res);

    expect(res.status)
        .toHaveBeenCalledWith(400);

    expect(res.json)
        .toHaveBeenCalledWith({
            message: 'Giờ bắt đầu phải nhỏ hơn giờ kết thúc.'
        });

    expect(TimeSlotModel.findExactDuplicate)
        .not.toHaveBeenCalled();

    expect(TimeSlotModel.create)
        .not.toHaveBeenCalled();

});
test('TC-TIME-05: Trùng lịch học', async () => {

    TimeSlotModel.findExactDuplicate.mockResolvedValue({
        timeslot_id: 1,
        day_of_week: 'Monday',
        start_time: '07:00',
        end_time: '09:00'
    });

    const req = {
        body: {
            courseId: 1,
            dayOfWeek: 'Monday',
            startTime: '07:00',
            endTime: '09:00',
            room: 'A101'
        }
    };

    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
    };

    await TimeSlotController.create(req, res);

    expect(res.status)
        .toHaveBeenCalledWith(400);

    expect(res.json)
        .toHaveBeenCalledWith({
            message: 'Đã tồn tại lịch học cùng ngày và thời gian bắt đầu/kết thúc.'
        });

    expect(TimeSlotModel.findRoomConflict)
        .not.toHaveBeenCalled();

    expect(TimeSlotModel.create)
        .not.toHaveBeenCalled();

});
test('TC-TIME-06: Trùng phòng học', async () => {

    TimeSlotModel.findExactDuplicate.mockResolvedValue(null);

    TimeSlotModel.findRoomConflict.mockResolvedValue({
        timeslot_id: 5,
        room: 'A101'
    });

    const req = {
        body: {
            courseId: 1,
            dayOfWeek: 'Monday',
            startTime: '07:00',
            endTime: '09:00',
            room: 'A101'
        }
    };

    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
    };

    await TimeSlotController.create(req, res);

    expect(res.status)
        .toHaveBeenCalledWith(400);

    expect(res.json)
        .toHaveBeenCalledWith({
            message: 'Phòng học đã bị trùng lịch trong cùng khung giờ.'
        });

    expect(TimeSlotModel.create)
        .not.toHaveBeenCalled();

});
test('TC-TIME-07: Cập nhật lịch học thành công', async () => {

    TimeSlotModel.update.mockResolvedValue();

    const req = {
        params: {
            id: 1
        },
        body: {
            dayOfWeek: 'Tuesday',
            startTime: '09:00',
            endTime: '11:00',
            room: 'B202'
        }
    };

    const res = {
        json: jest.fn()
    };

    await TimeSlotController.update(req, res);

    expect(TimeSlotModel.update)
        .toHaveBeenCalledWith(
            1,
            'Tuesday',
            '09:00',
            '11:00',
            'B202'
        );

    expect(res.json)
        .toHaveBeenCalledWith({
            message: 'Cập nhật lịch học thành công'
        });

});
test('TC-TIME-08: Xóa lịch học thành công', async () => {

    TimeSlotModel.delete.mockResolvedValue();

    const req = {
        params: {
            id: 1
        }
    };

    const res = {
        json: jest.fn()
    };

    await TimeSlotController.delete(req, res);

    expect(TimeSlotModel.delete)
        .toHaveBeenCalledWith(1);

    expect(res.json)
        .toHaveBeenCalledWith({
            message: 'Xóa lịch học thành công'
        });

});
test('TC-TIME-09: Lỗi lấy danh sách lịch học', async () => {

    TimeSlotModel.findAll.mockRejectedValue(
        new Error('Database Error')
    );

    const req = {};

    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
    };

    await TimeSlotController.getAll(req, res);

    expect(res.status)
        .toHaveBeenCalledWith(500);

    expect(res.json)
        .toHaveBeenCalledWith({
            message: 'Database Error'
        });

});
test('TC-TIME-10: Lỗi tạo lịch học', async () => {

    TimeSlotModel.findExactDuplicate.mockResolvedValue(null);

    TimeSlotModel.findRoomConflict.mockResolvedValue(null);

    TimeSlotModel.create.mockRejectedValue(
        new Error('Create TimeSlot Failed')
    );

    const req = {
        body: {
            courseId: 1,
            dayOfWeek: 'Monday',
            startTime: '07:00',
            endTime: '09:00',
            room: 'A101'
        }
    };

    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
    };

    await TimeSlotController.create(req, res);

    expect(res.status)
        .toHaveBeenCalledWith(500);

    expect(res.json)
        .toHaveBeenCalledWith({
            message: 'Create TimeSlot Failed'
        });

});
test('TC-TIME-11: Lỗi cập nhật lịch học', async () => {

    TimeSlotModel.update.mockRejectedValue(
        new Error('Update Failed')
    );

    const req = {
        params: {
            id: 1
        },
        body: {
            dayOfWeek: 'Tuesday',
            startTime: '09:00',
            endTime: '11:00',
            room: 'B202'
        }
    };

    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
    };

    await TimeSlotController.update(req, res);

    expect(res.status)
        .toHaveBeenCalledWith(500);

    expect(res.json)
        .toHaveBeenCalledWith({
            message: 'Update Failed'
        });

});
test('TC-TIME-12: Lỗi xóa lịch học', async () => {

    TimeSlotModel.delete.mockRejectedValue(
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

    await TimeSlotController.delete(req, res);

    expect(res.status)
        .toHaveBeenCalledWith(500);

    expect(res.json)
        .toHaveBeenCalledWith({
            message: 'Delete Failed'
        });

});
});