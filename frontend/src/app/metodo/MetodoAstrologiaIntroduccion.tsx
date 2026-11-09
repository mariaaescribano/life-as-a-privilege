import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex, Text } from "@chakra-ui/react";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { IndiceAstrologia } from "../../components/metodo/IndiceAstrologia";
import { RecorridoLoading } from "../../components/metodo/RecorridoLoading";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { SpaceBg, SPACE_IMG } from "../../components/metodo/SpaceBg";
import { FormularioNacimiento, type EstadoNacimiento } from "../../components/metodo/FormularioNacimiento";
import { CartaAstral3D } from "../../components/metodo/CartaAstral3D/CartaAstral3D";
import type { CartaNatal } from "../../components/metodo/CartaAstral3D/types";
import { useImagesReady } from "../../hooks/useImagesReady";
import { Reveal } from "../../components/global/Reveal";
import { esMariaMirando } from "../../api/persona";
import { rutaHome } from "../../api/sesion";
import { useAstrologiaProgreso } from "../../hooks/useAstrologiaProgreso";
import { API_URL, astrologiaBg, astrologiaTxt, AstrologiaIcon } from "../../GlobalVariables";
import { useT } from "../../i18n";
import { focoBlanco } from "../../components/global/foco";

/**
 * Paso 1 del recorrido de Astrología: la Introducción. A ella se llega al saltar
 * (con la X) el cómic de la historia espiritual, que sale al entrar en la disciplina
 * desde la casilla START del camino.
 *
 * Primero revisa si la persona ya dio sus datos de nacimiento: si no (o si no se pudo calcular
 * su carta), sale el formulario; al enviarlo el servidor avisa a María por email y ESTA misma
 * página pasa a enseñar la carta. La persona solo rellena sus datos esa primera vez; el lápiz
 * de la caja de la carta (corregir hora/lugar) es solo de María, por la vía de admin.
 *
 * Es para lucir la carta astral de la persona: el header de siempre (sin el botón
 * «Ilustraciones»), debajo un saludo en blanco, la carta (solo para mirarla: sin
 * ir de planeta en planeta; eso es la página de Arquetipos) y dos frases.
 */
