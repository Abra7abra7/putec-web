"use client";

import { Provider } from "react-redux";
import { store } from "../store/store";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { useLocalization } from "../context/LocalizationContext";
import Image from "next/image";
import Link from "next/link";
import { removeFromCart, updateQuantity } from "../store/slices/cartSlice";
import { showMiniCart } from "../utils/MiniCartController";
import { X, Plus, Minus } from "lucide-react";
import BackButton from "../components/BackButton";

function CartContent() {
  const { labels } = useLocalization();
  const dispatch = useAppDispatch();
  const items = useAppSelector((state) => state.cart.items);

  const total = items.reduce(
    (sum, item) => sum + item.quantity * parseFloat(item.SalePrice || item.RegularPrice),
    0
  );

  const handleQtyChange = (id: string, delta: number) => {
    const item = items.find((i) => i.ID === id);
    if (!item) return;

    const newQty = item.quantity + delta;
    if (newQty >= 1) {
      dispatch(updateQuantity({ id, quantity: newQty }));
      showMiniCart();
    }
  };

  return (
    <section className="py-12 bg-background">
      <div className="container mx-auto px-4">
        {/* Back button - vľavo hore */}
        <a 
          href="/vina"
          className="inline-flex items-center gap-2 text-foreground hover:text-accent transition-colors mb-6 group"
        >
          <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="font-medium">Späť na nákup</span>
        </a>

        {/* Logo Section */}
        <div className="text-center mb-8">
          <Image
            src="/putec-logo.jpg"
            alt="Pútec Logo"
            width={100}
            height={100}
            sizes="(max-width: 768px) 80px, 100px"
            className="mx-auto rounded-full shadow-2xl border-4 border-accent mb-6"
          />
          <h1 className="text-3xl font-bold text-foreground">Váš košík</h1>
        </div>

        {items.length === 0 ? (
          <p className="text-gray-600 mt-10 mb-30 text-center">{labels.cartEmpty || "Your cart is empty."}</p>
        ) : (
          <>
            <div className="space-y-6">
              {items.map((item) => {
                const price = parseFloat(item.SalePrice || item.RegularPrice);
                const itemTotal = price * item.quantity;

                return (
                  <div key={item.ID} className="flex gap-4 items-center border-b pb-4">
                    <Image
                      src={item.FeatureImageURL}
                      alt={item.Title}
                      width={80}
                      height={100}
                      sizes="(max-width: 768px) 80px, 100px"
                      placeholder="blur"
                      blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD04MCBoZWlnaHQ9MTAwIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2VlZWVlZSIvPjwvc3ZnPg=="
                      className="object-cover rounded"
                    />
                    <div className="flex-1">
                      <Link
                        href={`/vina/${item.Slug}`}
                        className="text-lg font-semibold text-gray-800 hover:text-gray-600"
                      >
                        {item.Title}
                      </Link>
                      <p className="text-sm text-gray-600">
                        {labels.price || "Cena"}: €{price.toFixed(2)}
                      </p>
                      <div className="flex items-center mt-2 gap-2">
                        <button
                          onClick={() => handleQtyChange(item.ID, -1)}
                          className="text-gray-700 border px-2 rounded hover:bg-gray-200"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="text-sm font-medium">{item.quantity}</span>
                        <button
                          onClick={() => handleQtyChange(item.ID, 1)}
                          className="text-gray-700 border px-2 rounded hover:bg-gray-200"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      <p className="text-sm text-gray-800 mt-1">
                        {labels.total || "Celkom"}: €{itemTotal.toFixed(2)}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        dispatch(removeFromCart(item.ID));
                        showMiniCart();
                      }}
                      className="text-gray-400 hover:text-red-600"
                    >
                      <X size={18} />
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 text-right space-y-4">
              <p className="text-xl font-semibold text-gray-800">
                {labels.total || "Celkom"}: €{total.toFixed(2)}
              </p>

              {/* Checkout Button Below */}
              <Link
                href="/pokladna"
                className="inline-block bg-accent hover:bg-accent-dark text-foreground px-6 py-3 rounded-md text-sm font-semibold transition"
              >
                {labels.proceedToCheckout || "Pokračovať k objednávke"}
              </Link>
            </div>

            {/* Sticky CTA for mobile */}
            <div className="md:hidden fixed left-0 right-0 bottom-0 bg-background/95 backdrop-blur border-t border-gray-200 px-4 py-3">
              <div className="flex items-center justify-between gap-3">
                <p className="text-base font-semibold">
                  {labels.total || "Celkom"}: €{total.toFixed(2)}
                </p>
                <Link
                  href="/pokladna"
                  className="bg-accent hover:bg-accent-dark text-foreground px-4 py-2 rounded-md text-sm font-semibold transition"
                >
                  {labels.proceedToCheckout || "Pokračovať"}
                </Link>
              </div>
            </div>

          </>
        )}
      </div>
    </section>
  );
}

export default function CartPage() {
  return (
    <Provider store={store}>
      <CartContent />
    </Provider>
  );
}
