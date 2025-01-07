// frontend/src/components/TweetList.jsx
import React, { useState, useEffect} from 'react';
import axios from 'axios';

function TweetList({ tweets, setTweets }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  //コンポーネントがマウントされたときにツイート一覧を取得
  useEffect(() => {
    fetchTweets();
  }, []);

  const fetchTweets = () => {
    axios.get('http://localhost:8000/api/tweets/')
      .then(response => {
        setTweets(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching tweets:', error);
        setError('Failed to load tweets')
        setLoading(false);
      });
  };

  if (loading) {
    return <p>Loading tweets...</p>
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>
  }

  return (
    <div>
      <h2>Tweet List</h2>
      {tweets.length === 0 ? (
        <p>No tweets available.</p>
      ) : (
        tweets.map(tweet => (
          <div key={tweet.id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px'}}>
            <p>{tweet.text}</p>
            <small>By: {tweet.user.username} at {new Date(tweet.created_at).toLocaleString()}</small>
          </div>
        ))
      )}
    </div>
  );
}

export default TweetList;
