// Generates a random alphanumeric string to serve as a mock User ID or Message ID
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 9);
};

/*
 * ARCHITECTURE COMMENT:
 * Why invalid dates occur:
 * - Depending on the browser/OS, passing a non-standard or malformed string into `new Date()` can fail, yielding NaN or "Invalid Date" output on the UI.
 * Why ISO format is reliable:
 * - `toISOString()` establishes a strict, globally recognized standard (YYYY-MM-DDTHH:mm:ss.sssZ) that is 
 *   natively parsable by all modern JS runtime environments safely, guaranteeing reliable conversions everywhere.
 */
export const formatTime = (time: string): string => {
  if (!time) return "";

  const date = new Date(time);

  if (isNaN(date.getTime())) return "";

  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });
};

// Creates a fallback avatar URL using DiceBear API if the user doesn't provide one
// Redesigned: Removed bright green background (22c55e). Replaced with dark gray (111827) for SaaS look.
export const generateDiceBearAvatar = (seed: string): string => {
  return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(seed)}&backgroundColor=111827`;
};
