import React from 'react'
import { useNavigate } from 'react-router-dom'
import './style.css'

function Home() {
  const navigate = useNavigate()
  
  return (
    <div className="home-container">
      <h1>Skrible</h1>
      <div>
        <button onClick={() => navigate('/main-site')}>Login</button>
        <button onClick={() => navigate('/main-site')}>Register</button>
      </div>
    </div>
  )
}

export default Home