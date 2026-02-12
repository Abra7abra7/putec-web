// Test SuperFaktúra API pripojenia
const fs = require('fs');
const path = require('path');

// Load .env.local manually
const envPath = path.join(__dirname, '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    if (line && !line.startsWith('#') && line.includes('=')) {
      const [key, ...values] = line.split('=');
      process.env[key.trim()] = values.join('=').trim();
    }
  });
}

const SUPERFAKTURA_API_URL = process.env.SUPERFAKTURA_SANDBOX === "true"
  ? "https://sandbox.superfaktura.sk"
  : "https://moja.superfaktura.sk";

async function testSuperFakturaAPI() {
  const apiKey = process.env.SUPERFAKTURA_API_KEY;
  const email = process.env.SUPERFAKTURA_EMAIL;

  console.log("🔑 API Key:", apiKey ? `${apiKey.substring(0, 10)}...` : "❌ CHÝBA");
  console.log("📧 Email:", email || "❌ CHÝBA");

  if (!apiKey || !email) {
    console.error("\n❌ SuperFaktúra credentials nie sú nastavené v .env.local");
    process.exit(1);
  }

  const auth = Buffer.from(`${email}:${apiKey}`).toString("base64");
  console.log("\n🔐 Authorization:", `Basic ${auth.substring(0, 20)}...`);

  try {
    console.log("\n1️⃣ Testovanie: GET /users/getUserCompaniesData");
    const response1 = await fetch(`${SUPERFAKTURA_API_URL}/users/getUserCompaniesData`, {
      method: "GET",
      headers: {
        "Authorization": `Basic ${auth}`,
        "Content-Type": "application/json",
      },
    });

    console.log("   Status:", response1.status, response1.statusText);
    const text1 = await response1.text();
    
    if (response1.ok) {
      try {
        const data = JSON.parse(text1);
        console.log("   ✅ Response (JSON):", JSON.stringify(data, null, 2).substring(0, 500));
      } catch (e) {
        console.log("   ⚠️ Response (TEXT):", text1.substring(0, 500));
      }
    } else {
      console.log("   ❌ Error:", text1.substring(0, 500));
    }

    console.log("\n2️⃣ Testovanie: GET /clients/index.json");
    const response2 = await fetch(`${SUPERFAKTURA_API_URL}/clients/index.json?per_page=1`, {
      method: "GET",
      headers: {
        "Authorization": `Basic ${auth}`,
        "Content-Type": "application/json",
      },
    });

    console.log("   Status:", response2.status, response2.statusText);
    const text2 = await response2.text();
    
    if (response2.ok) {
      try {
        const data = JSON.parse(text2);
        console.log("   ✅ Response (JSON):", JSON.stringify(data, null, 2).substring(0, 500));
      } catch (e) {
        console.log("   ⚠️ Response (TEXT):", text2.substring(0, 500));
      }
    } else {
      console.log("   ❌ Error:", text2.substring(0, 500));
    }

    console.log("\n3️⃣ Testovanie: GET /invoices/index.json");
    const response3 = await fetch(`${SUPERFAKTURA_API_URL}/invoices/index.json?per_page=1`, {
      method: "GET",
      headers: {
        "Authorization": `Basic ${auth}`,
        "Content-Type": "application/json",
      },
    });

    console.log("   Status:", response3.status, response3.statusText);
    const text3 = await response3.text();
    
    if (response3.ok) {
      try {
        const data = JSON.parse(text3);
        console.log("   ✅ Response (JSON):", JSON.stringify(data, null, 2).substring(0, 500));
        console.log("\n✅ ✅ ✅ SuperFaktúra API funguje správne!");
      } catch (e) {
        console.log("   ⚠️ Response (TEXT):", text3.substring(0, 500));
      }
    } else {
      console.log("   ❌ Error:", text3.substring(0, 500));
    }

  } catch (error) {
    console.error("\n❌ Chyba:", error.message);
  }
}

testSuperFakturaAPI();

