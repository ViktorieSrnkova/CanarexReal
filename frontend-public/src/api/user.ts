import type { MeResponse } from "../types/rawApi";
import { api } from "./axios";

export const getMe = async (): Promise<MeResponse> => {
  const { data } = await api.get("/user/me");
  return data;
};

export const updateMe = async (payload: {
  jmeno?: string;
  prijmeni?: string;
  email?: string;
  telefon?: string;
}) => {
  const { data } = await api.patch("/user/me", payload);
  return data;
};

export const changePassword = async (payload: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}) => {
  const { data } = await api.patch("/user/me/password", payload);
  return data;
};
