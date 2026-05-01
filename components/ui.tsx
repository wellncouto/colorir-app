/**
 * Componentes base do design system Duolingo-inspired.
 * - Botões com lip 3D (sombra inferior sólida)
 * - Active state "afunda" (translateY + lip menor)
 * - Bordas grossas de input
 * - Uppercase + letter-spacing nos labels/buttons
 */
import { ButtonHTMLAttributes, HTMLAttributes, forwardRef, ReactNode, InputHTMLAttributes } from "react";

type ButtonVariant = "primary" | "info" | "danger" | "ghost" | "secondary";

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
      "inline-flex items-center justify-center gap-2 uppercase tracking-[0.04em] font-extrabold transition-all duration-100 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed disabled:!shadow-lip-swan disabled:!bg-swan disabled:!text-hare disabled:active:!translate-y-0";
    const sizeMap = {
      sm: "text-label-sm px-4 py-2 rounded",
      md: "text-label px-5 py-3 rounded",
      lg: "text-label px-6 py-4 rounded",
    };
    const variantMap: Record<ButtonVariant, string> = {
      primary:
        "bg-owl text-snow shadow-lip-owl hover:brightness-110 active:translate-y-[2px] active:shadow-lip-active",
      info:
        "bg-macaw text-snow shadow-lip-macaw hover:brightness-110 active:translate-y-[2px] active:[box-shadow:0_2px_0_#1899d6]",
      danger:
        "bg-cardinal text-snow shadow-lip-cardinal hover:brightness-110 active:translate-y-[2px] active:[box-shadow:0_2px_0_#ea2b2b]",
      secondary:
        "bg-snow text-eel border-2 border-swan border-b-4 hover:bg-polar active:translate-y-[2px] active:border-b-2",
      ghost: "bg-transparent text-macaw hover:bg-bluejay/10 active:scale-95",
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
        "bg-snow border-2 border-swan rounded-lg",
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
  level?: 1 | 2 | 3 | 4 | 5;
  children: ReactNode;
  className?: string;
}) => {
  const sizeMap = {
    1: "text-page-title-lg",
    2: "text-page-title",
    3: "text-heading-lg",
    4: "text-heading",
    5: "text-heading-sm",
  };
  const Tag = `h${Math.min(level, 4)}` as keyof React.JSX.IntrinsicElements;
  return (
    <Tag className={cls("font-display text-eel", sizeMap[level], className)}>
      {children}
    </Tag>
  );
};

export const Text = ({
  size = "body",
  bold,
  children,
  className,
  muted,
}: {
  size?: "body" | "caption";
  bold?: boolean;
  children: ReactNode;
  className?: string;
  muted?: boolean;
}) => {
  const sizeMap = {
    body: bold ? "text-body-bold" : "text-body",
    caption: bold ? "text-caption-bold" : "text-caption",
  };
  return (
    <p className={cls(sizeMap[size], muted ? "text-wolf" : "text-eel", className)}>
      {children}
    </p>
  );
};

export const Label = ({ children, className }: { children: ReactNode; className?: string }) => (
  <label className={cls("text-label-sm text-wolf block mb-3 uppercase", className)}>
    {children}
  </label>
);

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...rest }, ref) => (
    <input
      ref={ref}
      className={cls(
        "w-full bg-snow border-2 border-swan rounded px-4 py-3 text-eel font-bold text-base",
        "placeholder:text-hare placeholder:font-semibold",
        "focus:outline-none focus:border-macaw",
        "transition-colors duration-150",
        className
      )}
      {...rest}
    />
  )
);
Input.displayName = "Input";

export const Divider = ({ className }: { className?: string }) => (
  <div className={cls("h-0.5 bg-swan rounded-pill w-full", className)} />
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
      "rounded px-4 py-2 text-label-sm uppercase font-extrabold transition-all duration-100",
      "border-2 border-b-4",
      selected
        ? "bg-macaw text-snow border-whale active:translate-y-[2px] active:border-b-2"
        : "bg-snow text-wolf border-swan hover:bg-polar active:translate-y-[2px] active:border-b-2",
      className
    )}
  >
    {children}
  </button>
);

/** Toast simples (pop-up no canto) */
export const Toast = ({ children, visible }: { children: ReactNode; visible: boolean }) => {
  if (!visible) return null;
  return (
    <div className="fixed bottom-24 lg:bottom-8 left-1/2 -translate-x-1/2 z-50 toast">
      <div className="bg-eel text-snow px-5 py-3 rounded-pill shadow-lg font-bold text-sm">
        {children}
      </div>
    </div>
  );
};
