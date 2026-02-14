const http = require('http');

const domain = 'http://localhost:3000'; // Alebo vaša lokálna adresa

const urlsToTest = [
    // Staré PHP adresy (Hypotetické - doplňte podľa reálu)
    '/sluzby',
    '/moznost-spoluprace',
    '/obchod',
    '/vinarstvo',
    '/shop',

    // Anglické adresy
    '/products',
    '/accommodation',
    '/about',
    '/contact',
    '/cart',

    // WordPress URL (z live webu)
    '/moj-ucet',
    '/reklamacny-poriadok',
    '/ochrana-sukromia',
    '/produkt/rizling-vlassky-biele-suche-2024',
    '/kategoria-produktu/ruzove-vina',

    // Očakávané cieľové adresy (len pre kontrolu)
    // '/degustacie', '/kontakt', '/vina', '/o-nas', ...
];

async function checkRedirect(path) {
    return new Promise((resolve) => {
        http.get(domain + path, (res) => {
            // 307/308 sú v Next.js dev móde často dočasné, v produkcii trvalé
            // Hlavné je, že Location hlavička je správna
            const redirectLocation = res.headers.location;
            const status = res.statusCode;

            if (status >= 300 && status < 400) {
                console.log(`✅ ${path} -> ${redirectLocation} (${status})`);
            } else if (status === 200) {
                console.log(`⚠️ ${path} -> Žiadny redirect (200 OK) - Možno už je to nová adresa?`);
            } else {
                console.log(`❌ ${path} -> Chyba ${status}`);
            }
            resolve();
        }).on('error', (e) => {
            console.error(`Chyba pri ${path}: ${e.message}`);
            resolve();
        });
    });
}

async function run() {
    console.log('Spúšťam kontrolu presmerovaní...\n');
    for (const url of urlsToTest) {
        await checkRedirect(url);
    }
}

run();
