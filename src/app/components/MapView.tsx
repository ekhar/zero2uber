"use client";
import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L, { Map as LeafletMap } from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default marker icon issues
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

// Custom minimal marker icon
const minimalIcon = new L.Icon({
  iconUrl: "/car.png",
  iconSize: [20, 20], // Smaller size for minimalism
  iconAnchor: [10, 10],
  popupAnchor: [0, -10],
  // Remove shadow for cleaner look
  // shadowUrl: null,
});

interface CarLocation {
  id: string;
  latitude: number;
  longitude: number;
}

interface MapViewProps {
  initialPosition: [number, number];
  mapStyle?: "minimal" | "light" | "dark";
}

const mapStyles = {
  minimal: {
    // Stadia Maps Alidade Smooth
    url: "https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png",
    attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>',
  },
  light: {
    // CartoDB Positron
    url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  },
  dark: {
    // CartoDB Dark Matter
    url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  },
};

const MinimalMapView: React.FC<MapViewProps> = ({
  initialPosition,
  mapStyle = "minimal",
}) => {
  const [cars, setCars] = useState<CarLocation[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const mapRef = useRef<LeafletMap | null>(null);

  const fetchCarLocations = async () => {
    try {
      const res = await fetch("/api/get_car_locations");
      if (res.ok) {
        const data: CarLocation[] = await res.json();
        setCars(data);
      }
    } catch (error) {
      console.error("Error fetching car locations:", error);
    }
  };

  useEffect(() => {
    fetchCarLocations();
    const interval = setInterval(fetchCarLocations, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery) return;

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`,
      );
      if (res.ok) {
        const results = await res.json();
        if (results.length > 0) {
          const { lat, lon } = results[0];
          mapRef.current?.setView([parseFloat(lat), parseFloat(lon)], 13);
        }
      }
    } catch (error) {
      console.error("Error searching location:", error);
    }
  };

  return (
    <div className="w-full mt-4">
      <form onSubmit={handleSearch} className="mb-2">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search location"
          className="p-2 w-4/5 border border-gray-200 rounded"
        />
        <button type="submit" className="p-2 ml-2 bg-gray-100 rounded">
          Search
        </button>
      </form>

      <MapContainer
        center={initialPosition}
        zoom={13}
        className="h-96 w-full rounded-lg"
        ref={mapRef}
        zoomControl={false} // Remove zoom controls for cleaner look
        attributionControl={false} // Remove attribution for cleaner look
      >
        <TileLayer
          url={mapStyles[mapStyle].url}
          attribution={mapStyles[mapStyle].attribution}
        />
        {cars.map((car) => (
          <Marker
            key={car.id}
            position={[car.latitude, car.longitude]}
            icon={minimalIcon}
          >
            <Popup className="text-sm">{car.id}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MinimalMapView;
