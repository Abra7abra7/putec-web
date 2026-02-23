"use client";

import { useFormStatus } from "react-dom";
import { useActionState } from "react";
import { useRef, useEffect } from "react";
import Image from "next/image";
import { Mail, Phone } from "lucide-react";
import { useLocalization } from "@/app/context/LocalizationContext";
import { sendContactMessage } from "@/app/actions/contact";
import { Section } from "./ui/section";
import { Container } from "./ui/container";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { getMediaUrl } from "../utils/media";

function SubmitButton({ buttonText }: { buttonText: string }) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} loading={pending} className="w-full md:w-auto md:min-w-[200px] md:mx-auto md:block">
      {buttonText}
    </Button>
  );
}

export default function ContactUsForm() {
  const { contactForm } = useLocalization();
  const [state, formAction] = useActionState(sendContactMessage, null);
  const formRef = useRef<HTMLFormElement>(null);

  // Reset form on success
  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset();
    }
  }, [state?.success]);

  return (
    <Section>
      <Container maxWidth="2xl">
        {/* Logo */}
        <div className="text-center mb-8">
          <Image
            src={getMediaUrl("putec-logo.jpg")}
            alt="Pútec Logo"
            width={80}
            height={80}
            className="mx-auto rounded-full border-4 border-accent"
          />
          <h2 className="text-3xl font-bold text-foreground mt-4">{contactForm.title}</h2>
          <p className="text-gray-700 mt-2">Máte otázky? Napíšte nám!</p>
        </div>

        {/* Contact Form */}
        <div className="max-w-2xl mx-auto">
          <form ref={formRef} action={formAction} className="space-y-6">
            {/* Name */}
            <Input
              type="text"
              id="name"
              name="name"
              label={contactForm.nameLabel}
              placeholder={contactForm.namePlaceholder}
              error={state?.errors?.name?.[0]}
              required
            />

            {/* Email */}
            <Input
              type="email"
              id="email"
              name="email"
              label={contactForm.emailLabel}
              placeholder={contactForm.emailPlaceholder}
              error={state?.errors?.email?.[0]}
              required
            />

            {/* Message */}
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-foreground mb-1.5">
                {contactForm.messageLabel}
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                required
                className="flex w-full rounded-lg border-2 border-gray-300 bg-background px-4 py-3 text-base transition-colors focus-visible:outline-none focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/20 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                placeholder={contactForm.messagePlaceholder}
              />
              {state?.errors?.message && (
                <p className="mt-1.5 text-sm text-red-600">{state.errors.message[0]}</p>
              )}
            </div>

            {/* Submit Button */}
            <SubmitButton buttonText={contactForm.buttonText} />

            {/* Status Messages */}
            {state?.success && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                <p className="text-green-800 font-medium">{state.message}</p>
              </div>
            )}
            {state && !state.success && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-800 font-medium">{state.message}</p>
              </div>
            )}
          </form>

          {/* Contact Info */}
          <div className="mt-12 max-w-2xl mx-auto">
            <p className="text-gray-700 text-center mb-6">Alebo nás kontaktujte priamo:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-center md:justify-start gap-3 p-4 bg-gray-50 rounded-lg">
                <Mail className="w-5 h-5 text-accent flex-shrink-0" />
                <div className="text-left">
                  <p className="text-sm text-gray-600">Email</p>
                  <a href="mailto:info@vinoputec.sk" className="text-foreground font-medium hover:text-accent transition-colors">
                    info@vinoputec.sk
                  </a>
                </div>
              </div>
              <div className="flex items-center justify-center md:justify-start gap-3 p-4 bg-gray-50 rounded-lg">
                <Phone className="w-5 h-5 text-accent flex-shrink-0" />
                <div className="text-left">
                  <p className="text-sm text-gray-600">Telefón</p>
                  <a href="tel:+421 911 250 400" className="text-foreground font-medium hover:text-accent transition-colors">
                    +421 911 250 400
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
