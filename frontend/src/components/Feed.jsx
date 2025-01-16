import React, { useState, useEffect } from 'react';
import API from '../axiosConfig';

function Feed() {
    const [tweets, setTweets] = useState([]);

    useEffect(() => {
        fetchFeed();
    }, []);

    const fetchFeed = () => {
        API.get('tweets/feed/')
            .then((response) => {
                setTweets(response.data);
            })
            .catch((error) => {
                console.error('Error fetching feed:', error);
            });
    };

    return (
        <div>
            <h2>Your Feed</h2>
            {tweets.length > 0 ? (
                tweets.map((tweet) => (
                    <div key={tweet.id} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0' }}>
                        <p><strong>{tweet.user.username}</strong> - {new Date(tweet.created_at).toLocaleString()}</p>
                        <p>{tweet.content}</p>
                    </div>
                ))
            ) : (
                <p>No tweets from users you are following.</p>
            )}
        </div>
    );
}

export default Feed;