import type { RawListing, RawListingDetail } from "../types/api";
import type { ListingFilterOption, ListingFilters } from "../types/listings";
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

export type GetListingFilterOptionsResponse = {
  pictograms: ListingFilterOption[];
};

export const postListing = async (formData: FormData) => {
  const { data } = await api.post("/listings/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};

export type GetListingsParams = {
  page?: number;
  limit?: number;
  filters?: ListingFilters;
};

export const getListings = async (params?: GetListingsParams) => {
  const { filters, ...pagination } = params ?? {};
  const requestParams = {
    ...pagination,
    query: filters?.query,
    index: filters?.index,
    statusIds: filters?.statusIds?.join(","),
    typeCodes: filters?.typeCodes?.join(","),
    price: filters?.price,
    location: filters?.location,
    bedrooms: filters?.bedrooms,
    bathrooms: filters?.bathrooms,
    pictogramIds: filters?.pictogramIds?.join(","),
  };

  const { data } = await api.get<GetListingsResponse>("/listings", {
    params: requestParams,
  });

  return data;
};

export const getListingFilterOptions = async () => {
  const { data } = await api.get<GetListingFilterOptionsResponse>(
    "/listings/filter-options",
  );

  return data;
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

export const getListingById = async (id: number): Promise<RawListingDetail> => {
  const res = await api.get<RawListingDetail>(`/listings/${id}`);
  return res.data;
};
