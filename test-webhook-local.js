// Test script pre lokálny webhook
const axios = require('axios');

async function testLocalWebhook() {
  const webhookUrl = 'http://localhost:3000/api/stripe/webhook';
  
  console.log('🔍 Testing local webhook...');
  console.log('URL:', webhookUrl);
  
  try {
    // Test webhook endpoint
    const response = await axios.post(webhookUrl, {
      type: 'payment_intent.succeeded',
      data: {
        object: {
          id: 'pi_test_123',
          amount: 1190,
          currency: 'eur',
          metadata: {
            orderId: 'test-order-123',
            item_1_title: 'Test Product',
            item_1_qty: '1',
            item_1_price_cents: '1190',
            shippingMethod: 'Test Shipping',
            shippingPriceCents: '300',
            billing_firstName: 'Test',
            billing_lastName: 'User',
            billing_email: 'test@example.com',
            billing_address1: 'Test Address',
            billing_city: 'Test City',
            billing_postalCode: '12345',
            billing_country: 'SK'
          }
        }
      }
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Webhook test successful');
    console.log('Status:', response.status);
  } catch (error) {
    console.log('❌ Webhook test failed:', error.response?.status, error.message);
  }
}

testLocalWebhook();
