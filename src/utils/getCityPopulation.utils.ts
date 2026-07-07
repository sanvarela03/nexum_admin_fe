// utils/getCityPopulation.ts

export async function getCityPopulation(
  lat: number,
  lng: number,
  cityName: string,
): Promise<number> {
  const geoNamesUser = import.meta.env.VITE_GEO_NAME_USERNAME;

  const url =
    `https://secure.geonames.org/findNearbyPlaceNameJSON` +
    `?lat=${lat}&lng=${lng}&username=${geoNamesUser}&cities=cities1000&radius=30`;

  const res = await fetch(url);

  if (!res.ok) throw new Error(`GeoNames error: ${res.status}`);

  const data = await res.json();

  if (data.status) {
    // GeoNames returns { status: { message, value } } on errors
    throw new Error(`GeoNames: ${data.status.message}`);
  }

  const places = data.geonames ?? [];

  const normalize = (str: string) =>
    str
      .normalize("NFD")                     // decompose accented characters: á → a + ́
      .replace(/[\u0300-\u036f]/g, "")      // strip the accent marks
      .toLowerCase()                         // case-insensitive
      .trim();

  const place = places.find(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (p: any) => normalize(p.toponymName) === normalize(cityName)
  );

  if (!place) return 0;

  return place.population ?? 0;
}
