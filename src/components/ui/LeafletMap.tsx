// src/components/ui/LeafletMap.tsx
// Leaflet Map Component — renders interactive OpenStreetMap views for navigation and heatmaps
'use client';

import { useEffect, useRef } from 'react';
import type { Map } from 'leaflet';

interface LeafletMapProps {
  lat: number;
  lng: number;
  zoom?: number;
  heatmapZones?: Array<{
    name: string;
    latOffset: number;
    lngOffset: number;
    density: number;
  }>;
  navigationPath?: {
    fromName: string;
    toName: string;
  };
}

export default function LeafletMap({
  lat,
  lng,
  zoom = 16,
  heatmapZones = [],
  navigationPath,
}: LeafletMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    let mapInstance: Map | null = null;

    async function initMap() {
      // Dynamic import to prevent SSR 'window is not defined' errors
      const L = await import('leaflet');

      // Setup default marker icon assets manually in leaflet to prevent webpack import failures
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
      });

      // Clear container in case of multiple mounts in strict mode
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
      }

      const map = L.map(mapContainerRef.current!).setView([lat, lng], zoom);
      mapInstance = map;
      mapInstanceRef.current = map;

      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      // Add main Stadium marker
      L.marker([lat, lng])
        .addTo(map)
        .bindPopup(`<b>Stadium Center</b><br>Lat: ${lat}<br>Lng: ${lng}`)
        .openPopup();

      // If rendering heatmap zones (e.g. on crowd flow intelligence dashboards)
      if (heatmapZones && heatmapZones.length > 0) {
        heatmapZones.forEach((zone) => {
          const zoneLat = lat + zone.latOffset;
          const zoneLng = lng + zone.lngOffset;
          const color =
            zone.density > 0.8
              ? '#ef4444' // red
              : zone.density > 0.5
              ? '#f59e0b' // yellow
              : '#10b981'; // green

          L.circle([zoneLat, zoneLng], {
            color,
            fillColor: color,
            fillOpacity: 0.45,
            radius: 80,
          })
            .addTo(map)
            .bindPopup(`<b>${zone.name}</b><br>Density: ${Math.round(zone.density * 100)}%`);
        });
      }

      // If rendering directions/routing paths
      if (navigationPath) {
        const fromLat = lat + 0.0015;
        const fromLng = lng - 0.0015;
        const toLat = lat - 0.001;
        const toLng = lng + 0.001;

        // Draw markers for start and finish
        L.marker([fromLat, fromLng])
          .addTo(map)
          .bindPopup(`<b>Start: ${navigationPath.fromName}</b>`);

        L.marker([toLat, toLng])
          .addTo(map)
          .bindPopup(`<b>End: ${navigationPath.toName}</b>`);

        // Draw polyline connecting start and finish
        L.polyline([[fromLat, fromLng], [lat, lng], [toLat, toLng]], {
          color: '#56004F', // FIFA Purple
          weight: 5,
          opacity: 0.7,
        }).addTo(map);
      }
    }

    initMap();

    return () => {
      if (mapInstance) {
        mapInstance.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [lat, lng, zoom, heatmapZones, navigationPath]);

  return (
    <div className="w-full h-full relative">
      <div ref={mapContainerRef} className="w-full h-full min-h-[300px]" style={{ zIndex: 1 }} />
      {/* Fallback styling for leaflet loading state */}
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
        integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19yy3g=="
        crossOrigin=""
      />
    </div>
  );
}
