"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLocalization } from "../../context/LocalizationContext";
import { useProductContext } from "../../context/ProductContext";
import { useAppDispatch } from "../../store/hooks";
import { clearCart } from "../../store/slices/cartSlice";
import { getCurrencySymbol } from "../../utils/getCurrencySymbol";
import Image from "next/image";
import { Product } from "../../../types/Product";

// Interfaces
interface CartItem extends Product {
  quantity: number;
}

interface Address {
  firstName: string;
  lastName: string;
  country: string;
  state: string;
  city: string;
  address1: string;
  address2: string;
  postalCode: string;
  phone: string;
  email: string;
  isCompany?: boolean;
  companyName?: string;
  companyICO?: string;
  companyDIC?: string;
  companyICDPH?: string;
}

interface ShippingMethod {
  id: string;
  name: string;
  price: number;
  currency: string;
}

interface OrderData {
  orderId: string;
  orderDate: string;
  cartItems: CartItem[];
  shippingForm: Address;
  billingForm: Address;
  shippingMethod: ShippingMethod;
  paymentMethodId: string;
}

export default function OrderSummaryClient() {
  const [order, setOrder] = useState<OrderData | null>(null);
  const { labels } = useLocalization();
  const { products } = useProductContext();
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const orderIdFromQuery = searchParams.get("orderId");
    const recent = localStorage.getItem("recentOrder");
  
    if (recent) {
      const parsed = JSON.parse(recent) as OrderData;
  
      setOrder(parsed);
  
      // Clear cart ONCE if we're redirected from Stripe with orderId in query,
      if (orderIdFromQuery && parsed.orderId === orderIdFromQuery) {
        dispatch(clearCart());
        // After successful Stripe redirect, ensure confirmation emails are sent once
        const sentKey = `emailsSent:${parsed.orderId}`;
        const alreadySent = localStorage.getItem(sentKey);
        if (!alreadySent) {
          (async () => {
            try {
              await fetch('/api/checkout/placeorder', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(parsed),
              });
              localStorage.setItem(sentKey, 'true');
              console.log('📧 Confirmation emails requested after Stripe redirect');

              // Idempotentný ping – ak webhook zlyhá, backend vystaví chýbajúcu faktúru
              // Fallback ping vypnutý – webhook je jediný zdroj vystavenia faktúr
            } catch (e) {
              console.error('❌ Failed to send confirmation emails after redirect', e);
            }
          })();
        }
      }
    } else {
      router.push("/kosik");
    }
  }, [searchParams, router, dispatch]);

  if (!order) return null;

  const total = order.cartItems.reduce((sum, item) => {
    const price = parseFloat(item.SalePrice || item.RegularPrice);
    return sum + price * item.quantity;
  }, 0);

  const shippingCost = order.shippingMethod?.price || 0;
  const grandTotal = total + shippingCost;

  const getProductImage = (id: string): string => {
    const product = products.find((p) => p.ID === id);
    return product?.FeatureImageURL || "/o-nas/rodina2.jpg";
  };

  const renderAddress = (title: string, data: Address) => (
    <div className="mb-6">
      <h3 className="font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-gray-700">{data.firstName} {data.lastName}</p>
      {data.isCompany && (
        <div className="mt-1 text-sm text-gray-700">
          <p><strong>Firma:</strong> {data.companyName}</p>
          {data.companyICO && <p><strong>IČO:</strong> {data.companyICO}</p>}
          {data.companyDIC && <p><strong>DIČ:</strong> {data.companyDIC}</p>}
          {data.companyICDPH && <p><strong>IČ DPH:</strong> {data.companyICDPH}</p>}
        </div>
      )}
      <p className="text-sm text-gray-700">{data.address1}</p>
      {data.address2 && <p className="text-sm text-gray-700">{data.address2}</p>}
      <p className="text-sm text-gray-700">{data.city}, {data.state}, {data.country} {data.postalCode}</p>
      <p className="text-sm text-gray-700">{data.phone}</p>
      <p className="text-sm text-gray-700">{data.email}</p>
    </div>
  );

  return (
    <section className="max-w-4xl mx-auto py-10 px-6">
      {/* Logo Section */}
      <div className="text-center mb-8">
        <Image
          src="/putec-logo.jpg"
          alt="Pútec Logo"
          width={100}
          height={100}
          className="mx-auto rounded-full shadow-2xl border-4 border-accent mb-6"
        />
        <h1 className="text-3xl font-bold text-foreground">
          {labels.orderSummary || "Order Summary"}
        </h1>
      </div>
      <p className="text-gray-700 mt-3 mb-8">
        {labels.orderConfirmationMessage ||
          "Your order was placed successfully. We’ll notify you once it’s processed."}
      </p>
      <p className="text-sm text-gray-700 mb-4">
        {labels.orderId || "Order ID"}: {order.orderId}
      </p>
      <p className="text-sm text-gray-700 mb-4">
        {labels.orderDate || "Order Date"}: {order.orderDate}
      </p>

      <div className="bg-background p-6 rounded-md shadow-md">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          {labels.orderDetails || "Order Details"}
        </h2>

        <ul className="space-y-4">
          {order.cartItems.map((item) => {
            const price = parseFloat(item.SalePrice || item.RegularPrice);
            const imageUrl = getProductImage(item.ID);
            return (
              <li key={item.ID} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-4">
                  <Image
                    src={imageUrl}
                    alt={item.Title}
                    width={60}
                    height={80}
                    className="rounded object-cover"
                  />
                  <span className="text-foreground">{item.Title} × {item.quantity}</span>
                </div>
                <span className="text-gray-700">{getCurrencySymbol(item.Currency)}{(price * item.quantity).toFixed(2)}</span>
              </li>
            );
          })}
        </ul>

        <div className="border-t mt-6 pt-4 space-y-2 text-sm text-gray-700">
          <div className="flex justify-between">
            <span>{labels.subtotal || "Subtotal"}:</span>
            <span>€{total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>{labels.shipping || "Shipping"}: {order.shippingMethod?.name}</span>
            <span>€{shippingCost.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-semibold text-foreground border-t pt-2">
            <span>{labels.total || "Total"}:</span>
            <span>€{grandTotal.toFixed(2)}</span>
          </div>
        </div>

        <div className="mt-6 text-sm text-gray-700 space-y-1">
          <p>
            {labels.shippingMethod || "Shipping Method"}: {order.shippingMethod?.name}
          </p>
          <p>
            {labels.paymentMethod || "Payment Method"}:{" "}
            {order.paymentMethodId === "cod"
              ? "Cash on Delivery"
              : order.paymentMethodId === "stripe"
              ? "Credit Card (Stripe)"
              : order.paymentMethodId}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {renderAddress(labels.shippingInformation || "Shipping Info", order.shippingForm)}
          {renderAddress(labels.billingInformation || "Billing Info", order.billingForm)}
        </div>
      </div>
    </section>
  );
}
