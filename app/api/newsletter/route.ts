import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";

// Validačná schéma pre newsletter subscription
const NewsletterSchema = z.object({
  email: z.string().email("Neplatný email formát").min(1, "Email je povinný"),
});

/**
 * POST /api/newsletter
 * Subscribe user to newsletter
 * 
 * @body email: string - User email address
 */
export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const validationResult = NewsletterSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Validácia zlyhala",
          details: validationResult.error.issues.map((issue) => issue.message),
        },
        { status: 400 }
      );
    }

    const { email } = validationResult.data;

    // Check for required environment variables
    if (!process.env.RESEND_API_KEY || !process.env.RESEND_FROM_EMAIL || !process.env.ADMIN_EMAIL) {
      console.error("[API Error - Newsletter] Missing environment variables");
      return NextResponse.json(
        { error: "Služba newsletter nie je nakonfigurovaná" },
        { status: 500 }
      );
    }

    // Setup Resend
    const resend = new Resend(process.env.RESEND_API_KEY);

    // Send notification email to admin about new subscription
    try {
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL,
        to: process.env.ADMIN_EMAIL,
        subject: "Nové prihlásenie do newsletteru",
        html: `
          <h2>Nové prihlásenie do newsletteru</h2>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Dátum:</strong> ${new Date().toLocaleString("sk-SK")}</p>
        `,
      });
    } catch (error) {
      console.error("[API Error - Newsletter] Failed to send admin notification:", error);
      // Continue even if admin notification fails
    }

    // Send welcome email to subscriber
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL,
      to: email,
      subject: "Vitajte v našom newsletteri!",
      html: `
        <h2>Ďakujeme za prihlásenie!</h2>
        <p>Vitajte v našom newsletteri. Budeme vás informovať o novinkách a špeciálnych ponukách.</p>
        <p>S pozdravom,<br/>Tím Vino Pútec</p>
      `,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Úspešne prihlásený do newsletteru",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[API Error - Newsletter]", error);

    // Handle Resend API errors
    if (error instanceof Error && error.message.includes("Resend")) {
      return NextResponse.json(
        {
          error: "Email sa nepodarilo odoslať",
          message: process.env.NODE_ENV === "development" ? error.message : undefined,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        error: "Chyba servera",
        message: process.env.NODE_ENV === "development" && error instanceof Error ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

