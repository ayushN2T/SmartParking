import React, { useState } from 'react';
import { POPULAR_DESTINATIONS } from '../data/parkingLots';

export default function HomeView({ destinations, onSelectDestination, availableCount = 186 }) {
  const [searchInput, setSearchInput] = useState('Bhavnagar Central Market');
  const destinationList = (destinations && destinations.length > 0) ? destinations : POPULAR_DESTINATIONS;

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onSelectDestination(searchInput.trim());
    }
  };

  return (
    <section className="w-full">
      {/* Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-b from-surface-container-low/60 to-background py-16 sm:py-24 border-b border-surface-container">
        {/* Ambient Glows */}
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-secondary-fixed/40 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-12 left-1/4 w-80 h-80 bg-primary-fixed/30 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 relative z-10 flex flex-col items-center text-center">
          
          <div className="inline-flex items-center gap-2 bg-surface-container-high text-secondary text-xs px-3 py-1 rounded-full uppercase tracking-wider font-bold mb-4 border border-surface-container">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
            BMC Smart City Mission • Bhavnagar
          </div>

          <h1 className="font-headline font-extrabold text-3xl sm:text-5xl lg:text-6xl text-on-surface tracking-tight max-w-4xl leading-tight">
            Find parking before you reach your destination.
          </h1>

          <p className="mt-4 text-base sm:text-xl text-on-surface-variant max-w-2xl font-normal leading-relaxed">
            Eliminate circling around busy markets and congested railway corridors. Discover real-time availability, compare pricing, and get intelligent AI recommendations in seconds.
          </p>

          {/* Search Command Launcher */}
          <form onSubmit={handleSearchSubmit} className="mt-8 w-full max-w-3xl 2xl:max-w-4xl bg-surface-container-lowest p-2 sm:p-3 rounded-2xl shadow-lg border border-surface-container flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1 flex items-center">
              <span className="material-symbols-outlined absolute left-3.5 text-primary text-xl select-none pointer-events-none">search</span>
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Enter destination (e.g. Central Market, Railway Station)..."
                className="w-full pl-11 pr-4 py-3 bg-surface-container-low rounded-xl text-sm font-medium text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary"
              />
            </div>
            <button
              type="submit"
              className="py-3 px-6 bg-primary text-on-primary hover:bg-primary-container font-semibold text-sm rounded-xl shadow-sm flex items-center justify-center gap-2 transition-all active:scale-95 shrink-0 cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">radar</span>
              <span>Find Parking</span>
            </button>
          </form>

          {/* Popular Hubs */}
          <div className="mt-6 flex flex-col items-center gap-2">
            <span className="text-xs uppercase font-bold text-on-surface-variant tracking-wider">Popular Destinations:</span>
            <div className="flex flex-wrap justify-center gap-2">
              {destinationList.map(d => (
                <button
                  key={d.id}
                  onClick={() => onSelectDestination(d.name)}
                  className="px-4 py-2 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface font-semibold text-xs transition-all flex items-center gap-2 border border-surface-container shadow-xs cursor-pointer hover:border-primary/40"
                >
                  <span className="material-symbols-outlined text-primary text-base">location_on</span>
                  <span>{d.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* KPI Mini-Counters */}
          <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-4xl text-left">
            <div className="bg-surface-container-lowest p-4 rounded-xl border border-surface-container shadow-xs">
              <span className="text-xs uppercase text-on-surface-variant font-bold">Managed Facilities</span>
              <span className="block font-headline font-bold text-2xl text-on-surface mt-1">12 Hubs</span>
              <span className="text-xs text-primary font-medium">5 Urban Zones</span>
            </div>
            <div className="bg-surface-container-lowest p-4 rounded-xl border border-surface-container shadow-xs">
              <span className="text-xs uppercase text-on-surface-variant font-bold">Free Spaces Live</span>
              <span className="block font-headline font-bold text-2xl text-primary mt-1">{availableCount} Free Bays</span>
              <span className="text-xs text-on-surface-variant">Updated real-time</span>
            </div>
            <div className="bg-surface-container-lowest p-4 rounded-xl border border-surface-container shadow-xs">
              <span className="text-xs uppercase text-on-surface-variant font-bold">AI Routing</span>
              <span className="block font-headline font-bold text-2xl text-secondary mt-1">Instant Match</span>
              <span className="text-xs text-on-surface-variant">Distance &amp; Rate</span>
            </div>
            <div className="bg-surface-container-lowest p-4 rounded-xl border border-surface-container shadow-xs">
              <span className="text-xs uppercase text-on-surface-variant font-bold">Barrier Gate</span>
              <span className="block font-headline font-bold text-2xl text-on-surface mt-1">FASTag &amp; QR</span>
              <span className="text-xs text-primary font-medium">Contactless exit</span>
            </div>
          </div>

        </div>
      </div>

      {/* Feature Value Props */}
      <div className="max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 py-16">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="font-headline font-bold text-2xl sm:text-3xl text-on-surface">Why Bhavnagar Smart Parking?</h2>
          <p className="text-sm text-on-surface-variant mt-2">Civic innovation solving congested roads, fuel wastage, and parking anxiety.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-surface-container-lowest p-6 rounded-2xl border border-surface-container shadow-xs flex flex-col gap-3 hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">neurology</span>
            </div>
            <h3 className="font-headline font-bold text-lg text-on-surface">🤖 Smart AI Recommendations</h3>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Multi-criteria decision logic analyzes distance, vacant spots, hourly tariffs, and traffic saturation to route you to the optimal parking bay.
            </p>
          </div>

          <div className="bg-surface-container-lowest p-6 rounded-2xl border border-surface-container shadow-xs flex flex-col gap-3 hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">sensors</span>
            </div>
            <h3 className="font-headline font-bold text-lg text-on-surface">🚦 Real-Time Sensor Telemetry</h3>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Live status badges (Available, Limited, Full) reflect ground sensor readings, allowing drivers to make informed decisions ahead of time.
            </p>
          </div>

          <div className="bg-surface-container-lowest p-6 rounded-2xl border border-surface-container shadow-xs flex flex-col gap-3 hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-xl bg-primary-fixed text-on-primary-fixed-variant flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">contactless</span>
            </div>
            <h3 className="font-headline font-bold text-lg text-on-surface">⚡ FASTag &amp; Digital Passes</h3>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Frictionless entry and exit with automatic RFID boom barrier lift and digital QR check-in tokens on your mobile phone.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
