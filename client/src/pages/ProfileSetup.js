import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './ProfileSetup.css';

function ProfileSetup() {
  const [formData, setFormData] = useState({
    height: '',
    weight: '',
    activityLevel: 'moderate',
    diseases: []
  });
  const [diseaseInput, setDiseaseInput] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { updateProfile } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const addDisease = () => {
    if (diseaseInput.trim() && !formData.diseases.includes(diseaseInput.trim())) {
      setFormData({
        ...formData,
        diseases: [...formData.diseases, diseaseInput.trim()]
      });
      setDiseaseInput('');
    }
  };

  const removeDisease = (disease) => {
    setFormData({
      ...formData,
      diseases: formData.diseases.filter(d => d !== disease)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await updateProfile({
        height: parseFloat(formData.height),
        weight: parseFloat(formData.weight),
        activityLevel: formData.activityLevel,
        diseases: formData.diseases
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-setup-container">
      <div className="profile-setup-card">
        <h1 className="profile-title">Complete Your Profile</h1>
        <p className="profile-subtitle">Help us personalize your wellness journey</p>

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="input-group">
              <label>Height (cm)</label>
              <input
                type="number"
                name="height"
                value={formData.height}
                onChange={handleChange}
                placeholder="e.g., 170"
                step="0.1"
                required
              />
            </div>

            <div className="input-group">
              <label>Weight (kg)</label>
              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                placeholder="e.g., 70"
                step="0.1"
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label>Activity Level</label>
            <select name="activityLevel" value={formData.activityLevel} onChange={handleChange}>
              <option value="sedentary">Sedentary (little or no exercise)</option>
              <option value="light">Light (exercise 1-3 days/week)</option>
              <option value="moderate">Moderate (exercise 3-5 days/week)</option>
              <option value="active">Active (exercise 6-7 days/week)</option>
              <option value="very-active">Very Active (intense exercise daily)</option>
            </select>
          </div>

          <div className="input-group">
            <label>Health Conditions (Optional)</label>
            <div className="disease-input-wrapper">
              <input
                type="text"
                value={diseaseInput}
                onChange={(e) => setDiseaseInput(e.target.value)}
                placeholder="e.g., diabetes, hypertension"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addDisease())}
              />
              <button type="button" onClick={addDisease} className="btn btn-add">
                Add
              </button>
            </div>

            {formData.diseases.length > 0 && (
              <div className="disease-tags">
                {formData.diseases.map((disease, index) => (
                  <span key={index} className="disease-tag">
                    {disease}
                    <button type="button" onClick={() => removeDisease(disease)} className="remove-tag">
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="btn btn-primary profile-btn" disabled={loading}>
            {loading ? 'Saving...' : 'Complete Setup'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ProfileSetup;
