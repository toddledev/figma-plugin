import * as React from "react";

type Style = "normal" | "alt";
interface Props {
  onClick: () => void;
  icon?: React.ComponentType;
  children?: React.ReactNode;
  style?: Style;
}

const styles: Record<Style, string> = {
  normal: "h-9 px-6 py-4 bg-neutral-700 text-neutral-200 text-[13px]",
  alt: "px-6 py-[22px] bg-[#facb25] rounded-[14px] text-neutral-900 text-lg",
};

const Button = ({ children, onClick, icon: Icon, style = "normal" }: Props) => (
  <button
    className={`self-stretch rounded-md justify-center items-center gap-2.5 inline-flex  font-normal font-['Inter'] ${styles[style]}`}
    onClick={onClick}
  >
    {children}
    {Icon && <Icon />}
  </button>
);
export default Button;
