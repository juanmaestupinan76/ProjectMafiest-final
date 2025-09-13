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
                {user?.role === 'administrador' && (
                    <>
                        <li><Link to="/admin/dashboard">Dashboard</Link></li>
                        <li><Link to="/admin/manage-users">Gestión de Usuarios</Link></li>
                        <li><Link to="/admin/manage-groups">Gestión de Grupos</Link></li>
                    </>
                )}
                {user?.role === 'docente' && (
                    <>
                        <li><Link to="/teacher/dashboard">Dashboard</Link></li>
                        <li><Link to="/teacher/activities/upload">Subir Actividades</Link></li>
                        <li><Link to="/teacher/track-students">Seguimiento</Link></li>
                    </>
                )}
                {user?.role === 'estudiante' && (
                    <>
                        <li><Link to="/student/dashboard">Dashboard</Link></li>
                        <li><Link to="/student/activities">Actividades</Link></li>
                        <li><Link to="/student/grades">Calificaciones</Link></li>
                        <li><Link to="/student/tracking">Mi Seguimiento</Link></li>
                        <li><Link to="/recordings">Grabaciones</Link></li>
                    </>
                )}
                {user?.role === 'independiente' && (
                    <>
                        <li><Link to="/independent/dashboard">Dashboard</Link></li>
                        <li><Link to="/recordings">Grabaciones</Link></li>
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
