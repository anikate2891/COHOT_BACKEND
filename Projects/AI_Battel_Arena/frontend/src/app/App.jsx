import Hero from '../features/Hero'
import Login from '../pages/Login'
import Register from '../pages/Register'
import Welcome from '../pages/Welcome'
import PageNotFound from '../pages/PageNotFound'
import {Routes, Route} from 'react-router-dom'
import { useState } from "react";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("isAuth") === "true"
  );

  window.addEventListener("storage", () => {
  setIsLoggedIn(localStorage.getItem("isAuth") === "true");
});
  

  return (
    <Routes>
      <Route path="/" element={isLoggedIn ? <Hero /> : <Login />} />
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
      <Route path='/welcome' element={isLoggedIn ? <Welcome /> : <Login />} />

      <Route path="*" element={<PageNotFound />} />
    </Routes>
  )
}

export default App
