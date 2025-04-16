import React, { useState } from 'react';
// Temporarily remove Clerk hooks
// import { useUser } from '@clerk/clerk-react'; 
import { useNavigate } from 'react-router-dom';
import './style.css';

// Keep chart imports
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function AdminDashboard() {
  // Remove user hook for now
  // const { user } = useUser(); 
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalNotes: 0,
    totalUsers: 0,
    monthlyActiveUsers: 0,
    notesPerDay: [],
    usersPerMonth: []
  });

  // Remove useEffect entirely for this test
  /*
  useEffect(() => {
    if (user) {
      console.log('Admin dashboard rendering (no data fetch yet)');
    } else {
      navigate('/signin'); 
    }
  }, [user, navigate]);
  */

  // ... (isAdmin function commented out) ...
  // ... (fetchDashboardStats function commented out) ...

  // Keep chart data setup (will use initial empty/zero state)
  const notesChartData = {
    labels: stats.notesPerDay.map(d => d.date),
    datasets: [{
      label: 'Notes Created',
      data: stats.notesPerDay.map(d => d.count),
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1
    }]
  };

  const usersChartData = {
    labels: stats.usersPerMonth.map(d => d.month),
    datasets: [{
      label: 'Active Users',
      data: stats.usersPerMonth.map(d => d.count),
      backgroundColor: 'rgba(54, 162, 235, 0.5)',
    }]
  };

  console.log('Rendering AdminDashboard component structure...'); // Add a log

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <h1>Admin Dashboard</h1>
        <button onClick={() => navigate('/main-site')}>Back to Notes</button>
      </header>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Notes</h3>
          <p className="stat-number">{stats.totalNotes}</p>
        </div>
        <div className="stat-card">
          <h3>Total Users</h3>
          <p className="stat-number">{stats.totalUsers}</p>
        </div>
        <div className="stat-card">
          <h3>Monthly Active Users</h3>
          <p className="stat-number">{stats.monthlyActiveUsers}</p>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-container">
          <h3>Notes Created Over Time</h3>
          <Line data={notesChartData} />
        </div>
        <div className="chart-container">
          <h3>Monthly Active Users</h3>
          <Bar data={usersChartData} />
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard; 