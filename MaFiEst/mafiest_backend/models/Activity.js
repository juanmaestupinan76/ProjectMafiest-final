const { Model, DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

class Activity extends Model {}

Activity.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  type: {
    type: DataTypes.ENUM('examen', 'taller', 'tarea'),
    allowNull: false
  },
  maxScore: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 5.0,
    validate: {
      min: 0,
      max: 5
    }
  },
  deadline: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      isAfter: new Date().toISOString() // La fecha límite debe ser futura
    }
  },
  fileUrl: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isUrl: true
    }
  },
  teacherId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  groupId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Groups',
      key: 'id'
    }
  },
  status: {
    type: DataTypes.ENUM('active', 'closed'),
    defaultValue: 'active',
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'Activity',
  tableName: 'Activities',
  timestamps: true
});

module.exports = Activity;
