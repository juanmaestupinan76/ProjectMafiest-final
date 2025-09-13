import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/pages/dashboard.css';

const Dashboard = () => {
    return (
        <div className="dashboard">
            <h1>Bienvenido al Panel de Control del Estudiante</h1>
            <div className="dashboard-links">
                <Link to="/student/activities" className="dashboard-link">Ver Actividades</Link>
                <Link to="/student/submit-activity" className="dashboard-link">Entregar Actividades</Link>
                <Link to="/student/grades" className="dashboard-link">Mis Calificaciones</Link>
                <Link to="/student/tracking" className="dashboard-link">Mi Seguimiento</Link>
                <Link to="/recordings" className="dashboard-link">Grabaciones</Link>
            </div>
        </div>
    );
};

export default Dashboard;
