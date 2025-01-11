// frontend/src/components/Home.jsx

import React, { useContext } from 'react';
import { AuthContext } from '../contexrts/AuthContext';
import TweetCreateForm from './TweetCreateForm';
import TweetList from './TweetList';
import LogoutButton from './LogoutButton';

const Home = () => {
    const { user } = useContext(AuthContext);

    return (
        <div>
            <h1>Tweet App</h1>
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