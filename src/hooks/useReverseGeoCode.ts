import { useState, useCallback } from "react";
import { getFlagEmoji, getCityPopulation, PHONE_CODES, CURRENCY_CODES, TIME_ZONES } from "@utils";

export type GeoResult = {
  city: string;
  state: string;
  state_code: string;
  city_code: string;
  country: string;
  country_code: string;
  flag_emoji: string;
  phone_code: string;
  population: number;
  time_zone: string;
  currency_code: string;
  is_active: boolean;
  display_name: string;
} | null;

export function useReverseGeocode() {
  const [result, setResult] = useState<GeoResult>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const lookup = useCallback(async (lat: number, lng: number) => {
    setLoading(true);
    setError(null);

    try {
      const nominatimRes = await fetch(
        `https://nominatim.openstreetmap.org/reverse` +
        `?lat=${lat}&lon=${lng}&format=json&addressdetails=1`,
        { headers: { "Accept-Language": "en" } }
      ).then((r) => {
        if (!r.ok) throw new Error(`Nominatim error: ${r.status}`);
        return r.json();
      });

      const addr = nominatimRes.address ?? {};

      // ── country ─────────────────────────────────────────────────────────────
      const country      = addr.country ?? "Unknown";
      const country_code = (addr.country_code ?? "").toUpperCase();

      // ── state ────────────────────────────────────────────────────────────────
      const state      = addr.state ?? addr.region ?? "Unknown";
      const iso_lvl4   = (addr["ISO3166-2-lvl4"] ?? "") as string;
      const state_code = iso_lvl4.includes("-") ? iso_lvl4.split("-")[1] : iso_lvl4 || "";

      // ── city ─────────────────────────────────────────────────────────────────
      const city =
        addr.city        ??
        addr.town        ??
        addr.village     ??
        addr.municipality ??
        addr.county      ??
        "Unknown";

      // ── city_code ────────────────────────────────────────────────────────────
      const city_code = addr.postcode ?? "";

      // ── lookup-table fields ──────────────────────────────────────────────────
      const flag_emoji    = country_code ? getFlagEmoji(country_code) : "";
      const phone_code    = PHONE_CODES[country_code]    ?? "Unknown";
      const currency_code = CURRENCY_CODES[country_code] ?? "Unknown";
      const time_zone     = TIME_ZONES[country_code]     ?? "Unknown";

      const population = await getCityPopulation(lat, lng, city);

      setResult({
        city,
        state,
        state_code,
        city_code,
        country,
        country_code,
        flag_emoji,
        phone_code,
        population,
        time_zone,
        currency_code,
        is_active: true,
        display_name: nominatimRes.display_name ?? "",
      });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { result, loading, error, lookup };
}