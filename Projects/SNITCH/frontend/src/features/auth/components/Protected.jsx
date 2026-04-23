import React from 'react'
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import Loader from './Loader';

const Protected = ({ children, role = "buyer" }) => {
    const user = useSelector((state) => state.auth.user);
    const loading = useSelector((state) => state.auth.loading);

    if (loading) {
        return <Loader />;
    }
    if (!user) {
        return <Navigate to="/login" replace />;
    } 

    if (user.role !== role) {
        return <Navigate to="/" replace />;
    }

    return children;
        

}

export default Protected
