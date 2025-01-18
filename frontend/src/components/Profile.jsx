// frontend/src/compornents/Profile.jsx

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../axiosConfig';

function Profile() {
    const { username } = useParams(); //URLパラメータからusernameを取得
    console.log("Username from usePrams:", username);
    console.log("UseParams output:", useParams());
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        const fetchProfile = () => {
             API.get(`/profile/${username}/`)
                 .then((response) => {
                     setProfile(response.data);
                 })
                 .catch((error) => {
                     console.error('Error fetching profile:', error);
                 });
        };

        fetchProfile();
    }, [username]);
     
    if (!profile) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <h1>{profile.username}'s Profile</h1>
            <p>Email: {profile.email}</p>
            <p>First Name: {profile.first_name}</p>
            <p>Last Name: {profile.last_name}</p>
            <p>Joined: {new Date(profile.date_joined).toLocaleDateString()}</p>
            <p>Followers: {profile.followers}</p>
            <p>Following: {profile.following}</p>

            <h2>Tweets</h2>
            {profile.tweets.length > 0 ? (
                profile.tweets.map((tweet) => (
                    <div key={tweet.id} style={{ border: '1px solid #ccc', marginBottom: '10px', padding: '10px'}}>
                        <p>{tweet.content}</p>
                        <small>{new Date(tweet.created_at).toLocaleString()}</small>
                    </div>
                ))
            ) : (
                <p>No tweets yet.</p>
            )}
        </div>
    );
}

export default Profile;