import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { GestureHandling } from "leaflet-gesture-handling";

import type { MarkerData } from "../../types/map";
import { formatMoneyEUR } from "../../utils/formatting";

import "leaflet/dist/leaflet.css";
import "leaflet-gesture-handling/dist/leaflet-gesture-handling.css";
import "../../styles/markercluster.css";
import { useT } from "../../i18n";
import { useSyncExternalStore } from "react";

L.Map.addInitHook("addHandler", "gestureHandling", GestureHandling);

type Props = {
  markers: MarkerData[];
  onMarkerClick?: (index: number) => void;
  selectedId: number | null;
  center: L.LatLngExpression;
  zoom: number;
  onMapMove?: (center: L.LatLng, zoom: number) => void;
};

function MapSync({
  onMove,
}: {
  onMove?: (center: L.LatLng, zoom: number) => void;
}) {
  useMapEvents({
    moveend: (e) => {
      const map = e.target;
      onMove?.(map.getCenter(), map.getZoom());
    },
    zoomend: (e) => {
      const map = e.target;
      onMove?.(map.getCenter(), map.getZoom());
    },
  });

  return null;
}
const mobileQuery = window.matchMedia("(pointer: coarse), (max-width: 768px)");

function subscribe(callback: () => void) {
  mobileQuery.addEventListener("change", callback);
  return () => mobileQuery.removeEventListener("change", callback);
}

function getIsMobile() {
  return mobileQuery.matches;
}

export default function SearchMap({
  markers,
  onMarkerClick,
  selectedId,
  center,
  zoom,
  onMapMove,
}: Props) {
  const isMobile = useSyncExternalStore(subscribe, getIsMobile, () => false);
  const t = useT();

  const createIcon = (price: number, active: boolean) => {
    const longClass = price.toString().length > 6 ? "long-price" : "";

    return L.divIcon({
      className: "",
      html: `<div class="price-label number ${longClass} ${active ? "active" : ""}">${formatMoneyEUR(price)}</div>`,
      iconSize: [50, 30],
      iconAnchor: [25, 15],
    });
  };

  return (
    <MapContainer
      key={selectedId}
      center={center}
      zoom={zoom}
      style={{ height: "100%", width: "100%" }}
      gestureHandling={isMobile}
      gestureHandlingOptions={{
        duration: 3000,
        text: {
          touch: t("map.gesture.touch"),
          scroll: t("map.gesture.scroll"),
          scrollMac: t("map.gesture.scrollMac"),
        },
      }}
    >
      <MapSync onMove={onMapMove} />

      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        detectRetina={true}
      />

      <MarkerClusterGroup
        chunkedLoading
        maxClusterRadius={window.innerWidth <= 600 ? 40 : 60}
      >
        {markers.map((m) => (
          <Marker
            key={m.index}
            position={[m.position.lat, m.position.lng]}
            icon={createIcon(m.price, m.index === selectedId)}
            eventHandlers={{
              click: () => onMarkerClick?.(m.index),
            }}
          />
        ))}
      </MarkerClusterGroup>
    </MapContainer>
  );
}
