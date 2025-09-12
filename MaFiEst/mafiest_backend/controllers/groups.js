const { Group, User } = require("../models");
const { validateRole } = require("../utils/middleware");
const { Op } = require("sequelize");

const groupController = {
  // Crear un grupo
  async createGroup(req, res) {
    try {
      const { name, description } = req.body;
      
      // Validar que el usuario es admin
      if (!validateRole(req.user, ['admin'])) {
        return res.status(403).json({ message: "No tienes permisos para crear grupos" });
      }

      const group = await Group.create({
        name,
        description,
        createdBy: req.user.id
      });

      res.status(201).json({
        success: true,
        message: "Grupo creado exitosamente",
        data: group
      });
    } catch (error) {
      if (error.name === 'SequelizeValidationError') {
        return res.status(400).json({
          success: false,
          message: "Error de validación",
          errors: error.errors.map(e => e.message)
        });
      }
      res.status(500).json({ 
        success: false,
        message: "Error al crear el grupo",
        error: error.message 
      });
    }
  },

  // Obtener todos los grupos con paginación y filtros
  async getAllGroups(req, res) {
    try {
      const { 
        page = 1, 
        limit = 10, 
        search = '', 
        sortBy = 'name', 
        order = 'ASC' 
      } = req.query;

      const offset = (page - 1) * limit;
      
      const whereClause = search ? {
        [Op.or]: [
          { name: { [Op.iLike]: `%${search}%` } },
          { description: { [Op.iLike]: `%${search}%` } }
        ]
      } : {};

      const { count, rows: groups } = await Group.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: User,
            as: "estudiantes",
            attributes: ["id", "name", "email"],
            through: { attributes: [] }
          },
          {
            model: User,
            as: "docentes",
            attributes: ["id", "name", "email"],
            through: { attributes: [] }
          },
          {
            model: User,
            as: "creator",
            attributes: ["id", "name"]
          }
        ],
        order: [[sortBy, order]],
        limit: parseInt(limit),
        offset: parseInt(offset)
      });

      res.json({
        success: true,
        data: groups,
        pagination: {
          total: count,
          pages: Math.ceil(count / limit),
          currentPage: parseInt(page),
          limit: parseInt(limit)
        }
      });
    } catch (error) {
      res.status(500).json({ 
        success: false,
        message: "Error al obtener los grupos",
        error: error.message 
      });
    }
  },

  // Obtener un grupo por ID
  async getGroupById(req, res) {
    try {
      const group = await Group.findByPk(req.params.id);
      if (!group) {
        return res.status(404).json({ message: "Grupo no encontrado" });
      }
      res.status(200).json(group);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Actualizar un grupo
  async updateGroup(req, res) {
    try {
      const { id } = req.params;
      const { name, description } = req.body;

      if (!validateRole(req.user, ['admin'])) {
        return res.status(403).json({ message: "No tienes permisos para actualizar grupos" });
      }

      const group = await Group.findByPk(id);
      if (!group) {
        return res.status(404).json({ message: "Grupo no encontrado" });
      }

      await group.update({ name, description });

      res.json({
        success: true,
        message: "Grupo actualizado exitosamente",
        data: group
      });
    } catch (error) {
      if (error.name === 'SequelizeValidationError') {
        return res.status(400).json({
          success: false,
          message: "Error de validación",
          errors: error.errors.map(e => e.message)
        });
      }
      res.status(500).json({ 
        success: false, 
        message: error.message 
      });
    }
  },

  // Eliminar un grupo (soft delete)
  async deleteGroup(req, res) {
    try {
      const { id } = req.params;

      if (!validateRole(req.user, ['admin'])) {
        return res.status(403).json({ message: "No tienes permisos para eliminar grupos" });
      }

      const group = await Group.findByPk(id);
      if (!group) {
        return res.status(404).json({ message: "Grupo no encontrado" });
      }

      await group.destroy(); // Soft delete debido a paranoid: true

      res.json({
        success: true,
        message: "Grupo eliminado exitosamente"
      });
    } catch (error) {
      res.status(500).json({ 
        success: false,
        message: "Error al eliminar el grupo",
        error: error.message 
      });
    }
  },

  // Gestionar miembros del grupo
  async manageMember(req, res) {
    try {
      const { groupId } = req.params;
      const { userId, role, action } = req.body; // action puede ser 'add' o 'remove'

      if (!validateRole(req.user, ['admin'])) {
        return res.status(403).json({ message: "No tienes permisos para gestionar miembros" });
      }

      const group = await Group.findByPk(groupId);
      const user = await User.findByPk(userId);

      if (!group || !user) {
        return res.status(404).json({ message: "Grupo o usuario no encontrado" });
      }

      // Validar que el rol del usuario coincida con el rol solicitado
      if ((role === 'estudiante' && user.role !== 'student') || 
          (role === 'docente' && user.role !== 'teacher')) {
        return res.status(400).json({ 
          message: "El rol del usuario no coincide con el rol solicitado" 
        });
      }

      const association = role === 'estudiante' ? 'estudiantes' : 'docentes';
      const method = action === 'add' ? 'add' : 'remove';

      await group[`${method}${association.charAt(0).toUpperCase() + association.slice(1)}`](user);

      res.json({
        success: true,
        message: `Usuario ${action === 'add' ? 'añadido al' : 'removido del'} grupo exitosamente`
      });
    } catch (error) {
      res.status(500).json({ 
        success: false,
        message: "Error al gestionar miembro del grupo",
        error: error.message 
      });
    }
  },

  // Obtener miembros de un grupo
  async getGroupMembers(req, res) {
    try {
      const { id } = req.params;

      const group = await Group.findByPk(id, {
        include: [
          {
            model: User,
            as: "estudiantes",
            attributes: ["id", "name", "email"],
            through: { attributes: [] }
          },
          {
            model: User,
            as: "docentes",
            attributes: ["id", "name", "email"],
            through: { attributes: [] }
          }
        ],
      });

      if (!group) {
        return res.status(404).json({ message: "Grupo no encontrado" });
      }

      res.json({
        success: true,
        data: {
          estudiantes: group.estudiantes,
          docentes: group.docentes
        }
      });
    } catch (error) {
      res.status(500).json({ 
        success: false,
        message: "Error al obtener miembros del grupo",
        error: error.message 
      });
    }
  },

  // Obtener usuarios disponibles para agregar al grupo
  async getAvailableUsers(req, res) {
    try {
      const { role } = req.query;
      const { id: groupId } = req.params;

      const group = await Group.findByPk(groupId);
      if (!group) {
        return res.status(404).json({ message: "Grupo no encontrado" });
      }

      // Obtener IDs de usuarios ya en el grupo
      const currentMembers = role === 'student' 
        ? await group.getEstudiantes({ attributes: ['id'] })
        : await group.getDocentes({ attributes: ['id'] });
      
      const currentMemberIds = currentMembers.map(member => member.id);

      // Buscar usuarios disponibles
      const availableUsers = await User.findAll({
        where: {
          role: role === 'student' ? 'student' : 'teacher',
          id: {
            [Op.notIn]: currentMemberIds
          }
        },
        attributes: ['id', 'name', 'email']
      });

      res.json({
        success: true,
        data: availableUsers
      });
    } catch (error) {
      res.status(500).json({ 
        success: false,
        message: "Error al obtener usuarios disponibles",
        error: error.message 
      });
    }
  }
};

module.exports = groupController;
