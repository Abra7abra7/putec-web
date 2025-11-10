"use client";

import { useFormStatus } from "react-dom";
import { useActionState } from "react";
import { subscribeToNewsletter } from "../../actions/newsletter";
import { useLocalization } from "../../context/LocalizationContext";
import { Section } from "../ui/section";
import { Container } from "../ui/container";
import { Button } from "../ui/button";

function SubmitButton({ buttonText }: { buttonText: string }) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} loading={pending} className="rounded-l-none">
      {buttonText}
    </Button>
  );
}

export default function NewsletterSignup() {
  const { newsletter } = useLocalization().homepage;
  const [state, formAction] = useActionState(subscribeToNewsletter, null);

  return (
    <Section>
      <Container maxWidth="2xl">
        <div className="text-center">
          <h2 className="text-foreground mb-4">{newsletter.title}</h2>
          <p className="text-foreground-muted mb-6">{newsletter.description}</p>

          <form action={formAction} className="flex flex-col md:flex-row justify-center gap-0 max-w-md mx-auto">
            <input
              type="email"
              name="email"
              placeholder={newsletter.placeholder}
              required
              className="px-4 py-3 w-full md:w-72 border-2 border-accent bg-background rounded-lg md:rounded-r-none focus:outline-none focus:ring-2 focus:ring-accent/20"
              aria-label="Email pre newsletter"
            />
            <SubmitButton buttonText={newsletter.buttonText} />
          </form>

          {state?.success && (
            <p className="mt-4 text-green-600 font-medium">{state.message}</p>
          )}
          {state && !state.success && (
            <p className="mt-4 text-red-600 font-medium">{state.message}</p>
          )}
          {state?.errors?.email && (
            <p className="mt-2 text-sm text-red-600">{state.errors.email[0]}</p>
          )}
        </div>
      </Container>
    </Section>
  );
}
