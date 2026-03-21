import { api } from "./client";
import type { UploadedImage } from "../types/news";
import { convertToWebP } from "../utils/imageToWebp";

export const uploadImage = async (file: File): Promise<UploadedImage> => {
  const webpFile = await convertToWebP(file);
  const previewUrl = URL.createObjectURL(webpFile);
  const formData = new FormData();
  formData.append("file", webpFile);

  const { data } = await api.post("/files/upload-image", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return {
    ...data,
    file: {
      ...data.file,
      id: data.file.id ?? -1,
      url: previewUrl,
    },
  };
};
