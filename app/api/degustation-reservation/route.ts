import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

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

    // Initialize Resend only when handler is invoked and env exists
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const RESEND_FROM_EMAIL = process.env.RESEND_FROM_EMAIL;
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

    if (!RESEND_API_KEY || !RESEND_FROM_EMAIL || !ADMIN_EMAIL) {
      console.warn('RESEND env missing – skipping email send');
      return NextResponse.json({
        success: true,
        message: 'Rezervácia prijatá. Emailový servis nie je nakonfigurovaný.'
      });
    }

    const resend = new Resend(RESEND_API_KEY);

    // Send admin email
    const adminEmailText = `
Nová rezervácia degustácie:

Produkt: ${body.productTitle}
Cena: ${body.productPrice}${body.productDeposit ? ` (Záloha: ${body.productDeposit})` : ''}

Zákazník:
- Meno: ${body.name}
- Email: ${body.email}
- Telefón: ${body.phone}

Rezervácia:
- Dátum: ${new Date(body.date).toLocaleDateString('sk-SK')}
- Čas: ${body.time}
- Počet osôb: ${body.guests}

${body.message ? `Poznámky: ${body.message}` : ''}

Rezervácia vytvorená: ${new Date().toLocaleString('sk-SK')}
    `;

    console.log("📧 Sending admin email to:", ADMIN_EMAIL);
    console.log("📧 From email:", RESEND_FROM_EMAIL);
    
    const adminResult = await resend.emails.send({
      from: "Rezervácie <onboarding@resend.dev>",
      to: ADMIN_EMAIL,
      subject: `🍷 Nová rezervácia degustácie od ${body.name}`,
      text: adminEmailText,
    });
    
    console.log("✅ Admin email sent:", adminResult);

    // Send customer email
    const customerEmailText = `
Vážený/á ${body.name},

Ďakujeme za rezerváciu degustácie!

Detaily rezervácie:
- Produkt: ${body.productTitle}
- Dátum: ${new Date(body.date).toLocaleDateString('sk-SK')}
- Čas: ${body.time}
- Počet osôb: ${body.guests}
- Cena: ${body.productPrice}${body.productDeposit ? ` (Záloha: ${body.productDeposit})` : ''}

${body.message ? `Vaše poznámky: ${body.message}` : ''}

Kontaktné údaje:
- Telefón: ${body.phone}
- Email: ${body.email}

V prípade otázok nás kontaktujte na ${process.env.ADMIN_EMAIL}.

Tešíme sa na vás!

S pozdravom,
Tím Vino Pútec
    `;

    console.log("📧 Sending customer email to:", body.email);
    
    const customerResult = await resend.emails.send({
      from: "Rezervácie <onboarding@resend.dev>",
      to: body.email,
      subject: '🍷 Potvrdenie rezervácie degustácie - Vino Pútec',
      text: customerEmailText,
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

