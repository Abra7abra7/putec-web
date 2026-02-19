import dynamic from "next/dynamic";
import DesktopNavigation from "./DesktopNavigation";
import { ReduxProvider } from "../providers";
import HeaderBackButton from "./HeaderBackButton";
import { getLocalization } from "../utils/getLocalization";

// Dynamic imports
const MobileMenu = dynamic(() => import("./MobileMenu"));
const MiniCart = dynamic(() => import("./MiniCart"));

import { headers } from "next/headers";

export default async function Header() {
  const content = await getLocalization();
  const headersList = await headers();
  const host = headersList.get("host") || "";

  const isUbytovanieDomain = host.includes("ubytovanie.vinoputec.sk") || host.includes("ubytovanie.localhost");
  const menuItems = isUbytovanieDomain ? content.ubytovanieMenu : content.menu;

  return (
    <>
      <header className="sticky top-0 w-full z-50 transition-all duration-300 bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100">
        <div className="flex w-full items-center justify-between md:hidden px-4 py-3">
          <HeaderBackButton />
          <MobileMenu menuItems={menuItems} />
        </div>

        <div className="hidden md:flex w-full items-center px-6 py-4">
          <HeaderBackButton />

          <div className="flex-1">
            <DesktopNavigation menuItems={menuItems} />
          </div>

          {!isUbytovanieDomain && (
            <div className="ml-4">
              <MiniCart />
            </div>
          )}
        </div>
      </header>
    </>
  );
}
