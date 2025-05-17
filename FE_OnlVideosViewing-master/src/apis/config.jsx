import axios from "axios";

const baseURL = import.meta.env.VITE_BACKEND_BASEURL;

export const api = axios.create({
    baseURL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    }
});

// Tự động thêm token vào tất cả request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});