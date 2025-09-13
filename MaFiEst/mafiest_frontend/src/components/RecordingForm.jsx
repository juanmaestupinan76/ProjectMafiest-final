import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useAuth } from '../context/AuthContext';

const RecordingForm = ({ onSubmit, initialData = null }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    driveLink: initialData?.driveLink || '',
    imageUrl: initialData?.imageUrl || '',
    forIndependents: initialData?.forIndependents || false
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.driveLink) {
      alert('Por favor completa los campos requeridos');
      return;
    }
    onSubmit(formData);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="recording-form">
      <div className="form-group">
        <label htmlFor="title">Título *</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">Descripción</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label htmlFor="driveLink">Link de Drive *</label>
        <input
          type="url"
          id="driveLink"
          name="driveLink"
          value={formData.driveLink}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="imageUrl">URL de la imagen</label>
        <input
          type="url"
          id="imageUrl"
          name="imageUrl"
          value={formData.imageUrl}
          onChange={handleChange}
          placeholder="https://ejemplo.com/imagen.jpg"
        />
      </div>

      {user.role === 'administrador' && (
        <div className="form-group">
          <label>
            <input
              type="checkbox"
              name="forIndependents"
              checked={formData.forIndependents}
              onChange={handleChange}
            />
            Para independientes
          </label>
        </div>
      )}

      <button type="submit" className="btn-submit">
        Guardar
      </button>
    </form>
  );
};

RecordingForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  initialData: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    driveLink: PropTypes.string,
    imageUrl: PropTypes.string,
    forIndependents: PropTypes.bool
  })
};

export default RecordingForm;

