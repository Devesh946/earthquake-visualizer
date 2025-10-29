import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

function App() {
  const [earthquakes, setEarthquakes] = useState([]);

  useEffect(() => {
    fetch("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson")
      .then((res) => res.json())
      .then((data) => setEarthquakes(data.features || []))
      .catch((err) => console.error("Error fetching earthquake data:", err));
  }, []);

  const icon = new L.Icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  return (
    <div className="h-screen w-screen">
          <MapContainer center={[20, 0]} zoom={2} className="leaflet-container">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="© OpenStreetMap contributors"
        />
        {earthquakes.map((eq) => (
          <Marker
            key={eq.id}
            position={[eq.geometry.coordinates[1], eq.geometry.coordinates[0]]}
            icon={icon}
          >
            <Popup>
              <strong>{eq.properties.place}</strong><br />
              Magnitude: {eq.properties.mag}<br />
              Time: {new Date(eq.properties.time).toLocaleString()}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default App;
