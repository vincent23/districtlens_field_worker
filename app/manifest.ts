import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "DistrictLens Field Worker",
    short_name: "DistrictLens",
    description: "DistrictLens Field Worker Portal",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#002d52",
    orientation: "portrait",
    icons: [
      {
        src: "/Icons/districtlens-icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/Icons/districtlens-icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}