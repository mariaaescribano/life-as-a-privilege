// [APARCADO] Archivo comentado entero: ninguna ruta ni pantalla lo usa ya. Para revivirlo, quita el `// ` de cada línea y recupera su ruta en App.tsx.
export {};

// import React from "react";
// import { Box, Flex } from "@chakra-ui/react";
// import { useNavigate } from "react-router-dom";
// import { useT, type ClaveTexto } from "../../i18n";
// import { Reveal } from "../global/Reveal";
// import { focoBlanco } from "../global/foco";
//
// /**
//  * Los botones grandes de la portada, justo después de las cuatro cajas y los tres
//  * pilares: lo que quieres hacer ahora. Píldora con halo (DISENO.md §7); en móvil
//  * van uno bajo otro, a todo el ancho.
//  */
// const BOTONES: { clave: ClaveTexto; ruta: string }[] = [
//   { clave: "welcome.boton.asesoria", ruta: "/asesoria" },
//   { clave: "welcome.boton.premium", ruta: "/premium" },
// ];
//
// const HALO = "0 0 14px rgba(255,255,255,0.16), 0 0 32px rgba(255,255,255,0.08), 0 0 58px rgba(180,255,245,0.1)";
// const HALO_HOVER = "0 0 20px rgba(255,255,255,0.3), 0 0 44px rgba(255,255,255,0.14), 0 0 72px rgba(180,255,245,0.18)";
//
// const WelcomeBotones = () => {
//   const t = useT();
//   const navigate = useNavigate();
//   return (
//     <Flex
//       w="100%"
//       maxW="1100px"
//       mx="auto"
//       px={{ base: 5, md: 10, lg: 16 }}
//       py={{ base: 6, md: 10 }}
//       gap={{ base: 4, md: 6 }}
//       direction={{ base: "column", md: "row" }}
//       justify="center"
//     >
//       {BOTONES.map((b, i) => (
//         <Reveal key={b.clave} inView amount={0.4} direction="up" distance={22} scaleFrom={0.96} duration={0.8} delay={i * 0.14} flex="1">
//           <Box
//             as="button"
//             type="button"
//             onClick={() => navigate(b.ruta)}
//             w="100%"
//             px={{ base: 6, md: 8 }}
//             py={{ base: "20px", md: "26px" }}
//             borderRadius="full"
//             border="2px solid rgba(255,255,255,0.75)"
//             bg="rgba(255,255,255,0.1)"
//             color="white"
//             fontFamily="'EB Garamond', serif"
//             fontWeight="700"
//             fontSize={{ base: "lg", md: "xl", lg: "2xl" }}
//             letterSpacing="0.1em"
//             textTransform="uppercase"
//             boxShadow={HALO}
//             cursor="pointer"
//             transition="transform 0.3s cubic-bezier(0.22,1,0.36,1), box-shadow 0.3s ease, background 0.3s ease, border-color 0.3s ease"
//             _hover={{ transform: "translateY(-3px)", boxShadow: HALO_HOVER, bg: "rgba(255,255,255,0.2)", borderColor: "white" }}
//             _active={{ transform: "translateY(-1px)" }}
//             _focusVisible={focoBlanco}
//           >
//             {t(b.clave)}
//           </Box>
//         </Reveal>
//       ))}
//     </Flex>
//   );
// };
//
// export default WelcomeBotones;
