import axios from 'axios';

import backendConfig from '../../backend.config.json';

const api = axios.create({
  baseURL: `http://localhost:${backendConfig.BACKEND_PORT}`, // Replace with your backend base URL
  headers: {
    'Content-Type': 'application/json',
  },
});


// Add request interceptor
api.interceptors.request.use(
  (config) => {

    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {

    return Promise.reject(error);
  }
);

// Add response interceptor
api.interceptors.response.use(
  (response) => {

    return response;
  },
  (error) => {

    return Promise.reject(error);
  }
);

export default api;
