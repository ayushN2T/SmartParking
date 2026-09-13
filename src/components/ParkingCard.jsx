import React from 'react';

export default function ParkingCard({ facility, isSelected, isAiBest, onSelect, onDirections }) {
  const freePct = facility.totalSpaces > 0 
    ? Math.round((facility.availableSpaces / facility.totalSpaces) * 100) 
    : 0;

  let badgeClass = 'badge-available';
  let dotPulse = <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span>;
  let statusText = 'Available';
  let barColor = 'bg-primary';

  if (facility.status === 'limited') {
    badgeClass = 'badge-limited';
    dotPulse = <span className="w-2 h-2 rounded-full bg-amber-500"></span>;
    statusText = 'Limited';
    barColor = 'bg-amber-500';
  } else if (facility.status === 'full') {
    badgeClass = 'badge-full';
    dotPulse = <span className="material-symbols-outlined text-xs">lock</span>;
    statusText = `Full (${facility.availableSpaces}/${facility.totalSpaces})`;
    barColor = 'bg-error';
  }

  const ringClass = isSelected ? 'ring-2 ring-primary shadow-md' : 'shadow-sm';

  return (
    <div
      onClick={onSelect}
      className={`parking-card group relative bg-surface-container-lowest p-4 sm:p-5 rounded-2xl ${ringClass} transition-all cursor-pointer border border-surface-container`}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl ${isAiBest ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-secondary'} font-headline flex items-center justify-center font-bold text-sm`}>
            {facility.shortCode}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-headline font-bold text-base text-on-surface group-hover:text-primary transition-colors">
                {facility.name} ({facility.tag})
              </h3>
              {facility.ownershipType === 'private' ? (
                <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-900 text-[11px] font-bold px-2 py-0.5 rounded-full border border-purple-200 shadow-xs">
                  <span className="material-symbols-outlined text-[13px]">domain</span> Private
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-900 text-[11px] font-bold px-2 py-0.5 rounded-full border border-emerald-200 shadow-xs">
                  <span className="material-symbols-outlined text-[13px]">account_balance</span> BMC Public
                </span>
              )}
              {isAiBest && (
                <span className="bg-primary/10 text-primary px-2 py-0.5 rounded font-bold text-xs">
                  Top AI Choice
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-0.5 text-on-surface-variant text-xs flex-wrap">
              <span className="flex items-center gap-0.5 text-on-surface font-semibold">
                <span className="material-symbols-outlined text-sm text-secondary">location_on</span>
                {facility.currentDist} km
              </span>
              <span>•</span>
              <span className="flex items-center gap-0.5 font-medium">
                <span className="material-symbols-outlined text-sm text-primary">directions_walk</span>
                {facility.currentWalk} min walk
              </span>
              <span>•</span>
              <span className="text-on-surface-variant text-xs">{facility.corridor}</span>
            </div>
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-2 shrink-0">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${badgeClass}`}>
            {dotPulse}
            {statusText}
          </span>
        </div>
      </div>

      {/* Occupancy Progress Bar */}
      <div className="bg-surface-container-low p-2.5 rounded-xl my-1 flex flex-col gap-1.5 border border-surface-container/60">
        <div className="flex items-center justify-between text-xs">
          <span className="text-on-surface-variant">Real-Time Sensor Capacity:</span>
          <span className={`font-bold ${facility.status === 'full' ? 'text-error' : facility.status === 'limited' ? 'text-amber-800' : 'text-primary'}`}>
            {facility.availableSpaces} / {facility.totalSpaces} spaces available ({freePct}% free)
          </span>
        </div>
        <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
          <div className={`${barColor} h-full rounded-full transition-all duration-500`} style={{ width: `${freePct}%` }}></div>
        </div>
      </div>

      {/* Amenities & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 mt-1">
        <div className="flex flex-wrap items-center gap-1.5">
          {(facility.amenities || []).slice(0, 3).map((amenity, idx) => (
            <span key={idx} className="inline-flex items-center gap-1 text-on-surface-variant bg-surface-container px-2 py-0.5 rounded text-xs">
              {amenity}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="flex flex-col text-right mr-1">
            <span className="font-headline font-bold text-lg text-on-surface leading-tight">
              ₹{facility.currentPrice}<span className="text-xs font-normal text-on-surface-variant">/hr</span>
            </span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect();
            }}
            className={`px-4 py-2 rounded-lg font-semibold text-xs shadow-xs transition-all cursor-pointer ${
              isSelected
                ? 'bg-primary text-on-primary'
                : 'bg-surface-container-high text-on-surface hover:bg-secondary hover:text-on-secondary'
            }`}
          >
            View Details
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDirections();
            }}
            className="p-2 rounded-lg bg-surface-container-low text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
            title="Directions in Google Maps"
          >
            <span className="material-symbols-outlined text-base">near_me</span>
          </button>
        </div>
      </div>
    </div>
  );
}
