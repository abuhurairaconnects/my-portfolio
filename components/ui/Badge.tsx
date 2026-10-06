import * as React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "accent" | "success" | "outline";
}

export function Badge({
  className = "",
  variant = "default",
  children,
  ...props
}: BadgeProps): React.ReactElement {
  const baseStyles =
    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono font-medium transition-colors border";

  const variantStyles = {
    default: "bg-surface/80 border-border text-text-muted hover:text-text",
    accent: "bg-accent/10 border-accent/30 text-accent",
    success: "bg-success/10 border-success/30 text-success",
    outline: "bg-transparent border-border text-text-muted",
  };

  return (
    <span
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
