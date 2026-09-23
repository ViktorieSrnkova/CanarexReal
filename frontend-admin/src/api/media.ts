import { api } from "./client";
import type {
  CompleteUploadRequest,
  CompleteUploadResponse,
  CreateUploadUrlRequest,
  CreateUploadUrlResponse,
} from "../types/media";

export const createMediaUploadUrl = async (
  data: CreateUploadUrlRequest,
): Promise<CreateUploadUrlResponse> => {
  const { data: responseData } = await api.post("/media/upload-url", data);

  return responseData;
};

export const completeMediaUpload = async (
  data: CompleteUploadRequest,
): Promise<CompleteUploadResponse> => {
  const { data: responseData } = await api.post("/media/complete", data);
  console.log("RAW COMPLETE RESPONSE:", responseData);
  return responseData;
};
