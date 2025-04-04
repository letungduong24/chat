import React, { useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import Loading from '../Common/Loading'
import GuestNavbar from '../Common/GuestNavbar'
import { useAuthStore } from '../../store/useAuthStore'

const GuestRoute = ({children}) => {
  const {user, checkAuth, isCheckingAuth} = useAuthStore()

  useEffect(() => {
    if (!user) {
      checkAuth()
    }
  }, [user]);

  if(isCheckingAuth){
    return <Loading />
  }

  if (!isCheckingAuth && user) {
    return <Navigate to='/' replace />;
  }
  
  return (
    <div className="h-screen flex flex-col">
      <GuestNavbar />
      <div className="flex-grow flex flex-col min-h-0">
        {children}
      </div>
    </div>
  );
  
  
}

export default GuestRoute