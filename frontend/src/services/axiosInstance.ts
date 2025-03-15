import axios, { CanceledError } from "axios";

export { CanceledError };

const apiClient = axios.create({
    baseURL: "", 
});


apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("accessToken");
        console.log("Adding Authorization Header:", token);

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// אינטרספטור לטיפול בשגיאות
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (axios.isCancel(error)) {
            console.warn("Request canceled:", error.message);
        } else {
            console.error("API error:", error);
        }
        return Promise.reject(error);
    }
);

export default apiClient;
