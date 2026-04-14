// Generates a random alphanumeric string to serve as a mock User ID or Message ID
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 9);
};

// Formats an ISO timestamp into a readable time string (e.g. "10:30 AM")
export const formatTime = (isoString: string): string => {
  try {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch (error) {
    return "";
  }
};

// Creates a fallback avatar URL using DiceBear API if the user doesn't provide one
export const generateDiceBearAvatar = (seed: string): string => {
  return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(seed)}&backgroundColor=22c55e`;
};
