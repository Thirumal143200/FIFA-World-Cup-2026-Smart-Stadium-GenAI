// src/components/ui/LeafletMap.tsx
// Leaflet Map Component — renders interactive OpenStreetMap views for navigation and heatmaps
'use client';

import { useEffect, useRef } from 'react';
import type { Map } from 'leaflet';
import { stadiums } from '@/data/stadiums';

interface LeafletMapProps {
  lat: number;
  lng: number;
  zoom?: number;
  stadiumId?: string;
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
  stadiumId,
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

      // Custom div icons helper
      const createCustomIcon = (emoji: string, bgColor: string) => {
        return L.divIcon({
          html: `<div style="background-color: ${bgColor}; border: 2px solid white; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; font-size: 16px; box-shadow: 0 2px 5px rgba(0,0,0,0.3); text-shadow: 1px 1px 0 rgba(0,0,0,0.2);">${emoji}</div>`,
          className: 'custom-map-icon',
          iconSize: [30, 30],
          iconAnchor: [15, 15],
          popupAnchor: [0, -15],
        });
      };

      // Add main Stadium marker
      L.marker([lat, lng], {
        icon: createCustomIcon('🏟️', '#56004F'),
      })
        .addTo(map)
        .bindPopup(`<b>Stadium Center</b><br>Lat: ${lat}<br>Lng: ${lng}`)
        .openPopup();

      // If stadiumId is provided, render all facilities and entry gates
      if (stadiumId) {
        const stadium = stadiums.find((s) => s.id === stadiumId);
        if (stadium) {
          // Render Gates
          stadium.zones
            .filter((z) => z.type === 'gate' && z.coordinates)
            .forEach((gate) => {
              L.marker([gate.coordinates.lat, gate.coordinates.lng], {
                icon: createCustomIcon('🚪', '#002855'),
              })
                .addTo(map)
                .bindPopup(`<b>${gate.name} (Entry Gate)</b><br>Capacity: ${gate.capacity}<br>Status: ${gate.status}`);
            });

          // Render Facilities
          stadium.facilities.forEach((fac) => {
            const zone = stadium.zones.find((z) => z.id === fac.zoneId);
            // Apply slight random offset to prevent facility icons from stacking on top of each other in the same zone
            const offsetLat = (Math.random() * 0.0006) - 0.0003;
            const offsetLng = (Math.random() * 0.0006) - 0.0003;
            const facLat = (zone?.coordinates?.lat ?? lat) + offsetLat;
            const facLng = (zone?.coordinates?.lng ?? lng) + offsetLng;

            // Select emoji/color based on type
            let emoji = 'ℹ️';
            let color = '#00A5E0'; // FIFA sky blue

            if (fac.type === 'first-aid' || fac.type === 'medical') {
              emoji = '🏥';
              color = '#E4002B'; // FIFA red
            } else if (fac.type === 'food') {
              emoji = '🍔';
              color = '#C8A951'; // FIFA gold
            } else if (fac.type === 'merchandise') {
              emoji = '🏪';
              color = '#56004F'; // FIFA purple
            } else if (fac.type === 'sensory-room') {
              emoji = '🧠';
              color = '#009B8D'; // FIFA teal
            } else if (fac.type === 'charging-station') {
              emoji = '⚡';
              color = '#10b981';
            } else if (fac.type === 'family-zone') {
              emoji = '👨‍👩‍👧‍👦';
              color = '#ec4899';
            }

            L.marker([facLat, facLng], {
              icon: createCustomIcon(emoji, color),
            })
              .addTo(map)
              .bindPopup(`<b>${fac.name}</b><br>Type: <span style="text-transform: capitalize;">${fac.type.replace('-', ' ')}</span><br>Location: ${fac.location}`);
          });
        }
      }

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
  }, [lat, lng, zoom, stadiumId, heatmapZones, navigationPath]);

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
