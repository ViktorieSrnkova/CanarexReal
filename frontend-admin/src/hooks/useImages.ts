import type { FormInstance } from "antd";
import React, { useEffect } from "react";
import type { CreateAdFormValues } from "../types/listings";
import type { RcFile } from "antd/es/upload/interface";

export type ImageItem = {
  uid: string;
  file: File;
  url: string;
};

export function useImages(form: FormInstance<CreateAdFormValues>) {
  const [images, setImages] = React.useState<ImageItem[]>([]);
  const [uploading, setUploading] = React.useState(false);

  const handlePickImages = () => {
    setUploading(true);
  };

  const handleUpload = (fileList: RcFile[]) => {
    setUploading(true);

    requestAnimationFrame(() => {
      const mapped = fileList.slice(0, 30).map((file) => ({
        uid: crypto.randomUUID(),
        file,
        url: URL.createObjectURL(file),
      }));

      setImages(mapped);
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
