// Bhavnagar Smart Parking MVP - Main Application Controller
import { PARKING_FACILITIES, POPULAR_DESTINATIONS, getCitywideStats } from './data/parkingLots.js';
import { evaluateParkingOptions } from './services/aiRecommender.js';

// Application State
const state = {
  activeView: 'find-parking', // 'home' | 'find-parking' | 'parking-locations' | 'dashboard'
  currentDestination: 'Bhavnagar Central Market',
  selectedVehicleType: '4w', // '4w' | '2w' | 'ev'
  selectedSort: 'match', // 'match' | 'distance' | 'price' | 'spaces'
  activeStatusFilter: 'all', // 'all' | 'available' | 'limited' | 'full'
  selectedFacilityId: 'parking-a',
  dashboardZone: 'all',
  facilities: JSON.parse(JSON.stringify(PARKING_FACILITIES)),
  fastagAutoDebit: true,
  liveTickerCounter: 344
};

// Security helper: Safe HTML escaping for user inputs
function escapeHTML(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/[&<>'"]/g, tag => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;'
  }[tag] || tag));
}

// Global initialization
document.addEventListener('DOMContentLoaded', () => {
  setupNavigation();
  setupEventListeners();
  renderCurrentView();
  startLiveTicker();
});

// Setup navigation bar links & view switching
function setupNavigation() {
  const navLinks = document.querySelectorAll('[data-nav-view]');
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetView = link.getAttribute('data-nav-view');
      if (targetView) {
        switchView(targetView);
      }
    });
  });

  // Mobile menu toggles
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  if (mobileToggle && mobileNav) {
    mobileToggle.addEventListener('click', () => {
      mobileNav.classList.toggle('hidden');
    });
  }
}

export function switchView(viewName) {
  state.activeView = viewName;

  // Update Nav links styling
  document.querySelectorAll('[data-nav-view]').forEach(link => {
    const linkView = link.getAttribute('data-nav-view');
    if (linkView === viewName) {
      link.classList.add('bg-primary-container', 'text-on-primary-container', 'font-semibold', 'shadow-sm');
      link.classList.remove('text-on-surface-variant');
    } else {
      link.classList.remove('bg-primary-container', 'text-on-primary-container', 'font-semibold', 'shadow-sm');
      link.classList.add('text-on-surface-variant');
    }
  });

  // Toggle View Containers
  const views = ['home-view', 'find-parking-view', 'parking-locations-view', 'dashboard-view'];
  views.forEach(v => {
    const el = document.getElementById(v);
    if (el) {
      if (v === `${viewName}-view`) {
        el.classList.remove('hidden');
      } else {
        el.classList.add('hidden');
      }
    }
  });

  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Refresh view specific components
  if (viewName === 'find-parking') {
    renderFindParkingView();
  } else if (viewName === 'parking-locations') {
    renderDirectoryView();
  } else if (viewName === 'dashboard') {
    renderDashboardView();
  } else if (viewName === 'home') {
    renderHomeView();
  }
}

// Master view rendering
function renderCurrentView() {
  switchView(state.activeView);
}

// ==========================================
// 1. HOME / LANDING PAGE CONTROLLER
// ==========================================
function renderHomeView() {
  const container = document.getElementById('home-view');
  if (!container) return;

  const stats = getCitywideStats(state.facilities);
  const quickChipsContainer = document.getElementById('home-popular-chips');
  if (quickChipsContainer) {
    quickChipsContainer.innerHTML = POPULAR_DESTINATIONS.map(d => `
      <button class="dest-chip-home px-4 py-2 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md transition-all flex items-center gap-2 border border-surface-container shadow-xs" data-dest="${escapeHTML(d.name)}">
        <span class="material-symbols-outlined text-primary text-base">location_on</span>
        <span>${escapeHTML(d.name)}</span>
      </button>
    `).join('');

    quickChipsContainer.querySelectorAll('.dest-chip-home').forEach(btn => {
      btn.addEventListener('click', () => {
        const dest = btn.getAttribute('data-dest');
        if (dest) {
          state.currentDestination = dest;
          switchView('find-parking');
        }
      });
    });
  }

  // Update hero stats
  const heroAvail = document.getElementById('home-kpi-available');
  if (heroAvail) heroAvail.textContent = `${stats.availableSpaces} Free Bays`;
}

