import dynamic from "next/dynamic";
import DesktopNavigation from "./DesktopNavigation";
import { ReduxProvider } from "../providers";
import { getLocalization } from "../utils/getLocalization";
import HeaderBackButton from "./HeaderBackButton";

// Dynamic imports for interactive components - reduces initial bundle size
const MobileMenu = dynamic(() => import("./MobileMenu"));
const MiniCart = dynamic(() => import("./MiniCart"));

export default async function Header() {
  const content = await getLocalization(); // Fetch localization data asynchronously

  return (
    <>
      {/* MAIN HEADER */}
      <header className="sticky top-0 bg-background text-foreground py-4 px-4 flex items-center relative z-50 shadow-sm border-b border-gray-200">
        {/* Mobile layout */}
        <div className="flex w-full items-center justify-between md:hidden">
          {/* Left: Back Button or Logo */}
          <HeaderBackButton />
          {/* Right: Burger + Cart (inside MobileMenu) */}
          <MobileMenu menuItems={content.menu} />
        </div>

        {/* Desktop layout */}
        <div className="hidden md:flex w-full items-center">
          {/* Left: Logo */}
          <HeaderBackButton />

          {/* Center: Navigation */}
          <div className="flex-1">
            <DesktopNavigation menuItems={content.menu} />
          </div>

          {/* Right: Cart */}
          <div className="ml-4">
            <ReduxProvider>
              <MiniCart />
            </ReduxProvider>
          </div>
        </div>
      </header>
    </>
  );
}
