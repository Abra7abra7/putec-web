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
} from '@react-email/components';
import * as React from 'react';

interface DegustationReservationAdminProps {
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  message: string;
  productTitle: string;
  productPrice: string;
  productDeposit?: string;
  logoSrc?: string;
}

export const DegustationReservationAdmin = ({
  name = 'Ján Novák',
  email = 'jan@example.com',
  phone = '+421 900 123 456',
  date = new Date().toISOString(),
  time = '14:00',
  guests = 4,
  message = '',
  productTitle = 'Degustácia vín',
  productPrice = '€25/os',
  productDeposit,
  logoSrc = 'https://vinoputec.sk/putec-logo.jpg',
}: DegustationReservationAdminProps) => {
  const previewText = `Nová rezervácia degustácie od ${name}`;

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
            <Text style={greeting}>Dobrý deň,</Text>
            <Text style={paragraph}>Prijali ste novú rezerváciu degustácie.</Text>

            {/* Product Info */}
            <Section style={infoBox}>
              <Heading as="h3" style={h3}>
                Produkt
              </Heading>
              <Text style={infoText}>
                <strong>Názov:</strong> {productTitle}
              </Text>
              <Text style={infoText}>
                <strong>Cena:</strong> {productPrice}
                {productDeposit && ` (Záloha: ${productDeposit})`}
              </Text>
            </Section>

            {/* Customer Info */}
            <Section style={infoBox}>
              <Heading as="h3" style={h3}>
                Zákazník
              </Heading>
              <Text style={infoText}>
                <strong>Meno:</strong> {name}
              </Text>
              <Text style={infoText}>
                <strong>Email:</strong> {email}
              </Text>
              <Text style={infoText}>
                <strong>Telefón:</strong> {phone}
              </Text>
            </Section>

            {/* Reservation Details */}
            <Section style={infoBox}>
              <Heading as="h3" style={h3}>
                Detaily rezervácie
              </Heading>
              <Text style={infoText}>
                <strong>Dátum:</strong> {new Date(date).toLocaleDateString('sk-SK')}
              </Text>
              <Text style={infoText}>
                <strong>Čas:</strong> {time}
              </Text>
              <Text style={infoText}>
                <strong>Počet osôb:</strong> {guests}
              </Text>
              {message && (
                <Text style={infoText}>
                  <strong>Poznámky:</strong>
                  <br />
                  {message}
                </Text>
              )}
            </Section>

            <Text style={timestamp}>
              Rezervácia vytvorená: {new Date().toLocaleString('sk-SK')}
            </Text>
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

export default DegustationReservationAdmin;

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

const timestamp = {
  fontSize: '14px',
  color: '#666666',
  marginTop: '30px',
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

