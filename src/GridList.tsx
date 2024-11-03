import { CSSProperties, ReactElement } from "react";
import "./GridList.css";

type GridListProps = {
  items: ReactElement[];
  emptyMessage?: string;
  itemSizePx?: number;
};

export default function GridList({
  items,
  emptyMessage,
  itemSizePx,
}: GridListProps) {
  const hasItems = !!items.length;
  if (hasItems) {
    return (
      <div
        className="grid-list"
        style={{ "--item-size": `${itemSizePx}px` } as CSSProperties}
      >
        {items}
      </div>
    );
  }

  return <p className="grid-list-empty">{emptyMessage}</p>;
}
