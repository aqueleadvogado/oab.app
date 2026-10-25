import { ComponentProps } from "react";

export function Input({ className = "", ...props }: ComponentProps<"input">) {
  return (
    <input
      className={`w-full px-3 py-2.5 bg-white dark:bg-navy-2 border border-line rounded-[10px] text-ink placeholder:text-muted focus:border-blue outline-none transition-colors ${className}`}
      {...props}
    />
  );
}

export function Label({ className = "", ...props }: ComponentProps<"label">) {
  return (
    <label
      className={`block text-sm font-bold text-ink mb-1.5 ${className}`}
      {...props}
    />
  );
}
