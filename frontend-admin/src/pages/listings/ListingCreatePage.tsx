import {
  Button,
  Form,
  Input,
  message,
  Select,
  Switch,
  Tabs,
  Tooltip,
  Typography,
  Upload,
} from "antd";
import {
  FEATURES,
  PROPERTY_TYPE_OPTIONS,
  type AddressOption,
  type CreateAdFormValues,
} from "../../types/listing_form";
import type { Language } from "../../types/general";
import { liteEditorTools } from "../../config/lite-editor-tools";
import { Row, Col } from "antd";
import ToggleButton from "../../components/listings/ToggleButton";
import { DndContext, closestCenter } from "@dnd-kit/core";
import type { RcFile, UploadFile } from "antd/es/upload";
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
import { useEffect, useRef, useState } from "react";
import { editListingTexts, postListing } from "../../api/listings";
import { useEditedListing } from "../../hooks/useEditListing";

type Props = {
  initialData?: CreateAdFormValues;
  onSuccess?: () => void;
  onClose?: () => void;
};

const ListingCreatePage: React.FC<Props> = ({
  initialData,
  onSuccess,
  onClose,
}) => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const readyMap = useRef<
    Record<Language, { desc: boolean; details: boolean }>
  >({
    cs: { desc: false, details: false },
    en: { desc: false, details: false },
    sk: { desc: false, details: false },
  });
  const languages: Language[] = ["cs", "en", "sk"];
  const isEditMode = !!initialData;
  const hasInitialData = typeof initialData?.id === "number";
  const id = initialData?.id;
  const [selectedAddress, setSelectedAddress] = useState<AddressOption | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
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
  const { descRefs, detailsRefs, buildPayload } = useListingSubmit(
    images,
    selectedAddress,
  );
  const { buildEditPayload, setEditorContent } = useEditedListing(
    selectedAddress,
    initialData,
  );

  const onFinish = async (values: CreateAdFormValues) => {
    if (!images.length && !isEditMode) {
      message.error("Musíš nahrát obrázky");
      return;
    }

    setLoading(true);

    try {
      if (hasInitialData && id) {
        const payload = await buildEditPayload(values);

        console.log("EDIT PAYLOAD:", payload);
        await editListingTexts(id, payload);

        message.success("Inzerát upraven");
        onClose?.();
      } else {
        const payload = await buildPayload(values);
        const formData = new FormData();

        formData.append("payload", JSON.stringify(payload));

        images.forEach((img) => {
          formData.append("images", img.file);
        });

        await postListing(formData);
        message.success("Inzerát vytvořen");

        onSuccess?.();
        form.resetFields();
        setImages([]);
      }
    } catch {
      message.error("Chyba při vytváření inzerátu");
    } finally {
      setLoading(false);
    }
  };
  const [activeTab, setActiveTab] = useState<Language>("cs");
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!initialData) return;
    if (initializedRef.current) return;

    initializedRef.current = true;

    const { translations, ...rest } = initialData;

    form.setFieldsValue({
      ...rest,
      translations: {
        cs: {
          title: translations?.cs?.title,
          alt: translations?.cs?.alt,
        },
        en: {
          title: translations?.en?.title,
          alt: translations?.en?.alt,
        },
        sk: {
          title: translations?.sk?.title,
          alt: translations?.sk?.alt,
        },
      },
    });

    if (initialData.address) {
      setSelectedAddress(initialData.address);
    }
  }, [initialData, form]);

  return (
    <div
      onFocusCapture={() => {
        if (uploading) setUploading(false);
      }}
    >
      <Typography.Title level={2}>
        {!isEditMode ? "Vytvořit inzerát" : "Upravit inzerát"}
      </Typography.Title>
      <Form
        layout="vertical"
        onFinish={onFinish}
        form={form}
        onFinishFailed={({ errorFields }) => {
          if (errorFields.length > 0) {
            const firstError = errorFields[0];
            form.scrollToField(firstError.name, {
              behavior: "smooth",
              block: "center",
            });
            message.error(
              `Chyba ve formuláři: ${firstError.errors[0] || "Zkontroluj pole"}`,
            );
          }
        }}
      >
        {!isEditMode && (
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
              name="isOnHomepage"
              label=""
              valuePropName="checked"
              initialValue={true}
              style={{ marginBottom: 0 }}
            >
              <Switch />
            </Form.Item>
          </div>
        )}
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
            name="listingIndex"
            label="Index Inzerátu"
            getValueFromEvent={(e) => e.target.value.replace(/\D/g, "")}
          >
            <Input
              maxLength={9}
              style={{ maxWidth: 120 }}
              inputMode="numeric"
            />
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
            <Input
              maxLength={9}
              style={{ maxWidth: 120 }}
              inputMode="numeric"
            />
          </Form.Item>
          <Form.Item
            required
            rules={[{ required: true, message: "Vyplň ložnice" }]}
            name="bedrooms"
            label="Počet ložnic"
            getValueFromEvent={(e) => e.target.value.replace(/\D/g, "")}
          >
            <Input
              maxLength={2}
              style={{ maxWidth: 100 }}
              inputMode="numeric"
            />
          </Form.Item>
          <Form.Item
            required
            rules={[{ required: true, message: "Vyplň koupelny" }]}
            name="bathrooms"
            label="Počet koupelen"
            getValueFromEvent={(e) => e.target.value.replace(/\D/g, "")}
          >
            <Input
              maxLength={2}
              style={{ maxWidth: 120 }}
              inputMode="numeric"
            />
          </Form.Item>
          <Form.Item
            required
            rules={[{ required: true, message: "Vyplň velikost" }]}
            name="area"
            label="Velikost v m²"
            getValueFromEvent={(e) => e.target.value.replace(/\D/g, "")}
          >
            <Input
              maxLength={9}
              style={{ maxWidth: 120 }}
              inputMode="numeric"
            />
          </Form.Item>
          <Form.Item
            required
            rules={[{ required: true, message: "Vyplň lokaci" }]}
            name={"locationName"}
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
            <Select options={[...PROPERTY_TYPE_OPTIONS]} />
          </Form.Item>
          <Form.Item
            required
            rules={[{ required: true, message: "Vyplň adresu" }]}
            name="address"
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
                value: item.value,
                label: item.label,
              }))}
              onChange={(val) => {
                const found = options.find((o) => o.value === val.value);

                setSelectedAddress(found ?? null);
              }}
              style={{ width: "100%", color: "#000" }}
            />
          </Form.Item>
        </div>
        <Row gutter={[8, 0]}>
          {FEATURES.map((feature) => (
            <Col key={feature.value}>
              <Form.Item
                name={["features", String(feature.value)]}
                valuePropName="value"
                initialValue={false}
              >
                <ToggleButton label={feature.label} />
              </Form.Item>
            </Col>
          ))}
        </Row>
        {!isEditMode && (
          <>
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
                fileList={fileList}
                showUploadList={false}
                onChange={(info) => {
                  const newList = info.fileList;

                  setFileList(newList);

                  const files = newList
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
                  Pořadí obrázků lze upravit jejich uchopením jejich tmavého
                  čtverečku v levém horním rohua přetažením
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
                    const oldIndex = items.findIndex(
                      (i) => i.uid === active.id,
                    );
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
                        onDelete={() => {
                          setImages((prev) =>
                            prev.filter((i) => i.uid !== img.uid),
                          );
                          setFileList((prev) =>
                            prev.filter((f) => f.uid !== img.uid),
                          );
                        }}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            </div>
          </>
        )}
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
          activeKey={activeTab}
          onChange={(key) => setActiveTab(key as Language)}
          type="card"
          destroyOnHidden={false}
          tabBarStyle={{
            borderBottom: "1px solid #1890ff",
          }}
          style={{
            backgroundColor: "#c7f1f765",
            padding: 20,
            borderRadius: 8,
          }}
          items={languages.map((lang) => ({
            key: lang,
            label: lang.toUpperCase(),
            children: (
              <div style={{ display: activeTab === lang ? "block" : "none" }}>
                {!isEditMode && (
                  <Form.Item
                    name={["translations", lang, "alt"]}
                    label="Alt text hlavního obrázku"
                  >
                    <Input />
                  </Form.Item>
                )}
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
                    data={initialData?.translations?.[lang]?.description}
                    onReady={() => {
                      readyMap.current[lang].desc = true;
                    }}
                    onChange={(data) => {
                      setEditorContent((prev) => ({
                        ...prev,
                        [lang]: {
                          ...prev[lang],
                          description: data,
                        },
                      }));
                    }}
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
                    data={initialData?.translations?.[lang]?.details}
                    onReady={() => {
                      readyMap.current[lang].details = true;
                    }}
                    onChange={(data) => {
                      setEditorContent((prev) => ({
                        ...prev,
                        [lang]: {
                          ...prev[lang],
                          details: data,
                        },
                      }));
                    }}
                  />
                </Form.Item>
              </div>
            ),
          }))}
        />

        {images.length === 0 && !isEditMode && (
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
            loading={loading}
            disabled={images.length === 0 && !isEditMode}
          >
            {!isEditMode ? " Vytvořit inzerát" : "Uložit úpravy"}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ListingCreatePage;
