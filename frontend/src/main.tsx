import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ChakraProvider } from "@chakra-ui/react"; 
import { BrowserRouter } from "react-router-dom";
import { createSystem, defaultConfig } from "@chakra-ui/react"

const config = {
  theme: {
    tokens: {
      fonts: {
        heading: { value: `"Times New Roman", Times, serif` },
        body: { value: `"Times New Roman", Times, serif` },
      },
    },
  },
}

const system = createSystem(defaultConfig, config)

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ChakraProvider value={system}> 
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ChakraProvider>
  </React.StrictMode>
);
