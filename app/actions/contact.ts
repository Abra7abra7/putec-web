"use server";

import { z } from "zod";
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const fromEmail = process.env.RESEND_FROM_EMAIL || "Kontakt <onboarding@resend.dev>";

// Validation schema
const ContactSchema = z.object({
  name: z.string().min(2, "Meno musí mať aspoň 2 znaky"),
  email: z.string().email("Neplatná emailová adresa"),
  message: z.string().min(10, "Správa musí mať aspoň 10 znakov"),
});

export type ContactState = {
  success: boolean;
  message: string;
  errors?: {
    name?: string[];
    email?: string[];
    message?: string[];
  };
};

/**
 * Server Action: Send contact form message
 */
export async function sendContactMessage(
  prevState: ContactState | null,
  formData: FormData
): Promise<ContactState> {
  try {
    // Validate input
    const name = formData.get("name");
    const email = formData.get("email");
    const message = formData.get("message");

    const validationResult = ContactSchema.safeParse({ name, email, message });

    if (!validationResult.success) {
      return {
        success: false,
        message: "Prosím, skontrolujte formulár",
        errors: validationResult.error.flatten().fieldErrors,
      };
    }

    const { name: validatedName, email: validatedEmail, message: validatedMessage } = validationResult.data;

    // Check if Resend is configured
    if (!resend) {
      console.error("[Contact] RESEND_API_KEY not configured");
      return {
        success: false,
        message: "Kontaktný systém nie je nakonfigurovaný",
      };
    }

    // Send email to admin
    try {
      await resend.emails.send({
        from: fromEmail,
        to: process.env.ADMIN_EMAIL || "info@vinoputec.sk",
        replyTo: validatedEmail,
        subject: `📧 Nová správa od ${validatedName}`,
        text: `Nová kontaktná správa:\n\nMeno: ${validatedName}\nEmail: ${validatedEmail}\n\nSpráva:\n${validatedMessage}\n\nDátum: ${new Date().toLocaleString("sk-SK")}`,
      });

      console.log("✅ Contact form submitted:", validatedEmail);

      return {
        success: true,
        message: "Ďakujeme! Vaša správa bola odoslaná.",
      };
    } catch (error) {
      console.error("[Contact] Failed to send email:", error);
      return {
        success: false,
        message: "Chyba pri odosielaní správy. Skúste to prosím neskôr.",
      };
    }
  } catch (error) {
    console.error("[Contact] Unexpected error:", error);
    return {
      success: false,
      message: "Neočakávaná chyba. Skúste to prosím neskôr.",
    };
  }
}

