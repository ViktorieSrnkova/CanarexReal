import type { RawListingDetail } from "../types/api";
import { LANGUAGE_MAP } from "../types/general";
import {
  FEATURES_SET,
  PROPERTY_TYPE_MAP,
  type CreateAdFormValues,
  type FeatureId,
  type PropertyType,
} from "../types/listing_form";

const mapPropertyType = (id: number | null): PropertyType | null => {
  if (!id) return null;
  return PROPERTY_TYPE_MAP[id] ?? null;
};
const mapFeatures = (
  items: { piktogramy_id: number }[],
): Record<string, boolean> => {
  return items.reduce(
    (acc, item) => {
      if (FEATURES_SET.has(item.piktogramy_id as FeatureId)) {
        acc[item.piktogramy_id] = true;
      }
      return acc;
    },
    {} as Record<string, boolean>,
  );
};
const mapTranslations = (
  items: RawListingDetail["inzeraty_preklady"],
): CreateAdFormValues["translations"] => {
  return items.reduce(
    (acc, t) => {
      const lang = LANGUAGE_MAP[t.jazyky_id];

      if (!lang) return acc;

      acc[lang] = {
        title: t.titulek ?? "",
        description: t.popis ? JSON.parse(t.popis) : undefined,
        details: t.detaily ? JSON.parse(t.detaily) : undefined,
      };

      return acc;
    },
    {} as CreateAdFormValues["translations"],
  );
};
export const mapRawListingToFormValues = (
  data: RawListingDetail,
): CreateAdFormValues => {
  return {
    isOnHomepage: data.reprezentativni ?? false,

    price: data.cena_v_eur ?? 0,

    propertyType: mapPropertyType(data.typy_nemovitosti_id) ?? "dum",

    locationName: data.adresy?.lokace ?? "",

    listingIndex: Number(data.index ?? 0),

    bedrooms: data.loznice ?? 0,
    bathrooms: data.koupelny ?? 0,
    area: data.velikost ?? 0,

    address: data.adresy
      ? {
          value: Number(data.adresy.nominatim_id ?? 0),
          label: data.adresy.lokace ?? "",
          lat: data.adresy.lat ?? "",
          lon: data.adresy.lng ?? "",
        }
      : null,

    translations: mapTranslations(data.inzeraty_preklady),

    gallery: [],

    features: mapFeatures(data.inzeraty_piktogramy),
  };
};
