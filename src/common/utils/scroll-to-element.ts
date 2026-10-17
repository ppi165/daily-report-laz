export function scrollToAndHighlightElement(elementId: string): boolean {
  if (typeof window === "undefined") return false;
  const cleanId = elementId.startsWith("#") ? elementId.substring(1) : elementId;
  const el = document.getElementById(cleanId);
  if (!el) return false;

  el.scrollIntoView({ behavior: "smooth", block: "center" });

  // Visual glow/highlight ring animation
  el.classList.add(
    "ring-2",
    "ring-primary",
    "ring-offset-2",
    "ring-offset-surface",
    "transition-all",
    "duration-500",
    "shadow-lg"
  );

  setTimeout(() => {
    el.classList.remove(
      "ring-2",
      "ring-primary",
      "ring-offset-2",
      "ring-offset-surface",
      "shadow-lg"
    );
  }, 3000);

  return true;
}
