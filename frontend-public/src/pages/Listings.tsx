import Card from "../components/Listing/Card";
import "../styles/pages/listings.css";
import Pagination from "../components/General/Pagination";
import { useT } from "../i18n";
import SEO from "../components/SEO/Meta";
import CardSkeleton from "../components/Listing/SkeletonCard";
import { useListings } from "../hooks/useListings";
import Filters from "../components/General/Filters";
import { useMemo } from "react";
import { useAuth } from "../Auth/authStore";
import toast from "react-hot-toast";
import useImagePreloader from "../hooks/useImagePreloader";

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
    toggleFavoriteApi,
    setListings,
    isLoading,
  } = useListings({
    paginated: true,
  });
  const VITE_API_URL = import.meta.env.VITE_API_URL;
  const { user } = useAuth();
  const imageUrls = useMemo(() => {
    if (!listings.length) return null;
    const listingImages = listings
      .slice(0, 2)
      .map((l) => l.obrazky?.[0]?.id)
      .filter(Boolean)
      .map((id) => `${VITE_API_URL}/api/files/images/${id}`);

    return [...listingImages];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listings]);
  useImagePreloader(imageUrls ?? []);

  const handleToggleFavorite = async (id: number, isFavorite: boolean) => {
    if (!user) {
      toast.error(t("favorites.loginNeeded"));
      return;
    }

    setListings((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, is_favorite: !isFavorite } : item,
      ),
    );

    try {
      await toggleFavoriteApi(id, isFavorite);
    } catch {
      setListings((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, is_favorite: isFavorite } : item,
        ),
      );
    }
  };
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

            <div className={`hp-cards-wrapper ${isLoading ? "loading" : ""}`}>
              {isLoading &&
                Array.from({ length: 6 }).map((_, i) => (
                  <CardSkeleton key={i} />
                ))}
              {listings.length === 0 && !isLoading && (
                <p className="listings-empty">{t("listings.none")}</p>
              )}

              {listings.map((listing, i) => (
                <Card
                  key={listing.id}
                  fetchpriority={i < 2}
                  favorited={listing.is_favorite}
                  onToggleFavorite={() =>
                    handleToggleFavorite(listing.id, listing.is_favorite)
                  }
                  status={listing.statusy?.statusy_preklady[0]?.nazev ?? ""}
                  status_id={listing.statusy_id}
                  {...{
                    id: listing.id,
                    titulek: listing.inzeraty_preklady[0]?.titulek ?? "",
                    lokace: listing.adresy?.lokace ?? "",
                    typ:
                      listing.typy_nemovitosti?.typy_nemovitosti_preklady[0]
                        ?.nazev ?? "",
                    cena_v_eur: listing.cena_v_eur,
                    loznice: listing.loznice,
                    koupelny: listing.koupelny,
                    velikost: listing.velikost,
                    obrazekId: listing.obrazky[0]?.id ?? 0,
                    alt:
                      listing.obrazky[0]?.obrazky_preklady[0]?.alt_text ?? "",
                  }}
                />
              ))}
            </div>

            <Pagination
              page={page}
              totalPages={totalPages}
              onChange={setPage}
              loading={listings.length === 0}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default Listings;
