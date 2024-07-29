import { ReactNode } from "react";
import "./ControlsBar.css";

type ControlsBar = {
  children: ReactNode;
  isSticky?: boolean;
};

export default function ControlsBar({ children, isSticky }: ControlsBar) {
  const className = `controls-bar ${isSticky ? "sticky" : ""}`;

  return <div className={className}>{children}</div>;
}
