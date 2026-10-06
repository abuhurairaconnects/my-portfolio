import * as React from "react";
import Link from "next/link";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  href?: string;
  external?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = "",
      variant = "primary",
      size = "md",
      href,
      external,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-colors select-none rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] transition-transform";

    const variantStyles = {
      primary:
        "bg-accent text-accent-fg hover:opacity-95 font-semibold shadow-sm",
      secondary:
        "bg-surface text-text border border-border hover:border-accent hover:text-accent",
      outline:
        "bg-transparent text-text border border-border hover:border-accent hover:text-accent",
      ghost:
        "bg-transparent text-text-muted hover:text-text hover:bg-surface/60",
    };

    const sizeStyles = {
      sm: "text-xs px-3 py-2 min-h-[36px]",
      md: "text-sm px-4 py-2.5 min-h-[44px]",
      lg: "text-base px-6 py-3 min-h-[48px]",
    };

    const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

    if (href) {
      if (external) {
        return (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={combinedClassName}
          >
            {children}
          </a>
        );
      }
      return (
        <Link href={href} className={combinedClassName}>
          {children}
        </Link>
      );
    }

    return (
      <button ref={ref} className={combinedClassName} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
