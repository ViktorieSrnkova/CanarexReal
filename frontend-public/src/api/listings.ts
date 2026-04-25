import type {
  GetListingsQuery,
  ListingsThumbResponse,
  ListingThumbnail,
} from "../types/rawApi";
import { api } from "./axios";

export const getListingsThumbsHome = async (): Promise<ListingThumbnail[]> => {
  const { data } = await api.get("/listings/home");
  return data.thumbnails;
};

export const getListingsThumbs = async (
  params: GetListingsQuery,
): Promise<ListingsThumbResponse> => {
  const { data } = await api.get("/listings/", { params });
  return data;
};

export const getListingById = async (
  id: string | number,
): Promise<ListingThumbnail> => {
  const { data } = await api.get(`/listings/thumb/${id}`);
  return data.thumb;
};
