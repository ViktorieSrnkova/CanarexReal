import axios from "axios";

export const api = axios.create({
  baseURL: "https://canarexreal.onrender.com/api",
  withCredentials: true,
});
