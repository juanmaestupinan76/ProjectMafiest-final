import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import RecordingForm from '../../components/RecordingForm';
import RecordingCard from '../../components/RecordingCard';
import '../../styles/components/recordings.css';

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
      {(user.role === 'administrador' || user.role === 'docente') && (
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