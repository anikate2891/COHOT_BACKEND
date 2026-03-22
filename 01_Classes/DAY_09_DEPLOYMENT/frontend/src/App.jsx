import React, { useEffect } from 'react'
import { useState } from 'react';
import axios from 'axios';

const App = () => {
const [notes, setnotes] = useState([]);

function fetchNotes(){
  axios.get('http://localhost:5000/notes')
  .then(res=>setnotes(res.data))
  .catch(err=>console.log(err))
}
  

useEffect(()=>{fetchNotes()},[])

  return (
    <>
      <form>
        <input type="text" placeholder='Title' />
        <input type="text" placeholder='Description' />
        <button type='submit'>Add Note</button>
      </form>

      <div className="notes">
        {notes.map(note=>{
          return <div className="note">
          <h1>{note.title}</h1>
          <p>{note.description}</p>
          </div>
          })}
      </div>

    </>
  )
}

export default App
