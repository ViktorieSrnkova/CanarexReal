import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import type { MarkerData } from "../../types/map";
import { formatMoneyEUR } from "../../utils/formatting";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";

type Props = {
  markers: MarkerData[];
  onMarkerClick?: (id: number) => void;
  selectedId: number | null;
};

export default function SearchMap({
  markers,
  onMarkerClick,
  selectedId,
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
      center={[28.2, -16.65]}
      zoom={10}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
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
