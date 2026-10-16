"use client";

import "leaflet/dist/leaflet.css";
import { useEffect, useRef } from "react";
import type { GeoJSON as LeafletGeoJSON, Map as LeafletMap } from "leaflet";

export type ServiceStatus = "Active" | "Monitoring" | "Normal";

type BarangayMapProps = {
  onBarangayClick?: (barangayName: string) => void;
  /** exact brgy_name (as in the GeoJSON) -> status */
  statusByBarangay?: Record<string, ServiceStatus>;
};

const STATUS_FILL: Record<ServiceStatus | "None", string> = {
  Active: "#ef4444",
  Monitoring: "#facc15",
  Normal: "#22c55e",
  None: "#94a3b8",
};

export default function BarangayMap({
  onBarangayClick,
  statusByBarangay = {},
}: BarangayMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const layerRef = useRef<LeafletGeoJSON | null>(null);

  // Keep the latest props in refs so the map is created ONCE and never
  // torn down just because the parent re-rendered with a new callback.
  const clickRef = useRef(onBarangayClick);
  const statusRef = useRef(statusByBarangay);
  clickRef.current = onBarangayClick;
  statusRef.current = statusByBarangay;

  const fillFor = (name: string) =>
    STATUS_FILL[statusRef.current[name] ?? "None"];

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let cancelled = false;
    let map: LeafletMap | null = null;

    (async () => {
      const L = await import("leaflet");
      // Strict Mode / fast navigation: effect may already be cleaned up.
      if (cancelled) return;

      map = L.map(container, {
        center: [14.393, 120.852],
        zoom: 14,
        minZoom: 12,
        maxZoom: 18,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
        maxZoom: 19,
      }).addTo(map);

      try {
        const res = await fetch("/data/tanza-barangays.geojson");
        if (!res.ok) throw new Error(`GeoJSON failed to load (${res.status})`);
        const data = await res.json();
        if (cancelled) return;

        const baseStyle = (feature?: GeoJSON.Feature) => ({
          color: "#475569",
          weight: 1,
          fillColor: fillFor(feature?.properties?.brgy_name ?? ""),
          fillOpacity: 0.35,
        });

        const layer: LeafletGeoJSON = L.geoJSON(data, {
          style: baseStyle,
          onEachFeature: (feature, l) => {
            const name: string = feature.properties?.brgy_name ?? "Barangay";

            l.bindTooltip(name, {
              permanent: true,
              direction: "center",
              className: "barangay-label",
              opacity: 0.9,
            });

            l.on({
              mouseover: (e) => {
                e.target.setStyle({ weight: 2, color: "#1d4ed8", fillOpacity: 0.55 });
                e.target.bringToFront();
              },
              mouseout: (e) => layer.resetStyle(e.target),
              click: () => clickRef.current?.(name),
            });
          },
        }).addTo(map);

        layerRef.current = layer;
        map.fitBounds(layer.getBounds());
      } catch (err) {
        console.error("GeoJSON error:", err);
      }
    })();

    return () => {
      cancelled = true;
      layerRef.current = null;
      map?.remove();
    };
  }, []);

  // Re-colour polygons when statuses change (no map rebuild).
  useEffect(() => {
    layerRef.current?.setStyle((feature) => ({
      fillColor: fillFor(feature?.properties?.brgy_name ?? ""),
    }));
  }, [statusByBarangay]);

  return <div ref={containerRef} className="h-full w-full" />;
}
