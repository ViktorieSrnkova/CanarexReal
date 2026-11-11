import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-gesture-handling/dist/leaflet-gesture-handling.css";
import { GestureHandling } from "leaflet-gesture-handling";
import L from "leaflet";
import { useT } from "../../i18n";

L.Map.addInitHook("addHandler", "gestureHandling", GestureHandling);

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
  contact?: boolean;
};

function Map({ lat, lng, zoom, height, contact }: Props) {
  const position: [number, number] = [lat, lng];
  const t = useT();

  return (
    <MapContainer
      center={position}
      zoom={zoom}
      style={{
        height,
        width: "100%",
        position: contact ? "absolute" : "relative",
        left: contact ? 0 : "unset",
      }}
      scrollWheelZoom={false}
      gestureHandling
      gestureHandlingOptions={{
        duration: 3000,
        text: {
          touch: t("map.gesture.touch"),
          scroll: t("map.gesture.scroll"),
          scrollMac: t("map.gesture.scrollMac"),
        },
      }}
      className="map"
    >
      <TileLayer
        attribution="&copy; OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        detectRetina={true}
      />

      <Marker position={position} icon={redIcon} />
    </MapContainer>
  );
}

export default Map;
