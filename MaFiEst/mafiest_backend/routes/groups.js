const express = require('express');
const router = express.Router();
const groupsController = require('../controllers/groups');
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
    groupsController.getAllGroups
);

router.post('/',
    tokenExtractor,
    userExtractor,
    allowRoles(['administrador']),
    groupsController.createGroup
);

router.get('/:id',
    tokenExtractor,
    userExtractor,
    allowRoles(['administrador', 'docente']),
    groupsController.getGroupById
);

router.put('/:id',
    tokenExtractor,
    userExtractor,
    allowRoles(['administrador']),
    groupsController.updateGroup
);

router.delete('/:id',
    tokenExtractor,
    userExtractor,
    allowRoles(['administrador']),
    groupsController.deleteGroup
);

router.post('/:id/members',
    tokenExtractor,
    userExtractor,
    allowRoles(['administrador']),
    groupsController.manageMember
);

router.get('/:id/members',
    tokenExtractor,
    userExtractor,
    allowRoles(['administrador', 'docente']),
    groupsController.getGroupMembers
);

router.get('/:id/available-users',
    tokenExtractor,
    userExtractor,
    allowRoles(['administrador']),
    groupsController.getAvailableUsers
);

module.exports = router;