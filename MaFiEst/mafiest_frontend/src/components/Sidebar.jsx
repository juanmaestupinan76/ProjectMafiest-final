import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/components/sidebar.css';

const Sidebar = ({ role }) => {
    return (
        <div className="sidebar">
            <h2>MaFiEst</h2>
            <ul>
                {role === 'administrador' && (
                    <>
                        <li><Link to="/admin/dashboard">Dashboard</Link></li>
                        <li><Link to="/admin/manage-users">Manejo de Usuarios</Link></li>
                        <li><Link to="/admin/manage-groups">Manejo de Grupos</Link></li>
                    </>
                )}
                {role === 'docente' && (
                    <>
                        <li><Link to="/teacher/dashboard">Dashboard</Link></li>
                        <li><Link to="/teacher/upload-exams">Upload Exams</Link></li>
                        <li><Link to="/teacher/upload-workshops">Upload Workshops</Link></li>
                    </>
                )}
                {role === 'estudiante' && (
                    <>
                        <li><Link to="/student/dashboard">Dashboard</Link></li>
                        <li><Link to="/student/courses">Cursos</Link></li>
                        <li><Link to="/student/progress">Progreso</Link></li>
                        <li><Link to="/student/achievements">Mis Logros</Link></li>
                    </>
                )}
                {role === 'independiente' && (
                    <>
                        <li><Link to="/independent/dashboard">Dashboard</Link></li>
                        <li><Link to="/independent/courses">Cursos</Link></li>
                        <li><Link to="/independent/progress">Progreso</Link></li>
                        <li><Link to="/independent/achievements">Mis Logros</Link></li>
                    </>
                )}
                <li><Link to="/contact">Contáctanos</Link></li>
                <li><Link to="/advisory">Asesorías</Link></li>
                <li><Link to="/profile">Mi Perfil</Link></li>
                <li><Link to="/logout">Cerrar Sesión</Link></li>
            </ul>
        </div>
    );
};

export default Sidebar;