// ==========================================
// 2. FIND PARKING & AI RECOMMENDATION VIEW
// ==========================================
function renderFindParkingView() {
  const destInput = document.getElementById('destination-input');
  if (destInput) destInput.value = state.currentDestination;

  // Render Popular Destination Chips
  const chipsContainer = document.getElementById('popular-dest-chips');
  if (chipsContainer) {
    chipsContainer.innerHTML = POPULAR_DESTINATIONS.map(d => {
      const isActive = d.name === state.currentDestination;
      const activeClasses = isActive ? 'bg-secondary text-on-secondary shadow-xs' : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface hover:bg-surface-container';
      return `
        <button class="dest-chip px-3 py-1.5 rounded-full font-label-sm text-label-sm transition-all ${activeClasses}" data-destination="${escapeHTML(d.name)}">
          ${escapeHTML(d.name)}
        </button>
      `;
    }).join('');

    chipsContainer.querySelectorAll('.dest-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const dest = chip.getAttribute('data-destination');
        if (dest) {
          state.currentDestination = dest;
          renderFindParkingView();
        }
      });
    });
  }

  // Run Dynamic AI Evaluation
  const aiResult = evaluateParkingOptions(state.facilities, state.currentDestination, state.selectedVehicleType);
  renderAIRecommendationBox(aiResult);

  // Filter & Sort Parking Facilities for List Display
  let list = state.facilities.map(f => {
    const dist = f.distanceKm[state.currentDestination] ?? 1.5;
    const walk = f.walkMins[state.currentDestination] ?? 8;
    const price = state.selectedVehicleType === '2w' ? f.twoWheelerPricePerHour : f.pricePerHour;
    return {
      ...f,
      currentDist: dist,
      currentWalk: walk,
      currentPrice: price
    };
  });

  // Apply Status Filter
  if (state.activeStatusFilter !== 'all') {
    list = list.filter(f => f.status === state.activeStatusFilter);
  }

  // Apply Vehicle Filter (for EV)
  if (state.selectedVehicleType === 'ev') {
    list = list.filter(f => (f.evChargingSpaces || 0) > 0);
  }

  // Apply Sorting
  if (state.selectedSort === 'distance') {
    list.sort((a, b) => a.currentDist - b.currentDist);
  } else if (state.selectedSort === 'price') {
    list.sort((a, b) => a.currentPrice - b.currentPrice);
  } else if (state.selectedSort === 'spaces') {
    list.sort((a, b) => b.availableSpaces - a.availableSpaces);
  } else {
    // Smart match: prioritize AI recommendation top choices
    const scoredIds = aiResult.allScored.map(s => s.id);
    list.sort((a, b) => {
      const idxA = scoredIds.indexOf(a.id);
      const idxB = scoredIds.indexOf(b.id);
      return (idxA !== -1 ? idxA : 999) - (idxB !== -1 ? idxB : 999);
    });
  }

  // Render Parking Cards
  renderParkingCards(list, aiResult.bestOption ? aiResult.bestOption.id : null);

  // If selected facility not in list or not set, select best option
  if (!list.find(f => f.id === state.selectedFacilityId)) {
    if (aiResult.bestOption) {
      state.selectedFacilityId = aiResult.bestOption.id;
    } else if (list.length > 0) {
      state.selectedFacilityId = list[0].id;
    }
  }

  // Render Right Split Detail & Map Panel
  renderFacilityDetailPanel(state.selectedFacilityId);

  // Update Results Header Count
  const countTitle = document.getElementById('results-count-title');
  const landmarkSubtitle = document.getElementById('results-near-landmark');
  if (countTitle) {
    countTitle.textContent = `Showing ${list.length} verified parking facilities`;
  }
  if (landmarkSubtitle) {
    landmarkSubtitle.textContent = `Within 2.0 km radius of ${state.currentDestination}`;
  }
}

// Render AI Recommendation Box
function renderAIRecommendationBox(aiResult) {
  if (!aiResult || !aiResult.bestOption) return;

  const best = aiResult.bestOption;
  const aiText = document.getElementById('ai-dynamic-text');
  if (aiText) {
    aiText.innerHTML = aiResult.rationale;
  }

  const scoreBadge = document.getElementById('ai-metric-score');
  const reliabilityBadge = document.getElementById('ai-metric-reliability');
  const rateBadge = document.getElementById('ai-metric-rate');

  if (scoreBadge) scoreBadge.textContent = `${best.distanceScore || '9.6'} / 10`;
  if (reliabilityBadge) reliabilityBadge.textContent = `${best.reliabilityPct || '88'}% Free Flow`;
  if (rateBadge) rateBadge.textContent = `₹${best.calcPrice || best.pricePerHour} / hr`;

  const aiActionBtn = document.getElementById('btn-quick-reserve-ai');
  if (aiActionBtn) {
    aiActionBtn.innerHTML = `
      <span class="material-symbols-outlined text-base">directions_car</span>
      <span>Reserve & Navigate (${escapeHTML(best.tag)})</span>
    `;
    aiActionBtn.onclick = () => {
      state.selectedFacilityId = best.id;
      renderFacilityDetailPanel(best.id);
      openBookingModal(best.id);
    };
  }
}

