const Recording = require('../models/Recording');

exports.createRecording = async (req, res) => {
    try {
        const { title, description, driveLink, imageUrl, forIndependents } = req.body;
        const recording = new Recording({
            title,
            description,
            driveLink,
            imageUrl,
            createdBy: req.user.id,
            forIndependents
        });
        await recording.save();
        res.status(201).json(recording);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getRecordings = async (req, res) => {
    try {
        let query = {};
        if (req.user.role === 'independiente') {
            query.forIndependents = true;
        } else if (req.user.role === 'estudiante') {
            query.forIndependents = false;
        }
        const recordings = await Recording.find(query);
        res.json(recordings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateRecording = async (req, res) => {
    try {
        const recording = await Recording.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!recording) {
            return res.status(404).json({ message: 'Grabación no encontrada' });
        }
        res.json(recording);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteRecording = async (req, res) => {
    try {
        // Primero buscamos la grabación
        const recording = await Recording.findById(req.params.id);
        
        if (!recording) {
            return res.status(404).json({ 
                success: false,
                message: 'Grabación no encontrada' 
            });
        }

        // Verificar permisos
        if (recording.forIndependents) {
            // Solo administradores pueden eliminar grabaciones para independientes
            if (req.user.role !== 'admin') {
                return res.status(403).json({
                    success: false,
                    message: 'Solo los administradores pueden eliminar grabaciones para independientes'
                });
            }
        } else {
            // Para grabaciones de estudiantes
            if (req.user.role !== 'admin' && req.user.id !== recording.createdBy.toString()) {
                return res.status(403).json({
                    success: false,
                    message: 'Solo el docente que creó la grabación o un administrador pueden eliminarla'
                });
            }
        }

        // Si llegamos aquí, tiene permisos para eliminar
        await Recording.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: 'Grabación eliminada exitosamente'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};