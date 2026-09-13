import React, { useState, useEffect, useRef } from 'react';
import { POPULAR_DESTINATIONS } from '../data/parkingLots';
import { evaluateParkingOptions } from '../services/aiRecommender';
import ParkingCard from './ParkingCard';
import DetailPanel from './DetailPanel';
import InteractiveMap from './InteractiveMap';

export default function FindParkingView({
  facilities,
  currentDestination,
  onDestinationChange,
  selectedFacilityId,
  onSelectFacility,
  onBookTicket,
  onGetDirections,
  liveTickerCounter,
  userLocation,
  onOpenLocationModal
}) {
  const [vehicleType, setVehicleType] = useState('4w');
  const [sortOption, setSortOption] = useState('match');
  const [statusFilter, setStatusFilter] = useState('all');
  const [ownershipFilter, setOwnershipFilter] = useState('all'); // 'all' | 'public' | 'private'
  const [viewMode, setViewMode] = useState('cards'); // 'cards' | 'map'
  const [searchInput, setSearchInput] = useState(currentDestination);
  const detailPanelRef = useRef(null);

  useEffect(() => {
    setSearchInput(currentDestination);
  }, [currentDestination]);

  // Run AI Recommender
  const aiResult = evaluateParkingOptions(facilities, currentDestination, vehicleType);

  // Compute calculated list of facilities
  let list = facilities.map(f => {
    const dist = f.distanceKm[currentDestination] ?? 1.5;
    const walk = f.walkMins[currentDestination] ?? 8;
    const price = vehicleType === '2w' ? f.twoWheelerPricePerHour : f.pricePerHour;
    return {
      ...f,
      currentDist: dist,
      currentWalk: walk,
      currentPrice: price
    };
  });

  // Calculate total counts for Public vs Private
  const totalPublicCount = facilities.filter(f => (f.ownershipType ?? 'public') === 'public').length;
  const totalPrivateCount = facilities.filter(f => f.ownershipType === 'private').length;

  // Apply Ownership Filter (Public vs Private)
  if (ownershipFilter !== 'all') {
    list = list.filter(f => (f.ownershipType ?? 'public') === ownershipFilter);
  }

  // Apply Status Filter
  if (statusFilter !== 'all') {
    list = list.filter(f => f.status === statusFilter);
  }

  // Apply Vehicle Filter (e.g. EV)
  if (vehicleType === 'ev') {
    list = list.filter(f => (f.evChargingSpaces || 0) > 0);
  }

  // Apply Sort
  if (sortOption === 'distance') {
    list.sort((a, b) => a.currentDist - b.currentDist);
  } else if (sortOption === 'price') {
    list.sort((a, b) => a.currentPrice - b.currentPrice);
  } else if (sortOption === 'spaces') {
    list.sort((a, b) => b.availableSpaces - a.availableSpaces);
  } else {
    // Smart Match from AI
    const scoredIds = aiResult?.allScored.map(s => s.id) || [];
    list.sort((a, b) => {
      const idxA = scoredIds.indexOf(a.id);
      const idxB = scoredIds.indexOf(b.id);
      return (idxA !== -1 ? idxA : 999) - (idxB !== -1 ? idxB : 999);
    });
  }

  const selectedFacility = facilities.find(f => f.id === selectedFacilityId) || list[0] || facilities[0];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onDestinationChange(searchInput.trim());
    }
  };

  const scrollToDetail = () => {
    if (detailPanelRef.current && window.innerWidth < 1280) {
      detailPanelRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 py-6 flex flex-col gap-6">
      
      {/* Header & Command Bar */}
      <section className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 bg-surface-container-high text-secondary font-bold text-xs px-2.5 py-1 rounded-full uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
                BMC Smart Mobility Grid
              </span>
              <span className="text-on-surface-variant text-xs">Zone 04 • Central Bhavnagar</span>
            </div>
            <h1 className="font-headline font-extrabold text-2xl sm:text-4xl text-on-surface tracking-tight">
              Bhavnagar Smart Parking
            </h1>
            <p className="text-sm text-on-surface-variant max-w-2xl mt-0.5">
              Find parking before you reach your destination. Real-time sensor-connected curb telemetry and automated bay routing.
            </p>
          </div>

          {/* Quick Counter */}
          <div className="bg-surface-container-lowest p-3 rounded-xl border border-surface-container shadow-xs flex items-center gap-4">
            <div className="flex flex-col text-right">
              <span className="text-xs uppercase text-on-surface-variant font-bold">Citywide Free Bays</span>
              <span className="font-headline font-bold text-2xl text-primary tracking-tight tabular-nums">
                {liveTickerCounter}
              </span>
            </div>
            <div className="h-8 w-px bg-outline-variant/30"></div>
            <div className="flex flex-col">
              <span className="text-xs uppercase text-on-surface-variant font-bold">Sensor Latency</span>
              <span className="text-sm font-bold text-secondary">1.8s Live</span>
            </div>
          </div>
        </div>

        {/* Active Current Location & Relocation Bar */}
        <div className="bg-gradient-to-r from-secondary/15 via-surface-container-low to-primary/15 p-4 rounded-2xl border border-secondary/30 flex flex-wrap items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-secondary text-on-secondary flex items-center justify-center shadow-xs shrink-0">
              <span className="material-symbols-outlined text-2xl">
                {userLocation?.isGps ? 'near_me' : 'my_location'}
              </span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-bold uppercase tracking-wider text-secondary">
                  {userLocation?.isGps ? '📍 GPS Current Location' : '📍 Current Location in Bhavnagar'}
                </span>
                <span className="bg-secondary/10 text-secondary border border-secondary/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  Verified Starting Point
                </span>
                <span className="text-[11px] text-on-surface-variant font-mono bg-surface-container-lowest px-2 py-0.5 rounded border border-surface-container">
                  {userLocation?.coords?.lat ? `${userLocation.coords.lat.toFixed(4)}° N, ${userLocation.coords.lng.toFixed(4)}° E` : '21.7645° N, 72.1519° E'}
                </span>
              </div>
              <div className="flex items-center gap-2 flex-wrap mt-0.5">
                <span className="font-headline font-extrabold text-lg sm:text-xl text-on-surface">
                  {currentDestination}
                </span>
                <span className="text-xs text-on-surface-variant">
                  (Live GPS pinpoint active on map • Showing closest Public and Private bays)
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => {
                setViewMode(prev => prev === 'map' ? 'cards' : 'map');
                if (window.innerWidth < 1280 && detailPanelRef.current) {
                  detailPanelRef.current.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className={`px-3.5 py-2.5 rounded-xl font-semibold text-xs shadow-xs flex items-center gap-1.5 transition-all cursor-pointer border ${
                viewMode === 'map'
                  ? 'bg-secondary text-on-secondary border-secondary'
                  : 'bg-surface-container-lowest text-primary hover:bg-surface-container-high border-primary/30'
              }`}
            >
              <span className="material-symbols-outlined text-base">
                {viewMode === 'map' ? 'view_list' : 'map'}
              </span>
              <span>{viewMode === 'map' ? 'Switch to Cards View' : 'Show GPS on Map'}</span>
            </button>
            <button
              type="button"
              onClick={onOpenLocationModal}
              className="px-4 py-2.5 rounded-xl bg-primary text-on-primary hover:bg-primary-container font-semibold text-xs shadow-xs flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">edit_location</span>
              <span>Change Location</span>
            </button>
          </div>
        </div>

        {/* Search Filter Bar */}
        <div className="bg-surface-container-lowest p-4 rounded-xl border border-surface-container shadow-xs flex flex-col gap-4">
          <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-center">
            
            {/* Destination Input */}
            <div className="lg:col-span-6 relative flex items-center">
              <span className="material-symbols-outlined absolute left-3.5 text-primary text-xl select-none pointer-events-none">search</span>
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search landmark, ward, or market destination..."
                className="w-full pl-11 pr-10 py-3 bg-surface-container-low rounded-lg text-sm text-on-surface font-medium focus:outline-none focus:ring-2 focus:ring-secondary transition-all"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => setSearchInput('')}
                  className="absolute right-3 text-on-surface-variant hover:text-on-surface p-1"
                >
                  <span className="material-symbols-outlined text-base">close</span>
                </button>
              )}
            </div>

            {/* Vehicle Type */}
            <div className="lg:col-span-2 relative">
              <select
                data-testid="vehicle-type-select"
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value)}
                className="w-full px-3 py-3 bg-surface-container-low rounded-lg text-sm font-semibold text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary appearance-none cursor-pointer"
              >
                <option value="4w">🚗 4-Wheeler (Car/SUV)</option>
                <option value="2w">🛵 2-Wheeler (Bike/Scooter)</option>
                <option value="ev">⚡ EV Only Space</option>
              </select>
              <span className="material-symbols-outlined absolute right-3 top-3.5 text-on-surface-variant pointer-events-none text-base">expand_more</span>
            </div>

            {/* Sort */}
            <div className="lg:col-span-2 relative">
              <select
                data-testid="sort-select"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="w-full px-3 py-3 bg-surface-container-low rounded-lg text-sm font-semibold text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary appearance-none cursor-pointer"
              >
                <option value="match">✨ Best Smart Match</option>
                <option value="distance">📍 Distance (Closest)</option>
                <option value="price">💰 Price (Lowest First)</option>
                <option value="spaces">🟢 Free Capacity</option>
              </select>
              <span className="material-symbols-outlined absolute right-3 top-3.5 text-on-surface-variant pointer-events-none text-base">sort</span>
            </div>

            {/* CTA */}
            <div className="lg:col-span-2">
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-primary text-on-primary hover:bg-primary-container font-bold text-sm rounded-lg shadow-xs transition-all active:scale-95 cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">radar</span>
                <span>Find Parking</span>
              </button>
            </div>
          </form>

          {/* Popular Destination Chips */}
          <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-surface-container/60">
            <span className="text-xs text-on-surface-variant uppercase font-bold tracking-wider mr-1">Popular Hubs:</span>
            {POPULAR_DESTINATIONS.map(d => {
              const isActive = d.name === currentDestination;
              return (
                <button
                  key={d.id}
                  onClick={() => {
                    setSearchInput(d.name);
                    onDestinationChange(d.name);
                  }}
                  className={`dest-chip px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-secondary text-on-secondary shadow-xs'
                      : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
                  }`}
                >
                  {d.name}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 🤖 SMART AI RECOMMENDATION BOX */}
      {aiResult?.bestOption && (
        <section className="bg-surface-container-low p-4 sm:p-6 rounded-2xl border border-surface-container shadow-xs transition-all">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="flex items-start gap-4 max-w-3xl">
              <div className="w-12 h-12 rounded-xl bg-primary text-on-primary flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                <span className="material-symbols-outlined text-2xl">neurology</span>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="bg-primary-container text-on-primary-container text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                    🤖 Smart Recommendation (AI Powered Transit Optimizer)
                  </span>
                  <span className="text-secondary text-xs font-semibold flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">bolt</span> Zero Traffic Congestion Bias
                  </span>
                </div>
                
                <p 
                  className="text-sm sm:text-base text-on-surface leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: aiResult.rationale }}
                />

                {/* Score Badges */}
                <div className="flex flex-wrap items-center gap-2 mt-1.5">
                  <div className="bg-surface-container-lowest px-2.5 py-1 rounded-lg text-xs text-on-surface border border-surface-container flex items-center gap-1.5 shadow-xs">
                    <span className="text-secondary font-bold">📍 Distance Score:</span>
                    <span className="font-bold text-primary">{aiResult.bestOption.distanceScore} / 10</span>
                  </div>
                  <div className="bg-surface-container-lowest px-2.5 py-1 rounded-lg text-xs text-on-surface border border-surface-container flex items-center gap-1.5 shadow-xs">
                    <span className="text-secondary font-bold">🛡️ Space Reliability:</span>
                    <span className="font-bold text-primary">{aiResult.bestOption.reliabilityPct}% Free Flow</span>
                  </div>
                  <div className="bg-surface-container-lowest px-2.5 py-1 rounded-lg text-xs text-on-surface border border-surface-container flex items-center gap-1.5 shadow-xs">
                    <span className="text-secondary font-bold">🏷️ Rate Value:</span>
                    <span className="font-bold text-on-surface">₹{aiResult.bestOption.calcPrice} / hr</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full lg:w-auto shrink-0">
              <button
                data-testid="reserve-ai-btn"
                onClick={() => {
                  onSelectFacility(aiResult.bestOption.id);
                  onBookTicket(aiResult.bestOption.id);
                }}
                className="px-5 py-3 rounded-lg bg-secondary text-on-secondary hover:bg-secondary-container font-semibold text-sm shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">directions_car</span>
                <span>Reserve &amp; Navigate ({aiResult.bestOption.tag})</span>
              </button>
              <button
                onClick={() => {
                  onSelectFacility(aiResult.bestOption.id);
                  scrollToDetail();
                }}
                className="px-4 py-3 rounded-lg bg-surface-container-lowest text-on-surface hover:bg-surface-container-high font-semibold text-sm border border-surface-container shadow-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">map</span>
                <span>Inspect Hub</span>
              </button>
            </div>
          </div>
        </section>
      )}

      {/* RESULTS WORKSPACE (Cards + Split Detail Panel) */}
      <section className="grid grid-cols-1 xl:grid-cols-12 gap-6 2xl:gap-8 items-start">
        
        {/* Left: Parking Cards (7 Cols) */}
        <div className="xl:col-span-7 flex flex-col gap-4">
          
          {/* Ownership Filter Bar: Public vs Private */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface-container-lowest p-3 rounded-2xl border border-surface-container shadow-xs">
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                type="button"
                onClick={() => setOwnershipFilter('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  ownershipFilter === 'all'
                    ? 'bg-primary text-on-primary shadow-xs'
                    : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-sm">tune</span>
                <span>All Parking</span>
                <span className={`text-[11px] px-1.5 py-0.2 rounded-full font-bold ${ownershipFilter === 'all' ? 'bg-on-primary/20 text-on-primary' : 'bg-surface-container text-on-surface'}`}>
                  {facilities.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setOwnershipFilter('public')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  ownershipFilter === 'public'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
                }`}
              >
                <span className="material-symbols-outlined text-sm">account_balance</span>
                <span>🏛️ Public Parking (BMC)</span>
                <span className={`text-[11px] px-1.5 py-0.2 rounded-full font-bold ${ownershipFilter === 'public' ? 'bg-white/25 text-white' : 'bg-emerald-200/80 text-emerald-900'}`}>
                  {totalPublicCount}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setOwnershipFilter('private')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  ownershipFilter === 'private'
                    ? 'bg-purple-700 text-white shadow-xs'
                    : 'bg-purple-50 text-purple-800 hover:bg-purple-100 border border-purple-200'
                }`}
              >
                <span className="material-symbols-outlined text-sm">domain</span>
                <span>🏢 Private Parking</span>
                <span className={`text-[11px] px-1.5 py-0.2 rounded-full font-bold ${ownershipFilter === 'private' ? 'bg-white/25 text-white' : 'bg-purple-200/80 text-purple-900'}`}>
                  {totalPrivateCount}
                </span>
              </button>
            </div>

            <div className="text-[11px] text-on-surface-variant font-medium sm:text-right">
              {ownershipFilter === 'public' && 'Showing BMC municipal lots (₹10-20/hr, FASTag)'}
              {ownershipFilter === 'private' && 'Showing private commercial arcades & chambers'}
              {ownershipFilter === 'all' && 'Showing both Public (BMC) & Private bays'}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pb-1">
            <div className="flex flex-col">
              <h2 className="font-headline font-bold text-lg text-on-surface tracking-tight">
                Showing {list.length} nearby parking spots
              </h2>
              <span className="text-xs text-on-surface-variant">
                Within 2.0 km radius of {currentDestination} • {ownershipFilter === 'public' ? 'Public (BMC) only' : ownershipFilter === 'private' ? 'Private Commercial only' : 'All facilities'}
              </span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* View Mode Toggle */}
              <div className="flex items-center gap-1 bg-surface-container-low p-1 rounded-xl border border-surface-container">
                <button
                  type="button"
                  data-testid="toggle-view-cards"
                  onClick={() => setViewMode('cards')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    viewMode === 'cards'
                      ? 'bg-surface-container-lowest text-on-surface shadow-xs font-bold'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">view_list</span>
                  <span>Cards</span>
                </button>
                <button
                  type="button"
                  data-testid="toggle-view-map"
                  onClick={() => setViewMode('map')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    viewMode === 'map'
                      ? 'bg-surface-container-lowest text-secondary shadow-xs font-bold'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm text-secondary">map</span>
                  <span>Live GPS Map</span>
                </button>
              </div>

              {/* Status Filter Pills */}
              <div className="flex items-center gap-1 bg-surface-container-low p-1 rounded-xl border border-surface-container">
                {['all', 'available', 'limited', 'full'].map(status => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
                      statusFilter === status
                        ? 'bg-surface-container-lowest text-on-surface shadow-xs font-bold'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results Area: Either Live GPS Map or Cards List */}
          {viewMode === 'map' ? (
            <div className="flex flex-col gap-4">
              <InteractiveMap
                facility={selectedFacility}
                currentWalk={list.find(f => f.id === selectedFacility.id)?.currentWalk ?? 4}
                currentDist={list.find(f => f.id === selectedFacility.id)?.currentDist ?? 0.8}
                userLocation={userLocation}
                destinationName={currentDestination}
                allFacilities={list}
                onSelectFacility={onSelectFacility}
                isFullView={true}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(list || []).slice(0, 6).map(f => (
                  <div
                    key={f.id}
                    onClick={() => onSelectFacility(f.id)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                      f.id === selectedFacility.id
                        ? 'bg-primary/10 border-primary shadow-xs'
                        : 'bg-surface-container-lowest border-surface-container hover:bg-surface-container-high'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                        f.id === selectedFacility.id ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-secondary'
                      }`}>
                        {f.shortCode}
                      </span>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-on-surface line-clamp-1">{f.name}</span>
                        <span className="text-[11px] text-on-surface-variant">{f.currentDist} km • {f.currentWalk} min walk</span>
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      f.ownershipType === 'private' ? 'bg-purple-100 text-purple-900 border border-purple-200' : 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                    }`}>
                      {f.ownershipType === 'private' ? 'Private' : 'BMC Public'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Cards List */
            <div className="flex flex-col gap-4">
              {list.length === 0 ? (
                <div className="bg-surface-container-lowest p-8 rounded-2xl border border-surface-container text-center flex flex-col items-center gap-3 my-2 shadow-xs">
                  <span className="material-symbols-outlined text-4xl text-on-surface-variant">search_off</span>
                  <h3 className="font-headline font-bold text-base text-on-surface">
                    No {ownershipFilter === 'public' ? 'Public (BMC)' : ownershipFilter === 'private' ? 'Private Commercial' : ''} facilities match your filters
                  </h3>
                  <p className="text-xs text-on-surface-variant max-w-sm">
                    Try clearing the status filter or switching between Public and Private parking.
                  </p>
                  <button
                    onClick={() => {
                      setOwnershipFilter('all');
                      setStatusFilter('all');
                    }}
                    className="px-4 py-2 bg-primary text-on-primary text-xs font-semibold rounded-lg shadow-xs cursor-pointer hover:bg-primary-container"
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : (
                list.map(facility => (
                  <ParkingCard
                    key={facility.id}
                    facility={facility}
                    isSelected={facility.id === selectedFacility?.id}
                    isAiBest={facility.id === aiResult?.bestOption?.id}
                    onSelect={() => {
                      onSelectFacility(facility.id);
                      scrollToDetail();
                    }}
                    onDirections={() => onGetDirections(`${facility.coords.lat},${facility.coords.lng}`)}
                  />
                ))
              )}
            </div>
          )}
        </div>

        {/* Right: Detail Inspection Panel (5 Cols) */}
        <div ref={detailPanelRef} className="xl:col-span-5 sticky top-24 flex flex-col gap-4">
          <DetailPanel
            facility={selectedFacility}
            destinationName={currentDestination}
            vehicleType={vehicleType}
            onBookTicket={() => onBookTicket(selectedFacility.id)}
            onGetDirections={() => onGetDirections(`${selectedFacility.coords.lat},${selectedFacility.coords.lng}`)}
            userLocation={userLocation}
            allFacilities={facilities}
            onSelectFacility={onSelectFacility}
          />
        </div>

      </section>

    </div>
  );
}
