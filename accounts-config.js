/* Meal Prep CEO dashboard: accounts config.
   Meal Prep's OWN Firebase project only, the same config
   slot shape the user app carries. Config values are public
   bundle values by design; the security lives in the
   Firestore rules (owner-only surfaces) and the Security
   desk's live battery.

   FILLED at Layer 2 (15 Oct 2026): the Meal Prep production
   project (meal-prep-c8bf7) exists and its Security-cleared
   rules are live, so the dashboard now runs in LIVE mode by
   default. Fixture mode remains available on invented
   numbers with ?fixture=1, so the gates can review the whole
   surface without touching live data. Never cross this file
   with any other app's config. */
window.MP_ACCOUNT_CONFIG = {
  apiKey: "AIzaSyCE5H9dDC2zM8YiqA7vqufXGzhQoqt1Cuc",
  authDomain: "meal-prep-c8bf7.firebaseapp.com",
  projectId: "meal-prep-c8bf7",
  storageBucket: "meal-prep-c8bf7.firebasestorage.app",
  messagingSenderId: "558584755387",
  appId: "1:558584755387:web:bf74186592a48f1321259e"
};
