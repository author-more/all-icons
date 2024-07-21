import { PenpotLibraryColor, PenpotGradient } from "@penpot/plugin-types";
import React from "react";
import "./ColorSwatch.css";
import { hexToRgba } from "./color";

type ColorSwatchProps = {
  color: PenpotLibraryColor;
  size?: number;
};

export default function ColorSwatch({
  color: penpotColor,
  size,
}: ColorSwatchProps) {
  return (
    <div
      key={penpotColor.id}
      className="color-swatch"
      style={
        {
          "--color-swatch-size": `${size}px`,
          "--color-swatch-background": getBackground(penpotColor),
        } as React.CSSProperties
      }
    ></div>
  );
}

function getBackground({ color, gradient }: PenpotLibraryColor) {
  if (color) {
    return color;
  }

  if (gradient) {
    const { type, stops } = gradient;

    if (type === "linear") {
      return `linear-gradient(${generateStops(stops)})`;
    }

    if (type === "radial") {
      return `radial-gradient(50% 50%, ${generateStops(stops)})`;
    }
  }
}

function generateStops(stops: PenpotGradient["stops"]) {
  return stops
    .map(({ color, opacity }, index) => {
      // Penpot supports only 2 stops, with multi-stop gradients in the works
      // https://github.com/penpot/penpot/issues/1504
      const position = index === 0 ? "0%" : "100%";

      return `${hexToRgba(color, opacity)} ${position}`;
    })
    .join(", ");
}
