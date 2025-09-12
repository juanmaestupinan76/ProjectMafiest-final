const { Model, DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

class ActivityResult extends Model {}

ActivityResult.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  submissionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'ActivitySubmissions',
      key: 'id'
    }
  },
  grade: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      min: 0,
      max: 5,
      isValidGrade(value) {
        if (value > this.activity.maxScore) {
          throw new Error('La nota no puede ser mayor al puntaje máximo de la actividad');
        }
      }
    }
  },
  feedback: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  feedbackUrl: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isUrl: true
    }
  },
  gradedBy: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  gradedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  status: {
    type: DataTypes.ENUM('pending', 'graded', 'disputed'),
    defaultValue: 'pending',
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'ActivityResult',
  tableName: 'ActivityResults',
  timestamps: true
});

module.exports = ActivityResult;
