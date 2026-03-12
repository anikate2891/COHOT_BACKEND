import { RouterProvider } from 'react-router-dom'
import { router } from './app.route.jsx'
import './features/shared/global.css'
import { AuthProvider } from './features/auth/auth.Comtext'

function App() {

  return (
   <>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </>
  )
}

export default App
