import { useEffect, useState } from "react";
import SEO from "../components/SEO/Meta";
import { useT } from "../i18n";
import { getNewsThumbsHome } from "../api/news";
import type { NewsThumbnail } from "../types/rawApi";
import { LANGUAGE_TO_ID } from "../types/general";
import { useLang } from "../hooks/i18n/useLang";
import Card from "../components/News/Card";
import { useSearchParams } from "react-router-dom";
import Pagination from "../components/General/Pagination";
import "../styles/pages/news.css";

function News() {
  const t = useT();
  const [news, setNews] = useState<NewsThumbnail[]>([]);
  const { lang } = useLang();
  const langId = LANGUAGE_TO_ID[lang];
  const [total, setTotal] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();

  const limit = 6;
  const page = Number(searchParams.get("page") ?? 1);

  const totalPages = Math.ceil(total / limit);
  useEffect(() => {
    const load = async () => {
      try {
        const { thumbnails, total } = await getNewsThumbsHome(
          langId,
          page,
          limit,
        );

        setNews(thumbnails);
        console.log(thumbnails);
        setTotal(total);
      } catch (err) {
        console.error(err);
      }
    };

    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [langId, page]);

  const setPage = (p: number) => {
    setSearchParams({ page: String(p) });
  };
  return (
    <div className="news">
      <SEO
        title={t("SEO.News_title")}
        description={t("SEO.News_description")}
        noindex
      />
      <h1>{t("news.title")}</h1>
      <div className="content">
        <div className="hp-cards-wrapper">
          {news.map((item) => (
            <Card
              id={item.id}
              key={item.id}
              img_id={item.image?.id}
              alt={item.image?.alt ?? ""}
              title={item.titulek ?? ""}
            />
          ))}
        </div>
        <Pagination
          page={page}
          totalPages={totalPages}
          onChange={setPage}
          loading={news.length === 0}
        />
      </div>
    </div>
  );
}

export default News;
