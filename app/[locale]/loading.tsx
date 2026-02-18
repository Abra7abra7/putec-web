export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block">
          {/* Wine bottle loading animation */}
          <div className="relative">
            <svg
              className="animate-bounce w-16 h-16 text-amber-500"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 2h8v3H8V2zm1 4h6l1 15H8l1-15z" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-full animate-ping" />
            </div>
          </div>
        </div>
        <p className="mt-6 text-gray-800 font-medium text-lg">
          Načítavam...
        </p>
        <div className="mt-4 flex justify-center gap-1">
          <div
            className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"
            style={{ animationDelay: "0ms" }}
          />
          <div
            className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"
            style={{ animationDelay: "150ms" }}
          />
          <div
            className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"
            style={{ animationDelay: "300ms" }}
          />
        </div>
      </div>
    </div>
  );
}

