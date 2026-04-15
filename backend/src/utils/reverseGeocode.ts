export type ReverseGeocodeResult = {
  city?: string;
  country?: string;
  state?: string;
  street?: string;
  houseNumber?: string;
  postcode?: string;
  label: string;
};

export async function reverseGeocode(lat: number, lon: number) {
  const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`;

  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "canarex-real-estate-app/1.0 (contact: viky.srnkova@seznam.cz)",
      "Accept-Language": "en",
    },
  });

  if (!res.ok) {
    const text = await res.text();
    console.log("Nominatim error response:", res.status, text);
    throw new Error("Reverse geocoding failed");
  }

  const data = await res.json();
  const addr = data.address || {};

  return {
    street: addr.road,
    houseNumber: addr.house_number,
    city: addr.city || addr.town || addr.village || addr.hamlet,
    state: addr.state,
    country: addr.country,
    postcode: addr.postcode,
    label: data.display_name,
  };
}
