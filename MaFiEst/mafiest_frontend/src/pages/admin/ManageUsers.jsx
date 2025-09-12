import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/pages/admin.css';
import '../../styles/roles/manageUsers.css';

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newUser, setNewUser] = useState({
        name: '',
        email: '',
        password: '',
        role: 'estudiante'
    });
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('/api/users');
            setUsers(response.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (userId) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
            try {
                await axios.delete(`/api/users/${userId}`);
                setUsers(users.filter(user => user.id !== userId));
                setMessage('Usuario eliminado exitosamente');
            } catch (err) {
                setError(err.message);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Confirmación adicional al crear un administrador
        if (newUser.role === 'administrador') {
            if (!window.confirm('¿Estás seguro de que quieres crear un nuevo administrador? Esta acción otorgará todos los permisos del sistema al nuevo usuario.')) {
                return;
            }
        }

        try {
            const response = await axios.post('/api/users', newUser);
            setUsers([...users, response.data]);
            setMessage(`Usuario ${newUser.role} creado exitosamente`);
            setNewUser({
                name: '',
                email: '',
                password: '',
                role: 'estudiante'
            });
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) return <div>Cargando...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="manage-users-container">
            <h1>Gestión de Usuarios</h1>

            {/* Formulario para crear nuevo usuario */}
            <div className="create-user-section">
                <h2>Crear Nuevo Usuario</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Nombre</label>
                        <input
                            type="text"
                            value={newUser.name}
                            onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            value={newUser.email}
                            onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Contraseña</label>
                        <input
                            type="password"
                            value={newUser.password}
                            onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Rol</label>
                        <select
                            value={newUser.role}
                            onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                        >
                            <option value="estudiante">Estudiante</option>
                            <option value="docente">Docente</option>
                            <option value="administrador">Administrador</option>
                        </select>
                    </div>

                    <button type="submit" className="create-button">Crear Usuario</button>
                </form>
            </div>

            {message && <div className="message">{message}</div>}

            {/* Tabla de usuarios existentes */}
            <div className="users-list">
                <h2>Usuarios Registrados</h2>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Email</th>
                            <th>Rol</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.role}</td>
                                <td>
                                    <button 
                                        onClick={() => handleDelete(user.id)}
                                        className="delete-button"
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageUsers;
