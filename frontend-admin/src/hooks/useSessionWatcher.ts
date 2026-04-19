import { useEffect, useRef } from "react";
import { checkSession } from "../api/sessionCheckApi";

export function useSessionWatcher(onExpire: () => void) {
  const lastRefreshRef = useRef<number>(0);
  const runningRef = useRef(false);

  const MIN_DIFF = 3000;

  const runCheck = async () => {
    if (runningRef.current) return;
    runningRef.current = true;

    const now = Date.now();

    if (now - lastRefreshRef.current < MIN_DIFF) {
      runningRef.current = false;
      return;
    }

    lastRefreshRef.current = now;

    try {
      await checkSession();
    } catch {
      onExpire();
    } finally {
      runningRef.current = false;
    }
  };

  useEffect(() => {
    runCheck();

    const interval = setInterval(runCheck, 1000 * 60 * 30);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onExpire]);

  useEffect(() => {
    const handleFocus = () => {
      runCheck();
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, []);
}
