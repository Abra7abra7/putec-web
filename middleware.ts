import { proxy } from './proxy';
export default proxy;

export const config = {
    // Matcher must catch everything except static files and internal paths
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - robots.txt
         * - sitemap.xml
         */
        '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)',
    ],
};
