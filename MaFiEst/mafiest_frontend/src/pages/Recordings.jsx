import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const RecordingCard = ({ recording, onDelete, user }) => {
  const canDelete = user.role === 'admin' || 
                   (user.role === 'teacher' && user.id === recording.createdBy && !recording.forIndependents);

  const handleDelete = async () => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta grabación?')) {
      try {
        await axios.delete(`/api/recordings/${recording._id}`);
        onDelete(recording._id);
      } catch (error) {
        console.error('Error al eliminar grabación:', error);
        alert(error.response?.data?.message || 'Error al eliminar la grabación');
      }
    }
  };

  return (
    <div className="recording-card">
      <img src={recording.imageUrl} alt={recording.title} />
      <h3>{recording.title}</h3>
      <p>{recording.description}</p>
      <div className="recording-card-actions">
        <a href={recording.driveLink} target="_blank" rel="noopener noreferrer" className="btn-view">
          Ver Grabación
        </a>
        {canDelete && (
          <button onClick={handleDelete} className="btn-delete">
            Eliminar
          </button>
        )}
      </div>
    </div>
  );
};

const RecordingForm = ({ onSubmit, initialData = null }) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    driveLink: initialData?.driveLink || '',
    imageUrl: initialData?.imageUrl || '',
    forIndependents: initialData?.forIndependents || false
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="recording-form">
      <input
        type="text"
        placeholder="Título"
        value={formData.title}
        onChange={(e) => setFormData({...formData, title: e.target.value})}
      />
      <textarea
        placeholder="Descripción"
        value={formData.description}
        onChange={(e) => setFormData({...formData, description: e.target.value})}
      />
      <input
        type="url"
        placeholder="Link de Drive"
        value={formData.driveLink}
        onChange={(e) => setFormData({...formData, driveLink: e.target.value})}
      />
      <input
        type="url"
        placeholder="URL de la imagen"
        value={formData.imageUrl}
        onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
      />
      {user.role === 'admin' && (
        <label>
          <input
            type="checkbox"
            checked={formData.forIndependents}
            onChange={(e) => setFormData({...formData, forIndependents: e.target.checked})}
          />
          Para independientes
        </label>
      )}
      <button type="submit">Guardar</button>
    </form>
  );
};

const Recordings = () => {
  const [recordings, setRecordings] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const { user } = useAuth();

  const handleDelete = (deletedId) => {
    setRecordings(recordings.filter(rec => rec._id !== deletedId));
  };

  useEffect(() => {
    loadRecordings();
  }, []);

  const loadRecordings = async () => {
    try {
      const response = await axios.get('/api/recordings');
      setRecordings(response.data);
    } catch (error) {
      console.error('Error al cargar grabaciones:', error);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      await axios.post('/api/recordings', formData);
      loadRecordings();
      setShowForm(false);
    } catch (error) {
      console.error('Error al guardar grabación:', error);
    }
  };

  return (
    <div className="recordings-container">
      {(user.role === 'admin' || user.role === 'teacher') && (
        <button onClick={() => setShowForm(!showForm)} className="btn-add">
          {showForm ? 'Cancelar' : '+ Nueva Grabación'}
        </button>
      )}
      
      {showForm && <RecordingForm onSubmit={handleSubmit} />}

      <div className="recordings-grid">
        {recordings.map(recording => (
          <RecordingCard 
            key={recording._id} 
            recording={recording} 
            onDelete={handleDelete}
            user={user}
          />
        ))}
      </div>
    </div>
  );
};

export default Recordings;