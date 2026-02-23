"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import MiniCart from "./MiniCart";
import { ReduxProvider } from "../providers";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import IconWrapper from "./ui/IconWrapper";
import { useLocalization } from "../context/LocalizationContext";
import LanguageSwitcher from "./LanguageSwitcher";

interface MenuItem {
  label: string;
  href: string;
}

interface MobileMenuProps {
  menuItems: MenuItem[];
  locale: string;
}

const MobileMenu = ({ menuItems, locale }: MobileMenuProps) => {
  const { labels } = useLocalization();
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
    <>
      {/* Mobile Header Buttons (Burger + Cart) */}
      <div className={`flex items-center gap-2 md:hidden ${isMenuOpen ? "relative z-[61]" : ""}`}>
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-haspopup="dialog"
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu-panel"
          aria-label={isMenuOpen ? labels.closeMenu : labels.openMenu}
        >
          <IconWrapper>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </IconWrapper>
        </button>

        {!isCartOrCheckoutPage &&
          <MiniCart disableHover={true} />
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
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />
          <nav
            id="mobile-menu-panel"
            ref={panelRef}
            className="absolute inset-x-0 top-0 mt-20 bg-white border-t border-accent/20 shadow-2xl focus:outline-none min-h-[50vh] rounded-b-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-8 flex flex-col gap-2">
              {menuItems.map(({ label, href }) => (
                <Link
                  key={label}
                  href={href}
                  className="px-6 py-5 text-2xl font-bold text-foreground hover:text-accent hover:bg-accent/5 rounded-2xl transition-all"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {label}
                </Link>
              ))}
              <div className="mt-4 px-6 pt-4 border-t border-gray-100">
                <LanguageSwitcher currentLocale={locale} className="gap-2" />
              </div>
            </div>
          </nav>
        </div>
      )}
    </>
  );
};

export default MobileMenu;
