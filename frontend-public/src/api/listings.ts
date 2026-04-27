import type { FxRates } from "../types/general";
import type {
  GetListingsQuery,
  ListingDetailResponse,
  ListingsThumbResponse,
  ListingThumbnail,
  Pictogram,
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

export const getListingsThumbs = async (
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
};

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

export const getPictogramsForId = async (
  id: number | string,
  langId: number,
): Promise<Pictogram[]> => {
  const { data } = await api.get(`/listings/${id}/pictograms`, {
    headers: {
      "x-lang-id": langId,
    },
  });

  return data.pictograms;
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
