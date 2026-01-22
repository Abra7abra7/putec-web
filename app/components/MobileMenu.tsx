"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import MiniCart from "./MiniCart";
import { ReduxProvider } from "../providers";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

interface MenuItem {
  label: string;
  href: string;
}

interface MobileMenuProps {
  menuItems: MenuItem[];
}

const MobileMenu = ({ menuItems }: MobileMenuProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const lastFocused = useRef<HTMLElement | null>(null);

  const pathname = usePathname();
  const isCartOrCheckoutPage = pathname === "/kosik" || pathname === "/pokladna";

  // Lock body scroll when open
  useEffect(() => {
    if (isMenuOpen) {
      lastFocused.current = document.activeElement as HTMLElement;
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      lastFocused.current?.focus?.();
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  // Close on Escape and basic focus trap
  useEffect(() => {
    if (!isMenuOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMenuOpen(false);
      }
      if (e.key === "Tab" && panelRef.current) {
        const focusables = panelRef.current.querySelectorAll<HTMLElement>(
          'a, button, [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const active = document.activeElement as HTMLElement;
        if (e.shiftKey && active === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && active === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isMenuOpen]);

  return (
    <ReduxProvider>
      {/* Mobile Header Buttons (Burger + Cart) */}
      <div className="flex items-center gap-2 md:hidden">
        <button
          className="text-foreground hover:text-foreground"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-haspopup="dialog"
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu-panel"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {!isCartOrCheckoutPage &&
          <MiniCart />
        }
      </div>

      {/* Mobile Navigation Menu - Fullscreen overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-[60] md:hidden"
          role="dialog"
          aria-modal="true"
          onClick={() => setIsMenuOpen(false)}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <nav
            id="mobile-menu-panel"
            ref={panelRef}
            className="absolute inset-x-0 top-0 mt-16 bg-white border-t border-gray-200 shadow-2xl focus:outline-none min-h-[50vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 flex flex-col gap-4">
              {menuItems.map(({ label, href }) => (
                <Link
                  key={label}
                  href={href}
                  className="px-4 py-4 text-xl font-medium text-foreground hover:bg-gray-50 rounded-lg border-b border-gray-100 last:border-0"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {label}
                </Link>
              ))}
            </div>
          </nav>
        </div>
      )}
    </ReduxProvider>
  );
};

export default MobileMenu;
