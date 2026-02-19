import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { locales, localePrefix } from './i18n.config';

// Vytvoríme middleware pre next-intl
const handleI18n = createMiddleware({
    defaultLocale: 'sk',
    locales,
    localePrefix
});

export default function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const host = request.headers.get('host') || '';

    // 1. Multi-domain Routing (Feature Flag)
    // Ak pristupujeme cez subdoménu ubytovania, "podstrčíme" mu obsah sekcie ubytovanie
    if (host.includes('ubytovanie.vinoputec.sk') || host.includes('ubytovanie.localhost')) {
        // Ak je na roote, zobrazíme mu ubytovanie v slovenčine (default)
        if (pathname === '/' || pathname === '/sk' || pathname === '/sk/') {
            return NextResponse.rewrite(new URL('/sk/ubytovanie', request.url));
        }
    }

    // 2. Centralizované presmerovania (zlúčené z proxy.ts a next.config.ts)
    const redirects: Record<string, string> = {
        // Pôvodné proxy.ts
        '/products': '/vina',
        '/accommodation': '/ubytovanie',
        '/about': '/o-nas',
        '/contact': '/kontakt',
        '/cart': '/kosik',
        '/checkout': '/pokladna',
        '/degustacie-vina': '/degustacie',
        '/ubytovanie-vinosady': '/ubytovanie',

        // Migrované z next.config.ts
        '/sluzby': '/degustacie',
        '/moznost-spoluprace': '/kontakt',
        '/obchod': '/vina',
        '/vinarstvo': '/o-nas',
        '/shop': '/vina',

        // Nájdené na live webe (WordPress)
        '/moj-ucet': '/pokladna',
        '/mapa-stranok': '/',
        '/nastroje-na-ochranu-sukromia': '/nastroje-ochrany-sukromia',
        '/ochrana-sukromia': '/zasady-ochrany-osobnych-udajov',
        '/kategoria-produktu/ruzove-vina': '/vina',
        '/produkt/rizling-vlassky-biele-suche-2024': '/vina/rizling-vlassky-biele-suche-2024',

        // New findings from Search Console list
        '/vina-videa': '/',
        '/kategoria-produktu/vina-k-dezertom': '/vina',
        '/kategoria-produktu/biele-vina': '/vina',
        '/kategoria-produktu/cervene-vina': '/vina',
        '/kategoria-produktu/darcekove-sety': '/vina',
        '/kategoria-produktu/darcekove-poukazy': '/vina',
        '/kategoria-produktu/rada-premium': '/vina',
        '/kategoria-produktu/rada-exclusive': '/vina',
        '/kategoria-produktu/vina-k-divine': '/vina',
        '/kategoria-produktu/vina-k-salatom': '/vina',
    };

    // 2. Kontrola presnej zhody
    // Odstránime trailing slash pre normalizáciu (WordPress -> Next.js)
    const cleanPath = pathname.endsWith('/') && pathname.length > 1 ? pathname.slice(0, -1) : pathname;

    if (redirects[cleanPath]) {
        return NextResponse.redirect(new URL(redirects[cleanPath], request.url), { status: 308 });
    }

    // 4. Dynamické presmerovania
    // Presmerovanie pre /products/[slug] na /vina/[slug]
    if (pathname.startsWith('/products')) {
        const slug = pathname.replace('/products', '').replace(/^\//, '');
        return NextResponse.redirect(new URL(slug ? `/vina/${slug}` : '/vina', request.url), { status: 308 });
    }

    // Presmerovanie pre /produkt/[slug] (WordPress) na /vina/[slug]
    if (pathname.startsWith('/produkt')) {
        const slug = pathname.replace('/produkt', '').replace(/^\//, '');
        return NextResponse.redirect(new URL(slug ? `/vina/${slug}` : '/vina', request.url), { status: 308 });
    }

    // Presmerovanie pre /kategoria-produktu/[slug] na /vina
    if (pathname.startsWith('/kategoria-produktu')) {
        return NextResponse.redirect(new URL('/vina', request.url), { status: 308 });
    }

    // 4. Spustenie next-intl middleware pre lokalizáciu
    // Toto rieši detekciu jazyka (hoci máme len SK s prefix: never) a formátovanie
    return handleI18n(request);
}

export const config = {
    // Matcher musí zachytiť všetko okrem statických súborov, aby fungoval next-intl aj redirecty
    matcher: [
        // Skip all internal paths (_next)
        '/((?!api|_next|.*\\..*).*)',
        // Optional: Only run on root (/) and specific paths if strict control needed
    ]
};
