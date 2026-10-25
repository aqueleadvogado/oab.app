import { ComponentProps } from "react";

type CardProps = ComponentProps<"div">;

export function Card({ className = "", ...props }: CardProps) {
  return (
    <div
      className={`bg-white dark:bg-navy-2 rounded-[14px] border border-line shadow-[0_18px_48px_#1b2b4b12] ${className}`}
      {...props}
    />
  );
}

export function CardBody({ className = "", ...props }: CardProps) {
  return <div className={`p-5 md:p-6 ${className}`} {...props} />;
}

export function CardHeader({ className = "", ...props }: CardProps) {
  return (
    <div
      className={`px-5 md:px-6 pt-5 md:pt-6 pb-2 ${className}`}
      {...props}
    />
  );
}
