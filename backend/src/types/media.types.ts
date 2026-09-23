export type CreateUploadUrlParams = {
  fileName: string;
  contentType: string;
  size: number;
  resourceType: MediaResourceType;
  resourceKey?: number;
};

export type CreateUploadUrlResult = {
  uploadUrl: string;
  storageKey: string;
};

export type MediaResourceType = "properties" | "news";
