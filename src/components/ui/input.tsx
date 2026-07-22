import { cn } from "@/lib/utils";
import { forwardRef, type InputHTMLAttributes } from "react";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "w-full rounded-lg border border-brand-border bg-brand-bg px-3.5 py-2.5 text-sm text-neutral-100 placeholder:text-neutral-500 focus:border-brand-primary focus:outline-none",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";
