// frontend/src/App.js

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import PrivateRoute from './components/PrivateRoute';
import NavBar from './components/NavBar';
import UserList from './components/UserList';
import Feed from './components/Feed';
import Notifications from './components/Notifications';
import Profile from './components/Profile';
import Search from './components/Search';
import HashtagPage from './components/HashtagPage';
import DMPage from './components/DMPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <NavBar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/users" element={<UserList />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/profile/:username" element={<Profile /> } />
          <Route path="/search" element={<Search />} />
          <Route path="/hashtag/:tag" element={<HashtagPage />} />
          <Route path="/dm/:userId" element={<DMPage />} />
          <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>}/>
        </Routes>
      </Router>
      <h1>Hello World!</h1>
    </AuthProvider>
  );
}

export default App;
