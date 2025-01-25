import { Map } from "@/utils/map";
import { Loader } from "@googlemaps/js-api-loader";
import { useEffect, useState } from "react";
import { getCurrentPosition } from "./geolocation.hook";

export function useMap(containerRef: React.RefObject<HTMLDivElement>) {
  const [map, setMap] = useState<Map>();

  useEffect(() => {
    (async () => {
      const loader = new Loader({
        apiKey: process.env.GOOGLE_MAPS_API_KEY as string,
        libraries: ["routes", "geometry", "marker"],
      });

      const [, , , position] = await Promise.all([
        loader.importLibrary("routes"),
        loader.importLibrary("geometry"),
        loader.importLibrary("marker"),
        getCurrentPosition({ enableHighAccuracy: true }),
      ]);

      const map = new Map(containerRef.current, {
        mapId: "8e0a97af9386fef", // fullcycle theme
        zoom: 15,
        center: position,
      });

      setMap(map);
    })();
  }, [containerRef]);

  return map;
}
