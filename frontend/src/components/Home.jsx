// frontend/src/components/Home.jsx

import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import TweetCreateForm from './TweetCreateForm';
import TweetList from './TweetList';
import LogoutButton from './LogoutButton';

const Home = () => {
    const { user } = useContext(AuthContext);

    return (
        <div className='container mx-auto mt-8 px-4'>
            <h1 className='text-2xl font-bold mb-4'>
                Home Page
            </h1>
            <p className='mb-4'>
                This is your personal Tweet App. Check out your feed or search for other users.
            </p>
            {user ? (
                <>
                <TweetCreateForm />
                <TweetList />
                <LogoutButton />
                </>
            ) : ( 
                <p>Loding...</p>
            )}
        </div>
    );
};

export default Home;