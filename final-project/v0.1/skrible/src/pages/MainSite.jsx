import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import NoteContent from './NoteContent'
import './style.css'
import { SignedIn, UserButton, useUser } from '@clerk/clerk-react'

function MainSite() {
  const { user } = useUser();
  const [notes, setNotes] = useState([])
  const [selectedNoteId, setSelectedNoteId] = useState(null)
  const [activeSection, setActiveSection] = useState('notes')
  const navigate = useNavigate()

  const selectedNote = notes.find((note) => note.id === selectedNoteId)
  
  const displayedNotes = {
    notes: notes.filter(note => !note.isDeleted),
    favorites: notes.filter(note => note.isFavorite && !note.isDeleted),
    deleted: notes.filter(note => note.isDeleted)
  }[activeSection];

  useEffect(() => {
    if (user) {
      fetchNotes();
    }
  }, [user]);

  const fetchNotes = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/notes/${user.id}`);
      const data = await response.json();
      const mappedNotes = data.map(note => ({
        id: note._id,
        title: note.heading,
        body: note.body,
        userId: note.userId,
        _id: note._id
      }));
      setNotes(mappedNotes);
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  const createNewNote = () => {
    const newNote = {
      id: Date.now(),
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
      const noteData = {
        userId: user.id,
        heading: note.title || 'Untitled Note',
        body: note.body || '',
        _id: note._id,
        isFavorite: note.isFavorite || false
      };

      const response = await fetch('http://localhost:3000/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(noteData),
      });

      const responseData = await response.json();
      setNotes(notes.map(n => 
        n.id === note.id ? { ...n, _id: responseData._id } : n
      ));
      
    } catch (error) {
      alert('Failed to save note: ' + error.message);
    }
  };

  const handleFavoriteToggle = async (noteId) => {
    try {
      const noteToUpdate = notes.find(note => note.id === noteId);
      const updatedNote = { ...noteToUpdate, isFavorite: !noteToUpdate.isFavorite };
      
      setNotes(notes.map(note => 
        note.id === noteId ? updatedNote : note
      ));

      const response = await fetch(`http://localhost:3000/api/notes/${noteToUpdate._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isFavorite: updatedNote.isFavorite }),
      });

      if (!response.ok) {
        throw new Error('Failed to update favorite status');
      }
    } catch (error) {
      console.error('Error updating favorite status:', error);
    }
  };

  const handleDelete = async (noteId) => {
    try {
      const noteToUpdate = notes.find(note => note.id === noteId);
      
      await fetch(`http://localhost:3000/api/notes/${noteToUpdate._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isDeleted: true }),
      });

      setNotes(notes.map(note => 
        note.id === noteId ? { ...note, isDeleted: true } : note
      ));
      
      if (selectedNoteId === noteId) {
        setSelectedNoteId(null);
      }
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const handleRestore = async (noteId) => {
    try {
      const noteToUpdate = notes.find(note => note.id === noteId);
      
      await fetch(`http://localhost:3000/api/notes/${noteToUpdate._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isDeleted: false }),
      });

      setNotes(notes.map(note => 
        note.id === noteId ? { ...note, isDeleted: false } : note
      ));
    } catch (error) {
      console.error('Error restoring note:', error);
    }
  };

  const handlePermanentDelete = async (noteId) => {
    try {
      const noteToDelete = notes.find(note => note.id === noteId);
      
      await fetch(`http://localhost:3000/api/notes/${noteToDelete._id}`, {
        method: 'DELETE',
      });

      setNotes(notes.filter(note => note.id !== noteId));
    } catch (error) {
      console.error('Error permanently deleting note:', error);
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

          <h2 
            onClick={() => setActiveSection('notes')}
            className={activeSection === 'notes' ? 'active-section' : ''}
          >
            My Notes
          </h2>
          <ul>
            {activeSection === 'notes' && displayedNotes.map((note) => (
              <li key={note.id}>
                <button onClick={() => setSelectedNoteId(note.id)}>
                  {note.title}
                </button>
              </li>
            ))}
          </ul>

          <h3>More</h3>
          <ul>
            <li onClick={() => setActiveSection('favorites')}>
              ⭐ Favourites
              {activeSection === 'favorites' && (
                <ul>
                  {displayedNotes.map((note) => (
                    <li key={note.id}>
                      <button onClick={() => setSelectedNoteId(note.id)}>
                        {note.title}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </li>
            <li onClick={() => setActiveSection('deleted')}>
              🗑️ Recently Deleted
              {activeSection === 'deleted' && (
                <ul>
                  {displayedNotes.map((note) => (
                    <li key={note.id} className="deleted-note-item">
                      <button onClick={() => setSelectedNoteId(note.id)}>
                        {note.title}
                      </button>
                      <div className="deleted-note-actions">
                        <button onClick={() => handleRestore(note.id)}>
                          ↩️ Restore
                        </button>
                        <button 
                          onClick={() => handlePermanentDelete(note.id)}
                          className="permanent-delete"
                        >
                          ❌ Delete Permanently
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          </ul>
        </aside>

        <div className="main-site-main">
          <NoteContent 
            note={selectedNote} 
            onUpdate={updateNote}
            onSave={() => selectedNote && saveNote(selectedNote)}
            onFavoriteToggle={() => selectedNote && handleFavoriteToggle(selectedNote.id)}
            onDelete={() => selectedNote && handleDelete(selectedNote.id)}
          />
        </div>
      </div>
    </SignedIn>
  )
}

export default MainSite