// Alta de una cuenta de asesoría (/admin/asesorias/nueva). Las personas asesoradas
// NO se registran: las da de alta la admin, y a la persona le llega un correo para
// elegir su contraseña (eso activa la cuenta). Empieza sin nada abierto; las
// disciplinas se abren luego. Es una página (no un popup) para poder recorrerla
// con el tabulador: campos y botones van en el orden en que se leen.
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Box, Flex, Input, Text } from "@chakra-ui/react";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { LifeLoading } from "../../components/global/LifeLoading";
import { Reveal } from "../../components/global/Reveal";
import { focoBlanco } from "../../components/global/foco";
import { API_URL } from "../../GlobalVariables";
import { dmaAIso, mascaraDMA } from "../../utils/fechas";
import { adminHeaders, useAdminGuard } from "./useAdminGuard";

/** Teléfono con prefijo de país: «+34 600 11 22 33» (el + y entre 6 y 15 cifras). */
const telefonoConPrefijo = (t: string) => /^\+\d{6,15}$/.test(t.replace(/[\s().-]/g, ""));

type Campo = "name" | "email" | "telefono" | "fecha_nacimiento" | "hora" | "lugar" | "region" | "pais";

const CAMPOS: { k: Campo; etiqueta: string; tipo: string; auto: string; ayuda?: string }[] = [
  { k: "name", etiqueta: "Nombre", tipo: "text", auto: "off" },
  { k: "email", etiqueta: "Email", tipo: "email", auto: "off" },
  { k: "telefono", etiqueta: "Teléfono", tipo: "tel", auto: "off", ayuda: "Con prefijo, por ejemplo +34 600 11 22 33" },
  { k: "fecha_nacimiento", etiqueta: "Fecha de nacimiento (opcional)", tipo: "text", auto: "off", ayuda: "dd/mm/aaaa" },
];

// Los datos de su carta astral (opcionales): la fecha es la de arriba. Si los pones aquí, luego le salen ya
// rellenados en Astrología, sin tener que abrirle la disciplina antes ni teclearlos otra vez.
const CAMPOS_CARTA: { k: Campo; etiqueta: string; ayuda?: string }[] = [
  { k: "hora", etiqueta: "Hora de nacimiento", ayuda: "hh:mm, por ejemplo 18:45" },
  { k: "lugar", etiqueta: "Lugar de nacimiento", ayuda: "Ciudad o pueblo" },
  { k: "region", etiqueta: "Región" },
  { k: "pais", etiqueta: "País" },
];

const VACIO: Record<Campo, string> = { name: "", email: "", telefono: "", fecha_nacimiento: "", hora: "", lugar: "", region: "", pais: "" };

