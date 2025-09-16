require('dotenv').config();
const db = require('./utils/db');
const logger = require('./utils/logger');

const app = require('./app');

const PORT = process.env.PORT || 3000;

// Conexión a BD y arranque del servidor
const startServer = async () => {
  try {
    await db.authenticate();
    logger.info('✅ Database connection established successfully.');

    // Solo sincronizar en desarrollo
    if (process.env.NODE_ENV === 'development') {
      await db.sync({ alter: true });
      logger.info('🛠️ Database synced (development mode)');
    }

    app.listen(PORT, () => {
      logger.info(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    logger.error('❌ Unable to connect to the database:', error);
    process.exit(1); // detener el proceso si no conecta
  }
};

startServer();
