import React, { useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import Loading from '../Common/Loading'
import AuthNavbar from '../Common/AuthNavbar'
import { useAuthStore } from '../../store/useAuthStore'

const UserRoute = ({children}) => {
  const {user, checkAuth, isCheckingAuth, onlineUsers} = useAuthStore()

  console.log(onlineUsers)

  useEffect(() => {
    if (!user) {
      checkAuth()
    }
  }, [user]);


  if(isCheckingAuth){
    return <Loading />
  }

  if (!isCheckingAuth && !user) {
    return <Navigate to='/login' replace />;
  }
  
  return (
    <div className="h-screen flex flex-col">
      <AuthNavbar />
      <div className="flex-grow flex flex-col min-h-0">
        {children}
      </div>
    </div>
  );
  
  
}

export default UserRoute