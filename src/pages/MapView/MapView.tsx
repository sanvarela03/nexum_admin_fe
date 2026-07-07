import { useState, useEffect } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap, Polyline, Polygon } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon from "../../assets/placeholder.png";
import { useMapEvents } from "react-leaflet";
import { computeCentroid } from "@utils";
import { useReverseGeocode } from "./../../hooks/useReverseGeoCode";
import { createPortal } from "react-dom";
import { MarketLocationItemList, ServiceArea } from "@app-types/market_location";
import { MarketLocationService } from "@services";

// ─── Types ────────────────────────────────────────────────────────────────────

type Position = { lat: number; lon: number };
type LatLonTuple = [number, number];

// ─── Constants ────────────────────────────────────────────────────────────────

const DEFAULT_CENTER: LatLonTuple = [4.7110, -74.0721];

const icon = L.icon({
  iconUrl: markerIcon,
  iconSize: [38, 38],
});

const smallIcon = L.icon({
  iconUrl: markerIcon,
  iconSize: [20, 20],
});

// ─── Sub-components ───────────────────────────────────────────────────────────

function LocationSelector({
  setSelectPosition,
  isDrawing,
  onPolygonClick,
}: {
  setSelectPosition: (pos: Position) => void;
  isDrawing: boolean;
  onPolygonClick: (latlng: L.LatLng) => void;
}) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      if (isDrawing) {
        onPolygonClick(e.latlng);
      } else {
        setSelectPosition({ lat, lon: lng });
      }
    },
  });

  return null;
}

function ResetCenterView({ selectPosition }: { selectPosition: Position | null }) {
  const map = useMap();

  useEffect(() => {
    if (selectPosition) {
      map.setView(
        L.latLng(selectPosition.lat, selectPosition.lon),
        map.getZoom(),
        { animate: true }
      );
    }
  }, [selectPosition]);

  return null;
}

// ─── GeoJSON Helper ───────────────────────────────────────────────────────────

function buildGeoJSON(points: LatLonTuple[]): ServiceArea {
  // GeoJSON polygon coordinates are [lng, lat] and must close the ring
  const coordinates = [
    [...points.map(([lat, lng]) => [lng, lat]), [points[0][1], points[0][0]]],
  ];

  return {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: {},
        geometry: {
          type: "Polygon",
          coordinates,
        },
      },
    ],
  };
}

