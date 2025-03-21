import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import NoteContent from './NoteContent'
import './style.css'
import { SignedIn, SignedOut, SignOutButton } from '@clerk/clerk-react'

function MainSite() {
 
  const notesList = [
    { id: 1, title: 'Note 1', body: 'Lorem ipsum for Note 1...' },
    { id: 2, title: 'Note 2', body: 'Lorem ipsum for Note 2...' },
    { id: 3, title: 'Task List', body: 'Task 1\nTask 2\nTask 3' },
  ]

  const [selectedNoteId, setSelectedNoteId] = useState(null)
  const navigate = useNavigate()

  const selectedNote = notesList.find((note) => note.id === selectedNoteId)

  return (
    
    <SignedIn>
    <div className="main-site-container">
  
      <header className="main-site-header">
        <h1>Skrible</h1>
        <div>
          <p>Profile</p>
          <button onClick={() => navigate('/')}>Log Out</button>
        </div>
      </header>

    
      <aside className="main-site-sidebar">
        <button onClick={() => navigate('/skribleai')}>Skrible AI</button>
        <button>+ New Note</button>

        <h2>My Notes</h2>
        <ul>
          {notesList.map((note) => (
            <li key={note.id}>
              <button onClick={() => setSelectedNoteId(note.id)}>
                {note.title}
              </button>
            </li>
          ))}
        </ul>

        <h3>More</h3>
        <ul>
          <li>Favourites</li>
          <li>Recently Deleted</li>
        </ul>
      </aside>

      <main className="main-site-main">
        <NoteContent note={selectedNote} />
      </main>
    </div>
    
    <SignOutButton />
    </SignedIn>
    
  )
}

export default MainSite