import axios from 'axios';
import Cookies from 'js-cookie';
import { API_BASE_URL } from '../config/apiConfig';
// Create an instance of Axios with default settings
const axiosInstance = axios.create({
  baseURL: API_BASE_URL, // Backend URL for API
  headers: {
    'Content-Type': 'application/json',  // Default content type
  },
  withCredentials: true, 
});

axiosInstance.interceptors.request.use(
  (config) => {
    // If you store a token in cookies, retrieve it here and set it in the headers
    const token = Cookies.get('authToken');  
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;  // Add the token to the headers
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;