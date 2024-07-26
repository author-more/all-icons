import { kebabCaseToCamelCase } from "./string";

export function parseAttributes(
  attributes: string = "",
): Record<string, string> | undefined {
  return attributes
    .match(/([\w-]+="[^"]*")/g)
    ?.map((attribute) => attribute.split("="))
    .reduce(
      (acc, [key, value]) => {
        if (value) {
          const propertyName = kebabCaseToCamelCase(key);
          const clearValue = value.replace(/"/g, "");

          acc[propertyName] = clearValue;
        }

        return acc;
      },
      {} as Record<string, string>,
    );
}
