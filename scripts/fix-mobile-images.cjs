const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const PUBLIC_DIR = path.join(process.cwd(), 'public');

// List of specific images identified in the Lighthouse report as problematic
const TARGETS = [
    {
        path: 'vineyard-banner.webp',
        width: 1920, // Limit max width (currently original is likely huge)
        quality: 75,
        format: 'webp'
    },
    {
        path: 'degustacie/degustacia-skupina.jpg',
        width: 1200,
        quality: 75,
        format: 'jpg'
    },
    {
        path: 'o-nas/rodina2.jpg',
        width: 800,
        quality: 75,
        format: 'jpg'
    },
    {
        path: 'galeria/ubytovanie/dvor-s-kostolom-x.jpg',
        width: 800,
        quality: 75,
        format: 'jpg'
    },
    {
        path: 'galeria/ubytovanie/vyhlad-na-vinohrad-x.jpg',
        width: 800,
        quality: 75,
        format: 'jpg'
    }
];

async function optimize() {
    console.log('🏁 Starting targeted image optimization for Mobile LCP...');

    for (const target of TARGETS) {
        const absPath = path.join(PUBLIC_DIR, target.path);

        if (!fs.existsSync(absPath)) {
            console.warn(`⚠️ File not found: ${target.path}`);
            continue;
        }

        try {
            const input = sharp(absPath);
            const meta = await input.metadata();

            console.log(`Processing ${target.path}:`);
            console.log(`   Original: ${meta.width}x${meta.height} [${meta.format}]`);

            // Skip if already smaller than target
            if (meta.width <= target.width && meta.format === target.format && !process.env.FORCE) {
                console.log(`   Skipping: Width ${meta.width} <= ${target.width} and format matches.`);
                // We might still want to recompress if quality is high, but let's be safe.
                // Actually, let's force re-compression to ensure quality is 75
            }

            let pipeline = input.resize({ width: target.width, withoutEnlargement: true });

            if (target.format === 'jpg' || target.format === 'jpeg') {
                pipeline = pipeline.jpeg({ quality: target.quality, mozjpeg: true });
            } else if (target.format === 'webp') {
                pipeline = pipeline.webp({ quality: target.quality });
            }

            const tmpPath = absPath + '.tmp';
            await pipeline.toFile(tmpPath);

            const oldStats = fs.statSync(absPath);
            const newStats = fs.statSync(tmpPath);

            const savings = ((oldStats.size - newStats.size) / 1024).toFixed(2);

            if (newStats.size < oldStats.size) {
                fs.renameSync(tmpPath, absPath);
                console.log(`   ✅ Optimized! Saved ${savings} KB. New size: ${(newStats.size / 1024).toFixed(2)} KB`);
            } else {
                fs.unlinkSync(tmpPath);
                console.log(`   ℹ️ No savings (New: ${newStats.size} vs Old: ${oldStats.size}). Keeping original.`);
            }

        } catch (e) {
            console.error(`   ❌ Error processing ${target.path}:`, e.message);
        }
    }
    console.log('🎉 Optimization complete.');
}

optimize();
