const express = require('express');
const CourseController = require('../controllers/courseController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', verifyToken, CourseController.getAll);
router.post('/', verifyToken, isAdmin, CourseController.create);
router.put('/:id', verifyToken, isAdmin, CourseController.update);
router.delete('/:id', verifyToken, isAdmin, CourseController.delete);

module.exports = router;