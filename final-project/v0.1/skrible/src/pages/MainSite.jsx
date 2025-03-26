import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import NoteContent from './NoteContent'
import './style.css'
import { GoogleOneTap, SignedIn, SignedOut, SignOutButton, UserButton, UserProfile, useUser } from '@clerk/clerk-react'

function MainSite() {
  const { user } = useUser();
  const [notes, setNotes] = useState([])
  const [selectedNoteId, setSelectedNoteId] = useState(null)
  const navigate = useNavigate()

  const selectedNote = notes.find((note) => note.id === selectedNoteId)

  useEffect(() => {
    if (user) {
      fetchNotes();
    }
  }, [user]);

  const fetchNotes = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/notes/${user.id}`);
      const data = await response.json();
      // Map MongoDB fields to frontend fields
      const mappedNotes = data.map(note => ({
        id: note._id, // Use MongoDB's _id as our frontend id
        title: note.heading,
        body: note.body,
        userId: note.userId,
        _id: note._id // Keep the MongoDB _id for updates
      }));
      setNotes(mappedNotes);
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  const createNewNote = () => {
    const newNote = {
      id: Date.now(), // Temporary ID for UI
      title: 'Untitled Note',
      body: '',
      userId: user.id
    }
    setNotes([...notes, newNote])
    setSelectedNoteId(newNote.id)
  }

  const updateNote = (updatedNote) => {
    setNotes(notes.map(note => 
      note.id === updatedNote.id ? updatedNote : note
    ))
  }

  const saveNote = async (note) => {
    try {
      console.log('Starting save note process...');
      console.log('Current user:', user);
      
      if (!user || !user.id) {
        console.error('No user ID available');
        alert('Please sign in to save notes');
        return;
      }

      const noteData = {
        userId: user.id,
        heading: note.title || 'Untitled Note',
        body: note.body || '',
        _id: note._id // Include _id if it exists (for updates)
      };
      
      console.log('Preparing to send note data:', noteData);

      const response = await fetch('http://localhost:3000/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(noteData),
      });

      console.log('Response status:', response.status);
      const responseData = await response.json();
      console.log('Response data:', responseData);

      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to save note');
      }

      // Update the note in the local state with the MongoDB _id
      setNotes(notes.map(n => 
        n.id === note.id ? { ...n, _id: responseData._id } : n
      ));
      
      alert('Note saved successfully!');
    } catch (error) {
      console.error('Error saving note:', error);
      alert('Failed to save note: ' + error.message);
    }
  };

  return (
    <SignedIn>
      <div className="main-site-container">
        <header className="main-site-header">
          <h1>Skrible</h1>
          <div>
            <p>Profile</p>
            <UserButton />
          </div>
        </header>

        <aside className="main-site-sidebar">
          <button onClick={() => navigate('/skribleai')}>Skrible AI</button>
          <button onClick={createNewNote}>+ New Note</button>

          <h2>My Notes</h2>
          <ul>
            {notes.map((note) => (
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
          <NoteContent 
            note={selectedNote} 
            onUpdate={updateNote}
            onSave={() => selectedNote && saveNote(selectedNote)}
          />
        </main>
      </div>
    </SignedIn>
  )
}

export default MainSite