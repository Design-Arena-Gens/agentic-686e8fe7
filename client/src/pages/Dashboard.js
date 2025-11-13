import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './Dashboard.css';

function Dashboard() {
  const { user } = useContext(AuthContext);
  const [dashboardData, setDashboardData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [todayStats, setTodayStats] = useState({
    weight: '',
    calories: '',
    waterIntake: '',
    sleep: '',
    steps: '',
    mood: 'good'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/health/dashboard', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDashboardData(response.data);
      setTodayStats({
        weight: response.data.today.weight || '',
        calories: response.data.today.calories || '',
        waterIntake: response.data.today.waterIntake || '',
        sleep: response.data.today.sleep || '',
        steps: response.data.today.steps || '',
        mood: response.data.today.mood || 'good'
      });
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatChange = (e) => {
    setTodayStats({
      ...todayStats,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmitStats = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/health/log', {
        weight: parseFloat(todayStats.weight) || 0,
        calories: parseFloat(todayStats.calories) || 0,
        waterIntake: parseFloat(todayStats.waterIntake) || 0,
        sleep: parseFloat(todayStats.sleep) || 0,
        steps: parseInt(todayStats.steps) || 0,
        mood: todayStats.mood
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setShowModal(false);
      fetchDashboardData();
    } catch (error) {
      console.error('Error logging stats:', error);
    }
  };

  if (loading) {
    return <div className="spinner"></div>;
  }

  const chartData = dashboardData?.weekData?.map(log => ({
    date: new Date(log.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    weight: log.weight,
    calories: log.calories
  })) || [];

  return (
    <div className="dashboard">
      <div className="dashboard-container">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="sidebar-header">
            <h2>Welcome, {user?.name?.split(' ')[0]}!</h2>
            <p className="dosha-badge">Your Dosha: {user?.dosha?.toUpperCase()}</p>
          </div>

          <div className="sidebar-menu">
            <button className="menu-item active">
              <span>📊</span> Dashboard
            </button>
            <button className="menu-item">
              <span>🍽️</span> Meal Plan
            </button>
            <button className="menu-item">
              <span>📈</span> Progress
            </button>
            <button className="menu-item">
              <span>⚙️</span> Settings
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="dashboard-main">
          <div className="dashboard-header">
            <h1>Health Dashboard</h1>
            <button className="btn btn-primary" onClick={() => setShowModal(true)}>
              + Add Today's Stats
            </button>
          </div>

          {/* Stats Cards */}
          <div className="stats-grid">
            <div className="stat-card health-score">
              <div className="stat-icon">❤️</div>
              <div className="stat-content">
                <h3>Health Score</h3>
                <p className="stat-value">{dashboardData?.healthScore || 75}</p>
                <p className="stat-label">out of 100</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">💧</div>
              <div className="stat-content">
                <h3>Water Intake</h3>
                <p className="stat-value">{dashboardData?.today?.waterIntake || 0}</p>
                <p className="stat-label">glasses today</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">🔥</div>
              <div className="stat-content">
                <h3>Calories</h3>
                <p className="stat-value">{dashboardData?.today?.calories || 0}</p>
                <p className="stat-label">kcal today</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">😴</div>
              <div className="stat-content">
                <h3>Sleep</h3>
                <p className="stat-value">{dashboardData?.today?.sleep || 0}</p>
                <p className="stat-label">hours last night</p>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="charts-grid">
            <div className="chart-card">
              <h3>Weight Trend (7 Days)</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="weight" stroke="#2d5016" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-card">
              <h3>Calorie Intake (7 Days)</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="calories" stroke="#4a7c2e" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Weekly Average */}
          <div className="weekly-summary">
            <h3>Weekly Average</h3>
            <div className="summary-grid">
              <div className="summary-item">
                <span className="summary-label">Calories</span>
                <span className="summary-value">{dashboardData?.weeklyAverage?.calories || 0} kcal</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Water</span>
                <span className="summary-value">{dashboardData?.weeklyAverage?.waterIntake || 0} glasses</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Sleep</span>
                <span className="summary-value">{dashboardData?.weeklyAverage?.sleep || 0} hours</span>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Add Today's Health Stats</h2>
            <form onSubmit={handleSubmitStats}>
              <div className="modal-grid">
                <div className="input-group">
                  <label>Weight (kg)</label>
                  <input
                    type="number"
                    name="weight"
                    value={todayStats.weight}
                    onChange={handleStatChange}
                    step="0.1"
                  />
                </div>

                <div className="input-group">
                  <label>Calories</label>
                  <input
                    type="number"
                    name="calories"
                    value={todayStats.calories}
                    onChange={handleStatChange}
                  />
                </div>

                <div className="input-group">
                  <label>Water (glasses)</label>
                  <input
                    type="number"
                    name="waterIntake"
                    value={todayStats.waterIntake}
                    onChange={handleStatChange}
                  />
                </div>

                <div className="input-group">
                  <label>Sleep (hours)</label>
                  <input
                    type="number"
                    name="sleep"
                    value={todayStats.sleep}
                    onChange={handleStatChange}
                    step="0.5"
                  />
                </div>

                <div className="input-group">
                  <label>Steps</label>
                  <input
                    type="number"
                    name="steps"
                    value={todayStats.steps}
                    onChange={handleStatChange}
                  />
                </div>

                <div className="input-group">
                  <label>Mood</label>
                  <select name="mood" value={todayStats.mood} onChange={handleStatChange}>
                    <option value="excellent">Excellent</option>
                    <option value="good">Good</option>
                    <option value="fair">Fair</option>
                    <option value="poor">Poor</option>
                  </select>
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Stats
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
