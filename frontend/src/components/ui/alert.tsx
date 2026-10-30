import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const alertVariants = cva(
  "relative w-full rounded-2xl border p-4 text-sm font-normal backdrop-blur-md transition-all [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-dusk-900 [&>svg+div]:translate-y-[-1px] [&>svg~*]:pl-7",
  {
    variants: {
      variant: {
        default: "bg-white/60 text-dusk-900 border-white/70 shadow-sm",
        info: "bg-dusk-500/10 text-dusk-900 border-dusk-300/40 [&>svg]:text-dusk-600",
        success: "bg-clover-500/10 text-dusk-900 border-clover-500/30 [&>svg]:text-clover-600",
        warning: "bg-amber-500/10 text-dusk-900 border-amber-500/30 [&>svg]:text-amber-600",
        destructive:
          "border-coral-500/30 bg-coral-500/10 text-coral-900 [&>svg]:text-coral-600",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
));
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-medium leading-none tracking-tight text-dusk-900", className)}
    {...props}
  />
));
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-xs text-dusk-700/80 leading-relaxed [&_p]:leading-relaxed", className)}
    {...props}
  />
));
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription };
