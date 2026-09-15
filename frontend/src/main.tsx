import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom";
import "./api/axiosSetup"; // registra el interceptor que adjunta el token JWT
import { ErrorBoundary } from "./components/global/ErrorBoundary";
import { registrarRastreoGuardados } from "./utils/flushSaves";
import { IdiomaProvider } from "./i18n";
// Hoja global: resaltado del toque en el móvil, selección de texto, barras de
// scroll, modo oscuro. Existía desde el principio pero NADIE la importaba, así
// que ninguna de sus reglas llegaba al navegador (de ahí el cuadrado azul al
// pulsar en el móvil, que se creía apagado desde hacía meses).
import "./style.css";

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
  components: {
    // Y tampoco el CERCO azul de los campos. Al escribir (o al tocarlos),
    // Chakra le pone al input un borde + aro `blue.500`: un rectángulo azul
    // alrededor del campo, encima de los colores de la disciplina. `currentColor`
    // hace que ese cerco tome el color de la LETRA del propio campo, que ya es
    // la tinta de su disciplina: el campo se marca al enfocarlo, pero con su
    // color. Hay que ponerlo componente a componente porque `focusBorderColor`
    // es una prop, no un token.
    Input: { defaultProps: { focusBorderColor: "currentColor" } },
    Textarea: { defaultProps: { focusBorderColor: "currentColor" } },
    Select: { defaultProps: { focusBorderColor: "currentColor" } },
    NumberInput: { defaultProps: { focusBorderColor: "currentColor" } },
    // Y lo mismo con lo que Chakra pinta de azul por defecto al marcarlo:
    // la casilla (un cuadrado azul de libro), el redondel y la barra.
    Checkbox: { defaultProps: { colorScheme: "teal" } },
    Radio: { defaultProps: { colorScheme: "teal" } },
    Switch: { defaultProps: { colorScheme: "teal" } },
    Slider: { defaultProps: { colorScheme: "teal" } },
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
