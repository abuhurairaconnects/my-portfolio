import * as React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
}

export function Card({
  className = "",
  hoverable = false,
  children,
  ...props
}: CardProps): React.ReactElement {
  return (
    <div
      className={`rounded-xl border border-border bg-surface text-text p-6 ${
        hoverable
          ? "transition-all duration-200 hover:border-accent/40 hover:-translate-y-0.5"
          : ""
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
