import React, { useState, useEffect, useContext } from 'react';
import API from '../axiosConfig';
import { AuthContext } from '../contexts/AuthContext';

function UserList() {
    const [users, setUsers] = useState([]);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = () => {
        API.get('users/')
        .then(response => {
            setUsers(response.data);
        })
        .catch(error => {
            console.error('Error fetchihng users:', error);
        });
    };

    const handleFollow = (id) => {
        API.post('users/user/${id}/follow/')
        .then(() => {
            fetchUsers(); //再取得して表示を更新
        })
        .catch(error => {
            console.error('Error following user:', error);
        });
    };

    const handleUnfollow = (id) => {
        API.delete('users/user/${id}/unfollow/')
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
            {users.map((u) => (
                <div key={u.id} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0' }}>
                    <p><strong>{u.username}</strong></p>
                    <p>Followers: {u.followers}</p>
                    <p>Following: {u.following}</p>
                    {user && user.id !== u.id && (
                        u.followers.includes(user.id) ? (
                            <button onClick={() => handleUnfollow(u.id)}>Unfollow</button>
                        ) : (
                            <button onClick={() => handleFollow(u.id)}>Follow</button>
                        )
                    )}
                </div>
            ))}
        </div>
    );
}

export default UserList;