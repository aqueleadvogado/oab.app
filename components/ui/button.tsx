import { ComponentProps, ReactElement, cloneElement, isValidElement } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

type ButtonProps = ComponentProps<"button"> & {
  variant?: Variant;
  size?: Size;
  asChild?: boolean;
};

const base =
  "inline-flex items-center justify-center gap-2 font-display font-bold rounded-[10px] transition-colors disabled:opacity-50 disabled:cursor-not-allowed select-none";

const variants: Record<Variant, string> = {
  primary: "bg-blue text-white hover:bg-navy",
  secondary: "bg-lavender text-blue hover:bg-mint hover:text-navy",
  ghost: "bg-transparent text-ink hover:bg-lavender",
  danger: "bg-red-500 text-white hover:bg-red-700",
};

const sizes: Record<Size, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2.5 text-base",
  lg: "px-6 py-3.5 text-lg",
};

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  asChild = false,
  children,
  ...props
}: ButtonProps) {
  const classes = `${base} ${variants[variant]} ${sizes[size]} ${className}`;

  if (asChild && isValidElement(children)) {
    const child = children as ReactElement<{ className?: string }>;
    return cloneElement(child, {
      className: `${classes} ${child.props.className ?? ""}`.trim(),
    });
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
