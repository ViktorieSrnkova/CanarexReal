import prisma from "../lib/db.js";

export const cleanupTempImages = async () => {
  try {
    const result = await prisma.obrazky.deleteMany({
      where: {
        is_temp: true,
        uploaded_at: {
          lt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hodin
        },
      },
    });

    console.log("🧹 Deleted temp images:", result.count);
  } catch (err) {
    console.error("Cleanup failed:", err);
  }
};
