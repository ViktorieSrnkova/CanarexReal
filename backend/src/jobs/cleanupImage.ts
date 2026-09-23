import prisma from "../lib/db.js";
import { deleteMediaFromR2 } from "../utils/deleteMediaFromR2Helper.js";

export const cleanupTempImages = async () => {
  try {
    const cutoff = new Date(Date.now() - 5 * 60 * 60 * 1000);

    const tempImages = await prisma.obrazky.findMany({
      where: {
        docasne: true,
        zverejneno: {
          lt: cutoff,
        },
      },
      select: {
        id: true,
        klic_uloziste: true,
      },
    });

    if (tempImages.length === 0) {
      console.log("🧹 No temp images to delete");
      return;
    }

    const storageKeys = tempImages
      .map((image) => image.klic_uloziste)
      .filter((key): key is string => Boolean(key));

    if (storageKeys.length > 0) {
      await deleteMediaFromR2(storageKeys);
    }

    const result = await prisma.obrazky.deleteMany({
      where: {
        id: {
          in: tempImages.map((image) => image.id),
        },
      },
    });

    console.log(
      `🧹 Deleted ${result.count} temp DB images and ${storageKeys.length} R2 objects`,
    );
  } catch (err) {
    console.error("Cleanup failed:", err);
  }
};
