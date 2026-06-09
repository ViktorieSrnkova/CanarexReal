import { useEffect, useState } from "react";
import SEO from "../components/SEO/Meta";
import { useLang } from "../hooks/i18n/useLang";
import { LANGUAGE_TO_ID } from "../types/general";
import { getNewsDetail } from "../api/news";
import { useParams } from "react-router-dom";
import type { NewsDetail } from "../types/rawApi";
import NewsEditorWrapper from "../components/Editor/NewsEditorWrapper";
import "../styles/pages/single-news.css";

function SingleNews() {
  const [news, setNews] = useState<NewsDetail | null>(null);
  const { lang } = useLang();
  const langId = LANGUAGE_TO_ID[lang];
  const { id } = useParams();

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      try {
        const formatted = await getNewsDetail(id, langId);

        setNews(formatted);
        console.log(formatted);
      } catch (err) {
        console.error(err);
      }
    };

    load();
  }, [id, langId]);

  return (
    <div className="single-news">
      <SEO
        title="Stránka nenalezena | CanarexReal"
        description="Tato stránka neexistuje nebo byla odstraněna."
        noindex
      />
      <h1>{news?.titulek || "Nepodařilo se načíst novinku"}</h1>
      <div className="news-image">
        <img
          src={
            news?.obrazek
              ? `${import.meta.env.VITE_API_URL}/api/files/images/${news.obrazek.id}`
              : undefined
          }
          alt={news?.obrazek?.alt ?? ""}
        />
      </div>
      <div className="news-text">
        {news?.text && <NewsEditorWrapper data={news.text} />}
      </div>
    </div>
  );
}

export default SingleNews;
