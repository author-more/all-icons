import { readdirSync, readFileSync, writeFileSync } from "fs";
import { resolve, extname } from "path";

export const __dirname = import.meta.dirname;

export function getFilesByExtension(directory: string, extension: string) {
  const path = resolve(__dirname, directory);
  const files = readdirSync(path);

  return files.filter((file) => extname(file) === extension);
}

export function readFile(directory: string, file: string) {
  const path = resolve(__dirname, directory, file);

  return readFileSync(path, "utf-8");
}

export function writeToJSONFile(
  directory: string,
  fileName: string,
  content: unknown,
) {
  const path = resolve(__dirname, `${directory}/${fileName}.json`);
  const contentJSON = JSON.stringify(content, null, 2);

  writeFileSync(path, contentJSON);
}
