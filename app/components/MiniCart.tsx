"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { useLocalization } from "../context/LocalizationContext";
import { ShoppingCart, X, Plus, Minus } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { removeFromCart, updateQuantity, addToCart } from "../store/slices/cartSlice";
import { registerMiniCartTrigger } from "../utils/MiniCartController";
import IconWrapper from "./ui/IconWrapper";
import { getMediaUrl } from "../utils/media";

interface MiniCartProps {
  disableHover?: boolean;
}

export default function MiniCart({ disableHover = false }: MiniCartProps) {
  const cartItems = useAppSelector((state) => state.cart.items);
  const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalAmount = cartItems.reduce(
    (acc, item) => acc + item.quantity * parseFloat(item.SalePrice || item.RegularPrice),
    0
  );

  const { labels } = useLocalization();
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const cartContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
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

  const handleNavigation = (path: string) => {
    console.log(`Navigating to: ${path}`);
    setIsVisible(false); // Close immediately
    router.push(path);
  };

  const toggleCart = () => {
    setIsVisible(!isVisible);
  };

  const closeCart = () => {
    setIsVisible(false);
  };

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      // Check if click is inside the trigger button (containerRef) OR the cart content (cartContentRef)
      const isClickInsideTrigger = containerRef.current && containerRef.current.contains(target);
      const isClickInsideCart = cartContentRef.current && cartContentRef.current.contains(target);

      if (!isClickInsideTrigger && !isClickInsideCart) {
        closeCart();
      }
    };

    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isVisible]);

  return (
    <div
      className="relative"
      onMouseEnter={!disableHover ? handleMouseEnter : undefined}
      onMouseLeave={!disableHover ? handleMouseLeave : undefined}
      ref={containerRef}
    >
      {/* Cart Icon - kliknuteľný na mobile, hover na desktop */}
      <button
        onClick={toggleCart}
        className="relative flex items-center justify-center ml-2 mr-4 group"
        aria-label={labels.viewCart || "View cart"}
        aria-expanded={isVisible}
      >
        <IconWrapper>
          <ShoppingCart size={22} strokeWidth={1.5} />
        </IconWrapper>
        <span className="absolute top-[-4px] right-[-4px] bg-accent text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full leading-none shadow-md border-2 border-white">
          {mounted ? totalQuantity : 0}
        </span>
      </button>

      {/* Mini Cart Dropdown/Overlay - Rendered via Portal to escape Header stacking context */}
      {isVisible && typeof document !== 'undefined' && createPortal(
        <>
          {/* Backdrop na mobile */}
          <div
            className="fixed inset-0 bg-black/50 z-[9998] md:hidden"
            onClick={closeCart}
          />

          {/* Cart content */}
          <div
            ref={cartContentRef}
            className="fixed md:absolute right-0 top-0 md:top-20 md:right-10 w-full md:w-96 max-w-md h-full md:h-auto bg-white border-l md:border border-accent/20 shadow-2xl md:rounded-2xl z-[9999] p-6 overflow-y-auto"
            style={typeof window !== 'undefined' && window.innerWidth >= 768 ? { position: 'fixed', top: '80px', right: '20px' } : {}}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">
                {labels.cart || "Váš košík"}
              </h2>
              <button
                onClick={closeCart}
                className="text-foreground/50 hover:text-accent transition-colors"
                aria-label="Zavrieť košík"
              >
                <IconWrapper size="sm">
                  <X size={18} strokeWidth={1.5} />
                </IconWrapper>
              </button>
            </div>

            {cartItems.length === 0 ? (
              <div className="py-12 text-center">
                <ShoppingCart className="w-12 h-12 text-accent/20 mx-auto mb-4" />
                <p className="text-gray-400 text-sm">{labels.cartEmpty || "Váš košík je prázdny."}</p>
              </div>
            ) : (
              <>
                <div className="space-y-4 md:max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                  {cartItems.map((item) => {
                    const price = parseFloat(item.SalePrice || item.RegularPrice);

                    return (
                      <div key={item.ID} className="flex items-start gap-4 p-3 rounded-2xl bg-gray-50/50 hover:bg-gray-50 transition-colors border border-transparent hover:border-accent/10">
                        <div className="relative w-16 h-20 flex-shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-white">
                          <Image
                            src={item.FeatureImageURL}
                            alt={item.Title || "Product Image"}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <Link
                            href={`/vina/${item.Slug}`}
                            className="text-sm font-bold text-foreground hover:text-accent transition-colors block truncate"
                            onClick={closeCart}
                          >
                            {item.Title}
                          </Link>
                          <p className="text-xs text-accent font-bold mt-1">
                            €{price.toFixed(2)}
                          </p>
                          <div className="flex items-center mt-3 gap-3">
                            <button
                              onClick={() => handleQtyChange(item.ID, -1)}
                              className="w-7 h-7 flex items-center justify-center rounded-full bg-white border border-gray-200 text-foreground hover:border-accent hover:text-accent transition-all active:scale-90"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                            <button
                              onClick={() => handleQtyChange(item.ID, 1)}
                              className="w-7 h-7 flex items-center justify-center rounded-full bg-white border border-gray-200 text-foreground hover:border-accent hover:text-accent transition-all active:scale-90"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                        </div>
                        <button
                          onClick={() => dispatch(removeFromCart(item.ID))}
                          className="group/remove p-1"
                        >
                          <IconWrapper size="sm" className="bg-transparent border-transparent group-hover/remove:bg-red-50 group-hover/remove:border-red-100">
                            <X size={14} className="text-gray-300 group-hover/remove:text-red-500" />
                          </IconWrapper>
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* Upselling Section */}
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Mohlo by sa vám hodiť</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div
                      className="p-2 border border-gray-100 rounded-lg hover:border-accent transition-colors group cursor-pointer"
                      onClick={() => {
                        dispatch(addToCart({
                          ID: "wine-032",
                          Title: "Parížske Zlato - Vinný set",
                          Slug: "parizske-zlato-set",
                          RegularPrice: "23.90",
                          SalePrice: "23.90",
                          FeatureImageURL: "/vina/set-parizske-zlato.jpg",
                          Enabled: true,
                          CatalogVisible: true,
                          ProductCategories: ["Sety vín", "Ocenené vína"],
                          ProductType: "wine-set",
                          Currency: "EUR"
                        } as any)); // Type assertion for brevity in hardcoded item
                        setIsVisible(true); // Keep cart open
                      }}
                    >
                      <div className="aspect-[4/5] relative mb-2 overflow-hidden rounded">
                        <Image src={getMediaUrl("vina/set-parizske-zlato.jpg")} alt="Parížske Zlato - Vinný set" fill className="object-cover group-hover:scale-105 transition-transform" />
                      </div>
                      <p className="text-[10px] font-bold text-foreground truncate">Parížske Zlato - Vinný set</p>
                      <p className="text-[10px] text-accent font-bold">€23.90</p>
                    </div>
                    <div
                      className="p-2 border border-gray-100 rounded-lg hover:border-accent transition-colors group cursor-pointer"
                      onClick={() => {
                        dispatch(addToCart({
                          ID: "wine-018",
                          Title: "Cabernet Sauvignon Rosé 2024",
                          Slug: "cabernet-sauvignon-rose-2024",
                          RegularPrice: "11.90",
                          SalePrice: "11.90",
                          FeatureImageURL: "/vina/cabernet-sauvignon-rose-2024.jpg",
                          Enabled: true,
                          CatalogVisible: true,
                          ProductCategories: ["Ružové vína", "Polosuché vína"],
                          ProductType: "wine",
                          Currency: "EUR"
                        } as any));
                        setIsVisible(true);
                      }}
                    >
                      <div className="aspect-[4/5] relative mb-2 overflow-hidden rounded">
                        <Image src={getMediaUrl("vina/cabernet-sauvignon-rose-2024.jpg")} alt="Cabernet Sauvignon Rosé 2024" fill className="object-cover group-hover:scale-105 transition-transform" />
                      </div>
                      <p className="text-[10px] font-bold text-foreground truncate">Cabernet Sauvignon Rosé 2024</p>
                      <p className="text-[10px] text-accent font-bold">€11.90</p>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Total & View Cart Button */}
            {cartItems.length > 0 && (
              <>
                <hr className="my-4" />
                <div className="flex justify-between items-center text-sm font-semibold text-foreground">
                  <span>{labels.total || "Celkom"}:</span>
                  <span>€{totalAmount.toFixed(2)}</span>
                </div>
                <button
                  onClick={() => handleNavigation("/kosik")}
                  className="mt-4 inline-block w-full text-center bg-accent hover:bg-accent-dark text-foreground px-4 py-2 rounded-md text-sm font-semibold transition"
                >
                  {labels.viewCart || "Zobraziť košík"}
                </button>

                <button
                  onClick={() => handleNavigation("/pokladna")}
                  className="mt-4 inline-block w-full text-center bg-accent hover:bg-accent-dark text-foreground px-4 py-2 rounded-md text-sm font-semibold transition"
                >
                  {labels.proceedToCheckout || "Pokračovať k objednávke"}
                </button>
              </>
            )}
          </div>
        </>,
        document.body
      )}
    </div>
  );
}
