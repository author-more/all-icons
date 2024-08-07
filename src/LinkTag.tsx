import { ReactNode } from "react";
import "./LinkTag.css";

type LinkTagProps = {
  children: ReactNode;
  href: string;
};

export default function LinkTag({ children, href }: LinkTagProps) {
  return (
    <a
      className="link-tag body-s"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  );
}
