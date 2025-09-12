import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import '../styles/pages/profile.css';

const Profile = () => {
  const { user, updateUser, logout } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || ''
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    try {
      // Validar contraseña nueva si se está intentando cambiar
      if (formData.newPassword) {
        if (formData.newPassword !== formData.confirmPassword) {
          setMessage({ type: 'error', text: 'Las contraseñas nuevas no coinciden' });
          return;
        }
        if (!formData.currentPassword) {
          setMessage({ type: 'error', text: 'Debes ingresar tu contraseña actual' });
          return;
        }
      }

      const updateData = {
        name: formData.name,
        email: formData.email
      };

      if (formData.newPassword) {
        updateData.currentPassword = formData.currentPassword;
        updateData.newPassword = formData.newPassword;
      }

      const response = await axios.put('/api/users/profile', updateData);
      
      // Actualizar el contexto con los nuevos datos
      updateUser(response.data);
      
      setMessage({ type: 'success', text: 'Perfil actualizado exitosamente' });
      setIsEditing(false);
      
      // Limpiar campos de contraseña
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Error al actualizar el perfil'
      });
    }
  };

  const handleLogout = async () => {
    if (window.confirm('¿Estás seguro que deseas cerrar sesión?')) {
      await logout();
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div className="profile-info-section">
            <h3>Información General</h3>
            <p><strong>Nombre:</strong> {user?.name}</p>
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Rol:</strong> {user?.role}</p>
            <button 
              type="button" 
              className="btn-edit"
              onClick={() => setIsEditing(true)}
            >
              Editar Información
            </button>
          </div>
        );
      case 'seguridad':
        return (
          <div className="security-section">
            <h3>Seguridad</h3>
            <button 
              type="button" 
              className="btn-change-password"
              onClick={() => setIsEditing(true)}
            >
              Cambiar Contraseña
            </button>
          </div>
        );
      case 'notificaciones':
        return (
          <div className="notifications-section">
            <h3>Notificaciones</h3>
            <div className="notification-options">
              <label className="notification-option">
                <input type="checkbox" /> Notificaciones por email
              </label>
              <label className="notification-option">
                <input type="checkbox" /> Notificaciones de actividades
              </label>
              <label className="notification-option">
                <input type="checkbox" /> Notificaciones de calificaciones
              </label>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="profile-container">
      <h2>Mi Perfil</h2>
      
      <div className="profile-layout">
        <div className="profile-menu">
          <div className="menu-header">
            <h3>{user?.name}</h3>
            <p className="user-role">{user?.role}</p>
          </div>
          <nav className="profile-nav">
            <button 
              className={`menu-item ${activeTab === 'general' ? 'active' : ''}`}
              onClick={() => setActiveTab('general')}
            >
              <i className="fas fa-user"></i>
              Información General
            </button>
            <button 
              className={`menu-item ${activeTab === 'seguridad' ? 'active' : ''}`}
              onClick={() => setActiveTab('seguridad')}
            >
              <i className="fas fa-lock"></i>
              Seguridad
            </button>
            <button 
              className={`menu-item ${activeTab === 'notificaciones' ? 'active' : ''}`}
              onClick={() => setActiveTab('notificaciones')}
            >
              <i className="fas fa-bell"></i>
              Notificaciones
            </button>
            <button 
              className="menu-item logout"
              onClick={handleLogout}
            >
              <i className="fas fa-sign-out-alt"></i>
              Cerrar Sesión
            </button>
          </nav>
        </div>
        
        <div className="profile-content">
          {isEditing ? (
            <form onSubmit={handleSubmit} className="profile-form">
              <div className="form-group">
                <label>Nombre</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              {activeTab === 'seguridad' && (
                <div className="password-section">
                  <h4>Cambiar Contraseña</h4>
                  <div className="form-group">
                    <label>Contraseña Actual</label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label>Nueva Contraseña</label>
                    <input
                      type="password"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label>Confirmar Nueva Contraseña</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              )}

              <div className="profile-actions">
                <button type="submit" className="btn-save">
                  Guardar Cambios
                </button>
                <button 
                  type="button" 
                  className="btn-cancel"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      name: user?.name || '',
                      email: user?.email || '',
                      currentPassword: '',
                      newPassword: '',
                      confirmPassword: ''
                    });
                  }}
                >
                  Cancelar
                </button>
              </div>
            </form>
          ) : (
            renderTabContent()
          )}

          {message.text && (
            <div className={`message ${message.type}`}>
              {message.text}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;