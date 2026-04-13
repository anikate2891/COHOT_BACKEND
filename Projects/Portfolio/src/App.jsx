import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Hero from './pages/Hero'
import Welcome from './pages/Welcome'

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/hero" element={<Hero />} />
      </Routes>
    </>
  )
}

export default App
