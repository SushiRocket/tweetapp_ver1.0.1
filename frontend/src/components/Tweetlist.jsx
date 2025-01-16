// frontend/src/components/TweetList.jsx

import React, { useState, useContext} from 'react';
import API from '../axiosConfig';
import { AuthContext } from '../contexts/AuthContext';
import TweetEditForm from './TweetEditForm';
import useTweets from '../hooks/useTweets';
import CommentList from './CommentList';

function TweetList() {
  const { tweets, setTweets, loading, error} = useTweets();
  const [editingTweetId, setEditingTweetId] = useState(null);
  const { user } = useContext(AuthContext);

  if (loading) {
    return <p>Loading tweets...</p>
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this tweet?')) {
      API.delete(`tweets/${id}/`)
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
  };

  const handleUpdate = (updateTweet) => {
    setTweets(tweets.map(tweet => (tweet.id === updateTweet.id ? updateTweet : tweet)));
    //mapで新しい配列を返す。tweet.id === updateTweet.idでツイートの一致を確認。
    //? updatedTweet : tweet
    //true場合はupdateTweetを返し、falseの場合はtweetを返す
    setEditingTweetId(null);
  };

  const handleLike = (tweetId) => {
    API.post(`tweets/${tweetId}/like/`)
      .then(() => {
        setTweets((prevTweets) =>
          prevTweets.map((tweet) =>
            tweet.id === tweetId
              ? {
                ...tweet,
                likes_count: tweet.likes_count + 1,
                user_has_liked: true,
              }
            : tweet
          )
        );
      })
      .catch(error => {
        console.error('Error liking tweet:', error);
      });
  };

  const handleUnlike = (tweetId) => {
    API.delete(`tweets/${tweetId}/unlike/`)
      .then(() => {
        setTweets((prevTweets) => 
          prevTweets.map((tweet) =>
            tweet.id === tweetId
              ? {
                  ...tweet,
                  likes_count: Math.max(tweet.likes_count - 1, 0),
                  user_has_liked: false,
                }
              : tweet
          )
        );
      })
      .catch(error => {
        console.error('Error unlikeing tweet:', error);
      });
  };

  return (
    <div>
      <h2>Tweet List</h2>
      {tweets.length > 0 ? (
        tweets.map(tweet => (
          <div key={tweet.id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px'}}>
            <p>{tweet.content}</p>
            <small>
              By: {tweet.user.username} at {new Date(tweet.created_at).toLocaleString()}
            </small>
            <CommentList tweetId={tweet.id} comments={tweet.comments} />
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
                <div>
                  <p>
                    likes: {tweet.likes_count}
                    {tweet.user_has_liked ? (
                      <button onClick={() => handleUnlike(tweet.id)}>Unlike</button>
                    ) : (
                      <button onClick={() => handleLike(tweet.id)}>Like</button>
                    )}
                  </p>
                </div>
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