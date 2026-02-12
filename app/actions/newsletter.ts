"use server";

import { z } from "zod";
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const fromEmail = process.env.RESEND_FROM_EMAIL || "Newsletter <onboarding@resend.dev>";

// Validation schema
const NewsletterSchema = z.object({
  email: z.string().email("Neplatná emailová adresa"),
});

export type NewsletterState = {
  success: boolean;
  message: string;
  errors?: {
    email?: string[];
  };
};

/**
 * Server Action: Subscribe to newsletter
 */
export async function subscribeToNewsletter(
  prevState: NewsletterState | null,
  formData: FormData
): Promise<NewsletterState> {
  try {
    // Validate input
    const email = formData.get("email");
    const validationResult = NewsletterSchema.safeParse({ email });

    if (!validationResult.success) {
      return {
        success: false,
        message: "Neplatný email",
        errors: validationResult.error.flatten().fieldErrors,
      };
    }

    const { email: validatedEmail } = validationResult.data;

    // Check if Resend is configured
    if (!resend) {
      console.error("[Newsletter] RESEND_API_KEY not configured");
      return {
        success: false,
        message: "Newsletter systém nie je nakonfigurovaný",
      };
    }

    // Send notification to admin
    try {
      await resend.emails.send({
        from: fromEmail,
        to: process.env.ADMIN_EMAIL || "info@vinoputec.sk",
        subject: "📧 Nová registrácia do newslettera",
        text: `Nová registrácia do newslettera:\n\nEmail: ${validatedEmail}\n\nDátum: ${new Date().toLocaleString("sk-SK")}`,
      });

      console.log("✅ Newsletter subscription:", validatedEmail);

      return {
        success: true,
        message: "Ďakujeme za prihlásenie do newslettera!",
      };
    } catch (error) {
      console.error("[Newsletter] Failed to send email:", error);
      return {
        success: false,
        message: "Chyba pri odosielaní. Skúste to prosím neskôr.",
      };
    }
  } catch (error) {
    console.error("[Newsletter] Unexpected error:", error);
    return {
      success: false,
      message: "Neočakávaná chyba. Skúste to prosím neskôr.",
    };
  }
}

