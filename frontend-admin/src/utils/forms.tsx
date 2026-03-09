// src/utils/forms.ts
import { Tag } from "antd";

export const formatDateTime = (date: string | Date) =>
  new Date(date).toLocaleString();

export const formatDate = (date: string | Date) =>
  new Date(date).toLocaleDateString();

export const getReviewTag = (revidovano: boolean) =>
  revidovano ? (
    <Tag color="green">Revidováno</Tag>
  ) : (
    <Tag color="red">Nerevidováno</Tag>
  );
