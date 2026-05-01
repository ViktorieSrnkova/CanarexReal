import axios from "axios";

const VITE_API_URL = import.meta.env.VITE_API_URL;

export const api = axios.create({
  baseURL: `${VITE_API_URL}/api/admin`,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry /*  &&
      !originalRequest.skipAuthRefresh */
    ) {
      originalRequest._retry = true;

      try {
        const res = await axios.post(
          ` ${VITE_API_URL}/api/admin/refresh`,
          {},
          { withCredentials: true },
        );

        const newToken = res.data.accessToken;

        localStorage.setItem("token", newToken);
        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${newToken}`,
        };

        return api(originalRequest);
      } catch (err) {
        localStorage.removeItem("token");
        window.dispatchEvent(new Event("session-expired"));
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  },
);
