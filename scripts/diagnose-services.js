const { Resend } = require('resend');
const dotenv = require('dotenv');
const path = require('path');
const fetch = require('node-fetch');

// Load environment variables from .env
dotenv.config({ path: path.join(__dirname, '../.env') });

async function testResend() {
    console.log('\n--- Testing Resend ---');
    const apiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.RESEND_FROM_EMAIL;
    const adminEmail = process.env.ADMIN_EMAIL;

    if (!apiKey) {
        console.error('❌ RESEND_API_KEY is missing');
        return;
    }

    console.log('✅ API Key found:', apiKey.substring(0, 10) + '...');
    console.log('✅ From Email:', fromEmail);
    console.log('✅ Test To Email:', adminEmail);

    const resend = new Resend(apiKey);

    try {
        const result = await resend.emails.send({
            from: fromEmail,
            to: adminEmail,
            subject: 'Test Email - Putec Debug',
            html: '<p>Toto je testovací email z diagnostického skriptu.</p>'
        });

        console.log('✅ Resend result:', JSON.stringify(result, null, 2));
    } catch (error) {
        console.error('❌ Resend failed:', error);
    }
}

async function testSuperFaktura() {
    console.log('\n--- Testing SuperFaktura ---');
    const email = process.env.SUPERFAKTURA_EMAIL;
    const apiKey = process.env.SUPERFAKTURA_API_KEY;
    const companyId = process.env.SUPERFAKTURA_COMPANY_ID;
    const sandbox = process.env.SUPERFAKTURA_SANDBOX;

    const baseUrl = sandbox === '1' ? 'https://sandbox.superfaktura.sk' : 'https://moja.superfaktura.sk';

    console.log('✅ Email:', email);
    console.log('✅ API Key:', apiKey ? 'FOUND' : 'MISSING');
    console.log('✅ Sandbox:', sandbox);
    console.log('✅ Base URL:', baseUrl);

    if (!email || !apiKey) {
        console.error('❌ SuperFaktura credentials missing');
        return;
    }

    const authHeader = `SFAPI email=${email}&apikey=${apiKey}&company_id=${companyId || ''}`;

    try {
        const response = await fetch(`${baseUrl}/users/getUserCompaniesData`, {
            method: 'GET',
            headers: {
                'Authorization': authHeader,
                'Content-Type': 'application/json'
            }
        });

        console.log('📡 Response Status:', response.status);
        if (response.ok) {
            const data = await response.json();
            console.log('✅ SuperFaktura connection successful!');
            console.log('🏢 Companies:', data.length);
        } else {
            const errorText = await response.text();
            console.error('❌ SuperFaktura request failed:', errorText);
        }
    } catch (error) {
        console.error('❌ SuperFaktura test failed:', error);
    }
}

async function run() {
    await testResend();
    await testSuperFaktura();
}

run();
