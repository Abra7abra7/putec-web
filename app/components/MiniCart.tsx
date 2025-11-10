"use client";

import Link from "next/link";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { useLocalization } from "../context/LocalizationContext";
import { ShoppingCart, X, Plus, Minus } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { removeFromCart, updateQuantity } from "../store/slices/cartSlice";
import { registerMiniCartTrigger } from "../utils/MiniCartController";

export default function MiniCart() {
  const cartItems = useAppSelector((state) => state.cart.items);
  const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalAmount = cartItems.reduce(
    (acc, item) => acc + item.quantity * parseFloat(item.SalePrice || item.RegularPrice),
    0
  );

  const { labels } = useLocalization();
  const dispatch = useAppDispatch();

  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerMiniCartTrigger(() => {
      setIsVisible(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    });
  }, []);

  const handleQtyChange = (id: string, delta: number) => {
    const item = cartItems.find((i) => i.ID === id);
    if (!item) return;

    const newQty = item.quantity + delta;
    if (newQty >= 1) {
      dispatch(updateQuantity({ id, quantity: newQty }));
    }
  };

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, 300);
  };

  const closeCart = () => {
    setIsVisible(false);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  const handleCartIconClick = (e: React.MouseEvent) => {
    // On mobile, prevent navigation and show overlay instead
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      e.preventDefault();
      setIsVisible(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    }
  };

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      ref={containerRef}
    >
      {/* Cart Icon */}
      <Link
        href="/kosik"
        onClick={handleCartIconClick}
        className="relative flex items-center justify-center ml-2 mr-4"
        aria-label={labels.viewCart || "View cart"}
      >
        <ShoppingCart size={24} />
        <span className="absolute top-[-8px] right-[-10px] bg-accent text-foreground text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full leading-none">
          {totalQuantity}
        </span>
      </Link>

      {/* Desktop: Mini Cart Dropdown */}
      {isVisible && (
        <>
          {/* Mobile: Full-screen overlay */}
          <div
            className={`md:hidden fixed inset-0 z-50 ${isVisible ? "block" : "hidden"}`}
            onClick={closeCart}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
            
            {/* Cart Card - Bottom Sheet */}
            <div
              className="absolute bottom-0 left-0 right-0 bg-background rounded-t-2xl shadow-2xl max-h-[90vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header with Close Button */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-foreground">Váš košík</h3>
                <button
                  onClick={closeCart}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Zavrieť košík"
                >
                  <X size={20} className="text-foreground" />
                </button>
              </div>

              {/* Cart Content - Scrollable */}
              <div className="flex-1 overflow-y-auto p-4">
                {cartItems.length === 0 ? (
                  <p className="text-foreground text-sm text-center py-8">{labels.cartEmpty || "Your cart is empty."}</p>
                ) : (
                  <div className="space-y-4">
                    {cartItems.map((item) => {
                      const price = parseFloat(item.SalePrice || item.RegularPrice);
                      const itemTotal = (price * item.quantity).toFixed(2);

                      return (
                        <div key={item.ID} className="flex items-start gap-4 pb-4 border-b border-gray-200">
                          <Image
                            src={item.FeatureImageURL}
                            alt={item.Title}
                            width={80}
                            height={100}
                            className="rounded object-cover flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <Link
                              href={`/vina/${item.Slug}`}
                              className="text-sm font-semibold text-foreground hover:text-accent block mb-1"
                              onClick={closeCart}
                            >
                              {item.Title}
                            </Link>
                            <p className="text-xs text-foreground-muted mb-2">
                              {labels.price || "Cena"}: €{price.toFixed(2)}
                            </p>
                            <div className="flex items-center gap-3 mb-2">
                              <button
                                onClick={() => handleQtyChange(item.ID, -1)}
                                className="text-foreground border border-accent px-2 py-1 rounded hover:bg-accent/10 transition"
                                aria-label="Znížiť množstvo"
                              >
                                <Minus size={16} />
                              </button>
                              <span className="text-sm font-medium min-w-[30px] text-center">{item.quantity}</span>
                              <button
                                onClick={() => handleQtyChange(item.ID, 1)}
                                className="text-foreground border border-accent px-2 py-1 rounded hover:bg-accent/10 transition"
                                aria-label="Zvýšiť množstvo"
                              >
                                <Plus size={16} />
                              </button>
                            </div>
                            <p className="text-sm text-foreground font-medium">
                              {labels.total || "Celkom"}: €{itemTotal}
                            </p>
                          </div>
                          <button
                            onClick={() => dispatch(removeFromCart(item.ID))}
                            className="text-foreground-muted hover:text-red-600 transition-colors flex-shrink-0 p-1"
                            title={labels.remove || "Remove"}
                            aria-label="Odstrániť z košíka"
                          >
                            <X size={18} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Footer with Total and Actions */}
              {cartItems.length > 0 && (
                <div className="border-t border-gray-200 p-4 space-y-3">
                  <div className="flex justify-between items-center text-base font-semibold text-foreground">
                    <span>{labels.total || "Celkom"}:</span>
                    <span>€{totalAmount.toFixed(2)}</span>
                  </div>
                  <Link
                    href="/kosik"
                    onClick={closeCart}
                    className="block w-full text-center bg-gray-100 hover:bg-gray-200 text-foreground px-4 py-3 rounded-lg text-sm font-semibold transition"
                  >
                    {labels.viewCart || "Zobraziť košík"}
                  </Link>
                  <Link
                    href="/pokladna"
                    onClick={closeCart}
                    className="block w-full text-center bg-accent hover:bg-accent-dark text-foreground px-4 py-3 rounded-lg text-sm font-semibold transition"
                  >
                    {labels.proceedToCheckout || "Pokračovať k objednávke"}
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Desktop: Mini Cart Dropdown */}
          <div
            className="hidden md:block absolute right-0 mt-2 w-96 bg-background border border-accent shadow-lg rounded-md z-50 p-4"
          >
          {cartItems.length === 0 ? (
            <p className="text-foreground text-sm text-center">{labels.cartEmpty || "Your cart is empty."}</p>
          ) : (
            <div className="space-y-4 max-h-64 overflow-y-auto">
              {cartItems.map((item) => {
                const price = parseFloat(item.SalePrice || item.RegularPrice);
                const itemTotal = (price * item.quantity).toFixed(2);

                return (
                  <div key={item.ID} className="flex items-start gap-4">
                    <Image
                      src={item.FeatureImageURL}
                      alt={item.Title}
                      width={60}
                      height={80}
                      className="rounded object-cover"
                    />
                    <div className="flex-1">
                      <Link
                        href={`/vina/${item.Slug}`}
                        className="text-sm font-semibold text-foreground hover:text-foreground"
                      >
                        {item.Title}
                      </Link>
                      <p className="text-xs text-foreground mt-1">
                        {labels.price || "Cena"}: €{price.toFixed(2)}
                      </p>
                      <div className="flex items-center mt-2 gap-2">
                        <button
                          onClick={() => handleQtyChange(item.ID, -1)}
                          className="text-foreground border border-accent px-1.5 py-0.5 rounded hover:bg-accent/10 transition"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="text-xs font-medium min-w-[20px] text-center">{item.quantity}</span>
                        <button
                          onClick={() => handleQtyChange(item.ID, 1)}
                          className="text-foreground border border-accent px-1.5 py-0.5 rounded hover:bg-accent/10 transition"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <p className="text-sm text-foreground font-medium mt-1">
                        {labels.total || "Celkom"}: €{itemTotal}
                      </p>
                    </div>
                    <button
                      onClick={() => dispatch(removeFromCart(item.ID))}
                      className="text-foreground hover:text-foreground-dark"
                      title={labels.remove || "Remove"}
                    >
                      <X size={16} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Total & View Cart Button */}
          {cartItems.length > 0 && (
            <>
              <hr className="my-4" />
              <div className="flex justify-between items-center text-sm font-semibold text-foreground">
                <span>{labels.total || "Celkom"}:</span>
                <span>€{totalAmount.toFixed(2)}</span>
              </div>
              <Link
                href="/kosik"
                className="mt-4 inline-block w-full text-center bg-accent hover:bg-accent-dark text-foreground px-4 py-2 rounded-md text-sm font-semibold transition"
              >
                {labels.viewCart || "Zobraziť košík"}
              </Link>

              <Link
                href="/pokladna"
                className="mt-4 inline-block w-full text-center bg-accent hover:bg-accent-dark text-foreground px-4 py-2 rounded-md text-sm font-semibold transition"
              >
                {labels.proceedToCheckout || "Pokračovať k objednávke"}
              </Link>
            </>
          )}
          </div>
        </>
      )}
    </div>
  );
}
