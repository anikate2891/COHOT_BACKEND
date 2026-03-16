import { RouterProvider } from 'react-router-dom'
import { router } from './app.route'
import { useAuth } from '../features/auth/hook/useAuth'
import { useEffect } from 'react'

const App = () => {

  const auth = useAuth()

  useEffect(() => {
    auth.handelGetMe()
  }, [])

  return <RouterProvider router={router} />
}

export default App
