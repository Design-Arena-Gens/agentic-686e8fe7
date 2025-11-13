import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Home.css';

function Home() {
  const [featuredFoods, setFeaturedFoods] = useState([]);
  const [remedyOfDay, setRemedyOfDay] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      const [featuredRes, remedyRes] = await Promise.all([
        axios.get('/api/food/featured'),
        axios.get('/api/food/remedy-of-day')
      ]);

      setFeaturedFoods(featuredRes.data);
      setRemedyOfDay(remedyRes.data);
    } catch (error) {
      console.error('Error fetching home data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="container hero-content">
          <h1 className="hero-title">Discover Ancient Foods for Modern Health</h1>
          <p className="hero-subtitle">
            Embrace the wisdom of Ayurveda with personalized food recommendations
            tailored to your unique constitution and health needs
          </p>
          <div className="hero-actions">
            <Link to="/signup" className="btn btn-hero-primary">
              Start Your Journey
            </Link>
            <Link to="/remedies" className="btn btn-hero-secondary">
              Explore Remedies
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Foods */}
      <section className="featured-section">
        <div className="container">
          <h2 className="section-title">Featured Ayurvedic Foods</h2>
          <p className="section-subtitle">Ancient superfoods for holistic wellness</p>

          {loading ? (
            <div className="spinner"></div>
          ) : (
            <div className="food-grid">
              {featuredFoods.map((food) => (
                <div key={food._id} className="food-card">
                  <div className="food-icon">🌿</div>
                  <h3>{food.name}</h3>
                  <p className="food-category">{food.category}</p>
                  <p className="food-description">{food.description}</p>
                  <div className="food-benefits">
                    {food.benefits.slice(0, 2).map((benefit, idx) => (
                      <span key={idx} className="benefit-tag">✓ {benefit}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Remedy of the Day */}
      {remedyOfDay && (
        <section className="remedy-section">
          <div className="container">
            <div className="remedy-card">
              <h2 className="remedy-title">🌟 Remedy of the Day</h2>
              <h3 className="remedy-name">{remedyOfDay.name}</h3>
              <p className="remedy-description">{remedyOfDay.description}</p>
              <div className="remedy-info">
                <div className="remedy-info-item">
                  <strong>Taste:</strong> {remedyOfDay.taste}
                </div>
                <div className="remedy-info-item">
                  <strong>Benefits:</strong> {remedyOfDay.benefits.join(', ')}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* About Ayurveda */}
      <section className="about-section">
        <div className="container">
          <h2 className="section-title">The Ayurvedic Approach</h2>
          <div className="about-grid">
            <div className="about-card">
              <div className="about-icon">🧘</div>
              <h3>Balance Your Doshas</h3>
              <p>Understand your unique body constitution (Vata, Pitta, Kapha) and eat accordingly</p>
            </div>
            <div className="about-card">
              <div className="about-icon">🌱</div>
              <h3>Natural Healing</h3>
              <p>Use food as medicine with ancient herbs, spices, and whole foods</p>
            </div>
            <div className="about-card">
              <div className="about-icon">🍃</div>
              <h3>Holistic Wellness</h3>
              <p>Achieve harmony between mind, body, and spirit through mindful eating</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p>&copy; 2025 AnnapurnaAI. Ancient wisdom meets modern technology.</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;
