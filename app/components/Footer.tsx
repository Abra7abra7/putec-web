import Link from "next/link";
import Image from "next/image";
import { SiFacebook, SiInstagram, SiYoutube } from "react-icons/si";
import ScrollToTopButton from "./ScrollToTopButton"; // Keep this as a client component
import { getLocalization } from "../utils/getLocalization";

// Define TypeScript interfaces
interface FooterLink {
  label: string;
  href: string;
}

type SocialIcon = "SiFacebook" | "SiInstagram" | "SiYoutube";

// Map icon strings to components
const iconMap: Record<SocialIcon, React.ElementType> = {
  SiFacebook: SiFacebook,
  SiInstagram: SiInstagram,
  SiYoutube: SiYoutube
};

export default async function Footer() {
  const content = await getLocalization(); // Load localization data asynchronously

  return (
    <footer className="bg-background text-foreground py-16 relative border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center md:text-left">
        
        {/* Logo & Brand */}
        <div className="flex flex-col items-center md:items-start">
          <Link href="/" className="flex flex-col items-center md:items-start space-y-3 hover:opacity-80 transition-opacity">
            <div className="p-1 border-4 border-accent rounded-full">
              <Image
                src="/putec-logo.jpg"
                alt="Pútec Logo"
                width={80}
                height={80}
                className="rounded-full"
              />
            </div>
            <div className="text-center md:text-left">
              <h3 className="text-xl font-bold text-foreground">{content.siteName}</h3>
              <p className="text-foreground text-sm">{content.siteTagline}</p>
            </div>
          </Link>
        </div>
        
        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-semibold mb-4 text-foreground">{content.labels.quickLinks}</h3>
          <ul className="space-y-2">
            {content.footerLinks.map((link: FooterLink) => (
              <li key={link.label}>
                <Link href={link.href} className="text-foreground hover:text-accent transition-colors duration-200">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Legal Links */}
        <div>
          <h3 className="text-xl font-semibold mb-4 text-foreground">Právne informácie</h3>
          <ul className="space-y-2">
            {content.legalLinks.map((link) => (
              <li key={link.label}>
                <Link href={link.href} className="text-foreground hover:text-accent transition-colors duration-200 text-sm">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info & Social Media */}
        <div>
          <h3 className="text-xl font-semibold mb-4 text-foreground">{content.labels.contactUs}</h3>
          <p className="mb-2">{content.labels.email}: <a href={`mailto:${content.email}`} className="text-foreground hover:text-accent transition-colors duration-200">{content.email}</a></p>
          <p className="mb-2">{content.labels.phone}: <a href={`tel:${content.phone}`} className="text-foreground hover:text-accent transition-colors duration-200">{content.phone}</a></p>
          <p className="mb-4">{content.labels.address}: {content.address}</p>
          
          {/* Social Media */}
          <div>
            <h4 className="text-lg font-semibold mb-3 text-foreground">{content.labels.followUs}</h4>
            <div className="flex justify-center md:justify-start space-x-4">
              {content.socialLinks.map((social) => {
                const IconComponent = iconMap[social.icon as SocialIcon]; // Type assertion to ensure TS compliance
                return (
                  <Link key={social.id} href={social.url} target="_blank" className="text-foreground hover:text-accent transition-colors duration-200">
                    <IconComponent size={24} />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center text-sm mt-12 pt-8 border-t border-gray-200">
        <p className="text-foreground-muted">{content.copyright}</p>
      </div>

      {/* Scroll to Top Button (Client Component) */}
      <ScrollToTopButton />
    </footer>
  );
}
