export function sendMessage(type: string, content: unknown) {
  window.parent.postMessage(
    {
      type,
      content,
    },
    "*",
  );
}
