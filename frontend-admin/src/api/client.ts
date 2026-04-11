import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:3000/api/admin",
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

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const res = await axios.post(
          "http://localhost:3000/api/admin/refresh",
          {},
          { withCredentials: true },
        );

        const newToken = res.data.accessToken;

        localStorage.setItem("token", newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;

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
