// frontend/src/components/Trends.jsx

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../axiosConfig';

function Trends() {
    const [trends, setTrends] = useState([]);

    useEffect(() => {
        API.get('tweets/trending/')
            .then((response) => {
                setTrends(response.data);
            })
            .catch((error) => {
                console.error(error)
            });
    }, []);

    return (
        <div className='bg-white p-4 shadow'>
            <h2 className='font-bold mb-2'>Trending Hashtags</h2>
            {trends.length > 0 ? (
                <ul>
                    {trends.map((item, idx) => (
                        <li key={idx}>
                            <Link
                                to={`/hashtag/${item.name}`}
                                className='text-blue-500 hover:underline'
                            >
                                #{item.name}
                            </Link>
                            <span className='text-sm text-gray-500 ml-2'>
                                {item.tweet_count} Tweets
                            </span>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No hashtags yet.</p>
            )}
        </div>
    );
}

export default Trends;