import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Section,
  Text,
  Hr,
  Row,
  Column,
} from '@react-email/components';
import * as React from 'react';

interface OrderConfirmationAdminProps {
  orderId: string;
  orderDate: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: {
    firstName: string;
    lastName: string;
    address1: string;
    address2?: string;
    city: string;
    postalCode: string;
    country: string;
    phone: string;
    isCompany?: boolean;
    companyName?: string;
    companyICO?: string;
    companyDIC?: string;
    companyICDPH?: string;
  };
  billingAddress: {
    firstName: string;
    lastName: string;
    address1: string;
    address2?: string;
    city: string;
    postalCode: string;
    country: string;
    isCompany?: boolean;
    companyName?: string;
    companyICO?: string;
    companyDIC?: string;
    companyICDPH?: string;
  };
  cartItems: Array<{
    Title: string;
    quantity: number;
    RegularPrice: string;
    SalePrice?: string;
  }>;
  subtotal: number;
  shippingCost: number;
  total: number;
  shippingMethod: string;
  paymentMethod: string;
}

export const OrderConfirmationAdmin = ({
  orderId = '123456',
  orderDate = new Date().toISOString(),
  customerName = 'Ján Novák',
  customerEmail = 'jan@example.com',
  customerPhone = '+421 900 123 456',
  shippingAddress = {
    firstName: 'Ján',
    lastName: 'Novák',
    address1: 'Hlavná 1',
    city: 'Bratislava',
    postalCode: '811 01',
    country: 'Slovensko',
    phone: '+421 900 123 456',
  },
  billingAddress = {
    firstName: 'Ján',
    lastName: 'Novák',
    address1: 'Hlavná 1',
    city: 'Bratislava',
    postalCode: '811 01',
    country: 'Slovensko',
  },
  cartItems = [],
  subtotal = 0,
  shippingCost = 0,
  total = 0,
  shippingMethod = 'Slovenská pošta',
  paymentMethod = 'Dobierka',
}: OrderConfirmationAdminProps) => {
  const previewText = `Nová objednávka ${orderId} od ${customerName}`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Img
              src="cid:logo"
              width="80"
              height="80"
              alt="Vino Putec Logo"
              style={logo}
            />
          </Section>

          {/* Content */}
          <Section style={content}>
            <Text style={greeting}>Dobrý deň,</Text>
            <Text style={paragraph}>
              Prijali ste novú objednávku v e-shope. Čoskoro ju spracujeme.
            </Text>

            {/* Order Info */}
            <Section style={infoBox}>
              <Heading as="h3" style={h3}>
                Informácie o objednávke
              </Heading>
              <Text style={infoText}>
                <strong>Číslo objednávky:</strong> {orderId}
              </Text>
              <Text style={infoText}>
                <strong>Dátum objednávky:</strong>{' '}
                {new Date(orderDate).toLocaleString('sk-SK')}
              </Text>
              <Text style={infoText}>
                <strong>Spôsob dopravy:</strong> {shippingMethod}
              </Text>
              <Text style={infoText}>
                <strong>Spôsob platby:</strong> {paymentMethod}
              </Text>
            </Section>

            {/* Customer Info */}
            <Section style={infoBox}>
              <Heading as="h3" style={h3}>
                Zákazník
              </Heading>
              <Text style={infoText}>
                <strong>Meno:</strong> {customerName}
              </Text>
              <Text style={infoText}>
                <strong>Email:</strong> {customerEmail}
              </Text>
              <Text style={infoText}>
                <strong>Telefón:</strong> {customerPhone}
              </Text>
            </Section>

            {/* Shipping Address */}
            <Row>
              <Column style={addressColumn}>
                <Section style={infoBox}>
                  <Heading as="h3" style={h3}>
                    Dodacia adresa
                  </Heading>
                  <Text style={infoText}>
                    <strong>
                      {shippingAddress.firstName} {shippingAddress.lastName}
                    </strong>
                  </Text>
                  {shippingAddress.isCompany && (
                    <>
                      <Text style={infoText}>
                        <strong>Firma:</strong> {shippingAddress.companyName}
                      </Text>
                      {shippingAddress.companyICO && (
                        <Text style={infoText}>
                          <strong>IČO:</strong> {shippingAddress.companyICO}
                        </Text>
                      )}
                      {shippingAddress.companyDIC && (
                        <Text style={infoText}>
                          <strong>DIČ:</strong> {shippingAddress.companyDIC}
                        </Text>
                      )}
                      {shippingAddress.companyICDPH && (
                        <Text style={infoText}>
                          <strong>IČ DPH:</strong> {shippingAddress.companyICDPH}
                        </Text>
                      )}
                    </>
                  )}
                  <Text style={infoText}>{shippingAddress.address1}</Text>
                  {shippingAddress.address2 && (
                    <Text style={infoText}>{shippingAddress.address2}</Text>
                  )}
                  <Text style={infoText}>
                    {shippingAddress.postalCode} {shippingAddress.city}
                  </Text>
                  <Text style={infoText}>{shippingAddress.country}</Text>
                  <Text style={infoText}>
                    <strong>Tel:</strong> {shippingAddress.phone}
                  </Text>
                </Section>
              </Column>

              <Column style={addressColumn}>
                <Section style={infoBox}>
                  <Heading as="h3" style={h3}>
                    Fakturačná adresa
                  </Heading>
                  <Text style={infoText}>
                    <strong>
                      {billingAddress.firstName} {billingAddress.lastName}
                    </strong>
                  </Text>
                  {billingAddress.isCompany && (
                    <>
                      <Text style={infoText}>
                        <strong>Firma:</strong> {billingAddress.companyName}
                      </Text>
                      {billingAddress.companyICO && (
                        <Text style={infoText}>
                          <strong>IČO:</strong> {billingAddress.companyICO}
                        </Text>
                      )}
                      {billingAddress.companyDIC && (
                        <Text style={infoText}>
                          <strong>DIČ:</strong> {billingAddress.companyDIC}
                        </Text>
                      )}
                      {billingAddress.companyICDPH && (
                        <Text style={infoText}>
                          <strong>IČ DPH:</strong> {billingAddress.companyICDPH}
                        </Text>
                      )}
                    </>
                  )}
                  <Text style={infoText}>{billingAddress.address1}</Text>
                  {billingAddress.address2 && (
                    <Text style={infoText}>{billingAddress.address2}</Text>
                  )}
                  <Text style={infoText}>
                    {billingAddress.postalCode} {billingAddress.city}
                  </Text>
                  <Text style={infoText}>{billingAddress.country}</Text>
                </Section>
              </Column>
            </Row>

            {/* Order Items */}
            <Section style={infoBox}>
              <Heading as="h3" style={h3}>
                Objednané produkty
              </Heading>
              {cartItems.map((item, index) => {
                const price = parseFloat(item.SalePrice || item.RegularPrice);
                const itemTotal = price * item.quantity;
                return (
                  <Row key={index} style={productRow}>
                    <Column style={{ width: '60%' }}>
                      <Text style={productText}>
                        {item.Title} × {item.quantity}
                      </Text>
                    </Column>
                    <Column style={{ width: '40%', textAlign: 'right' }}>
                      <Text style={productText}>€{itemTotal.toFixed(2)}</Text>
                    </Column>
                  </Row>
                );
              })}
              <Hr style={divider} />
              <Row style={totalRow}>
                <Column style={{ width: '60%' }}>
                  <Text style={totalLabel}>Medzisúčet:</Text>
                </Column>
                <Column style={{ width: '40%', textAlign: 'right' }}>
                  <Text style={totalValue}>€{subtotal.toFixed(2)}</Text>
                </Column>
              </Row>
              <Row style={totalRow}>
                <Column style={{ width: '60%' }}>
                  <Text style={totalLabel}>Doprava:</Text>
                </Column>
                <Column style={{ width: '40%', textAlign: 'right' }}>
                  <Text style={totalValue}>€{shippingCost.toFixed(2)}</Text>
                </Column>
              </Row>
              <Row style={totalRow}>
                <Column style={{ width: '60%' }}>
                  <Text style={totalLabelBold}>Celkom:</Text>
                </Column>
                <Column style={{ width: '40%', textAlign: 'right' }}>
                  <Text style={totalValueBold}>€{total.toFixed(2)}</Text>
                </Column>
              </Row>
            </Section>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              <strong>Vino Putec</strong>
            </Text>
            <Text style={footerText}>
              Pezinská 154, 902 01 Vinosady, Slovensko
            </Text>
            <Text style={footerText}>
              Tel: +421 911 250 400 | Email: info@vinoputec.sk
            </Text>
            <Text style={footerCopyright}>
              © {new Date().getFullYear()} Putec s.r.o. Všetky práva vyhradené.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default OrderConfirmationAdmin;

// Styles
const main = {
  backgroundColor: '#f5f5f5',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  maxWidth: '600px',
};

const header = {
  background: 'linear-gradient(135deg, #f5d08a 0%, #e6c078 100%)',
  padding: '20px',
  textAlign: 'center' as const,
};

const logo = {
  margin: '0 auto',
  borderRadius: '50%',
  border: '4px solid #ffffff',
};

const h1 = {
  color: '#000000',
  fontSize: '28px',
  fontWeight: '700',
  margin: '0',
};

const content = {
  padding: '30px 20px',
};

const greeting = {
  fontSize: '18px',
  fontWeight: '600',
  color: '#000000',
  margin: '0 0 10px 0',
};

const paragraph = {
  fontSize: '16px',
  lineHeight: '1.6',
  color: '#666666',
  margin: '0 0 20px 0',
};

const infoBox = {
  backgroundColor: '#f9f9f9',
  border: '1px solid #e0e0e0',
  borderRadius: '8px',
  padding: '20px',
  marginBottom: '20px',
};

const h3 = {
  fontSize: '18px',
  fontWeight: '700',
  color: '#000000',
  margin: '0 0 15px 0',
  borderBottom: '2px solid #f5d08a',
  paddingBottom: '10px',
};

const infoText = {
  fontSize: '14px',
  lineHeight: '1.6',
  color: '#333333',
  margin: '5px 0',
};

const addressColumn = {
  width: '48%',
  verticalAlign: 'top',
  padding: '0 1%',
};

const productRow = {
  borderBottom: '1px solid #e0e0e0',
  paddingBottom: '10px',
  marginBottom: '10px',
};

const productText = {
  fontSize: '14px',
  color: '#333333',
  margin: '0',
};

const divider = {
  borderColor: '#e0e0e0',
  margin: '20px 0',
};

const totalRow = {
  marginTop: '10px',
};

const totalLabel = {
  fontSize: '14px',
  color: '#666666',
  margin: '0',
};

const totalValue = {
  fontSize: '14px',
  color: '#333333',
  margin: '0',
};

const totalLabelBold = {
  fontSize: '18px',
  fontWeight: '700',
  color: '#000000',
  margin: '0',
};

const totalValueBold = {
  fontSize: '18px',
  fontWeight: '700',
  color: '#f5d08a',
  margin: '0',
};

const footer = {
  backgroundColor: '#f9f9f9',
  padding: '20px',
  textAlign: 'center' as const,
  borderTop: '1px solid #e0e0e0',
};

const footerText = {
  fontSize: '14px',
  color: '#666666',
  margin: '5px 0',
};

const footerCopyright = {
  fontSize: '12px',
  color: '#999999',
  marginTop: '20px',
};

