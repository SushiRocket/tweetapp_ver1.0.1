// frontend/src/App.js
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './Contexts/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
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
    setTweets((prevTweets) => [newTweet, ...prevTweets]);

    // サーバーの正確な状態を再取得（バックグラウンドでリストを最新化）
    fetchTweets();
  };

  return (
    <><AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/regidter" element={<Register />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </Router>
    </AuthProvider><div>
        <h1>Tweet App</h1>
        <TweetCreateForm onTweetCreated={handleTweetCreated} />
        {/* TweetList には tweets を props で渡すだけ */}
        <TweetList tweets={tweets} />
      </div></>
  );
}

  const Home = () => {
    const { user } = React.useContext(AuthContext);

    return (
      <div>
        <h1>Tweet App</h1>
        { user ? (
          <>
            <TweetCreateForm />
            <TweetLitst />
            <LOgoutButton />
          </>
        ) : (
          <Navigate to ="/login" />
        )}
      </div>
    );
  };

  const LogoutButton = () => {
    const { logout } = React.useContext(AuthContext);

    return (
      <button onClick={logout}>Logout</button>
    );
  };

export default App;
