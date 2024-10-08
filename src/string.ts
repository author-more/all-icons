export function kebabCaseToCamelCase(string: string): string {
  return string.replace(/-([a-z])/g, (_, letter: string) =>
    letter.toUpperCase(),
  );
}
