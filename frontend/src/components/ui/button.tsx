import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dusk-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-dusk-700 text-white shadow hover:bg-dusk-800 hover:shadow-md",
        clover:
          "bg-clover-500 text-white shadow hover:bg-clover-600 hover:shadow-md",
        amber:
          "bg-amber-500 text-white shadow hover:bg-amber-600 hover:shadow-md",
        destructive:
          "bg-coral-500 text-white shadow hover:bg-coral-600 hover:shadow-md",
        outline:
          "border border-dusk-200 bg-white/60 text-dusk-800 hover:bg-white hover:border-dusk-300 shadow-sm",
        secondary:
          "bg-sand-200 text-dusk-900 hover:bg-sand-300/80 shadow-sm",
        ghost:
          "text-dusk-700 hover:bg-dusk-500/10 hover:text-dusk-900",
        link:
          "text-dusk-700 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-lg px-3 text-xs",
        lg: "h-12 rounded-xl px-6 text-base",
        icon: "h-9 w-9 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
