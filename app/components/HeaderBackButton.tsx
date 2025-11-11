"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

interface HeaderBackButtonProps {
  showLabel?: boolean;
}

export default function HeaderBackButton({ showLabel = false }: HeaderBackButtonProps) {
  const pathname = usePathname();

  // Vždy zobrazíme len logo v navigácii (žiadny back button)
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

