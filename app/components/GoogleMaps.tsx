'use client';

import { useEffect, useRef, useState } from 'react';

// Load API key at module level for client components
const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

// Bootstrap loader function - loads Google Maps API
function loadGoogleMapsScript(apiKey: string): Promise<void> {
  return new Promise((resolve, reject) => {
    // Validate API key
    if (!apiKey || apiKey.trim() === '' || apiKey === 'your_google_maps_api_key_here') {
      reject(new Error('Google Maps API key is missing or invalid'));
      return;
    }

    // Check if already loaded
    if (window.google && window.google.maps && typeof window.google.maps.importLibrary === 'function') {
      resolve();
      return;
    }

    // Check if script is already being loaded
    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve());
      existingScript.addEventListener('error', () => reject(new Error('Failed to load Google Maps')));
      return;
    }

    // Create bootstrap loader script
    const script = document.createElement('script');
    // Escape API key to prevent XSS
    const escapedApiKey = apiKey.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
    script.innerHTML = `
      (g=>{var h,a,k,p="The Google Maps JavaScript API",c="google",l="importLibrary",q="__ib__",m=document,b=window;b=b[c]||(b[c]={});var d=b.maps||(b.maps={}),r=new Set,e=new URLSearchParams,u=()=>h||(h=new Promise(async(f,n)=>{await (a=m.createElement("script"));e.set("libraries",[...r]+"");for(k in g)e.set(k.replace(/[A-Z]/g,t=>"_"+t[0].toLowerCase()),g[k]);e.set("callback",c+".maps."+q);a.src=\`https://maps.\${c}apis.com/maps/api/js?\`+e;d[q]=f;a.onerror=()=>h=n(Error(p+" could not load."));a.nonce=m.querySelector("script[nonce]")?.nonce||"";m.head.append(a)}));d[l]?console.warn(p+" only loads once. Ignoring:",g):d[l]=(f,...n)=>r.add(f)&&u().then(()=>d[l](f,...n))})
      ({key: "${escapedApiKey}", v: "weekly"});
    `;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Google Maps script'));
    document.head.appendChild(script);
  });
}

