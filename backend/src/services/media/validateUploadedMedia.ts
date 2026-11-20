import { HeadObjectCommand } from "@aws-sdk/client-s3";
import { r2 } from "../../lib/r2.js";

const bucketName = process.env.R2_BUCKET_NAME;

if (!bucketName) {
  throw new Error("R2_BUCKET_NAME is not configured");
}

const ALLOWED_MEDIA_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "video/mp4",
  "video/webm",
  "video/quicktime",
]);

const MAX_IMAGE_SIZE = 50 * 1024 * 1024;
const MAX_VIDEO_SIZE = 500 * 1024 * 1024;

const STORAGE_KEY_REGEX =
  /^(properties|news)\/(?:(?:[1-9]\d*)\/)?[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\.(jpg|jpeg|png|webp|gif|mp4|webm|mov)$/i;

export async function validateUploadedMedia(params: {
  storageKey: string;
  expectedContentType: string;
  expectedSize: number;
}) {
  const { storageKey, expectedContentType, expectedSize } = params;

  if (!STORAGE_KEY_REGEX.test(storageKey)) {
    throw new Error("Invalid storage key");
  }

  if (!ALLOWED_MEDIA_TYPES.has(expectedContentType)) {
    throw new Error("Unsupported media type");
  }

  if (!Number.isSafeInteger(expectedSize) || expectedSize <= 0) {
    throw new Error("Invalid file size");
  }

  const metadata = await r2.send(
    new HeadObjectCommand({
      Bucket: bucketName,
      Key: storageKey,
    }),
  );

  const actualSize = metadata.ContentLength;
  const actualContentType = metadata.ContentType;

  if (actualSize === undefined || actualSize <= 0) {
    throw new Error("Uploaded file is empty or has unknown size");
  }

  if (!actualContentType) {
    throw new Error("Uploaded file has no content type");
  }

  if (!ALLOWED_MEDIA_TYPES.has(actualContentType)) {
    throw new Error("Unsupported uploaded media type");
  }

  const maxSize = actualContentType.startsWith("video/")
    ? MAX_VIDEO_SIZE
    : MAX_IMAGE_SIZE;

  if (actualSize > maxSize) {
    throw new Error("Uploaded file exceeds maximum size");
  }

  if (actualSize !== expectedSize) {
    throw new Error("Uploaded file size does not match");
  }

  if (actualContentType !== expectedContentType) {
    throw new Error("Uploaded file content type does not match");
  }

  return {
    storageKey,
    contentType: actualContentType,
    size: actualSize,
  };
}
