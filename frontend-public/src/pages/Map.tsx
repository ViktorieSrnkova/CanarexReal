import { lazy, Suspense, useMemo } from "react";
import { useT } from "../i18n";
import SEO from "../components/SEO/Meta";
import Button from "../components/General/Button";
import NoFilters from "../components/Listing/NoFilters";
import { useNavigate, useSearchParams } from "react-router-dom";
import type { ListingThumbnail } from "../types/rawApi";
import { useListings } from "../hooks/useListings";
import { useLang } from "../hooks/i18n/useLang";
import Filters from "../components/General/Filters";
import Card from "../components/Listing/Card";
import "../styles/pages/listings.css";
const SearchMap = lazy(() => import("../components/Listing/SearchMap"));

function Map() {
  const t = useT();
  const {
    listings,
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
    paginated: false,
  });
  const navigate = useNavigate();
  const { lang } = useLang();
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedIdFromUrl = Number(searchParams.get("selected") || 0) || null;
  const clicked = !!selectedIdFromUrl;
  const zoom = Number(searchParams.get("z") || 10);

  const center: [number, number] = [
    Number(searchParams.get("lat") || 28.2),
    Number(searchParams.get("lng") || -16.65),
  ];

  const handleMapMove = (center: L.LatLng, zoom: number) => {
    setSearchParams((prev) => {
      const p = new URLSearchParams(prev);

      p.set("lat", String(center.lat));
      p.set("lng", String(center.lng));
      p.set("z", String(zoom));

      return p;
    });
  };
  const selected = useMemo(
    () => listings.find((l) => l.id === selectedIdFromUrl),
    [listings, selectedIdFromUrl],
  );
  const handleMarkerClick = (id: number) => {
    if (window.innerWidth <= 780) {
      setSearchParams((prev) => {
        const p = new URLSearchParams(prev);
        p.set("selected", String(id));
        return p;
      });

      navigate(`/${lang}/listings/${id}`);
      return;
    }

    setSearchParams((prev) => {
      const p = new URLSearchParams(prev);
      p.set("selected", String(id));
      return p;
    });
  };

  function hasCoords(
    l: ListingThumbnail,
  ): l is ListingThumbnail & { adresy: { lat: number; lng: number } } {
    return l.adresy?.lat != null && l.adresy?.lng != null && l.statusy_id === 1;
  }

  const closePanel = () => {
    setSearchParams((prev) => {
      const p = new URLSearchParams(prev);
      p.delete("selected");
      return p;
    });
  };
  if (!filtersReady) {
    return <p>{t("general.loading")}</p>;
  }
  return (
    <>
      <SEO title={t("SEO.Map_title")} description={t("SEO.Map_description")} />
      <div className="content">
        <div className="listings-wrapper">
          <Filters
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
            <div className="map-wrapper-listing">
              {listings.length === 0 ? (
                <NoFilters />
              ) : (
                <>
                  <Suspense fallback={<div>Loading map...</div>}>
                    <SearchMap
                      markers={listings.filter(hasCoords).map((l) => ({
                        id: l.id,
                        price: l.cena_v_eur,
                        position: {
                          lat: l.adresy?.lat,
                          lng: l.adresy?.lng,
                        },
                      }))}
                      selectedId={selectedIdFromUrl}
                      onMarkerClick={(id) => {
                        handleMarkerClick(id);
                      }}
                      center={center}
                      zoom={zoom}
                      onMapMove={handleMapMove}
                    />
                  </Suspense>
                  {selectedIdFromUrl && selected && clicked && (
                    <div className="result">
                      <div
                        className="result-close"
                        onClick={(e) => {
                          e.stopPropagation();
                          closePanel();
                        }}
                      >
                        ×
                      </div>

                      {selected && (
                        <Card
                          id={selected.id}
                          titulek={selected.inzeraty_preklady[0]?.titulek ?? ""}
                          lokace={selected.adresy?.lokace ?? ""}
                          typ={
                            selected.typy_nemovitosti
                              ?.typy_nemovitosti_preklady[0]?.nazev ?? ""
                          }
                          status={
                            selected.statusy?.statusy_preklady[0]?.nazev ?? ""
                          }
                          cena_v_eur={selected.cena_v_eur}
                          loznice={selected.loznice}
                          koupelny={selected.koupelny}
                          velikost={selected.velikost}
                          obrazekId={selected.obrazky[0]?.id ?? 0}
                          alt={
                            selected.obrazky[0]?.obrazky_preklady[0]
                              ?.alt_text ?? ""
                          }
                          status_id={selected.statusy_id}
                        />
                      )}
                      <Button
                        onClick={() =>
                          navigate(`/${lang}/listings/${selected?.id}`)
                        }
                      >
                        {t("listings.goTo")}
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Map;
