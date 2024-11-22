import { ReactNode } from "react";
import "./ControlsBar.css";

type ControlsBar = {
  children: ReactNode;
  stickTo?: "top" | "bottom";
  growFirstItem?: boolean;
};

export default function ControlsBar({
  children,
  stickTo,
  growFirstItem,
}: ControlsBar) {
  const className = [
    "controls-bar",
    (stickTo && `sticky ${stickTo}`) || "",
    (growFirstItem && "grow-first") || "",
  ]
    .filter(Boolean)
    .join(" ");

  return <div className={className}>{children}</div>;
}
