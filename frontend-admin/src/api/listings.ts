import { api } from "./client";

export const postListing = async (formData: FormData) => {
  const { data } = await api.post("/listings/create", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data;
};
