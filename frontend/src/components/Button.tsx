import type { ReactNode, ButtonHTMLAttributes } from "react";

type ButtonProps = {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline";
} & ButtonHTMLAttributes<HTMLButtonElement>; // inherit standard button props

const Button = ({
  children,
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) => {
  const baseStyles =
    "cursor-pointer inline-flex items-center justify-center px-6 py-3 rounded-4xl font-semibold transition focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variants = {
    primary: "bg-[#F17733] text-white hover:bg-[#e0701d] focus:ring-[#1E59A7]",
    secondary: "bg-white text-[#1E59A7] hover:bg-gray-100 focus:ring-[#1E59A7]",
    outline:
      "border border-[#1E59A7] text-[#1E59A7] hover:bg-[#1E59A7]/10 focus:ring-[#1E59A7]",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
