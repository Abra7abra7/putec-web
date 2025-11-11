'use client';

type LatLng = { lat: number; lng: number };

const MAP_CENTER: LatLng = {
  lat: 48.30897158531647,
  lng: 17.28917563487912,
};

// Jednoduchý komponent - zobrazuje iba iframe embed bez JS API
// Žiadne chyby, žiadne kvóty, žiadne API kľúče
export default function GoogleMapsLazy() {
  return (
    <div className="w-full h-full min-h-[400px] bg-background">
      <div className="p-6">
        <h2 className="text-3xl font-bold text-foreground mb-4 text-center">
          Nájdete nás tu
        </h2>
        <div className="mb-4 text-center">
          <p className="text-foreground text-lg font-semibold">
            Pezinská 154 - Vinárstvo
          </p>
          <p className="text-foreground-muted">
            902 01 Vinosady
          </p>
          <p className="text-foreground-muted">
            Slovensko
          </p>
        </div>
      </div>
      {/* Google Maps embed iframe - bez API kľúča, bez JS */}
      <div className="w-full h-[360px] md:h-[500px] rounded-xl overflow-hidden border border-gray-200 shadow">
        <iframe
          title="Mapa - Pezinská 154, Vinosady"
          className="w-full h-full"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          src={`https://www.google.com/maps?q=${MAP_CENTER.lat},${MAP_CENTER.lng}&z=18&output=embed`}
        />
      </div>
    </div>
  );
}
