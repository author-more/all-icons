import { MouseEvent, ReactNode } from "react";
import "./IconButton.css";

type IconButtonProps = {
  children: ReactNode;
  label: string;
  onClick: (event: MouseEvent) => void;
};

export default function IconButton({
  children: icon,
  label,
  onClick,
}: IconButtonProps) {
  return (
    <button data-appearance="secondary" onClick={onClick}>
      {icon} <span className="visually-hidden">{label}</span>
    </button>
  );
}
