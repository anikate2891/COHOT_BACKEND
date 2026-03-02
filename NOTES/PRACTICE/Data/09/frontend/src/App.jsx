import React, { useEffect } from 'react'
import { useState } from 'react'
import axios from 'axios'

const App = () => {

  const [notes, setnotes] = useState([]);

  function fetchNote(){
    axios.get('http://localhost:3000/notes')
    .then(res=>{
      console.log(res.data)
      setnotes(res.data.notes)
    })
  }

  useEffect(() => { fetchNote() }, [])

  function formhandeler(e){
    e.preventDefault();
    const {title, content} = e.target.elements;
    console.log(title.value, content.value)

    axios.post('http://localhost:3000/notes', {
      title: title.value,
      content: content.value
    })
    .then(res=>{
      console.log(res.data)
      fetchNote()
    })
  }

  function deleteFnc(id){
    axios.delete(`http://localhost:3000/notes/${id}`)
    .then(res=>{
      console.log(res.data)
      fetchNote()
    })
  }

  return (
    <>

    <form className='note-create-form' onSubmit={formhandeler}>
      <input type="text" name='title' placeholder='Title' />
      <input type="text" name='content' placeholder='Content' />
      <button type='submit'>Add Note</button>
    </form>

      <div className="notes">
        {notes.map(note=>{
          return <div className="note">
          <h1>{note.title}</h1>
          <p>{note.content}</p>
          <button onClick={() => deleteFnc(note._id)}>delete</button>
        </div>
        })}
      </div>

    </>
  )
}

export default App
