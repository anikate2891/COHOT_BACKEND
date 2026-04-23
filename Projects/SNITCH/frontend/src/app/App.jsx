import React, {useEffect} from 'react'
import './app.css'
import { RouterProvider } from 'react-router'
import { routes } from './app.route.jsx'
import { useUserAuth } from '../features/auth/hook/userAuth.js';

const App = () => {
  const { handelGetMe } = useUserAuth();

  useEffect(() => {
    handelGetMe();
  }, [handelGetMe]);


  return (
    <>
      <RouterProvider router={routes} />
    </>
  )
}

export default App
