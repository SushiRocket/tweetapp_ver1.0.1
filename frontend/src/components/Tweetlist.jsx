// frontend/src/components/TweetList.jsx]

import React, { useState, useEffect, useCallback, useContext} from 'react';
import API from '../axiosConfig';
import { AuthContext } from '../contexts/AuthContext';
import TweetEditForm from './TweetEditForm';

function TweetList({ tweets, setTweets }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingTweetId, setEditingTweetId] = useState(null);
  const { user } = useContext(AuthContext);

  const fetchTweets = useCallback(() => {
    API.get('tweets/')
      .then(response => {
        setTweets(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching tweets:', error);
        setError('Failed to load tweets')
        setLoading(false);
      });
  }, [setTweets]);

  //コンポーネントがマウントされたときにツイート一覧を取得
  useEffect(() => {
    fetchTweets();
  }, [fetchTweets]);


  if (loading) {
    return <p>Loading tweets...</p>
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this tweet?')) {
      API.delete(`tweet/${id}`)
        .then(() => {
          setTweets(tweets.filter( tweet => tweet.id !== id ));
          //filterメソッドで特定の要素だけを抽出してコールバック関数(setTweets)に渡す
          //tweet => tweet.id !== idを満たせばtrueとしてsetTweetsに渡す
        })
        .catch(error => {
          console.error('Error deleting tweet:', error);
        });
    }
  };

  const handleEdit = (id) => {
    setEditingTweetId(id);
  };

  const handleCancelEdit = () => {
    setEditingTweetId(null);
  }

  const handleUpdate = (updateTweet) => {
    setTweets(tweets.map(tweet => (tweet.id === updateTweet.id ? updateTweet : tweet)));
    //mapで新しい配列を返す。tweet.id === updateTweet.idでツイートの一致を確認。
    //? updatedTweet : tweet
    //true場合はupdateTweetを返し、falseの場合はtweetを返す
    setEditingTweetId(null);
  }

  return (
    <div>
      <h2>Tweet List</h2>
      {tweets.length === 0 ? (
        tweets.map(tweet => (
          <div key={tweet.id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px'}}>
            <p>{tweet.content}</p>
            <small>
              By: {tweet.user.username} at {new Date(tweet.created_at).toLocaleString()}
            </small>
            {editingTweetId === tweet.id ? (
              <TweetEditForm tweet={tweet} onUpdate={handleUpdate} onCancel={handleCancelEdit} />
            ) : (
              <>
                {user && user.id === tweet.user.id && (
                  <div>
                    <button onClick={() => handleEdit(tweet.id)}>Edit</button>
                    <button onClick={() => handleDelete(tweet.id)}>Delete</button>
                  </div>
                )}
              </>
            )}
          </div>
        ))
      ) : (
        <p>No tweets available.</p>
      )}
    </div>
  );
}

export default TweetList;
