import * as React from "react";

export interface SectionHeadingProps {
  id: string;
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
}

export function SectionHeading({
  id,
  eyebrow,
  title,
  description,
  className = "",
}: SectionHeadingProps): React.ReactElement {
  return (
    <div className={`space-y-3 mb-12 ${className}`}>
      {eyebrow && (
        <div className="inline-flex items-center gap-1.5 text-xs font-mono tracking-wider uppercase text-accent font-semibold">
          <span>{"//"}</span>
          <span>{eyebrow}</span>
        </div>
      )}
      <h2
        id={id}
        className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-text"
      >
        {title}
      </h2>
      {description && (
        <p className="text-text-muted text-sm sm:text-base max-w-2xl leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
