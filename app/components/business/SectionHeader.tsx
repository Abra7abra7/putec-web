import * as React from "react";
import Image from "next/image";
import { cn } from "@/app/lib/utils";

export interface SectionHeaderProps {
  /**
   * Main heading text
   */
  title: string;
  /**
   * Optional description/subtitle
   */
  description?: string;
  /**
   * Show Putec logo above the title
   * @default false
   */
  showLogo?: boolean;
  /**
   * Text alignment
   * @default "left"
   */
  align?: "left" | "center" | "right";
  /**
   * Additional className for the container
   */
  className?: string;
}

const alignClasses = {
  left: "text-left items-start",
  center: "text-center items-center",
  right: "text-right items-end",
};

const SectionHeader = React.forwardRef<HTMLDivElement, SectionHeaderProps>(
  ({ title, description, showLogo = false, align = "left", className }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex flex-col mb-6 md:mb-8", alignClasses[align], className)}
      >
        {showLogo && (
          <Image
            src="/putec-logo.jpg"
            alt="Pútec Logo"
            width={60}
            height={60}
            className="rounded-full shadow-xl border-2 border-accent mb-4"
          />
        )}
        <h2 className="text-foreground mb-4">
          {title}
        </h2>
        {description && (
          <p className="text-base text-foreground-muted max-w-3xl">
            {description}
          </p>
        )}
      </div>
    );
  }
);
SectionHeader.displayName = "SectionHeader";

export { SectionHeader };

