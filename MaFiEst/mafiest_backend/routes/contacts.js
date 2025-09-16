const express = require('express');
const router = express.Router();
const contactsController = require('../controllers/contacts');
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
    contactsController.getAllContacts
);

router.post('/',
    tokenExtractor,
    userExtractor,
    allowRoles(['administrador', 'docente']),
    contactsController.createContact
);

router.get('/:id',
    tokenExtractor,
    userExtractor,
    allowRoles(['administrador', 'docente']),
    contactsController.getContactById
);

router.put('/:id',
    tokenExtractor,
    userExtractor,
    allowRoles(['administrador', 'docente']),
    contactsController.updateContact
);

router.delete('/:id',
    tokenExtractor,
    userExtractor,
    allowRoles(['administrador', 'docente']),
    contactsController.deleteContact
);

module.exports = router;