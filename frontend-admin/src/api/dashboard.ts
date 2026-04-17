import type { DashboardResponse } from "../types/api";
import { api } from "./client";

export const getDashboard = async () => {
  const { data } = await api.get<DashboardResponse>("/dashboard");
  return data;
};
