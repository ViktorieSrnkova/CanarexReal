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
import SEO from "../components/SEO/Meta";

import { useAuth } from "../Auth/authStore";
import OurServices from "../components/Services/OurServices";

function Services() {
  const t = useT();
  const { user } = useAuth();
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
  }, [langId, user]);

  return (
    <>
      <SEO
        title={t("SEO.Services_title")}
        description={t("SEO.Services_description")}
        noindex
      />
      <OurServices />

      <section className="gray services pad">
        <div className="wrap">
          <Carrousel
            similar={similar}
            loading={loadingSimilar}
            title={t("carrousel.title")}
            loadTxt={t("general.loading")}
            errTxt={t("similar.error")}
          />
          <div className="btn-row">
            <Button onClick={() => navigate(`/${lang}/listings`)}>
              {t("services.more")}
            </Button>
          </div>
        </div>
      </section>

      <section className=" white pad">
        <div className="wrap">
          <p className="eyebrow">{t("form.subtitleInq")}</p>
          <h2>{t("form.titleInq")}</h2>
          <BaseForm from={4} what={3} />
        </div>
      </section>
    </>
  );
}

export default Services;
