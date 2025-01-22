// frontend/src/compornents/Profile.jsx

import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import API from '../axiosConfig';
import ProfileImageUpload from './ProfileImageUpload';

function Profile() {
    const { username } = useParams(); //URLパラメータからusernameを取得
    console.log("Username from usePrams:", username);
    console.log("UseParams output:", useParams());
    const [profile, setProfile] = useState(null);

    const getProfileImageUrl = (relativePath) => {
        if (!relativePath) return '';
        return `http://localhost:8000${relativePath}`;
    }

    // プロフィール画像更新用関数
    const handleImageUpdate = (newImage) => {
        setProfile((prevProfile) => ({
            ...prevProfile,
            profile_image: getProfileImageUrl(newImage),
        }));
    };


    useEffect(() => {
        const fetchProfile = () => {
             API.get(`/profile/${username}/`)
                 .then((response) => {
                    // response.data.profile_image は "profile_images/xxx.jpg" などの相対パス
                    const absoluteUrl = getProfileImageUrl(response.data.profile_image);

                    // Stateにセットする際に絶対URLに置き換えておく
                    setProfile({
                        ...response.data,
                        profile_image: absoluteUrl,
                    });
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
            <Link to={`/dm/${profile.user_id}`} className='bg-blue-500 text-white px-3 py-1 rounded'>
                Send Message
            </Link>
            <h1>{profile.username}'s Profile</h1>
            <ProfileImageUpload
                currentImage={profile.profile_image}
                onUpdate={handleImageUpdate}
            />
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