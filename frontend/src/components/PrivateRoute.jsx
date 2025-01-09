// frontend/components/PrivateRoute.jsx

import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const PrivateRoute = ({ children }) => {
    const { user, isAuthenticating } = useContext(AuthContext);

    if (isAuthenticating) {
        return <p>Loading...</p>;
    }

    return user ? children : <Navigate to="/login" />;
};

export default PrivateRoute;