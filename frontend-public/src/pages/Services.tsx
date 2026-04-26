import { useEffect, useState } from "react";
import Carrousel from "../components/Listing/Carrousel";
import type { ListingThumbnail } from "../types/rawApi";
import { useLang } from "../hooks/i18n/useLang";
import { LANGUAGE_TO_ID } from "../types/general";
import { getListingsThumbsHome } from "../api/listings";
import { useT } from "../i18n";
import Button from "../components/General/Button";
import { useNavigate } from "react-router-dom";
import "../styles/pages/services.css";
import BaseForm from "../components/Forms/BaseForm";

function Services() {
  const t = useT();
  const navigate = useNavigate();
  const [similar, setSimilar] = useState<ListingThumbnail[]>([]);
  const [loadingSimilar, setLoadingSimilar] = useState(false);
  const { lang } = useLang();
  const langId = LANGUAGE_TO_ID[lang];

  useEffect(() => {
    const loadSimilar = async () => {
      setLoadingSimilar(true);
      try {
        const data = await getListingsThumbsHome(langId);
        setSimilar(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingSimilar(false);
      }
    };

    loadSimilar();
  }, [langId]);

  return (
    <>
      <img
        className="wawe"
        src="/general/vlnka-white-gray.svg"
        alt="vlnka-white-to-gray"
      />
      <div className="services gray">
        <Carrousel
          similar={similar}
          loading={loadingSimilar}
          title={t("carrousel.title")}
          loadTxt={t("general.loading")}
          errTxt={t("similar.error")}
        />
        <div className="btn-row">
          <Button onClick={() => navigate("/listings")}>
            {t("services.more")}
          </Button>
        </div>
      </div>
      <img
        className="wawe"
        src="/general/vlnka-gray-white-nm.svg"
        alt="vlnka-gray-to-white"
      />
      <div className="contact white">
        <h2>{t("form.titleInq")}</h2>
        <h3 className="inq-subtitle">{t("form.subtitleInq")}</h3>
        <BaseForm from={4} what={3} />
      </div>
    </>
  );
}

export default Services;
