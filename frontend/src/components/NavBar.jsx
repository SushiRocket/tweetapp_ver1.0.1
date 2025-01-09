// frontend/src/components/NavBar.jsx

import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const NavBar = () => {
    const { user, logout } =useContext(AuthContext);

    return (
        <nav>
            <h2>Tweet App</h2>
            <div>
                {user ? (
                    <>
                        <span>Welcome, {user.username}!</span>
                        <button onClick={logout}>Logout</button>
                    </>
                ) : (
                    <>
                        <Link to='/login'>Login</Link>                       
                        <Link to='/register'>Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default NavBar;