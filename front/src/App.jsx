import { useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Toaster } from 'sonner';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';

import Home from './components/pages/Home.jsx'
import SignIn from './components/pages/Auth/SignIn.jsx'
import Profile from './components/pages/User/Profile.jsx'
import Setting from './components/pages/User/Settings.jsx'
import SignUp from './components/pages/Auth/SignUp.jsx'
import UserRoute from './components/layouts/UserRoute.jsx'
import GuestRoute from './components/layouts/GuestRoute.jsx'

function  App() {
  return (
    <PhotoProvider>
      <Toaster position='bottom-right'/>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<UserRoute><Home /></UserRoute>} />
          <Route path='/login' element={<GuestRoute><SignIn /></GuestRoute>} />
          <Route path='/signup' element={<GuestRoute><SignUp /></GuestRoute>} />
          <Route path='/profile' element={<UserRoute><Profile /></UserRoute>} />
          <Route path='/setting' element={<UserRoute><Setting /></UserRoute>} />
        </Routes>
      </BrowserRouter>
    </PhotoProvider>
  )
}

export default App
