// import React, { useEffect, useState } from "react";
// import {
//   Box, Flex, Image, Text, SimpleGrid,
//   Modal, ModalOverlay, ModalContent, ModalBody, ModalCloseButton,
//   Input, FormControl, FormLabel, VStack, Checkbox,
// } from "@chakra-ui/react";
// import SpinnerTurquesa from "../../components/global/Spinner";
// import { useNavigate, useParams } from "react-router-dom";
// import { loadStripe } from "@stripe/stripe-js";
// import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
// import { productos } from "../../data/productos";
// import { API_URL } from "../../GlobalVariables";

// // ── Reemplaza con tu clave publicable de Stripe (Dashboard → Developers → API Keys)
// // pk_test_... para pruebas · pk_live_... para producción
// const STRIPE_PK = "pk_test_51T5hzE1FpLrpyowjcJCLaSwtRpovCDIGG2l4qZ4EQGchkB7XI6ydCJEX50M1wj7dqfnyoRNkhx19UpJeXowJaBEj00azK8G1vy";
// const stripePromise = loadStripe(STRIPE_PK);

// // ─────────────────────────────────────────────
// // Componente interno: formulario de tarjeta
// // ─────────────────────────────────────────────
// interface StripeFormProps {
//   clientSecret: string;
//   nombre: string;
//   email: string;
//   precio: number;
//   onSuccess: () => void;
//   onBack: () => void;
// }

