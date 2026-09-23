export type MediaUploadResult = {
  id: number;
  storageKey: string;
  mimeType: string;
  size: number;
};

export type UploadUrlResponse = {
  uploadUrl: string;
  storageKey: string;
};

export type MediaResourceType = "properties" | "news";

export type CreateUploadUrlRequest = {
  fileName: string;
  contentType: string;
  size: number;
  resourceType: MediaResourceType;
  resourceKey?: number;
};

export type CreateUploadUrlResponse = {
  uploadUrl: string;
  storageKey: string;
};

export type CompleteUploadRequest = {
  storageKey: string;
  fileName: string;
  contentType: string;
  size: number;
};

export type CompleteUploadResponse = {
  success: boolean;
  image: {
    id: number;
    storageKey: string;
    mimeType: string;
    size: number;
  };
};
export type MediaItem = {
  uid: string;
  file: File;
  url: string;
  mimeType: string;
};