export default function AdminCrearCuenta() {
  const navigate = useNavigate();
  const { verificando } = useAdminGuard();
  const [nuevo, setNuevo] = useState(VACIO);
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  // Con la cuenta ya creada: el texto de la confirmación y si el correo salió.
  const [creada, setCreada] = useState<{ texto: string; ok: boolean } | null>(null);
  const salida = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(salida.current), []);

  const crear = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (enviando) return;
    if (!nuevo.name.trim() || !nuevo.email.trim() || !nuevo.telefono.trim()) {
      setError("Faltan el nombre, el email o el teléfono.");
      return;
    }
    if (!telefonoConPrefijo(nuevo.telefono)) {
      setError("El teléfono tiene que llevar el prefijo del país, por ejemplo +34 600 11 22 33.");
      return;
    }
    // La fecha se teclea como día/mes/año y viaja como AAAA-MM-DD.
    const nacimiento = nuevo.fecha_nacimiento.trim() ? dmaAIso(nuevo.fecha_nacimiento) : undefined;
    if (nacimiento === null) {
      setError("La fecha de nacimiento tiene que ser día/mes/año, por ejemplo 17/05/1990.");
      return;
    }
    // Datos de la carta: o ninguno, o todos (y entonces hace falta la fecha de arriba).
    const hora = nuevo.hora.trim();
    const lugar = nuevo.lugar.trim();
    const region = nuevo.region.trim();
    const pais = nuevo.pais.trim();
    const hayCarta = !!(hora || lugar || region || pais);
    if (hayCarta) {
      if (!nacimiento || !hora || !lugar || !region || !pais) {
        setError("Para guardar la carta astral hacen falta la fecha, la hora, el lugar, la región y el país (o déjalos todos vacíos).");
        return;
      }
      if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(hora)) {
        setError("La hora tiene que ser hh:mm, por ejemplo 18:45.");
        return;
      }
    }
    setEnviando(true);
    setError(null);
    try {
      const { data } = await axios.post<{ id: string; email: string; correoEnviado: boolean }>(
        `${API_URL}/user/admin/crear`,
        { name: nuevo.name, email: nuevo.email, telefono: nuevo.telefono, fecha_nacimiento: nacimiento },
        { headers: adminHeaders() },
      );
      // Los datos de la carta, por la vía de admin: no manda ningún correo ni abre nada.
      let cartaTexto = "";
      if (hayCarta && nacimiento) {
        try {
          const r = await axios.patch(
            `${API_URL}/metodo-astrologia/admin/${data.id}/nacimiento`,
            { fecha_nacimiento: nacimiento, hora_nacimiento: hora, lugar, region, pais },
            { headers: adminHeaders() },
          );
          cartaTexto = r.data?.success === false
            ? ` Los datos de la carta NO se han guardado: ${r.data?.message ?? "inténtalo desde su ficha"}.`
            : r.data?.recalculada === false
              ? ` Datos de la carta guardados, pero no he encontrado ese lugar: revísalo en su ficha.`
              : " Datos de la carta guardados: le saldrán rellenados en Astrología.";
        } catch {
          cartaTexto = " Los datos de la carta NO se han guardado: inténtalo desde su ficha.";
        }
      }
      const aviso = (data.correoEnviado
        ? `Cuenta creada. Le he mandado a ${data.email} el correo para que elija su contraseña.`
        : `Cuenta creada, pero el correo a ${data.email} NO ha salido. Ábrele «Datos personales» y pulsa «Reenviar correo de activación».`) + cartaTexto;
      // La confirmación sale AQUÍ, a la vista, y no se va hasta que se ha podido leer: antes
      // saltaba directo a la lista y el aviso (una línea pequeña) pasaba sin verse.
      setCreada({ texto: aviso, ok: data.correoEnviado });
      window.scrollTo({ top: 0, behavior: "smooth" });
      salida.current = window.setTimeout(() => navigate("/admin/asesorias", { state: { aviso } }), 5000);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "No se pudo crear la cuenta.");
      setEnviando(false);
    }
  };

  if (verificando) {
    return <LifeLoading variant="private" />;
  }

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 5, md: 10 }} pt={{ base: 8, md: 12 }} pb={{ base: 10, md: 14 }}>
        <Box w="100%" maxW="560px">
          <Reveal direction="down" distance={16}>
            <Text color="white" fontSize={{ base: "2xl", md: "4xl" }} fontWeight="700" letterSpacing="0.08em"
                  textTransform="uppercase" lineHeight="1.15" textAlign="center"
                  textShadow="0 0 14px rgba(255,255,255,0.6), 0 0 30px rgba(180,255,245,0.3)">
              Crear usuario
            </Text>
            <Text color="rgba(255,255,255,0.78)" fontSize={{ base: "sm", md: "md" }} fontStyle="italic" textAlign="center" mt={2} mb={{ base: 6, md: 8 }}>
              Le llegará un correo para elegir su contraseña y activarla. Empieza sin nada abierto:
              se lo abres tú desde su ficha.
            </Text>
          </Reveal>

          {creada && (
            <Reveal direction="up" distance={18} duration={0.7}>
              <Box
                role="status"
                aria-live="polite"
                mb={6}
                px={{ base: 5, md: 8 }}
                py={{ base: 6, md: 7 }}
                borderRadius="28px"
                bg="rgba(255,255,255,0.14)"
                border="1px solid rgba(255,255,255,0.6)"
                boxShadow="0 0 30px rgba(255,255,255,0.28), 0 0 70px rgba(180,255,245,0.16)"
                textAlign="center"
              >
                <Flex justify="center" mb={3}>
                  <Flex align="center" justify="center" w="44px" h="44px" borderRadius="full" bg="white" color="#008080"
                        boxShadow="0 0 20px rgba(255,255,255,0.5)" aria-hidden>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12.5l4.5 4.5L19 7.5" />
                    </svg>
                  </Flex>
                </Flex>
                <Text color={creada.ok ? "white" : "#ffe7bd"} fontSize={{ base: "lg", md: "xl" }} fontWeight="600" lineHeight="1.6">
                  {creada.texto}
                </Text>
              </Box>
            </Reveal>
          )}

          <Reveal direction="up" distance={22} delay={0.3} display={creada ? "none" : undefined}>
            <Box
              as="form"
              onSubmit={crear}
              noValidate
              px={{ base: 5, md: 9 }}
              py={{ base: 6, md: 8 }}
              borderRadius="28px"
              bg="rgba(255,255,255,0.07)"
              border="1px solid rgba(255,255,255,0.3)"
              boxShadow="0 0 24px rgba(255,255,255,0.14), 0 0 60px rgba(180,255,245,0.08)"
            >
              {CAMPOS.map((c, i) => (
                <Box key={c.k} mb={5}>
                  <Text as="label" htmlFor={`crear-${c.k}`} display="block" color="rgba(255,255,255,0.8)"
                        fontSize="sm" letterSpacing="0.14em" textTransform="uppercase" fontWeight="600" mb={2}>
                    {c.etiqueta}
                  </Text>
                  <Input
                    id={`crear-${c.k}`}
                    type={c.tipo}
                    value={nuevo[c.k]}
                    onChange={(e) => {
                      const v = c.k === "fecha_nacimiento" ? mascaraDMA(e.target.value) : e.target.value;
                      setNuevo((n) => ({ ...n, [c.k]: v }));
                      setError(null);
                    }}
                    inputMode={c.k === "fecha_nacimiento" ? "numeric" : undefined}
                    autoComplete={c.auto}
                    autoFocus={i === 0}
                    placeholder={c.ayuda}
                    h="52px"
                    fontSize="lg"
                    bg="rgba(255,255,255,0.09)"
                    border="1px solid rgba(255,255,255,0.34)"
                    color="white"
                    borderRadius="full"
                    px={6}
                    fontFamily="'EB Garamond', serif"
                    _placeholder={{ color: "rgba(255,255,255,0.4)" }}
                    _hover={{ borderColor: "rgba(255,255,255,0.55)" }}
                    // El campo con el foco se ve claro con el tabulador: borde blanco y halo.
                    _focus={{ borderColor: "white", boxShadow: "0 0 0 2px rgba(255,255,255,0.55), 0 0 18px rgba(255,255,255,0.3)", bg: "rgba(255,255,255,0.13)", outline: "none" }}
                    _focusVisible={{ borderColor: "white", boxShadow: "0 0 0 2px rgba(255,255,255,0.55), 0 0 18px rgba(255,255,255,0.3)", outline: "none" }}
                  />
                </Box>
              ))}

              <Text color="rgba(255,255,255,0.8)" fontSize="sm" letterSpacing="0.14em" textTransform="uppercase" fontWeight="700" mt={7} mb={1}>
                Carta astral (opcional)
              </Text>
              <Text color="rgba(255,255,255,0.7)" fontSize="sm" fontStyle="italic" mb={5}>
                Con la fecha de arriba. Aunque no tenga Astrología abierta, le saldrá todo rellenado.
              </Text>
              {CAMPOS_CARTA.map((c) => (
                <Box key={c.k} mb={5}>
                  <Text as="label" htmlFor={`crear-${c.k}`} display="block" color="rgba(255,255,255,0.8)"
                        fontSize="sm" letterSpacing="0.14em" textTransform="uppercase" fontWeight="600" mb={2}>
                    {c.etiqueta}
                  </Text>
                  <Input
                    id={`crear-${c.k}`}
                    type="text"
                    value={nuevo[c.k]}
                    onChange={(e) => { setNuevo((n) => ({ ...n, [c.k]: e.target.value })); setError(null); }}
                    autoComplete="off"
                    placeholder={c.ayuda}
                    h="52px"
                    fontSize="lg"
                    bg="rgba(255,255,255,0.09)"
                    border="1px solid rgba(255,255,255,0.34)"
                    color="white"
                    borderRadius="full"
                    px={6}
                    fontFamily="'EB Garamond', serif"
                    _placeholder={{ color: "rgba(255,255,255,0.4)" }}
                    _hover={{ borderColor: "rgba(255,255,255,0.55)" }}
                    _focus={{ borderColor: "white", boxShadow: "0 0 0 2px rgba(255,255,255,0.55), 0 0 18px rgba(255,255,255,0.3)", bg: "rgba(255,255,255,0.13)", outline: "none" }}
                    _focusVisible={{ borderColor: "white", boxShadow: "0 0 0 2px rgba(255,255,255,0.55), 0 0 18px rgba(255,255,255,0.3)", outline: "none" }}
                  />
                </Box>
              ))}

              {error && (
                <Text role="alert" color="#ffe7bd" fontSize="md" fontStyle="italic" textAlign="center" mb={4}>
                  {error}
                </Text>
              )}

              <Flex justify="flex-end" align="center" gap={3} wrap="wrap" pt={2}>
                <Box
                  as="button"
                  type="submit"
                  disabled={enviando}
                  px={7}
                  py="10px"
                  borderRadius="full"
                  bg="white"
                  border="1.5px solid white"
                  color="#008080"
                  fontWeight="700"
                  fontSize="md"
                  cursor={enviando ? "wait" : "pointer"}
                  opacity={enviando ? 0.6 : 1}
                  boxShadow="0 0 22px rgba(255,255,255,0.3)"
                  transition="all 0.2s"
                  _hover={enviando ? undefined : { bg: "#e8fffc", transform: "translateY(-1px)" }}
                  _focusVisible={focoBlanco}
                >
                  {enviando ? "Creando…" : "Crear y mandar correo"}
                </Box>
              </Flex>
            </Box>
          </Reveal>
        </Box>
      </Flex>

      <SiteFooter />
    </Box>
  );
}
