// components/real-world-map.tsx
"use client";

import { PersonWithTime } from "@/lib/types";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  Graticule,
  Line,
} from "react-simple-maps";
import { useState } from "react";

interface RealWorldMapProps {
  people: PersonWithTime[];
}

// GeoJSON URL for world map (high quality)
const geoUrl =
  "https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-50m.json";

// Coordinates for each location [longitude, latitude]
const locationCoordinates: Record<string, [number, number]> = {
  "America/New_York": [-81.3792, 28.5383], // Orlando
  "Europe/London": [-0.1278, 51.5074], // London
  "Europe/Berlin": [13.405, 52.52], // Berlin
  "Asia/Tokyo": [139.6917, 35.6895], // Tokyo
  "Asia/Seoul": [126.978, 37.5665], // Seoul
};

export function RealWorldMap({ people }: RealWorldMapProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const statusColors = {
    awake: "#22c55e",
    waking: "#fbbf24",
    asleep: "#64748b",
  };

  const statusGlows = {
    awake: "0, 255, 100",
    waking: "255, 200, 50",
    asleep: "100, 116, 139",
  };

  // Sort people to bring hovered item to the front for rendering
  const sortedPeople = [...people].sort((a, b) => {
    if (hoveredId === a.id) return 1;
    if (hoveredId === b.id) return -1;
    return 0;
  });

  return (
    <div className="relative w-full rounded-xl bg-[#020617] border border-white/10 overflow-hidden shadow-2xl">
      {/* Map Container */}
      <div className="h-[260px] md:h-[400px] w-full overflow-hidden">
        <div className="relative w-full h-full">
          <ComposableMap
            projection="geoMercator"
            projectionConfig={{
              scale: 140,
              center: [20, 15],
            }}
            width={800}
            height={400}
            className="w-auto h-full"
            style={{
              background: "linear-gradient(135deg, #0a1628 0%, #020617 100%)",
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              minWidth: "100%",
              minHeight: "100%",
            }}
          >
            {/* Graticule (latitude/longitude grid) */}
            <Graticule stroke="rgba(59, 130, 246, 0.08)" strokeWidth={0.3} />

            {/* World Countries */}
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill="#1e2a3e"
                    stroke="#3b82f6"
                    strokeWidth={0.3}
                    strokeOpacity={0.3}
                    style={{
                      default: { outline: "none" },
                      hover: { fill: "#2a3a50", outline: "none" },
                      pressed: { outline: "none" },
                    }}
                  />
                ))
              }
            </Geographies>

            {/* Equator Line */}
            <Line
              from={[-180, 0]}
              to={[180, 0]}
              stroke="rgba(234, 179, 8, 0.15)"
              strokeWidth={0.4}
              strokeDasharray="3,3"
            />

            {/* People Markers - Vertical Layout: Name → Time/Date → Dot */}
            {sortedPeople.map((person) => {
              const coords = locationCoordinates[person.timezone];
              if (!coords) return null;

              const color = statusColors[person.status];
              const glow = statusGlows[person.status];
              const isAwake = person.status === "awake";
              const isWaking = person.status === "waking";
              const isHovered = hoveredId === person.id;

              // Vertical spacing: Name at top, then time, then dot at bottom
              const nameYOffset = -18;
              const timeYOffset = -9;
              const dotYOffset = 0;

              return (
                <g
                  key={person.id}
                  onMouseEnter={() => setHoveredId(person.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  style={{
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    filter: isHovered
                      ? `drop-shadow(0 0 12px rgba(${glow}, 0.8))`
                      : "none",
                    zIndex: isHovered ? 100 : 10,
                  }}
                >
                  {/* NAME - Top */}
                  <Marker coordinates={[coords[0], coords[1] + nameYOffset]}>
                    <text
                      textAnchor="middle"
                      y="0"
                      fontSize={isHovered ? "12" : "10"}
                      fill={isHovered ? "#ffffff" : "#cbd5e1"}
                      fontFamily="system-ui, sans-serif"
                      fontWeight={isHovered ? "700" : "600"}
                      className="drop-shadow-sm"
                      style={{ transition: "all 0.2s ease" }}
                    >
                      {person.name}
                    </text>
                  </Marker>

                  {/* TIME & DATE - Middle */}
                  <Marker coordinates={[coords[0], coords[1] + timeYOffset]}>
                    {/* Background pill */}
                    <rect
                      x={isHovered ? "-52" : "-46"}
                      y={isHovered ? "-12" : "-11"}
                      width={isHovered ? "104" : "92"}
                      height={isHovered ? "24" : "22"}
                      rx="4"
                      fill="rgba(0, 0, 0, 0.85)"
                      stroke={color}
                      strokeWidth={isHovered ? "1.2" : "0.8"}
                      opacity="0.95"
                      style={{ transition: "all 0.2s ease" }}
                    />
                    <text
                      textAnchor="middle"
                      y={isHovered ? "-3" : "-2.5"}
                      fontSize={isHovered ? "11" : "9"}
                      fill="#f1f5f9"
                      fontFamily="monospace"
                      fontWeight="bold"
                      style={{ transition: "all 0.2s ease" }}
                    >
                      {person.formattedTime}
                    </text>
                    <text
                      textAnchor="middle"
                      y={isHovered ? "7" : "6"}
                      fontSize={isHovered ? "8" : "7"}
                      fill="#94a3b8"
                      fontFamily="monospace"
                      style={{ transition: "all 0.2s ease" }}
                    >
                      {person.formattedDate}
                    </text>
                  </Marker>

                  {/* DOT - Bottom */}
                  <Marker coordinates={[coords[0], coords[1] + dotYOffset]}>
                    {/* Enhanced glow effect */}
                    <circle
                      r={isHovered ? 18 : isAwake ? 12 : 10}
                      fill={color}
                      opacity={isHovered ? 0.25 : 0.15}
                      style={{ transition: "all 0.2s ease" }}
                    />

                    {/* Pulsing ring for awake */}
                    {isAwake && !isHovered && (
                      <circle
                        r={6}
                        fill="none"
                        stroke={color}
                        strokeWidth={1.2}
                        opacity={0.6}
                      >
                        <animate
                          attributeName="r"
                          from="6"
                          to="16"
                          dur="1.5s"
                          repeatCount="indefinite"
                        />
                        <animate
                          attributeName="opacity"
                          from="0.6"
                          to="0"
                          dur="1.5s"
                          repeatCount="indefinite"
                        />
                      </circle>
                    )}

                    {/* Main dot */}
                    <circle
                      r={isHovered ? 10 : isAwake ? 7 : isWaking ? 6 : 5.5}
                      fill={color}
                      stroke="#ffffff"
                      strokeWidth={isHovered ? 2 : 1.5}
                      className="cursor-pointer transition-all"
                      style={{
                        transition: "all 0.2s ease",
                        filter: `drop-shadow(0 0 ${isHovered ? "8px" : "4px"} ${color})`,
                      }}
                    />

                    {/* Inner dot for awake */}
                    {isAwake && (
                      <circle
                        r={isHovered ? 3.5 : 2.5}
                        fill="#ffffff"
                        opacity={isHovered ? 1 : 0.9}
                        style={{ transition: "all 0.2s ease" }}
                      />
                    )}

                    {/* Extra ring for waking status when hovered */}
                    {isWaking && isHovered && (
                      <circle
                        r={12}
                        fill="none"
                        stroke={color}
                        strokeWidth={1}
                        opacity={0.4}
                      />
                    )}

                    {/* Location label on hover - appears below dot */}
                    {isHovered && (
                      <text
                        x="0"
                        y="14"
                        textAnchor="middle"
                        fontSize="7"
                        fill="#64748b"
                        fontFamily="monospace"
                      >
                        {person.location}
                      </text>
                    )}
                  </Marker>
                </g>
              );
            })}
          </ComposableMap>
        </div>
      </div>

      {/* Legend Overlay */}
      <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-sm rounded-lg px-3 py-1.5 flex gap-3 text-[10px] font-medium border border-white/15 z-10">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_4px_#22c55e]" />
          <span className="text-slate-300 text-[10px]">Awake</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          <span className="text-slate-300 text-[10px]">Waking</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-500" />
          <span className="text-slate-300 text-[10px]">Asleep</span>
        </div>
      </div>

      {/* Map Title */}
      <div className="absolute top-2 left-2 from-slate-800/40 via-slate-400/20 to-slate-90-40 bg-linear-to-br  border-1 border-slate-600/40  backdrop-blur-sm rounded px-2 py-1 z-10">
        <span className="text-[9px] text-slate-400 font-mono font-semibold flex bg-transparent justify-center items-center rounded-xl ">
          🌍 LIVE WORLD MAP
        </span>
      </div>
    </div>
  );
}
