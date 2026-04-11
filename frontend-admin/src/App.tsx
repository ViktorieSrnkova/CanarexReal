import { useEffect, useState } from "react";
import Router from "./router";
import SessionExpiredModal from "./components/SessionExpiredModal";

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

  return (
    <>
      <Router />
      {sessionExpired && <SessionExpiredModal />}
    </>
  );
}

export default App;
