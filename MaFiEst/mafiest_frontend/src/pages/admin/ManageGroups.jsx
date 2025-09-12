import React, { useEffect, useState } from 'r                    axios.get(`/api/groups/${groupId}/available-users?role=estudiante`),act';
import axios from 'axios';
import { toast } from 'react-toastify';
import '../../styles/pages/manageGroups.css';

const ManageGroups = () => {
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(false);
    const [availableUsers, setAvailableUsers] = useState({ students: [], teachers: [] });
    const [searchTerm, setSearchTerm] = useState('');
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0
    });
    const [formData, setFormData] = useState({
        name: '',
        description: ''
    });
    const [selectedGroup, setSelectedGroup] = useState(null);

    useEffect(() => {
        fetchGroups();
    }, [pagination.page, searchTerm]);

    const fetchGroups = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`/api/groups?page=${pagination.page}&limit=${pagination.limit}&search=${searchTerm}`);
            setGroups(response.data.data);
            setPagination(prev => ({
                ...prev,
                total: response.data.pagination.total
            }));
        } catch (error) {
            toast.error('Error al cargar los grupos');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchAvailableUsers = async (groupId) => {
        try {
            const [studentsRes, teachersRes] = await Promise.all([
                axios.get(`/api/groups/${groupId}/available-users?role=student`),
                axios.get(`/api/groups/${groupId}/available-users?role=docente`)
            ]);
            setAvailableUsers({
                students: studentsRes.data.data,
                teachers: teachersRes.data.data
            });
        } catch (error) {
            toast.error('Error al cargar usuarios disponibles');
            console.error('Error:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (selectedGroup) {
                await axios.put(`/api/groups/${selectedGroup.id}`, formData);
                toast.success('Grupo actualizado exitosamente');
            } else {
                await axios.post('/api/groups', formData);
                toast.success('Grupo creado exitosamente');
            }
            setFormData({ name: '', description: '' });
            setSelectedGroup(null);
            fetchGroups();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error al procesar el grupo');
            console.error('Error:', error);
        }
    };

    const handleEditGroup = (group) => {
        setSelectedGroup(group);
        setFormData({
            name: group.name,
            description: group.description || ''
        });
    };

    const handleDeleteGroup = async (id) => {
        if (!window.confirm('¿Estás seguro de querer eliminar este grupo?')) return;
        
        try {
            await axios.delete(`/api/groups/${id}`);
            toast.success('Grupo eliminado exitosamente');
            fetchGroups();
            if (selectedGroup?.id === id) {
                setSelectedGroup(null);
                setFormData({ name: '', description: '' });
            }
        } catch (error) {
            toast.error('Error al eliminar el grupo');
            console.error('Error:', error);
        }
    };

    const handleMemberManagement = async (groupId, userId, role, action) => {
        try {
            await axios.post(`/api/groups/${groupId}/members`, {
                userId,
                role,
                action
            });
            toast.success(`Usuario ${action === 'add' ? 'añadido' : 'removido'} exitosamente`);
            
            // Actualizar la lista de miembros del grupo
            if (selectedGroup?.id === groupId) {
                const updatedGroup = await axios.get(`/api/groups/${groupId}`);
                setSelectedGroup(updatedGroup.data.data);
            }
            
            // Actualizar la lista de usuarios disponibles
            await fetchAvailableUsers(groupId);
        } catch (error) {
            toast.error('Error al gestionar miembro del grupo');
            console.error('Error:', error);
        }
    };

    return (
        <div className="manage-groups-container">
            <div className="groups-header">
                <h1>Gestión de Grupos</h1>
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Buscar grupos..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Formulario de grupo */}
            <form onSubmit={handleSubmit} className="group-form">
                <input
                    type="text"
                    placeholder="Nombre del grupo"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                />
                <textarea
                    placeholder="Descripción del grupo"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
                <button type="submit">
                    {selectedGroup ? 'Actualizar Grupo' : 'Crear Grupo'}
                </button>
                {selectedGroup && (
                    <button 
                        type="button" 
                        onClick={() => {
                            setSelectedGroup(null);
                            setFormData({ name: '', description: '' });
                        }}
                    >
                        Cancelar Edición
                    </button>
                )}
            </form>

            {/* Lista de grupos */}
            <div className="groups-grid">
                {loading ? (
                    <div className="loading">Cargando grupos...</div>
                ) : (
                    groups.map(group => (
                        <div key={group.id} className="group-card">
                            <div className="group-header">
                                <h3>{group.name}</h3>
                                <div className="group-actions">
                                    <button onClick={() => handleEditGroup(group)}>
                                        Editar
                                    </button>
                                    <button onClick={() => handleDeleteGroup(group.id)}>
                                        Eliminar
                                    </button>
                                </div>
                            </div>
                            <p className="group-description">{group.description}</p>
                            
                            <div className="members-section">
                                <h4>Miembros</h4>
                                <div className="members-tabs">
                                    <div className="teachers-tab">
                                        <h5>Docentes</h5>
                                        <div className="members-list">
                                            {group.docentes.map(teacher => (
                                                <div key={teacher.id} className="member-item">
                                                    <span>{teacher.name}</span>
                                                    <button onClick={() => 
                                                        handleMemberManagement(group.id, teacher.id, 'teacher', 'remove')
                                                    }>
                                                        Eliminar
                                                    </button>
                                                </div>
                                            ))}
                                            <select
                                                onChange={(e) => 
                                                    handleMemberManagement(group.id, e.target.value, 'teacher', 'add')
                                                }
                                                value=""
                                            >
                                                <option value="">Agregar docente...</option>
                                                {availableUsers.teachers
                                                    .filter(t => !group.docentes.find(d => d.id === t.id))
                                                    .map(teacher => (
                                                        <option key={teacher.id} value={teacher.id}>
                                                            {teacher.name}
                                                        </option>
                                                    ))
                                                }
                                            </select>
                                        </div>
                                    </div>

                                    <div className="students-tab">
                                        <h5>Estudiantes</h5>
                                        <div className="members-list">
                                            {group.estudiantes.map(student => (
                                                <div key={student.id} className="member-item">
                                                    <span>{student.name}</span>
                                                    <button onClick={() => 
                                                        handleMemberManagement(group.id, student.id, 'student', 'remove')
                                                    }>
                                                        Eliminar
                                                    </button>
                                                </div>
                                            ))}
                                            <select
                                                onChange={(e) => 
                                                    handleMemberManagement(group.id, e.target.value, 'student', 'add')
                                                }
                                                value=""
                                            >
                                                <option value="">Agregar estudiante...</option>
                                                {availableUsers.students
                                                    .filter(s => !group.estudiantes.find(e => e.id === s.id))
                                                    .map(student => (
                                                        <option key={student.id} value={student.id}>
                                                            {student.name}
                                                        </option>
                                                    ))
                                                }
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Paginación */}
            <div className="pagination">
                <button
                    disabled={pagination.page === 1}
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                >
                    Anterior
                </button>
                <span>Página {pagination.page} de {Math.ceil(pagination.total / pagination.limit)}</span>
                <button
                    disabled={pagination.page >= Math.ceil(pagination.total / pagination.limit)}
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                >
                    Siguiente
                </button>
            </div>
        </div>
    );
};

export default ManageGroups;
