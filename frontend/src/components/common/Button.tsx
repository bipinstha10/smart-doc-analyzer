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
  const baseStyles = "cursor-pointer px-2 py-2 border rounded";

  const variants = {
    primary: "bg-[#000] text-white hover:bg-[#333333]",
    secondary: "bg-white text-[#1E59A7] hover:bg-gray-100",
    outline: "border-[#333333] text-[#333333] hover:bg-[#1E59A7]/10",
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
