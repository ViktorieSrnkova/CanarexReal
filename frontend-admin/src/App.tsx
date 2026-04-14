import { useEffect, useState } from "react";
import Router from "./router";
import SessionExpiredModal from "./components/SessionExpiredModal";
import { api } from "./api/client";

function App() {
  const [sessionExpired, setSessionExpired] = useState(false);

  useEffect(() => {
    const handler = () => {
      setSessionExpired(true);
    };

    window.addEventListener("session-expired", handler);

    return () => {
      window.removeEventListener("session-expired", handler);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(
      async () => {
        try {
          await api.get("/auth/ping");
        } catch {
          window.dispatchEvent(new Event("session-expired"));
        }
      },
      15 * 60 * 1000,
    );

    return () => clearInterval(interval);
  }, []);
  return (
    <>
      <Router />
      {sessionExpired && <SessionExpiredModal />}
    </>
  );
}

export default App;
