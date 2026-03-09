import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Spin, Button, Typography, Tag } from "antd";
import { getForm, toggleReview } from "../../api/forms";
import type { FormDetail } from "../../types/forms";
import { formatDate, formatDateTime, getReviewTag } from "../../utils/forms";
import { formatMoneyEUR } from "../../utils/formatting";

const { Title, Text } = Typography;

const FormDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [form, setForm] = useState<FormDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);

  useEffect(() => {
    if (id) loadForm(Number(id));
  }, [id]);

  const loadForm = async (id: number) => {
    setLoading(true);
    try {
      const data = await getForm(id);
      setForm(data);
    } catch (err) {
      console.error("Form load error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async () => {
    if (!form) return;
    setToggling(true);
    try {
      const updated = await toggleReview(form.id, !form.revidovano);
      setForm(updated);
    } catch (err) {
      console.error("Toggle review error:", err);
    } finally {
      setToggling(false);
    }
  };

  if (loading || !form) return <Spin size="large" />;

  return (
    <div style={{ padding: 24 }}>
      <div
        style={{
          marginBottom: 24,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: 16,
          backgroundColor: form.revidovano ? "#f6ffed" : "#fff1f0",
          borderRadius: 8,
          border: `1px solid ${form.revidovano ? "#b7eb8f" : "#ffa39e"}`,
        }}
      >
        {getReviewTag(form.revidovano)}
        <div
          style={{
            marginTop: 8,
            gap: 8,
            display: "flex",
          }}
        >
          <Text>Typ: </Text>
          <Tag color="blue">{form.typy_formulare?.nazev}</Tag>
          <Text style={{ marginLeft: "16px" }}>Odkud: </Text>
          <Tag color="purple">{form.odkud_formular?.nazev} </Tag>
        </div>
        <Button
          type={form.revidovano ? "default" : "primary"}
          onClick={handleToggle}
          loading={toggling}
        >
          {form.revidovano
            ? "Označit jako nerevidované"
            : "Označit jako revidované"}
        </Button>
      </div>

      <Title level={3}>
        {form.jmeno} {form.prijmeni}
      </Title>
      <div
        style={{
          display: "flex",
          justifyContent: "start",
          gap: 24,
          flexWrap: "wrap",
          backgroundColor: "#fafafa",
          padding: 16,
          borderRadius: 8,
        }}
      >
        <Text>
          Email: <Tag color="blue">{form.email}</Tag>
        </Text>
        <Text>
          Telefon: <Tag color="green">{form.telefon}</Tag>
        </Text>
        <Text style={{ marginLeft: "auto" }}>
          Datum vytvoření:
          <Tag color="volcano">{formatDateTime(form.datum_vytvoreni)}</Tag>
        </Text>
      </div>

      {form.typy_formulare?.id === 2 && (
        <div
          style={{
            marginTop: 12,
            backgroundColor: "#fafafa",
            padding: 16,
            borderRadius: 8,
          }}
        >
          <Text style={{ marginRight: "8px" }}>Index inzerátu: </Text>
          <Tag
            color="cyan"
            style={{
              border: "1px solid #08979c53",
              borderRadius: 4,
            }}
          >
            {form.index_inzeratu}
          </Tag>
        </div>
      )}
      {form.typy_formulare?.id === 3 && (
        <div
          style={{
            marginTop: 12,
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            backgroundColor: "#fafafa",
            padding: 16,
            borderRadius: 8,
          }}
        >
          <Text style={{ marginRight: "8px" }}>
            Počet ložnic:{" "}
            <Tag color="geekblue">
              {form.pocet_loznic ? form.pocet_loznic : "Nespecifikováno"}
            </Tag>
          </Text>

          <Text style={{ margin: "0 8px" }}>
            Počet koupelen:{" "}
            <Tag color="volcano">
              {form.pocet_koupelen ? form.pocet_koupelen : "Nespecifikováno"}
            </Tag>
          </Text>

          <Text style={{ margin: "0 8px" }}>
            Minimální velikost:{" "}
            <Tag color="orange">
              {form.minimalnni_velikost
                ? form.minimalnni_velikost
                : "Nespecifikováno"}{" "}
              m²
            </Tag>
          </Text>

          <Text style={{ margin: "0 8px" }}>
            Rozpočet:{" "}
            <Tag color="gold">
              {form.rozpocet
                ? formatMoneyEUR(form.rozpocet)
                : "Nespecifikováno"}
            </Tag>
          </Text>

          <Text style={{ margin: "0 8px" }}>
            Přílet:{" "}
            <Tag color={"purple"}>
              {form.prilet ? formatDate(form.prilet) : "Nespecifikováno"}
            </Tag>
          </Text>
        </div>
      )}
      <br />
      <Text>
        Text zprávy: <br />
        <div
          style={{
            width: "100%",
            minHeight: "250px",
            backgroundColor: "#fafafa",
            padding: 16,
            borderRadius: 8,
            marginTop: 8,
          }}
        >
          {form.text_zpravy}
        </div>
      </Text>
      <br />
    </div>
  );
};

export default FormDetailPage;
