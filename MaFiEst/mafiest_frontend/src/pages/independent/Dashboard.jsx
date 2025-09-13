import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/pages/dashboard.css';

const Dashboard = () => {
    return (
        <div className="dashboard">
            <h1>Bienvenido a tu Panel de Control</h1>
            <p>Como usuario independiente, aquí puedes gestionar tu progreso y acceder a los cursos disponibles.</p>
            <div className="dashboard-links">
                <Link to="/independent/courses" className="dashboard-link">Ver Cursos</Link>
                <Link to="/independent/progress" className="dashboard-link">Ver Progreso</Link>
                <Link to="/independent/achievements" className="dashboard-link">Mis Logros</Link>
            </div>
        </div>
    );
};

export default Dashboard;
