import React, { useState, useEffect } from 'react'
import './style.css'

function NoteContent({ note, onUpdate, onSave }) {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')

  useEffect(() => {
    if (note) {
      setTitle(note.title)
      setBody(note.body)
    }
  }, [note])

  if (!note) {
    return <div className="note-content">Select a note or create a new one</div>
  }

  const handleTitleChange = (e) => {
    const newTitle = e.target.value
    setTitle(newTitle)
    onUpdate({ ...note, title: newTitle })
  }

  const handleBodyChange = (e) => {
    const newBody = e.target.value
    setBody(newBody)
    onUpdate({ ...note, body: newBody })
  }

  return (
    <div className="note-content">
      <div className="note-header">
        <input
          type="text"
          value={title}
          onChange={handleTitleChange}
          className="note-title-input"
          placeholder="Note Title"
        />
        <button onClick={onSave} className="save-button">
          Save
        </button>
      </div>
      <textarea
        value={body}
        onChange={handleBodyChange}
        className="note-body-input"
        placeholder="Start writing your note..."
      />
    </div>
  )
}

export default NoteContent