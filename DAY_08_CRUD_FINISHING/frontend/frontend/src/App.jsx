import React from 'react'
import { useState } from 'react';
import axios from 'axios';

const App = () => {
  const [notes, setNotes] = useState([
    {
      title: 'Note 1',
      discription: 'This is the content of the first note.'
    },
    {
      title: 'Note 2',
      discription: 'This is the content of the second note.'
    },
    {
      title: 'Note 3',
      discription: 'This is the content of the third note.'
    },
    {
      title: 'Note 4',
      discription: 'This is the content of the fourth note.'
    },

  ]);

  axios.get('http://localhost:3000/notes')
    .then(response => {
      setNotes(response.data.notes);
    })

  return (
    <>
      <div className="notes">

        {notes.map(note =>{
          return <div className="note">
          <h1>{note.title}</h1>
          <p>{note.discription}</p>
        </div>
        })}

      </div>
    </>
  )
}

export default App
