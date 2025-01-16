// frontend/contexts/AuthContext.jsx

import React, { createContext, useState, useEffect, useCallback } from 'react';
import API from '../axiosConfig';

export const AuthContext = createContext({
    user: null,
    isAuthenticating: true,
    login: () => {},
    register: () => {},
    logout: () => {},
});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticating, setIsAuthenticating] = useState(true);

    const fetchUser = useCallback(() => {
        API.get('user/')
            .then(response => {
                console.log("User fetched:", response.data);
                setUser(response.data);
            })
            .catch(error => {
                if (error.response && error.response.status === 401) {
                    console.log("Access token expired, attempting refresh...");
                    refreshAccessToken().then((newToken) => {
                        if (newToken) {
                            fetchUser(); // リフレッシュ成功後に再試行
                        } else {
                            logout(); // リフレッシュ失敗時にログアウト
                        }
                    });
                } else {
                    console.error('Error fetching user:', error);
                    setUser(null);
                }
            })
            .finally(() => {
                setIsAuthenticating(false);
            });
    }, []); // この関数は依存関係がないため空配列

    useEffect(() => {
        console.log("AuthProvider mounted");
        const token = localStorage.getItem('access_token');
        if (token) {
            fetchUser();
        } else {
            setIsAuthenticating(false);
        }
    }, [fetchUser]); // fetchUser を依存配列に追加

    const refreshAccessToken = async () => {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) return null;

        try {
            const response = await API.post('token/refresh/', { refresh: refreshToken });
            const { access } = response.data;
            localStorage.setItem('access_token', access); // 新しいアクセストークンを保存
            console.log("Access token refreshed");
            return access;
        } catch (error) {
            console.error("Error refreshing access token:", error);
            return null;
        }
    };

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
        <AuthContext.Provider value={{ user, isAuthenticating, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
