const jwt = require('jsonwebtoken');
const config = require('./config');

// Extrae el token de la cabecera
const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    req.token = authorization.substring(7);
  } else {
    req.token = null;
  }
  next();
};

// Verifica el token y coloca el usuario en req.user
const userExtractor = (req, res, next) => {
  const token = req.token;
  if (token) {
    jwt.verify(token, config.JWT_SECRET, (err, decodedToken) => {
      if (err) {
        return res.status(401).json({ error: 'Token inválido o expirado' });
      }
      req.user = decodedToken; // { id, role }
      next();
    });
  } else {
    return res.status(401).json({ error: 'Token requerido' });
  }
};

// Manejador de errores
const errorHandler = (error, req, res, next) => {
  console.error(error.message);

  if (error.name === 'CastError') {
    return res.status(400).json({ error: 'ID malformado' });
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message });
  } else if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'Token inválido' });
  } else if (error.name === 'TokenExpiredError') {
    return res.status(401).json({ error: 'Token expirado' });
  }

  next(error);
};

module.exports = {
  tokenExtractor,
  userExtractor,
  errorHandler
};
