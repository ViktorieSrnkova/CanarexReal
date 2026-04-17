import { useEffect, useRef } from "react";
import { checkSession } from "../api/sessionCheckApi";
import axios from "axios";

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
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const status = err.response?.status;

        if (status === 401) {
          await new Promise((r) => setTimeout(r, 1000));

          try {
            await checkSession();
          } catch {
            onExpire();
          }
        }
      }
    } finally {
      runningRef.current = false;
    }
  };

  useEffect(() => {
    runCheck();

    const interval = setInterval(runCheck, 1000 * 60 * 30);

    return () => clearInterval(interval);
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
