// frontend/src/components/NavBar.jsx

import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import DarkModeToggle from './DarkModeToggle';

const NavBar = () => {
    const { user, logout } =useContext(AuthContext);

    return (
        <nav className='bg-blue-600 dark:bg-slate-800 text-wite dark:text-gray-100 py-4 py x-8 flex justify-between items-center'>
            <h2 className='text-xl font-bold'>
                <Link to="/">Tweet App</Link>
            </h2>
            <div className='flex items-center gap-4'>
                <DarkModeToggle />
                {user ? (
                    <>
                        <span>Welcome, {user.username}!</span>
                        <Link to="/feed" className='hover:underline'>
                            Feed
                        </Link>
                        <Link to="/users" className='hover:underline'>
                            Users
                        </Link>
                        <Link to="/notifications" className='hover:underline'>
                            Notifications
                        </Link>
                        <Link to="/search" className='hover:underline'>
                            Search
                        </Link>
                        <button onClick={logout} className='bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded'>
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to='/login' className='hover:underline'>
                            Login
                        </Link>                       
                        <Link to='/register' className='hover:underline'>
                            Register
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default NavBar;