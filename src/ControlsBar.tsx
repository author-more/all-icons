import { ReactNode } from "react";
import "./ControlsBar.css";

type ControlsBar = {
  children: ReactNode;
  stickToTop?: boolean;
  growFirstItem?: boolean;
};

export default function ControlsBar({
  children,
  stickToTop,
  growFirstItem,
}: ControlsBar) {
  const className = `controls-bar ${stickToTop ? "sticky" : ""} ${growFirstItem ? "grow-first" : ""}`;

  return <div className={className}>{children}</div>;
}
