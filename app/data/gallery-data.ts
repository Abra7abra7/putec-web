/**
 * Static registry of gallery images.
 * Since local files are moved to R2 and deleted from public/, 
 * we use this registry instead of fs.readdirSync.
 */

export const GALLERY_IMAGES: Record<string, string[]> = {
    degustacie: [
        "IMG_5508-6-x.jpg",
        "IMG_6015-2.jpg",
        "IMG_6063-2.jpg",
        "bozk-2.jpg",
        "brano-degustacia-x.jpg",
        "degustacia-brano-x.jpg",
        "degustacia-skupina.jpg",
        "degustacia-x.jpg",
        "degustacna-x.jpg",
        "jama-x.jpg",
        "misa-x.jpg",
        "ruky-x.jpg",
        "sudy-x.jpg"
    ],
    ubytovanie: [
        "altanok-krb-x.jpg",
        "altanok-x.jpg",
        "dvor-s-kostolom-x.jpg",
        "dvor-so-sudom-x.jpg",
        "foto-pas-x.jpg",
        "img_9282.jpg",
        "img_9311.jpg",
        "izba-interier-x.jpg",
        "kuchyna-linka-x.jpg",
        "kuchyna-x.jpg",
        "kupelna-2-x.jpg",
        "kupelna-3-x.jpg",
        "kupelna-x.jpg",
        "lekna-x.jpg",
        "pohare-a-chladic-x.jpg",
        "pohare-na-verande-x.jpg",
        "veranda-na-poschodi-x.jpg",
        "vyhlad-na-vinohrad-x.jpg"
    ],
    rodina: [
        "rodina1.JPG",
        "rodina2.jpg"
    ]
};
