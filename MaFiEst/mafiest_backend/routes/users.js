const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users');
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
    allowRoles(['administrador']),
    usersController.getAllUsers
);

router.get('/:id',
    tokenExtractor,
    userExtractor,
    allowRoles(['administrador', 'docente']),
    usersController.getUserById
);

router.put('/:id',
    tokenExtractor,
    userExtractor,
    allowRoles(['administrador']),
    usersController.updateUser
);

router.delete('/:id',
    tokenExtractor,
    userExtractor,
    allowRoles(['administrador']),
    usersController.deleteUser
);

module.exports = router;