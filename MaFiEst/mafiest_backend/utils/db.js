const { Sequelize } = require('sequelize');
const config = require('./config');

// Crear una instancia de Sequelize
const sequelize = new Sequelize(String(config.DB_NAME), String(config.DB_USER), String(config.DB_PASSWORD), {
    host: config.DB_HOST,
    dialect: 'postgres',
    port: config.DB_PORT || 5432,
    logging: config.NODE_ENV === 'development' ? console.log : false,
    define: {
        timestamps: true,
        underscored: true,
        freezeTableName: false,
        charset: 'utf8',
        dialectOptions: {
            collate: 'utf8_general_ci'
        }
    },
    pool: {
        max: 20,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

// Probar la conexión a la base de datos
const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('Conexión a la base de datos establecida correctamente.');
    } catch (error) {
        console.error('Error al conectar a la base de datos:', error);
    }
};

testConnection();

module.exports = sequelize;