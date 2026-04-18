import type { RawListing, RawListingDetail } from "../types/api";
import { api } from "./client";

export type GetListingsResponse = {
  data: RawListing[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
};

export const postListing = async (formData: FormData) => {
  const { data } = await api.post("/listings/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};

export const getListings = async (params?: {
  page?: number;
  limit?: number;
}) => {
  const { data } = await api.get<GetListingsResponse>("/listings", {
    params,
  });

  return data;
};
export const getListingById = async (id: number): Promise<RawListingDetail> => {
  const res = await api.get<RawListingDetail>(`/listings/${id}`);
  return res.data;
};
export const patchListingStatus = async (id: number, statusId: number) => {
  const { data } = await api.patch(`/listings/${id}/status`, {
    statusId,
  });
  return data;
};

export const patchListingVisibility = async (id: number, value: boolean) => {
  const { data } = await api.patch(`/listings/${id}/visibility`, {
    value,
  });
  return data;
};

export const deleteListing = async (id: number) => {
  const { data } = await api.delete(`/listings/${id}`);
  return data;
};
