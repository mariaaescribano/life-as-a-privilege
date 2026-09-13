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
  // Nada de anillo AZUL al pulsar. Chakra pinta el foco con un box-shadow de su
  // token `outline` (un aro azul de su paleta) en botones, inputs, pestañas,
  // checkboxes… En el móvil el foco se queda puesto después de tocar, así que el
  // botón se quedaba con un cerco azul —como «seleccionado»— encima de los
  // colores de su disciplina.
  //
  // Se apaga aquí, en el TOKEN, y no con CSS: así se va SOLO el aro del foco y
  // no se toca ningún otro box-shadow (el resplandor decorativo de los botones
  // de pago, el halo de las cajas…), que es lo que pasaría apagando
  // `box-shadow` a lo bruto. El foco sigue existiendo: Tab y Enter funcionan
  // igual, simplemente no se pinta.
  shadows: { outline: "none" },
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
