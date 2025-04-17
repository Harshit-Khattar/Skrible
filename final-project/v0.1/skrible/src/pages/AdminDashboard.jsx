import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './style.css';
import { Bar } from 'react-chartjs-2';
import { useUser } from '@clerk/clerk-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function AdminDashboard() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [stats, setStats] = useState({
    totalNotes: 0,
    totalUsers: 0,
    monthlyActiveUsers: 0,
    usersPerMonth: []
  });

  useEffect(() => {
    const isAdmin = user && import.meta.env.VITE_ADMIN_IDS?.split(',').includes(user.id);
    if (!isAdmin) {
      navigate('/main-site');
      return;
    }

    const fetchNotes = async () => {
      const response = await fetch('http://localhost:3000/api/notes/all');
      const notes = await response.json();
      
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();
      const monthlyActiveUserIds = new Set(
        notes.filter(note => {
          const updateDate = new Date(note.updatedAt);
          return updateDate.getMonth() === currentMonth && 
                 updateDate.getFullYear() === currentYear;
        }).map(note => note.userId)
      );

      let usersPerMonth = [];
      let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      
      for(let i = 5; i >= 0; i--) {
        let date = new Date();
        date.setMonth(date.getMonth() - i);
        let monthName = months[date.getMonth()];
        let year = date.getFullYear();
        
        let activeUsers = [];
        for(let j = 0; j < notes.length; j++) {
          let noteDate = new Date(notes[j].updatedAt);
          if(noteDate.getMonth() === date.getMonth() && 
             noteDate.getFullYear() === date.getFullYear()) {
            if(!activeUsers.includes(notes[j].userId)) {
              activeUsers.push(notes[j].userId);
            }
          }
        }
        
        usersPerMonth.push({
          month: monthName + ' ' + year,
          count: activeUsers.length
        });
      }
      
      setStats(prev => ({
        ...prev,
        totalNotes: notes.length,
        totalUsers: new Set(notes.map(note => note.userId)).size,
        monthlyActiveUsers: monthlyActiveUserIds.size,
        usersPerMonth
      }));
    };

    fetchNotes();
  }, [navigate, user]);

  const usersChartData = {
    labels: stats.usersPerMonth.map(d => d.month),
    datasets: [{
      label: 'Active Users',
      data: stats.usersPerMonth.map(d => d.count),
      backgroundColor: 'rgba(54, 162, 235, 0.5)',
    }]
  };

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <h1>Admin Dashboard</h1>
        <button className="save-button" onClick={() => navigate('/main-site')}>Back to Notes</button>
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

      <div className="chart-row">
        <div className="chart-container" style={{ maxWidth: '700px', height: '400px', margin: '0 auto', padding: '20px 40px 60px 40px' }}>
          <h3>Monthly Active Users</h3>
          <Bar data={usersChartData} />
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard; 