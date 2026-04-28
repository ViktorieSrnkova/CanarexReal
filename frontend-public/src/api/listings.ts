import type { ListingFilters, ListingSort } from "../types/filters";
import type { FxRates } from "../types/general";
import type {
  ListingDetailResponse,
  ListingsThumbResponse,
  ListingThumbnail,
} from "../types/rawApi";
import { api } from "./axios";

export const getListingsThumbsHome = async (
  langId: number,
): Promise<ListingThumbnail[]> => {
  const { data } = await api.get("/listings/home", {
    headers: {
      "x-lang-id": langId,
    },
  });
  return data.thumbnails;
};

export type GetListingsParams = {
  page?: number;
  limit?: number;
  filters?: ListingFilters;
  sort?: ListingSort;
};
export type GetListingsResponse = {
  data: ListingThumbnail[];
};
export const getListingsThumbs = async (
  langId: number,
  params?: GetListingsParams,
): Promise<ListingsThumbResponse> => {
  const { filters, sort, ...pagination } = params ?? {};
  const requestParams = {
    ...pagination,
    query: filters?.query,
    typeCodes: filters?.typeCodes?.join(","),
    priceFrom: filters?.priceFrom,
    priceTo: filters?.priceTo,
    sizeFrom: filters?.sizeFrom,
    sizeTo: filters?.sizeTo,
    bedrooms: filters?.bedrooms,
    bathrooms: filters?.bathrooms,
    sort,
  };

  const { data } = await api.get("/listings", {
    params: requestParams,
    headers: {
      "x-lang-id": langId,
    },
  });

  return data;
};

/* export const getListingsThumbs = async (
  langId: number,
  params: GetListingsQuery,
): Promise<ListingsThumbResponse> => {
  const { data } = await api.get("/listings/", {
    params,
    headers: {
      "x-lang-id": langId,
    },
  });
  return data;
}; */

export const getListingById = async (
  id: string | number,
  langId: number,
): Promise<ListingThumbnail> => {
  const { data } = await api.get(`/listings/thumb/${id}`, {
    headers: {
      "x-lang-id": langId,
    },
  });
  return data.thumb;
};
export const getSimilarListings = async (
  id: number | string,
  langId: number,
): Promise<ListingThumbnail[]> => {
  const { data } = await api.get(`/listings/${id}/similar`, {
    headers: {
      "x-lang-id": langId,
    },
  });

  return data.similar;
};

export const getFxRates = async (): Promise<FxRates> => {
  const res = await api.get("/listings/fx-rates");
  return res.data;
};

export const getListingDetail = async (
  id: number | string,
  langId: number,
): Promise<ListingDetailResponse> => {
  const { data } = await api.get(`/listings/${id}`, {
    headers: {
      "x-lang-id": langId,
    },
  });

  return data.listing;
};
