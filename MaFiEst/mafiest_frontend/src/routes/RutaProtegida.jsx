import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RutaProtegida = ({ children, roles = [] }) => {
    const { user } = useAuth();
    const isAuthenticated = localStorage.getItem('token') !== null;

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    // Si se especifican roles y el usuario no tiene el rol requerido
    if (roles.length > 0 && !roles.includes(user?.role)) {
        return <Navigate to="/" />;
    }

    return children;
};

export default RutaProtegida;