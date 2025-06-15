import axios from 'axios';
import { refreshToken }from '../auth'

const api = axios.create({
  withCredentials: true,
  baseURL: '/api',
});

api.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
  return config;
});

api.interceptors.response.use(
  (config) => {
    return config;
  },
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response.status == 401 &&
      error.config &&
      !originalRequest._retry &&
      !originalRequest.url.includes('/auth/')
    ) {
      originalRequest._retry = true;
      const newTokens = await refreshToken();
      if (newTokens && newTokens.accessToken) {
        localStorage.setItem('token', newTokens.accessToken);
        return api.request(originalRequest);
      }
    }
    throw error;
  }
);

export default api;