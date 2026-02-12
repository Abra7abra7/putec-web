import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl

    // Presmerovania z anglických URL na slovenské
    const redirects: Record<string, string> = {
        '/products': '/vina',
        '/accommodation': '/ubytovanie',
        '/about': '/o-nas',
        '/contact': '/kontakt',
        '/cart': '/kosik',
        '/checkout': '/pokladna',
        '/degustacie-vina': '/degustacie',
        '/ubytovanie-vinosady': '/ubytovanie',
    }

    // Presmerovanie pre presné zhodu
    if (redirects[pathname]) {
        return NextResponse.redirect(new URL(redirects[pathname], request.url))
    }

    // Presmerovanie pre /products/[slug] na /vina/[slug]
    if (pathname.startsWith('/products/')) {
        const slug = pathname.replace('/products/', '')
        return NextResponse.redirect(new URL(`/vina/${slug}`, request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/products/:path*',
        '/accommodation',
        '/about',
        '/contact',
        '/cart',
        '/checkout',
        '/degustacie-vina',
        '/ubytovanie-vinosady'
    ]
}
