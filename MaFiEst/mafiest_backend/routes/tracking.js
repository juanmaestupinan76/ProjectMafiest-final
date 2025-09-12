const express = require('express');
const router = express.Router();
const trackingController = require('../controllers/tracking');
const { authMiddleware } = require('../utils/middleware');
const ROLES = require('../utils/roles');

router.post('/', 
    authMiddleware([ROLES.TEACHER]), 
    trackingController.createTracking
);

router.get('/student/:studentId',
    authMiddleware([ROLES.TEACHER, ROLES.STUDENT]),
    trackingController.getStudentTracking
);

router.get('/teacher',
    authMiddleware([ROLES.TEACHER]),
    trackingController.getTeacherTracking
);

router.put('/:id',
    authMiddleware([ROLES.TEACHER]),
    trackingController.updateTracking
);

module.exports = router;