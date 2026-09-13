import React from 'react';
import { getCitywideStats } from '../data/parkingLots';

export default function DashboardView({ facilities, onSimulateTick, lastSyncTime }) {
  const stats = getCitywideStats(facilities);

  // Sort crowded facilities by occupancy percentage
  const crowdedList = [...(facilities || [])].sort((a, b) => {
    const occRateA = (a.totalSpaces > 0) ? (a.occupiedSpaces / a.totalSpaces) : 0;
    const occRateB = (b.totalSpaces > 0) ? (b.occupiedSpaces / b.totalSpaces) : 0;
    return occRateB - occRateA;
  });

  return (
    <section className="w-full max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 py-8 flex flex-col gap-6">
      
      {/* Executive Header Strip */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-surface-container-lowest p-6 rounded-2xl border border-surface-container shadow-xs">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs uppercase tracking-wider font-bold">
              BMC Smart City Cell
            </span>
            <span className="text-outline-variant text-xs">•</span>
            <span className="text-xs text-on-surface-variant font-medium">Command Center Node #BH-04</span>
          </div>
          <h1 className="font-headline font-bold text-2xl text-on-surface tracking-tight">
            Bhavnagar Municipal Smart Parking Control Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant">
            Real-time citywide parking occupancy, sensor health, and spatial congestion telemetry across urban corridors
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onSimulateTick}
            className="flex items-center gap-2 bg-primary text-on-primary hover:bg-primary-container px-4 py-2.5 rounded-xl shadow-xs transition-all text-xs font-bold active:scale-95 cursor-pointer"
          >
            <span className="material-symbols-outlined text-base animate-spin-slow">sync</span>
            <span>Simulate Sensor Tick</span>
          </button>
          
          <div className="flex items-center gap-2 text-xs text-on-surface-variant bg-surface-container-low px-3 py-2 rounded-xl border border-surface-container">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            <span>Synced: {lastSyncTime}</span>
          </div>
        </div>
      </div>

      {/* Diversion Notice */}
      <div className="bg-gradient-to-r from-amber-500/10 via-surface-container-low to-surface-container-lowest p-4 rounded-xl border border-amber-300/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-900 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-xl">crisis_alert</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-950 uppercase">Active Traffic Diversion Advisory // Bhavnagar Central Market</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-200 text-amber-900">Queue Active</span>
            </div>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Divert traffic to <strong>Gandhi Smriti Plaza Lot</strong> (1.2 km away) or <strong>Barton Stand</strong> to reduce MG Road bottleneck. 4 Variable Message Signs updated.
            </p>
          </div>
        </div>
      </div>

      {/* KPI METRICS STRIP (Total Locations: 12, Available: 186, Occupied: 294, Full: 3) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Locations */}
        <div className="bg-surface-container-lowest p-5 rounded-2xl border border-surface-container shadow-xs flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Total Parking Locations</span>
              <span className="font-headline font-extrabold text-3xl text-on-surface mt-2 tabular-nums">
                {stats.totalFacilities} Locations
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-2xl">domain</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-surface-container flex items-center justify-between">
            <span className="text-xs text-on-surface-variant">Across 5 civic zones</span>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping"></span> 100% Online
            </span>
          </div>
        </div>

        {/* Available Spaces */}
        <div className="bg-surface-container-lowest p-5 rounded-2xl border border-surface-container shadow-xs flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Available Spaces</span>
              <span className="font-headline font-extrabold text-3xl text-primary mt-2 tabular-nums">
                {stats.availableSpaces}
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-2xl">local_parking</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-surface-container flex items-center justify-between">
            <span className="text-xs text-on-surface-variant">
              {Math.round((stats.availableSpaces / stats.totalCapacity) * 100)}% of city capacity
            </span>
            <span className="text-xs font-bold text-primary flex items-center gap-0.5">
              <span className="material-symbols-outlined text-sm">arrow_upward</span> High Flow
            </span>
          </div>
        </div>

        {/* Occupied Spaces */}
        <div className="bg-surface-container-lowest p-5 rounded-2xl border border-surface-container shadow-xs flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Occupied Spaces</span>
              <span className="font-headline font-extrabold text-3xl text-on-surface mt-2 tabular-nums">
                {stats.occupiedSpaces}
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined text-2xl">directions_car</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-surface-container flex items-center justify-between">
            <span className="text-xs text-on-surface-variant">{stats.overallOccupancyPct}% overall occupancy</span>
            <span className="text-xs text-on-surface-variant font-medium">Peak afternoon</span>
          </div>
        </div>

        {/* Full Locations */}
        <div className="bg-surface-container-lowest p-5 rounded-2xl border border-surface-container shadow-xs flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Full Parking Locations</span>
              <span className="font-headline font-extrabold text-3xl text-error mt-2 tabular-nums">
                {stats.fullLocations} Facilities
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-error-container/40 flex items-center justify-center text-error">
              <span className="material-symbols-outlined text-2xl">warning</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-surface-container flex items-center justify-between">
            <span className="text-xs text-on-surface-variant">Central, Kalanala &amp; Temple</span>
            <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
              Diversions On
            </span>
          </div>
        </div>
      </div>

      {/* Analytical Visualizations & Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Hourly Trend Area Chart */}
        <div className="lg:col-span-7 bg-surface-container-lowest p-6 rounded-2xl border border-surface-container shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-primary">Temporal Flow Analytics</span>
              <h3 className="font-headline font-bold text-lg text-on-surface">Hourly Citywide Occupancy Trajectory</h3>
            </div>
            <span className="text-xs bg-surface-container px-2.5 py-1 rounded-lg text-on-surface-variant font-semibold">Today (24h Trend)</span>
          </div>

          <div className="w-full h-56 relative bg-surface-container-low/40 rounded-xl p-2 border border-surface-container flex items-end">
            <svg className="w-full h-full" viewBox="0 0 500 160" preserveAspectRatio="none">
              <defs>
                <linearGradient id="dashboard-gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#006948" stopOpacity="0.4"/>
                  <stop offset="100%" stopColor="#006948" stopOpacity="0.0"/>
                </linearGradient>
              </defs>
              <line x1="0" y1="40" x2="500" y2="40" stroke="#bccac0" strokeWidth="0.5" strokeDasharray="4,4" opacity="0.4"/>
              <line x1="0" y1="80" x2="500" y2="80" stroke="#bccac0" strokeWidth="0.5" strokeDasharray="4,4" opacity="0.4"/>
              <line x1="0" y1="120" x2="500" y2="120" stroke="#bccac0" strokeWidth="0.5" strokeDasharray="4,4" opacity="0.4"/>

              <polygon fill="url(#dashboard-gradient)" points="0,150 0,130 50,110 100,80 150,55 200,35 250,25 300,40 350,30 400,60 450,90 500,120 500,160 0,160"/>
              <polyline fill="none" stroke="#006948" strokeWidth="3" points="0,130 50,110 100,80 150,55 200,35 250,25 300,40 350,30 400,60 450,90 500,120"/>

              <circle cx="250" cy="25" r="5" fill="#0051d5"/>
              <text x="250" y="16" fill="#0051d5" fontSize="9" fontFamily="Inter" fontWeight="700" textAnchor="middle">Peak 82% (02:30 PM)</text>
            </svg>
          </div>

          <div className="flex items-center justify-between text-xs text-on-surface-variant mt-2 px-1">
            <span>08:00 AM</span>
            <span>11:00 AM</span>
            <span>02:00 PM (Peak)</span>
            <span>05:00 PM</span>
            <span>08:00 PM</span>
            <span>11:00 PM</span>
          </div>
        </div>

        {/* Most Crowded Areas Table */}
        <div className="lg:col-span-5 bg-surface-container-lowest p-6 rounded-2xl border border-surface-container shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-error">Congestion Hotspots</span>
              <h3 className="font-headline font-bold text-lg text-on-surface">Most Crowded Parking Areas</h3>
            </div>
            <span className="text-xs text-on-surface-variant font-medium">Ranked by Load</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-surface-container text-on-surface-variant">
                  <th className="py-2 px-3 font-semibold">Rank</th>
                  <th className="py-2 px-3 font-semibold">Facility</th>
                  <th className="py-2 px-3 font-semibold">Free</th>
                  <th className="py-2 px-3 font-semibold">Occupancy</th>
                  <th className="py-2 px-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {crowdedList.slice(0, 5).map((facility, idx) => {
                  const occPct = facility.totalSpaces > 0 ? Math.round((facility.occupiedSpaces / facility.totalSpaces) * 100) : 0;
                  let statusPill = <span className="badge-available px-2 py-0.5 rounded-full text-xs font-bold">Flowing</span>;
                  if (facility.availableSpaces === 0) {
                    statusPill = <span className="badge-full px-2 py-0.5 rounded-full text-xs font-bold">100% Saturated</span>;
                  } else if (occPct >= 80) {
                    statusPill = <span className="badge-limited px-2 py-0.5 rounded-full text-xs font-bold">Near Capacity</span>;
                  }

                  return (
                    <tr key={facility.id} className="border-b border-surface-container hover:bg-surface-container-low/50 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-xs text-on-surface-variant">#{idx + 1}</td>
                      <td className="py-3 px-3">
                        <div className="flex flex-col">
                          <span className="font-bold text-sm text-on-surface">{facility.name}</span>
                          <span className="text-xs text-on-surface-variant">{facility.zone}</span>
                        </div>
                      </td>
                      <td className={`py-3 px-3 tabular-nums font-bold text-sm ${facility.availableSpaces === 0 ? 'text-error' : 'text-primary'}`}>
                        {facility.availableSpaces} / {facility.totalSpaces}
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-surface-container h-2 rounded-full overflow-hidden">
                            <div className={`${occPct >= 95 ? 'bg-error' : occPct >= 80 ? 'bg-amber-500' : 'bg-primary'} h-full rounded-full`} style={{ width: `${occPct}%` }}></div>
                          </div>
                          <span className="text-xs font-bold tabular-nums text-on-surface">{occPct}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        {statusPill}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </section>
  );
}
