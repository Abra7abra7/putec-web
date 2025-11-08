"use client";

import { useEffect, useRef, useState } from "react";

export default function PrevioBookingClient() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!containerRef.current || loaded) return;
    const el = containerRef.current;

    const onIntersect = (entries: IntersectionObserverEntry[]) => {
      if (!entries[0]?.isIntersecting) return;
      setLoaded(true);
      // Inject script lazily
      const s = document.createElement("script");
      s.async = true;
      s.src = "https://booking.previo.app/iframe/";
      document.body.appendChild(s);
    };

    const io = new IntersectionObserver(onIntersect, { rootMargin: "200px" });
    io.observe(el);
    return () => io.disconnect();
  }, [loaded]);

  return (
    <div ref={containerRef} className="reservation-container">
      {!loaded ? (
        <div className="w-full h-[800px] rounded-lg bg-gray-100 animate-pulse" aria-label="Načítavam rezervačný modul" />
      ) : (
        <iframe
          src="https://booking.previo.app/?hotId=782975"
          scrolling="no"
          frameBorder={0}
          width="100%"
          height={800}
          name="previo-booking-iframe"
          id="previo-booking-iframe"
          allowTransparency={true}
          className="w-full border-0 rounded-lg"
          title="Rezervácia ubytovania"
        />
      )}
    </div>
  );
}


