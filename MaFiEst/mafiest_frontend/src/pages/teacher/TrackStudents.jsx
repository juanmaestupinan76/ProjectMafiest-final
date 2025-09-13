import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/pages/tracking.css';

const TrackStudents = () => {
    const [students, setStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [comments, setComments] = useState('');
    const [trackingHistory, setTrackingHistory] = useState([]);

    useEffect(() => {
        loadStudents();
    }, []);

    const loadStudents = async () => {
        try {
            const response = await axios.get('/api/users/students');
            setStudents(response.data);
        } catch (error) {
            console.error('Error al cargar estudiantes:', error);
        }
    };

    const loadTrackingHistory = async (studentId) => {
        try {
            const response = await axios.get(`/api/tracking/student/${studentId}`);
            setTrackingHistory(response.data);
        } catch (error) {
            console.error('Error al cargar historial:', error);
        }
    };

    const handleStudentSelect = (student) => {
        setSelectedStudent(student);
        loadTrackingHistory(student._id);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/tracking', {
                studentId: selectedStudent._id,
                comments
            });
            setComments('');
            loadTrackingHistory(selectedStudent._id);
        } catch (error) {
            console.error('Error al guardar seguimiento:', error);
        }
    };

    return (
        <div className="tracking-container">
            <div className="students-list">
                <h2>Estudiantes</h2>
                {students.map(student => (
                    <div 
                        key={student._id}
                        className={`student-item ${selectedStudent?._id === student._id ? 'selected' : ''}`}
                        onClick={() => handleStudentSelect(student)}
                    >
                        {student.name}
                    </div>
                ))}
            </div>

            {selectedStudent && (
                <div className="tracking-content">
                    <h2>Seguimiento de {selectedStudent.name}</h2>
                    
                    <form onSubmit={handleSubmit} className="tracking-form">
                        <textarea
                            value={comments}
                            onChange={(e) => setComments(e.target.value)}
                            placeholder="Escribe tus comentarios de seguimiento..."
                            required
                        />
                        <button type="submit">Guardar Seguimiento</button>
                    </form>

                    <div className="tracking-history">
                        <h3>Historial de Seguimiento</h3>
                        {trackingHistory.map(track => (
                            <div key={track._id} className="tracking-entry">
                                <div className="tracking-date">
                                    {new Date(track.date).toLocaleDateString()}
                                </div>
                                <div className="tracking-comments">
                                    {track.comments}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default TrackStudents;