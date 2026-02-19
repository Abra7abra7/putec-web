import { NextResponse } from "next/server";

const PLACE_ID = "ChIJF97lFUaXbEcRdEgkc1S1z_4"; // Víno Pútec, Vinosady

interface GoogleReview {
    name: string;
    rating: number;
    text?: { text: string; languageCode: string };
    originalText?: { text: string; languageCode: string };
    authorAttribution: {
        displayName: string;
        uri: string;
        photoUri: string;
    };
    relativePublishTimeDescription: string;
    publishTime: string;
    googleMapsUri: string;
}

interface GooglePlaceResponse {
    rating?: number;
    userRatingCount?: number;
    reviews?: GoogleReview[];
    googleMapsUri?: string;
}

// Cache the response for 1 hour
let cachedData: { data: GooglePlaceResponse; timestamp: number } | null = null;
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in ms

async function fetchGoogleReviews(): Promise<GooglePlaceResponse | null> {
    // Check cache first
    if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
        return cachedData.data;
    }

    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    if (!apiKey) {
        console.error("[Google Reviews] GOOGLE_PLACES_API_KEY not set");
        return null;
    }

    try {
        const response = await fetch(
            `https://places.googleapis.com/v1/places/${PLACE_ID}`,
            {
                headers: {
                    "X-Goog-Api-Key": apiKey,
                    "X-Goog-FieldMask":
                        "reviews,rating,userRatingCount,googleMapsUri",
                },
                next: { revalidate: 3600 }, // Next.js ISR: revalidate every hour
            }
        );

        if (!response.ok) {
            console.error(
                "[Google Reviews] API error:",
                response.status,
                await response.text()
            );
            return null;
        }

        const data: GooglePlaceResponse = await response.json();

        // Update cache
        cachedData = { data, timestamp: Date.now() };

        return data;
    } catch (error) {
        console.error("[Google Reviews] Fetch error:", error);
        return null;
    }
}

export async function GET() {
    const data = await fetchGoogleReviews();

    if (!data) {
        return NextResponse.json(
            { error: "Failed to fetch reviews" },
            { status: 500 }
        );
    }

    // Transform reviews into a simpler format for the frontend
    const reviews = (data.reviews || []).map((review) => ({
        authorName: review.authorAttribution?.displayName || "Zákazník",
        authorPhoto: review.authorAttribution?.photoUri || "",
        authorUrl: review.authorAttribution?.uri || "",
        rating: review.rating || 5,
        text: review.originalText?.text || review.text?.text || "",
        relativeTime: review.relativePublishTimeDescription || "",
        publishTime: review.publishTime || "",
        googleMapsUri: review.googleMapsUri || "",
    }));

    return NextResponse.json({
        rating: data.rating || 0,
        totalReviews: data.userRatingCount || 0,
        googleMapsUri: data.googleMapsUri || "",
        reviews,
    });
}
