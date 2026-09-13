import React from 'react';

export default function Footer({ onNavigate }) {
  return (
    <footer className="w-full bg-surface-container-low border-t border-surface-container mt-16">
      <div className="max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-on-primary">
                <span className="material-symbols-outlined text-lg">local_parking</span>
              </div>
              <span className="font-headline font-bold text-base text-on-surface">Bhavnagar Smart Parking</span>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Bhavnagar Municipal Corporation (BMC) Smart City Initiative. Pioneering intelligent urban curb management, sensor networks, and real-time public mobility.
            </p>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="h-2 w-2 rounded-full bg-primary"></span>
              <span className="text-xs text-on-surface-variant">Systems Operational • 99.98% Sensor Uptime</span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface mb-1">Quick Links</h4>
            <button onClick={() => onNavigate('find-parking')} className="text-left text-xs text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer">Live Occupancy Map</button>
            <button onClick={() => onNavigate('parking-locations')} className="text-left text-xs text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer">Zone Directory</button>
            <button onClick={() => onNavigate('dashboard')} className="text-left text-xs text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer">Municipal Analytics</button>
            <button onClick={() => alert('Approved BMC Tariffs: Two-Wheelers ₹5-₹10/hr, Four-Wheelers ₹15-₹20/hr, Full Day Pass ₹100-₹120.')} className="text-left text-xs text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer">Tariff &amp; Fee Structure</button>
          </div>

          <div className="flex flex-col gap-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface mb-1">Civic Governance</h4>
            <a href="https://bmcgujarat.com" target="_blank" rel="noreferrer" className="text-xs text-on-surface-variant hover:text-on-surface transition-colors">BMC Municipal Portal</a>
            <a href="#" className="text-xs text-on-surface-variant hover:text-on-surface transition-colors">Smart City Mission Gujarat</a>
            <a href="#" className="text-xs text-on-surface-variant hover:text-on-surface transition-colors">Urban Transit Policy</a>
            <a href="#" className="text-xs text-on-surface-variant hover:text-on-surface transition-colors">Open Transit Data API</a>
          </div>

          <div className="flex flex-col gap-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface mb-1">Citizen Support</h4>
            <div className="bg-surface-container-lowest p-3 rounded-xl border border-surface-container shadow-xs flex flex-col gap-1">
              <span className="text-[11px] text-on-surface-variant uppercase font-bold tracking-wider">24/7 Citizen Helpline</span>
              <span className="text-sm text-secondary font-bold">0278-2424801</span>
              <span className="text-xs text-on-surface-variant">support-parking@bmc.gujarat.gov.in</span>
            </div>
          </div>

        </div>

        <div className="pt-6 border-t border-surface-container flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-on-surface-variant">
          <span>© 2025 Bhavnagar Municipal Corporation (BMC). All civic rights reserved.</span>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-on-surface transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-on-surface transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-on-surface transition-colors">Grievance Redressal</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
