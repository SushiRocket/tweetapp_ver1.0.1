// frontend/src/App.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TweetCreateForm from './components/TweetCreateForm';
import TweetList from './components/Tweetlist';

function App() {
  const [tweets, setTweets] = useState([]);

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
    // 受け取った新規ツイートを先頭に追加してステート更新
    setTweets([newTweet, ...tweets]);
  };

  return (
    <div>
      <h1>Tweet App</h1>
      <TweetCreateForm onTweetCreated={handleTweetCreated} />
      {/* TweetList には tweets を props で渡すだけ */}
      <TweetList tweets={tweets} />
    </div>
  );
}

export default App;
