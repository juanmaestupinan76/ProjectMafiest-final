const express = require('express');
const router = express.Router();
const trackingController = require('../controllers/tracking');
const { tokenExtractor, userExtractor } = require('../utils/middleware');

// Middleware para roles combinados
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

// Middleware especial para verificar si el usuario es profesor o es el estudiante dueño del tracking
const isTeacherOrOwner = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Usuario no autenticado' });
    }
    if (req.user.role === 'docente' || (req.user.role === 'estudiante' && req.params.studentId === req.user.id.toString())) {
        next();
    } else {
        res.status(403).json({ error: 'No tienes permiso para ver este seguimiento' });
    }
};

router.post('/', 
    tokenExtractor,
    userExtractor,
    allowRoles(['docente']),
    trackingController.createTracking
);

router.get('/student/:studentId',
    tokenExtractor,
    userExtractor,
    isTeacherOrOwner,
    trackingController.getStudentTracking
);

router.get('/teacher',
    tokenExtractor,
    userExtractor,
    allowRoles(['docente']),
    trackingController.getTeacherTracking
);

router.put('/:id',
    tokenExtractor,
    userExtractor,
    allowRoles(['docente']),
    trackingController.updateTracking
);

module.exports = router;