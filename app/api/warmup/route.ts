import { NextResponse } from "next/server";

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

async function ping(url: string) {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), 8000);
  try {
    const res = await fetch(url, { cache: 'no-store', signal: controller.signal });
    return { url, ok: res.ok, status: res.status };
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'error';
    return { url, ok: false, status: 0, error: msg };
  } finally {
    clearTimeout(t);
  }
}

export async function GET() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://vino-putec-web.vercel.app';
  const targets = [
    `${base}/`,
    `${base}/galeria/ubytovanie`,
    `${base}/degustacie`,
    `${base}/ubytovanie`,
  ];
  const results = await Promise.all(targets.map(ping));
  return NextResponse.json({ warmed: results });
}


