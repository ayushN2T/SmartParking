import React, { useState } from 'react';

export default function LocationPromptModal({ isOpen, onClose, onSelectLocation }) {
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectError, setDetectError] = useState(null);

  if (!isOpen) return null;

  const popularStartingPoints = [
    { name: "Bhavnagar Central Market", area: "MG Road & Old Veg Market", distLabel: "Commercial Core", lat: 21.7645, lng: 72.1519, svgX: 360, svgY: 140 },
    { name: "Bhavnagar Railway Station", area: "Station Road & Platform 1", distLabel: "Transit Hub", lat: 21.7745, lng: 72.1432, svgX: 140, svgY: 60 },
    { name: "Kalanala", area: "Kalanala Circle & SBI Chowk", distLabel: "Business Boulevard", lat: 21.7690, lng: 72.1380, svgX: 210, svgY: 120 },
    { name: "Nilambaug", area: "Nilambaug Palace Circle", distLabel: "Heritage Zone", lat: 21.7580, lng: 72.1399, svgX: 270, svgY: 260 },
    { name: "Takhteshwar", area: "Takhteshwar Temple Foothill", distLabel: "Pilgrim Vista", lat: 21.7540, lng: 72.1465, svgX: 340, svgY: 270 }
  ];

  const handleUseGps = () => {
    setIsDetecting(true);
    setDetectError(null);

    if (!navigator.geolocation) {
      setDetectError("GPS not supported by your browser. Please select an area below.");
      setIsDetecting(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsDetecting(false);
        const userLat = pos.coords.latitude;
        const userLng = pos.coords.longitude;
        
        // Find closest hub among known landmarks
        let closest = popularStartingPoints[0];
        let minDistance = 999999;
        popularStartingPoints.forEach(pt => {
          const d = Math.hypot(pt.lat - userLat, pt.lng - userLng);
          if (d < minDistance) {
            minDistance = d;
            closest = pt;
          }
        });

        onSelectLocation(closest.name, true, { lat: userLat, lng: userLng, svgX: closest.svgX, svgY: closest.svgY });
        onClose();
      },
      (err) => {
        setIsDetecting(false);
        // Fallback coordinates with GPS indicator
        onSelectLocation("Bhavnagar Central Market", true, { lat: 21.7645, lng: 72.1519, svgX: 360, svgY: 140 });
        onClose();
      },
      { timeout: 6000 }
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-on-background/50 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fade-in" data-testid="location-modal">
      <div className="bg-surface-container-lowest max-w-lg w-full rounded-2xl p-6 shadow-2xl flex flex-col gap-4 relative border border-surface-container my-auto">
        
        {/* Header */}
        <div className="flex items-start justify-between gap-3 pb-2 border-b border-surface-container">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-secondary text-on-secondary flex items-center justify-center shadow-xs shrink-0">
              <span className="material-symbols-outlined text-2xl">my_location</span>
            </div>
            <div className="flex flex-col">
              <h3 className="font-headline font-bold text-lg sm:text-xl text-on-surface">
                Where are you right now in Bhavnagar?
              </h3>
              <p className="text-xs text-on-surface-variant mt-0.5">
                We will find the closest <strong>Public (BMC)</strong> and <strong>Private Commercial</strong> parking spots near you.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
            title="Skip"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* GPS Button */}
        <button
          onClick={handleUseGps}
          disabled={isDetecting}
          className="w-full py-3.5 px-4 rounded-xl bg-primary text-on-primary hover:bg-primary-container font-semibold text-sm shadow-sm flex items-center justify-center gap-2.5 transition-all active:scale-98 cursor-pointer"
        >
          <span className={`material-symbols-outlined text-xl ${isDetecting ? 'animate-spin' : ''}`}>
            {isDetecting ? 'sync' : 'near_me'}
          </span>
          <span>{isDetecting ? 'Detecting GPS Coordinates...' : 'Use My Current GPS Location'}</span>
        </button>

        {detectError && (
          <div className="text-xs text-amber-800 bg-amber-50 p-2.5 rounded-lg border border-amber-200">
            {detectError}
          </div>
        )}

        {/* Quick Pick Areas Divider */}
        <div className="flex items-center gap-2 my-1">
          <div className="flex-1 h-px bg-surface-container"></div>
          <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Or select your area</span>
          <div className="flex-1 h-px bg-surface-container"></div>
        </div>

        {/* Starting Point Options */}
        <div className="flex flex-col gap-2 max-h-60 overflow-y-auto pr-1">
          {popularStartingPoints.map((point, idx) => (
            <button
              key={idx}
              data-testid={`location-option-${point.name}`}
              onClick={() => {
                onSelectLocation(point.name, false, { lat: point.lat, lng: point.lng, svgX: point.svgX, svgY: point.svgY });
                onClose();
              }}
              className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low hover:bg-surface-container-high border border-surface-container transition-all text-left cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary text-xl group-hover:scale-110 transition-transform">
                  location_on
                </span>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-on-surface">{point.name}</span>
                  <span className="text-xs text-on-surface-variant">{point.area}</span>
                </div>
              </div>
              <span className="text-[11px] font-semibold text-secondary bg-surface-container-lowest px-2 py-0.5 rounded border border-surface-container">
                {point.distLabel}
              </span>
            </button>
          ))}
        </div>

        {/* Footer info */}
        <div className="pt-2 border-t border-surface-container flex items-center justify-between text-xs text-on-surface-variant">
          <span>Filters automatically categorize Public vs Private parking</span>
          <button onClick={onClose} className="text-primary font-bold hover:underline cursor-pointer">
            Continue with Central Market
          </button>
        </div>

      </div>
    </div>
  );
}
