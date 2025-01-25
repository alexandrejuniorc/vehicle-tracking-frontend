"use client";

import { useMap } from "@/hooks/use-map.hook";
import { useRef } from "react";

export function MapDriver() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const map = useMap(mapContainerRef);

  return <div className="h-full w-2/3" ref={mapContainerRef} />;
}
