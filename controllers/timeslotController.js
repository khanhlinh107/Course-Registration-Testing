const TimeSlotModel = require('../models/timeslotModel');

const TimeSlotController = {
    getAll: async (req, res) => {
        try {
            const slots = await TimeSlotModel.findAll();
            res.json(slots);
        } catch (e) { res.status(500).json({ message: e.message }); }
    },
    create: async (req, res) => {
        try {
            const { courseId, dayOfWeek, startTime, endTime, room } = req.body;
            if (!courseId || !dayOfWeek || !startTime || !endTime || !room) {
                return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin lịch học.' });
            }
            if (startTime >= endTime) {
                return res.status(400).json({ message: 'Giờ bắt đầu phải nhỏ hơn giờ kết thúc.' });
            }
            const duplicateSlot = await TimeSlotModel.findExactDuplicate(dayOfWeek, startTime, endTime);
            if (duplicateSlot) {
                return res.status(400).json({ message: 'Đã tồn tại lịch học cùng ngày và thời gian bắt đầu/kết thúc.' });
            }
            const roomConflict = await TimeSlotModel.findRoomConflict(dayOfWeek, startTime, endTime, room);
            if (roomConflict) {
                return res.status(400).json({ message: 'Phòng học đã bị trùng lịch trong cùng khung giờ.' });
            }
            await TimeSlotModel.create(courseId, dayOfWeek, startTime, endTime, room);
            res.status(201).json({ message: 'Tạo lịch học thành công' });
        } catch (e) { res.status(500).json({ message: e.message }); }
    },
    update: async (req, res) => {
        try {
            const { dayOfWeek, startTime, endTime, room } = req.body;
            await TimeSlotModel.update(req.params.id, dayOfWeek, startTime, endTime, room);
            res.json({ message: 'Cập nhật lịch học thành công' });
        } catch (e) { res.status(500).json({ message: e.message }); }
    },
    delete: async (req, res) => {
        try {
            await TimeSlotModel.delete(req.params.id);
            res.json({ message: 'Xóa lịch học thành công' });
        } catch (e) { res.status(500).json({ message: e.message }); }
    }
};

module.exports = TimeSlotController;