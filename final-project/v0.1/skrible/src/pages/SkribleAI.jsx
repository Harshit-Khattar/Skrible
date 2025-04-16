import React, { useState } from 'react'
import { useUser } from '@clerk/clerk-react'
import './style.css'

function SkribleAI() {
  
  const { user } = useUser()
  const [query, setQuery] = useState('')
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    const response = await fetch('http://localhost:3000/api/ai/query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: user.id,
        query,
      }),
    })
    
    const data = await response.json()
    setResponse(data.response)
    setLoading(false)
  }

  return (
       

        <main className="skrible-ai-main">
          <h2>Ask Skrible AI</h2>
          
          <form onSubmit={handleSubmit}>
            <input 
              type="text"
              placeholder="How can I help you..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={loading}
            />
            <button type="submit" disabled={loading}>
              {loading ? 'Processing...' : 'Ask'}
            </button>
          </form>
          
          {response && (
            <div className="ai-response">
              <h3>Response:</h3> 
              <p>{response}</p>
            </div>
          )}
        </main>

  )
}

export default SkribleAI