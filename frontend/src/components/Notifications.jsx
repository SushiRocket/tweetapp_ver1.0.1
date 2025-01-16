// frontend/src/components/Notifications.jsx

import React, { useState, useEffect } from 'react';
import API from '../axiosConfig';

function Notifications() {
    const[notifications, setNotifications] = useState([]);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = () => {
        API.get('notifications/')
        .then((Response) => {
            setNotifications(Response.data);
        })
        .catch((error) => {
            console.error('Error fetching notifications:', error);
        });
    };

    const markAsRead = () => {
        API.post('notifications/')
            .then(() => {
                setNotifications([]);
            })
            .catch((error) => {
                console.error('Error marking notifications as read:', error);
            });
    };

    return (
        <div>
            <h2>Notifications</h2>
            {notifications.length > 0 ? (
                <div>
                    <button onClick={markAsRead}>Mark all as read</button>
                    <ul>
                        {notifications.map((notification) => (
                            <li key={notification.id}>
                                <p>{notification.message}</p>
                                <small>{new Date(notification.created_at).toLocaleString()}</small>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <p>No new notifications.</p>
            )}
        </div>
    );
}

export default Notifications;