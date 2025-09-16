const express = require('express');
const router = express.Router();
const activityResultController = require('../controllers/activityResults');
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

// Obtener todos los resultados de actividades
router.get('/',
    tokenExtractor,
    userExtractor,
    allowRoles(['administrador', 'docente']),
    activityResultController.getActivityResults
);

// Obtener un resultado específico
router.get('/:id',
    tokenExtractor,
    userExtractor,
    allowRoles(['administrador', 'docente', 'estudiante']),
    activityResultController.getActivityResultById
);

// Crear un nuevo resultado
router.post('/',
    tokenExtractor,
    userExtractor,
    allowRoles(['docente']),
    activityResultController.createActivityResult
);

// Actualizar un resultado
router.put('/:id',
    tokenExtractor,
    userExtractor,
    allowRoles(['docente']),
    activityResultController.updateActivityResult
);

// Eliminar un resultado
router.delete('/:id',
    tokenExtractor,
    userExtractor,
    allowRoles(['docente', 'administrador']),
    activityResultController.deleteActivityResult
);

module.exports = router;