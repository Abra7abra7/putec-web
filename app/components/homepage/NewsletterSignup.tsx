"use client";

import { useFormStatus } from "react-dom";
import { useActionState } from "react";
import { subscribeToNewsletter } from "../../actions/newsletter";
import { useLocalization } from "../../context/LocalizationContext";

function SubmitButton({ buttonText }: { buttonText: string }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className="px-3 sm:px-6 py-1 sm:py-3 bg-accent text-foreground font-bold rounded-r-md hover:bg-accent-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      disabled={pending}
    >
      {pending ? "Odosiela sa..." : buttonText}
    </button>
  );
}

export default function NewsletterSignup() {
  const { newsletter } = useLocalization().homepage;
  const [state, formAction] = useActionState(subscribeToNewsletter, null);

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto text-center px-6">
        <h2 className="text-3xl font-bold text-foreground">{newsletter.title}</h2>
        <p className="text-gray-700 mt-2">{newsletter.description}</p>

        <form action={formAction} className="mt-6 flex justify-center">
          <input
            type="email"
            name="email"
            placeholder={newsletter.placeholder}
            required
            className="px-4 py-3 w-40 sm:w-72 border border-accent bg-background rounded-l-md focus:outline-none focus:ring-2 focus:ring-wine-red"
            aria-label="Email pre newsletter"
          />
          <SubmitButton buttonText={newsletter.buttonText} />
        </form>

        {state?.success && (
          <p className="mt-3 text-green-600 font-medium">{state.message}</p>
        )}
        {state && !state.success && (
          <p className="mt-3 text-red-600 font-medium">{state.message}</p>
        )}
        {state?.errors?.email && (
          <p className="mt-2 text-sm text-red-600">{state.errors.email[0]}</p>
        )}
      </div>
    </section>
  );
}
