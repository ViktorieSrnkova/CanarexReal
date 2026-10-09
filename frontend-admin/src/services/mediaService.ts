import { completeMediaUpload, createMediaUploadUrl } from "../api/media.js";
import type { MediaResourceType, MediaUploadResult } from "../types/media.js";

export async function uploadMedia(
  file: File,
  resourceType: MediaResourceType,
  resourceKey?: number,
): Promise<MediaUploadResult> {
  const { uploadUrl, storageKey } = await createMediaUploadUrl({
    fileName: file.name,
    contentType: file.type,
    size: file.size,
    resourceType,
    resourceKey,
  });

  const uploadResponse = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": file.type,
    },
    body: file,
  });

  if (!uploadResponse.ok) {
    throw new Error("Failed to upload file to R2");
  }

  const result = await completeMediaUpload({
    storageKey,
    fileName: file.name,
    contentType: file.type,
    size: file.size,
  });
  console.log("COMPLETE MEDIA RESULT:", result);

  return {
    id: result.image.id,
    storageKey: result.image.storageKey,
    mimeType: result.image.mimeType,
    size: result.image.size,
  };
}
