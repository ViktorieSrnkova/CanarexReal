import Card from "../components/Listing/Card";
import "../styles/pages/listings.css";
import Pagination from "../components/General/Pagination";
import { useT } from "../i18n";
import SEO from "../components/SEO/Meta";
import CardSkeleton from "../components/Listing/SkeletonCard";
import { useListings } from "../hooks/useListings";
import Filters from "../components/General/Filters";
import { useEffect } from "react";

function Listings() {
  const t = useT();

  const {
    listings,
    totalPages,
    page,
    sort,
    setSort,
    setPage,
    formFilters,
    setFormFilters,
    handleSubmit,
    handleClear,
    isDefault,
    priceRange,
    sizeRange,
    filtersReady,
    filtersOpen,
    setFiltersOpen,
  } = useListings({
    paginated: true,
  });
  const VITE_API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (!listings.length) return;

    const preloads: HTMLLinkElement[] = [];

    listings.slice(0, 2).forEach((listing) => {
      const imageId = listing.obrazky[0]?.id;

      if (!imageId) return;

      const preload = document.createElement("link");

      preload.rel = "preload";
      preload.as = "image";
      preload.href = `${VITE_API_URL}/api/files/images/${imageId}`;

      document.head.appendChild(preload);

      preloads.push(preload);
    });

    return () => {
      preloads.forEach((preload) => {
        document.head.removeChild(preload);
      });
    };
  }, [listings]);
  if (!filtersReady) {
    return <p>{t("general.loading")}</p>;
  }

  return (
    <>
      <SEO
        title={t("SEO.Listings_title")}
        description={t("SEO.Listings_description")}
      />
      <div className="content">
        <div className="listings-wrapper">
          <Filters
            sort={sort}
            setSort={setSort}
            formFilters={formFilters}
            setFormFilters={setFormFilters}
            handleSubmit={handleSubmit}
            handleClear={handleClear}
            isDefault={isDefault}
            priceRange={priceRange}
            sizeRange={sizeRange}
            filtersOpen={filtersOpen}
            setFiltersOpen={setFiltersOpen}
          />
          <div className="listings">
            <Pagination
              page={page}
              totalPages={totalPages}
              onChange={setPage}
              loading={listings.length === 0}
            />
            {listings.length === 0 ? (
              <div className="hp-cards-wrapper">
                {Array.from({ length: 9 }).map((_, i) => (
                  <CardSkeleton key={i} />
                ))}
              </div>
            ) : (
              <div className="hp-cards-wrapper">
                {listings.map((listing, i) => {
                  const cardData = {
                    id: listing.id,
                    titulek: listing.inzeraty_preklady[0]?.titulek ?? "",
                    lokace: listing.adresy?.lokace ?? "",
                    typ:
                      listing.typy_nemovitosti?.typy_nemovitosti_preklady[0]
                        ?.nazev ?? "",
                    status: listing.statusy.statusy_preklady[0].nazev ?? "",
                    cena_v_eur: listing.cena_v_eur,
                    loznice: listing.loznice,
                    koupelny: listing.koupelny,
                    velikost: listing.velikost,
                    obrazekId: listing.obrazky[0]?.id ?? 0,
                    alt:
                      listing.obrazky[0]?.obrazky_preklady[0]?.alt_text ?? "",
                    status_id: listing.statusy_id,
                  };

                  return (
                    <Card
                      fetchpriority={i < 2}
                      key={listing.id}
                      {...cardData}
                    />
                  );
                })}
              </div>
            )}
            <Pagination
              page={page}
              totalPages={totalPages}
              onChange={setPage}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default Listings;