// const StripeCheckoutForm = ({ clientSecret, nombre, email, precio, onSuccess, onBack }: StripeFormProps) => {
//   const stripe = useStripe();
//   const elements = useElements();
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handlePay = async () => {
//     if (!stripe || !elements) return;
//     setLoading(true);
//     setError("");

//     const cardEl = elements.getElement(CardElement);
//     const { paymentIntent, error: stripeError } = await stripe.confirmCardPayment(clientSecret, {
//       payment_method: {
//         card: cardEl!,
//         billing_details: { name: nombre.trim(), email },
//       },
//     });

//     if (stripeError) {
//       setError(stripeError.message ?? "Error al procesar el pago");
//     } else if (paymentIntent?.status === "succeeded") {
//       onSuccess();
//     }
//     setLoading(false);
//   };

//   return (
//     <Box>
//       {/* Info del pedido */}
//       <Flex align="center" gap={3} mb={6}>
//         <Box
//           as="button"
//           onClick={onBack}
//           color="rgba(255,255,255,0.6)"
//           fontSize="sm"
//           letterSpacing="0.04em"
//           _hover={{ color: "white" }}
//           transition="color 0.15s"
//         >
//           ← Volver
//         </Box>
//         <Text color="rgba(255,255,255,0.4)" fontSize="sm">|</Text>
//         <Text color="rgba(255,255,255,0.75)" fontSize="sm" letterSpacing="0.03em">
//           Datos de pago seguros · Stripe
//         </Text>
//       </Flex>

//       <Text color="white" fontSize={{ base: "xl", md: "2xl" }} fontWeight="700" letterSpacing="0.05em" mb={6}>
//         Introduce tu tarjeta
//       </Text>

//       {/* Tarjeta Stripe */}
//       <Box
//         p={{ base: 4, md: 5 }}
//         border="1px solid rgba(255,255,255,0.35)"
//         borderRadius="lg"
//         bg="rgba(255,255,255,0.08)"
//         mb={error ? 3 : 6}
//       >
//         <CardElement
//           options={{
//             style: {
//               base: {
//                 color: "#ffffff",
//                 fontFamily: "'EB Garamond', serif",
//                 fontSize: "17px",
//                 fontSmoothing: "antialiased",
//                 "::placeholder": { color: "rgba(255,255,255,0.4)" },
//                 iconColor: "rgba(255,255,255,0.7)",
//               },
//               invalid: { color: "#ff6b6b", iconColor: "#ff6b6b" },
//               complete: { iconColor: "#6bffaa" },
//             },
//           }}
//         />
//       </Box>

//       {error && (
//         <Text color="#ff6b6b" fontSize="sm" mb={5} letterSpacing="0.02em">
//           {error}
//         </Text>
//       )}

//       {/* Total + botón pagar */}
//       <Flex align="center" justify="space-between" flexWrap="wrap" gap={4}>
//         <Box>
//           <Text color="rgba(255,255,255,0.55)" fontSize="sm" letterSpacing="0.05em">TOTAL</Text>
//           <Text color="white" fontSize="2xl" fontWeight="700" lineHeight="1.1">
//             {precio.toFixed(2).replace(".", ",")} €
//           </Text>
//         </Box>
//         <Box
//           as="button"
//           color="white"
//           fontFamily="'EB Garamond', serif"
//           fontWeight="700"
//           fontSize={{ base: "lg", md: "xl" }}
//           letterSpacing="0.1em"
//           px={10}
//           py="13px"
//           borderRadius="full"
//           border="2px solid rgba(255,255,255,0.7)"
//           bg={loading ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.15)"}
//           cursor={loading ? "not-allowed" : "pointer"}
//           _hover={loading ? {} : { bg: "rgba(255,255,255,0.28)", borderColor: "white" }}
//           transition="all 0.22s"
//           display="flex"
//           alignItems="center"
//           gap={2}
//           onClick={loading ? undefined : handlePay}
//         >
//           {loading ? <><SpinnerTurquesa fullScreen={false} size={16} thickness={2} /> Procesando...</> : "Confirmar pago →"}
//         </Box>
//       </Flex>

//       {/* Sello de seguridad */}
//       <Text color="rgba(255,255,255,0.3)" fontSize="xs" textAlign="center" mt={6} letterSpacing="0.04em">
//         🔒 Pago procesado de forma segura por Stripe · Tus datos están cifrados
//       </Text>
//     </Box>
//   );
// };

// // ─────────────────────────────────────────────
// // Pantalla de éxito
// // ─────────────────────────────────────────────
// const SuccessScreen = ({ onClose }: { onClose: () => void }) => (
//   <Box textAlign="center" py={{ base: 8, md: 10 }}>
//     <Box
//       w="72px"
//       h="72px"
//       borderRadius="full"
//       bg="rgba(107,255,170,0.15)"
//       border="2px solid rgba(107,255,170,0.5)"
//       display="flex"
//       alignItems="center"
//       justifyContent="center"
//       mx="auto"
//       mb={5}
//     >
//       <svg xmlns="http://www.w3.org/2000/svg" height="38px" viewBox="0 -960 960 960" width="38px" fill="rgba(107,255,170,0.9)">
//         <path d="m424-296 282-282-56-56-226 226-114-114-56 56 170 170Zm56 216q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
//       </svg>
//     </Box>
//     <Text color="white" fontSize={{ base: "2xl", md: "3xl" }} fontWeight="700" letterSpacing="0.04em" mb={2}>
//       ¡Pago completado!
//     </Text>
//     <Text color="rgba(255,255,255,0.65)" fontSize={{ base: "md", md: "lg" }} lineHeight="1.8" mb={8}>
//       Tu pedido ha sido procesado correctamente.<br />
//       Recibirás un email de confirmación en breve.
//     </Text>
//     <Box
//       as="button"
//       onClick={onClose}
//       color="white"
//       fontFamily="'EB Garamond', serif"
//       fontWeight="600"
//       fontSize="md"
//       letterSpacing="0.08em"
//       px={10}
//       py="11px"
//       borderRadius="full"
//       border="1.5px solid rgba(255,255,255,0.55)"
//       bg="rgba(255,255,255,0.1)"
//       cursor="pointer"
//       _hover={{ bg: "rgba(255,255,255,0.22)", borderColor: "white" }}
//       transition="all 0.22s"
//     >
//       Cerrar
//     </Box>
//   </Box>
// );

// // ─────────────────────────────────────────────
// // Íconos y estilos
// // ─────────────────────────────────────────────
// const FlowerIcon = ({ size = "32px" }: { size?: string }) => (
//   <svg xmlns="http://www.w3.org/2000/svg" height={size} viewBox="0 -960 960 960" width={size} fill="rgba(255,255,255,0.92)">
//     <path d="M480-200q0-100-70-170t-170-70q0 100 70 170t170 70Zm44-220q18-18 18-44v-6q8 6 16.5 9t19.5 3q26 0 44-18t18-44q0-20-9.5-35T604-576q17-6 26.5-21t9.5-35q0-26-18-44t-44-18q-11 0-19.5 3t-16.5 9v-6q0-26-18-44t-44-18q-26 0-44 18t-18 44v6q-8-6-16.5-9t-19.5-3q-26 0-44 18t-18 44q0 20 9.5 35t26.5 21q-17 6-26.5 21t-9.5 35q0 26 18 44t44 18q11 0 19.5-3t16.5-9v6q0 26 18 44t44 18q26 0 44-18Zm-88-111.5Q418-549 418-576q0-26 18-44t44-18q26 0 44 18t18 44q0 27-18 44.5T480-514q-26 0-44-17.5ZM480-200q100 0 170-70t70-170q-100 0-170 70t-70 170ZM160-80q-33 0-56.5-23.5T80-160v-640q0-33 23.5-56.5T160-880h640q33 0 56.5 23.5T880-800v640q0 33-23.5 56.5T800-80H160Zm0-80h640v-640H160v640Zm0 0v-640 640Z" />
//   </svg>
// );

// const glassCard = {
//   bg: "rgba(255,255,255,0.14)",
//   border: "1px solid rgba(255,255,255,0.38)",
//   sx: { backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)" },
//   borderRadius: "2xl",
//   boxShadow: "0 8px 40px rgba(107,196,200,0.45)",
// };

// const inputStyle = {
//   bg: "rgba(255,255,255,0.12)",
//   border: "1px solid rgba(255,255,255,0.35)",
//   color: "white",
//   borderRadius: "lg",
//   _placeholder: { color: "rgba(255,255,255,0.45)" },
//   _focus: { borderColor: "rgba(255,255,255,0.7)", boxShadow: "0 0 0 1px rgba(255,255,255,0.3)" },
//   _hover: { borderColor: "rgba(255,255,255,0.5)" },
// };

// const labelStyle = {
//   color: "rgba(255,255,255,0.75)",
//   fontSize: "sm" as const,
//   letterSpacing: "0.04em",
//   mb: 1,
// };

// // ─────────────────────────────────────────────
// // Página principal
// // ─────────────────────────────────────────────
// const ProductoDetalle = () => {
//   const { id } = useParams<{ id: string }>();
//   const navigate = useNavigate();
//   const producto = productos.find((p) => p.id === id);

//   const [selectedImg, setSelectedImg] = useState(0);
//   const [isOpen, setIsOpen] = useState(false);
//   const [modalStep, setModalStep] = useState<1 | 2 | 3>(1); // 1=envío 2=pago 3=éxito
//   const [clientSecret, setClientSecret] = useState("");
//   const [loadingIntent, setLoadingIntent] = useState(false);
//   const [guardarDatos, setGuardarDatos] = useState(false);
//   const [form, setForm] = useState({
//     nombre: "", apellidos: "", email: "", telefono: "",
//     calle: "", ciudad: "", cp: "", pais: "España",
//   });

//   useEffect(() => {
//     window.scrollTo({ top: 0, behavior: "auto" });
//   }, []);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
//   };

//   const openModal = () => {
//     setModalStep(1);
//     setClientSecret("");
//     setIsOpen(true);
//   };

//   const closeModal = () => {
//     setIsOpen(false);
//     setModalStep(1);
//     setClientSecret("");
//   };

//   const handlePagar = async () => {
//     if (!producto) return;
//     setLoadingIntent(true);
//     try {
//       const res = await fetch(`${API_URL}/payment/create-intent`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ amount: producto.price }),
//       });
//       const { clientSecret: cs } = await res.json();
//       setClientSecret(cs);
//       setModalStep(2);
//     } catch {
//       // Si el backend no está disponible (sin claves Stripe reales aún),
//       // puedes poner aquí un mensaje de error.
//     }
//     setLoadingIntent(false);
//   };

//   if (!producto) {
//     return (
//       <Box minH="100vh" bg="#008080" display="flex" alignItems="center" justifyContent="center">
//         <Text color="white" fontSize="xl">Producto no encontrado.</Text>
//       </Box>
//     );
//   }

//   return (
//     <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">

//       {/* ── HEADER ── */}
//       <Flex
//         as="header"
//         align="center"
//         justify="space-between"
//         px={{ base: 5, md: 12 }}
//         py={{ base: 3, md: 4 }}
//         bg="#008080"
//         position="sticky"
//         top="0"
//         zIndex="100"
//         borderBottom="1px solid rgba(255,255,255,0.12)"
//       >
//         <Image
//           src="/img/life.png"
//           h={{ base: "56px", md: "70px" }}
//           objectFit="contain"
//           cursor="pointer"
//           onClick={() => navigate("/")}
//           _hover={{ opacity: 0.85 }}
//           transition="opacity 0.2s"
//         />
//         <Box
//           as="button"
//           onClick={() => navigate(-1)}
//           color="white"
//           fontWeight="600"
//           fontSize={{ base: "md", md: "lg" }}
//           letterSpacing="0.04em"
//           px={{ base: 4, md: 6 }}
//           py={{ base: "8px", md: "10px" }}
//           borderRadius="full"
//           border="1.5px solid rgba(255,255,255,0.6)"
//           bg="rgba(255,255,255,0.12)"
//           cursor="pointer"
//           _hover={{ bg: "rgba(255,255,255,0.25)", borderColor: "white" }}
//           transition="all 0.2s"
//         >
//           ← Volver
//         </Box>
//       </Flex>

//       {/* ── MAIN ── */}
//       <Box flex="1" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 10, md: 14 }} pb={{ base: 14, md: 20 }}>
//         <Box {...glassCard} overflow="hidden">
//           <Flex direction={{ base: "column", md: "row" }}>

//             {/* ── GALERÍA (izquierda) ── */}
//             <Box
//               w={{ base: "100%", md: "45%" }}
//               flexShrink={0}
//               borderRight={{ base: "none", md: "1px solid rgba(255,255,255,0.15)" }}
//               borderBottom={{ base: "1px solid rgba(255,255,255,0.15)", md: "none" }}
//               p={{ base: 4, md: 6 }}
//             >
//               <Box h={{ base: "260px", md: "390px" }} overflow="hidden" position="relative" borderRadius="xl">
//                 <Image
//                   src={producto.imgs[selectedImg]}
//                   alt={producto.title}
//                   w="100%"
//                   h="100%"
//                   objectFit="cover"
//                   objectPosition="center"
//                   transition="opacity 0.25s ease"
//                 />
//               </Box>
//               <Flex gap={3} pt={{ base: 3, md: 4 }} flexWrap="wrap">
//                 {producto.imgs.map((img, i) => (
//                   <Box
//                     key={i}
//                     w="72px" h="72px"
//                     borderRadius="lg"
//                     overflow="hidden"
//                     cursor="pointer"
//                     border={selectedImg === i ? "2px solid white" : "2px solid rgba(255,255,255,0.25)"}
//                     opacity={selectedImg === i ? 1 : 0.65}
//                     transition="all 0.18s"
//                     _hover={{ opacity: 1, borderColor: "rgba(255,255,255,0.7)" }}
//                     onClick={() => setSelectedImg(i)}
//                     flexShrink={0}
//                   >
//                     <Image src={img} alt={`${producto.title} ${i + 1}`} w="100%" h="100%" objectFit="cover" />
//                   </Box>
//                 ))}
//               </Flex>
//             </Box>

//             {/* ── CONTENIDO (derecha) ── */}
//             <Box flex="1" px={{ base: 6, md: 10 }} py={{ base: 8, md: 10 }} display="flex" flexDirection="column" gap={6}>
//               <Flex align="center" gap={3}>
//                 <FlowerIcon size="34px" />
//                 <Text
//                   color="white"
//                   fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }}
//                   fontWeight="700"
//                   letterSpacing="0.05em"
//                   lineHeight="1.15"
//                   textShadow="0 2px 10px rgba(0,100,90,0.4)"
//                 >
//                   {producto.title}
//                 </Text>
//               </Flex>

//               <Box flex="1">
//                 {producto.descFull.split("\n\n").map((parrafo, i) => (
//                   <Text
//                     key={i}
//                     color="rgba(255,255,255,0.82)"
//                     fontSize={{ base: "md", md: "lg" }}
//                     lineHeight="1.85"
//                     letterSpacing="0.02em"
//                     mb={i < producto.descFull.split("\n\n").length - 1 ? 4 : 0}
//                   >
//                     {parrafo}
//                   </Text>
//                 ))}
//               </Box>

//               <Box borderTop="1px solid rgba(255,255,255,0.15)" pt={5}>
//                 <Text color="rgba(255,255,255,0.55)" fontSize="sm" letterSpacing="0.08em" mb={1}>PRECIO</Text>
//                 <Text color="white" fontSize={{ base: "3xl", md: "4xl" }} fontWeight="700" letterSpacing="0.02em" lineHeight="1">
//                   {producto.price.toFixed(2).replace(".", ",")} €
//                 </Text>
//               </Box>

//               <Box
//                 as="button"
//                 onClick={openModal}
//                 color="white"
//                 fontFamily="'EB Garamond', serif"
//                 fontWeight="700"
//                 fontSize={{ base: "lg", md: "xl" }}
//                 letterSpacing="0.1em"
//                 py={{ base: "14px", md: "16px" }}
//                 borderRadius="full"
//                 border="2px solid rgba(255,255,255,0.7)"
//                 bg="rgba(255,255,255,0.15)"
//                 cursor="pointer"
//                 w="100%"
//                 _hover={{ bg: "rgba(255,255,255,0.28)", borderColor: "white" }}
//                 transition="all 0.22s"
//               >
//                 Comprar
//               </Box>
//             </Box>
//           </Flex>
//         </Box>
//       </Box>

//       {/* ── FOOTER ── */}
//       <Box as="footer" borderTop="1px solid rgba(255,255,255,0.15)" px={{ base: 6, md: 16 }} py={{ base: 8, md: 10 }}>
//         <Text color="rgba(255,255,255,0.5)" fontSize="xs" letterSpacing="0.05em" textAlign="center">
//           © 2026 Life as a Privilege · María Escribano · Todos los derechos reservados
//         </Text>
//       </Box>

//       {/* ── MODAL CHECKOUT ── */}
//       <Modal isOpen={isOpen} onClose={closeModal} size="xl" isCentered scrollBehavior="inside">
//         <ModalOverlay bg="rgba(0,60,60,0.65)" sx={{ backdropFilter: "blur(6px)" }} />
//         <ModalContent
//           bg="#008080"
//           border="1px solid rgba(255,255,255,0.3)"
//           borderRadius="2xl"
//           boxShadow="0 16px 60px rgba(0,0,0,0.5)"
//           mx={{ base: 4, md: 0 }}
//           fontFamily="'EB Garamond', serif"
//         >
//           {modalStep !== 3 && <ModalCloseButton color="white" top={4} right={4} />}

//           <ModalBody px={{ base: 6, md: 10 }} py={{ base: 8, md: 10 }}>

//             {/* ── PASO 1: Datos de envío ── */}
//             {modalStep === 1 && (
//               <>
//                 <Text color="white" fontSize={{ base: "2xl", md: "3xl" }} fontWeight="700" letterSpacing="0.05em" mb={1}>
//                   Datos de envío
//                 </Text>
//                 <Text color="rgba(255,255,255,0.55)" fontSize="sm" letterSpacing="0.03em" mb={7}>
//                   Completa tus datos para finalizar el pedido
//                 </Text>

//                 <VStack spacing={4} align="stretch">
//                   <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4}>
//                     <FormControl>
//                       <FormLabel {...labelStyle}>Nombre</FormLabel>
//                       <Input {...inputStyle} name="nombre" placeholder="Tu nombre" value={form.nombre} onChange={handleChange} />
//                     </FormControl>
//                     <FormControl>
//                       <FormLabel {...labelStyle}>Apellidos</FormLabel>
//                       <Input {...inputStyle} name="apellidos" placeholder="Tus apellidos" value={form.apellidos} onChange={handleChange} />
//                     </FormControl>
//                   </SimpleGrid>

//                   <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4}>
//                     <FormControl>
//                       <FormLabel {...labelStyle}>Email</FormLabel>
//                       <Input {...inputStyle} name="email" type="email" placeholder="correo@ejemplo.com" value={form.email} onChange={handleChange} />
//                     </FormControl>
//                     <FormControl>
//                       <FormLabel {...labelStyle}>Teléfono</FormLabel>
//                       <Input {...inputStyle} name="telefono" type="tel" placeholder="+34 600 000 000" value={form.telefono} onChange={handleChange} />
//                     </FormControl>
//                   </SimpleGrid>

//                   <FormControl>
//                     <FormLabel {...labelStyle}>Calle</FormLabel>
//                     <Input {...inputStyle} name="calle" placeholder="Calle, número, piso..." value={form.calle} onChange={handleChange} />
//                   </FormControl>

//                   <SimpleGrid columns={{ base: 1, sm: 3 }} spacing={4}>
//                     <FormControl>
//                       <FormLabel {...labelStyle}>Ciudad</FormLabel>
//                       <Input {...inputStyle} name="ciudad" placeholder="Ciudad" value={form.ciudad} onChange={handleChange} />
//                     </FormControl>
//                     <FormControl>
//                       <FormLabel {...labelStyle}>Código postal</FormLabel>
//                       <Input {...inputStyle} name="cp" placeholder="28001" value={form.cp} onChange={handleChange} />
//                     </FormControl>
//                     <FormControl>
//                       <FormLabel {...labelStyle}>País</FormLabel>
//                       <Input {...inputStyle} name="pais" placeholder="España" value={form.pais} onChange={handleChange} />
//                     </FormControl>
//                   </SimpleGrid>
//                 </VStack>

//                 <Checkbox
//                   mt={5}
//                   isChecked={guardarDatos}
//                   onChange={(e) => setGuardarDatos(e.target.checked)}
//                   colorScheme="whiteAlpha"
//                   color="rgba(255,255,255,0.72)"
//                   fontSize="sm"
//                   letterSpacing="0.03em"
//                   sx={{ ".chakra-checkbox__control": { borderColor: "rgba(255,255,255,0.4)", bg: "rgba(255,255,255,0.08)" } }}
//                 >
//                   Guardar estos datos para el futuro
//                 </Checkbox>

//                 <Box mt={7} pt={6} borderTop="1px solid rgba(255,255,255,0.15)" display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={4}>
//                   <Box>
//                     <Text color="rgba(255,255,255,0.55)" fontSize="sm" letterSpacing="0.05em">TOTAL</Text>
//                     <Text color="white" fontSize="2xl" fontWeight="700" lineHeight="1.1">
//                       {producto.price.toFixed(2).replace(".", ",")} €
//                     </Text>
//                   </Box>
//                   <Box
//                     as="button"
//                     onClick={handlePagar}
//                     color="white"
//                     fontFamily="'EB Garamond', serif"
//                     fontWeight="700"
//                     fontSize={{ base: "lg", md: "xl" }}
//                     letterSpacing="0.1em"
//                     px={10}
//                     py="13px"
//                     borderRadius="full"
//                     border="2px solid rgba(255,255,255,0.7)"
//                     bg={loadingIntent ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.15)"}
//                     cursor={loadingIntent ? "not-allowed" : "pointer"}
//                     _hover={loadingIntent ? {} : { bg: "rgba(255,255,255,0.28)", borderColor: "white" }}
//                     transition="all 0.22s"
//                     display="flex"
//                     alignItems="center"
//                     gap={2}
//                   >
//                     {loadingIntent ? <><SpinnerTurquesa fullScreen={false} size={16} thickness={2} /> Cargando...</> : "Pagar →"}
//                   </Box>
//                 </Box>
//               </>
//             )}

//             {/* ── PASO 2: Pago con Stripe ── */}
//             {modalStep === 2 && clientSecret && (
//               <Elements stripe={stripePromise} options={{ locale: "es" }}>
//                 <StripeCheckoutForm
//                   clientSecret={clientSecret}
//                   nombre={`${form.nombre} ${form.apellidos}`}
//                   email={form.email}
//                   precio={producto.price}
//                   onSuccess={() => setModalStep(3)}
//                   onBack={() => setModalStep(1)}
//                 />
//               </Elements>
//             )}

//             {/* ── PASO 3: Éxito ── */}
//             {modalStep === 3 && <SuccessScreen onClose={closeModal} />}

//           </ModalBody>
//         </ModalContent>
//       </Modal>
//     </Box>
//   );
// };

// export default ProductoDetalle;
