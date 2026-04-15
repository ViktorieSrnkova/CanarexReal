import { useEffect, useState } from "react";
import Router from "./router";
import SessionExpiredModal from "./components/SessionExpiredModal";
//import { sessionApi } from "./api/client";

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
  //modal se ukazoval moc brzo, pak na to koukni nespecha
  /*  useEffect(() => {
    const interval = setInterval(
      async () => {
        try {
          await sessionApi.get("/auth/me", {});
        } catch {
          window.dispatchEvent(new Event("session-expired"));
        }
      },
      15 * 60 * 1000,
    );

    return () => clearInterval(interval);
  }, []); */
  return (
    <>
      <Router />
      {sessionExpired && <SessionExpiredModal />}
    </>
  );
}

export default App;
