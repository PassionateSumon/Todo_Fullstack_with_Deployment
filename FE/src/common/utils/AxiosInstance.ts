import axios from "axios";

class LoadingManager {
  private activeRequests: number = 0;
  private listeners: ((isLoading: boolean) => void)[] = [];
  private refreshSuccessListeners: (() => void)[] = []; // New event listeners for refresh success

  startLoading() {
    this.activeRequests++;
    // console.log(`startLoading: activeRequests = ${this.activeRequests}`);
    this.notifyListeners();
  }

  stopLoading() {
    this.activeRequests = Math.max(0, this.activeRequests - 1);
    // console.log(`stopLoading: activeRequests = ${this.activeRequests}`);
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

  // New method to subscribe to refresh success events
  onRefreshSuccess(cb: () => void) {
    this.refreshSuccessListeners.push(cb);
    return () => {
      this.refreshSuccessListeners = this.refreshSuccessListeners.filter(
        (lis) => lis !== cb
      );
    };
  }

  // New method to notify refresh success listeners
  public notifyRefreshSuccess() {
    this.refreshSuccessListeners.forEach((lis) => lis());
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
        // console.log("Attempting to refresh token...");
        const res = (await axiosInstance.post("/auth/refresh", {})) as any;
        // console.log("Token refresh successful:", res);
        // Notify listeners of a successful refresh
        loadingManager.notifyRefreshSuccess();
        if (res.statusCode === 200) {
          loadingManager.stopLoading();
        }
        return await axiosInstance(originalRequest);
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
