import { ClearOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Form, Input, Select } from "antd";
import { useEffect, type ChangeEvent } from "react";
import { PROPERTY_TYPE_OPTIONS } from "../../types/listing_form";
import {
  statusOptions,
  type ListingFilterOption,
  type ListingFilters,
} from "../../types/listings";

type Props = {
  filters: ListingFilters;
  pictogramOptions: ListingFilterOption[];
  onChange: (filters: ListingFilters) => void;
};

const numericValue = (event: ChangeEvent<HTMLInputElement>) =>
  event.target.value.replace(/\D/g, "");

const cleanString = (value?: string) => {
  const trimmed = value?.trim();
  return trimmed || undefined;
};

const cleanArray = <T,>(value?: T[]) =>
  value && value.length > 0 ? value : undefined;

const cleanFilters = (values: ListingFilters): ListingFilters => ({
  query: cleanString(values.query),
  index: cleanString(values.index),
  statusIds: cleanArray(values.statusIds),
  typeCodes: cleanArray(values.typeCodes),
  priceFrom: cleanString(values.priceFrom),
  priceTo: cleanString(values.priceTo),
  sizeFrom: cleanString(values.sizeFrom),
  sizeTo: cleanString(values.sizeTo),
  location: cleanString(values.location),
  bedroomsFrom: cleanString(values.bedroomsFrom),
  bedroomsTo: cleanString(values.bedroomsTo),
  bathroomsFrom: cleanString(values.bathroomsFrom),
  bathroomsTo: cleanString(values.bathroomsTo),
  pictogramIds: cleanArray(values.pictogramIds),
});

export function ListingSearchForm({
  filters,
  pictogramOptions,
  onChange,
}: Props) {
  const [form] = Form.useForm<ListingFilters>();

  useEffect(() => {
    form.setFieldsValue({
      query: filters.query,
      index: filters.index,
      statusIds: filters.statusIds ?? [],
      typeCodes: filters.typeCodes ?? [],
      priceFrom: filters.priceFrom,
      priceTo: filters.priceTo,
      sizeFrom: filters.sizeFrom,
      sizeTo: filters.sizeTo,
      location: filters.location,
      bedroomsFrom: filters.bedroomsFrom,
      bedroomsTo: filters.bedroomsTo,
      bathroomsFrom: filters.bathroomsFrom,
      bathroomsTo: filters.bathroomsTo,
      pictogramIds: filters.pictogramIds ?? [],
    });
  }, [filters, form]);

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={(values) => onChange(cleanFilters(values))}
      style={{
        margin: "16px 0",
        padding: 12,
        border: "1px solid #f0f0f0",
        borderRadius: 8,
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: 12,
          alignItems: "end",
        }}
      >
        <Form.Item name="query" label="Hledat" style={{ marginBottom: 0 }}>
          <Input
            allowClear
            placeholder="Index, lokace, typ, status, piktogram..."
          />
        </Form.Item>

        <Form.Item
          name="index"
          label="Index"
          getValueFromEvent={numericValue}
          style={{ marginBottom: 0 }}
        >
          <Input allowClear inputMode="numeric" />
        </Form.Item>

        <Form.Item name="statusIds" label="Status" style={{ marginBottom: 0 }}>
          <Select
            allowClear
            mode="multiple"
            options={statusOptions.map((status) => ({
              value: status.value,
              label: status.label,
            }))}
          />
        </Form.Item>

        <Form.Item name="typeCodes" label="Typ" style={{ marginBottom: 0 }}>
          <Select
            allowClear
            mode="multiple"
            options={[...PROPERTY_TYPE_OPTIONS]}
          />
        </Form.Item>

        <Form.Item
          name="priceFrom"
          label="Cena od"
          getValueFromEvent={numericValue}
          style={{ marginBottom: 0 }}
        >
          <Input allowClear inputMode="numeric" />
        </Form.Item>

        <Form.Item
          name="priceTo"
          label="Cena do"
          getValueFromEvent={numericValue}
          style={{ marginBottom: 0 }}
        >
          <Input allowClear inputMode="numeric" />
        </Form.Item>

        <Form.Item
          name="sizeFrom"
          label="Velikost od"
          getValueFromEvent={numericValue}
          style={{ marginBottom: 0 }}
        >
          <Input allowClear inputMode="numeric" suffix="m²" />
        </Form.Item>

        <Form.Item
          name="sizeTo"
          label="Velikost do"
          getValueFromEvent={numericValue}
          style={{ marginBottom: 0 }}
        >
          <Input allowClear inputMode="numeric" suffix="m²" />
        </Form.Item>

        <Form.Item name="location" label="Lokace" style={{ marginBottom: 0 }}>
          <Input allowClear />
        </Form.Item>

        <Form.Item
          name="bedroomsFrom"
          label="Ložnice od"
          getValueFromEvent={numericValue}
          style={{ marginBottom: 0 }}
        >
          <Input allowClear inputMode="numeric" />
        </Form.Item>

        <Form.Item
          name="bedroomsTo"
          label="Ložnice do"
          getValueFromEvent={numericValue}
          style={{ marginBottom: 0 }}
        >
          <Input allowClear inputMode="numeric" />
        </Form.Item>

        <Form.Item
          name="bathroomsFrom"
          label="Koupelny od"
          getValueFromEvent={numericValue}
          style={{ marginBottom: 0 }}
        >
          <Input allowClear inputMode="numeric" />
        </Form.Item>

        <Form.Item
          name="bathroomsTo"
          label="Koupelny do"
          getValueFromEvent={numericValue}
          style={{ marginBottom: 0 }}
        >
          <Input allowClear inputMode="numeric" />
        </Form.Item>

        <Form.Item
          name="pictogramIds"
          label="Piktogramy"
          style={{ marginBottom: 0 }}
        >
          <Select
            allowClear
            mode="multiple"
            optionFilterProp="label"
            options={pictogramOptions}
          />
        </Form.Item>

        <div style={{ display: "flex", gap: 8 }}>
          <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
            Hledat
          </Button>
          <Button
            icon={<ClearOutlined />}
            onClick={() => {
              form.resetFields();
              onChange({});
            }}
          >
            Vymazat
          </Button>
        </div>
      </div>
    </Form>
  );
}
