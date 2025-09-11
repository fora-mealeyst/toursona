import { twMerge } from "tailwind-merge";

export const variantClasses = {
  primary: "bg-gray-100 text-gray-900",
  secondary: "bg-gray-700 text-gray-100",
};

type ButtonProps = {
  variant?: "primary" | "secondary";
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = ({
  className,
  children,
  onClick,
  variant = "primary",
  disabled = false,
  ...buttonProps
}: ButtonProps) => {
  const defaultClassName =
    "border border-transparent px-5 py-2.5 font-medium font-inherit transition-[border-color] duration-250 h-11 rounded-none outline-none focus:outline-none focus:ring-0 focus:border-transparent";

  const disabledClassName = disabled
    ? "cursor-not-allowed opacity-50"
    : "cursor-pointer";

  const finalClasses = twMerge(
    defaultClassName,
    disabledClassName,
    variantClasses[variant],
    className
  );

  return (
    <button
      className={finalClasses}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      {...buttonProps}
    >
      {children}
    </button>
  );
};
