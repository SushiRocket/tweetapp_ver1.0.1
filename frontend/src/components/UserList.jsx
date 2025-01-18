// frontend/src/components/UserList.jsx

import React, { useState, useEffect, useContext } from 'react';
import API from '../axiosConfig';
import { AuthContext } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

function UserList() {
    const [users, setUsers] = useState([]);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = () => {
        API.get('users/')
        .then(response => {
            console.log('API Response:', response.data);
            setUsers(response.data);
        })
        .catch(error => {
            console.error('Error fetchihng users:', error);
        });
    };

    const handleFollow = (id) => {
        API.post(`users/user/${id}/follow/`)
        .then(() => {
            fetchUsers(); //再取得して表示を更新
        })
        .catch(error => {
            console.error('Error following user:', error);
        });
    };

    const handleUnfollow = (id) => {
        API.delete(`users/user/${id}/unfollow/`)
        .then(() => {
            fetchUsers(); //再取得して表示を更新
        })
        .catch(error => {
            console.error('Error unfollowing user:', error);
        });
    };

    return (
        <div>
          <h2>User List</h2>
          {Array.isArray(users) && users.length > 0 ? ( // usersが存在し、lengthが0以上の場合にmapを実行
            users.map((u) => (
              <div key={u.id} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0' }}>
                <p><Link to={`/profile/${u.username}`}>{u.username}</Link></p>
                <p><strong>{u.username}</strong></p>
                <p>Followers: {u.followers.count}</p>
                <p>Following: {u.following.count}</p>
                {user && user.id !== u.id && (
                  u.followers.users.some((follower) => follower.id === user.id) ? (
                    <button onClick={() => handleUnfollow(u.id)}>Unfollow</button>
                  ) : (
                    <button onClick={() => handleFollow(u.id)}>Follow</button>
                  )
                )}
              </div>
            ))
          ) : (
            <p>No users available.</p> // ユーザーがいない場合のメッセージ
          )}
        </div>
      );
}

export default UserList;