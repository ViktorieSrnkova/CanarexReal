import { Router } from "express";
import { createUploadUrl } from "../services/media/mediaService";
import { requireRole } from "../middleware/auth";
import prisma from "../lib/db";

const router = Router();
router.use(requireRole([1, 3]));

router.post("/upload-url", async (req, res) => {
  try {
    const { fileName, contentType, size, resourceType, resourceKey } = req.body;

    if (
      typeof fileName !== "string" ||
      typeof contentType !== "string" ||
      typeof size !== "number" ||
      (resourceType !== "properties" && resourceType !== "news") ||
      (resourceKey !== undefined && typeof resourceKey !== "number")
    ) {
      return res.status(400).json({
        error: "Invalid upload data",
      });
    }

    const result = await createUploadUrl({
      fileName,
      contentType,
      size,
      resourceType,
      resourceKey,
    });

    return res.json(result);
  } catch (err) {
    console.error("Create R2 upload URL error:", err);

    return res.status(400).json({
      error: err instanceof Error ? err.message : "Failed to create upload URL",
    });
  }
});

router.post("/complete", async (req, res) => {
  try {
    const { storageKey, fileName, contentType, size } = req.body;

    if (
      typeof storageKey !== "string" ||
      typeof fileName !== "string" ||
      typeof contentType !== "string" ||
      typeof size !== "number"
    ) {
      return res.status(400).json({
        error: "Invalid media metadata",
      });
    }

    const image = await prisma.obrazky.create({
      data: {
        url: "",
        klic_uloziste: storageKey,
        mime_typ: contentType,
        velikost: size,
        docasne: true,
      },
      select: {
        id: true,
        klic_uloziste: true,
        mime_typ: true,
        velikost: true,
      },
    });

    return res.json({
      success: true,
      image: {
        id: image.id,
        storageKey: image.klic_uloziste,
        mimeType: image.mime_typ,
        size: image.velikost,
      },
    });
  } catch (err) {
    console.error("Complete R2 upload error:", err);

    return res.status(500).json({
      error: "Failed to save media metadata",
    });
  }
});

export default router;
