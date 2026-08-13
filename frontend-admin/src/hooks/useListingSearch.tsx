import { useState } from "react";
import type { SelectProps } from "antd/es/select";
import { api } from "../api/client";
import type {
  ListingDetail,
  ListingDetailResponse,
  ListingSearchResponse,
} from "../types/listings";
import { Typography } from "antd";

const { Text } = Typography;

export const useListingSearch = () => {
  const [options, setOptions] = useState<SelectProps<number>["options"]>([]);
  const [searching, setSearching] = useState(false);
  const [loadingListing, setLoadingListing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedListing, setSelectedListing] = useState<ListingDetail | null>(
    null,
  );

  const handleSearch = async (value: string) => {
    const search = value.trim();

    setError(null);

    if (!search) {
      setOptions([]);
      return;
    }

    if (!/^\d+$/.test(search)) {
      setOptions([]);
      return;
    }

    setSearching(true);

    try {
      const response = await api.get<ListingSearchResponse>(
        "/listings/index-search",
        {
          params: {
            index: search,
          },
        },
      );

      const newOptions: SelectProps<number>["options"] =
        response.data.listings.map((listing) => ({
          value: listing.id,
          label: (
            <span>
              <Text strong>{listing.index}</Text>
              <Text type="secondary">
                {" — "}
                {listing.cena_v_eur !== null
                  ? `${listing.cena_v_eur.toLocaleString("en-US")} €`
                  : "Price not available"}
              </Text>
              {listing.lokace && (
                <Text type="secondary">
                  {", "}
                  {listing.lokace}
                </Text>
              )}
            </span>
          ),
        }));

      setOptions(newOptions);
    } catch (err) {
      console.error("Listing index search error:", err);
      setOptions([]);
      setError("Could not search listings.");
    } finally {
      setSearching(false);
    }
  };

  const handleSelect = async (listingId: number) => {
    setError(null);
    setLoadingListing(true);

    try {
      const response = await api.get<ListingDetailResponse>(
        `/listings/print/${listingId}`,
      );

      setSelectedListing(response.data.listing);
      const defaultImages = [...response.data.listing.obrazky]
        .sort((a, b) => a.poradi - b.poradi)
        .slice(0, 11);

      setSelectedImages(defaultImages);
    } catch (err) {
      console.error("Listing detail error:", err);
      setSelectedListing(null);
      setError("Could not load the selected listing.");
    } finally {
      setLoadingListing(false);
    }
  };

  const handleClear = () => {
    setSelectedListing(null);
    setOptions([]);
    setError(null);
  };

  const [selectedImages, setSelectedImages] = useState<
    ListingDetail["obrazky"]
  >([]);

  const [language, setLanguage] = useState<"cs" | "sk" | "en">("cs");

  return {
    options,
    searching,
    loadingListing,
    error,
    selectedListing,
    handleSearch,
    handleSelect,
    handleClear,
    selectedImages,
    language,
    setLanguage,
    setSelectedImages,
  };
};
