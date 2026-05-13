/**
 * Static registry of gallery images.
 * Since local files are moved to R2 and deleted from public/, 
 * we use this registry instead of fs.readdirSync.
 */

export const GALLERY_IMAGES: Record<string, string[]> = {
    degustacie: [
        "degustacie/IMG_5508-6-x.jpg",
        "degustacie/IMG_6015-2.jpg",
        "degustacie/IMG_6063-2.jpg",
        "degustacie/Malá vínna chvíľka.jpg",
        "degustacie/Romantika na deke.jpg",
        "degustacie/Vinársky večer vo Víno Pútec s raňajkami.jpg",
        "degustacie/Vinársky večer vo Víno Pútec.jpg",
        "degustacie/Víno trochu inak Vol.2.jpg",
        "degustacie/Víno trochu inak.jpg",
        "degustacie/bozk-2.jpg",


        "degustacie/degustacna-x.jpg",

        "degustacie/jama-x.jpg",
        "degustacie/misa-x.jpg",
        "degustacie/ruky-x.jpg",
        "degustacie/sudy-x.jpg"
    ],
    ubytovanie: [
        "galeria/ubytovanie/altanok-krb-x.jpg",
        "galeria/ubytovanie/altanok-x.jpg",
        "galeria/ubytovanie/dvor-s-kostolom-x.jpg",
        "galeria/ubytovanie/dvor-so-sudom-x.jpg",
        "galeria/ubytovanie/foto-pas-x.jpg",
        "galeria/ubytovanie/img_9282.jpg",
        "galeria/ubytovanie/img_9311.jpg",
        "galeria/ubytovanie/izba-interier-x.jpg",
        "galeria/ubytovanie/kuchyna-linka-x.jpg",
        "galeria/ubytovanie/kuchyna-x.jpg",
        "galeria/ubytovanie/kupelna-2-x.jpg",
        "galeria/ubytovanie/kupelna-3-x.jpg",
        "galeria/ubytovanie/kupelna-x.jpg",
        "galeria/ubytovanie/lekna-x.jpg",
        "galeria/ubytovanie/pohare-a-chladic-x.jpg",
        "galeria/ubytovanie/pohare-na-verande-x.jpg",
        "galeria/ubytovanie/veranda-na-poschodi-x.jpg",
        "galeria/ubytovanie/vyhlad-na-vinohrad-x.jpg"
    ],
    rodina: [
        "galeria/rodina/rodina1.JPG",
        "galeria/rodina/rodina2.jpg"
    ]
};
