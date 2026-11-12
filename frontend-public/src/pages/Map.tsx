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
import toast from "react-hot-toast";
import { useAuth } from "../Auth/authStore";
import NoResults from "../components/Listing/NoMapListings";
import ToggleFilters from "../components/Listing/ToggleFilters";
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
    toggleFavoriteApi,
    setListings,
    isLoading,
    hasAppliedFilters,
    handleIndexSearch,
    searchedIndex,
    isIndexSearchActive,
    clearIndexSearch,
  } = useListings({
    paginated: false,
  });
  const navigate = useNavigate();
  const { lang } = useLang();
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedIdFromUrl =
    (Number(searchParams.get("selected") || 0) || null) ??
    (isIndexSearchActive ? searchedIndex : null);
  const clicked = !!selectedIdFromUrl;
  const zoom = isIndexSearchActive ? 14 : Number(searchParams.get("z") || 10);

  const { user } = useAuth();
  const searchedListing = isIndexSearchActive
    ? listings.find((l) => l.index === searchedIndex)
    : undefined;
  const hasActiveListings = listings.some(
    (listing) =>
      listing.statusy_id === 1 &&
      listing.adresy?.lat != null &&
      listing.adresy?.lng != null,
  );
  const center: [number, number] =
    searchedListing?.adresy?.lat != null && searchedListing.adresy.lng != null
      ? [searchedListing.adresy.lat, searchedListing.adresy.lng]
      : [
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
    () => listings.find((l) => l.index === selectedIdFromUrl),
    [listings, selectedIdFromUrl],
  );
  const handleMarkerClick = (index: number) => {
    /* if (window.innerWidth <= 780) {
      setSearchParams((prev) => {
        const p = new URLSearchParams(prev);
        p.set("selected", String(index));
        return p;
      });

      navigate(`/${lang}/listings/${index}`);
      return;
    } */

    setSearchParams((prev) => {
      const p = new URLSearchParams(prev);
      p.set("selected", String(index));
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
  const handleToggleFavorite = async (index: number, isFavorite: boolean) => {
    if (!user) {
      toast.error(t("favorites.loginNeeded"));
      return;
    }

    setListings((prev) =>
      prev.map((item) =>
        item.index === index ? { ...item, is_favorite: !isFavorite } : item,
      ),
    );

    try {
      await toggleFavoriteApi(index, isFavorite);
      toast.success(isFavorite ? t("favorites.removed") : t("favorites.added"));
    } catch {
      setListings((prev) =>
        prev.map((item) =>
          item.index === index ? { ...item, is_favorite: isFavorite } : item,
        ),
      );
      toast.error(t("favorites.serverFailed"));
    }
  };
  if (!filtersReady || isLoading) {
    return (
      <div className="map-page-loader">
        <span className="spinner" />
      </div>
    );
  }
  return (
    <>
      <section>
        <SEO
          title={t("SEO.Map_title")}
          description={t("SEO.Map_description")}
        />

        <div className="map wrap">
          <div className="listings-wrapper">
            <div className="buttons-pc">
              <ToggleFilters
                hasAppliedFilters={hasAppliedFilters}
                isIndexSearchActive={isIndexSearchActive}
              />
              <Filters
                onIndexSearch={handleIndexSearch}
                onClearIndexSearch={clearIndexSearch}
                isIndexSearchActive={isIndexSearchActive}
                searchedIndex={searchedIndex}
                disabled={isIndexSearchActive}
                formFilters={formFilters}
                setFormFilters={setFormFilters}
                handleSubmit={handleSubmit}
                handleClear={handleClear}
                isDefault={isDefault}
                priceRange={priceRange}
                sizeRange={sizeRange}
                filtersOpen={filtersOpen}
                setFiltersOpen={setFiltersOpen}
                hasAppliedFilters={hasAppliedFilters}
              />
            </div>
            <div className="listings">
              <div className="mobile-wrapper">
                <div className="wrap title-wrap ">
                  <p className="eyebrow">{t("listings.mapSubtitle")}</p>
                  <h2>{t("listings.map")}</h2>
                </div>
                <div className="mobile filter-btns-toggle">
                  <ToggleFilters
                    hasAppliedFilters={hasAppliedFilters}
                    isIndexSearchActive={isIndexSearchActive}
                  />
                  <Filters
                    onIndexSearch={handleIndexSearch}
                    onClearIndexSearch={clearIndexSearch}
                    isIndexSearchActive={isIndexSearchActive}
                    searchedIndex={searchedIndex}
                    disabled={isIndexSearchActive}
                    formFilters={formFilters}
                    setFormFilters={setFormFilters}
                    handleSubmit={handleSubmit}
                    handleClear={handleClear}
                    isDefault={isDefault}
                    priceRange={priceRange}
                    sizeRange={sizeRange}
                    filtersOpen={filtersOpen}
                    setFiltersOpen={setFiltersOpen}
                    hasAppliedFilters={hasAppliedFilters}
                  />
                </div>
              </div>
              <div className="map-wrapper-listing">
                {listings.length === 0 ? (
                  <NoFilters />
                ) : !hasActiveListings ? (
                  <NoResults />
                ) : (
                  <>
                    <Suspense
                      fallback={
                        <div
                          className="skeleton skeleton-map"
                          style={{
                            width: "100%",
                            height: "100%",
                          }}
                        />
                      }
                    >
                      <SearchMap
                        markers={listings.filter(hasCoords).map((l) => ({
                          index: l.index,
                          price: l.cena_v_eur,
                          position: {
                            lat: l.adresy?.lat,
                            lng: l.adresy?.lng,
                          },
                        }))}
                        selectedId={selectedIdFromUrl}
                        onMarkerClick={(index) => {
                          handleMarkerClick(index);
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
                            favorited={selected.is_favorite}
                            onToggleFavorite={() =>
                              handleToggleFavorite(
                                selected.index,
                                selected.is_favorite,
                              )
                            }
                            index={selected.index}
                            titulek={
                              selected.inzeraty_preklady[0]?.titulek ?? ""
                            }
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
                            navigate(`/${lang}/listings/${selected?.index}`)
                          }
                        >
                          {t("listings.goTo")}
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </div>
              <div className="result-box">
                {selectedIdFromUrl && selected && clicked && (
                  <div className="result mobile">
                    {selected && (
                      <Card
                        favorited={selected.is_favorite}
                        onToggleFavorite={() =>
                          handleToggleFavorite(
                            selected.index,
                            selected.is_favorite,
                          )
                        }
                        index={selected.index}
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
                          selected.obrazky[0]?.obrazky_preklady[0]?.alt_text ??
                          ""
                        }
                        status_id={selected.statusy_id}
                      />
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Map;
