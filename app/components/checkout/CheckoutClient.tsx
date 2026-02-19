"use client";

import Image from "next/image";
import OrderInfoInitializer from "./OrderInfoInitializer";
import ShippingForm from "./ShippingForm";
import ShippingMethod from "./ShippingMethod";
import BillingForm from "./BillingForm";
import OrderSummary from "./OrderSummary";
import PaymentMethods from "./PaymentMethods";
import { CheckoutProvider } from "../../context/CheckoutContext";
import { ReduxProvider } from "@/app/providers";
import { getMediaUrl } from "../../utils/media";

export default function CheckoutClient({ initialCheckoutData }: { initialCheckoutData: any }) {
    return (
        <ReduxProvider>
            <CheckoutProvider initialData={initialCheckoutData}>
                <div className="min-h-screen bg-background">
                    {/* Header */}
                    <div className="bg-background border-b border-gray-200">
                        <div className="container mx-auto px-4 py-6">
                            {/* Back button - vľavo hore */}
                            <a
                                href="/kosik"
                                className="inline-flex items-center gap-2 text-foreground hover:text-accent transition-colors mb-4 group"
                            >
                                <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                <span className="font-medium">Späť do košíka</span>
                            </a>

                            <div className="flex items-center justify-center">
                                <Image
                                    src={getMediaUrl("putec-logo.jpg")}
                                    alt="Pútec Logo"
                                    width={60}
                                    height={60}
                                    className="rounded-full"
                                />
                                <h1 className="ml-4 text-2xl font-bold text-foreground">
                                    Pokladňa
                                </h1>
                            </div>
                        </div>
                    </div>

                    {/* Checkout Content */}
                    <div className="container mx-auto px-4 py-8">
                        <div className="max-w-6xl mx-auto">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Left Column - Forms */}
                                <div className="space-y-6">
                                    <OrderInfoInitializer />
                                    <ShippingForm />
                                    <ShippingMethod />
                                    <BillingForm />
                                    <PaymentMethods />
                                </div>

                                {/* Right Column - Order Summary */}
                                <div className="lg:sticky lg:top-8">
                                    <OrderSummary />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </CheckoutProvider>
        </ReduxProvider>
    );
}
