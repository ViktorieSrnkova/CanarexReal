import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/global.css";
import { LangProvider } from "./i18n/LangProvider";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <LangProvider>
    <App />
  </LangProvider>,
);
