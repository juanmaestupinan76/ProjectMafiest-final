const express = require('express');
const cors = require('cors');
const middleware = require('./utils/middleware');

// Rutas
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const groupRoutes = require('./routes/groups');
const contactRoutes = require('./routes/contacts');
const advisoryRoutes = require('./routes/advisories');
const activityRoutes = require('./routes/activities');
const activitySubmissionRoutes = require('./routes/activitySubmission');
const activityResultRoutes = require('./routes/activityResult');
const trackingRoutes = require('./routes/tracking');
const recordingRoutes = require('./routes/recordings');

const app = express();

// Middleware global
app.use(cors());
app.use(express.json());
app.use(middleware.tokenExtractor);

// Rutas API
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/advisories', advisoryRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/activities/submissions', activitySubmissionRoutes);
app.use('/api/activities/results', activityResultRoutes);
app.use('/api/tracking', trackingRoutes);
app.use('/api/recordings', recordingRoutes);

// Manejo de errores
app.use(middleware.errorHandler);

module.exports = app;
