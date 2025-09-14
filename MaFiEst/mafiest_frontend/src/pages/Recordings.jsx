import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import RecordingCard from '../components/RecordingCard';
import RecordingForm from '../components/RecordingForm';
import '../styles/components/recordings.css';

const Recordings = () => {
  const [recordings, setRecordings] = useState([]);
  const [filteredRecordings, setFilteredRecordings] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'student', 'independent'
  const { user } = useAuth();

  useEffect(() => {
    loadRecordings();
  }, []);

  useEffect(() => {
    filterRecordings();
  }, [recordings, filter]);

  const filterRecordings = () => {
    if (filter === 'all') {
      setFilteredRecordings(recordings);
    } else if (filter === 'student') {
      setFilteredRecordings(recordings.filter(rec => !rec.forIndependents));
    } else {
      setFilteredRecordings(recordings.filter(rec => rec.forIndependents));
    }
  };

  const loadRecordings = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.get('/api/recordings');
      setRecordings(response.data);
    } catch (error) {
      console.error('Error al cargar grabaciones:', error);
      setError('No se pudieron cargar las grabaciones. Por favor, intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (deletedId) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta grabación?')) {
      return;
    }

    try {
      setError(null);
      await axios.delete(`/api/recordings/${deletedId}`);
      setRecordings(recordings.filter(rec => rec._id !== deletedId));
    } catch (error) {
      console.error('Error al eliminar grabación:', error);
      setError(error.response?.data?.message || 'Error al eliminar la grabación');
    }
  };

  const handleSubmit = async (formData) => {
    try {
      setError(null);
      const response = await axios.post('/api/recordings', formData);
      setRecordings([...recordings, response.data]);
      setShowForm(false);
    } catch (error) {
      console.error('Error al guardar grabación:', error);
      setError(error.response?.data?.message || 'Error al crear la grabación');
    }
  };

  const renderFilterButtons = () => (
    <div className="recordings-filters">
      <button 
        className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
        onClick={() => setFilter('all')}
      >
        Todas
      </button>
      <button 
        className={`filter-btn ${filter === 'student' ? 'active' : ''}`}
        onClick={() => setFilter('student')}
      >
        Estudiantes
      </button>
      <button 
        className={`filter-btn ${filter === 'independent' ? 'active' : ''}`}
        onClick={() => setFilter('independent')}
      >
        Independientes
      </button>
    </div>
  );

  if (isLoading) {
    return <div className="recordings-loading">Cargando grabaciones...</div>;
  }

  return (
    <div className="recordings-container">
      {/* Solo docentes y administradores pueden agregar grabaciones */}
      {(user.role === 'docente' || user.role === 'administrador') && (
        <>
          <button onClick={() => setShowForm(!showForm)} className="btn-add">
            {showForm ? 'Cancelar' : '+ Nueva Grabación'}
          </button>
          {showForm && <RecordingForm onSubmit={handleSubmit} />}
        </>
      )}

      {/* Mensaje informativo para estudiantes */}
      {user.role === 'estudiante' && (
        <div className="recordings-info">
          Aquí encontrarás las grabaciones compartidas por tus profesores.
        </div>
      )}

      {error && (
        <div className="recordings-error">
          {error}
        </div>
      )}

      {/* Solo mostrar filtros al administrador */}
      {user.role === 'administrador' && renderFilterButtons()}

      <div className="recordings-grid">
        {filteredRecordings.length > 0 ? (
          filteredRecordings.map(recording => (
            <RecordingCard 
              key={recording._id} 
              recording={recording} 
              onDelete={handleDelete}
              user={user}
            />
          ))
        ) : (
          <div className="recordings-empty">
            No hay grabaciones disponibles {filter !== 'all' && 'para este filtro'}
          </div>
        )}
      </div>
    </div>
  );
};

export default Recordings;