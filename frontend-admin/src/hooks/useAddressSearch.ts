import React from "react";
import debounce from "lodash/debounce";

export type AddressOption = {
  display_name: string;
  place_id: number;
  lat: string;
  lon: string;
};

export function useAddressSearch() {
  const [options, setOptions] = React.useState<AddressOption[]>([]);

  const searchAddress = React.useMemo(
    () =>
      debounce(async (value: string) => {
        if (!value) return;

        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${value}`,
          {
            headers: { "User-Agent": "your-app" },
          },
        );

        const data = (await res.json()) as AddressOption[];
        setOptions(data);
      }, 300),
    [],
  );

  React.useEffect(() => {
    return () => searchAddress.cancel();
  }, [searchAddress]);

  return { options, searchAddress };
}
