"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function DegustationError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Degustation error:", error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M6 3l1.5 2h9L18 3m-7 16v-3m0 0l-3-3m3 3l3-3M3 6l3 14h12l3-14H3z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Chyba pri načítaní degustácií
          </h1>
          <p className="text-gray-600 mb-6">
            Ospravedlňujeme sa, nepodarilo sa načítať informácie o degustáciách.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={reset}
            className="w-full px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors duration-200"
          >
            Skúsiť znova
          </button>
          <Link
            href="/kontakt"
            className="w-full px-6 py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-colors duration-200"
          >
            Kontaktujte nás
          </Link>
        </div>
      </div>
    </div>
  );
}

