"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LOCALES = [
    { code: "sk", label: "SK" },
    { code: "en", label: "EN" },
];

/**
 * Strips any known locale prefix from a pathname and returns the bare path.
 * e.g. "/en/kontakt" → "/kontakt", "/sk/kontakt" → "/kontakt", "/kontakt" → "/kontakt"
 */
function getPathWithoutLocale(pathname: string): string {
    for (const { code } of LOCALES) {
        if (pathname === `/${code}` || pathname.startsWith(`/${code}/`)) {
            return pathname.slice(code.length + 1) || "/";
        }
    }
    return pathname;
}

interface LanguageSwitcherProps {
    /** Current active locale, e.g. "sk" or "en" */
    currentLocale: string;
    /** Extra classes to apply to the wrapper element */
    className?: string;
}

export default function LanguageSwitcher({ currentLocale, className = "" }: LanguageSwitcherProps) {
    const pathname = usePathname();
    const bare = getPathWithoutLocale(pathname);

    return (
        <div className={`flex items-center gap-1 ${className}`} aria-label="Language switcher">
            {LOCALES.map(({ code, label }) => {
                // Always build the full /{locale}{bare} path for every locale
                // bare is "/" for the root, otherwise e.g. "/kontakt"
                const href = `/${code}${bare === "/" ? "" : bare}`;
                const isActive = currentLocale === code;

                return (
                    <Link
                        key={code}
                        href={href}
                        aria-current={isActive ? "true" : undefined}
                        className={`
              text-xs font-bold uppercase tracking-widest px-2 py-1 rounded-lg transition-all duration-200
              ${isActive
                                ? "bg-accent text-white shadow-sm shadow-accent/30"
                                : "text-foreground/60 hover:text-accent hover:bg-accent/10"
                            }
            `}
                    >
                        {label}
                    </Link>
                );
            })}
        </div>
    );
}
