import { MouseEvent, ReactNode } from "react";
import "./IconButton.css";

type IconButtonProps = {
  children: ReactNode;
  label: string;
  onClick: (event: MouseEvent) => void;
  onMouseEnter?: (event: MouseEvent) => void;
  onMouseLeave?: (event: MouseEvent) => void;
  size?: "compact";
};

export default function IconButton({
  children: icon,
  label,
  onClick,
  onMouseEnter,
  onMouseLeave,
  size,
}: IconButtonProps) {
  return (
    <button
      className={`${size || ""}`}
      data-appearance="secondary"
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {icon} <span className="visually-hidden">{label}</span>
    </button>
  );
}
