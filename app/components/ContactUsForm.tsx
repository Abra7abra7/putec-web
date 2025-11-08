"use client";

import { useFormStatus } from "react-dom";
import { useActionState } from "react";
import { useRef, useEffect } from "react";
import Image from "next/image";
import { useLocalization } from "@/app/context/LocalizationContext";
import { sendContactMessage } from "@/app/actions/contact";
import { Section } from "./ui/section";
import { Container } from "./ui/container";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

function SubmitButton({ buttonText }: { buttonText: string }) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} loading={pending} className="w-full">
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
            src="/putec-logo.jpg"
            alt="Pútec Logo"
            width={100}
            height={100}
            className="mx-auto rounded-full border-4 border-accent"
          />
          <h2 className="text-4xl font-bold text-foreground mt-4">{contactForm.title}</h2>
          <p className="text-gray-700 mt-2">Máte otázky? Napíšte nám!</p>
        </div>

        {/* Contact Form */}
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
        <div className="mt-12 text-center">
          <p className="text-gray-700">Alebo nás kontaktujte priamo:</p>
          <div className="mt-4 space-y-2">
            <p className="text-foreground font-medium">
              📧 Email: <a href="mailto:info@vinoputec.sk" className="text-accent hover:underline">info@vinoputec.sk</a>
            </p>
            <p className="text-foreground font-medium">
              📞 Telefón: <a href="tel:+421905123456" className="text-accent hover:underline">+421 905 123 456</a>
            </p>
          </div>
        </div>
      </Container>
    </Section>
  );
}
