import React from 'react';
import PropTypes from 'prop-types';

const RecordingCard = ({ recording, onDelete, user }) => {
  const canDelete = user.role === 'administrador' || 
                   (user.role === 'docente' && user.id === recording.createdBy && !recording.forIndependents);

  const handleDelete = () => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta grabación?')) {
      onDelete(recording._id);
    }
  };

  return (
    <div className="recording-card">
      <div className="recording-content">
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
    </div>
  );
};

RecordingCard.propTypes = {
  recording: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    driveLink: PropTypes.string.isRequired,
    createdBy: PropTypes.string,
    forIndependents: PropTypes.bool
  }).isRequired,
  onDelete: PropTypes.func.isRequired,
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired
  }).isRequired
};

export default RecordingCard;