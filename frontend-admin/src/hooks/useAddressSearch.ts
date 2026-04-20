import React from "react";
import debounce from "lodash/debounce";
import type { AddressOption } from "../types/listing_form";

type NominatimResult = {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
};

export function useAddressSearch() {
  const [options, setOptions] = React.useState<AddressOption[]>([]);

  const searchAddress = React.useMemo(
    () =>
      debounce(async (value: string) => {
        if (!value) {
          setOptions([]);
          return;
        }

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(value)}`,
            {
              headers: { "User-Agent": "your-app" },
            },
          );

          const data = await res.json();

          const mapped: AddressOption[] = data.map((item: NominatimResult) => ({
            value: Number(item.place_id),
            label: item.display_name,
            lat: item.lat,
            lon: item.lon,
          }));

          setOptions(mapped);
        } catch (err) {
          console.error("Address search failed:", err);
          setOptions([]);
        }
      }, 300),
    [],
  );

  React.useEffect(() => {
    return () => searchAddress.cancel();
  }, [searchAddress]);

  return { options, searchAddress };
}
