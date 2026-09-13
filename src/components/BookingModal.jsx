import React, { useState } from 'react';

export default function BookingModal({ facility, isOpen, bookingPassData, onClose, onDirections }) {
  const [isBarrierOpen, setIsBarrierOpen] = useState(true);

  if (!isOpen || !facility) return null;

  const toggleBarrier = () => {
    setIsBarrierOpen(!isBarrierOpen);
  };

  const passCode = bookingPassData?.pass_code || `#BMC-PK-2025-${facility.shortCode}`;
  const bayCode = bookingPassData?.bay_code || `Bay #${facility.shortCode}-14`;
  const vehiclePlate = bookingPassData?.vehicle_plate || 'GJ-04-AB-1892';
  const tariffRate = bookingPassData?.tariff_rate ?? facility.pricePerHour;

  return (
    <div className="fixed inset-0 z-50 bg-on-background/40 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-surface-container-lowest max-w-lg w-full rounded-2xl p-5 sm:p-6 shadow-2xl flex flex-col gap-3 relative border border-surface-container my-auto">
        
        {/* Top Header */}
        <div className="flex items-start justify-between gap-3 pb-2 border-b border-surface-container">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary text-on-primary flex items-center justify-center shadow-xs shrink-0">
              <span className="material-symbols-outlined text-2xl">local_activity</span>
            </div>
            <div className="flex flex-col">
              <h3 className="font-headline font-bold text-base sm:text-lg text-on-surface">
                Bhavnagar Smart Parking Digital Pass
              </h3>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="bg-surface-container-high text-secondary text-xs px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                  BMC Transit Authority
                </span>
                <span className="inline-flex items-center gap-1 bg-primary-fixed text-on-primary-fixed-variant px-2 py-0.5 rounded-full text-xs font-bold">
                  <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span> Confirmed &amp; Active
                </span>
              </div>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
            title="Close Pass"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Facility Info Bar */}
        <div className="bg-surface-container-low p-3 rounded-xl border border-surface-container flex items-center justify-between gap-3">
          <div className="flex flex-col">
            <span className="text-xs uppercase text-on-surface-variant font-semibold">Assigned Facility</span>
            <span className="text-sm font-bold text-on-surface">{facility.name} ({facility.tag})</span>
            <span className="text-xs text-on-surface-variant">{facility.corridor}, Bhavnagar</span>
          </div>
          <div className="flex flex-col items-end shrink-0">
            <span className="bg-primary-container text-on-primary-container px-2.5 py-1 rounded-lg text-sm font-bold shadow-xs">
              {bayCode}
            </span>
            <span className="text-xs text-primary font-semibold mt-0.5">Level 1 (North Bay)</span>
          </div>
        </div>

        {/* QR Code Presentation */}
        <div className="bg-surface-container-low p-4 rounded-xl flex flex-col items-center justify-center gap-2 border border-surface-container relative">
          <div className="bg-surface-container-lowest p-3 rounded-xl shadow-xs border-2 border-dashed border-outline-variant/40 flex flex-col items-center">
            <svg className="text-on-surface" fill="currentColor" height="120" viewBox="0 0 150 150" width="120">
              <rect height="32" width="32" x="10" y="10"></rect>
              <rect fill="#ffffff" height="20" width="20" x="16" y="16"></rect>
              <rect height="10" width="10" x="21" y="21"></rect>
              <rect height="32" width="32" x="108" y="10"></rect>
              <rect fill="#ffffff" height="20" width="20" x="114" y="16"></rect>
              <rect height="10" width="10" x="119" y="21"></rect>
              <rect height="32" width="32" x="10" y="108"></rect>
              <rect fill="#ffffff" height="20" width="20" x="16" y="114"></rect>
              <rect height="10" width="10" x="21" y="119"></rect>
              <rect height="24" width="12" x="52" y="15"></rect>
              <rect height="12" width="18" x="76" y="12"></rect>
              <rect height="24" width="10" x="68" y="32"></rect>
              <rect height="12" width="46" x="52" y="64"></rect>
              <rect height="16" width="24" x="18" y="64"></rect>
              <rect height="18" width="28" x="108" y="58"></rect>
              <rect height="38" width="16" x="52" y="88"></rect>
              <rect height="16" width="28" x="80" y="88"></rect>
              <rect height="28" width="22" x="118" y="92"></rect>
              <rect height="22" width="22" x="80" y="116"></rect>
              <circle cx="75" cy="75" fill="#006948" r="12"></circle>
              <text fill="#ffffff" fontFamily="Plus Jakarta Sans" fontSize="9" fontWeight="800" textAnchor="middle" x="75" y="78">P</text>
            </svg>
            <span className="font-mono font-bold text-xs text-on-surface tracking-wider mt-1">
              {passCode}
            </span>
          </div>
          <span className="text-xs text-on-surface-variant text-center">
            Scan at automatic barrier scanner or present on vehicle dashboard
          </span>
        </div>

        {/* Vehicle Details */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-surface-container-low p-2 rounded-lg border border-surface-container">
            <span className="text-on-surface-variant block">Vehicle Plate</span>
            <span className="font-bold text-on-surface">{vehiclePlate}</span>
          </div>
          <div className="bg-surface-container-low p-2 rounded-lg border border-surface-container">
            <span className="text-on-surface-variant block">Authorized Tariff</span>
            <span className="font-bold text-primary">₹{tariffRate} / hr</span>
          </div>
        </div>

        {/* INTERACTIVE BOOM BARRIER SIMULATOR */}
        <div className="bg-surface-container-low p-3 rounded-xl border border-surface-container flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-base">contactless</span>
              <span className="text-xs font-bold text-on-surface">FASTag Contactless Boom Barrier</span>
              <span className="bg-primary/10 text-primary text-[10px] px-1.5 py-0.2 rounded font-bold">
                {isBarrierOpen ? 'NETC Active' : 'FASTag Paused'}
              </span>
            </div>

            <label className="relative inline-flex items-center cursor-pointer" title="Toggle FASTag Auto-Lift">
              <input
                type="checkbox"
                checked={isBarrierOpen}
                onChange={toggleBarrier}
                className="sr-only peer"
              />
              <div className="w-10 h-5 bg-outline-variant/40 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary transition-colors"></div>
            </label>
          </div>

          {/* Boom Barrier Graphical Stage */}
          <div className="relative w-full rounded-lg bg-surface-container-lowest p-2 border border-surface-container overflow-hidden shadow-xs">
            <div className="flex items-center justify-between pb-1 mb-1 border-b border-surface-container">
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isBarrierOpen ? 'bg-primary' : 'bg-error'} opacity-75`}></span>
                  <span className={`relative inline-flex rounded-full h-2 w-2 ${isBarrierOpen ? 'bg-primary' : 'bg-error'} transition-colors duration-300`}></span>
                </span>
                <span className={`text-[11px] font-bold uppercase tracking-wider ${isBarrierOpen ? 'text-primary' : 'text-error'}`}>
                  {isBarrierOpen ? 'BARRIER OPEN / AUTO-LIFTED' : 'BARRIER DOWN / CLOSED'}
                </span>
              </div>
              <button
                onClick={toggleBarrier}
                className="px-2 py-0.5 text-xs rounded bg-surface-container-low hover:bg-surface-container text-secondary font-semibold flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-xs">sync</span>
                <span>Test Lift</span>
              </button>
            </div>

            {/* Stage Animation Box */}
            <div className="relative h-24 w-full bg-surface-container-low rounded-md overflow-hidden flex items-end px-3 pb-2 border border-surface-container select-none">
              {/* Lane Markings */}
              <div className="absolute inset-x-0 bottom-0 h-4 bg-neutral-900/10 border-t border-dashed border-outline-variant flex items-center justify-around">
                <div className="w-8 h-1 bg-white/70 rounded"></div>
                <div className="w-8 h-1 bg-white/70 rounded"></div>
                <div className="w-8 h-1 bg-white/70 rounded"></div>
              </div>

              {/* RFID Sensor Beam */}
              <div className={`absolute left-8 top-2 right-12 h-14 pointer-events-none transition-opacity duration-500 ${isBarrierOpen ? 'opacity-100' : 'opacity-20'}`}>
                <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 200 60">
                  <path d="M 18 12 L 180 50" stroke="#006948" strokeWidth="1.5" strokeDasharray="4,3" className="animate-pulse"/>
                  <path d="M 18 16 L 160 55" stroke="#38bdf8" strokeWidth="1" strokeDasharray="3,3" opacity="0.6"/>
                </svg>
              </div>

              {/* Gate Post & Arm */}
              <div className="relative z-10 flex flex-col items-center">
                {/* Traffic LED Light */}
                <div className="w-3.5 h-5 rounded-t-sm bg-neutral-800 flex flex-col items-center justify-around p-0.5 border border-neutral-700">
                  <div className={`w-2 h-2 rounded-full transition-all duration-300 ${isBarrierOpen ? 'bg-primary shadow-[0_0_8px_rgba(0,105,72,0.9)]' : 'bg-neutral-600'}`}></div>
                  <div className={`w-2 h-2 rounded-full transition-all duration-300 ${!isBarrierOpen ? 'bg-error shadow-[0_0_8px_rgba(186,26,26,0.9)]' : 'bg-neutral-600'}`}></div>
                </div>
                {/* Gate Housing Base */}
                <div className="w-6 h-12 bg-amber-500 rounded-sm shadow-xs flex flex-col items-center justify-between py-1 border border-amber-600">
                  <span className="w-4 h-0.5 bg-neutral-800 rounded-full"></span>
                  <div className="w-4 h-4 bg-neutral-900 rounded-full flex items-center justify-center text-[7px] font-bold text-white">RFID</div>
                  <span className="w-4 h-0.5 bg-neutral-800 rounded-full"></span>
                </div>
                {/* Rotating Boom Pole */}
                <div className="absolute top-6 left-2.5 w-5 h-5 rounded-full bg-neutral-900 border-2 border-neutral-300 shadow-md flex items-center justify-center z-20">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400"></div>
                  <div
                    className="absolute left-1.5 w-44 sm:w-52 h-3 rounded-r-full shadow-md origin-left transition-transform duration-700 ease-out flex items-center overflow-hidden border border-neutral-800"
                    style={{
                      transform: isBarrierOpen ? 'rotate(-72deg)' : 'rotate(0deg)',
                      background: 'repeating-linear-gradient(135deg, #ba1a1a 0px, #ba1a1a 10px, #ffffff 10px, #ffffff 20px)'
                    }}
                  ></div>
                </div>
              </div>

              {/* Approaching Vehicle */}
              <div className="ml-auto relative z-10 flex flex-col items-center">
                <span className="text-[9px] font-mono font-bold bg-white/90 px-1.5 py-0.5 rounded shadow-xs mb-0.5">{vehiclePlate}</span>
                <div className="w-20 h-8 bg-secondary rounded-t-lg relative flex items-center justify-center shadow-xs">
                  <div className="w-10 h-3 bg-white/80 rounded-t-sm mb-1.5"></div>
                  <div className="absolute bottom-0 left-1.5 w-3 h-3 bg-neutral-900 rounded-full"></div>
                  <div className="absolute bottom-0 right-1.5 w-3 h-3 bg-neutral-900 rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Readout Feedback */}
            <div className="text-xs pt-1">
              <span className={`font-bold flex items-center gap-1 ${isBarrierOpen ? 'text-primary' : 'text-error'}`}>
                <span className="material-symbols-outlined text-sm">
                  {isBarrierOpen ? 'check_circle' : 'front_hand'}
                </span>
                {isBarrierOpen ? 'Gate Boom Arm: LIFTED (FASTag RFID Detected)' : 'Gate Boom Arm: DOWN (Manual Token Required)'}
              </span>
              <span className="text-[11px] text-on-surface-variant block mt-0.5">
                {isBarrierOpen ? `Vehicle ${vehiclePlate} detected • Instant contactless clearance` : 'Present QR code at ticket scanner kiosk upon arrival'}
              </span>
            </div>
          </div>
        </div>

        {/* Modal Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={onDirections}
            className="py-2.5 px-3 rounded-lg bg-secondary text-on-secondary hover:bg-secondary-container font-semibold text-xs shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">navigation</span>
            <span>Open in Google Maps</span>
          </button>
          <button
            onClick={onClose}
            className="py-2.5 px-3 rounded-lg bg-surface-container-low text-on-surface hover:bg-surface-container font-semibold text-xs cursor-pointer"
          >
            <span>Done / Close</span>
          </button>
        </div>

      </div>
    </div>
  );
}
