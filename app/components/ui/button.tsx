import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/app/lib/utils";
import { Loader2 } from "lucide-react";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-accent text-foreground hover:bg-accent-dark shadow-sm hover:shadow-md active:scale-[0.98]",
        secondary: "bg-background text-foreground border-2 border-foreground hover:bg-foreground hover:text-background shadow-sm hover:shadow-md active:scale-[0.98]",
        outline: "border-2 border-accent text-foreground bg-transparent hover:bg-accent hover:text-foreground active:scale-[0.98]",
        ghost: "text-foreground hover:bg-gray-100 active:scale-[0.98]",
        destructive: "bg-red-500 text-white hover:bg-red-600 shadow-sm hover:shadow-md active:scale-[0.98]",
      },
      size: {
        sm: "h-8 md:h-8 px-3 py-1.5 text-sm min-h-[32px]",
        md: "h-10 md:h-9 px-5 py-2 text-base min-h-[40px] md:min-h-[36px]",
        lg: "h-11 md:h-10 px-6 py-2.5 text-base min-h-[44px] md:min-h-[40px]",
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
  ({ className, variant, size, loading, children, disabled, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };

