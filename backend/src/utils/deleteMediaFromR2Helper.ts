import { DeleteObjectsCommand } from "@aws-sdk/client-s3";
import { r2 } from "../lib/r2";
export async function deleteMediaFromR2(storageKeys: string[]): Promise<void> {
  if (storageKeys.length === 0) {
    return;
  }

  const bucketName = process.env.R2_BUCKET_NAME;

  if (!bucketName) {
    throw new Error("R2_BUCKET_NAME is not configured");
  }

  await r2.send(
    new DeleteObjectsCommand({
      Bucket: bucketName,
      Delete: {
        Objects: storageKeys.map((Key) => ({ Key })),
      },
    }),
  );
}
