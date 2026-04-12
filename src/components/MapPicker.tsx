import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapPickerProps {
  onLocationSelect: (lat: number, lng: number) => void;
  initialLocation?: { lat: number; lng: number };
}

function LocationMarker({ onLocationSelect, initialLocation }: MapPickerProps) {
  const [position, setPosition] = useState<L.LatLng | null>(
    initialLocation ? new L.LatLng(initialLocation.lat, initialLocation.lng) : null
  );

  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });

  return position === null ? null : <Marker position={position}></Marker>;
}

export default function MapPicker({ onLocationSelect, initialLocation }: MapPickerProps) {

  // ✅ Default ke lokasi SMA Bintang Plus (Bandar Lampung)
  const defaultCenter = initialLocation || { lat: -5.391417, lng: 105.209778 };

  const [center, setCenter] = useState<{ lat: number, lng: number }>(defaultCenter);
  const [mapKey, setMapKey] = useState(0);

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCenter({ lat: latitude, lng: longitude });
          onLocationSelect(latitude, longitude);
          setMapKey(prev => prev + 1);
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Tidak dapat mengambil lokasi saat ini. Pastikan izin lokasi diberikan.");
        }
      );
    } else {
      alert("Geolocation tidak didukung oleh browser ini.");
    }
  };

  return (
    <div className="space-y-2">

      {/* INFO USER */}
      <p className="text-xs text-slate-500">
        Klik pada peta untuk menentukan lokasi alamat Anda
      </p>

      <button
        type="button"
        onClick={handleGetLocation}
        className="text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 py-1.5 px-3 rounded-md transition-colors flex items-center gap-2 border border-slate-300"
      >
        📍 Gunakan Lokasi Saat Ini
      </button>

      <div className="h-[300px] w-full rounded-lg overflow-hidden border border-slate-300 z-0 relative">
        <MapContainer
          key={mapKey}
          center={[center.lat, center.lng]}
          zoom={15}
          scrollWheelZoom={false}
          className="h-full w-full z-0"
        >
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker onLocationSelect={onLocationSelect} initialLocation={center} />
        </MapContainer>
      </div>
    </div>
  );
}
