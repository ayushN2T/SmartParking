import React, { useState } from 'react';

export default function Navbar({ activeView, setActiveView, onFindParkingClick, isDbConnected, userLocation, onOpenLocationModal }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'find-parking', label: 'Find Parking' },
    { id: 'parking-locations', label: 'Parking Locations' },
    { id: 'dashboard', label: 'Dashboard' }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-surface/85 backdrop-blur-md border-b border-surface-container">
      <div className="h-20 w-full max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <button 
          onClick={() => setActiveView('home')} 
          className="flex items-center gap-3 text-left group cursor-pointer focus:outline-none"
        >
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-on-primary shadow-sm group-hover:scale-105 transition-transform">
            <span className="material-symbols-outlined text-2xl font-bold">local_parking</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-headline font-bold text-lg text-on-surface tracking-tight leading-tight">
                Bhavnagar Smart Parking
              </span>
              <span className="hidden sm:inline-block bg-surface-container-high text-secondary text-xs px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                BMC Smart Mobility
              </span>
            </div>
            <span className="text-xs text-on-surface-variant font-medium">Urban Mobility &amp; Real-Time Parking System</span>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 p-1 bg-surface-container-low rounded-xl border border-surface-container">
          {navItems.map(item => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                  isActive
                    ? 'bg-primary-container text-on-primary-container shadow-xs'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Location Badge Button */}
          {userLocation && (
            <button
              onClick={onOpenLocationModal}
              className="hidden xl:flex items-center gap-1.5 bg-surface-container-lowest hover:bg-surface-container-high px-3 py-1.5 rounded-full border border-surface-container text-xs font-semibold text-on-surface transition-all cursor-pointer shadow-xs"
              title="Click to change your starting location in Bhavnagar"
            >
              <span className="material-symbols-outlined text-primary text-sm">my_location</span>
              <span className="max-w-[140px] truncate font-medium">{userLocation.name}</span>
              <span className="material-symbols-outlined text-xs text-on-surface-variant">swap_vert</span>
            </button>
          )}

          <div className="hidden lg:flex items-center gap-2 bg-surface-container-lowest px-3 py-1.5 rounded-full border border-surface-container shadow-xs">
            <span className={`h-2.5 w-2.5 rounded-full ${isDbConnected ? 'bg-primary' : 'bg-primary'} animate-pulse`}></span>
            <span className="text-xs font-bold text-primary">
              {isDbConnected ? 'BMC Live • 12 Zones' : '12 Zones Active'}
            </span>
          </div>

          <button
            onClick={onFindParkingClick}
            className="hidden sm:flex items-center gap-2 py-2 px-4 bg-primary text-on-primary hover:bg-primary-container font-semibold text-sm rounded-lg shadow-xs transition-all active:scale-95 cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">radar</span>
            <span>Find Parking</span>
          </button>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg bg-surface-container-low text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
            aria-label="Toggle navigation"
          >
            <span className="material-symbols-outlined">{mobileOpen ? 'close' : 'menu'}</span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden bg-surface-container-lowest border-b border-surface-container px-4 py-3 flex flex-col gap-2 shadow-md">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => {
                setActiveView(item.id);
                setMobileOpen(false);
              }}
              className={`text-left px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                activeView === item.id ? 'bg-primary/10 text-primary font-bold' : 'text-on-surface hover:bg-surface-container'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
