import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Request interceptor to add the access token to the headers
axiosInstance.interceptors.request.use(
  (config) => {
    // We need to import the store dynamically here to avoid circular dependencies
    // if axiosInstance is used in thunks that are imported in slices
    const { store } = require("../Redux/store");
    const token = store.getState().auth.accessToken;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Track if a refresh is in progress to prevent multiple concurrent refresh calls
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Response interceptor to handle 401 errors and auto-refresh tokens
axiosInstance.interceptors.response.use(
  (response) => {
    // If the request succeeds, just return the response
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Don't retry the refresh endpoint itself
    if (originalRequest.url?.includes('/auth/refresh')) {
      return Promise.reject(error);
    }

    // Check if error is 401 and we haven't already tried to refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If a refresh is already in progress, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (token) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return axiosInstance(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Call the refresh endpoint
        const response = await axiosInstance.post("/auth/refresh");
        console.log("Token refreshed successfully", response.data);

        // Persist the new access token in Redux (and storage) so future requests include it
        const newAccessToken = response?.data?.data?.accessToken;
        if (newAccessToken) {
          const { store } = require("../Redux/store");
          const { setAccessToken } = require("../Redux/slices/authSlice");
          store.dispatch(setAccessToken(newAccessToken));
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }

        // Process any queued requests
        processQueue(null, response?.data?.data?.accessToken);
        isRefreshing = false;

        // Retry the original request
        console.log("Retrying original request:", originalRequest.url);
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Refresh failed - clear queue and redirect to login
        console.error("Refresh failed:", refreshError);
        processQueue(refreshError, null);
        isRefreshing = false;

        // Clear any auth state
        const { store } = require("../Redux/store");
        const { clearAuth } = require("../Redux/slices/authSlice");
        store.dispatch(clearAuth());

        return Promise.reject(refreshError);
      }
    }

    // For other errors, just reject
    return Promise.reject(error);
  }
);

export default axiosInstance;
