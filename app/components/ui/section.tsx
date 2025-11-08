import * as React from "react";
import { cn } from "@/app/lib/utils";

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * Vertical spacing/padding
   * @default "md"
   */
  spacing?: "sm" | "md" | "lg" | "xl";
  /**
   * Background variant
   * @default "default"
   */
  background?: "default" | "muted" | "accent";
}

const spacingClasses = {
  sm: "py-8 desktop:py-12",
  md: "py-12 desktop:py-20",
  lg: "py-16 desktop:py-28",
  xl: "py-20 desktop:py-36",
};

const backgroundClasses = {
  default: "bg-background",
  muted: "bg-gray-50",
  accent: "bg-accent-subtle",
};

const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ className, spacing = "md", background = "default", ...props }, ref) => {
    return (
      <section
        ref={ref}
        className={cn(
          spacingClasses[spacing],
          backgroundClasses[background],
          className
        )}
        {...props}
      />
    );
  }
);
Section.displayName = "Section";

export { Section };

