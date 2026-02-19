"use server";

import { z } from "zod";
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const fromEmail = process.env.RESEND_FROM_EMAIL || "Dopyt <onboarding@resend.dev>";

// Validation schema for Inquiries
const InquirySchema = z.object({
    name: z.string().min(2, "Meno musí mať aspoň 2 znaky"),
    email: z.string().email("Neplatná emailová adresa"),
    phone: z.string().min(6, "Neplatné telefónne číslo"),
    peopleCount: z.string().optional(),
    date: z.string().optional(),
    message: z.string().min(5, "Správa musí mať aspoň 5 znakov"),
});

export type InquiryState = {
    success: boolean;
    message: string;
    errors?: {
        name?: string[];
        email?: string[];
        phone?: string[];
        peopleCount?: string[];
        date?: string[];
        message?: string[];
    };
};

/**
 * Server Action: Send teambuilding / accommodation inquiry
 */
export async function sendInquiry(
    prevState: InquiryState | null,
    formData: FormData
): Promise<InquiryState> {
    try {
        // Extract data
        const name = formData.get("name") as string;
        const email = formData.get("email") as string;
        const phone = formData.get("phone") as string;
        const peopleCount = formData.get("peopleCount") as string;
        const date = formData.get("date") as string;
        const message = formData.get("message") as string;

        const validationResult = InquirySchema.safeParse({ name, email, phone, peopleCount, date, message });

        if (!validationResult.success) {
            return {
                success: false,
                message: "Prosím, skontrolujte formulár",
                errors: validationResult.error.flatten().fieldErrors,
            };
        }

        const {
            name: vName,
            email: vEmail,
            phone: vPhone,
            peopleCount: vPeople,
            date: vDate,
            message: vMessage
        } = validationResult.data;

        // Check if Resend is configured
        if (!resend) {
            console.error("[Inquiry] RESEND_API_KEY not configured");
            return {
                success: false,
                message: "Systém dopytov nie je momentálne dostupný (chýba API kľúč)",
            };
        }

        // Send email to admin
        try {
            await resend.emails.send({
                from: fromEmail,
                to: process.env.ADMIN_EMAIL || "info@vinoputec.sk",
                replyTo: vEmail,
                subject: `🏨 Nový dopyt na ubytovanie/teambuilding: ${vName}`,
                text: `Nový dopyt z webu:\n\n` +
                    `Meno: ${vName}\n` +
                    `Email: ${vEmail}\n` +
                    `Telefón: ${vPhone}\n` +
                    `Počet osôb: ${vPeople || "neuvedené"}\n` +
                    `Predbežný termín: ${vDate || "neuvedené"}\n\n` +
                    `Správa:\n${vMessage}\n\n` +
                    `Dátum dopytu: ${new Date().toLocaleString("sk-SK")}`,
            });

            console.log("✅ Inquiry submitted:", vEmail);

            return {
                success: true,
                message: "Váš dopyt bol úspešne odoslaný. Budeme Vás čoskoro kontaktovať.",
            };
        } catch (error) {
            console.error("[Inquiry] Failed to send email:", error);
            return {
                success: false,
                message: "Chyba pri odosielaní dopytu. Skúste to prosím neskôr.",
            };
        }
    } catch (error) {
        console.error("[Inquiry] Unexpected error:", error);
        return {
            success: false,
            message: "Neočakávaná chyba. Skúste to prosím neskôr.",
        };
    }
}
