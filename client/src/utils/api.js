import axios from 'axios';

const api = axios.create({
    baseURL: '/api' // Proxy will be needed if we serve separately, but since they asked for code we can assume standard setup or Vite proxy. Let's configure vite later if needed, or point to localhost:5000 directly.
});

// Since the server will run on 5000 and client on 5173, let's use direct URL for development
api.defaults.baseURL = 'http://localhost:5000/api';

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
