import * as React from "react";
import { cn } from "@/app/utils/utils";

export interface FeatureIconProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Icon content - can be emoji string, React Icon component, or any React node
   */
  icon: React.ReactNode;
  /**
   * Size of the icon container
   * @default "md"
   */
  size?: "sm" | "md" | "lg";
  /**
   * Background color variant
   * @default "accent"
   */
  variant?: "accent" | "primary" | "muted";
}

const sizeClasses = {
  sm: "w-8 h-8 text-sm",
  md: "w-10 h-10 text-base",
  lg: "w-12 h-12 text-lg",
};

const variantClasses = {
  accent: "bg-accent text-foreground",
  primary: "bg-foreground text-background",
  muted: "bg-gray-100 text-foreground",
};

const FeatureIcon = React.forwardRef<HTMLDivElement, FeatureIconProps>(
  ({ className, icon, size = "md", variant = "accent", ...props }, ref) => {
    const isStringIcon = typeof icon === "string";
    const isReactElement = React.isValidElement(icon);

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-full flex items-center justify-center shrink-0 transition-transform hover:scale-105",
          sizeClasses[size],
          variantClasses[variant],
          className
        )}
        {...props}
      >
        {isStringIcon ? (
          <span className="select-none">{icon}</span>
        ) : isReactElement ? (
          React.cloneElement(icon as React.ReactElement<{ className?: string }>, {
            className: cn("w-5 h-5", (icon as React.ReactElement<{ className?: string }>).props?.className),
          })
        ) : (
          icon
        )}
      </div>
    );
  }
);
FeatureIcon.displayName = "FeatureIcon";

export { FeatureIcon };

