import axios from "axios";

class LoadingManager {
  private activeRequests: number = 0;
  private listeners: ((isLoading: boolean) => void)[] = [];

  startLoading() {
    this.activeRequests++;
    // console.log(`startLoading: activeRequests = ${this.activeRequests}`); // Debug log
    this.notifyListeners();
  }

  stopLoading() {
    this.activeRequests = Math.max(0, this.activeRequests - 1);
    // console.log(`stopLoading: activeRequests = ${this.activeRequests}`); // Debug log
    this.notifyListeners();
  }

  isLoading(): boolean {
    return this.activeRequests > 0;
  }

  subscribe(cb: (isLoading: boolean) => void) {
    this.listeners.push(cb);
    cb(this.isLoading()); // Immediately notify the new subscriber
    return () => {
      this.listeners = this.listeners.filter((lis) => lis !== cb);
    };
  }

  private notifyListeners() {
    const isLoading = this.isLoading();
    this.listeners.forEach((lis) => lis(isLoading));
  }
}

export const loadingManager = new LoadingManager();

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:7030/",
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    loadingManager.startLoading();
    // No need to manually set Authorization header; accessToken cookie is sent automatically
    if (config.data instanceof FormData) {
      config.headers["Content-Type"] = "multipart/form-data";
    } else {
      config.headers["Content-Type"] = "application/json";
    }
    return config;
  },
  (error) => {
    loadingManager.stopLoading();
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    loadingManager.stopLoading();
    return response.data;
  },
  async (error) => {
    if (!error.config) {
      loadingManager.stopLoading();
      return Promise.reject(error);
    }

    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Refresh token is automatically sent via cookie (withCredentials: true)
        const res = await axiosInstance.post("/auth/refresh", {});
        console.log(res);
        // No need to manually update tokens; backend should set new cookies
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed!", refreshError);
        loadingManager.stopLoading();
        return Promise.reject(refreshError);
      }
    }

    loadingManager.stopLoading();
    return Promise.reject(error);
  }
);

export default axiosInstance;
