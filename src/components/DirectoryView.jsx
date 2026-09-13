import React, { useState } from 'react';

export default function DirectoryView({ facilities, onSelectFacility, onDirections }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedZone, setSelectedZone] = useState('all');

  let filtered = facilities;
  if (selectedZone !== 'all') {
    filtered = filtered.filter(f => f.zone.toLowerCase().includes(selectedZone.toLowerCase()));
  }
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim();
    filtered = filtered.filter(f => 
      f.name.toLowerCase().includes(q) || 
      f.address.toLowerCase().includes(q) || 
      f.zone.toLowerCase().includes(q) ||
      f.tag.toLowerCase().includes(q)
    );
  }

  return (
    <section className="w-full max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 py-8 flex flex-col gap-6">
      
      {/* Header & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-primary">Municipal Registry</span>
          <h1 className="font-headline font-extrabold text-2xl sm:text-3xl text-on-surface">All Bhavnagar Parking Locations</h1>
          <p className="text-sm text-on-surface-variant">Complete directory of 12 BMC managed parking facilities, operational hours, and rates.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[220px]">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search facilities, areas..."
              className="w-full pl-9 pr-3 py-2 bg-surface-container-lowest border border-surface-container rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-secondary"
            />
            <span className="material-symbols-outlined absolute left-2.5 top-2.5 text-on-surface-variant text-base">search</span>
          </div>

          <select
            value={selectedZone}
            onChange={(e) => setSelectedZone(e.target.value)}
            className="bg-surface-container-lowest border border-surface-container rounded-xl px-3 py-2 text-xs font-semibold text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary cursor-pointer"
          >
            <option value="all">All Zones (12 Facilities)</option>
            <option value="Central Market">Central Market Zone</option>
            <option value="Railway">Railway Station Zone</option>
            <option value="Kalanala">Kalanala Hub</option>
            <option value="Nilambaug">Nilambaug Palace</option>
            <option value="Takhteshwar">Takhteshwar Hill</option>
          </select>
        </div>
      </div>

      {/* Facilities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filtered.map(facility => (
          <div
            key={facility.id}
            className="bg-surface-container-lowest p-5 rounded-2xl border border-surface-container shadow-xs flex flex-col justify-between hover:shadow-md transition-all"
          >
            <div className="flex flex-col gap-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="px-2 py-0.5 rounded bg-surface-container-high text-secondary text-xs font-bold uppercase">
                      {facility.zone}
                    </span>
                    {facility.ownershipType === 'private' ? (
                      <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-900 text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-purple-200">
                        <span className="material-symbols-outlined text-[12px]">domain</span> Private
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-900 text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-emerald-200">
                        <span className="material-symbols-outlined text-[12px]">account_balance</span> BMC Public
                      </span>
                    )}
                  </div>
                  <h3 className="font-headline font-bold text-base sm:text-lg text-on-surface mt-1">
                    {facility.name}
                  </h3>
                  <span className="text-xs text-on-surface-variant">{facility.tag} • {facility.corridor}</span>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase ${
                  facility.status === 'available' ? 'badge-available' : facility.status === 'limited' ? 'badge-limited' : 'badge-full'
                }`}>
                  {facility.status}
                </span>
              </div>

              <p className="text-xs text-on-surface-variant mt-1 leading-normal">{facility.address}</p>
              
              <div className="grid grid-cols-2 gap-2 my-2 bg-surface-container-low p-2.5 rounded-xl border border-surface-container/60">
                <div>
                  <span className="text-xs text-on-surface-variant block">Capacity</span>
                  <span className="font-bold text-sm text-on-surface">{facility.availableSpaces} / {facility.totalSpaces} Free</span>
                </div>
                <div>
                  <span className="text-xs text-on-surface-variant block">Hourly Rate</span>
                  <span className="font-bold text-sm text-primary">₹{facility.pricePerHour} / hr</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1 text-[11px] text-on-surface-variant">
                {(facility.amenities || []).slice(0, 3).map((a, i) => (
                  <span key={i} className="bg-surface-container px-2 py-0.5 rounded">{a}</span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 pt-3 mt-3 border-t border-surface-container">
              <button
                onClick={() => onSelectFacility(facility.id)}
                className="flex-1 py-2 px-3 bg-secondary text-on-secondary rounded-lg text-xs font-bold hover:bg-secondary-container transition-all cursor-pointer"
              >
                Find &amp; Navigate
              </button>
              <button
                onClick={() => {
                  const target = facility.coords?.lat && facility.coords?.lng ? `${facility.coords.lat},${facility.coords.lng}` : null;
                  onDirections(target);
                }}
                className="p-2 bg-surface-container-low text-on-surface rounded-lg hover:bg-surface-container transition-all cursor-pointer"
                title="Google Maps"
              >
                <span className="material-symbols-outlined text-base">near_me</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
