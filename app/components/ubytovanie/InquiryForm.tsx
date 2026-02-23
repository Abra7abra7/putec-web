"use client";

import { useFormStatus } from "react-dom";
import { useActionState } from "react";
import { useRef, useEffect } from "react";
import Image from "next/image";
import { Mail, Phone, Users } from "lucide-react";
import { sendInquiry } from "@/app/actions/inquiry";
import { Container } from "../ui/container";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { getMediaUrl } from "../../utils/media";
import { useLocalization } from "@/app/context/LocalizationContext";

function SubmitButton({ buttonText }: { buttonText: string }) {
    const { pending } = useFormStatus();

    return (
        <Button
            type="submit"
            disabled={pending}
            loading={pending}
            className="w-full h-14 text-lg font-bold shadow-lg transform hover:scale-[1.02] transition-all"
        >
            {buttonText}
        </Button>
    );
}

export default function InquiryForm() {
    const { labels, locale } = useLocalization();
    const l = labels.inquiry;
    const [state, formAction] = useActionState(sendInquiry, null);
    const formRef = useRef<HTMLFormElement>(null);

    // Reset form on success
    useEffect(() => {
        if (state?.success) {
            formRef.current?.reset();
        }
    }, [state?.success]);

    return (
        <section id="dopyt" className="py-20 bg-accent/5">
            <Container maxWidth="4xl">
                <div className="bg-background rounded-3xl shadow-xl overflow-hidden border border-accent/10">
                    <div className="grid grid-cols-1 lg:grid-cols-2">

                        {/* Left side: Content */}
                        <div className="p-8 lg:p-12 bg-accent text-white">
                            <h2 className="text-3xl font-bold mb-6">{l.title}</h2>
                            <p className="text-white/80 text-lg mb-8 leading-relaxed">
                                {l.description}
                            </p>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Users className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold">{l.capacityTitle}</h4>
                                        <p className="text-white/70">{l.capacityDetail}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Users className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold">{l.tastingsTitle}</h4>
                                        <p className="text-white/70">{l.tastingsDetail}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold">{l.contactUs}</h4>
                                        <p className="text-white/70">obchod@vinoputec.sk</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-12 pt-12 border-t border-white/10">
                                <div className="flex items-center gap-4">
                                    <Image
                                        src={getMediaUrl("putec-logo.jpg")}
                                        alt="Logo"
                                        width={50}
                                        height={50}
                                        className="rounded-full border-2 border-white/20"
                                    />
                                    <div>
                                        <p className="font-bold">Víno Pútec</p>
                                        <p className="text-sm text-white/60">{l.traditionalWinery}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right side: Form */}
                        <div className="p-8 lg:p-12">
                            <form ref={formRef} action={formAction} className="space-y-5">
                                <input type="hidden" name="locale" value={locale} />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <Input
                                        type="text"
                                        id="name"
                                        name="name"
                                        label={l.nameLabel}
                                        placeholder={l.namePlaceholder}
                                        error={state?.errors?.name?.[0]}
                                        required
                                    />
                                    <Input
                                        type="email"
                                        id="email"
                                        name="email"
                                        label={l.emailLabel}
                                        placeholder={l.emailPlaceholder}
                                        error={state?.errors?.email?.[0]}
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <Input
                                        type="text"
                                        id="phone"
                                        name="phone"
                                        label={l.phoneLabel}
                                        placeholder={l.phonePlaceholder}
                                        error={state?.errors?.phone?.[0]}
                                        required
                                    />
                                    <Input
                                        type="text"
                                        id="peopleCount"
                                        name="peopleCount"
                                        label={l.peopleCountLabel}
                                        placeholder={l.peopleCountPlaceholder}
                                        error={state?.errors?.peopleCount?.[0]}
                                    />
                                </div>

                                <Input
                                    type="text"
                                    id="date"
                                    name="date"
                                    label={l.dateLabel}
                                    placeholder={l.datePlaceholder}
                                    error={state?.errors?.date?.[0]}
                                />

                                <div>
                                    <label htmlFor="message" className="block text-sm font-bold text-foreground mb-1.5 uppercase tracking-wider">
                                        {l.messageLabel}
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        rows={4}
                                        required
                                        className="flex w-full rounded-xl border-2 border-gray-100 bg-gray-50 px-4 py-3 text-base transition-colors focus-visible:outline-none focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/20 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                                        placeholder={l.messagePlaceholder}
                                    />
                                    {state?.errors?.message && (
                                        <p className="mt-1.5 text-sm text-red-600">{state.errors.message[0]}</p>
                                    )}
                                </div>

                                <div className="pt-4">
                                    <SubmitButton buttonText={l.submitButton} />
                                </div>

                                {/* Status Messages */}
                                {state?.success && (
                                    <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl animate-in fade-in slide-in-from-bottom-2">
                                        <p className="text-green-800 font-semibold flex items-center gap-2">
                                            <span>✓</span> {state.message}
                                        </p>
                                    </div>
                                )}
                                {state && !state.success && (
                                    <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                                        <p className="text-red-800 font-medium">{state.message}</p>
                                    </div>
                                )}
                            </form>
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    );
}
