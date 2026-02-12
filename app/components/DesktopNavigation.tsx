"use client";

import Link from "next/link";

interface MenuItem {
  label: string;
  href: string;
}

interface DesktopNavigationProps {
  menuItems: MenuItem[];
}

const DesktopNavigation = ({ menuItems }: DesktopNavigationProps) => {
  // DesktopNavigation renders only the center nav. Cart is handled in Header on the right.

  return (
    <nav className="hidden md:flex items-center space-x-10  max-w-4xl mx-auto justify-center">
      {menuItems.map(({ label, href }) => (
        <Link
          key={label}
          href={href}
          className="text-base font-semibold text-foreground/80 hover:text-accent transition-all duration-300 relative group py-2"
        >
          {label}
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full" />
        </Link>
      ))}
    </nav>
  );
};

export default DesktopNavigation;
