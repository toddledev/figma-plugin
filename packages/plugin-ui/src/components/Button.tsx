import * as React from "react";

type Style = "normal" | "alt";
interface Props {
  onClick: () => void;
  icon?: React.ComponentType;
  children?: React.ReactNode;
  style?: Style;
  disabled?: boolean;
  success?: boolean;
}

const styles: Record<Style, string> = {
  normal:
    "h-9 px-6 py-4 bg-neutral-700 text-neutral-200 text-[13px] bg-opacity-50 hover:bg-opacity-100",
  alt: "px-6 py-[10px] bg-[#facb25] disabled:bg-[#897123] bg-opacity-80 hover:bg-opacity-100 rounded-[14px] text-neutral-900 text-lg",
};
const successStyle = "bg-[#1CD688] disabled:bg-[#1CD688]";

const Button = ({
  children,
  onClick,
  icon: Icon,
  disabled = false,
  style = "normal",
  success = false,
}: Props) => (
  <button
    className={`self-stretch rounded-md justify-center items-center gap-2.5 inline-flex  font-normal font-['Inter'] transition-all duration-200 ${styles[style]} ${success ? successStyle : ""}`}
    onClick={onClick}
    disabled={disabled}
  >
    {children}
    {Icon && <Icon />}
  </button>
);
export default Button;
