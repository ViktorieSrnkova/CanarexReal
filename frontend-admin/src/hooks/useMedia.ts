import type { FormInstance } from "antd";
import React, { useEffect } from "react";
import type { CreateAdFormValues } from "../types/listing_form";
import type { RcFile } from "antd/es/upload/interface";
import type { MediaItem } from "../types/media";
import { normalizeImageOrder } from "../utils/normalizeImageOrder";

export function useMedia(form: FormInstance<CreateAdFormValues>) {
  const [images, setImages] = React.useState<MediaItem[]>([]);
  const [uploading, setUploading] = React.useState(false);

  const handlePickImages = () => {
    setUploading(true);
  };

  const handleUpload = (fileList: RcFile[]) => {
    setUploading(true);

    requestAnimationFrame(() => {
      const mapped = fileList.slice(0, 50).map((file) => ({
        uid: file.uid,
        file,
        url: URL.createObjectURL(file),
        mimeType: file.type,
      }));

      setImages(normalizeImageOrder(mapped));
      setUploading(false);
    });
  };

  useEffect(() => {
    form.setFieldValue("gallery", images);

    return () => {
      images.forEach((img) => URL.revokeObjectURL(img.url));
    };
  }, [images]);

  return {
    images,
    setImages,
    uploading,
    handleUpload,
    handlePickImages,
    setUploading,
  };
}
