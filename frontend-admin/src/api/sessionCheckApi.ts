import { sessionCheckApi } from "./client";

export const checkSession = async () => {
  const token = localStorage.getItem("token");

  const res = await sessionCheckApi.get("/me", {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });

  return res.data;
};
