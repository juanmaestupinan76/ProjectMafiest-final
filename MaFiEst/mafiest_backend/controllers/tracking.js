const Tracking = require('../models/Tracking');

exports.createTracking = async (req, res) => {
    try {
        const { studentId, comments } = req.body;
        const tracking = new Tracking({
            student: studentId,
            teacher: req.user.id,
            comments
        });
        await tracking.save();
        res.status(201).json(tracking);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getStudentTracking = async (req, res) => {
    try {
        const tracking = await Tracking.find({
            student: req.params.studentId
        })
        .populate('teacher', 'name')
        .sort('-date');
        res.json(tracking);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getTeacherTracking = async (req, res) => {
    try {
        const tracking = await Tracking.find({
            teacher: req.user.id
        })
        .populate('student', 'name')
        .sort('-date');
        res.json(tracking);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateTracking = async (req, res) => {
    try {
        const tracking = await Tracking.findByIdAndUpdate(
            req.params.id,
            { comments: req.body.comments },
            { new: true }
        );
        if (!tracking) {
            return res.status(404).json({ message: 'Seguimiento no encontrado' });
        }
        res.json(tracking);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};