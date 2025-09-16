const express = require('express');
const router = express.Router();
const activitySubmissionController = require('../controllers/activitySubmissions');
const { tokenExtractor, userExtractor } = require('../utils/middleware');

const allowRoles = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Usuario no autenticado' });
        }
        if (roles.includes(req.user.role)) {
            next();
        } else {
            res.status(403).json({ error: 'No tienes permiso para realizar esta acción' });
        }
    };
};

router.post('/', 
    tokenExtractor,
    userExtractor,
    allowRoles(['estudiante']),
    activitySubmissionController.createSubmission
);

router.get('/',
    tokenExtractor,
    userExtractor,
    allowRoles(['docente', 'estudiante']),
    activitySubmissionController.getActivitySubmissions
);

router.get('/:id',
    tokenExtractor,
    userExtractor,
    allowRoles(['docente', 'estudiante']),
    activitySubmissionController.getActivitySubmissionById
);

router.put('/:id',
    tokenExtractor,
    userExtractor,
    allowRoles(['estudiante']),
    activitySubmissionController.updateSubmission
);

router.delete('/:id',
    tokenExtractor,
    userExtractor,
    allowRoles(['estudiante', 'administrador']),
    activitySubmissionController.deleteSubmission
);

module.exports = router;