export default function GoogleMaps() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [apiKeyMissing, setApiKeyMissing] = useState(false);
  const [loadingError, setLoadingError] = useState<string | null>(null);

  useEffect(() => {
    // Validate API key before proceeding
    if (!GOOGLE_MAPS_API_KEY || GOOGLE_MAPS_API_KEY.trim() === '' || GOOGLE_MAPS_API_KEY === 'your_google_maps_api_key_here') {
      console.error('Google Maps API key is missing or invalid');
      setApiKeyMissing(true);
      setLoadingError('Google Maps API kľúč nie je nastavený. Prosím, nastavte NEXT_PUBLIC_GOOGLE_MAPS_API_KEY v .env.local');
      return;
    }

    let isMounted = true;

    const initMap = async () => {
      try {
        // Load Google Maps script
        await loadGoogleMapsScript(GOOGLE_MAPS_API_KEY);

        if (!isMounted || !mapRef.current) return;

        // Import libraries using the new importLibrary API
        const { Map, InfoWindow } = (await window.google.maps.importLibrary("maps")) as GoogleMapsMapsLibrary;
        const { AdvancedMarkerElement } = (await window.google.maps.importLibrary("marker")) as GoogleMapsMarkerLibrary;

        if (!isMounted || !mapRef.current) return;

        // Create map
        const map = new Map(mapRef.current, {
          center: { lat: 48.30897158531647, lng: 17.28917563487912 }, // Pezinská 154, Vinosady coordinates
          zoom: 18,
          mapId: 'DEMO_MAP_ID', // Required for AdvancedMarkerElement
          mapTypeId: 'hybrid', // Hybrid mode shows satellite imagery with labels
          tilt: 0, // 0 for top-down view, 45 for angled view
        });

        // Create AdvancedMarkerElement
        const marker = new AdvancedMarkerElement({
          map: map,
          position: { lat: 48.30897158531647, lng: 17.28917563487912 },
          title: 'Pezinská 154 - Vinárstvo, 902 01 Vinosady',
        });

        // Add info window
        const infoWindow = new InfoWindow({
          content: `
            <div style="padding: 10px; max-width: 250px;">
              <h3 style="margin: 0 0 10px 0; color: #333; font-size: 16px; font-weight: bold;">Pezinská 154 - Vinárstvo</h3>
              <p style="margin: 0 0 5px 0; color: #666; font-size: 14px;">902 01 Vinosady</p>
              <p style="margin: 0; color: #666; font-size: 14px;">Slovensko</p>
            </div>
          `,
        });

        marker.addListener('click', () => {
          infoWindow.open(map, marker);
        });

        if (isMounted) {
          setMapLoaded(true);
        }
      } catch (error) {
        console.error('Error loading Google Maps:', error);
        if (isMounted) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to load Google Maps';
          setLoadingError(errorMessage);
          setApiKeyMissing(true);
          
          // Check if it's an API key error
          if (errorMessage.includes('InvalidKeyMapError') || errorMessage.includes('API key')) {
            setLoadingError('Neplatný Google Maps API kľúč. Prosím, skontrolujte váš API kľúč v Google Cloud Console.');
          }
        }
      }
    };

    initMap();

    return () => {
      isMounted = false;
    };
  }, []);

  if (apiKeyMissing) {
    return (
      <div className="w-full h-full min-h-[500px] bg-background">
        <div className="p-6">
          <h2 className="text-3xl font-bold text-foreground mb-4 text-center">
            Nájdete nás tu
          </h2>
          <div className="mb-4 text-center">
            <p className="text-foreground text-lg font-semibold mb-2">
              Putec Vinosady
            </p>
            <p className="text-foreground-muted">
              Pezinská 154, 902 01 Vinosady
            </p>
            <p className="text-foreground-muted">
              Slovensko
            </p>
          </div>
        </div>
        <div className="w-full h-96 rounded-lg shadow-lg border border-gray-200 bg-gray-100 flex items-center justify-center">
          <div className="text-center p-8">
            <h3 className="text-xl font-bold text-gray-700 mb-4">
              Google Maps nie je nakonfigurované
            </h3>
            <div className="text-gray-600 space-y-2">
              <p>Pre zobrazenie mapy potrebujete:</p>
              <ol className="list-decimal list-inside space-y-1 text-left max-w-md mx-auto">
                <li>Získať Google Maps API kľúč na <a href="https://console.cloud.google.com/google/maps-apis" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google Cloud Console</a></li>
                <li>Vytvoriť súbor <code className="bg-gray-200 px-1 rounded">.env.local</code> v root priečinku</li>
                <li>Pridať: <code className="bg-gray-200 px-1 rounded">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here</code></li>
                <li>Reštartovať development server</li>
              </ol>
              {loadingError && (
                <p className="text-red-600 mt-4 text-sm">Chyba: {loadingError}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 text-center">
          Nájdete nás tu
        </h2>
        <div className="text-center space-y-2">
          <p className="text-foreground text-lg font-semibold">
            Pezinská 154 - Vinárstvo
          </p>
          <p className="text-foreground-muted text-base">
            902 01 Vinosady
          </p>
          <p className="text-foreground-muted text-base">
            Slovensko
          </p>
        </div>
      </div>
      <div className="relative">
        <div 
          ref={mapRef} 
          className="w-full h-[450px] md:h-[500px] rounded-xl shadow-xl border border-gray-200"
        />
        {!mapLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-xl">
            <div className="text-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900 mx-auto mb-3"></div>
              <p className="text-gray-600 font-medium">Načítavam mapu...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    google: {
      maps: {
        importLibrary: (library: string) => Promise<unknown>;
      };
    };
  }
}

// Type definitions for Google Maps API
interface GoogleMapsMapOptions {
  center?: { lat: number; lng: number };
  zoom?: number;
  mapId?: string;
  mapTypeId?: string;
  tilt?: number;
}

interface GoogleMapsInfoWindowOptions {
  content?: string | Node;
}

interface GoogleMapsAdvancedMarkerElementOptions {
  map?: unknown;
  position?: { lat: number; lng: number };
  title?: string;
}

interface GoogleMapsMap {
  setOptions(options: GoogleMapsMapOptions): void;
}

interface GoogleMapsInfoWindow {
  open(map: GoogleMapsMap, marker?: GoogleMapsAdvancedMarkerElement): void;
}

interface GoogleMapsAdvancedMarkerElement {
  addListener(event: string, handler: () => void): void;
}

interface GoogleMapsMapsLibrary {
  Map: new (element: HTMLElement, options: GoogleMapsMapOptions) => GoogleMapsMap;
  InfoWindow: new (options?: GoogleMapsInfoWindowOptions) => GoogleMapsInfoWindow;
}

interface GoogleMapsMarkerLibrary {
  AdvancedMarkerElement: new (options: GoogleMapsAdvancedMarkerElementOptions) => GoogleMapsAdvancedMarkerElement;
}