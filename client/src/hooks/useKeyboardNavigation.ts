import { useEffect, useCallback } from "react";

interface KeyboardNavigationOptions {
  isActive: boolean;
  onEscape: () => void;
}

function useKeyboardNavigation({ isActive, onEscape }: KeyboardNavigationOptions) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!isActive) return;

      if (event.key === "Escape") {
        event.preventDefault();
        onEscape();
      }
    },
    [isActive, onEscape]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);
}

export default useKeyboardNavigation;
