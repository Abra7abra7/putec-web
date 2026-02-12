"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/app/lib/utils";
import { Loader2 } from "lucide-react";
import { motion, HTMLMotionProps } from "framer-motion";

import { Slot } from "@radix-ui/react-slot";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-accent text-foreground hover:bg-accent-dark shadow-md hover:shadow-lg",
        secondary: "bg-background text-foreground border-2 border-foreground hover:bg-foreground hover:text-background shadow-md hover:shadow-lg",
        outline: "border-2 border-accent text-foreground bg-transparent hover:bg-accent hover:text-foreground shadow-sm hover:shadow-md",
        ghost: "text-foreground hover:bg-gray-100",
        destructive: "bg-red-500 text-white hover:bg-red-600 shadow-md hover:shadow-lg",
      },
      size: {
        sm: "h-9 md:h-9 px-4 py-2 text-sm min-h-[36px]",
        md: "h-11 md:h-10 px-6 py-2.5 text-base min-h-[44px] md:min-h-[40px]",
        lg: "h-12 md:h-12 px-8 py-3 text-base font-bold min-h-[48px]",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, asChild = false, children, disabled, ...props }, ref) => {
    // Ak je to Slot (asChild), nemôžeme použiť motion.button props priamo
    // Pre zjednodušenie odstránime motion wrapper ak sa používa asChild, 
    // alebo by sme museli použiť motion(Slot) čo je komplikovanejšie.
    // V tomto prípade vrátime štandardný button/slot bez motion efektov pre asChild,
    // alebo jednoduchý motion wrapper okolo.

    // Keďže asChild sa používa pre Link, motion efekty na 'button' elemente nemusia fungovať správne
    // ak sa renderuje 'a' tag. Pre zachovanie funkčnosti a odstránenie warningu
    // použijeme Slot bez motion props.

    if (asChild) {
      return (
        <Slot
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref}
          {...props}
        >
          {children}
        </Slot>
      );
    }

    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
Button.displayName = "Button";


