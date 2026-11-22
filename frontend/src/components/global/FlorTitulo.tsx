import React from "react";
import { Flex } from "@chakra-ui/react";
import { MandalaTinte } from "./MandalaTinte";
import { Reveal, Breathe } from "./Reveal";

/**
 * La flor de la vida que va encima del título de cada página (antes, el mandala).
 * Entra sin girar —sube y se enfoca— y, ya colocada, respira muy despacio.
 *
 * `mandala` pone el mandala de la casa (life.webp) en vez de la flor (Ilustraciones).
 * `activo` es opcional: las páginas que disparan sus entradas a mano con un
 * `mounted` se lo pasan; el resto se anima solo al montarse.
 */
const FlorTitulo = ({ activo, pt = { base: 10, md: 14 }, mandala }: { activo?: boolean; pt?: { base: number; md: number }; mandala?: boolean }) => (
  <Flex justify="center" pt={pt}>
    <Reveal direction="none" scaleFrom={0.7} blur duration={1.1} delay={0.1} activo={activo}>
      <Breathe scale={0.035} duration={6} delay={1.3}>
        <MandalaTinte src={mandala ? "/img/icono/life.webp" : "/img/icono/flordelavida.png"} h={{ base: "60px", md: "80px" }} />
      </Breathe>
    </Reveal>
  </Flex>
);

export default FlorTitulo;
