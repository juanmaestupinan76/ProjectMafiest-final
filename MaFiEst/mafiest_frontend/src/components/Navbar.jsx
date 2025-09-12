import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/components/navbar.css';

const Navbar = () => {
    const { user, logout } = useAuth();
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const menuRef = useRef(null);

    const handleLogout = async () => {
        if (window.confirm('¿Estás seguro que deseas cerrar sesión?')) {
            await logout();
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowProfileMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <Link to="/">MaFiEst</Link>
            </div>
            <ul className="navbar-links main-links">
                {userRole === 'administrador' && (
                    <>
                        <li><Link to="/admin/dashboard">Dashboard</Link></li>
                        <li><Link to="/admin/manage-users">Manejo de Usuarios</Link></li>
                        <li><Link to="/admin/manage-groups">Manejo de Grupos</Link></li>
                    </>
                )}
                {userRole === 'docente' && (
                    <>
                        <li><Link to="/teacher/dashboard">Dashboard</Link></li>
                        // <li><Link to="/teacher/upload-exams">Subir Actividades</Link></li>
                        // <li><Link to="/teacher/upload-workshops">Upload Workshops</Link></li>
                    </>
                )}
                {userRole === 'estudiante' && (
                    <>
                        <li><Link to="/student/dashboard">Dashboard</Link></li>
                        <li><Link to="/student/courses">Cursos</Link></li>
                        <li><Link to="/student/progress">Progreso</Link></li>
                        <li><Link to="/student/achievements">Mis logros</Link></li>
                    </>
                )}
                {userRole === 'independiente' && (
                    <>
                        <li><Link to="/independent/dashboard">Dashboard</Link></li>
                        <li><Link to="/independent/courses">Cursos</Link></li>
                        <li><Link to="/independent/progress">Progreso</Link></li>
                        <li><Link to="/independent/achievements">Mis logros</Link></li>
                    </>
                )}
                <li><Link to="/contact">Contáctanos</Link></li>
                <li><Link to="/advisory">Asesorías</Link></li>
            </ul>
            <div className="profile-menu-container">
                <button 
                    className="profile-trigger"
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                >
                    <span className="user-initial">{user?.name?.charAt(0).toUpperCase()}</span>
                    <span className="user-name">{user?.name}</span>
                </button>
                {showProfileMenu && (
                    <div className="profile-dropdown">
                        <div className="profile-header">
                            <span className="user-name">{user?.name}</span>
                            <span className="user-role">{user?.role}</span>
                        </div>
                        <ul>
                            <li>
                                <Link to="/profile">
                                    <span className="icon user-icon">👤</span>
                                    Mi Perfil
                                </Link>
                            </li>
                            <li>
                                <button onClick={handleLogout}>
                                    <span className="icon logout-icon">↪️</span>
                                    Cerrar Sesión
                                </button>
                            </li>
                        </ul>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