export default function MetodoAstrologiaIntroduccion() {
  const t = useT();
  const navigate = useNavigate();
  const [cargando, setCargando] = useState(true);
  const [carta, setCarta] = useState<CartaNatal | null>(null);
  const [estado, setEstado] = useState<EstadoNacimiento | null>(null);
  const [editando, setEditando] = useState(false);
  const mariaMirando = esMariaMirando();
  const fotosListas = useImagesReady([SPACE_IMG]);
  // La rueda solo se monta cuando el box ya está a la vista: sus planetas brotan uno a uno
  // desde que se monta, y si la caja estaba bajo el pliegue la animación se gastaba sin que
  // nadie la viera.
  // (Observador propio con ref de callback: la caja aparece DESPUÉS de cargar o de enviar el
  // formulario, y un ref normal no vería cuándo se monta.)
  const [cajaCarta, setCajaCarta] = useState<HTMLDivElement | null>(null);
  const [cartaVisible, setCartaVisible] = useState(false);
  useEffect(() => {
    if (!cajaCarta || cartaVisible) return;
    if (typeof IntersectionObserver === "undefined") { setCartaVisible(true); return; }
    const obs = new IntersectionObserver((es) => {
      if (es.some((e) => e.isIntersecting)) { setCartaVisible(true); obs.disconnect(); }
    }, { threshold: 0.3 });
    obs.observe(cajaCarta);
    return () => obs.disconnect();
  }, [cajaCarta, cartaVisible]);
  const { bloqueada, cargado: cargadoPasos } = useAstrologiaProgreso();
  // «nombre de user»: su nombre de pila. En el camino de una persona, el de ella.
  const nombre = (() => {
    try { return (localStorage.getItem("name") ?? "").trim().split(/\s+/)[0] ?? ""; } catch { return ""; }
  })();

  // Si no se pudo LEER lo guardado (red, servidor), no se decide nada: ni formulario ni carta.
  // Enseñar el formulario a quien ya dio sus datos, o la carta a quien no, sería un error.
  const [fallo, setFallo] = useState(false);
  // ¿Tiene abierta la disciplina de Astrología? (`metodo_suscrito`). Sin ella y sin datos, no hay nada que
  // enseñar ni formulario que rellenar: sale un aviso en vez de fallar.
  const [disciplinaAbierta, setDisciplinaAbierta] = useState<boolean | null>(null);

  const cargar = React.useCallback(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) { setCargando(false); return () => {}; }
    let cancel = false;
    setFallo(false);
    setCargando(true);
    // Primero se mira si ya dio sus datos (y hay carta calculada) y SOLO entonces se pinta nada.
    // Sin la disciplina abierta el servidor puede negar (403) o no encontrar (404) estos datos: eso es «no hay
    // datos», no un fallo.
    const sinDatos = (err: any) => {
      const s = err?.response?.status;
      if (s === 403 || s === 404) return null;
      throw err;
    };
    Promise.all([
      axios.get<EstadoNacimiento | null>(`${API_URL}/metodo-astrologia/${userId}`).then((r) => r.data ?? null).catch(sinDatos),
      axios.get<CartaNatal | null>(`${API_URL}/metodo-astrologia/carta-natal/${userId}`).then((r) => r.data ?? null).catch(sinDatos),
      axios.get<{ metodo_suscrito?: boolean }>(`${API_URL}/user/me`).then((r) => !!r.data?.metodo_suscrito).catch(() => null),
    ]).then(([e, c, abierta]) => {
      if (cancel) return;
      setEstado(e);
      setCarta(c);
      setDisciplinaAbierta(abierta);
    }).catch(() => {
      if (!cancel) setFallo(true);
    }).finally(() => { if (!cancel) setCargando(false); });
    return () => { cancel = true; };
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    return cargar();
  }, [cargar]);

  // Con la carta calculada (y sin estar corrigiendo) se enseña la carta; si no, el formulario.
  // María mirando el camino de otra persona no rellena nada por ella: ve siempre la carta.
  // Para María basta con que haya carta: sus correcciones (vía admin) no tocan la solicitud.
  const hayCarta = mariaMirando ? !!carta : !!estado?.solicitud_enviada_at && !!carta;
  // La persona solo rellena sus datos la primera vez; después, el lápiz es solo de María.
  const verFormulario = !hayCarta || editando;
  // Ya mandó sus datos pero no hay carta (no se encontró el lugar): se le enseña el formulario
  // PARA CORREGIR (con sus datos puestos), no el de la primera vez.
  const sinCartaConDatos = !mariaMirando && !!estado?.solicitud_enviada_at && !carta;
  const corrigiendo = editando || sinCartaConDatos;

  // Tras enviar los datos: se trae la carta recién calculada y la página cambia sola.
  const alEnviar = async (nuevo: EstadoNacimiento) => {
    setEstado(nuevo);
    setEditando(false);
    try {
      const userId = localStorage.getItem("userId");
      const r = await axios.get<CartaNatal | null>(`${API_URL}/metodo-astrologia/carta-natal/${userId}`);
      setCarta(r.data ?? null);
    } catch { setCarta(null); }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (cargando || !fotosListas) return <RecorridoLoading />;

  // Sin datos y sin la disciplina abierta: un aviso, no un error ni un formulario.
  const sinDatosNiDisciplina = !carta && !estado?.fecha_nacimiento && disciplinaAbierta === false;
  if (sinDatosNiDisciplina) {
    return (
      <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
        <SiteHeader variant="private" />
        <Flex flex="1" align="center" justify="center" px={6} py={10}>
          <Box role="alertdialog" aria-labelledby="aviso-sin-disciplina" position="relative" overflow="hidden" w="100%" maxW="460px"
               borderRadius="2xl" boxShadow={`0 0 24px ${astrologiaTxt}55, 0 0 60px ${astrologiaTxt}22`}>
            <SpaceBg overlay="rgba(8,13,30,0.3)" />
            <Flex position="relative" zIndex={1} direction="column" align="center" gap={6} px={{ base: 6, md: 9 }} py={{ base: 8, md: 10 }}>
              <Text id="aviso-sin-disciplina" color={astrologiaTxt} fontSize={{ base: "xl", md: "2xl" }} fontWeight="700" lineHeight="1.4"
                    textAlign="center" style={{ textShadow: `0 0 12px ${astrologiaTxt}55` }}>
                {t("metodo.astro.sinDisciplina")}
              </Text>
              <Box as="button" type="button" autoFocus onClick={() => navigate(rutaHome())} px={8} py="10px" borderRadius="full"
                   bg="white" color="#008080" fontWeight="700" letterSpacing="0.04em" cursor="pointer"
                   boxShadow="0 0 22px rgba(255,255,255,0.3)" _focusVisible={focoBlanco}>
                {t("comun.cerrar")}
              </Box>
            </Flex>
          </Box>
        </Flex>
        <SiteFooter />
      </Box>
    );
  }

  if (fallo) {
    return (
      <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
        <SiteHeader variant="private" />
        <Flex flex="1" direction="column" align="center" justify="center" gap={6} px={6}>
          <Text color="white" fontSize={{ base: "lg", md: "xl" }} textAlign="center" fontStyle="italic">{t("comun.error")}</Text>
          <Box as="button" type="button" onClick={cargar} px={7} py="10px" borderRadius="full" bg="white" color="#008080"
               fontWeight="700" letterSpacing="0.04em" cursor="pointer" boxShadow="0 0 22px rgba(255,255,255,0.3)" _focusVisible={focoBlanco}>
            {t("comun.reintentar")}
          </Box>
        </Flex>
        <SiteFooter />
      </Box>
    );
  }

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 28, md: 36 }}>
        <Flex direction="column" align="center" w="100%" maxW="850px" gap={{ base: 6, md: 8 }}>
          <Reveal direction="down" distance={16} duration={0.6} w="100%">
            <MetodoStepHeader
              icon={<AstrologiaIcon size={{ base: "40px", md: "52px" }} />}
              title={t("metodo.astro.paso.introduccion")}
              bgColor={`${astrologiaBg}dd`}
              color={astrologiaTxt}
              space
              dense
              step={{ current: 3, total: 12 }}
              mb={0}
              prev={{ label: `← ${t("metodo.astro.paso.explicacion")}`, onClick: () => navigate("/metodo/astrologia/explicacion") }}
              next={{
                label: `${t("metodo.astro.paso.trio")} →`,
                onClick: () => navigate("/metodo/astrologia/trio"),
                // Cerrado hasta que María abra el paso 4 (ella entra siempre).
                disabled: !mariaMirando && ((cargadoPasos && bloqueada(4)) || verFormulario),
              }}
            />
          </Reveal>

          {verFormulario ? (
            <>
              {/* Primera vez: lo que María le dice antes de pedirle la hora y el lugar. */}
              {!corrigiendo && (
                <Reveal direction="up" distance={18} delay={0.4} duration={1} blur w="100%">
                  <Text color="white" fontSize={{ base: "lg", md: "xl" }} lineHeight="1.8" textAlign="center" fontStyle="italic">
                    {t("metodo.astro.intro.datosTexto", { nombre })}
                  </Text>
                </Reveal>
              )}
              <FormularioNacimiento
                estado={estado}
                editando={corrigiendo}
                lugarNoEncontrado={sinCartaConDatos}
                modoAdmin={mariaMirando}
                sinTitulo={!corrigiendo}
                onCancelar={hayCarta ? () => setEditando(false) : undefined}
                onEnviado={(e) => { void alEnviar(e); }}
              />
            </>
          ) : (
            <>
            {/* Fuera de las cajas: blanco y sin sombra. */}
            <Reveal direction="up" distance={18} delay={0.4} duration={1} blur w="100%">
              <Text color="white" fontSize={{ base: "lg", md: "xl" }} lineHeight="1.8" textAlign="center" fontStyle="italic">
                {t("metodo.astro.intro.cartaTexto", { nombre })}
              </Text>
            </Reveal>

            {/* La carta, en su caja estrellada, TAN ANCHA como el header. Entrada SOLO de opacidad:
                el <Canvas> mide su contenedor una vez al montar, y con un transform en marcha
                mediría una caja escalada (ver la página de Arquetipos). */}
            {/* Sin carta calculada (p. ej. la persona no dio su hora) NO se pinta nada:
                CartaAstral3D sin `carta` dibuja la carta de MUESTRA y parecería la suya. */}
            {carta && (
            <Reveal
              inView
              amount={0.15}
              direction="none"
              duration={0.9}
              position="relative"
              w="100%"
              borderRadius="2xl"
              overflow="hidden"
              boxShadow={`0 0 16px rgba(255,255,255,0.16), 0 0 34px rgba(255,255,255,0.08), 0 0 60px rgba(180,255,245,0.09), 0 0 20px ${astrologiaTxt}1a, 0 0 48px ${astrologiaTxt}10`}
              // Tras entrar, el halo de la caja respira muy despacio (luz, no sombra).
              sx={{
                animation: "cartaHalo 7s ease-in-out 1.6s infinite",
                "@keyframes cartaHalo": {
                  "0%, 100%": { boxShadow: `0 0 16px rgba(255,255,255,0.16), 0 0 34px rgba(255,255,255,0.08), 0 0 60px rgba(180,255,245,0.09), 0 0 20px ${astrologiaTxt}1a, 0 0 48px ${astrologiaTxt}10` },
                  "50%": { boxShadow: `0 0 22px rgba(255,255,255,0.24), 0 0 48px rgba(255,255,255,0.12), 0 0 84px rgba(180,255,245,0.14), 0 0 30px ${astrologiaTxt}2e, 0 0 70px ${astrologiaTxt}1a` },
                },
                "@media (prefers-reduced-motion: reduce)": { animation: "none" },
              }}
            >
              <SpaceBg overlay="rgba(8,13,30,0.28)" />
              <Flex ref={setCajaCarta} position="relative" zIndex={1} direction="column" align="center" px={{ base: 5, md: 12 }} py={{ base: 10, md: 14 }}>
                {/* Corregir los datos (solo María): lápiz pequeño, abajo a la derecha DENTRO de la caja. */}
                {mariaMirando && (
                  <Box as="button" type="button"
                       onClick={() => { setEditando(true); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                       aria-label={t("metodo.astro.cambiar")} title={t("metodo.astro.cambiar")}
                       position="absolute" bottom="14px" right="14px" zIndex={2}
                       display="inline-flex" alignItems="center" justifyContent="center" w="26px" h="26px"
                       borderRadius="full" bg="rgba(255,255,255,0.14)" color="white" cursor="pointer"
                       transition="all 0.2s" _hover={{ bg: "rgba(255,255,255,0.28)" }} _focusVisible={focoBlanco}>
                    <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" w="13px" h="13px" fill="currentColor">
                      <path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T846-647L319-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z" />
                    </Box>
                  </Box>
                )}
                {cartaVisible ? (
                  <CartaAstral3D color={astrologiaTxt} carta={carta} soloVista />
                ) : (
                  // Mismo tamaño que la rueda (cuadrado) para que la página no salte al montarla.
                  <Box w={{ base: "100%", md: "90%" }} maxW="612px" sx={{ aspectRatio: "1 / 1" }} />
                )}
              </Flex>
            </Reveal>
            )}

            <Reveal inView amount={0.6} direction="up" distance={18} duration={0.9} blur w="100%">
              {/* Estirada, en UNA sola línea (en móvil, si no cabe, baja). */}
              <Text color="white" fontSize={{ base: "lg", md: "xl" }} lineHeight="1.8" textAlign="center"
                    whiteSpace={{ base: "normal", md: "nowrap" }}>
                {t("metodo.astro.intro.apuntes1")} {t("metodo.astro.intro.apuntes2")}
              </Text>
            </Reveal>

            </>
          )}
        </Flex>
      </Flex>

      <IndiceAstrologia />
      <SiteFooter />
    </Box>
  );
}
