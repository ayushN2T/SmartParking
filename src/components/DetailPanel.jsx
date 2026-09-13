import React from 'react';
import InteractiveMap from './InteractiveMap.jsx';

export default function DetailPanel({ facility, destinationName, vehicleType, onBookTicket, onGetDirections, userLocation, allFacilities, onSelectFacility }) {
  if (!facility) return null;

  const currentDist = facility.distanceKm[destinationName] ?? 1.5;
  const currentWalk = facility.walkMins[destinationName] ?? 8;
  const currentPrice = vehicleType === '2w' ? facility.twoWheelerPricePerHour : facility.pricePerHour;

  let liveStatusMarkup = (
    <span className="text-primary text-xs font-bold flex items-center gap-1">
      <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span> Available • Instant Entry
    </span>
  );
  if (facility.status === 'limited') {
    liveStatusMarkup = (
      <span className="text-amber-800 text-xs font-bold flex items-center gap-1">
        <span className="w-2 h-2 rounded-full bg-amber-500"></span> Limited Bays • High Congestion
      </span>
    );
  } else if (facility.status === 'full') {
    liveStatusMarkup = (
      <span className="text-error text-xs font-bold flex items-center gap-1">
        <span className="material-symbols-outlined text-xs">lock</span> Saturated • 0 Bays
      </span>
    );
  }

  return (
    <div className="bg-surface-container-lowest p-5 sm:p-6 rounded-2xl border border-surface-container shadow-md flex flex-col gap-4">
      
      {/* Header Info */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="bg-primary text-on-primary text-xs px-2 py-0.5 rounded font-bold uppercase tracking-wider">
              {facility.tag}
            </span>
            {facility.ownershipType === 'private' ? (
              <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-900 text-xs font-bold px-2.5 py-0.5 rounded-full border border-purple-200 shadow-xs">
                <span className="material-symbols-outlined text-sm">domain</span> Private Commercial
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-900 text-xs font-bold px-2.5 py-0.5 rounded-full border border-emerald-200 shadow-xs">
                <span className="material-symbols-outlined text-sm">account_balance</span> BMC Public
              </span>
            )}
            {liveStatusMarkup}
          </div>
          <h3 className="font-headline font-bold text-xl text-on-surface mt-1">
            {facility.name}
          </h3>
          <p className="text-xs text-on-surface-variant">
            {facility.address}
          </p>
        </div>
        <div className="text-right shrink-0">
          <span className="font-headline font-extrabold text-2xl text-primary">₹{currentPrice}</span>
          <span className="text-xs text-on-surface-variant block">per hour</span>
        </div>
      </div>

      {/* Interactive Map Visual */}
      <InteractiveMap
        facility={facility}
        currentWalk={currentWalk}
        currentDist={currentDist}
        userLocation={userLocation}
        destinationName={destinationName}
        allFacilities={allFacilities}
        onSelectFacility={onSelectFacility}
      />

      {/* Vehicle Capacity Breakdown */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-surface-container-low p-3 rounded-xl border border-surface-container flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-surface-container-high text-primary flex items-center justify-center">
            <span className="material-symbols-outlined text-lg">directions_car</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-on-surface-variant font-medium">4-Wheeler Capacity</span>
            <span className="text-sm font-bold text-on-surface">
              {facility.fourWheelerSpaces.available} / {facility.fourWheelerSpaces.total} Free
            </span>
          </div>
        </div>

        <div className="bg-surface-container-low p-3 rounded-xl border border-surface-container flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-surface-container-high text-secondary flex items-center justify-center">
            <span className="material-symbols-outlined text-lg">two_wheeler</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-on-surface-variant font-medium">2-Wheeler Capacity</span>
            <span className="text-sm font-bold text-on-surface">
              {facility.twoWheelerSpaces.available} / {facility.twoWheelerSpaces.total} Free
            </span>
          </div>
        </div>
      </div>

      {/* Approved Tariff Card */}
      <div className="bg-surface-container-low p-3 rounded-xl border border-surface-container flex flex-col gap-2">
        <div className="flex items-center justify-between pb-1 border-b border-surface-container/60">
          <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Approved BMC Rate Tariff</span>
          <span className="text-xs text-primary font-bold">Standard Tariff</span>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center pt-1">
          <div className="bg-surface-container-lowest p-2 rounded-lg border border-surface-container">
            <span className="text-xs text-on-surface-variant block">Cars/SUVs</span>
            <span className="text-sm font-bold text-on-surface">₹{facility.pricePerHour} / hr</span>
          </div>
          <div className="bg-surface-container-lowest p-2 rounded-lg border border-surface-container">
            <span className="text-xs text-on-surface-variant block">Two-Wheelers</span>
            <span className="text-sm font-bold text-on-surface">₹{facility.twoWheelerPricePerHour} / hr</span>
          </div>
          <div className="bg-surface-container-lowest p-2 rounded-lg border border-surface-container">
            <span className="text-xs text-on-surface-variant block">Full Day Pass</span>
            <span className="text-sm font-bold text-secondary">₹{facility.fullDayPass} flat</span>
          </div>
        </div>
      </div>

      {/* Facility Features */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Facility Features &amp; Security</span>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center gap-2 text-xs text-on-surface">
            <span className="material-symbols-outlined text-primary text-base">shield_person</span>
            <span>{facility.securityGuard}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-on-surface">
            <span className="material-symbols-outlined text-primary text-base">schedule</span>
            <span className="truncate">{facility.operatingHours}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-on-surface">
            <span className="material-symbols-outlined text-primary text-base">contactless</span>
            <span>FASTag / UPI Auto-Pay</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-on-surface">
            <span className="material-symbols-outlined text-primary text-base">ev_station</span>
            <span>{facility.evChargingSpaces > 0 ? `${facility.evChargingSpaces} EV Fast Chargers` : 'Standard Power'}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <button
          onClick={onGetDirections}
          className="flex-1 py-3 px-4 rounded-lg bg-secondary text-on-secondary hover:bg-secondary-container font-semibold text-sm shadow-xs flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
        >
          <span className="material-symbols-outlined text-base">near_me</span>
          <span>Get Directions in Google Maps</span>
        </button>
        <button
          onClick={onBookTicket}
          className="py-3 px-5 rounded-lg bg-primary text-on-primary hover:bg-primary-container font-semibold text-sm shadow-xs flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
        >
          <span className="material-symbols-outlined text-base">qr_code_2</span>
          <span>Book / Check-in QR</span>
        </button>
      </div>

    </div>
  );
}
