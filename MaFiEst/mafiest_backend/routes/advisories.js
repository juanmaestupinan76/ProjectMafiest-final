const express = require('express');
const router = express.Router();
const advisoriesController = require('../controllers/advisories');
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

router.get('/',
    tokenExtractor,
    userExtractor,
    allowRoles(['administrador', 'docente']),
    advisoriesController.getAllAdvisories
);

router.post('/',
    tokenExtractor,
    userExtractor,
    allowRoles(['docente']),
    advisoriesController.createAdvisory
);

router.get('/:id',
    tokenExtractor,
    userExtractor,
    allowRoles(['administrador', 'docente']),
    advisoriesController.getAdvisoryById
);

router.put('/:id',
    tokenExtractor,
    userExtractor,
    allowRoles(['docente']),
    advisoriesController.updateAdvisory
);

router.delete('/:id',
    tokenExtractor,
    userExtractor,
    allowRoles(['docente']),
    advisoriesController.deleteAdvisory
);

module.exports = router;