import fs from 'fs';
import path from 'path';

const locales = ['sk', 'en'];
const pageKeys = ['accommodation', 'about', 'contact', 'gallery', 'wines', 'tastings'];

locales.forEach(locale => {
    const filePath = path.join(process.cwd(), 'messages', `${locale}.json`);
    console.log(`Processing ${filePath}...`);

    const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    if (!content.pages) {
        content.pages = {};
    }

    pageKeys.forEach(key => {
        if (content[key] && key !== 'pages') {
            console.log(`Moving ${key} to pages.${key}`);
            content.pages[key] = { ...content.pages[key], ...content[key] };
            delete content[key];
        }
    });

    fs.writeFileSync(filePath, JSON.stringify(content, null, 4), 'utf8');
    console.log(`Successfully restored nesting in ${locale}.json`);
});
