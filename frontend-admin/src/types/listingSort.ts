export type ListingSortField = "index" | "price" | "size" | "location";

export type ListingSortOrder = "ascend" | "descend";

export type ListingSorting = {
  field?: ListingSortField;
  order?: ListingSortOrder;
};
