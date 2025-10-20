import Link from "next/link";
import Image from "next/image";
import MobileMenu from "./MobileMenu";
import DesktopNavigation from "./DesktopNavigation";
import MiniCart from "./MiniCart";
import { ReduxProvider } from "../providers";
import { getLocalization } from "../utils/getLocalization";

export default async function Header() {
  const content = await getLocalization(); // Fetch localization data asynchronously

  return (
    <>
      {/* MAIN HEADER */}
      <header className="sticky top-0 bg-background text-foreground py-4 px-4 flex items-center relative z-50 shadow-sm border-b border-gray-200">
        {/* Mobile layout */}
        <div className="flex w-full items-center justify-between md:hidden">
          {/* Left: Logo */}
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <div className="p-1 border-4 border-accent rounded-full">
              <Image
                src="/putec-logo.jpg"
                alt="Pútec Logo"
                width={48}
                height={48}
                className="rounded-full"
                priority
              />
            </div>
          </Link>
          {/* Right: Burger + Cart (inside MobileMenu) */}
          <MobileMenu menuItems={content.menu} />
        </div>

        {/* Desktop layout */}
        <div className="hidden md:flex w-full items-center">
          {/* Left: Logo */}
          <div className="flex items-center">
            <Link href="/" className="hover:opacity-80 transition-opacity">
              <div className="p-2 border-4 border-accent rounded-full">
                <Image
                  src="/putec-logo.jpg"
                  alt="Pútec Logo"
                  width={60}
                  height={60}
                  className="rounded-full"
                  priority
                />
              </div>
            </Link>
          </div>

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
