/*
  Batch optimization of public images: in-place resize + recompress.
  - Preserves logical structure under /public
  - Default: in-place overwrite (same filename & extension)
  - Optional DRY RUN: set env DRY_RUN=1 to only log actions
*/

import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const PUBLIC_DIR = path.join(process.cwd(), 'public');
const INCLUDE_DIRS = [
  'degustacie',
  'galeria',
  'ubytovanie',
  'o-nas',
  'vina',
];

const MAX_WIDTH = 1600; // stricter cap for faster delivery
const JPEG_QUALITY = 75; // mozjpeg
const WEBP_QUALITY = 70;
const AVIF_QUALITY = 60;

const DRY_RUN = process.env.DRY_RUN === '1' || process.argv.includes('--dry-run');

function isImageFile(fileName: string): boolean {
  return /\.(jpe?g|png|webp|avif)$/i.test(fileName);
}

async function ensureDir(dirPath: string) {
  await fs.promises.mkdir(dirPath, { recursive: true });
}

async function optimizeOneImage(absPath: string) {
  const rel = path.relative(PUBLIC_DIR, absPath);
  const ext = path.extname(absPath).toLowerCase();
  const base = absPath.slice(0, -ext.length);

  try {
    const input = sharp(absPath, { unlimited: true });
    const meta = await input.metadata();
    if (!meta.width) return;
    const targetWidth = Math.min(meta.width, MAX_WIDTH);

    // Build pipeline: resize if larger; recompress by original format
    let pipeline = input.resize({ width: targetWidth, withoutEnlargement: true });

    const tmpPath = `${base}.tmp${ext}`;
    if (ext === '.jpg' || ext === '.jpeg') {
      pipeline = pipeline.jpeg({ quality: JPEG_QUALITY, mozjpeg: true });
    } else if (ext === '.png') {
      // Use palette + compression
      pipeline = pipeline.png({ compressionLevel: 9, palette: true, quality: 80 as any });
    } else if (ext === '.webp') {
      pipeline = pipeline.webp({ quality: WEBP_QUALITY });
    } else if (ext === '.avif') {
      pipeline = pipeline.avif({ quality: AVIF_QUALITY });
    }

    if (DRY_RUN) {
      const resizeNote = meta.width > targetWidth ? `resize ${meta.width}→${targetWidth}px, ` : '';
      console.log(`[DRY] ${rel}: ${resizeNote}recompress ${ext}`);
      return;
    }

    await pipeline.toFile(tmpPath);
    await fs.promises.rename(tmpPath, absPath);
    console.log(`✓ ${rel} optimized (${meta.width}→${targetWidth}px)`);
  } catch (e) {
    console.warn(`! Failed ${rel}:`, (e as Error).message);
  }
}

async function walkAndOptimize(root: string) {
  const entries = await fs.promises.readdir(root, { withFileTypes: true });
  for (const ent of entries) {
    const abs = path.join(root, ent.name);
    if (ent.isDirectory()) {
      await walkAndOptimize(abs);
    } else if (ent.isFile() && isImageFile(ent.name)) {
      await optimizeOneImage(abs);
    }
  }
}

async function main() {
  for (const dir of INCLUDE_DIRS) {
    const absDir = path.join(PUBLIC_DIR, dir);
    if (!fs.existsSync(absDir)) continue;
    await ensureDir(absDir);
    await walkAndOptimize(absDir);
  }

  // Special small assets
  const logoPath = path.join(PUBLIC_DIR, 'putec-logo.jpg');
  if (fs.existsSync(logoPath)) {
    if (DRY_RUN) {
      console.log('[DRY] putec-logo.jpg: resize→160px, recompress jpeg');
    } else {
      const tmp = logoPath.replace(/\.[^.]+$/, '.tmp.jpg');
      await sharp(logoPath)
        .resize({ width: 160, withoutEnlargement: true })
        .jpeg({ quality: 80, mozjpeg: true })
        .toFile(tmp);
      await fs.promises.rename(tmp, logoPath);
      console.log('✓ Logo optimized in-place to 160px');
    }
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});


