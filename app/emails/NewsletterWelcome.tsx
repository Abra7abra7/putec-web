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

interface NewsletterWelcomeProps {
  email?: string;
}

export const NewsletterWelcome = ({
  email = 'priklad@email.sk',
}: NewsletterWelcomeProps) => {
  const previewText = 'Vitajte v našom newsletteri!';

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
              Ďakujeme za prihlásenie sa k odberu nášho newsletteru!
            </Text>

            {/* Success Message */}
            <Section style={successBox}>
              <Text style={successText}>
                ✅ <strong>Vaša emailová adresa bola úspešne zaregistrovaná.</strong>
              </Text>
            </Section>

            <Text style={paragraph}>Budeme vás pravidelne informovať o:</Text>

            <Section style={listBox}>
              <Text style={listItem}>• Nových vínach a špeciálnych edíciách</Text>
              <Text style={listItem}>• Akciových ponukách a zľavách</Text>
              <Text style={listItem}>• Podujatiach a degustáciách</Text>
              <Text style={listItem}>• Novinkách z nášho vinárstva</Text>
            </Section>

            <Section style={buttonContainer}>
              <Button
                href="https://vino-putec.vercel.app/vina"
                style={button}
              >
                Pozrite naše vína
              </Button>
            </Section>

            <Text style={smallText}>
              Ak ste sa prihlásili omylom, kontaktujte nás na{' '}
              <Link href="mailto:info@vinoputec.sk" style={link}>
                info@vinoputec.sk
              </Link>
              .
            </Text>
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

export default NewsletterWelcome;

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

const successBox = {
  backgroundColor: '#e8f5e9',
  border: '4px solid #4caf50',
  borderRadius: '8px',
  padding: '20px',
  margin: '30px 0',
};

const successText = {
  color: '#2e7d32',
  fontSize: '16px',
  margin: '0',
  textAlign: 'center' as const,
};

const listBox = {
  margin: '20px 0',
};

const listItem = {
  fontSize: '16px',
  lineHeight: '1.8',
  color: '#666666',
  margin: '5px 0',
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

const smallText = {
  fontSize: '14px',
  color: '#666666',
  marginTop: '30px',
};

const link = {
  color: '#f5d08a',
  textDecoration: 'none',
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

