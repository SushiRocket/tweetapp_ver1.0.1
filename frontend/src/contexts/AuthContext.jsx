// frontend/contexts/AuthContext.jsx

import React, { createContext, useState, useEffect } from 'react';
import API from '../axiosConfig';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const[user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (token) {
            // トークンが存在する場合、ユーザー情報を取得
            API.get('user/')
                .then(response => {
                    setUser(response.data);
                })
                .catch(error => {
                    console.error('Error fetching user:', error);
                    setUser(null);
                });               
        }
    }, []);

    const login = (username, password) => {
        return API.post('token/', { username, password })
            .then(responce => {
                localStorage.setItem('access_token', responce.data.access);
                localStorage.setItem('refresh_token', responce.data.refresh);
                // ユーザー情報を取得
                return API.get('user/');
            })
            .then(responce => {
                setUser(responce.data);
            });
    };

    const register = (userDate) => {
        return API.post('register/', userDate);
    };

    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setUser(null);
    };

    return (
        <AuthContext.Provider Value={{ user, login, register, logout }}>
            { children }
        </AuthContext.Provider>
    );
};