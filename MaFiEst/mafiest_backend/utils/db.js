const { Sequelize } = require('sequelize');
const { Pool } = require('pg');
const config = require('./config');

// Configuración del pool de conexiones PostgreSQL
const pool = new Pool({
    user: config.DB_USER,
    host: config.DB_HOST,
    database: config.DB_NAME,
    password: config.DB_PASSWORD,
    port: config.DB_PORT || 5432,
    max: 20, // máximo número de clientes en el pool
    idleTimeoutMillis: 30000, // tiempo máximo que un cliente puede estar inactivo
    connectionTimeoutMillis: 2000, // tiempo máximo para establecer una conexión
});

// Crear una instancia de Sequelize
const sequelize = new Sequelize(config.DB_NAME, config.DB_USER, config.DB_PASSWORD, {
    host: config.DB_HOST,
    dialect: 'postgres',
    logging: false,
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
        // Probar conexión de Sequelize
        await sequelize.authenticate();
        console.log('Conexión Sequelize establecida correctamente.');
        
        // Probar conexión del pool
        const client = await pool.connect();
        await client.query('SELECT NOW()');
        client.release();
        console.log('Pool de conexiones PostgreSQL establecido correctamente.');
    } catch (error) {
        console.error('Error al conectar a la base de datos:', error);
    }
};

testConnection();

module.exports = {
    sequelize,
    pool
};