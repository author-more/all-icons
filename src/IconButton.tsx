import { MouseEvent, ReactNode } from "react";
import "./IconButton.css";

type IconButtonProps = {
  children: ReactNode;
  label: string;
  onClick: (event: MouseEvent) => void;
  size?: "compact";
};

export default function IconButton({
  children: icon,
  label,
  onClick,
  size,
}: IconButtonProps) {
  return (
    <button
      className={`${size || ""}`}
      data-appearance="secondary"
      onClick={onClick}
    >
      {icon} <span className="visually-hidden">{label}</span>
    </button>
  );
}
