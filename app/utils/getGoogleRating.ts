const PLACE_ID = "ChIJF97lFUaXbEcRdEgkc1S1z_4"; // Víno Pútec, Vinosady

export interface GoogleRatingData {
    rating: number;
    totalReviews: number;
    googleMapsUri: string;
}

/**
 * Fetches the Google rating and review count for Víno Pútec.
 * Uses Next.js fetch deduplication + ISR (revalidate every 1 hour).
 * Multiple calls within the same request are automatically deduplicated.
 * Cost: ~$0.005 per call (Place Details Essentials SKU).
 */
export async function getGoogleRating(): Promise<GoogleRatingData> {
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;

    if (!apiKey) {
        // Fallback if no API key (e.g., local dev without key)
        return { rating: 5, totalReviews: 35, googleMapsUri: "" };
    }

    try {
        const response = await fetch(
            `https://places.googleapis.com/v1/places/${PLACE_ID}`,
            {
                headers: {
                    "X-Goog-Api-Key": apiKey,
                    "X-Goog-FieldMask": "rating,userRatingCount,googleMapsUri",
                },
                next: { revalidate: 3600 }, // Cache for 1 hour (ISR)
            }
        );

        if (!response.ok) {
            console.error("[Google Rating] API error:", response.status);
            return { rating: 5, totalReviews: 35, googleMapsUri: "" };
        }

        const data = await response.json();

        return {
            rating: data.rating || 5,
            totalReviews: data.userRatingCount || 35,
            googleMapsUri: data.googleMapsUri || "",
        };
    } catch (error) {
        console.error("[Google Rating] Fetch error:", error);
        return { rating: 5, totalReviews: 35, googleMapsUri: "" };
    }
}
