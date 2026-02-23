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
    <Button
      type="submit"
      disabled={pending}
      loading={pending}
      variant="primary"
      size="lg"
      className="w-full sm:w-auto sm:min-w-[180px] whitespace-nowrap"
    >
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
          <p className="text-foreground-muted mb-8">{newsletter.description}</p>

          <form action={formAction} className="flex flex-col sm:flex-row justify-center gap-4 max-w-xl mx-auto items-stretch sm:items-center">
            <input
              type="email"
              name="email"
              placeholder={newsletter.placeholder}
              required
              className="px-5 py-3 flex-1 border-2 border-gray-300 bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all duration-200 text-base shadow-sm hover:shadow-md"
              aria-label="Email pre newsletter"
            />
            <input type="hidden" name="locale" value={useLocalization().locale || 'sk'} />
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