// Render Parking Cards Grid
function renderParkingCards(facilities, bestOptionId) {
  const container = document.getElementById('parking-cards-container');
  if (!container) return;

  if (facilities.length === 0) {
    container.innerHTML = `
      <div class="bg-surface-container-lowest p-space-lg rounded-xl text-center flex flex-col items-center justify-center gap-space-sm border border-surface-container">
        <span class="material-symbols-outlined text-4xl text-outline">search_off</span>
        <h3 class="font-headline-sm text-headline-sm text-on-surface">No facilities match your current filters</h3>
        <p class="font-body-sm text-body-sm text-on-surface-variant">Try selecting "All" statuses or changing vehicle type to see nearby parking.</p>
        <button class="px-4 py-2 bg-primary text-on-primary rounded-lg font-label-md text-label-md" id="btn-reset-filters">Reset Filters</button>
      </div>
    `;
    const resetBtn = document.getElementById('btn-reset-filters');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        state.activeStatusFilter = 'all';
        state.selectedVehicleType = '4w';
        renderFindParkingView();
      });
    }
    return;
  }

  container.innerHTML = facilities.map(facility => {
    const isSelected = facility.id === state.selectedFacilityId;
    const isAiBest = facility.id === bestOptionId;
    const freePct = facility.totalSpaces > 0 ? Math.round((facility.availableSpaces / facility.totalSpaces) * 100) : 0;

    let badgeClass = 'badge-available';
    let dotPulse = '<span class="w-2 h-2 rounded-full bg-primary animate-ping"></span>';
    let statusText = 'Available';
    let barColor = 'bg-primary';

    if (facility.status === 'limited') {
      badgeClass = 'badge-limited';
      dotPulse = '<span class="w-2 h-2 rounded-full bg-amber-500"></span>';
      statusText = 'Limited';
      barColor = 'bg-amber-500';
    } else if (facility.status === 'full') {
      badgeClass = 'badge-full';
      dotPulse = '<span class="material-symbols-outlined text-xs">lock</span>';
      statusText = `Full (${facility.availableSpaces}/${facility.totalSpaces})`;
      barColor = 'bg-error';
    }

    const ringClass = isSelected ? 'ring-2 ring-primary shadow-md' : 'shadow-sm';

    return `
      <div class="parking-card group relative bg-surface-container-lowest p-space-md rounded-xl ${ringClass} transition-all cursor-pointer border border-surface-container" data-id="${escapeHTML(facility.id)}">
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-sm pb-space-sm">
          <div class="flex items-center gap-space-sm">
            <div class="w-10 h-10 rounded-lg ${isAiBest ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-secondary'} font-headline-sm flex items-center justify-center font-bold">
              ${escapeHTML(facility.shortCode)}
            </div>
            <div>
              <div class="flex items-center gap-space-xs flex-wrap">
                <h3 class="font-title-md text-title-md text-on-surface group-hover:text-primary transition-colors font-bold">
                  ${escapeHTML(facility.name)} (${escapeHTML(facility.tag)})
                </h3>
                ${isAiBest ? '<span class="bg-primary/10 text-primary px-2 py-0.5 rounded font-label-sm text-xs font-bold">Top AI Choice</span>' : ''}
              </div>
              <div class="flex items-center gap-2 mt-0.5 text-on-surface-variant font-body-sm text-body-sm flex-wrap">
                <span class="flex items-center gap-0.5 text-on-surface font-semibold">
                  <span class="material-symbols-outlined text-sm text-secondary">location_on</span>
                  ${facility.currentDist} km
                </span>
                <span>•</span>
                <span class="flex items-center gap-0.5 font-medium">
                  <span class="material-symbols-outlined text-sm text-primary">directions_walk</span>
                  ${facility.currentWalk} min walk
                </span>
                <span>•</span>
                <span class="text-on-surface-variant text-xs">${escapeHTML(facility.corridor)}</span>
              </div>
            </div>
          </div>
          
          <!-- Status Badge -->
          <div class="flex items-center gap-space-xs shrink-0">
            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-label-sm text-label-sm font-bold uppercase tracking-wider ${badgeClass}">
              ${dotPulse}
              ${statusText}
            </span>
          </div>
        </div>

        <!-- Occupancy Bar -->
        <div class="bg-surface-container-low p-space-sm rounded-lg my-1 flex flex-col gap-1.5">
          <div class="flex items-center justify-between font-label-sm text-label-sm">
            <span class="text-on-surface-variant">Real-Time Sensor Capacity:</span>
            <span class="font-bold ${facility.status === 'full' ? 'text-error' : facility.status === 'limited' ? 'text-amber-800' : 'text-primary'}">
              ${facility.availableSpaces} / ${facility.totalSpaces} spaces available (${freePct}% free)
            </span>
          </div>
          <div class="w-full bg-surface-container h-2 rounded-full overflow-hidden">
            <div class="${barColor} h-full rounded-full transition-all duration-500" style="width: ${freePct}%"></div>
          </div>
        </div>

        <!-- Amenities & Action Row -->
        <div class="flex flex-wrap items-center justify-between gap-space-sm pt-space-xs mt-1">
          <div class="flex flex-wrap items-center gap-1.5">
            ${facility.amenities.slice(0, 3).map(amenity => `
              <span class="inline-flex items-center gap-1 text-on-surface-variant bg-surface-container px-2 py-0.5 rounded font-label-sm text-xs">
                ${escapeHTML(amenity)}
              </span>
            `).join('')}
          </div>
          <div class="flex items-center gap-space-sm">
            <div class="flex flex-col text-right mr-1">
              <span class="font-headline-sm text-headline-sm text-on-surface font-bold leading-tight">
                ₹${facility.currentPrice}<span class="font-body-sm text-body-sm font-normal text-on-surface-variant">/hr</span>
              </span>
            </div>
            <button class="btn-select-card px-4 py-2 rounded-lg ${isSelected ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-on-surface hover:bg-secondary hover:text-on-secondary'} font-label-md text-label-md shadow-sm transition-all" data-target="${escapeHTML(facility.id)}">
              View Details
            </button>
            <button class="btn-open-nav p-2 rounded-lg bg-surface-container-low text-on-surface hover:bg-surface-container transition-colors" data-coords="${facility.coords.lat},${facility.coords.lng}" title="Directions in Google Maps">
              <span class="material-symbols-outlined text-base">near_me</span>
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');

  // Attach card event handlers
  container.querySelectorAll('.parking-card').forEach(card => {
    card.addEventListener('click', () => {
      const id = card.getAttribute('data-id');
      if (id) {
        state.selectedFacilityId = id;
        renderFindParkingView();
      }
    });
  });

  container.querySelectorAll('.btn-select-card').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.getAttribute('data-target');
      if (id) {
        state.selectedFacilityId = id;
        renderFindParkingView();
        scrollToMapPreview();
      }
    });
  });

  container.querySelectorAll('.btn-open-nav').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const coords = btn.getAttribute('data-coords');
      if (coords) openExternalDirections(coords);
    });
  });
}

// Render Right Panel (Parking Details + Realistic SVG Map Visual)
function renderFacilityDetailPanel(facilityId) {
  const facility = state.facilities.find(f => f.id === facilityId) || state.facilities[0];
  if (!facility) return;

  const currentDist = facility.distanceKm[state.currentDestination] ?? 1.5;
  const currentWalk = facility.walkMins[state.currentDestination] ?? 8;
  const currentPrice = state.selectedVehicleType === '2w' ? facility.twoWheelerPricePerHour : facility.pricePerHour;

  const tagElem = document.getElementById('inspect-tag');
  const nameElem = document.getElementById('inspect-name');
  const addrElem = document.getElementById('inspect-address');
  const priceElem = document.getElementById('inspect-price-large');
  const statusElem = document.getElementById('inspect-live-status');
  const bays4wElem = document.getElementById('inspect-4w-bays');
  const bays2wElem = document.getElementById('inspect-2w-bays');
  const rateCarElem = document.getElementById('inspect-rate-car');
  const rateBikeElem = document.getElementById('inspect-rate-bike');
  const dayPassElem = document.getElementById('inspect-rate-pass');
  const pin = document.getElementById('svg-parking-pin');
  const walkRoute = document.getElementById('walk-route');
  const mapDistanceOverlay = document.getElementById('map-distance-overlay');

  if (tagElem) tagElem.textContent = facility.tag;
  if (nameElem) nameElem.textContent = facility.name;
  if (addrElem) addrElem.textContent = facility.address;
  if (priceElem) priceElem.textContent = `₹${currentPrice}`;
  if (bays4wElem) bays4wElem.textContent = `${facility.fourWheelerSpaces.available} / ${facility.fourWheelerSpaces.total} Free`;
  if (bays2wElem) bays2wElem.textContent = `${facility.twoWheelerSpaces.available} / ${facility.twoWheelerSpaces.total} Free`;
  if (rateCarElem) rateCarElem.textContent = `₹${facility.pricePerHour} / hr`;
  if (rateBikeElem) rateBikeElem.textContent = `₹${facility.twoWheelerPricePerHour} / hr`;
  if (dayPassElem) dayPassElem.textContent = `₹${facility.fullDayPass} flat`;

  if (statusElem) {
    if (facility.status === 'available') {
      statusElem.innerHTML = `<span class="w-2 h-2 rounded-full bg-primary animate-pulse"></span> Available • Instant Entry`;
      statusElem.className = 'text-primary font-label-sm text-label-sm font-bold flex items-center gap-1';
    } else if (facility.status === 'limited') {
      statusElem.innerHTML = `<span class="w-2 h-2 rounded-full bg-amber-500"></span> Limited Bays • High Congestion`;
      statusElem.className = 'text-amber-800 font-label-sm text-label-sm font-bold flex items-center gap-1';
    } else {
      statusElem.innerHTML = `<span class="material-symbols-outlined text-xs text-error">lock</span> Saturated • Full`;
      statusElem.className = 'text-error font-label-sm text-label-sm font-bold flex items-center gap-1';
    }
  }

  // Update SVG map coordinates & route line
  if (pin && facility.svgCoords) {
    pin.setAttribute('transform', `translate(${facility.svgCoords.x}, ${facility.svgCoords.y})`);
    const pinText = pin.querySelector('text');
    if (pinText) pinText.textContent = facility.shortCode.charAt(0);
  }

  if (walkRoute && facility.svgCoords) {
    walkRoute.setAttribute('d', `M ${facility.svgCoords.x} ${facility.svgCoords.y} L 250 ${facility.svgCoords.y} L 250 100 L 360 100`);
  }

  if (mapDistanceOverlay) {
    mapDistanceOverlay.innerHTML = `
      <span class="w-2 h-2 rounded-full bg-primary"></span>
      <span>Pedestrian Track: <strong>${currentWalk} min (${currentDist} km)</strong></span>
    `;
  }

  // Setup Directions & Booking CTA
  const btnNav = document.getElementById('btn-trigger-navigation');
  if (btnNav) {
    btnNav.onclick = () => openExternalDirections(`${facility.coords.lat},${facility.coords.lng}`);
  }

  const btnBook = document.getElementById('btn-book-ticket');
  if (btnBook) {
    btnBook.onclick = () => openBookingModal(facility.id);
  }
}

// Open Google Maps Directions
export function openExternalDirections(coords) {
  const facility = state.facilities.find(f => f.id === state.selectedFacilityId);
  const target = coords || (facility ? `${facility.coords.lat},${facility.coords.lng}` : '21.7645,72.1519');
  const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(target)}`;
  window.open(url, '_blank');
}

export function scrollToMapPreview() {
  const panel = document.getElementById('facility-detail-panel');
  if (panel && window.innerWidth < 1280) {
    panel.scrollIntoView({ behavior: 'smooth' });
  }
}

// ==========================================
// 3. BOOKING / FASTAG DIGITAL PASS & BOOM BARRIER
// ==========================================
export function openBookingModal(facilityId) {
  const modal = document.getElementById('booking-modal');
  if (!modal) return;

  const facility = state.facilities.find(f => f.id === facilityId) || state.facilities[0];
  const passFacilityName = document.getElementById('pass-facility-name');
  const passCode = document.getElementById('ticket-pass-code');
  const passTariff = document.getElementById('pass-tariff-rate');
  const passBay = document.getElementById('pass-bay-number');

  if (passFacilityName) passFacilityName.textContent = `${facility.name} (${facility.tag})`;
  if (passCode) passCode.textContent = `BMC-BHV-${Math.floor(1000 + Math.random() * 9000)}-${facility.shortCode}`;
  if (passTariff) passTariff.textContent = `₹${facility.pricePerHour} / hr`;
  if (passBay) passBay.textContent = `Bay #${facility.shortCode}-${Math.floor(10 + Math.random() * 40)}`;

  // Synchronize Boom Barrier State with FASTag toggle
  updateBoomBarrierState(state.fastagAutoDebit);

  modal.classList.remove('hidden');
}

export function closeBookingModal() {
  const modal = document.getElementById('booking-modal');
  if (modal) modal.classList.add('hidden');
}

export function updateBoomBarrierState(isOpen) {
  state.fastagAutoDebit = isOpen;
  const arm = document.getElementById('gate-boom-arm');
  const ledGreen = document.getElementById('traffic-led-green');
  const ledRed = document.getElementById('traffic-led-red');
  const beaconDot = document.getElementById('barrier-beacon-dot');
  const beaconPing = document.getElementById('barrier-beacon-ping');
  const statusPill = document.getElementById('barrier-status-pill');
  const textFeedback = document.getElementById('barrier-text-feedback');
  const subtextFeedback = document.getElementById('barrier-subtext-feedback');
  const sensorBeam = document.getElementById('sensor-beam-layer');
  const fastagBadge = document.getElementById('fastag-netc-badge');
  const fastagToggle = document.getElementById('fastag-toggle');

  if (fastagToggle) fastagToggle.checked = isOpen;

  if (isOpen) {
    if (arm) arm.style.transform = 'rotate(-72deg)';
    if (ledGreen) ledGreen.className = 'w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_8px_rgba(0,105,72,0.9)] transition-all duration-300';
    if (ledRed) ledRed.className = 'w-2.5 h-2.5 rounded-full bg-neutral-600 transition-all duration-300';
    if (beaconDot) beaconDot.className = 'relative inline-flex rounded-full h-2.5 w-2.5 bg-primary transition-colors duration-300';
    if (beaconPing) beaconPing.className = 'animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75';
    if (statusPill) {
      statusPill.textContent = 'BARRIER OPEN / AUTO-LIFTED';
      statusPill.className = 'font-label-sm text-xs font-bold uppercase tracking-wider text-primary';
    }
    if (textFeedback) {
      textFeedback.innerHTML = '<span class="material-symbols-outlined text-sm">check_circle</span> Gate Boom Arm: LIFTED (FASTag RFID Detected)';
      textFeedback.className = 'font-bold text-primary flex items-center gap-1';
    }
    if (subtextFeedback) {
      subtextFeedback.textContent = 'Vehicle GJ-04-AB-1892 detected • Instant contactless clearance';
    }
    if (sensorBeam) sensorBeam.style.opacity = '1';
    if (fastagBadge) {
      fastagBadge.textContent = 'NETC Active';
      fastagBadge.className = 'bg-primary/10 text-primary font-label-sm text-xs px-1.5 py-0.5 rounded font-bold uppercase tracking-wide';
    }
  } else {
    if (arm) arm.style.transform = 'rotate(0deg)';
    if (ledGreen) ledGreen.className = 'w-2.5 h-2.5 rounded-full bg-neutral-600 transition-all duration-300';
    if (ledRed) ledRed.className = 'w-2.5 h-2.5 rounded-full bg-error shadow-[0_0_8px_rgba(186,26,26,0.9)] transition-all duration-300';
    if (beaconDot) beaconDot.className = 'relative inline-flex rounded-full h-2.5 w-2.5 bg-error transition-colors duration-300';
    if (beaconPing) beaconPing.className = 'animate-ping absolute inline-flex h-full w-full rounded-full bg-error opacity-75';
    if (statusPill) {
      statusPill.textContent = 'BARRIER DOWN / CLOSED';
      statusPill.className = 'font-label-sm text-xs font-bold uppercase tracking-wider text-error';
    }
    if (textFeedback) {
      textFeedback.innerHTML = '<span class="material-symbols-outlined text-sm text-error">front_hand</span> Gate Boom Arm: DOWN (Manual Ticket Required)';
      textFeedback.className = 'font-bold text-error flex items-center gap-1';
    }
    if (subtextFeedback) {
      subtextFeedback.textContent = 'Present digital QR code at manual barrier scanner upon entry';
    }
    if (sensorBeam) sensorBeam.style.opacity = '0.15';
    if (fastagBadge) {
      fastagBadge.textContent = 'FASTag Paused';
      fastagBadge.className = 'bg-surface-container text-on-surface-variant font-label-sm text-xs px-1.5 py-0.5 rounded font-bold uppercase tracking-wide';
    }
  }
}

// ==========================================
// 4. PARKING LOCATIONS (DIRECTORY VIEW)
// ==========================================
function renderDirectoryView() {
  const container = document.getElementById('directory-grid');
  if (!container) return;

  const searchInput = document.getElementById('directory-search');
  const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
  const zoneSelect = document.getElementById('directory-zone-filter');
  const zone = zoneSelect ? zoneSelect.value : 'all';

  let filtered = state.facilities;
  if (zone !== 'all') {
    filtered = filtered.filter(f => f.zone.toLowerCase().includes(zone.toLowerCase()));
  }
  if (query) {
    filtered = filtered.filter(f => f.name.toLowerCase().includes(query) || f.address.toLowerCase().includes(query) || f.zone.toLowerCase().includes(query));
  }

  container.innerHTML = filtered.map(facility => `
    <div class="bg-surface-container-lowest p-space-md rounded-xl border border-surface-container shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
      <div class="flex flex-col gap-2">
        <div class="flex items-start justify-between gap-2">
          <div>
            <span class="px-2 py-0.5 rounded bg-surface-container-high text-secondary font-label-sm text-xs font-bold uppercase">${escapeHTML(facility.zone)}</span>
            <h3 class="font-headline-sm text-lg text-on-surface font-bold mt-1">${escapeHTML(facility.name)}</h3>
            <span class="text-xs text-on-surface-variant">${escapeHTML(facility.tag)} • ${escapeHTML(facility.corridor)}</span>
          </div>
          <span class="px-2.5 py-1 rounded-full font-label-sm text-xs font-bold uppercase ${facility.status === 'available' ? 'badge-available' : facility.status === 'limited' ? 'badge-limited' : 'badge-full'}">
            ${escapeHTML(facility.status)}
          </span>
        </div>
        <p class="text-xs text-on-surface-variant mt-1">${escapeHTML(facility.address)}</p>
        
        <div class="grid grid-cols-2 gap-2 my-2 bg-surface-container-low p-2 rounded-lg">
          <div>
            <span class="text-xs text-on-surface-variant block">Capacity</span>
            <span class="font-bold text-sm text-on-surface">${facility.availableSpaces} / ${facility.totalSpaces} Available</span>
          </div>
          <div>
            <span class="text-xs text-on-surface-variant block">Hourly Rate</span>
            <span class="font-bold text-sm text-primary">₹${facility.pricePerHour} / hr</span>
          </div>
        </div>
      </div>

      <div class="flex items-center gap-2 pt-2 border-t border-surface-container">
        <button class="flex-1 py-2 px-3 bg-secondary text-on-secondary rounded-lg font-label-sm text-xs font-bold hover:bg-secondary-container transition-all" onclick="window.appSelectAndFind('${escapeHTML(facility.id)}')">
          Find & Navigate
        </button>
        <button class="p-2 bg-surface-container-low text-on-surface rounded-lg hover:bg-surface-container transition-all" onclick="window.appOpenDirections('${facility.coords.lat},${facility.coords.lng}')" title="Google Maps">
          <span class="material-symbols-outlined text-base">near_me</span>
        </button>
      </div>
    </div>
  `).join('');
}

// ==========================================
// 5. DASHBOARD & ANALYTICS VIEW
// ==========================================
function renderDashboardView() {
  const stats = getCitywideStats(state.facilities);

  // Update KPI Cards
  const kpiFac = document.getElementById('kpi-facilities');
  const kpiAvail = document.getElementById('kpi-available');
  const kpiOcc = document.getElementById('kpi-occupied');
  const kpiSat = document.getElementById('kpi-saturated');

  if (kpiFac) kpiFac.textContent = `${stats.totalFacilities} Locations`;
  if (kpiAvail) kpiAvail.textContent = `${stats.availableSpaces}`;
  if (kpiOcc) kpiOcc.textContent = `${stats.occupiedSpaces}`;
  if (kpiSat) kpiSat.textContent = `${stats.fullLocations} Facilities`;

  // Render Most Crowded Parking Areas Table
  const crowdedTableBody = document.getElementById('crowded-table-body');
  if (crowdedTableBody) {
    const sortedCrowded = [...state.facilities].sort((a, b) => {
      const occRateA = (a.occupiedSpaces / a.totalSpaces);
      const occRateB = (b.occupiedSpaces / b.totalSpaces);
      return occRateB - occRateA;
    });

    crowdedTableBody.innerHTML = sortedCrowded.slice(0, 5).map((facility, idx) => {
      const occPct = Math.round((facility.occupiedSpaces / facility.totalSpaces) * 100);
      let statusPill = `<span class="badge-available px-2 py-0.5 rounded-full text-xs font-bold">Flowing</span>`;
      if (facility.availableSpaces === 0) {
        statusPill = `<span class="badge-full px-2 py-0.5 rounded-full text-xs font-bold">100% Saturated</span>`;
      } else if (occPct >= 80) {
        statusPill = `<span class="badge-limited px-2 py-0.5 rounded-full text-xs font-bold">Near Capacity</span>`;
      }

      return `
        <tr class="border-b border-surface-container hover:bg-surface-container-low/50 transition-colors">
          <td class="py-3 px-4 font-mono font-bold text-xs text-on-surface-variant">#${idx + 1}</td>
          <td class="py-3 px-4">
            <div class="flex flex-col">
              <span class="font-bold text-sm text-on-surface">${escapeHTML(facility.name)}</span>
              <span class="text-xs text-on-surface-variant">${escapeHTML(facility.zone)} • ${escapeHTML(facility.corridor)}</span>
            </div>
          </td>
          <td class="py-3 px-4 tabular-nums font-bold text-sm ${facility.availableSpaces === 0 ? 'text-error' : 'text-primary'}">
            ${facility.availableSpaces} / ${facility.totalSpaces}
          </td>
          <td class="py-3 px-4">
            <div class="flex items-center gap-2">
              <div class="w-24 bg-surface-container h-2 rounded-full overflow-hidden">
                <div class="${occPct >= 95 ? 'bg-error' : occPct >= 80 ? 'bg-amber-500' : 'bg-primary'} h-full rounded-full" style="width: ${occPct}%"></div>
              </div>
              <span class="text-xs font-bold tabular-nums text-on-surface">${occPct}%</span>
            </div>
          </td>
          <td class="py-3 px-4">
            ${statusPill}
          </td>
        </tr>
      `;
    }).join('');
  }
}

// Simulate Sensor Tick (Dynamic Telemetry Update)
export function simulateSensorTick() {
  // Randomly adjust occupancy in 2-3 facilities
  state.facilities.forEach(f => {
    if (Math.random() > 0.6) {
      const delta = Math.floor(Math.random() * 3) - 1; // -1, 0, 1
      const newAvail = Math.max(0, Math.min(f.totalSpaces, f.availableSpaces + delta));
      f.availableSpaces = newAvail;
      f.occupiedSpaces = f.totalSpaces - newAvail;
      if (newAvail === 0) f.status = 'full';
      else if ((newAvail / f.totalSpaces) < 0.35) f.status = 'limited';
      else f.status = 'available';
    }
  });

  // Re-sync timestamp
  const syncTime = document.getElementById('sync-timestamp');
  if (syncTime) syncTime.textContent = `Synced: ${new Date().toLocaleTimeString()}`;

  renderDashboardView();

  // Show feedback notification toast
  showToast("📡 Sensor Network Synced: Real-time curb telemetry updated across 12 zones.");
}

// Toast notification helper
function showToast(message) {
  let toast = document.getElementById('app-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'app-toast';
    toast.className = 'fixed bottom-5 right-5 z-50 bg-on-surface text-surface px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 text-sm font-label-md transition-all duration-300 transform translate-y-12 opacity-0 pointer-events-none';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<span class="material-symbols-outlined text-primary text-base">sensors</span><span>${escapeHTML(message)}</span>`;
  toast.classList.remove('translate-y-12', 'opacity-0', 'pointer-events-none');
  setTimeout(() => {
    toast.classList.add('translate-y-12', 'opacity-0', 'pointer-events-none');
  }, 3500);
}

// Citywide live ticker counter
function startLiveTicker() {
  setInterval(() => {
    const counter = document.getElementById('live-total-free');
    if (counter) {
      state.liveTickerCounter += (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 3));
      state.liveTickerCounter = Math.max(320, Math.min(370, state.liveTickerCounter));
      counter.textContent = state.liveTickerCounter;
    }
  }, 7000);
}

// Attach event listeners for controls
function setupEventListeners() {
  // Destination input & search button
  const destInput = document.getElementById('destination-input');
  const clearBtn = document.getElementById('clear-search');
  const findBtn = document.getElementById('btn-find');

  if (clearBtn && destInput) {
    clearBtn.addEventListener('click', () => {
      destInput.value = '';
      destInput.focus();
    });
  }

  if (findBtn && destInput) {
    findBtn.addEventListener('click', () => {
      const val = destInput.value.trim();
      if (val) {
        state.currentDestination = val;
        renderFindParkingView();
      }
    });
  }

  if (destInput) {
    destInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const val = destInput.value.trim();
        if (val) {
          state.currentDestination = val;
          renderFindParkingView();
        }
      }
    });
  }

  // Vehicle selector
  const vehicleFilter = document.getElementById('filter-vehicle');
  if (vehicleFilter) {
    vehicleFilter.addEventListener('change', (e) => {
      state.selectedVehicleType = e.target.value;
      renderFindParkingView();
    });
  }

  // Sort selector
  const sortFilter = document.getElementById('filter-sort');
  if (sortFilter) {
    sortFilter.addEventListener('change', (e) => {
      state.selectedSort = e.target.value;
      renderFindParkingView();
    });
  }

  // Status Filter Pills
  document.querySelectorAll('.status-filter-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      const status = pill.getAttribute('data-status');
      if (status) {
        state.activeStatusFilter = status;
        document.querySelectorAll('.status-filter-pill').forEach(p => {
          if (p.getAttribute('data-status') === status) {
            p.classList.add('bg-surface-container-lowest', 'text-on-surface', 'shadow-xs', 'font-bold');
            p.classList.remove('text-on-surface-variant');
          } else {
            p.classList.remove('bg-surface-container-lowest', 'text-on-surface', 'shadow-xs', 'font-bold');
            p.classList.add('text-on-surface-variant');
          }
        });
        renderFindParkingView();
      }
    });
  });

  // FASTag toggle & boom barrier test button
  const fastagToggle = document.getElementById('fastag-toggle');
  const btnTestBarrier = document.getElementById('btn-test-barrier');

  if (fastagToggle) {
    fastagToggle.addEventListener('change', (e) => {
      updateBoomBarrierState(e.target.checked);
    });
  }

  if (btnTestBarrier && fastagToggle) {
    btnTestBarrier.addEventListener('click', () => {
      fastagToggle.checked = !fastagToggle.checked;
      updateBoomBarrierState(fastagToggle.checked);
    });
  }

  // Booking Modal Close
  const closeBookingBtn = document.getElementById('close-booking-modal');
  const modal = document.getElementById('booking-modal');
  if (closeBookingBtn && modal) {
    closeBookingBtn.addEventListener('click', closeBookingModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeBookingModal();
    });
  }

  // Dashboard Simulation Button
  const simBtn = document.getElementById('simulate-tick-btn');
  if (simBtn) {
    simBtn.addEventListener('click', simulateSensorTick);
  }

  // Directory Search & Zone Filter
  const dirSearch = document.getElementById('directory-search');
  const dirZone = document.getElementById('directory-zone-filter');
  if (dirSearch) {
    dirSearch.addEventListener('input', renderDirectoryView);
  }
  if (dirZone) {
    dirZone.addEventListener('change', renderDirectoryView);
  }
}

// Window exposure for inline HTML event bridges
window.appSwitchView = switchView;
window.appSelectAndFind = (facilityId) => {
  state.selectedFacilityId = facilityId;
  const fac = state.facilities.find(f => f.id === facilityId);
  if (fac) {
    // Find closest popular destination
    for (const d of POPULAR_DESTINATIONS) {
      if (fac.zone.toLowerCase().includes(d.zone.toLowerCase().split(' ')[0])) {
        state.currentDestination = d.name;
        break;
      }
    }
  }
  switchView('find-parking');
};
window.appOpenDirections = openExternalDirections;
window.appCloseModal = closeBookingModal;
window.appSimulateTick = simulateSensorTick;
window.appToggleBarrier = () => {
  const toggle = document.getElementById('fastag-toggle');
  if (toggle) {
    toggle.checked = !toggle.checked;
    updateBoomBarrierState(toggle.checked);
  }
};
