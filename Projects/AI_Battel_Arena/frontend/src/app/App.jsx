import Hero from '../features/Hero'
import Login from '../pages/Login'
import Register from '../pages/Register'
import Welcome from '../pages/Welcome'
import PageNotFound from '../pages/PageNotFound'
import {Routes, Route} from 'react-router-dom'

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Hero />} />
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
      <Route path='/welcome' element={<Welcome />} />

      <Route path="*" element={<PageNotFound />} />
    </Routes>
  )
}

export default App
