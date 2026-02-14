import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center px-4">
      <div className="max-w-lg w-full bg-white rounded-lg shadow-xl p-8 text-center">
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-red-100 rounded-full mb-4">
            <span className="text-6xl font-bold text-red-600">404</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Stránka sa nenašla
          </h1>
          <p className="text-gray-600 mb-6">
            Ospravedlňujeme sa, ale stránka ktorú hľadáte neexistuje alebo bola presunutá.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
          <Link
            href="/"
            className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors duration-200"
          >
            Domovská stránka
          </Link>
          <Link
            href="/vina"
            className="px-6 py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-colors duration-200"
          >
            Naše vína
          </Link>
        </div>

        <div className="pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-4">
            Môžete sa vrátiť na:
          </p>
          <div className="flex flex-wrap justify-center gap-2 text-sm">
            <Link
              href="/degustacie"
              className="text-red-600 hover:text-red-700 font-medium hover:underline"
            >
              Degustácie
            </Link>
            <span className="text-gray-400">•</span>
            <Link
              href="/ubytovanie"
              className="text-red-600 hover:text-red-700 font-medium hover:underline"
            >
              Ubytovanie
            </Link>
            <span className="text-gray-400">•</span>
            <Link
              href="/kontakt"
              className="text-red-600 hover:text-red-700 font-medium hover:underline"
            >
              Kontakt
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

