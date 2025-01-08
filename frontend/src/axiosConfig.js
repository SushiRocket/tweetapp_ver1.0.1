// frontend/src/axiosConfig.js

import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:8000/api/',
});

//リクエストインターセクターでトークンをヘッダーに追加

API.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
        console.log('Authorization header set:', `Bearer ${token}`);
    } else {
        console.log('No access_token found in localStorage.');
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

//レスポンスインターセプターでトークンのリフレッシュ
API.interceptors.response.use (
    response => response,
    async error => {
        const originalRequest = error.config;
        //ログインAPI(/api/token/)からのレスポンスが401ならリフレッシュしない
        if (
            error.response.status === 401 &&
            originalRequest.url.includes('token/')
        ) {
            //そのままエラーにする（usernameやpasswordのち）
            return Promise.reject(error);
        }

        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest.retry = true;
            const refresh_token = localStorage.getItem('refresh_token');
            if (refresh_token) {
                try {
                    const response = await axios.post('http://localhost:8000/api/token/refresh/', {
                        refresh: refresh_token,
                    });
                    localStorage.setItem('access_token', response.data.access);
                    API.defaults.headers['Authorization'] = `Bearer ${response.data.access}`;
                    originalRequest.headers['Authorization'] = `Bearer ${response.data.access}`;
                    return API(originalRequest);
                } catch (err) {
                    console.error(`Refresh token failed:`, err);
                    //リフレッシュトークンが無効な場合、ログアウトする
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('refresh_token');
                    window.location.href = '/login';
                }
            }
        }
        return Promise.reject(error);
    }
);

export default API;