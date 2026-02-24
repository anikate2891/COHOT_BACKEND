import React from 'react'
import { RouterProvider } from 'react-router'
import { router } from './app.route'
import './features/shared/global.scss'

const App = () => {
  return (
    <>
      <RouterProvider router={router}/>
    </>
  )
}

export default App
