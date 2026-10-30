import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-dusk-500 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-dusk-700 text-white shadow hover:bg-dusk-800",
        secondary:
          "border-transparent bg-dusk-200/60 text-dusk-800 hover:bg-dusk-200",
        success:
          "border-transparent bg-clover-500/15 text-clover-600 hover:bg-clover-500/25",
        warning:
          "border-transparent bg-amber-500/15 text-amber-600 hover:bg-amber-500/25",
        destructive:
          "border-transparent bg-coral-500/15 text-coral-600 hover:bg-coral-500/25",
        outline:
          "text-dusk-800 border border-dusk-200 hover:bg-white/60",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
