const { Model, DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

class Group extends Model {}

Group.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El nombre del grupo no puede estar vacío'
      },
      len: {
        args: [3, 50],
        msg: 'El nombre debe tener entre 3 y 50 caracteres'
      }
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
    validate: {
      len: {
        args: [0, 500],
        msg: 'La descripción no puede exceder los 500 caracteres'
      }
    }
  },
  createdBy: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  }
}, {
  sequelize,
  modelName: 'Group',
  tableName: 'Groups',
  timestamps: true,
  paranoid: true, // Soft deletes
  indexes: [
    {
      unique: true,
      fields: ['name']
    }
  ]
});

// Definir las relaciones
Group.associate = (models) => {
  Group.belongsToMany(models.User, {
    through: 'UserGroups',
    as: 'estudiantes',
    foreignKey: 'groupId',
    otherKey: 'userId',
    scope: {
      role: 'estudiante'
    }
  });

  Group.belongsToMany(models.User, {
    through: 'UserGroups',
    as: 'docentes',
    foreignKey: 'groupId',
    otherKey: 'userId',
    scope: {
      role: 'docente'
    }
  });

  Group.belongsTo(models.User, {
    foreignKey: 'createdBy',
    as: 'creator'
  });
};

module.exports = Group;
