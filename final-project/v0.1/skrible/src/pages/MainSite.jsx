import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import NoteContent from './NoteContent'
import './style.css'
import Task from './Task'
import SkribleAI from './SkribleAI'
import { SignedIn, UserButton, useUser } from '@clerk/clerk-react'

function MainSite() {
  const { user } = useUser();
  const navigate = useNavigate()
  const [notes, setNotes] = useState([])
  const [selectedNoteId, setSelectedNoteId] = useState(null)
  const [activeSection, setActiveSection] = useState('notes')
  const [showTasks, setShowTasks] = useState(false)
  const [showSkribleAI, setShowSkribleAI] = useState(false)

  const isAdmin = user && import.meta.env.VITE_ADMIN_IDS?.split(',').includes(user.id)

  const selectedNote = notes.find((note) => note.id === selectedNoteId)

  useEffect(() => {
    if (user) {
      fetchNotes();
    }
  }, [user]);

  const fetchNotes = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/notes/${user.id}/notes`);
      const data = await response.json();
      const mappedNotes = data.map(note => ({
        id: note._id,
        title: note.title,
        body: note.body,
        userId: note.userId,
        _id: note._id,
        isActive: note.isActive,
        isFavorite: note.isFavorite
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
      userId: user.id,
      isActive: true,
      isFavorite: false
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
        title: note.title || 'Untitled Note',
        body: note.body || '',
        isFavorite: note.isFavorite || false,
        isActive: note.isActive
      };
      if (!note._id) {
        noteData.userId = user.id;
        const response = await fetch(`http://localhost:3000/api/notes/${user.id}/notes`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(noteData),
        });
        const responseData = await response.json();
        responseData.id = responseData._id;
        setNotes(notes.map(n => n.id === note.id ? responseData : n)); 
        setSelectedNoteId(responseData.id);
        return;
      }
      const noteToUpdate = note
      if (!noteToUpdate) {
        throw new Error('Note not found');
      }

      const response = await fetch(`http://localhost:3000/api/notes/${user.id}/notes/${note._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(noteData),
      });

      const responseData = await response.json();
      responseData.id = responseData._id;

      console.log('Updated note:', responseData);

      setNotes(notes.map(note =>
        note._id === responseData._id ? responseData : note
      ));
      setSelectedNoteId(responseData._id);
    } catch (error) {
      alert('Failed to save note: ' + error.message);
    }
  };

  const handleFavoriteToggle = async (noteId) => {
    try {
      const noteToToggle = notes.find(note => note.id == noteId);
      if (!noteToToggle) {
        console.error('Note not found for toggling favorite');
        return; 
      }

      const updatedNote = { ...noteToToggle, isFavorite: !noteToToggle.isFavorite };
      await saveNote(updatedNote);

    } catch (error) {
      console.error('Error updating favorite status:', error);
    }
  };

  const handleDelete = async (noteId) => {
    try {
      const noteToUpdate = notes.find(note => note.id === noteId);
      if (!noteToUpdate) {
        throw new Error('Note not found');
      }

      const updatedNote = noteToUpdate
      updatedNote.isActive = false;
      await saveNote(updatedNote);
      
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
      if (noteToUpdate.isActive) {
        throw new Error('Note is already active');
      }

      const updatedNote = noteToUpdate;
      updatedNote.isActive = true;
      await saveNote(updatedNote);
    } catch (error) {
      console.error('Error restoring note:', error);
    }
  };

  const handlePermanentDelete = async (noteId) => {
      const noteToDelete = notes.find(note => note.id === noteId);
      await fetch(`http://localhost:3000/api/notes/${user.id}/notes/${noteToDelete._id}`, {
        method: 'DELETE',
      });
      await fetchNotes();
      setSelectedNoteId(null);
  };

  return (
    <SignedIn>
      <div className="main-site-container">
        <header className="main-site-header">
          <h1>Skrible</h1>
          <div>
            {isAdmin && (
              <button 
                style={{ 
                  cursor: 'pointer', 
                  borderRadius: '7px', 
                  padding: '7px', 
                  color: 'white', 
                  backgroundColor: 'transparent', 
                  marginRight: '20px' 
                }} 
                onClick={() => { navigate('/admin')}}
              >
                Admin Dashboard
              </button>
            )}
            <p>Profile</p>
            <UserButton />
          </div>
        </header>

        <aside className="main-site-sidebar">
          <button onClick={() => { setShowSkribleAI(true); setShowTasks(false); setSelectedNoteId(null); setActiveSection('ai'); }}>Skrible AI</button>
          <button onClick={() => { setShowTasks(true); setShowSkribleAI(false); setSelectedNoteId(null); setActiveSection('tasks'); }}>Tasks</button>
          <button onClick={() => { createNewNote(); setShowTasks(false); setShowSkribleAI(false); setActiveSection('notes')}}>+ New Note</button>

          <h2 
            onClick={() => { setActiveSection('notes'); setShowTasks(false); setShowSkribleAI(false); }}
            className={activeSection === 'notes' ? 'active-section' : ''}
            style={{ cursor: 'pointer' }}
          >
            My Notes
          </h2>
          <ul>
            {notes.filter(note => note.isActive).length === 0 && (
               <li style={{ color: '#aaa', fontStyle: 'italic' }}>No active notes.</li>
            )}
            {notes.filter(note => note.isActive).map((note) => (
              <li key={note.id}>
                <button onClick={() => { setSelectedNoteId(note.id); setShowTasks(false); setShowSkribleAI(false); }}>
                  {note.title}
                </button>
              </li>
            ))}
          </ul>

          <h3>More</h3>
          
          <div>
            <button 
              onClick={() => { 
                setActiveSection(activeSection === 'favorites' ? 'notes' : 'favorites'); 
                setShowTasks(false); 
                setShowSkribleAI(false); 
              }}
              className={activeSection === 'favorites' ? 'sidebar-button-active' : ''}
            >
                ⭐ Favourites
            </button>
            {activeSection === 'favorites' && (
              <ul style={{ marginLeft: '1rem', marginTop: '0.5rem' }}>
                {(() => {
                  const favoriteNotes = notes.filter(note => note.isFavorite && note.isActive);
                  
                  if (favoriteNotes.length === 0) {
                    return <li style={{ color: '#aaa', fontStyle: 'italic' }}>No favourites yet.</li>;
                  }

                  return favoriteNotes.map((note) => (
                    <li key={note.id}>
                      <button onClick={() => {
                        setSelectedNoteId(note.id);
                        setShowTasks(false);
                        setShowSkribleAI(false);
                      }}>
                        {note.title}
                      </button>
                    </li>
                  ));
                })()}
              </ul>
            )}
          </div>

          <div>
             <button 
                onClick={() => { 
                  setActiveSection(activeSection === 'deleted' ? 'notes' : 'deleted'); 
                  setShowTasks(false); 
                  setShowSkribleAI(false); 
                }}
                className={activeSection === 'deleted' ? 'sidebar-button-active' : ''}
             >
                🗑️ Recently Deleted
             </button>
             {activeSection === 'deleted' && (
                <ul style={{ marginLeft: '1rem', marginTop: '0.5rem' }}>
                  {(() => {
                    const deletedNotes = notes.filter(note => !note.isActive);
                    
                    if (deletedNotes.length === 0) {
                      return <li style={{ color: '#aaa', fontStyle: 'italic' }}>No recently deleted notes.</li>;
                    }

                    return deletedNotes.map((note) => (
                      <li key={note.id} className="deleted-note-item">
                        <button onClick={() => {
                          setSelectedNoteId(note.id);
                          setShowTasks(false);
                          setShowSkribleAI(false);
                        }}>
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
                    ));
                  })()}
                </ul>
              )}
           </div>
        </aside>

        <div className="main-site-main">
        {showSkribleAI ? (
          <SkribleAI />
        ) : showTasks ? (
          <Task />
        ) :  (
          <NoteContent
            note={selectedNote}
            onUpdate={updateNote}
            onSave={() => selectedNote && saveNote(selectedNote)}
            onFavoriteToggle={() => selectedNote && handleFavoriteToggle(selectedNote.id)}
            onDelete={() => selectedNote && handleDelete(selectedNote.id)}
          />
        ) }
        </div>
      </div>
    </SignedIn>
  )
}

export default MainSite