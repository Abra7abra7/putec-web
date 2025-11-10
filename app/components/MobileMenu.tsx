"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import MiniCart from "./MiniCart";
import { ReduxProvider } from "../providers";
import { usePathname } from "next/navigation";

interface MenuItem {
  label: string;
  href: string;
}

interface MobileMenuProps {
  menuItems: MenuItem[];
}

const MobileMenu = ({ menuItems }: MobileMenuProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const pathname = usePathname();
  const isCartOrCheckoutPage = pathname === "/kosik" || pathname === "/pokladna";

  return (
    <ReduxProvider>
      {/* Mobile Header Buttons (Burger + Cart) */}
      <div className="flex items-center gap-2 md:hidden">
        <button
          className="text-foreground hover:text-foreground"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {!isCartOrCheckoutPage &&
          <MiniCart />
        }
      </div>

      {/* Mobile Navigation Menu */}
      <nav
        className={`absolute top-16 left-0 w-full bg-background flex flex-col items-start p-6 transition-all ${
          isMenuOpen ? "block" : "hidden"
        }`}
      >
        {menuItems.map(({ label, href }) => (
          <Link
            key={label}
            href={href}
            className="px-4 py-2 block text-sm text-foreground hover:text-foreground"
            onClick={() => setIsMenuOpen(false)}
          >
            {label}
          </Link>
        ))}
      </nav>
    </ReduxProvider>
  );
};

export default MobileMenu;
