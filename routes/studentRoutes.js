const express = require('express');
const StudentController = require('../controllers/studentController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', verifyToken, isAdmin, StudentController.getAll);
router.post('/', verifyToken, isAdmin, StudentController.create);
router.put('/:id', verifyToken, isAdmin, StudentController.update);
router.delete('/:id', verifyToken, isAdmin, StudentController.delete);

module.exports = router;