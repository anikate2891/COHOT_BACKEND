import React from 'react'
import Register from '../pages/Register.jsx'
import './app.css'
import { RouterProvider } from 'react-router-dom'
import { routes } from './app.route.js'

const App = () => {
  return (
    <>
      <RouterProvider router={routes} />
    </>
  )
}

export default App
