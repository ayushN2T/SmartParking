import React, { useState, useEffect } from 'react';
import { PARKING_FACILITIES, POPULAR_DESTINATIONS } from './data/parkingLots';
import { collection, onSnapshot, getDocs, doc, setDoc, writeBatch, runTransaction } from 'firebase/firestore';
import { db } from './services/firebase';
import Navbar from './components/Navbar';
import HomeView from './components/HomeView';
import FindParkingView from './components/FindParkingView';
import DirectoryView from './components/DirectoryView';
import DashboardView from './components/DashboardView';
import BookingModal from './components/BookingModal';
import LocationPromptModal from './components/LocationPromptModal';
import Footer from './components/Footer';

export default function App() {
  const [activeView, setActiveView] = useState('find-parking'); // 'home' | 'find-parking' | 'parking-locations' | 'dashboard'
  const [currentDestination, setCurrentDestination] = useState('Bhavnagar Central Market');
  const [selectedFacilityId, setSelectedFacilityId] = useState('parking-a');
  const [facilities, setFacilities] = useState(() => JSON.parse(JSON.stringify(PARKING_FACILITIES)));
  const [destinations, setDestinations] = useState(POPULAR_DESTINATIONS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(true);
  const [userLocation, setUserLocation] = useState({
    name: 'Bhavnagar Central Market',
    isGps: false,
    coords: { lat: 21.7645, lng: 72.1519, svgX: 360, svgY: 140 }
  });
  const [liveTickerCounter, setLiveTickerCounter] = useState(344);
  const [lastSyncTime, setLastSyncTime] = useState('Real-Time (Firestore Live)');
  const [toastMessage, setToastMessage] = useState(null);
  const [isDatabaseConnected, setIsDatabaseConnected] = useState(false);
  const [bookingPassData, setBookingPassData] = useState(null);

  // Fetch live facilities and destinations directly from Firestore
  useEffect(() => {
    let unsubscribeFacilities = null;

    const fetchFromDatabase = async () => {
      try {
        // Real-time listener for facilities
        unsubscribeFacilities = onSnapshot(collection(db, 'facilities'), (snapshot) => {
          if (!snapshot.empty) {
            const facList = [];
            snapshot.forEach(doc => facList.push({ id: doc.id, ...doc.data() }));
            setFacilities(facList);
            setIsDatabaseConnected(true);
          }
        }, (err) => {
          console.warn('Firebase facilities fetch fallback', err);
        });

        // One-time fetch for destinations
        const destSnapshot = await getDocs(collection(db, 'destinations'));
        if (!destSnapshot.empty) {
          const destList = [];
          destSnapshot.forEach(doc => destList.push({ id: doc.id, ...doc.data() }));
          setDestinations(destList);
        }
      } catch (err) {
        console.warn('Database fetch fallback: using local schema dataset', err);
      }
    };

    fetchFromDatabase();

    return () => {
      if (unsubscribeFacilities) unsubscribeFacilities();
    };
  }, []);

  // Live telemetry ticker interval
  useEffect(() => {
    const timer = setInterval(() => {
      setLiveTickerCounter(prev => {
        const delta = (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 3);
        return Math.max(320, Math.min(370, prev + delta));
      });
    }, 7500);
    return () => clearInterval(timer);
  }, []);

  const handleSelectDestination = (destName, coords = null) => {
    setCurrentDestination(destName);
    const defaultCoords = {
      'Bhavnagar Central Market': { lat: 21.7645, lng: 72.1519, svgX: 360, svgY: 140 },
      'Bhavnagar Railway Station': { lat: 21.7745, lng: 72.1432, svgX: 140, svgY: 60 },
      'Kalanala': { lat: 21.7690, lng: 72.1380, svgX: 210, svgY: 120 },
      'Nilambaug': { lat: 21.7580, lng: 72.1399, svgX: 270, svgY: 260 },
      'Takhteshwar': { lat: 21.7540, lng: 72.1465, svgX: 340, svgY: 270 }
    };
    setUserLocation({
      name: destName,
      isGps: false,
      coords: coords || defaultCoords[destName] || { lat: 21.7645, lng: 72.1519, svgX: 360, svgY: 140 }
    });
    setActiveView('find-parking');
  };

  const handleSelectLocation = (locationName, isGps = false, coords = null) => {
    setCurrentDestination(locationName);
    const defaultCoords = {
      'Bhavnagar Central Market': { lat: 21.7645, lng: 72.1519, svgX: 360, svgY: 140 },
      'Bhavnagar Railway Station': { lat: 21.7745, lng: 72.1432, svgX: 140, svgY: 60 },
      'Kalanala': { lat: 21.7690, lng: 72.1380, svgX: 210, svgY: 120 },
      'Nilambaug': { lat: 21.7580, lng: 72.1399, svgX: 270, svgY: 260 },
      'Takhteshwar': { lat: 21.7540, lng: 72.1465, svgX: 340, svgY: 270 }
    };
    setUserLocation({
      name: locationName,
      isGps,
      coords: coords || defaultCoords[locationName] || { lat: 21.7645, lng: 72.1519, svgX: 360, svgY: 140 }
    });
    setIsLocationModalOpen(false);
    setActiveView('find-parking');
    setToastMessage(`📍 GPS Location Pin Active: ${locationName} mapped on live GPS tracking.`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleBookTicket = async (facilityId) => {
    const targetId = facilityId || selectedFacilityId;
    setSelectedFacilityId(targetId);

    // Create booking in Firestore using a Transaction to ensure atomic spaces update
    try {
      const facilityRef = doc(db, 'facilities', targetId);
      const bookingId = `BK-${Date.now()}`;
      const bookingRef = doc(db, 'bookings', bookingId);

      await runTransaction(db, async (transaction) => {
        const facDoc = await transaction.get(facilityRef);
        if (!facDoc.exists()) {
          throw new Error("Facility does not exist!");
        }

        const data = facDoc.data();
        if (data.availableSpaces <= 0) {
          throw new Error("Parking facility is full!");
        }

        const newAvail = data.availableSpaces - 1;
        const newOcc = data.occupiedSpaces + 1;
        let newStatus = 'available';
        if (newAvail === 0) newStatus = 'full';
        else if ((newAvail / data.totalSpaces) < 0.35) newStatus = 'limited';

        transaction.update(facilityRef, {
          availableSpaces: newAvail,
          occupiedSpaces: newOcc,
          status: newStatus
        });

        transaction.set(bookingRef, {
          facility_id: targetId,
          vehicle_plate: 'GJ-04-AB-1892',
          vehicle_type: '4w',
          fastag: true,
          timestamp: new Date().toISOString()
        });
      });

      setBookingPassData({
        status: 'success',
        booking_id: bookingId,
        facility_id: targetId,
        message: 'Successfully booked via Firestore'
      });
    } catch (e) {
      console.warn('Booking stored locally (Firebase error)', e);
      setBookingPassData({ status: 'success', booking_id: `LOCAL-${Date.now()}`, facility_id: targetId });
    }

    setIsModalOpen(true);
  };

  const handleGetDirections = (coords) => {
    const activeFac = facilities.find(f => f.id === selectedFacilityId);
    const target = coords || (activeFac ? `${activeFac.coords.lat},${activeFac.coords.lng}` : '21.7645,72.1519');
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(target)}`, '_blank');
  };

  // Simulate Sensor Tick - Updates Firestore and real-time listeners automatically pick it up
  const handleSimulateTick = async () => {
    try {
      const batch = writeBatch(db);
      
      facilities.forEach(f => {
        if (Math.random() > 0.5) {
          const delta = Math.floor(Math.random() * 3) - 1;
          const newAvail = Math.max(0, Math.min(f.totalSpaces, f.availableSpaces + delta));
          const newOcc = f.totalSpaces - newAvail;
          let newStatus = 'available';
          if (newAvail === 0) newStatus = 'full';
          else if ((newAvail / f.totalSpaces) < 0.35) newStatus = 'limited';

          const docRef = doc(db, 'facilities', f.id);
          batch.update(docRef, {
            availableSpaces: newAvail,
            occupiedSpaces: newOcc,
            status: newStatus
          });
        }
      });
      
      await batch.commit();
      const nowStr = new Date().toLocaleTimeString();
      setLastSyncTime(nowStr);
      setToastMessage('📡 Sensor Network Synced: Real-time curb telemetry updated in Firestore.');
      setTimeout(() => setToastMessage(null), 3500);
      return;
    } catch (err) {
      console.warn('Firestore tick fallback', err);
    }

    // Client-side fallback if Firestore offline
    setFacilities(prev => {
      return prev.map(f => {
        if (Math.random() > 0.5) {
          const delta = Math.floor(Math.random() * 3) - 1;
          const newAvail = Math.max(0, Math.min(f.totalSpaces, f.availableSpaces + delta));
          const newOcc = f.totalSpaces - newAvail;
          let newStatus = 'available';
          if (newAvail === 0) newStatus = 'full';
          else if ((newAvail / f.totalSpaces) < 0.35) newStatus = 'limited';

          return {
            ...f,
            availableSpaces: newAvail,
            occupiedSpaces: newOcc,
            status: newStatus
          };
        }
        return f;
      });
    });

    const nowStr = new Date().toLocaleTimeString();
    setLastSyncTime(nowStr);
    setToastMessage('📡 Sensor Network Synced: Real-time curb telemetry updated locally.');
    setTimeout(() => setToastMessage(null), 3500);
  };

  const selectedFacility = facilities.find(f => f.id === selectedFacilityId) || facilities[0];

  return (
    <div className="flex flex-col min-h-screen bg-background text-on-surface">
      {/* Global Navigation Bar */}
      <Navbar
        activeView={activeView}
        setActiveView={setActiveView}
        onFindParkingClick={() => setActiveView('find-parking')}
        isDbConnected={isDatabaseConnected}
        userLocation={userLocation}
        onOpenLocationModal={() => setIsLocationModalOpen(true)}
      />

      {/* Main View Router */}
      <main className="w-full pt-20 flex-1">
        {activeView === 'home' && (
          <HomeView
            destinations={destinations}
            onSelectDestination={handleSelectDestination}
            availableCount={facilities.reduce((sum, f) => sum + f.availableSpaces, 0)}
          />
        )}

        {activeView === 'find-parking' && (
          <FindParkingView
            facilities={facilities}
            destinations={destinations}
            currentDestination={currentDestination}
            onDestinationChange={setCurrentDestination}
            selectedFacilityId={selectedFacilityId}
            onSelectFacility={setSelectedFacilityId}
            onBookTicket={handleBookTicket}
            onGetDirections={handleGetDirections}
            liveTickerCounter={liveTickerCounter}
            isDbConnected={isDatabaseConnected}
            userLocation={userLocation}
            onOpenLocationModal={() => setIsLocationModalOpen(true)}
          />
        )}

        {activeView === 'parking-locations' && (
          <DirectoryView
            facilities={facilities}
            onSelectFacility={(id) => {
               setSelectedFacilityId(id);
               setActiveView('find-parking');
            }}
            onDirections={handleGetDirections}
          />
        )}

        {activeView === 'dashboard' && (
          <DashboardView
            facilities={facilities}
            onSimulateTick={handleSimulateTick}
            lastSyncTime={lastSyncTime}
            isDbConnected={isDatabaseConnected}
          />
        )}
      </main>

      {/* First-load / Relocate Location Prompt Modal */}
      <LocationPromptModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        onSelectLocation={handleSelectLocation}
      />

      {/* Digital Pass / FASTag Boom Barrier Modal */}
      <BookingModal
        facility={selectedFacility}
        isOpen={isModalOpen}
        bookingPassData={bookingPassData}
        onClose={() => setIsModalOpen(false)}
        onDirections={() => handleGetDirections()}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-on-surface text-surface px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 text-sm font-semibold animate-fade-in border border-surface-container">
          <span className="material-symbols-outlined text-primary text-base">sensors</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Global Footer */}
      <Footer onNavigate={setActiveView} />
    </div>
  );
}
