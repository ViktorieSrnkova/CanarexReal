import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "crypto";
import path from "path";
import { r2 } from "../../lib/r2";
import type {
  CreateUploadUrlParams,
  CreateUploadUrlResult,
  MediaResourceType,
} from "../../types/media.types";

const bucketName = process.env.R2_BUCKET_NAME;

if (!bucketName) {
  throw new Error("R2_BUCKET_NAME is not configured");
}
const ALLOWED_RESOURCE_TYPES = new Set<MediaResourceType>([
  "properties",
  "news",
]);

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

function getExtension(fileName: string): string {
  const extension = path.extname(fileName).toLowerCase();
  return extension || "";
}

export async function createUploadUrl(
  params: CreateUploadUrlParams,
): Promise<CreateUploadUrlResult> {
  const { fileName, contentType, size, resourceType, resourceKey } = params;

  if (!ALLOWED_RESOURCE_TYPES.has(resourceType)) {
    throw new Error(`Unsupported resource type: ${resourceType}`);
  }
  if (!ALLOWED_MEDIA_TYPES.has(contentType)) {
    throw new Error(`Unsupported media type: ${contentType}`);
  }

  const maxSize = contentType.startsWith("video/")
    ? MAX_VIDEO_SIZE
    : MAX_IMAGE_SIZE;

  if (size <= 0 || size > maxSize) {
    throw new Error(
      contentType.startsWith("video/")
        ? "Video is too large"
        : "Image is too large",
    );
  }

  const extension = getExtension(fileName);

  const storageKey =
    resourceKey !== undefined
      ? `${resourceType}/${resourceKey}/${randomUUID()}${extension}`
      : `${resourceType}/${randomUUID()}${extension}`;

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: storageKey,
    ContentType: contentType,
  });

  const uploadUrl = await getSignedUrl(r2, command, {
    expiresIn: 15 * 60,
  });

  return {
    uploadUrl,
    storageKey,
  };
}
