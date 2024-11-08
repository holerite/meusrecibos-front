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

api.interceptors.response.use((response) => {
    return response;
}, (error) => {
    if (error.response.status === 401) {
        localStorage.removeItem('@meusrecibos:user');
        localStorage.removeItem('@meusrecibos:accessToken');
        localStorage.removeItem('@meusrecibos:refreshToken');
        window.location.href = "/";
    }
    return Promise.reject(error);
});
