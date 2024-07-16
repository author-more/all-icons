import { ReactNode } from "react";
import "./ControlsBar.css";

type ControlsBar = {
  children: ReactNode;
};

export default function ControlsBar({ children }: ControlsBar) {
  return <div className="controls-bar">{children}</div>;
}
