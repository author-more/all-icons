import { iconPackages } from "./config";
import { getFilesByExtension, writeToJSONFile, readFile } from "./files";

type Icon = {
  svg: {
    attributes: string;
    elements: string;
  };
};

iconPackages.forEach(({ id, iconsDir }: (typeof iconPackages)[number]) => {
  const files = getFilesByExtension(iconsDir, ".svg");

  const icons: Record<string, Icon> = {};
  for (const file of files) {
    const svg = readFile(iconsDir, file);

    const attributes = svg.match(/<svg([^>]*)>/)?.[1];
    const elements = svg.match(/<svg[^>]*>([\s\S]*)<\/svg>/)?.[1];

    if (!attributes || !elements) {
      throw new Error(`Failed to parse the SVG: ${file}`);
    }

    const iconName = file.replace(".svg", "");
    icons[iconName] = {
      svg: {
        attributes: normaliseWhitespace(attributes),
        elements: normaliseWhitespace(elements),
      },
    };
  }

  writeToJSONFile("../data/icons", id, icons);
});

function normaliseWhitespace(text: string): string {
  return text
    .trim()
    .replace(/[\n\r]+/g, "")
    .replace(/\s{2,}/g, " ");
}
