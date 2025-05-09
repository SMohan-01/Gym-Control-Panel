import React, { useContext } from 'react'
import { Navigate, Outlet } from "react-router-dom";
import { AppContext } from './AppContext';


const RequireAuth = () => {
    const { isLoggedIn } = useContext(AppContext);
    if (!isLoggedIn) {
        return <Navigate to="/" replace />;
      }
    
      return <Outlet />;
}

export default RequireAuth