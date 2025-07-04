
// backend/routes.js
const express = require('express');
const router = express.Router();
const controllers = require('./controllers');

// Teacher routes
router.get('/teachers', controllers.getTeachers);
router.patch('/teachers/:teacherId/verify', controllers.updateTeacherVerification);
router.post('/teachers/:teacherId/submit-verification', controllers.submitTeacherVerificationApplication);


// Course routes
router.get('/courses', controllers.getCourses);
router.patch('/courses/:courseId/status', controllers.updateCourseStatus);

// Activity routes
router.get('/activities', controllers.getActivities);
router.patch('/activities/:activityId/status', controllers.updateActivityStatus);

module.exports = router;
