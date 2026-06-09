const express = require('express');
const TimeSlotController = require('../controllers/timeslotController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', verifyToken, TimeSlotController.getAll);
router.post('/', verifyToken, isAdmin, TimeSlotController.create);
router.put('/:id', verifyToken, isAdmin, TimeSlotController.update);
router.delete('/:id', verifyToken, isAdmin, TimeSlotController.delete);

module.exports = router;