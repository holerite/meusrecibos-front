import axios from "axios";

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});


api.interceptors.request.use((config) => {
    const token = localStorage.getItem("@meusrecibos:accessToken");
    if (token) {
        const formattedToken = JSON.parse(token);
        config.headers.Authorization = `Bearer ${formattedToken}`;
    }
    return config;
});