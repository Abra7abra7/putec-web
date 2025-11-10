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
  Link,
  Button,
} from '@react-email/components';
import * as React from 'react';

interface ContactFormProps {
  name: string;
  email: string;
  message: string;
}

export const ContactForm = ({
  name = 'Ján Novák',
  email = 'jan@example.com',
  message = 'Dobrý deň, zaujíma ma...',
}: ContactFormProps) => {
  const previewText = `Nová správa z kontaktného formulára od ${name}`;

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
              Prijali ste novú správu z kontaktného formulára.
            </Text>

            {/* Sender Info */}
            <Section style={infoBox}>
              <Heading as="h3" style={h3}>
                Odosielateľ
              </Heading>
              <Text style={infoText}>
                <strong>Meno:</strong> {name}
              </Text>
              <Text style={infoText}>
                <strong>Email:</strong>{' '}
                <Link href={`mailto:${email}`} style={emailLink}>
                  {email}
                </Link>
              </Text>
            </Section>

            {/* Message */}
            <Section style={infoBox}>
              <Heading as="h3" style={h3}>
                Správa
              </Heading>
              <Text style={messageText}>{message}</Text>
            </Section>

            <Text style={timestamp}>
              Správa prijatá: {new Date().toLocaleString('sk-SK')}
            </Text>

            <Section style={buttonContainer}>
              <Button
                href={`mailto:${email}`}
                style={button}
              >
                Odpovedať na email
              </Button>
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

export default ContactForm;

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

const emailLink = {
  color: '#f5d08a',
  textDecoration: 'none',
};

const messageText = {
  fontSize: '14px',
  lineHeight: '1.6',
  color: '#333333',
  whiteSpace: 'pre-wrap' as const,
};

const timestamp = {
  fontSize: '14px',
  color: '#666666',
  marginTop: '30px',
};

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '30px 0',
};

const button = {
  backgroundColor: '#f5d08a',
  borderRadius: '8px',
  color: '#000000',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 30px',
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

