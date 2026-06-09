const express = require('express');
const RegistrationController = require('../controllers/registrationController');
const { verifyToken, isStudent, isAdmin } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/student-dashboard', verifyToken, isStudent, RegistrationController.getStudentDashboard);
router.post('/register-course', verifyToken, isStudent, RegistrationController.registerCourse);
router.post('/drop-course', verifyToken, isStudent, RegistrationController.dropCourse);
router.get('/admin-stats', verifyToken, isAdmin, RegistrationController.getAdminStats);

module.exports = router;