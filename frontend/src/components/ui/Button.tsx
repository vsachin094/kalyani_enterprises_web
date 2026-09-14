"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "whatsapp" | "call";
  size?: "default" | "sm" | "lg" | "icon";
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const { asChild, children, ...buttonProps } = props;
    const baseStyles = "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]";
    
    const variants = {
      default: "bg-gradient-to-r from-orange-500 to-amber-600 text-white hover:from-orange-600 hover:to-amber-700 shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40",
      destructive: "bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-500/25",
      outline: "border-2 border-orange-500 bg-transparent text-orange-600 hover:bg-orange-500 hover:text-white hover:border-orange-600",
      secondary: "bg-amber-100 text-amber-900 hover:bg-amber-200",
      ghost: "bg-transparent hover:bg-orange-50 text-orange-600",
      link: "text-orange-600 underline-offset-4 hover:underline",
      whatsapp: "bg-green-500 text-white hover:bg-green-600 shadow-lg shadow-green-500/25 hover:shadow-green-500/40",
      call: "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40",
    };

    const sizes = {
      default: "h-12 px-6 py-2",
      sm: "h-10 px-4 text-xs",
      lg: "h-14 px-8 text-base",
      icon: "h-12 w-12",
    };

    const styles = cn(baseStyles, variants[variant], sizes[size], className);

    if (asChild) {
      return React.cloneElement(children as React.ReactElement<{ className?: string }>, {
        className: cn(styles, (children as React.ReactElement<{ className?: string }>).props.className),
      });
    }

    return (
      <button
        className={styles}
        ref={ref}
        {...buttonProps}
        type={buttonProps.type ?? "button"}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button };
