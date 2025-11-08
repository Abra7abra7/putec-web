"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface ReservationData {
  productTitle?: string;
  date?: string;
  time?: string;
  guests?: string;
  productPrice?: string;
  email?: string;
}

export default function ConfirmationDetails() {
  const router = useRouter();
  const [data, setData] = useState<ReservationData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load data from localStorage
    const reservationData = localStorage.getItem('degustationReservation');
    
    if (reservationData) {
      try {
        const parsed = JSON.parse(reservationData);
        setData(parsed);
      } catch (error) {
        console.error("Failed to parse reservation data:", error);
        router.push('/degustacie');
      }
    } else {
      // No data, redirect
      router.push('/degustacie');
    }
    
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
        <p className="text-foreground-muted">Načítavam detaily...</p>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('sk-SK', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="space-y-4 text-foreground">
      <div className="flex justify-between py-2 border-b border-gray-200">
        <span className="font-medium">Produkt:</span>
        <span className="text-right">{data.productTitle || 'N/A'}</span>
      </div>
      <div className="flex justify-between py-2 border-b border-gray-200">
        <span className="font-medium">Dátum:</span>
        <span>{formatDate(data.date)}</span>
      </div>
      <div className="flex justify-between py-2 border-b border-gray-200">
        <span className="font-medium">Čas:</span>
        <span>{data.time || 'N/A'}</span>
      </div>
      <div className="flex justify-between py-2 border-b border-gray-200">
        <span className="font-medium">Počet osôb:</span>
        <span>{data.guests ? `${data.guests} osôb` : 'N/A'}</span>
      </div>
      <div className="flex justify-between py-2 border-b border-gray-200">
        <span className="font-medium">Cena:</span>
        <span className="font-semibold text-accent">{data.productPrice || 'N/A'}</span>
      </div>
      <div className="flex justify-between py-2">
        <span className="font-medium">Email:</span>
        <span className="text-right break-all">{data.email || 'N/A'}</span>
      </div>
    </div>
  );
}

