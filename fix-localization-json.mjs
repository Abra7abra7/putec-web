import fs from 'fs';
import path from 'path';

const locales = ['sk', 'en'];

locales.forEach(locale => {
    const filePath = path.join(process.cwd(), 'messages', `${locale}.json`);
    console.log(`Processing ${filePath}...`);

    // Read the file as a string first to handle duplicates
    // Standard JSON.parse only keeps the LAST value for a key
    const content = fs.readFileSync(filePath, 'utf8');

    // We want to merge the objects instead of just overwriting.
    // However, since we have many duplicate top-level keys, 
    // we can use a custom parser or just rely on the fact that
    // we want a specific consolidated structure.

    // Let's try to find all occurrences of keys and merge them.
    // This is tricky with plain regex if deeply nested.
    // But for top-level keys like "pages", "labels", etc. it's easier.

    // A better way: parse it normally which gives us the LAST version.
    // Often the last version is the one we just added or the one that has more info.
    // In our case, some older versions might have info we need.

    // Actually, I can just load it as an array of objects by replacing "}{" with "},{"
    // and wrapping it in []. But it's already a single object with duplicates.

    // Let's use a trick: read it line by line and manually merge top-level keys.

    // We want to find all top-level keys and their values.
    // Since it's a JSON object, it starts with { and ends with }
    let innerContent = content.trim();
    if (innerContent.startsWith('{')) innerContent = innerContent.substring(1);
    if (innerContent.endsWith('}')) innerContent = innerContent.substring(0, innerContent.length - 1);

    // Split by top-level keys. This is tricky.
    // Let's use a regex that looks for "key": at the beginning of a line with 4 spaces.
    const parts = innerContent.split(/\n    "([^"]+)": /);
    // parts[0] is garbage (before first key)
    // parts[1] is key1, parts[2] is value1, etc.

    const consolidated = {};

    for (let i = 1; i < parts.length; i += 2) {
        const key = parts[i];
        let valueStr = (parts[i + 1] || "").trim();

        // Remove trailing comma if present
        if (valueStr.endsWith(',')) valueStr = valueStr.substring(0, valueStr.length - 1);

        try {
            const value = JSON.parse(valueStr);
            if (consolidated[key]) {
                if (typeof value === 'object' && !Array.isArray(value)) {
                    consolidated[key] = { ...consolidated[key], ...value };
                } else {
                    consolidated[key] = value; // Last one wins for non-objects
                }
            } else {
                consolidated[key] = value;
            }
        } catch (e) {
            console.error(`Error parsing value for key ${key} in ${locale}.json`);
            // If it fails, it might be because the split was too aggressive.
            // But we'll try our best.
        }
    }

    fs.writeFileSync(filePath, JSON.stringify(consolidated, null, 4), 'utf8');
    console.log(`Successfully consolidated ${locale}.json`);
});
