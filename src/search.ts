export function filterByPhrase(phrase: string, content: string) {
  const phraseNormalised = phrase?.toLowerCase();
  const contentNormalised = content?.toLowerCase();

  const pattern = phraseNormalised
    .split(" ")
    .map(
      (subPhrase) =>
        `\\b(${subPhrase
          .split("")
          // Escape RegExp's special characters
          .map((char) => char.replace(/[\\^$.*+?()[\]{}|]/g, "\\$&"))
          .join("\\w*")}\\w*)\\b`,
    )
    .join(".*");
  const regexp = new RegExp(pattern, "gi");

  return regexp.test(contentNormalised);
}
