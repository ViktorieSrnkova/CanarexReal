import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/fonts.css";
import "./styles/global.css";
import { LangProvider } from "./i18n/LangProvider";
import { AuthProvider } from "./Auth/AuthProvider";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <LangProvider>
      <App />
    </LangProvider>
  </AuthProvider>,
);
