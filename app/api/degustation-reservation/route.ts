import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { render } from '@react-email/render';
import DegustationReservationAdmin from '../../emails/DegustationReservationAdmin';
import DegustationReservationCustomer from '../../emails/DegustationReservationCustomer';

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

// Initialize Resend lazily to prevent build errors when API key is missing

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
    const adminEmailHTML = await render(DegustationReservationAdmin(body));

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
    const customerEmailHTML = await render(DegustationReservationCustomer({
      ...body,
      logoSrc: "https://pub-049b5673c21f4cc291802dc6fc171c6c.r2.dev/putec-logo.jpg"
    }));

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
