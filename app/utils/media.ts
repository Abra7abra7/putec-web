/**
 * Utility to handle media URLs, switching between local public folder and Cloudflare R2 CDN.
 */
export function getMediaUrl(path: string | undefined | null): string {
    if (!path) return "";

    // If it's already an absolute URL, return as is
    if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("data:")) {
        return path;
    }

    const r2Url = process.env.NEXT_PUBLIC_R2_URL;

    // If R2 URL is configured, use it for everything except some known local files (like favicon, silktide)
    if (r2Url) {
        // Remove leading slash if present to avoid double slashes
        const cleanPath = path.startsWith("/") ? path.slice(1) : path;

        // We can exclude specific patterns that should stay local (e.g., config files)
        const localExclusions = [
            "favicon",
            "silktide"
        ];

        const isExcluded = localExclusions.some(exclusion => cleanPath.includes(exclusion));

        if (!isExcluded) {
            return `${r2Url}/${cleanPath}`;
        }
    }

    // Fallback to local path
    return path.startsWith("/") ? path : `/${path}`;
}
