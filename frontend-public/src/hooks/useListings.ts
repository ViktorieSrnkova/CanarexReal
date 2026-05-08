import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useLang } from "./i18n/useLang";
import { LANGUAGE_TO_ID } from "../types/general";
import { useRanges } from "../RangesContext";
import type { ListingThumbnail } from "../types/rawApi";
import type { FormValues } from "../types/forms";
import type { ListingSort } from "../types/filters";
import { getListingsThumbs } from "../api/listings";
type Props = {
  paginated?: boolean;
};
export function useListings({ paginated = true }: Props) {
  const ranges = useRanges();
  const { lang } = useLang();
  const langId = LANGUAGE_TO_ID[lang];

  const [searchParams, setSearchParams] = useSearchParams();

  const limit = paginated ? 9 : 9999;

  const [listings, setListings] = useState<ListingThumbnail[]>([]);
  const [total, setTotal] = useState(0);

  const page = Number(searchParams.get("page") || 1);
  const sort = (searchParams.get("sort") as ListingSort) || "date";

  const totalPages = Math.ceil(total / limit);

  const rangesReady = ranges !== null;
  const fallbackRange = useMemo<[number, number]>(() => [0, 0], []);
  const priceRange = ranges?.price ?? fallbackRange;
  const sizeRange = ranges?.size ?? fallbackRange;

  const parseArray = (val: string | null) =>
    val ? val.split(",").map(Number) : [];
  const filterString = searchParams.toString();
  const filtersReady = !!priceRange && !!sizeRange;

  const [filtersOpen, setFiltersOpen] = useState(false);
  useEffect(() => {
    if (filtersOpen) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }
  }, [filtersOpen]);
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [page]);
  const defaultFilters = useMemo<FormValues>(
    () => ({
      type: [],
      priceFrom: priceRange[0],
      priceTo: priceRange[1],
      sizeFrom: sizeRange[0],
      sizeTo: sizeRange[1],
      bedrooms: [],
      bathrooms: [],
      arrivalMode: "unknown",
      arrival: null,
    }),
    [priceRange, sizeRange],
  );

  const filters = useMemo<FormValues>(
    () => ({
      type: parseArray(searchParams.get("type")),
      priceFrom: Number(searchParams.get("priceFrom") || priceRange[0]),
      priceTo: Number(searchParams.get("priceTo") || priceRange[1]),
      sizeFrom: Number(searchParams.get("sizeFrom") || sizeRange[0]),
      sizeTo: Number(searchParams.get("sizeTo") || sizeRange[1]),
      bedrooms: parseArray(searchParams.get("bedrooms")),
      bathrooms: parseArray(searchParams.get("bathrooms")),
      arrivalMode: "unknown",
      arrival: null,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filterString, priceRange, sizeRange],
  );
  const [formFilters, setFormFilters] = useState<FormValues>(() => filters);
  useEffect(() => {
    if (!rangesReady) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFormFilters(filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rangesReady, filterString]);

  const setURL = (updates: Record<string, string | number | null>) => {
    setSearchParams((prev) => {
      const p = new URLSearchParams(prev);

      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === undefined) p.delete(key);
        else p.set(key, String(value));
      });

      return p;
    });
  };

  useEffect(() => {
    const load = async () => {
      try {
        const { thumbnails, total } = await getListingsThumbs(langId, {
          page,
          limit,
          filters,
          sort,
        });

        setListings(thumbnails);
        setTotal(total);
      } catch (err) {
        console.error(err);
      }
    };

    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, langId, filterString, sort, rangesReady]);

  const setPage = (p: number) => {
    setURL({ page: p });
  };

  const setSort = (val: ListingSort) => {
    setURL({ sort: val, page: 1 });
  };
  const handleSubmit = () => {
    setURL({
      page: 1,
      priceFrom: formFilters.priceFrom,
      priceTo: formFilters.priceTo,
      sizeFrom: formFilters.sizeFrom,
      sizeTo: formFilters.sizeTo,
      type: formFilters.type.join(","),
      bedrooms: formFilters.bedrooms.join(","),
      bathrooms: formFilters.bathrooms.join(","),
    });

    setFiltersOpen(false);
  };
  const handleClear = () => {
    setSearchParams((prev) => {
      const p = new URLSearchParams(prev);

      [
        "type",
        "priceFrom",
        "priceTo",
        "sizeFrom",
        "sizeTo",
        "bedrooms",
        "bathrooms",
      ].forEach((key) => p.delete(key));

      p.set("page", "1");

      return p;
    });

    setFormFilters(defaultFilters);
  };
  const isDefault =
    formFilters.type.length === 0 &&
    formFilters.priceFrom === defaultFilters.priceFrom &&
    formFilters.priceTo === defaultFilters.priceTo &&
    formFilters.sizeFrom === defaultFilters.sizeFrom &&
    formFilters.sizeTo === defaultFilters.sizeTo &&
    formFilters.bedrooms.length === 0 &&
    formFilters.bathrooms.length === 0;

  return {
    listings,
    total,
    totalPages,
    page,
    sort,

    formFilters,
    setFormFilters,
    filtersReady,
    filtersOpen,
    setFiltersOpen,

    handleSubmit,
    handleClear,

    setPage,
    setSort,

    isDefault,

    rangesReady,
    priceRange,
    sizeRange,

    lang,
  };
}
