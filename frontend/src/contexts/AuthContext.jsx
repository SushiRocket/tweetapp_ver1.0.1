// frontend/contexts/AuthContext.jsx

import React, { createContext, useState, useEffect } from 'react';
import API from '../axiosConfig';

export const AuthContext = createContext({
    user: { username: "TestUser"},
    login: () => {},
    register: () => {},
    logout: () => {},
});

export const AuthProvider = ({ children }) => {
    const[user, setUser] = useState(null);

    useEffect(() => {
        console.log("AuthProvider mounted");
        const token = localStorage.getItem('access_token');
        if (token) {
            // トークンが存在する場合、ユーザー情報を取得
            API.get('user/')
                .then(response => {
                    console.log("User fetched:", response.data);
                    setUser(response.data);
                })
                .catch(error => {
                    console.error('Error fetching user:', error);
                    setUser(null);
                });               
        }
    }, []);

    const login = (username, password) => {
        console.log("Attempting to login with:", username, password);
        return API.post('token/', { username, password })
            .then(response => {
                localStorage.setItem('access_token', response.data.access);
                localStorage.setItem('refresh_token', response.data.refresh);
                // ユーザー情報を取得
                return API.get('user/');
            })
            .then(response => {
                console.log("User fetched after login:", response.data);
                setUser(response.data);
            });
    };

    const register = (userData) => {
        console.log("Attempting to register with:", userData);
        return API.post('register/', userData);
    };

    const logout = () => {
        console.log("Logging out");
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout }}>
            { children }
        </AuthContext.Provider>
    );
};