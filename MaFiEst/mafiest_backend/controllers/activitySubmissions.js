const { ActivitySubmission, Activity, User, ActivityResult } = require("../models");
const { Op, Sequelize: sequelize } = require("sequelize");

const activitySubmissionController = {
  async getActivitySubmissions(req, res) {
    try {
      const { activityId } = req.query;
      let where = {};
      let include = [
        {
          model: Activity,
          attributes: ['id', 'title', 'deadline', 'maxScore']
        },
        {
          model: User,
          as: 'student',
          attributes: ['id', 'name']
        },
        {
          model: ActivityResult,
          attributes: ['grade', 'feedback', 'gradedAt', 'status']
        }
      ];

      if (activityId) {
        where.activityId = activityId;
      }

      if (req.user.role === "student") {
        where.studentId = req.user.id;
      } else if (req.user.role === "teacher") {
        // Profesores solo ven entregas de sus actividades
        where['$Activity.teacherId$'] = req.user.id;
      }

      const submissions = await ActivitySubmission.findAll({
        where,
        include,
        order: [['submittedAt', 'DESC']]
      });

      res.json({
        success: true,
        data: submissions
      });
    } catch (error) {
      res.status(500).json({ 
        success: false,
        error: "Error al obtener entregas de actividades",
        message: error.message
      });
    }
  },

  async getActivitySubmissionById(req, res) {
    try {
      const submission = await ActivitySubmission.findByPk(req.params.id);
      if (!submission) return res.status(404).json({ error: "Entrega no encontrada" });

      if (req.user.role === "estudiante" && submission.studentId !== req.user.id) {
        return res.status(403).json({ error: "No autorizado para ver esta entrega" });
      }

      res.json(submission);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener la entrega" });
    }
  },

  async createSubmission(req, res) {
    try {
      const { activityId, submissionContent } = req.body;
      
      // Validar que la actividad existe
      const activity = await Activity.findByPk(activityId);
      if (!activity) {
        return res.status(404).json({
          success: false,
          error: "Actividad no encontrada"
        });
      }

      // Verificar si ya existe una entrega para esta actividad
      const existingSubmission = await ActivitySubmission.findOne({
        where: {
          activityId,
          studentId: req.user.id
        }
      });

      if (existingSubmission) {
        return res.status(400).json({
          success: false,
          error: "Ya existe una entrega para esta actividad"
        });
      }

      // Verificar fecha límite
      if (activity.deadline && new Date() > new Date(activity.deadline)) {
        return res.status(400).json({
          success: false,
          error: "La fecha límite de entrega ha pasado"
        });
      }

      const submission = await ActivitySubmission.create({
        activityId,
        studentId: req.user.id,
        submissionContent,
        submittedAt: new Date(),
        status: 'submitted'
      });

      res.status(201).json({
        success: true,
        data: submission
      });
    } catch (error) {
      res.status(500).json({ 
        success: false,
        error: "Error al crear entrega",
        message: error.message 
      });
    }
  },

  async updateSubmission(req, res) {
    try {
      const { id } = req.params;
      const { submissionContent } = req.body;

      const submission = await ActivitySubmission.findOne({
        where: { id },
        include: [{
          model: Activity,
          attributes: ['deadline']
        }]
      });

      if (!submission) {
        return res.status(404).json({
          success: false,
          error: "Entrega no encontrada"
        });
      }

      // Solo el estudiante que creó la entrega puede actualizarla
      if (submission.studentId !== req.user.id) {
        return res.status(403).json({
          success: false,
          error: "No tienes permiso para modificar esta entrega"
        });
      }

      // Verificar fecha límite
      if (submission.Activity.deadline && new Date() > new Date(submission.Activity.deadline)) {
        return res.status(400).json({
          success: false,
          error: "No se puede actualizar la entrega después de la fecha límite"
        });
      }

      // Verificar si ya está calificada
      const hasGrade = await ActivityResult.findOne({
        where: { submissionId: id }
      });

      if (hasGrade) {
        return res.status(400).json({
          success: false,
          error: "No se puede modificar una entrega ya calificada"
        });
      }

      await submission.update({
        submissionContent,
        updatedAt: new Date()
      });

      res.json({
        success: true,
        data: submission
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: "Error al actualizar entrega",
        message: error.message
      });
    }
  },

  async deleteSubmission(req, res) {
    try {
      const { id } = req.params;

      const submission = await ActivitySubmission.findOne({
        where: { id },
        include: [{
          model: Activity,
          attributes: ['deadline']
        }]
      });

      if (!submission) {
        return res.status(404).json({
          success: false,
          error: "Entrega no encontrada"
        });
      }

      // Solo el estudiante que creó la entrega o un administrador pueden eliminarla
      if (submission.studentId !== req.user.id && req.user.role !== "admin") {
        return res.status(403).json({
          success: false,
          error: "No tienes permiso para eliminar esta entrega"
        });
      }

      // Verificar fecha límite
      if (submission.Activity.deadline && new Date() > new Date(submission.Activity.deadline)) {
        return res.status(400).json({
          success: false,
          error: "No se puede eliminar la entrega después de la fecha límite"
        });
      }

      // Verificar si ya está calificada
      const hasGrade = await ActivityResult.findOne({
        where: { submissionId: id }
      });

      if (hasGrade) {
        return res.status(400).json({
          success: false,
          error: "No se puede eliminar una entrega ya calificada"
        });
      }

      await submission.destroy();

      res.json({
        success: true,
        message: "Entrega eliminada exitosamente"
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: "Error al eliminar entrega",
        message: error.message
      });
    }
  },

  async getSubmissionStats(req, res) {
    try {
      const { activityId } = req.query;
      
      const where = activityId ? { activityId } : {};

      if (req.user.role === "teacher") {
        where['$Activity.teacherId$'] = req.user.id;
      }

      const stats = await ActivitySubmission.findAndCountAll({
        where,
        include: [
          {
            model: Activity,
            attributes: ['teacherId']
          },
          {
            model: ActivityResult,
            attributes: ['status', 'grade']
          }
        ],
        attributes: [
          'status',
          [sequelize.fn('COUNT', sequelize.col('ActivitySubmission.id')), 'count'],
          [sequelize.fn('AVG', sequelize.col('ActivityResult.grade')), 'averageGrade']
        ],
        group: ['status']
      });

      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: "Error al obtener estadísticas de entregas",
        message: error.message
      });
    }
  }
};

module.exports = activitySubmissionController;
