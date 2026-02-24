import Stripe from 'stripe';
import { createSuperFakturaInvoice as createInvoice } from '../utils/superFakturaApi';
import { OrderBody, OrderCartItem } from '../../types/Order';

/**
 * Transforms Stripe PaymentIntent metadata into OrderBody and creates a SuperFaktúra invoice
 */
export async function createSuperFakturaInvoice(pi: Stripe.PaymentIntent, chargeEmail?: string | null) {
  console.log('🧾 [SuperFaktura Action] Transforming PaymentIntent to OrderBody...');

  const metadata = pi.metadata as Record<string, string>;
  const orderId = metadata.orderId || pi.id;

  // 1. Map payment method
  const paymentMethod = (metadata.paymentMethod || 'stripe') as string;

  // 2. Parse billing form
  let billingParsed: any = {};
  if (metadata.billing) {
    try { billingParsed = JSON.parse(metadata.billing); } catch { /* ignore */ }
  }

  // 3. Parse shipping form
  let shippingParsed: any = {};
  if (metadata.shipping) {
    try { shippingParsed = JSON.parse(metadata.shipping); } catch { /* ignore */ }
  }

  const customerEmail = chargeEmail || pi.receipt_email || billingParsed.email || metadata.billing_email || '';

  // 4. Parse cart items
  const cartItems: OrderCartItem[] = [];
  if (metadata.cart_items) {
    try {
      const parsed = JSON.parse(metadata.cart_items) as Array<{ id: string; title: string; qty: number; price: number }>;
      parsed.forEach(item => {
        cartItems.push({
          ID: item.id || '',
          Title: item.title || '',
          Slug: item.id || '',
          Enabled: true,
          CatalogVisible: true,
          ProductCategories: [],
          ProductImageGallery: [],
          RegularPrice: item.price?.toString() || '0',
          SalePrice: item.price?.toString() || '',
          quantity: item.qty || 1,
          FeatureImageURL: '',
          ShortDescription: '',
          LongDescription: '',
          Currency: 'EUR',
          SubscriptionEnabled: false,
          SubscriptionType: '',
          ProductType: 'wine',
        });
      });
    } catch {
      console.warn('⚠️ [SuperFaktura Action] Failed to parse cart_items JSON');
    }
  }

  // 5. Construct OrderBody
  const orderData: OrderBody = {
    orderId,
    orderDate: new Date().toISOString(),
    cartItems,
    shippingForm: {
      firstName: shippingParsed.fn || metadata.shipping_firstName || '',
      lastName: shippingParsed.ln || metadata.shipping_lastName || '',
      country: shippingParsed.country || metadata.shipping_country || 'SK',
      state: shippingParsed.state || metadata.shipping_state || '',
      city: shippingParsed.city || metadata.shipping_city || '',
      address1: shippingParsed.addr || metadata.shipping_address1 || '',
      address2: shippingParsed.addr2 || metadata.shipping_address2 || '',
      postalCode: shippingParsed.zip || metadata.shipping_postalCode || '',
      phone: shippingParsed.phone || metadata.shipping_phone || '',
      email: shippingParsed.email || metadata.shipping_email || customerEmail,
      isCompany: shippingParsed.company === '1' || metadata.shipping_is_company === '1',
      companyName: shippingParsed.cname || metadata.shipping_company_name,
      companyICO: shippingParsed.ico || metadata.shipping_company_ico,
      companyDIC: shippingParsed.dic || metadata.shipping_company_dic,
      companyICDPH: metadata.shipping_company_icdph,
    },
    billingForm: {
      firstName: billingParsed.fn || metadata.billing_firstName || '',
      lastName: billingParsed.ln || metadata.billing_lastName || '',
      country: billingParsed.country || metadata.billing_country || 'SK',
      state: billingParsed.state || metadata.billing_state || '',
      city: billingParsed.city || metadata.billing_city || '',
      address1: billingParsed.addr || metadata.billing_address1 || '',
      address2: billingParsed.addr2 || metadata.billing_address2 || '',
      postalCode: billingParsed.zip || metadata.billing_postalCode || '',
      phone: billingParsed.phone || metadata.billing_phone || '',
      email: billingParsed.email || metadata.billing_email || customerEmail,
      isCompany: billingParsed.company === '1' || metadata.billing_is_company === '1',
      companyName: billingParsed.cname || metadata.billing_company_name,
      companyICO: billingParsed.ico || metadata.billing_company_ico,
      companyDIC: billingParsed.dic || metadata.billing_company_dic,
      companyICDPH: metadata.billing_company_icdph,
    },
    shippingMethod: {
      id: metadata.shippingMethodId || 'standard',
      name: metadata.shippingMethod || 'Doprava',
      price: parseInt(metadata.shippingPriceCents || '0') / 100,
      currency: 'EUR',
    },
    paymentMethodId: paymentMethod,
    codFee: parseInt(metadata.codFeeCents || '0') / 100,
  };

  // 6. Call the unified utility
  console.log('🚀 [SuperFaktura Action] Calling unified createInvoice utility...');
  return await createInvoice(orderData);
}
