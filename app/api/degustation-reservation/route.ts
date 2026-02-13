import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { render } from '@react-email/render';
import DegustationReservationAdmin from '../../emails/DegustationReservationAdmin';
import DegustationReservationCustomer from '../../emails/DegustationReservationCustomer';
import fs from 'fs';
import path from 'path';

// Initialize Resend lazily to prevent build errors when API key is missing
const getResend = () => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    // During build or if missing, return a dummy or throw only when called
    return new Resend('re_dummy_key_for_build');
  }
  return new Resend(apiKey);
};

const resend = getResend();

// Load logo as inline attachment (no filename to prevent it from appearing as attachment)
const logoPath = path.join(process.cwd(), 'public', 'putec-logo.jpg');
const logoBuffer = fs.readFileSync(logoPath);
const logoAttachment = {
  content: logoBuffer,
  cid: 'logo', // Content-ID for inline reference in HTML
};

interface ReservationData {
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  message: string;
  productTitle: string;
  productPrice: string;
  productDeposit?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: ReservationData = await req.json();

    // Basic validation
    if (!body.name || !body.email || !body.phone || !body.date || !body.time || !body.guests) {
      return NextResponse.json({ error: "Chýbajú povinné údaje" }, { status: 400 });
    }

    // Send admin email
    const logoBase64 = `data:image/jpeg;base64,${logoBuffer.toString('base64')}`;
    const adminEmailHTML = await render(DegustationReservationAdmin({ ...body, logoSrc: logoBase64 }));

    console.log("📧 Sending admin email to:", process.env.ADMIN_EMAIL);
    console.log("📧 From email:", process.env.RESEND_FROM_EMAIL);

    const adminResult = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: process.env.ADMIN_EMAIL!,
      subject: `🍷 Nová rezervácia degustácie od ${body.name}`,
      html: adminEmailHTML,
    });

    console.log("✅ Admin email sent:", adminResult);

    // Send customer email
    const customerEmailHTML = await render(DegustationReservationCustomer({ ...body, logoSrc: logoBase64 }));

    console.log("📧 Sending customer email to:", body.email);

    const customerResult = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: body.email,
      subject: '🍷 Potvrdenie rezervácie degustácie - Vino Pútec',
      html: customerEmailHTML,
    });

    console.log("✅ Customer email sent:", customerResult);

    return NextResponse.json({
      success: true,
      message: "Rezervácia bola úspešne odoslaná"
    });

  } catch (error) {
    console.error('❌ Reservation error:', error);
    console.error('❌ Error details:', JSON.stringify(error, null, 2));
    return NextResponse.json({
      error: "Chyba pri odosielaní rezervácie",
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
