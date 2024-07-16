import { ReactElement } from "react";
import "./GridList.css";

type IconListProps = {
  items: ReactElement[];
  emptyMessage?: string;
};

export default function IconList({ items, emptyMessage }: IconListProps) {
  const hasItems = !!items.length;
  if (hasItems) {
    return <div className="grid-list">{items}</div>;
  }

  return <p className="grid-list-empty">{emptyMessage}</p>;
}
