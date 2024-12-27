// frontend/src/axiosConfig.js

import axios from 'axios';

const API = axios.create({
    baseURL: 'htttp://localhost:8000/api/',
});

//リクエストインターセクターでトークンをヘッダーに追加

API.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers['Authorization'] = `Bearer${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default API;