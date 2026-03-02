import React from 'react'
import { RouterProvider } from 'react-router'
import { router } from './app.route'
import './features/shared/global.scss'
import { AuthProvider } from './features/auth/auth.Contex'

const App = () => {
  return (
    <>
      <AuthProvider>
        <RouterProvider router={router}/>
      </AuthProvider>
    </>
  )
}

export default App
