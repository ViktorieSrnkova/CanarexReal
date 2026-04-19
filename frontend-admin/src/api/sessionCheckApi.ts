import { api } from "./client";

export const checkSession = async () => {
  const res = await api.get("/me", {
    skipAuthRefresh: true,
  });

  return res.data;
};
