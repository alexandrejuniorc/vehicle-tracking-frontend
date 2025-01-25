"use client";

import { useMap } from "@/hooks/use-map.hook";
import { useRef } from "react";

export default function AdminPage() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const map = useMap(mapContainerRef);

  return <div className="h-full w-full" ref={mapContainerRef} />;
}
