"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import BackButton from "./BackButton";

interface HeaderBackButtonProps {
  showLabel?: boolean;
}

export default function HeaderBackButton({ showLabel = false }: HeaderBackButtonProps) {
  const pathname = usePathname();
  const isHomepage = pathname === "/";

  // On homepage, always show logo
  if (isHomepage) {
    return (
      <Link href="/" className="hover:opacity-80 transition-opacity">
        <div className="p-1 border-4 border-accent rounded-full md:p-2">
          <Image
            src="/putec-logo.jpg"
            alt="Pútec Logo"
            width={48}
            height={48}
            className="rounded-full md:w-[60px] md:h-[60px]"
            priority
          />
        </div>
      </Link>
    );
  }

  // On other pages:
  // - Mobile: show only back button
  // - Desktop: show logo + back button with label
  return (
    <div className="flex items-center gap-3">
      {/* Logo - only on desktop */}
      <Link href="/" className="hidden md:block hover:opacity-80 transition-opacity">
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
      {/* Back button - on mobile and desktop */}
      <BackButton showLabel={showLabel} />
    </div>
  );
}

