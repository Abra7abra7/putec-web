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
  const locale = (formData.get("locale") as string) || "sk";
  const isEn = locale === "en";

  const messages = {
    invalidEmail: isEn ? "Invalid email address" : "Neplatný email",
    notConfigured: isEn ? "Newsletter system is not configured" : "Newsletter systém nie je nakonfigurovaný",
    adminSubject: isEn ? "📧 New newsletter registration" : "📧 Nová registrácia do newslettera",
    adminText: isEn ? "New newsletter registration" : "Nová registrácia do newslettera",
    success: isEn ? "Thank you for subscribing to our newsletter!" : "Ďakujeme za prihlásenie do newslettera!",
    sendError: isEn ? "Error sending. Please try again later." : "Chyba pri odosielaní. Skúste to prosím neskôr.",
    unexpectedError: isEn ? "Unexpected error. Please try again later." : "Neočakávaná chyba. Skúste to prosím neskôr.",
  };

  try {
    // Validate input
    const email = formData.get("email");

    // Dynamic schema for localized error messages
    const schema = z.object({
      email: z.string().email(messages.invalidEmail),
    });

    const validationResult = schema.safeParse({ email });

    if (!validationResult.success) {
      return {
        success: false,
        message: messages.invalidEmail,
        errors: validationResult.error.flatten().fieldErrors,
      };
    }

    const { email: validatedEmail } = validationResult.data;

    // Check if Resend is configured
    if (!resend) {
      console.error("[Newsletter] RESEND_API_KEY not configured");
      return {
        success: false,
        message: messages.notConfigured,
      };
    }

    // Send notification to admin
    try {
      await resend.emails.send({
        from: fromEmail,
        to: process.env.ADMIN_EMAIL || "info@vinoputec.sk",
        subject: messages.adminSubject,
        text: `${messages.adminText}:\n\nEmail: ${validatedEmail}\n\nDate: ${new Date().toLocaleString(locale === 'sk' ? "sk-SK" : "en-US")}`,
      });

      console.log(`✅ Newsletter subscription (${locale}):`, validatedEmail);

      return {
        success: true,
        message: messages.success,
      };
    } catch (error) {
      console.error("[Newsletter] Failed to send email:", error);
      return {
        success: false,
        message: messages.sendError,
      };
    }
  } catch (error) {
    console.error("[Newsletter] Unexpected error:", error);
    return {
      success: false,
      message: messages.unexpectedError,
    };
  }
}

