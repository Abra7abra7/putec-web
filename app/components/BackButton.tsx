"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

interface BackButtonProps {
  fallbackHref?: string;
  className?: string;
  showLabel?: boolean;
}

export default function BackButton({ fallbackHref = "/", className = "", showLabel = false }: BackButtonProps) {
  const router = useRouter();

  const handleBack = () => {
    // Check if there's history to go back to
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      // Fallback to home or specified href
      router.push(fallbackHref);
    }
  };

  return (
    <button
      onClick={handleBack}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-foreground font-medium ${className}`}
      aria-label="Späť"
    >
      <ArrowLeft size={20} />
      {showLabel && <span className="text-sm">Späť</span>}
    </button>
  );
}

