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
    <nav className="hidden md:flex items-center space-x-8 flex-1 justify-center">
      {menuItems.map(({ label, href }) => (
        <Link
          key={label}
          href={href}
          className="text-sm font-medium text-foreground hover:text-foreground transition-colors"
        >
          {label}
        </Link>
      ))}
    </nav>
  );
};

export default DesktopNavigation;
