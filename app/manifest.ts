import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Vino Putec',
        short_name: 'Vino Putec',
        description: 'Rodinné vinárstvo v srdci Malokarpatskej oblasti. Degustácie, ubytovanie, predaj vína.',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#991b1b', // Red-800 based on the brand
        icons: [
            {
                src: '/favicon.ico',
                sizes: 'any',
                type: 'image/x-icon',
            },
            {
                src: '/favicon-192.png', // User needs to provide these or we use existing
                sizes: '192x192',
                type: 'image/png',
            },
            {
                src: '/favicon-512.png',
                sizes: '512x512',
                type: 'image/png',
            },
        ],
    }
}
