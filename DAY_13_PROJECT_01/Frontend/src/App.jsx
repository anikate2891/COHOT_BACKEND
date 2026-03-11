import React from 'react'
import { RouterProvider } from 'react-router'
import { router } from './app.route'
import './features/shared/global.scss'
import { AuthProvider } from './features/auth/auth.Contex'
import { PostProvider } from './features/posts/Post.Context'

const App = () => {
  return (
    <>
      <AuthProvider>
        <PostProvider>
          <RouterProvider router={router}/>
        </PostProvider>
      </AuthProvider>
    </>
  )
}

export default App
