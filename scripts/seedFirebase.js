import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { POPULAR_DESTINATIONS, PARKING_FACILITIES } from '../src/data/parkingLots.js';

// Note: To run this script, use Node v20+ with:
// node --env-file=.env.local scripts/seedFirebase.js
// For Node <20, you might need to hardcode the config below or use dotenv.

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function seedData() {
  try {
    console.log("Seeding Destinations...");
    for (const dest of POPULAR_DESTINATIONS) {
      const docRef = doc(db, 'destinations', dest.id);
      await setDoc(docRef, dest);
    }
    console.log("Destinations seeded successfully!");

    console.log("Seeding Parking Facilities...");
    for (const facility of PARKING_FACILITIES) {
      const docRef = doc(db, 'facilities', facility.id);
      await setDoc(docRef, facility);
    }
    console.log("Facilities seeded successfully!");
    console.log("All data seeded. You can now close this script.");
    process.exit(0);
  } catch (err) {
    console.error("Error seeding data:", err);
    process.exit(1);
  }
}

seedData();
