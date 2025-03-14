import React from 'react'
import './style.css'

function NoteContent({ note }) {
  if (!note) {
    return <div>No note selected</div>
  }

  return (
    <div className="note-content">
      <h2>{note.title}</h2>
      <p>{note.body}</p>
    </div>
  )
}

export default NoteContent