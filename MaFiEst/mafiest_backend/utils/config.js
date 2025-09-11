require("dotenv").config();

module.exports = {
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || "development",
  DB: {
    HOST: process.env.DB_HOST || "localhost",
    USER: process.env.DB_USER || "postgres",
    PASSWORD: process.env.DB_PASSWORD || "mafiest",
    NAME: process.env.DB_NAME || "mafiest_db",
    PORT: process.env.DB_PORT || 5432,
  },
  JWT_SECRET: process.env.JWT_SECRET || "super_secreto",
  JWT_EXPIRATION: process.env.JWT_EXPIRATION || "1d",
};
