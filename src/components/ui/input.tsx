import * as React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  startIcon?: LucideIcon;
  endIcon?: LucideIcon;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, startIcon, endIcon, ...props }, ref) => {
    const StartIcon = startIcon;
    const EndIcon = endIcon;

    return (
      <div className="relative">
        {StartIcon && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none z-10">
            <StartIcon size={18} className="text-zinc-400" />
          </div>
        )}
        <input
          type={type}
          ref={ref}
          className={cn(
            "flex h-9 w-full rounded-md border border-zinc-200 bg-transparent py-1 text-base shadow-sm transition-colors",
            "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-zinc-950 placeholder:text-zinc-500",
            "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:cursor-not-allowed disabled:opacity-50",
            "md:text-sm dark:border-zinc-800 dark:file:text-zinc-50 dark:placeholder:text-zinc-400 dark:focus-visible:ring-zinc-300",
            startIcon ? "pl-8" : "pl-2", 
            endIcon ? "pr-8" : "pr-2",
            className
          )}
          {...props}
        />
        {EndIcon && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none z-10">
            <EndIcon size={18} className="text-zinc-400" />
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