function ResizeMap() {
  const map = useMap()

  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize()
    }, 0)
  }, [map])

  return null
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Maps() {
  const [selectPosition, setSelectPosition] = useState<Position | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [polygonPoints, setPolygonPoints] = useState<LatLonTuple[]>([]);
  const [completedPolygon, setCompletedPolygon] = useState<LatLonTuple[] | null>(null);
  const [geoJSON, setGeoJSON] = useState<ServiceArea | null>(null);
  const [showJSON, setShowJSON] = useState(false);
  const [isAddMarketLocationOpen, setIsAddMarketLocationOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [storedLocations, setStoredLocations] = useState<MarketLocationItemList[]>([]);
  const [locationsLoading, setLocationsLoading] = useState(false);
  const [locationsError, setLocationsError] = useState<string | null>(null);

  const fetchMarketLocations = async () => {
    setLocationsLoading(true);
    setLocationsError(null);
    try {
      const data = await MarketLocationService.getMarketLocations();
      setStoredLocations(data);
    } catch (err) {
      console.error("Failed to load market locations:", err);
      setLocationsError("Failed to load market locations.");
    } finally {
      setLocationsLoading(false);
    }
  };

  useEffect(() => {
    fetchMarketLocations();
  }, []);

  const { result: geoResult, loading: geoLoading, error: geoError, lookup } =
    useReverseGeocode();

  const locationSelection: LatLonTuple | null = selectPosition
    ? [selectPosition.lat, selectPosition.lon]
    : null;

  // ── Handlers ────────────────────────────────────────────────────────────────

  const handlePolygonClick = (latlng: L.LatLng) => {
    setPolygonPoints((prev) => [...prev, [latlng.lat, latlng.lng]]);
  };

  const handleStartDrawing = () => {
    setIsDrawing(true);
    setPolygonPoints([]);
    setCompletedPolygon(null);
    setGeoJSON(null);
    setShowJSON(false);
    setSelectPosition(null);
  };

  const handleFinishDrawing = async () => {
    if (polygonPoints.length < 3) {
      alert("A polygon needs at least 3 points.");
      return;
    }
    setIsDrawing(false);
    setCompletedPolygon(polygonPoints);
    const json = buildGeoJSON(polygonPoints);
    setGeoJSON(json);
    setShowJSON(true);
    setPolygonPoints([]);

    const [cLat, cLng] = computeCentroid(polygonPoints);
    await lookup(cLat, cLng);
  };

  const handleCancelDrawing = () => {
    setIsDrawing(false);
    setPolygonPoints([]);
  };

  const handleClearPolygon = () => {
    setCompletedPolygon(null);
    setGeoJSON(null);
    setShowJSON(false);
  };

  const handleCopyJSON = () => {
    if (geoJSON) {
      navigator.clipboard.writeText(JSON.stringify(geoJSON, null, 2));
    }
  };

  const handleConfirmSave = async () => {
    if (!geoResult || !geoJSON) return;
    setIsSaving(true);

    try {
      // TODO: replace with your actual API call
      await MarketLocationService.addMarketLocation([
        {
          ...geoResult,
          service_area: geoJSON,
          is_active: true,
        }
      ]);
      setIsAddMarketLocationOpen(false);
    } catch (err) {
      console.error("Failed to save market location:", err);
    } finally {
      setIsSaving(false);
      fetchMarketLocations(); // Refresh the list after adding
    }
  };

  const handleCancelSave = () => {
    setIsAddMarketLocationOpen(false);
  };

  const modal = createPortal(
    <>
      {/* Backdrop */}
      {isAddMarketLocationOpen && (
        <div
          onClick={() => !isSaving && setIsAddMarketLocationOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 99998,
          }}
        />
      )}

      {/* Modal */}
      {isAddMarketLocationOpen && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 99999,
            background: "white",
            borderRadius: 12,
            padding: 24,
            minWidth: 420,
            boxShadow: "0 25px 50px rgba(0,0,0,0.4)",
          }}
        >
          {/* Header */}
          <h2 style={{ margin: "0 0 16px", fontSize: 18, fontWeight: 600, color: "#111827" }}>
            Add Market Location
          </h2>

          {/* Body */}
          <div>
            {geoLoading ? (
              <p style={{ color: "#6b7280", fontSize: 14 }}>🔍 Loading location data…</p>
            ) : geoResult ? (
              <>
                <p style={{ color: "#374151", marginBottom: 12 }}>
                  Do you want to add the following location to the database?
                </p>
                <div
                  style={{
                    border: "1px solid #e5e7eb",
                    borderRadius: 8,
                    padding: 16,
                    background: "#f9fafb",
                    fontSize: 13,
                  }}
                >
                  <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>
                    {geoResult.flag_emoji} {geoResult.city}
                  </div>
                  <p style={{ color: "#6b7280", margin: "0 0 10px" }}>
                    {geoResult.state} · {geoResult.country} ({geoResult.country_code})
                  </p>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "6px 16px",
                      color: "#4b5563",
                    }}
                  >
                    <span style={{ color: "#9ca3af" }}>Phone</span>
                    <span>{geoResult.phone_code}</span>
                    <span style={{ color: "#9ca3af" }}>Currency</span>
                    <span>{geoResult.currency_code}</span>
                    <span style={{ color: "#9ca3af" }}>Time zone</span>
                    <span>{geoResult.time_zone}</span>
                    <span style={{ color: "#9ca3af" }}>Population</span>
                    <span>{geoResult.population?.toLocaleString()}</span>
                  </div>
                </div>
              </>
            ) : (
              <p style={{ color: "#dc2626", fontSize: 14 }}>
                ⚠️ Could not retrieve location data. Do you still want to save?
              </p>
            )}
          </div>

          {/* Footer */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 8,
              marginTop: 20,
            }}
          >
            <button
              onClick={handleCancelSave}
              disabled={isSaving}
              style={btnStyle("#6b7280")}
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmSave}
              disabled={isSaving || geoLoading}
              style={btnStyle(isSaving || geoLoading ? "#6b7280" : "#2563eb")}
            >
              {isSaving ? "Saving…" : "Yes, Add Location"}
            </button>
          </div>
        </div>
      )}
    </>,
    document.body
  );

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <>
      <div className="w-full h-full min-h-0 relative">
        {locationsLoading && (
          <div style={{ position: "absolute", top: 10, left: "50%", transform: "translateX(-50%)", zIndex: 1000, background: "#1e1e2e", color: "#cdd6f4", padding: "6px 14px", borderRadius: 6, fontSize: 13 }}>
            🔄 Loading market locations…
          </div>
        )}
        {locationsError && (
          <div style={{ position: "absolute", top: 10, left: "50%", transform: "translateX(-50%)", zIndex: 1000, background: "#450a0a", color: "#f87171", padding: "6px 14px", borderRadius: 6, fontSize: 13 }}>
            ⚠️ {locationsError}
          </div>
        )}
        {/* ── Toolbar ── */}
        <div
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            zIndex: 1000,
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          {!isDrawing ? (
            <>
              <button
                onClick={handleStartDrawing}
                style={btnStyle("#2563eb")}
              >
                ✏️ Draw Polygon
              </button>
              {completedPolygon && (
                <>
                  <button onClick={(e) => {
                      e.stopPropagation();
                      setIsAddMarketLocationOpen(true)
                    }} style={btnStyle("#16a34a")}>
                    💾 Save Location
                  </button>
                  <button onClick={() => setShowJSON((v) => !v)} style={btnStyle("#7c3aed")}>
                    {showJSON ? "Hide" : "Show"} GeoJSON
                  </button>
                  <button onClick={handleClearPolygon} style={btnStyle("#dc2626")}>
                    🗑 Clear Polygon
                  </button>
                </>
              )}
            </>
          ) : (
            <>
              <div style={infoStyle}>
                🖱 Click map to add points
                <br />
                <strong>{polygonPoints.length}</strong> point(s) added
              </div>
              <button
                onClick={handleFinishDrawing}
                disabled={polygonPoints.length < 3}
                style={btnStyle(polygonPoints.length >= 3 ? "#16a34a" : "#6b7280")}
              >
                ✅ Finish Polygon
              </button>
              <button onClick={handleCancelDrawing} style={btnStyle("#dc2626")}>
                ✖ Cancel
              </button>
            </>
          )}
        </div>

        {/* ── GeoJSON Panel ── */}
        {showJSON && geoJSON && (
          <div
            style={{
              position: "absolute",
              bottom: 10,
              left: 10,
              zIndex: 1000,
              background: "#1e1e2e",
              color: "#cdd6f4",
              borderRadius: 8,
              padding: "12px 16px",
              maxWidth: 420,
              maxHeight: 300,
              overflowY: "auto",
              fontSize: 12,
              fontFamily: "monospace",
              boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <strong style={{ color: "#89b4fa" }}>GeoJSON Output</strong>
              <button onClick={handleCopyJSON} style={btnStyle("#2563eb", true)}>
                📋 Copy
              </button>
            </div>
            <pre style={{ margin: 0 }}>{JSON.stringify(geoJSON, null, 2)}</pre>
          </div>
        )}

        {completedPolygon && (
          <div style={infoPanelStyle}>
            {geoLoading && <p style={{ margin: 0 }}>🔍 Detecting location…</p>}
            {geoError   && <p style={{ margin: 0, color: "#f87171" }}>⚠️ {geoError}</p>}

            {geoResult && !geoLoading && (
              <table style={{ borderCollapse: "collapse", fontSize: 13 }}>
                <tbody>
                  {(
                    [
                      ["Flag",         geoResult.flag_emoji],
                      ["Country",      geoResult.country],
                      ["Country Code", geoResult.country_code],
                      ["Phone",        geoResult.phone_code],
                      ["State",        geoResult.state],
                      ["State Code",   geoResult.state_code],
                      ["City",         geoResult.city],
                      ["City Code",    geoResult.city_code || "—"],
                      ["Population",   geoResult.population || 0],
                      ["Time Zone",    geoResult.time_zone],
                      ["Currency",     geoResult.currency_code],
                    ] as [string, string][]
                  ).map(([label, value]) => (
                    <tr key={label}>
                      <td style={tdLabelStyle}>{label}</td>
                      <td style={tdValueStyle}>{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* ── Map ── */}
        <MapContainer
          center={DEFAULT_CENTER}
          zoom={8}
          style={{
            cursor: isDrawing ? "crosshair" : "grab",
            zIndex: 100,
          }}
          className="h-full w-full"
        >
          <ResizeMap />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://api.maptiler.com/maps/base-v4/{z}/{x}/{y}.png?key=otUt0yECro6sRHU282a9"
          />

          <LocationSelector
            setSelectPosition={setSelectPosition}
            isDrawing={isDrawing}
            onPolygonClick={handlePolygonClick}
          />

          {storedLocations.map((location) => {
            // ServiceArea coordinates are GeoJSON format: [lng, lat] → convert to [lat, lng] for Leaflet
            const positions: LatLonTuple[] = location.serviceArea.coordinates[0]
              .slice(0, -1) // drop the closing duplicate point
              .map(([lng, lat]) => [lat, lng]);

            return (
              <Polygon
                key={location.id}
                positions={positions}
                pathOptions={{
                  color: "#f59e0b",
                  fillColor: "#f59e0b",
                  fillOpacity: 0.15,
                  weight: 2,
                }}
              >
                <Popup>
                  <div style={{ fontSize: 13, lineHeight: 1.6 }}>
                    <strong>{location.flagEmoji} {location.city}</strong>
                    <br />
                    {location.state} · {location.country} ({location.countryCode})
                    <br />
                    🕐 {location.timeZone}
                    <br />
                    💰 {location.currencyCode} · 📞 {location.phoneCode}
                    <br />
                    👥 {location.population.toLocaleString()}
                  </div>
                </Popup>
              </Polygon>
            );
          })}

          {/* Single-click marker (when not drawing) */}
          {locationSelection && !isDrawing && !completedPolygon && (
            <Marker position={locationSelection} icon={icon}>
              <Popup>
                Lat: {selectPosition?.lat.toFixed(6)}, Lon: {selectPosition?.lon.toFixed(6)}
              </Popup>
            </Marker>
          )}

          {/* In-progress polygon points */}
          {isDrawing &&
            polygonPoints.map((point, idx) => (
              <Marker key={idx} position={point} icon={smallIcon}>
                <Popup>Point {idx + 1}</Popup>
              </Marker>
            ))}

          {/* In-progress preview line */}
          {isDrawing && polygonPoints.length >= 2 && (
            <Polyline
              positions={polygonPoints}
              pathOptions={{ color: "#2563eb", dashArray: "6 4", weight: 2 }}
            />
          )}

          {/* Completed polygon */}
          {completedPolygon && (
            <Polygon
              positions={completedPolygon}
              pathOptions={{ color: "#7c3aed", fillColor: "#7c3aed", fillOpacity: 0.25, weight: 2 }}
            />
          )}

          <ResetCenterView selectPosition={selectPosition} />
        </MapContainer>
      </div>
      {modal}
    </>
  );
}

// ─── Style Helpers ────────────────────────────────────────────────────────────

function btnStyle(bg: string, small = false): React.CSSProperties {
  return {
    background: bg,
    color: "#fff",
    border: "none",
    borderRadius: 6,
    padding: small ? "4px 10px" : "8px 14px",
    fontSize: small ? 11 : 13,
    fontWeight: 600,
    cursor: "pointer",
    boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
    whiteSpace: "nowrap",
  };
}

const infoStyle: React.CSSProperties = {
  background: "rgba(0,0,0,0.75)",
  color: "#fff",
  borderRadius: 6,
  padding: "8px 12px",
  fontSize: 12,
  lineHeight: 1.6,
};

const infoPanelStyle: React.CSSProperties = {
  position: "absolute",
  bottom: 10,
  right: 10,
  zIndex: 1000,
  background: "rgba(15, 15, 25, 0.88)",
  backdropFilter: "blur(6px)",
  color: "#e2e8f0",
  borderRadius: 10,
  padding: "12px 16px",
  boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
  minWidth: 220,
};

const tdLabelStyle: React.CSSProperties = {
  color: "#94a3b8",
  paddingRight: 12,
  paddingBottom: 4,
  fontWeight: 500,
  whiteSpace: "nowrap",
};

const tdValueStyle: React.CSSProperties = {
  color: "#f1f5f9",
  fontWeight: 600,
};
