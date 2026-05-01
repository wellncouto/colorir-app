/**
 * Componentes base do design system (Lovable-inspired).
 * Tudo client-safe. Usar em qualquer page/component.
 */
import { ButtonHTMLAttributes, HTMLAttributes, forwardRef, ReactNode, InputHTMLAttributes } from "react";

type ButtonVariant = "primary" | "ghost" | "cream" | "pill";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const cls = (...x: (string | false | undefined)[]) => x.filter(Boolean).join(" ");

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", fullWidth, className, children, leftIcon, rightIcon, ...rest }, ref) => {
    const base =
      "inline-flex items-center justify-center gap-2 font-medium transition-opacity duration-150 active:opacity-80 disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus-visible:shadow-focus-warm";
    const sizeMap = {
      sm: "text-label px-3 py-1.5 rounded-sm",
      md: "text-body px-4 py-2 rounded-sm",
      lg: "text-body px-6 py-3 rounded-sm",
    };
    const variantMap: Record<ButtonVariant, string> = {
      primary: "bg-charcoal text-off-white shadow-inset-dark",
      ghost: "bg-transparent text-charcoal border border-border-strong",
      cream: "bg-cream text-charcoal border border-border-soft hover:border-border-strong",
      pill: "bg-cream text-charcoal shadow-inset-dark rounded-pill px-4 py-2",
    };
    return (
      <button
        ref={ref}
        className={cls(base, sizeMap[size], variantMap[variant], fullWidth && "w-full", className)}
        {...rest}
      >
        {leftIcon}
        {children}
        {rightIcon}
      </button>
    );
  }
);
Button.displayName = "Button";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padded?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, padded = true, children, ...rest }, ref) => (
    <div
      ref={ref}
      className={cls(
        "bg-cream border border-border-soft rounded",
        padded && "p-5",
        className
      )}
      {...rest}
    >
      {children}
    </div>
  )
);
Card.displayName = "Card";

export const Heading = ({
  level = 1,
  children,
  className,
}: {
  level?: 1 | 2 | 3 | 4;
  children: ReactNode;
  className?: string;
}) => {
  const sizeMap = {
    1: "text-display-xl",
    2: "text-display",
    3: "text-display-sm",
    4: "text-title",
  };
  const Tag = `h${level}` as keyof React.JSX.IntrinsicElements;
  return (
    <Tag className={cls("font-display text-charcoal", sizeMap[level], className)}>
      {children}
    </Tag>
  );
};

export const Text = ({
  size = "body",
  children,
  className,
  muted,
}: {
  size?: "body-lg" | "body" | "label" | "caption";
  children: ReactNode;
  className?: string;
  muted?: boolean;
}) => {
  const sizeMap = {
    "body-lg": "text-body-lg",
    body: "text-body",
    label: "text-label",
    caption: "text-caption",
  };
  return (
    <p className={cls(sizeMap[size], muted ? "text-muted" : "text-charcoal-82", className)}>
      {children}
    </p>
  );
};

export const Label = ({ children, className }: { children: ReactNode; className?: string }) => (
  <label className={cls("text-label text-charcoal block mb-2 tracking-wide", className)}>
    {children}
  </label>
);

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...rest }, ref) => (
    <input
      ref={ref}
      className={cls(
        "w-full bg-cream border border-border-soft rounded-sm px-4 py-3 text-body text-charcoal",
        "placeholder:text-muted",
        "focus:outline-none focus:border-border-strong focus:shadow-focus-warm",
        "transition-shadow duration-150",
        className
      )}
      {...rest}
    />
  )
);
Input.displayName = "Input";

export const Divider = ({ className }: { className?: string }) => (
  <div className={cls("h-px bg-border-soft w-full", className)} />
);

export const Pill = ({
  children,
  selected,
  onClick,
  className,
}: {
  children: ReactNode;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
}) => (
  <button
    onClick={onClick}
    type="button"
    className={cls(
      "rounded-pill px-4 py-2 text-label transition-all duration-150 active:opacity-80",
      selected
        ? "bg-charcoal text-off-white shadow-inset-dark"
        : "bg-cream border border-border-soft text-charcoal hover:border-border-strong",
      className
    )}
  >
    {children}
  </button>
);
