import axios, { CanceledError } from "axios";

export { CanceledError };

const backend_url = import.meta.env.VITE_BACKEND_URL
const apiClient = axios.create({
    baseURL: backend_url, 
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
// apiClient.interceptors.response.use(
//     (response) => response,
//     (error) => {
//         if (axios.isCancel(error)) {
//             console.warn("Request canceled:", error.message);
//         } else {
//             console.error("API error:", error);
//         }
//         return Promise.reject(error);
//     }
// );
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            console.warn("Unauthorized - Logging out...");
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("userId");
            window.location.href = "/"; // הפניה למסך התחברות
        }
        return Promise.reject(error);
    }
);
export default apiClient;
