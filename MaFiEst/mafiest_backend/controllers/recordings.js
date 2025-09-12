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
        if (req.user.role === 'independent') {
            query.forIndependents = true;
        } else if (req.user.role === 'student') {
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
        const recording = await Recording.findByIdAndDelete(req.params.id);
        if (!recording) {
            return res.status(404).json({ message: 'Grabación no encontrada' });
        }
        res.json({ message: 'Grabación eliminada' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};