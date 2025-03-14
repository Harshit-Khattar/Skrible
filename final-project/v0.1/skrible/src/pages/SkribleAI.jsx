import React from 'react'
import { useNavigate } from 'react-router-dom'
import './style.css'

function SkribleAI() {
  const navigate = useNavigate()

  return (
    <div className="skrible-ai-container">
   
      <header className="skrible-ai-header">
        <h1>Skrible</h1>
        <div>
          <p>Profile</p>
          <button onClick={() => navigate('/')}>Log Out</button>
        </div>
      </header>

      <div className="skrible-ai-body">
       
        <aside className="skrible-ai-sidebar">
          <button>Skrible AI</button>
          <button>+ New Note</button>

          <h2>My Notes</h2>
          <ul>
            <li>Note 1 ..... </li>
            <li>Task List ..... </li>
            <li>Project v1 ..... </li>
          </ul>

          <h3>More</h3>
          <ul>
            <li>Favourites</li>
            <li>Recently Deleted</li>
          </ul>
        </aside>

        <main className="skrible-ai-main">
          <h2>Ask Skrible AI</h2>
          <input 
            type="text"
            placeholder="How can I help you..."
          />
        </main>
      </div>
    </div>
  )
}

export default SkribleAI