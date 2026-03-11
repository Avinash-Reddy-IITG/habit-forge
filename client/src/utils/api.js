import axios from 'axios';

const isDev = import.meta.env.MODE === 'development';
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || (isDev ? 'http://localhost:5000/api' : '/api')
});

api.interceptors.request.use((config) => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
        const { token } = JSON.parse(userInfo);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;
