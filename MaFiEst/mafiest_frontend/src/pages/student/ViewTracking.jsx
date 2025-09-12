import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import '../styles/pages/tracking.css';

const ViewTracking = () => {
    const [trackingHistory, setTrackingHistory] = useState([]);
    const { user } = useAuth();

    useEffect(() => {
        loadTrackingHistory();
    }, []);

    const loadTrackingHistory = async () => {
        try {
            const response = await axios.get(`/api/tracking/student/${user.id}`);
            setTrackingHistory(response.data);
        } catch (error) {
            console.error('Error al cargar historial de seguimiento:', error);
        }
    };

    return (
        <div className="tracking-container">
            <h2>Mi Seguimiento Académico</h2>
            
            <div className="tracking-history student-view">
                {trackingHistory.length > 0 ? (
                    trackingHistory.map(track => (
                        <div key={track._id} className="tracking-entry">
                            <div className="tracking-date">
                                {new Date(track.date).toLocaleDateString()}
                            </div>
                            <div className="tracking-comments">
                                {track.comments}
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No hay registros de seguimiento disponibles.</p>
                )}
            </div>
        </div>
    );
};

export default ViewTracking;