import { useCallback } from "react";

/**
 * Triggers a short haptic vibration on devices that support it.
 * Safe no-op on desktop / unsupported browsers.
 */
export const useHaptics = () => {
  return useCallback((pattern: number | number[] = 12) => {
    if (typeof navigator === "undefined") return;
    if (typeof navigator.vibrate !== "function") return;
    try {
      navigator.vibrate(pattern);
    } catch {
      // ignore
    }
  }, []);
};
