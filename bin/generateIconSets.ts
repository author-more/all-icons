import { iconPackages } from "./config";
import { getFilesByExtension, writeToJSONFile, readFile } from "./files";

type Icon = {
  svg: {
    attributes: string;
    elements: string;
  };
};

iconPackages.forEach(
  ({
    id,
    iconsDir,
    variant,
    getVariantFromIconName,
    normaliseAttributes,
  }: (typeof iconPackages)[number]) => {
    const files = getFilesByExtension(iconsDir, ".svg");

    const icons: Record<string, Record<string, Icon>> = {};
    for (const file of files) {
      const svg = readFile(iconsDir, file);

      const svgNormalised = normaliseAttributes?.(svg) || svg;
      const attributes = svgNormalised.match(/<svg([^>]*)>/)?.[1];
      const elements = svgNormalised.match(/<svg[^>]*>([\s\S]*)<\/svg>/)?.[1];

      if (!attributes || !elements) {
        throw new Error(`Failed to parse the SVG: ${file}`);
      }

      const iconName = file.split("/").pop()!.replace(".svg", "");
      const variantName =
        variant ?? getVariantFromIconName?.(iconName) ?? "regular";

      icons[variantName] = icons[variantName] || {};
      icons[variantName][iconName] = {
        svg: {
          attributes: normaliseWhitespace(attributes),
          elements: normaliseWhitespace(elements),
        },
      };
    }

    for (const [variantName, iconSet] of Object.entries(icons)) {
      writeToJSONFile("../data/icons", `${id}-${variantName}`, iconSet);
    }
  },
);

function normaliseWhitespace(text: string): string {
  return text
    .trim()
    .replace(/[\n\r]+/g, "")
    .replace(/\s{2,}/g, " ");
}
