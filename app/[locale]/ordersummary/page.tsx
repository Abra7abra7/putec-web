import { Suspense } from "react";
import { ProductProvider } from "../../context/ProductContext";
import OrderSummaryWrapper from "../../components/ordersummary/OrderSummaryWrapper";
import getProducts from "../../utils/getProducts";
import { getCheckoutSettings } from "../../utils/getCheckout";

export default async function OrderSummaryPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // Await promises for Next.js 16/15 compatibility
  const [resolvedParams, resolvedSearchParams, products, checkoutData] = await Promise.all([
    params,
    searchParams,
    getProducts(),
    getCheckoutSettings(),
  ]);

  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    }>
      <ProductProvider initialData={products}>
        <OrderSummaryWrapper initialCheckoutData={checkoutData} />
      </ProductProvider>
    </Suspense>
  );
}
