import React from 'react'
import './app.css'
import { RouterProvider } from 'react-router'
import { routes } from './app.route.jsx'

const App = () => {
  return (
    <>
      <RouterProvider router={routes} />
    </>
  )
}

export default App
