// frontend/src/components/HashtagPage.jsx

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../axiosConfig';

function HashtagPage() {
    const { tag } = useParams();
    const [tweets, setTweets] = useState([]);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        API.get(`tweets/hashtags/${tag}/`)
        .then((response) => {
            setTweets(response.data.tweets);
        })
        .catch((error) => {
            console.error(error);
            setNotFound(true);
        });
    }, [tag]);

    if (notFound) {
        return <p>Hashtag not found.</p>;
    }

    return (
        <div>
            <h2>#{tag} - {tweets.length} Tweets</h2>
            {tweets.map((tweet) => (
                <div key={tweet.id} className='border-b p-4'>
                    <p><strong>{tweet.user.username}</strong> - {new Date(tweet.created_at).toLocaleString()}</p>
                    <p>{tweet.content}</p>
                </div>
            ))}
        </div>
    );
}

export default HashtagPage;