import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import type { MarkerData } from "../../types/map";
import { formatMoneyEUR } from "../../utils/formatting";
import "leaflet/dist/leaflet.css";
import "../../styles/markercluster.css";

type Props = {
  markers: MarkerData[];
  onMarkerClick?: (id: number) => void;
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

export default function SearchMap({
  markers,
  onMarkerClick,
  selectedId,
  center,
  zoom,
  onMapMove,
}: Props) {
  const createIcon = (price: number, active: boolean) => {
    const longClass = price.toString().length > 6 ? "long-price" : "";

    return L.divIcon({
      className: "",
      html: `<div class="price-label number ${longClass}  ${active ? "active" : ""}">${formatMoneyEUR(price)}</div>`,
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
            key={m.id}
            position={[m.position.lat, m.position.lng]}
            icon={createIcon(m.price, m.id === selectedId)}
            eventHandlers={{
              click: () => onMarkerClick?.(m.id),
            }}
          />
        ))}
      </MarkerClusterGroup>
    </MapContainer>
  );
}
