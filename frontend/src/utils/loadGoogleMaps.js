/**
 * Dynamically loads the Google Maps JavaScript API.
 * Uses VITE_GOOGLE_MAPS_API_KEY from environment variables.
 * Ensures the script is only loaded once.
 */
let loadPromise = null;

const loadGoogleMaps = () => {
  if (loadPromise) return loadPromise;
  if (typeof window !== "undefined" && window.google?.maps?.places) {
    loadPromise = Promise.resolve();
    return loadPromise;
  }

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  if (!apiKey || apiKey === "your_api_key_here") {
    console.warn("[GoogleMaps] No API key set. Set VITE_GOOGLE_MAPS_API_KEY in .env");
    loadPromise = Promise.reject(new Error("No API key"));
    return loadPromise;
  }

  loadPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&region=IN&callback=initGoogleMaps`;
    script.async = true;
    script.defer = true;

    // Global callback for the API
    window.initGoogleMaps = () => resolve();

    script.onerror = () => {
      delete window.initGoogleMaps;
      loadPromise = null;
      reject(new Error("Failed to load Google Maps script"));
    };

    document.head.appendChild(script);
  });

  return loadPromise;
};

export default loadGoogleMaps;
