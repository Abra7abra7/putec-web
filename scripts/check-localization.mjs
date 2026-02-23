import fs from 'fs';
import path from 'path';

const locales = ['sk', 'en'];

function getKeys(obj, prefix = '') {
    return Object.keys(obj).reduce((res, el) => {
        if (Array.isArray(obj[el])) {
            return res.concat(prefix + el);
        } else if (typeof obj[el] === 'object' && obj[el] !== null) {
            return res.concat(getKeys(obj[el], prefix + el + '.'));
        }
        return res.concat(prefix + el);
    }, []);
}

console.log('--- Localization Parity Check ---');

const messages = {};
const keySets = {};

locales.forEach(locale => {
    const filePath = path.join(process.cwd(), 'messages', `${locale}.json`);
    try {
        const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        messages[locale] = content;
        keySets[locale] = new Set(getKeys(content));
        console.log(`✅ Loaded ${locale}.json (${keySets[locale].size} keys)`);
    } catch (e) {
        console.error(`❌ Error loading ${locale}.json: ${e.message}`);
        process.exit(1);
    }
});

let issuesFound = false;

// Check for missing keys in other locales
locales.forEach(targetLocale => {
    locales.forEach(refLocale => {
        if (targetLocale === refLocale) return;

        const missingKeys = [...keySets[refLocale]].filter(k => !keySets[targetLocale].has(k));

        if (missingKeys.length > 0) {
            issuesFound = true;
            console.warn(`\n⚠️  ${targetLocale}.json is missing ${missingKeys.length} keys from ${refLocale}.json:`);
            missingKeys.sort().forEach(k => console.warn(`   - ${k}`));
        }
    });

    // Check for empty values
    const emptyKeys = [...keySets[targetLocale]].filter(k => {
        const parts = k.split('.');
        let val = messages[targetLocale];
        for (const part of parts) {
            val = val[part];
        }
        return val === "" || val === null || val === undefined;
    });

    if (emptyKeys.length > 0) {
        issuesFound = true;
        console.warn(`\n⚠️  ${targetLocale}.json has ${emptyKeys.length} empty or null values:`);
        emptyKeys.sort().forEach(k => console.warn(`   - ${k}`));
    }
});

if (!issuesFound) {
    console.log('\n✨ All localization files are in sync!');
    process.exit(0);
} else {
    console.log('\n❌ Localization parity check failed. See warnings above.');
    // process.exit(1); // Set to 1 if you want to block CI/CD
}
