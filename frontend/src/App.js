// frontend/src/App.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TweetCreateForm from './components/TweetCreateForm';
import TweetList from './components/Tweetlist';

function App() {
  const [tweets, setTweets] = useState([]);

  // 初回レンダリング時に既存ツイート一覧を取得
  useEffect(() => {
    fetchTweets();
  }, []);

  const fetchTweets = () => {
    axios.get('http://localhost:8000/api/tweets/')
      .then(response => {
        setTweets(response.data);
      })
      .catch(error => {
        console.error('Error fetching tweets:', error);
      });
  };
  const handleTweetCreated = (newTweet) => {
    setTweets([newTweet, ...tweets]);
  };

  return (
    <div>
      <h1>Tweet App</h1>
      {/* 新規投稿フォーム：投稿完了時に handleTweetCreated が呼ばれる */}
      <TweetCreateForm onTweetCreated={handleTweetCreated} />
      <TweetList tweets={tweets} />
    </div>
  );
}

export default App;