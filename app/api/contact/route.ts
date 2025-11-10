import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { render } from '@react-email/render';
import ContactForm from '../../emails/ContactForm';
import fs from 'fs';
import path from 'path';

// Load logo as inline attachment (no filename to prevent it from appearing as attachment)
const logoPath = path.join(process.cwd(), 'public', 'putec-logo.jpg');
const logoBuffer = fs.readFileSync(logoPath);
const logoAttachment = {
  content: logoBuffer,
  cid: 'logo', // Content-ID for inline reference in HTML
};

export async function POST(req: Request) {
  const { name, email, message } = await req.json();

  // Basic validation
  if (!name || !email || !message) {
    return NextResponse.json(
      { success: false, message: 'Všetky polia sú povinné.' },
      { status: 400 }
    );
  }

  // Setup Resend
  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const contactHTML = await render(ContactForm({ name, email, message }));
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: process.env.ADMIN_EMAIL!,
      subject: `Kontaktný formulár od ${name}`,
      html: contactHTML,
      attachments: [logoAttachment],
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('❌ Failed to send email via Resend:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
