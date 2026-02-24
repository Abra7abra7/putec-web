import dynamic from "next/dynamic";
import DesktopNavigation from "./DesktopNavigation";
import { ReduxProvider } from "../providers";
import HeaderBackButton from "./HeaderBackButton";
import { getLocalization } from "../utils/getLocalization";
import LanguageSwitcher from "./LanguageSwitcher";

// Dynamic imports
const MobileMenu = dynamic(() => import("./MobileMenu"));
const MiniCart = dynamic(() => import("./MiniCart"));

import { headers } from "next/headers";

export default async function Header({ locale }: { locale?: string }) {
  const content = await getLocalization(locale);
  const headersList = await headers();
  const host = headersList.get("host") || "";
  const pathname = headersList.get("x-pathname") || "";

  const isUbytovanieDomain = host.includes("ubytovanie.vinoputec.sk") || host.includes("ubytovanie.localhost");
  const menuItems = isUbytovanieDomain ? content.ubytovanieMenu : content.menu;

  // Detect locale from the content object (set by getLocalization)
  const currentLocale = content.locale || locale || "sk";

  return (
    <>
      <header className="sticky top-0 w-full z-50 transition-all duration-300 bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100">
        <div className="flex w-full items-center justify-between md:hidden px-4 py-3">
          <HeaderBackButton />
          <MobileMenu menuItems={menuItems} locale={currentLocale} />
        </div>

        <div className="hidden md:flex w-full items-center px-6 py-4">
          <HeaderBackButton />

          <div className="flex-1">
            <DesktopNavigation menuItems={menuItems} />
          </div>

          <div className="flex items-center gap-3 ml-4">
            <LanguageSwitcher currentLocale={currentLocale} />
            {!isUbytovanieDomain && (
              <MiniCart />
            )}
          </div>
        </div>
      </header>
    </>
  );
}
