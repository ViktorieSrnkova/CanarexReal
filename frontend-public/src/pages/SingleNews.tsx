import { useEffect, useState } from "react";
import SEO from "../components/SEO/Meta";
import { useLang } from "../hooks/i18n/useLang";
import { LANGUAGE_TO_ID } from "../types/general";
import { getNewsDetail } from "../api/news";
import { useParams } from "react-router-dom";
import type { NewsDetail } from "../types/rawApi";
import "../styles/pages/single-news.css";
import ContentRenderer from "../components/Editor/ContentRenderer";

function SingleNews() {
  const [news, setNews] = useState<NewsDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const { lang } = useLang();
  const langId = LANGUAGE_TO_ID[lang];
  const { id } = useParams();

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(false);
      setNews(null);

      if (!id) {
        setError(true);
        setLoading(false);
        return;
      }

      try {
        const formatted = await getNewsDetail(id, langId);

        if (!cancelled) {
          if (formatted) {
            setNews(formatted);
          } else {
            setError(true);
          }
        }
      } catch (err) {
        if (!cancelled) {
          console.error(err);
          setError(true);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [id, langId]);

  return (
    <section>
      <div className="information wrap">
        <div className="single-news">
          <SEO
            title={
              news
                ? `${news.titulek} | CanarexReal`
                : "Načítání novinky | CanarexReal"
            }
            description={
              news?.titulek ?? "Tato stránka neexistuje nebo byla odstraněna."
            }
            noindex={!loading && (error || !news)}
          />

          {loading ? (
            <div className="wrap centerer">
              <span className="spinner" />
            </div>
          ) : error || !news ? (
            <div className="wrap">
              <h1>Nepodařilo se načíst novinku</h1>
            </div>
          ) : (
            <>
              <div className="wrap">
                <h1>{news.titulek}</h1>
              </div>

              {news.obrazek && (
                <div className="news-image">
                  <img
                    src={`${import.meta.env.VITE_API_URL}/api/files/images/${news.obrazek.id}`}
                    alt={news.obrazek.alt ?? ""}
                  />
                </div>
              )}

              <div className="news-text wrap">
                {news.text && <ContentRenderer data={news.text} />}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

export default SingleNews;
