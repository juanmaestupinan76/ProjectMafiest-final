const Activity = require("../models/Activity");
const { Group, User, ActivitySubmission, ActivityResult } = require("../models");
const { Op } = require("sequelize");

const activityController = {
  // Obtener actividades según el rol y grupo del usuario
  async getActivities(req, res) {
    try {
      let activities;
      const include = [
        {
          model: User,
          as: 'teacher',
          attributes: ['id', 'name']
        },
        {
          model: Group,
          attributes: ['id', 'name']
        }
      ];

      if (req.user.role === 'estudiante') {
        // Estudiantes solo ven actividades de sus grupos
        activities = await Activity.findAll({
          include,
          where: {
            groupId: {
              [Op.in]: req.user.groups.map(g => g.id)
            },
            status: 'active'
          }
        });
      } else if (req.user.role === 'docente') {
        // Profesores ven sus propias actividades
        activities = await Activity.findAll({
          include,
          where: {
            teacherId: req.user.id
          }
        });
      } else {
        // Administradores ven todas
        activities = await Activity.findAll({ include });
      }

      // Agregar información de entregas para profesores
      if (req.user.role === 'docente') {
        activities = await Promise.all(activities.map(async (activity) => {
          const submissions = await ActivitySubmission.count({
            where: { activityId: activity.id }
          });
          const graded = await ActivityResult.count({
            where: { 
              submissionId: {
                [Op.in]: (await ActivitySubmission.findAll({
                  where: { activityId: activity.id },
                  attributes: ['id']
                })).map(s => s.id)
              }
            }
          });
          return {
            ...activity.toJSON(),
            submissionsCount: submissions,
            gradedCount: graded
          };
        }));
      }

      res.json({
        success: true,
        data: activities
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: "Error al obtener actividades",
        message: error.message 
      });
    }
  },

  async getActivityById(req, res) {
    try {
      const activity = await Activity.findByPk(req.params.id);
      if (!activity) return res.status(404).json({ error: "Actividad no encontrada" });
      res.json(activity);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener la actividad" });
    }
  },

  async createActivity(req, res) {
    try {
      if (req.user.role !== "docente" && req.user.role !== "administrador") {
        return res.status(403).json({ 
          success: false,
          error: "No autorizado para crear actividades" 
        });
      }

      // Validar que el grupo existe y el profesor pertenece a él
      const group = await Group.findByPk(req.body.groupId);
      if (!group) {
        return res.status(404).json({ 
          success: false,
          error: "Grupo no encontrado" 
        });
      }

      if (req.user.role === "docente") {
        const isTeacherInGroup = await group.hasDocente(req.user.id);
        if (!isTeacherInGroup) {
          return res.status(403).json({ 
            success: false,
            error: "No eres profesor de este grupo" 
          });
        }
      }

      const activity = await Activity.create({
        ...req.body,
        teacherId: req.user.id,
        status: 'active'
      });

      res.status(201).json({
        success: true,
        message: "Actividad creada exitosamente",
        data: activity
      });
    } catch (error) {
      if (error.name === 'SequelizeValidationError') {
        return res.status(400).json({
          success: false,
          error: "Error de validación",
          errors: error.errors.map(e => e.message)
        });
      }
      res.status(500).json({ 
        success: false,
        error: "Error al crear la actividad",
        message: error.message 
      });
    }
  },

  async updateActivity(req, res) {
    try {
      if (req.user.role !== "docente" && req.user.role !== "administrador") {
        return res.status(403).json({ error: "No autorizado para actualizar actividades" });
      }

      const activity = await Activity.findByPk(req.params.id);
      if (!activity) return res.status(404).json({ error: "Actividad no encontrada" });

      await activity.update(req.body);
      res.json(activity);
    } catch (error) {
      res.status(500).json({ error: "Error al actualizar la actividad" });
    }
  },

  async deleteActivity(req, res) {
    try {
      if (req.user.role !== "docente" && req.user.role !== "administrador") {
        return res.status(403).json({ error: "No autorizado para eliminar actividades" });
      }

      const activity = await Activity.findByPk(req.params.id);
      if (!activity) return res.status(404).json({ error: "Actividad no encontrada" });

      await activity.destroy();
      res.json({ message: "Actividad eliminada" });
    } catch (error) {
      res.status(500).json({ error: "Error al eliminar la actividad" });
    }
  },
};

module.exports = activityController;
