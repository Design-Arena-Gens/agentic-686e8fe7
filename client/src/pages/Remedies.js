import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Remedies.css';

function Remedies() {
  const [allFoods, setAllFoods] = useState([]);
  const [filteredFoods, setFilteredFoods] = useState([]);
  const [selectedDisease, setSelectedDisease] = useState('');
  const [personalizedFoods, setPersonalizedFoods] = useState([]);
  const [loading, setLoading] = useState(true);

  const diseases = [
    'diabetes', 'hypertension', 'arthritis', 'obesity', 'indigestion',
    'cold', 'fever', 'stress', 'anxiety', 'insomnia', 'constipation',
    'anemia', 'inflammation', 'hair loss', 'skin issues'
  ];

  useEffect(() => {
    fetchFoods();
    fetchPersonalizedRecommendations();
  }, []);

  const fetchFoods = async () => {
    try {
      const response = await axios.get('/api/food');
      setAllFoods(response.data);
      setFilteredFoods(response.data);
    } catch (error) {
      console.error('Error fetching foods:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPersonalizedRecommendations = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await axios.get('/api/food/personalized', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPersonalizedFoods(response.data);
      }
    } catch (error) {
      console.error('Error fetching personalized foods:', error);
    }
  };

  const handleDiseaseChange = async (disease) => {
    setSelectedDisease(disease);

    if (!disease) {
      setFilteredFoods(allFoods);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/food/recommend/${disease}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFilteredFoods(response.data);
    } catch (error) {
      console.error('Error filtering foods:', error);
    }
  };

  if (loading) {
    return <div className="spinner"></div>;
  }

  return (
    <div className="remedies">
      <div className="remedies-container">
        <header className="remedies-header">
          <h1>Ayurvedic Food Remedies</h1>
          <p>Discover natural healing foods for your health conditions</p>
        </header>

        {/* Disease Filter */}
        <div className="filter-section">
          <label htmlFor="disease-select">Filter by Health Condition:</label>
          <select
            id="disease-select"
            value={selectedDisease}
            onChange={(e) => handleDiseaseChange(e.target.value)}
            className="disease-select"
          >
            <option value="">All Remedies</option>
            {diseases.map((disease) => (
              <option key={disease} value={disease}>
                {disease.charAt(0).toUpperCase() + disease.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Personalized Recommendations */}
        {personalizedFoods.length > 0 && !selectedDisease && (
          <section className="personalized-section">
            <h2>📌 Recommended For You</h2>
            <p className="section-description">Based on your health profile and dosha</p>
            <div className="remedies-grid">
              {personalizedFoods.slice(0, 6).map((food) => (
                <div key={food._id} className="remedy-card personalized">
                  <div className="remedy-badge">For You</div>
                  <div className="remedy-icon">🌿</div>
                  <h3>{food.name}</h3>
                  <p className="remedy-category">{food.category}</p>
                  <p className="remedy-description">{food.description}</p>
                  <div className="remedy-benefits">
                    <strong>Benefits:</strong>
                    <ul>
                      {food.benefits.map((benefit, idx) => (
                        <li key={idx}>{benefit}</li>
                      ))}
                    </ul>
                  </div>
                  {food.nutrients && (
                    <div className="remedy-nutrients">
                      <strong>Nutrients (per 100g):</strong>
                      <div className="nutrient-grid">
                        <span>Calories: {food.nutrients.calories}</span>
                        <span>Protein: {food.nutrients.protein}g</span>
                        <span>Carbs: {food.nutrients.carbs}g</span>
                        <span>Fiber: {food.nutrients.fiber}g</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* All Remedies */}
        <section className="all-remedies-section">
          <h2>{selectedDisease ? `Remedies for ${selectedDisease}` : 'All Remedies'}</h2>
          {filteredFoods.length === 0 ? (
            <p className="no-results">No remedies found for this condition. Try another filter.</p>
          ) : (
            <div className="remedies-grid">
              {filteredFoods.map((food) => (
                <div key={food._id} className="remedy-card">
                  <div className="remedy-icon">🌿</div>
                  <h3>{food.name}</h3>
                  <p className="remedy-category">{food.category}</p>
                  <p className="remedy-description">{food.description}</p>
                  <div className="remedy-benefits">
                    <strong>Benefits:</strong>
                    <ul>
                      {food.benefits.map((benefit, idx) => (
                        <li key={idx}>{benefit}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="remedy-properties">
                    <span className="property-tag">Taste: {food.taste}</span>
                    {food.dosha && food.dosha.length > 0 && (
                      <span className="property-tag">Dosha: {food.dosha.join(', ')}</span>
                    )}
                  </div>
                  {food.nutrients && (
                    <div className="remedy-nutrients">
                      <strong>Nutrients (per 100g):</strong>
                      <div className="nutrient-grid">
                        <span>Calories: {food.nutrients.calories}</span>
                        <span>Protein: {food.nutrients.protein}g</span>
                        <span>Carbs: {food.nutrients.carbs}g</span>
                        <span>Fiber: {food.nutrients.fiber}g</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default Remedies;
