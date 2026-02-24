import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export async function GET(request: NextRequest) {
    const results: any = {
        resend: null,
        superfaktura: null,
        env: {
            RESEND_API_KEY: !!process.env.RESEND_API_KEY,
            RESEND_FROM_EMAIL: process.env.RESEND_FROM_EMAIL,
            ADMIN_EMAIL: process.env.ADMIN_EMAIL,
            SUPERFAKTURA_EMAIL: !!process.env.SUPERFAKTURA_EMAIL,
            SUPERFAKTURA_API_KEY: !!process.env.SUPERFAKTURA_API_KEY,
            SUPERFAKTURA_SANDBOX: process.env.SUPERFAKTURA_SANDBOX,
        }
    };

    // 1. Test Resend
    try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        const resendTest = await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL!,
            to: process.env.ADMIN_EMAIL!,
            subject: "DEBUG: Email Test",
            html: "<p>Toto je testovací email z debug endpointu.</p>",
        });
        results.resend = resendTest;
    } catch (error: any) {
        results.resend = { error: error.message || "Unknown error" };
    }

    // 2. Test SuperFaktura
    try {
        const isSandbox = process.env.SUPERFAKTURA_SANDBOX === '1';
        const SUPERFAKTURA_API_URL = isSandbox
            ? "https://sandbox.superfaktura.sk"
            : "https://moja.superfaktura.sk";

        const email = process.env.SUPERFAKTURA_EMAIL;
        const apiKey = process.env.SUPERFAKTURA_API_KEY;
        const companyId = process.env.SUPERFAKTURA_COMPANY_ID;

        const authHeader = `SFAPI email=${email}&apikey=${apiKey}&company_id=${companyId || ''}`;

        const sfResponse = await fetch(`${SUPERFAKTURA_API_URL}/users/getUserCompaniesData`, {
            method: "GET",
            headers: {
                "Authorization": authHeader,
                "Content-Type": "application/json",
            },
        });

        if (sfResponse.ok) {
            results.superfaktura = { status: "OK", data: await sfResponse.json() };
        } else {
            results.superfaktura = { status: "ERROR", code: sfResponse.status, text: await sfResponse.text() };
        }
    } catch (error: any) {
        results.superfaktura = { error: error.message || "Unknown error" };
    }

    return NextResponse.json(results);
}
