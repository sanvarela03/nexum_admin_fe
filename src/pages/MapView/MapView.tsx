import { useState, useEffect } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon from "../../assets/placeholder.png";

import { useMapEvents } from "react-leaflet";

function LocationSelector({ setSelectPosition }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;

      setSelectPosition({
        lat,
        lon: lng,
      });
    },
  });

  return null;
}

const icon = L.icon({
  iconUrl: markerIcon,
  iconSize: [38, 38],
});

const position: [number, number] = [4.7110, -74.0721];

function ResetCenterView(props) {
  const { selectPosition } = props;
  const map = useMap();

  useEffect(() => {
    if (selectPosition) {
      map.setView(
        L.latLng(selectPosition?.lat, selectPosition?.lon),
        map.getZoom(),
        {
          animate: true
        }
      )
    }
  }, [selectPosition]);

  return null;
}

export default function Maps() {
  const [selectPosition, setSelectPosition] = useState<{
    lat: number;
    lon: number;
  } | null>(null);

  const locationSelection: [number, number] | null = selectPosition
    ? [selectPosition.lat, selectPosition.lon]
    : null;

  return (
    <MapContainer
      center={position}
      zoom={8}
      style={{ width: "100%", height: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://api.maptiler.com/maps/base-v4/{z}/{x}/{y}.png?key=otUt0yECro6sRHU282a9"
      />
      <LocationSelector setSelectPosition={setSelectPosition} />
      {locationSelection && (
        <Marker position={locationSelection} icon={icon}>
          <Popup>
            Lat: {selectPosition?.lat}, Lon: {selectPosition?.lon}
          </Popup>
        </Marker>
      )}
      <ResetCenterView selectPosition={selectPosition} />
    </MapContainer>
  );
}