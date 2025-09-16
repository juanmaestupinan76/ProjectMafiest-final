const User = require('./User');
const Group = require('./Group');
const Contact = require('./Contact');
const Advisory = require('./Advisory');
const Activity = require('./Activity');
const ActivityResult = require('./ActivityResult');
const ActivitySubmission = require('./ActivitySubmission');
const Recording = require('./Recording');
const Tracking = require('./Tracking');

const models = {
    User,
    Group,
    Contact,
    Advisory,
    Activity,
    ActivityResult,
    ActivitySubmission,
    Recording,
    Tracking
};

// =======================
// Establecer relaciones
// =======================

// Recordings
Recording.belongsTo(User, {
    as: 'creator',
    foreignKey: 'createdById'
});

// Tracking
Tracking.belongsTo(User, {
    as: 'student',
    foreignKey: 'studentId'
});
Tracking.belongsTo(User, {
    as: 'teacher',
    foreignKey: 'teacherId'
});

// Grupos
Group.hasMany(User, { foreignKey: 'grupoId' });
User.belongsTo(Group, { foreignKey: 'grupoId' });

// Relaciones de Group
Group.belongsToMany(User, {
  through: 'GrupoEstudiantes',
  as: 'estudiantes',
  foreignKey: 'grupoId',
  otherKey: 'estudianteId'
});

Group.belongsToMany(User, {
  through: 'GrupoDocentes',
  as: 'docentes',
  foreignKey: 'grupoId',
  otherKey: 'docenteId'
});

// Contacto
User.hasMany(Contact, { foreignKey: 'usuarioId' });
Contact.belongsTo(User, { foreignKey: 'usuarioId' });

// Asesorías
User.hasMany(Advisory, { foreignKey: 'usuarioId' });
Advisory.belongsTo(User, { foreignKey: 'usuarioId' });

// Actividades
Activity.belongsTo(User, { foreignKey: 'docenteId' });
Activity.belongsTo(Group, { foreignKey: 'grupoId' });
User.hasMany(Activity, { foreignKey: 'docenteId' });
Group.hasMany(Activity, { foreignKey: 'grupoId' });

// Resultados de actividades
ActivityResult.belongsTo(User, { foreignKey: 'estudianteId' });
ActivityResult.belongsTo(Activity, { foreignKey: 'actividadId' });
User.hasMany(ActivityResult, { foreignKey: 'estudianteId' });
Activity.hasMany(ActivityResult, { foreignKey: 'actividadId' });

// Entregas de actividades
ActivitySubmission.belongsTo(User, { foreignKey: 'estudianteId' });
ActivitySubmission.belongsTo(Activity, { foreignKey: 'actividadId' });
User.hasMany(ActivitySubmission, { foreignKey: 'estudianteId' });
Activity.hasMany(ActivitySubmission, { foreignKey: 'actividadId' });

module.exports = models;
