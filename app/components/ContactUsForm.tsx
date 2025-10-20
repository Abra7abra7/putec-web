"use client";

import { useActionState, useFormStatus } from "react-dom";
import { useRef, useEffect } from "react";
import Image from "next/image";
import { useLocalization } from "@/app/context/LocalizationContext";
import { sendContactMessage } from "@/app/actions/contact";

function SubmitButton({ buttonText }: { buttonText: string }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className="w-full px-6 py-3 bg-accent text-foreground font-semibold rounded-md hover:bg-accent-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      disabled={pending}
    >
      {pending ? "Odosiela sa..." : buttonText}
    </button>
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
    <section className="w-full h-full bg-background py-16">
      <div className="max-w-3xl mx-auto px-6">
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
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-foreground">
              {contactForm.nameLabel}
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-wine-red"
              placeholder={contactForm.namePlaceholder}
            />
            {state?.errors?.name && (
              <p className="mt-1 text-sm text-red-600">{state.errors.name[0]}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-foreground">
              {contactForm.emailLabel}
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-wine-red"
              placeholder={contactForm.emailPlaceholder}
            />
            {state?.errors?.email && (
              <p className="mt-1 text-sm text-red-600">{state.errors.email[0]}</p>
            )}
          </div>

          {/* Message */}
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-foreground">
              {contactForm.messageLabel}
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              required
              className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-wine-red resize-none"
              placeholder={contactForm.messagePlaceholder}
            />
            {state?.errors?.message && (
              <p className="mt-1 text-sm text-red-600">{state.errors.message[0]}</p>
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
      </div>
    </section>
  );
}
