const express = require('express');
const router = express.Router();
const recordingsController = require('../controllers/recordings');
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

router.post('/', 
    tokenExtractor,
    userExtractor,
    allowRoles(['administrador', 'docente']), 
    recordingsController.createRecording
);

router.get('/',
    tokenExtractor,
    userExtractor,
    allowRoles(['administrador', 'docente', 'estudiante', 'independiente']),
    recordingsController.getRecordings
);

router.put('/:id',
    tokenExtractor,
    userExtractor,
    allowRoles(['administrador', 'docente']),
    recordingsController.updateRecording
);

router.delete('/:id',
    tokenExtractor,
    userExtractor,
    allowRoles(['administrador', 'docente']),
    recordingsController.deleteRecording
);

module.exports = router;