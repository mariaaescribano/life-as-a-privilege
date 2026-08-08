import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom";
import "./api/axiosSetup"; // registra el interceptor que adjunta el token JWT
import { ErrorBoundary } from "./components/global/ErrorBoundary";
import { registrarRastreoGuardados } from "./utils/flushSaves";
import { IdiomaProvider } from "./i18n";

// Rastrea los guardados (PATCH) en vuelo para poder esperarlos (flush) antes de
// navegar y no perder datos entre páginas del recorrido.
registrarRastreoGuardados();

const theme = extendTheme({
  fonts: {
    heading: `"Times New Roman", Times, serif`,
    body: `"Times New Roman", Times, serif`,
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <IdiomaProvider>
        <BrowserRouter>
          <ErrorBoundary>
            <App />
          </ErrorBoundary>
        </BrowserRouter>
      </IdiomaProvider>
    </ChakraProvider>
  </React.StrictMode>
);
