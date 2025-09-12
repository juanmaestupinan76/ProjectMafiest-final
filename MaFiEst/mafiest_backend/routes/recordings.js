const express = require('express');
const router = express.Router();
const recordingsController = require('../controllers/recordings');
const { authMiddleware } = require('../utils/middleware');
const ROLES = require('../utils/roles');

router.post('/', 
    authMiddleware([ROLES.ADMIN, ROLES.TEACHER]), 
    recordingsController.createRecording
);

router.get('/', 
    authMiddleware([ROLES.ADMIN, ROLES.TEACHER, ROLES.STUDENT, ROLES.INDEPENDENT]),
    recordingsController.getRecordings
);

router.put('/:id',
    authMiddleware([ROLES.ADMIN, ROLES.TEACHER]),
    recordingsController.updateRecording
);

router.delete('/:id',
    authMiddleware([ROLES.ADMIN, ROLES.TEACHER]),
    recordingsController.deleteRecording
);

module.exports = router;