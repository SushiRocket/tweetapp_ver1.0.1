// frontend/src/App.js

import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider, AuthContext } from './contexts/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import TweetCreateForm from './components/TweetCreateForm';
import TweetList from './components/Tweetlist';
import PrivateRoute from './components/PrivateRoute';
import NavBar from './components/NavBar';

function App() {
  const [tweets, setTweets] = useState([]);

  return (
    <AuthProvider>
      <Router>
        <NavBar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route 
            path="/"
              element={
                <PrivateRoute>
                  <Home tweets={tweets} setTweets={setTweets} />
                </PrivateRoute>
              }
          />
        </Routes>
      </Router>
      <h1>Hello World!</h1>
    </AuthProvider>
  );
}

const Home = ({ tweets, setTweets }) => {
  const { user } = React.useContext(AuthContext);

  return (
    <div>
      <h1>Tweet App</h1>
      {user ? (
        <>
          <TweetCreateForm onTweetCreated={(newTweet)=> setTweets([...tweets, newTweet])} />
          <TweetList tweets={tweets} setTweets={setTweets} />
        </>
      ) : (
        <p>Loding...</p>
      )}
      <LogoutButton />
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
