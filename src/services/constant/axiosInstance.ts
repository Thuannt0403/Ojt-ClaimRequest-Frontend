import axios from "axios";
import { BASE_URL } from "./apiConfig";
import { authService } from "@/services/features/auth.service";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Accept': 'text/plain',
    'Content-Type': 'application/json'
  }
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = authService.getToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Đánh dấu request này đã thử refresh token

      console.log("🔄 Token hết hạn, đang thử refresh...");
      const newAccessToken = await authService.refreshToken();

      if (newAccessToken) {
        console.log("✅ Refresh thành công, gửi lại request");
        axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest); // Gửi lại request cũ
      }

      console.error("🚨 Refresh token thất bại, logout...");
      authService.logout();
    }

    return Promise.reject(error);
  }
);


export default axiosInstance;
