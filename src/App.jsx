import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Create colored marker icons for different magnitudes
const getColorIcon = (magnitude) => {
    const color =
        magnitude >= 5 ? "red" : magnitude >= 3 ? "orange" : "green";
    return new L.Icon({
        iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${color}.png`,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
    });
};

export default function App() {
    const [earthquakes, setEarthquakes] = useState([]);
    const [minMagnitude, setMinMagnitude] = useState(0);

    // Fetch data from the USGS API once when the page loads
    useEffect(() => {
        fetch("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson")
            .then((res) => res.json())
            .then((data) => setEarthquakes(data.features))
            .catch((err) => console.error("Error fetching data:", err));
    }, []);

    return (
        <div style={{ height: "100vh", width: "100vw" }}>
            {/* Map container centered roughly at the equator */}
            <MapContainer center={[0, 0]} zoom={2} style={{ height: "100%", width: "100%" }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; OpenStreetMap contributors"
                />

                {/* Show markers filtered by minimum magnitude */}
                {earthquakes
                    .filter((eq) => eq.properties.mag >= minMagnitude)
                    .map((eq) => {
                        const [lon, lat] = eq.geometry.coordinates;
                        const mag = eq.properties.mag;
                        return (
                            <Marker
                                key={eq.id}
                                position={[lat, lon]}
                                icon={getColorIcon(mag)}
                            >
                                <Popup>
                                    <strong>{eq.properties.place}</strong>
                                    <br />
                                    Magnitude: {mag}
                                </Popup>
                            </Marker>
                        );
                    })}
            </MapContainer>

            {/* Magnitude filter */}
            <div style={{
                position: "absolute",
                top: 10,
                left: 10,
                background: "white",
                padding: "8px 12px",
                borderRadius: "8px",
                boxShadow: "0 0 6px rgba(0,0,0,0.3)"
            }}>
                <label>
                    Min Magnitude: {minMagnitude}
                    <input
                        type="range"
                        min="0"
                        max="8"
                        step="0.1"
                        value={minMagnitude}
                        onChange={(e) => setMinMagnitude(parseFloat(e.target.value))}
                    />
                </label>
            </div>

            {/* Legend */}
            <div style={{
                position: "absolute",
                bottom: 10,
                left: 10,
                background: "white",
                padding: "8px 12px",
                borderRadius: "8px",
                boxShadow: "0 0 6px rgba(0,0,0,0.3)"
            }}>
                <strong>Legend</strong>
                <div><span style={{ color: "green" }}>●</span> Magnitude &lt; 3</div>
                <div><span style={{ color: "orange" }}>●</span> 3 ≤ Magnitude &lt; 5</div>
                <div><span style={{ color: "red" }}>●</span> Magnitude ≥ 5</div>
            </div>
        </div>
    );
}
