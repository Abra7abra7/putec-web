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
  Link,
} from '@react-email/components';
import * as React from 'react';

interface OrderConfirmationCustomerProps {
  orderId: string;
  orderDate: string;
  customerName: string;
  cartItems: Array<{
    Title: string;
    Slug: string;
    quantity: number;
    RegularPrice: string;
    SalePrice?: string;
  }>;
  subtotal: number;
  shippingCost: number;
  total: number;
  shippingMethod: string;
  paymentMethod: string;
  logoSrc?: string;
}

export const OrderConfirmationCustomer = ({
  orderId = '123456',
  orderDate = new Date().toISOString(),
  customerName = 'Ján Novák',
  cartItems = [],
  subtotal = 0,
  shippingCost = 0,
  total = 0,
  shippingMethod = 'Slovenská pošta',
  paymentMethod = 'Dobierka',
  logoSrc = 'https://vinoputec.sk/putec-logo.jpg',
}: OrderConfirmationCustomerProps) => {
  const previewText = `Ďakujeme za objednávku ${orderId}!`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Img
              src={logoSrc}
              width="80"
              height="80"
              alt="Vino Putec Logo"
              style={logo}
            />
          </Section>

          {/* Content */}
          <Section style={content}>
            <Text style={greeting}>Vážený/á {customerName},</Text>
            <Text style={paragraph}>
              Ďakujeme za Vašu objednávku v našom e-shope. Vaša objednávka bola
              úspešne prijatá a čoskoro ju spracujeme.
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
                      <Link
                        href={`https://vinoputec.sk/vina/${item.Slug}`}
                        style={productLink}
                      >
                        {item.Title} × {item.quantity}
                      </Link>
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

            {/* Success Message */}
            <Section style={successBox}>
              <Text style={successText}>
                ✅ <strong>Objednávka bola úspešne prijatá!</strong>
              </Text>
            </Section>

            <Text style={paragraph}>
              V prípade otázok nás kontaktujte na{' '}
              <Link href="mailto:info@vinoputec.sk" style={link}>
                info@vinoputec.sk
              </Link>{' '}
              alebo na telefóne{' '}
              <Link href="tel:+421911250400" style={link}>
                +421 911 250 400
              </Link>
              .
            </Text>

            <Text style={thankYou}>Tešíme sa na ďalšiu spoluprácu!</Text>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              <strong>Vino Putec</strong>
            </Text>
            <Text style={footerText}>Rodinné vinárstvo vo Vinosadoch</Text>
            <Text style={footerText}>
              Pezinská 154, 902 01 Vinosady, Slovensko
            </Text>
            <Text style={footerText}>
              Tel: +421 911 250 400 | Email: info@vinoputec.sk
            </Text>
            <Text style={footerLinks}>
              <Link href="https://www.facebook.com/vinoputec" style={socialLink}>
                Facebook
              </Link>{' '}
              |{' '}
              <Link
                href="https://www.instagram.com/vinoputec/"
                style={socialLink}
              >
                Instagram
              </Link>{' '}
              |{' '}
              <Link
                href="https://www.youtube.com/channel/UC4jSLd6VZSsxC34-lS7fFMw"
                style={socialLink}
              >
                YouTube
              </Link>
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

export default OrderConfirmationCustomer;

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
  border: '4px solid #f5d08a',
};

// h1 style removed - not used in template

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

const productRow = {
  borderBottom: '1px solid #e0e0e0',
  paddingBottom: '10px',
  marginBottom: '10px',
};

const productLink = {
  fontSize: '14px',
  color: '#333333',
  textDecoration: 'none',
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

const successBox = {
  backgroundColor: '#e8f5e9',
  border: '4px solid #4caf50',
  borderRadius: '8px',
  padding: '15px',
  margin: '20px 0',
};

const successText = {
  color: '#2e7d32',
  fontSize: '16px',
  margin: '0',
  textAlign: 'center' as const,
};

const link = {
  color: '#f5d08a',
  textDecoration: 'none',
};

const thankYou = {
  fontSize: '16px',
  fontWeight: '600',
  color: '#000000',
  marginTop: '20px',
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

const footerLinks = {
  fontSize: '14px',
  color: '#666666',
  margin: '20px 0 5px 0',
};

const socialLink = {
  color: '#f5d08a',
  textDecoration: 'none',
  margin: '0 5px',
};

const footerCopyright = {
  fontSize: '12px',
  color: '#999999',
  marginTop: '20px',
};

