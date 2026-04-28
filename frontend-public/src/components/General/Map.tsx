import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const redIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
type Props = {
  lat: number;
  lng: number;
  zoom: number;
  height: string;
};

function Map({ lat, lng, zoom, height }: Props) {
  const position: [number, number] = [lat, lng];

  return (
    <MapContainer
      center={position}
      zoom={zoom}
      style={{ height: height, width: "100%" }}
      scrollWheelZoom={false}
      className="map"
    >
      <TileLayer
        attribution="&copy; OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Marker position={position} icon={redIcon} />
    </MapContainer>
  );
}

export default Map;
