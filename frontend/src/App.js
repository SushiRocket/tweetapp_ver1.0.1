// frontend/src/App.js
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './contexts/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import TweetCreateForm from './components/TweetCreateForm';
import TweetList from './components/Tweetlist';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/regidter" element={<Register />} />
          <Route 
            path="/"
              element={
                <PrivateRoute>
                  <Home />
                </PrivateRoute>
              }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

const Home = () => {
  const { user } = React.useContext(AuthContext);

  return (
    <div>
      <h1>Tweet App</h1>
        <TweetCreateForm />
        <TweetList />
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
