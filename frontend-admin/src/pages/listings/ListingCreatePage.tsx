import {
  Button,
  Form,
  Input,
  Select,
  Switch,
  Tabs,
  Tooltip,
  Typography,
  Upload,
} from "antd";
import {
  FEATURES,
  type CreateAdFormValues,
  type Language,
} from "../../types/listings";
import { liteEditorTools } from "../../config/lite-editor-tools";
import { Row, Col } from "antd";
import ToggleButton from "../../components/listings/ToggleButton";
import { DndContext, closestCenter } from "@dnd-kit/core";
import type { RcFile } from "antd/es/upload";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import SortableImage from "../../components/listings/SortableImage";
import { useAddressSearch } from "../../hooks/useAddressSearch";
import { useImages } from "../../hooks/useImages";
import EditorMinimal from "../../components/editor/RichMediaEditor";
import { useListingSubmit } from "../../hooks/useListingForm";

const ListingCreatePage: React.FC = () => {
  const [form] = Form.useForm<CreateAdFormValues>();
  const {
    images,
    uploading,
    handleUpload,
    setImages,
    setUploading,
    handlePickImages,
  } = useImages(form);
  const { options, searchAddress } = useAddressSearch();
  const { descRefs, detailsRefs, buildPayload } = useListingSubmit(images);
  const onFinish = async (values: CreateAdFormValues) => {
    const payload = await buildPayload(values);
    console.log(payload);
  };
  return (
    <>
      <Typography.Title level={2}>Vytvořit inzerát</Typography.Title>
      <Form layout="vertical" onFinish={onFinish} form={form}>
        <div
          className="switch-row"
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: 16,
            padding: 10,
            backgroundColor: "#c7f1f765",
            borderRadius: 8,
            gap: 16,
          }}
        >
          <span style={{ marginLeft: 8 }}>Zobrazit na hlavní stránce</span>

          <Form.Item
            name="showOnHomepage"
            label=""
            valuePropName="checked"
            initialValue={true}
            style={{ marginBottom: 0 }}
          >
            <Switch />
          </Form.Item>
        </div>
        <div
          className="input-group"
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            columnGap: 16,
          }}
        >
          <Form.Item
            required
            rules={[{ required: true, message: "Vyplň index" }]}
            name="index"
            label="Index Inzerátu"
            getValueFromEvent={(e) => e.target.value.replace(/\D/g, "")}
          >
            <Input style={{ maxWidth: 120 }} inputMode="numeric" />
          </Form.Item>
          <Form.Item
            required
            rules={[{ required: true, message: "Vyplň cenu" }]}
            name="price"
            label="Cena v €"
            normalize={(value) => {
              if (!value) return value;
              return value.toString().replace(/\s|\D/g, "");
            }}
            getValueProps={(value) => ({
              value: value ? Number(value).toLocaleString("cs-CZ") : "",
            })}
          >
            <Input style={{ maxWidth: 120 }} inputMode="numeric" />
          </Form.Item>
          <Form.Item
            required
            rules={[{ required: true, message: "Vyplň ložnice" }]}
            name="bedrooms"
            label="Počet ložnic"
            getValueFromEvent={(e) => e.target.value.replace(/\D/g, "")}
          >
            <Input style={{ maxWidth: 100 }} inputMode="numeric" />
          </Form.Item>
          <Form.Item
            required
            rules={[{ required: true, message: "Vyplň koupelny" }]}
            name="bathrooms"
            label="Počet koupelen"
            getValueFromEvent={(e) => e.target.value.replace(/\D/g, "")}
          >
            <Input style={{ maxWidth: 120 }} inputMode="numeric" />
          </Form.Item>
          <Form.Item
            required
            rules={[{ required: true, message: "Vyplň velikost" }]}
            name="size"
            label="Velikost v m²"
            getValueFromEvent={(e) => e.target.value.replace(/\D/g, "")}
          >
            <Input style={{ maxWidth: 120 }} inputMode="numeric" />
          </Form.Item>
          <Form.Item
            required
            rules={[{ required: true, message: "Vyplň lokaci" }]}
            name={"location"}
            label="Lokace"
          >
            <Input maxLength={21} />
          </Form.Item>
          <Form.Item
            required
            name="propertyType"
            label="Typ nemovitosti"
            rules={[{ required: true, message: "Vyber typ nemovitosti" }]}
          >
            <Select
              options={[
                { value: "apartment", label: "Apartmán" },
                { value: "villa", label: "Vila" },
                { value: "house", label: "Dům" },
                { value: "studio", label: "Garsonka" },
                { value: "land", label: "Pozemek" },
              ]}
            />
          </Form.Item>
          <Form.Item
            required
            rules={[{ required: true, message: "Vyplň adresu" }]}
            name="adresa"
            label="Adresa"
            style={{ width: "100%" }}
          >
            <Select
              showSearch={{
                filterOption: false,
                onSearch: searchAddress,
              }}
              labelInValue
              options={options.map((item) => ({
                value: item.place_id,
                label: item.display_name,
              }))}
              style={{ width: "100%", color: "#000" }}
            />
          </Form.Item>
        </div>
        <Row gutter={[8, 0]}>
          {FEATURES.map((feature) => (
            <Col key={feature}>
              <Form.Item
                name={["attributes", feature]}
                valuePropName="value"
                initialValue={false}
              >
                <ToggleButton label={feature} />
              </Form.Item>
            </Col>
          ))}
        </Row>
        <div
          className="upload-row"
          style={{
            display: "flex",
            alignItems: "center",
            columnGap: 16,
            padding: "4px 4px 4px 0",
          }}
        >
          <Upload
            multiple
            beforeUpload={() => false}
            showUploadList={false}
            onChange={(info) => {
              const files = info.fileList
                .map((f) => f.originFileObj)
                .filter((f): f is RcFile => !!f);

              handleUpload(files);
              setUploading(false);
            }}
          >
            <Button
              type="primary"
              loading={uploading}
              onClick={handlePickImages}
            >
              {uploading ? "Načítám..." : "Nahrát obrázky"}
            </Button>
          </Upload>
        </div>
        {images.length > 0 && (
          <Tooltip title="Pořadí obrázků můžeš měnit přetažením myší">
            <Typography.Text
              style={{
                display: "block",
                color: "#888",
              }}
            >
              Pořadí obrázků lze upravit jejich uchopením a přetažením
            </Typography.Text>
          </Tooltip>
        )}
        <div className="spacer" style={{ marginBottom: 16 }}>
          <DndContext
            collisionDetection={closestCenter}
            onDragEnd={(event) => {
              const { active, over } = event;
              if (!over || active.id === over.id) return;

              setImages((items) => {
                const oldIndex = items.findIndex((i) => i.uid === active.id);
                const newIndex = items.findIndex((i) => i.uid === over.id);

                return arrayMove(items, oldIndex, newIndex);
              });
            }}
          >
            <SortableContext
              items={images.map((i) => i.uid)}
              strategy={rectSortingStrategy}
            >
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {images.map((img, index) => (
                  <SortableImage
                    key={img.uid}
                    id={img.uid}
                    image={img}
                    isMain={index === 0}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
        <Form.Item
          hidden
          rules={[
            {
              validator: () => {
                if (images.length === 0) {
                  return Promise.reject("Musíš nahrát alespoň jeden obrázek");
                }
                return Promise.resolve();
              },
            },
          ]}
        />
        <Tabs
          type="card"
          tabBarStyle={{
            borderBottom: "1px solid #1890ff",
          }}
          style={{ backgroundColor: "#c7f1f765", padding: 20, borderRadius: 8 }}
          defaultActiveKey="cs"
          items={(["cs", "en", "sk"] as Language[]).map((lang) => ({
            key: lang,
            label: lang.toUpperCase(),
            children: (
              <>
                <Form.Item
                  name={["translations", lang, "alt"]}
                  label="Alt text hlavního obrázku"
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name={["translations", lang, "title"]}
                  label="Název inzerátu"
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  name={["translations", lang, "description"]}
                  label="Popis"
                  getValueFromEvent={() => undefined}
                >
                  <EditorMinimal
                    ref={(el) => {
                      descRefs.current[lang] = el;
                    }}
                    id={`desc-${lang}`}
                    tools={liteEditorTools}
                  />
                </Form.Item>

                <Form.Item
                  name={["translations", lang, "details"]}
                  label="Podrobnosti"
                  getValueFromEvent={() => undefined}
                >
                  <EditorMinimal
                    ref={(el) => {
                      detailsRefs.current[lang] = el;
                    }}
                    id={`details-${lang}`}
                    tools={liteEditorTools}
                  />
                </Form.Item>
              </>
            ),
          }))}
        />

        {images.length === 0 && (
          <Typography.Text type="danger">
            Musíš nahrát alespoň jeden obrázek, aby bylo možné vytvořit inzerát
          </Typography.Text>
        )}
        <Form.Item style={{ marginTop: 24 }}>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            block
            disabled={images.length === 0}
          >
            Vytvořit inzerát
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default ListingCreatePage;
