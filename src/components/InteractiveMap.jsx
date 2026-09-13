import React, { useState } from 'react';

export default function InteractiveMap({
  facility,
  currentWalk,
  currentDist,
  userLocation,
  destinationName,
  allFacilities = [],
  onSelectFacility,
  isFullView = false
}) {
  const [hoveredFacility, setHoveredFacility] = useState(null);

  // Determine user's SVG coordinates
  const getUserSvgCoords = () => {
    if (userLocation?.coords?.svgX && userLocation?.coords?.svgY) {
      return { x: userLocation.coords.svgX, y: userLocation.coords.svgY };
    }

    const locName = userLocation?.name || destinationName || 'Bhavnagar Central Market';
    const landmarkSvgMap = {
      'Bhavnagar Central Market': { x: 360, y: 140 },
      'Bhavnagar Railway Station': { x: 140, y: 60 },
      'Kalanala': { x: 210, y: 120 },
      'Nilambaug': { x: 270, y: 260 },
      'Takhteshwar': { x: 340, y: 270 }
    };
    return landmarkSvgMap[locName] || { x: 360, y: 140 };
  };

  const userSvg = getUserSvgCoords();
  const facSvg = facility?.svgCoords || { x: 120, y: 210 };
  const userLat = userLocation?.coords?.lat ?? 21.7645;
  const userLng = userLocation?.coords?.lng ?? 72.1519;

  // Intermediate midpoint for orthogonal walking route
  const midX = Math.round((userSvg.x + facSvg.x) / 2);

  const containerHeight = isFullView ? 'h-[440px] sm:h-[500px]' : 'h-72';

  return (
    <div className={`relative w-full ${containerHeight} rounded-2xl bg-surface-container-low overflow-hidden border border-surface-container shadow-xs select-none group`}>
      <svg className="w-full h-full" viewBox="0 0 500 320" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="city-grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#dce9ff" strokeWidth="0.5" opacity="0.35"/>
          </pattern>
          <linearGradient id="route-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0051d5" />
            <stop offset="100%" stopColor={facility?.ownershipType === 'private' ? '#7e22ce' : '#006948'} />
          </linearGradient>
        </defs>

        {/* Base ground & grid pattern */}
        <rect width="100%" height="100%" fill="#eff4ff"/>
        <rect width="100%" height="100%" fill="url(#city-grid)"/>

        {/* Urban city blocks & civic zones */}
        <rect x="25" y="25" width="80" height="60" rx="6" fill="#dce9ff"/>
        <rect x="130" y="20" width="110" height="70" rx="6" fill="#dce9ff"/>
        <rect x="265" y="25" width="120" height="60" rx="6" fill="#dce9ff"/>
        <rect x="30" y="115" width="70" height="120" rx="6" fill="#dce9ff"/>
        <rect x="280" y="115" width="105" height="110" rx="6" fill="#dce9ff"/>
        <rect x="410" y="105" width="75" height="140" rx="6" fill="#dce9ff"/>
        <rect x="130" y="225" width="115" height="75" rx="6" fill="#dce9ff"/>
        <rect x="270" y="250" width="115" height="55" rx="6" fill="#dce9ff"/>

        {/* Main Arterial Road 1: Station Road / High Court Road */}
        <path d="M-10 100 L 510 100" stroke="#bccac0" strokeWidth="26" strokeLinecap="round"/>
        <path d="M-10 100 L 510 100" stroke="#ffffff" strokeWidth="20" strokeLinecap="round"/>
        <path d="M-10 100 L 510 100" stroke="#6d7a72" strokeWidth="1.5" strokeDasharray="6,6" opacity="0.6"/>

        {/* Main Arterial Road 2: MG Road (Diagonal Central Corridor) */}
        <path d="M 115 -10 L 115 330" stroke="#bccac0" strokeWidth="30" strokeLinecap="round"/>
        <path d="M 115 -10 L 115 330" stroke="#ffffff" strokeWidth="24" strokeLinecap="round"/>
        <path d="M 115 -10 L 115 330" stroke="#6d7a72" strokeWidth="1.5" strokeDasharray="6,6" opacity="0.6"/>

        {/* Connector Road: Vegetable Market Lane */}
        <path d="M 115 210 L 400 210" stroke="#bccac0" strokeWidth="20" strokeLinecap="round"/>
        <path d="M 115 210 L 400 210" stroke="#ffffff" strokeWidth="14" strokeLinecap="round"/>

        {/* South Arterial: Palace & Takhteshwar Bypass */}
        <path d="M 50 270 L 470 270" stroke="#bccac0" strokeWidth="18" strokeLinecap="round"/>
        <path d="M 50 270 L 470 270" stroke="#ffffff" strokeWidth="12" strokeLinecap="round"/>

        {/* Road Labels */}
        <text x="122" y="55" fill="#3d4a42" fontFamily="Inter" fontSize="8.5" fontWeight="700" letterSpacing="1">M.G. ROAD CORRIDOR</text>
        <text x="310" y="96" fill="#3d4a42" fontFamily="Inter" fontSize="8.5" fontWeight="700" letterSpacing="1">STATION ROAD</text>
        <text x="160" y="206" fill="#3d4a42" fontFamily="Inter" fontSize="8" fontWeight="600">OLD VEG MARKET LANE</text>
        <text x="150" y="266" fill="#3d4a42" fontFamily="Inter" fontSize="7.5" fontWeight="600">PALACE CIRCLE BYPASS</text>

        {/* Other Facilities Dots on Citywide Map */}
        {allFacilities.map(otherFac => {
          if (!otherFac.svgCoords || otherFac.id === facility?.id) return null;
          const isPrivate = otherFac.ownershipType === 'private';
          const isFull = otherFac.status === 'full';
          const dotColor = isFull ? '#dc2626' : (isPrivate ? '#7e22ce' : '#006948');

          return (
            <g
              key={otherFac.id}
              transform={`translate(${otherFac.svgCoords.x}, ${otherFac.svgCoords.y})`}
              className="cursor-pointer transition-transform hover:scale-125"
              onClick={() => onSelectFacility && onSelectFacility(otherFac.id)}
              onMouseEnter={() => setHoveredFacility(otherFac)}
              onMouseLeave={() => setHoveredFacility(null)}
            >
              <circle cx="0" cy="0" r="7" fill={dotColor} stroke="#ffffff" strokeWidth="1.5" opacity="0.9"/>
              <text x="0" y="2.5" fill="#ffffff" fontFamily="Plus Jakarta Sans" fontSize="6.5" fontWeight="800" textAnchor="middle">
                {otherFac.shortCode || 'P'}
              </text>
            </g>
          );
        })}

        {/* Dynamic Walking Route Trajectory from GPS Location to Selected Facility */}
        <path
          d={`M ${userSvg.x} ${userSvg.y} L ${midX} ${userSvg.y} L ${midX} ${facSvg.y} L ${facSvg.x} ${facSvg.y}`}
          fill="none"
          stroke="url(#route-gradient)"
          strokeWidth="3.5"
          strokeDasharray="6,6"
          strokeLinecap="round"
          className="animate-pulse"
        />

        {/* Distance/Walk Step Tag along the Route */}
        <g transform={`translate(${midX}, ${(userSvg.y + facSvg.y) / 2})`}>
          <rect x="-35" y="-10" width="70" height="20" rx="5" fill="#0b1c30" opacity="0.9" stroke="#ffffff" strokeWidth="0.5"/>
          <text x="0" y="3.5" fill="#ffffff" fontFamily="Inter" fontSize="8" fontWeight="700" textAnchor="middle">
            {currentWalk} min walk
          </text>
        </g>

        {/* 1. CURRENT GPS LOCATION PIN (User's Exact Position) */}
        <g transform={`translate(${userSvg.x}, ${userSvg.y})`} className="cursor-pointer">
          {/* Pulsing Radar Wave */}
          <circle cx="0" cy="0" r="24" fill="#0051d5" opacity="0.2" className="animate-ping"/>
          <circle cx="0" cy="0" r="15" fill="#0051d5" opacity="0.35"/>
          <circle cx="0" cy="0" r="9" fill="#0051d5" stroke="#ffffff" strokeWidth="2.5"/>
          <circle cx="0" cy="0" r="3.5" fill="#ffffff"/>

          {/* GPS Location Banner Callout */}
          <g transform="translate(0, -22)">
            <rect x="-65" y="-18" width="130" height="20" rx="5" fill="#0051d5" stroke="#ffffff" strokeWidth="1" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.2))"/>
            <text x="0" y="-5" fill="#ffffff" fontFamily="Inter" fontSize="8" fontWeight="800" textAnchor="middle">
              📍 YOU ARE HERE (GPS)
            </text>
          </g>
        </g>

        {/* 2. SELECTED PARKING FACILITY PIN */}
        <g transform={`translate(${facSvg.x}, ${facSvg.y})`} className="cursor-pointer">
          <circle
            cx="0"
            cy="0"
            r="22"
            fill={facility?.ownershipType === 'private' ? '#d8b4fe' : '#85f8c4'}
            opacity="0.5"
            className="animate-ping"
          />
          <circle
            cx="0"
            cy="0"
            r="15"
            fill={facility?.ownershipType === 'private' ? '#7e22ce' : '#006948'}
            stroke="#ffffff"
            strokeWidth="2"
          />
          <text x="0" y="5" fill="#ffffff" fontFamily="Plus Jakarta Sans" fontSize="11" fontWeight="800" textAnchor="middle">
            {facility?.shortCode || 'P'}
          </text>

          {/* Label callout */}
          <g transform="translate(0, -22)">
            <rect
              x="-55"
              y="-18"
              width="110"
              height="20"
              rx="5"
              fill={facility?.ownershipType === 'private' ? '#7e22ce' : '#006948'}
              stroke="#ffffff"
              strokeWidth="0.8"
            />
            <text x="0" y="-5" fill="#ffffff" fontFamily="Inter" fontSize="8" fontWeight="700" textAnchor="middle">
              {facility?.tag || 'PARKING'} • {currentDist} KM
            </text>
          </g>
        </g>

        {/* Tooltip for Hovered Facility */}
        {hoveredFacility && (
          <g transform={`translate(${hoveredFacility.svgCoords?.x || 200}, ${(hoveredFacility.svgCoords?.y || 150) - 24})`}>
            <rect x="-70" y="-16" width="140" height="22" rx="5" fill="#0b1c30" opacity="0.95" stroke="#ffffff" strokeWidth="0.5"/>
            <text x="0" y="-2" fill="#ffffff" fontFamily="Inter" fontSize="7.5" fontWeight="600" textAnchor="middle">
              {hoveredFacility.name} ({hoveredFacility.availableSpaces} Free)
            </text>
          </g>
        )}
      </svg>

      {/* Top Left GPS Status Pill */}
      <div className="absolute top-3 left-3 flex items-center gap-2 bg-surface-container-lowest/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-surface-container shadow-sm text-xs text-on-surface">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-600"></span>
        </span>
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-secondary uppercase tracking-wider">Current GPS Lock</span>
          <span className="font-bold text-on-surface text-xs leading-none">
            {userLat.toFixed(4)}° N, {userLng.toFixed(4)}° E
          </span>
        </div>
      </div>

      {/* Top Right Map Legend */}
      <div className="absolute top-3 right-3 hidden sm:flex items-center gap-2 bg-surface-container-lowest/95 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-surface-container shadow-sm text-[11px] font-semibold text-on-surface">
        <span className="flex items-center gap-1 text-blue-700">
          <span className="w-2 h-2 rounded-full bg-blue-600"></span> GPS You
        </span>
        <span>•</span>
        <span className="flex items-center gap-1 text-emerald-800">
          <span className="w-2 h-2 rounded-full bg-emerald-700"></span> Public
        </span>
        <span>•</span>
        <span className="flex items-center gap-1 text-purple-800">
          <span className="w-2 h-2 rounded-full bg-purple-700"></span> Private
        </span>
      </div>

      {/* Bottom Floating Route Info Bar */}
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between bg-surface-container-lowest/95 backdrop-blur-md px-3.5 py-2 rounded-xl border border-surface-container shadow-sm text-xs">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-base">directions_walk</span>
          <span className="text-on-surface font-medium">
            From GPS Position to <strong>{facility?.name}</strong>:
          </span>
          <span className="font-bold text-primary">
            {currentDist} km ({currentWalk} min walk)
          </span>
        </div>
        <span className={`hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
          facility?.ownershipType === 'private'
            ? 'bg-purple-100 text-purple-900 border border-purple-200'
            : 'bg-emerald-100 text-emerald-900 border border-emerald-200'
        }`}>
          {facility?.ownershipType === 'private' ? '🏢 Private Lot' : '🏛️ BMC Public'}
        </span>
      </div>
    </div>
  );
}
