// frontend/src/components/Home.jsx

import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import TweetCreateForm from './TweetCreateForm';
import TweetList from './TweetList';
import LogoutButton from './LogoutButton';
import Trends from './Trends';

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
                <div className='w-1/3 pl-4'>
                    <Trends />
                </div>
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