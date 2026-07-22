import axios from "axios";

const getBaseURL = () => {
  let url = import.meta.env.VITE_API_URL || '/api';
  // Remove trailing slash if present
  if (url.endsWith('/')) {
    url = url.slice(0, -1);
  }
  // Ensure /api suffix is present if it's an absolute URL and missing the suffix
  if (url.startsWith('http') && !url.endsWith('/api')) {
    url = `${url}/api`;
  }
  return url;
};

const api = axios.create({
  baseURL: getBaseURL(),
});

// Request interceptor for adding the bearer token
api.interceptors.request.use(
  (config) => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    console.log('=== axios interceptor: config.url:', config.url);
    console.log('=== axios interceptor: userInfo.token:', userInfo ? `${userInfo.token?.slice(0, 30)}...` : 'no userInfo');
    if (userInfo && userInfo.token) {
      config.headers.Authorization = `Bearer ${userInfo.token}`;
      console.log('=== axios interceptor: added Authorization header:', `${config.headers.Authorization.slice(0, 40)}...`);
    } else {
      console.log('=== axios interceptor: no token found in userInfo');
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
