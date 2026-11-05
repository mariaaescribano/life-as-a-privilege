import React, { useEffect, useState } from "react";
import { Box, Flex, Input, Select, Text } from "@chakra-ui/react";
import axios from "axios";
import { useT } from "../../i18n";
import { glowHeader } from "./FotoBox";
import { SpaceBg } from "./SpaceBg";
import { Reveal, RevealStagger, RevealItem } from "../global/Reveal";
import { useLockBodyScroll } from "../../hooks/useLockBodyScroll";
import { API_URL, astrologiaTxt } from "../../GlobalVariables";

export interface EstadoNacimiento {
  fecha_nacimiento?: string | null;
  hora_nacimiento?: string | null;
  pais?: string | null;
  lugar?: string | null;
  region?: string | null;
  solicitud_enviada_at?: string | null;
}

const MESES = [
  { num: "01", nombre: "Enero" }, { num: "02", nombre: "Febrero" }, { num: "03", nombre: "Marzo" },
  { num: "04", nombre: "Abril" }, { num: "05", nombre: "Mayo" }, { num: "06", nombre: "Junio" },
  { num: "07", nombre: "Julio" }, { num: "08", nombre: "Agosto" }, { num: "09", nombre: "Septiembre" },
  { num: "10", nombre: "Octubre" }, { num: "11", nombre: "Noviembre" }, { num: "12", nombre: "Diciembre" },
];

/**
 * El formulario de los datos de nacimiento (caja + popup de «¿seguro?»). Al confirmar manda la
 * solicitud (el servidor calcula la carta y avisa a María por email) y llama a `onEnviado` con
 * el estado ya guardado. Sirve para la primera vez y para corregir (`editando`).
 */
export function FormularioNacimiento({
  estado, editando = false, sinTitulo = false, onCancelar, onEnviado,
}: {
  estado: EstadoNacimiento | null;
  editando?: boolean;
  /** Sin el título y la frase de arriba (la página ya pone su propia presentación). */
  sinTitulo?: boolean;
  onCancelar?: () => void;
  onEnviado: (estado: EstadoNacimiento) => void;
}) {
  const t = useT();
  const [dia, setDia] = useState("");
  const [mes, setMes] = useState("");
  const [anio, setAnio] = useState("");
  const [hora, setHora] = useState("");
  const [pais, setPais] = useState("");
  const [lugar, setLugar] = useState("");
  const [region, setRegion] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [popupError, setPopupError] = useState<string | null>(null);
  useLockBodyScroll(confirmOpen);

  // Con datos ya guardados (corregir), el formulario sale rellenado.
  useEffect(() => {
    if (!estado) return;
    const [a, m, d] = (estado.fecha_nacimiento ?? "").slice(0, 10).split("-");
    if (a && m && d) { setAnio(a); setMes(m); setDia(String(parseInt(d, 10))); }
    if (estado.hora_nacimiento) setHora(estado.hora_nacimiento.slice(0, 5));
    if (estado.pais) setPais(estado.pais);
    if (estado.lugar) setLugar(estado.lugar);
    if (estado.region) setRegion(estado.region);
  }, [estado]);

  const camposCompletos = !!dia && !!mes && !!anio && !!hora && !!pais.trim() && !!lugar.trim() && !!region.trim();

  const validarFecha = (): string | null => {
    setError(null);
    if (!camposCompletos) { setError("Rellena todos los campos para continuar."); return null; }
    const diaN = parseInt(dia, 10), mesN = parseInt(mes, 10), anioN = parseInt(anio, 10);
    if (!Number.isFinite(diaN) || diaN < 1 || diaN > 31) { setError("Día inválido (1-31)."); return null; }
    if (!Number.isFinite(mesN) || mesN < 1 || mesN > 12) { setError("Mes inválido."); return null; }
    if (!Number.isFinite(anioN) || anioN < 1900 || anioN > 2100) { setError("Año inválido (1900-2100)."); return null; }
    return `${anioN.toString().padStart(4, "0")}-${mesN.toString().padStart(2, "0")}-${diaN.toString().padStart(2, "0")}`;
  };

  const abrirConfirmacion = () => {
    if (!validarFecha()) return;
    setPopupError(null);
    setConfirmOpen(true);
  };

  const confirmarEnvio = async () => {
    const fecha = validarFecha();
    if (!fecha) { setConfirmOpen(false); return; }
    const userId = localStorage.getItem("userId");
    if (!userId) return;
    setEnviando(true);
    setPopupError(null);
    try {
      const r = await axios.post(`${API_URL}/metodo-astrologia/solicitud/${userId}`, {
        fecha_nacimiento: fecha, hora_nacimiento: hora,
        pais: pais.trim(), lugar: lugar.trim(), region: region.trim(),
      });
      if (r.data?.success === false) { setPopupError("No se pudo guardar. Inténtalo de nuevo."); return; }
      const e = await axios.get<EstadoNacimiento>(`${API_URL}/metodo-astrologia/${userId}`);
      setConfirmOpen(false);
      if (r.data?.cartaCalculada === false) {
        // Se guardó y se avisó, pero ese lugar no se encuentra: sin carta que pintar.
        setError("No he encontrado ese lugar. Revisa el lugar, la región y el país y vuelve a enviarlos.");
        return;
      }
      onEnviado(e.data ?? {});
    } catch (err: any) {
      const status = err?.response?.status;
      const msg = err?.response?.data?.message || err?.message || "Error desconocido";
      setPopupError(`No se pudo enviar (${status || "?"}): ${msg}`);
    } finally {
      setEnviando(false);
    }
  };

  const fechaLegible = dia && mes && anio
    ? `${parseInt(dia, 10)} de ${MESES.find((m) => m.num === mes.padStart(2, "0"))?.nombre.toLowerCase() ?? mes} de ${anio}`
    : "";
  const lugarLegible = [lugar.trim(), region.trim(), pais.trim()].filter(Boolean).join(", ");

  return (
    <>
      <Reveal
        direction="up"
        distance={34}
        scaleFrom={0.97}
        delay={0.12}
        duration={0.75}
        position="relative"
        w="100%"
        borderRadius="2xl"
        overflow="hidden"
        boxShadow={glowHeader(astrologiaTxt)}
      >
        <SpaceBg overlay="rgba(8,13,30,0.28)" />

        <Box position="relative" zIndex={1} px={{ base: 6, md: 10 }} py={{ base: 8, md: 10 }}>
          <RevealStagger display="flex" flexDirection="column" gap={5} stagger={0.09} delayChildren={0.35}>
            {!sinTitulo && (
              <>
                <RevealItem>
                  {/* Sin textShadow: el brillo sobre el velo del cielo ensuciaba la letra. */}
                  <Text color={astrologiaTxt} fontSize={{ base: "2xl", md: "3xl" }} fontWeight="700" letterSpacing="0.04em" textAlign="center">
                    {editando ? "Corrige tus datos" : "Tu Carta Astral"}
                  </Text>
                </RevealItem>
                <RevealItem>
                  <Text color={`${astrologiaTxt}dd`} fontSize={{ base: "md", md: "lg" }} lineHeight="1.75" textAlign="center" maxW="600px" mx="auto">
                    {editando
                      ? "Cambia lo que haga falta y vuelve a enviarlos: tu carta se calcula de nuevo con los datos corregidos."
                      : "Necesito tus datos de nacimiento para poder leer tu carta."}
                  </Text>
                </RevealItem>
                <RevealItem>
                  <Box h="1px" my={2} bgGradient={`linear(to-r, transparent, ${astrologiaTxt}55, transparent)`} />
                </RevealItem>
              </>
            )}
            <RevealItem>
              <Text color={`${astrologiaTxt}aa`} fontSize="xs" letterSpacing="0.14em" mb={1.5} fontWeight="600" textTransform="uppercase">
                {t("metodo.astro.fechaNacimiento")}
              </Text>
              <Flex gap={3}>
                <Box flex="1">
                  <Input
                    type="number"
                    inputMode="numeric"
                    min={1}
                    max={31}
                    value={dia}
                    onChange={(e) => setDia(e.target.value)}
                    placeholder={t("metodo.astro.dia")}
                    bg="rgba(8,13,30,0.55)"
                    border={`1px solid ${astrologiaTxt}44`}
                    color={astrologiaTxt}
                    borderRadius="lg"
                    size="md"
                    fontFamily="'EB Garamond', serif"
                    _placeholder={{ color: `${astrologiaTxt}55` }}
                    _hover={{ borderColor: `${astrologiaTxt}88` }}
                    _focus={{
                      borderColor: astrologiaTxt,
                      boxShadow: `0 0 0 1px ${astrologiaTxt}55, 0 0 14px ${astrologiaTxt}33`,
                      bg: "rgba(8,13,30,0.7)",
                    }}
                  />
                </Box>
                <Box flex="1.6">
                  <Select
                    value={mes}
                    onChange={(e) => setMes(e.target.value)}
                    placeholder={t("metodo.astro.mes")}
                    bg="rgba(8,13,30,0.55)"
                    border={`1px solid ${astrologiaTxt}44`}
                    color={astrologiaTxt}
                    borderRadius="lg"
                    size="md"
                    fontFamily="'EB Garamond', serif"
                    sx={{
                      "> option": { background: "#0c1230", color: astrologiaTxt },
                    }}
                    _hover={{ borderColor: `${astrologiaTxt}88` }}
                    _focus={{
                      borderColor: astrologiaTxt,
                      boxShadow: `0 0 0 1px ${astrologiaTxt}55, 0 0 14px ${astrologiaTxt}33`,
                      bg: "rgba(8,13,30,0.7)",
                    }}
                  >
                    {MESES.map((m) => (
                      <option key={m.num} value={m.num}>{m.nombre}</option>
                    ))}
                  </Select>
                </Box>
                <Box flex="1">
                  <Input
                    type="number"
                    inputMode="numeric"
                    min={1900}
                    max={2100}
                    value={anio}
                    onChange={(e) => setAnio(e.target.value)}
                    placeholder={t("metodo.astro.anio")}
                    bg="rgba(8,13,30,0.55)"
                    border={`1px solid ${astrologiaTxt}44`}
                    color={astrologiaTxt}
                    borderRadius="lg"
                    size="md"
                    fontFamily="'EB Garamond', serif"
                    _placeholder={{ color: `${astrologiaTxt}55` }}
                    _hover={{ borderColor: `${astrologiaTxt}88` }}
                    _focus={{
                      borderColor: astrologiaTxt,
                      boxShadow: `0 0 0 1px ${astrologiaTxt}55, 0 0 14px ${astrologiaTxt}33`,
                      bg: "rgba(8,13,30,0.7)",
                    }}
                  />
                </Box>
              </Flex>
              {dia && mes && anio && (
                <Text color={`${astrologiaTxt}aa`} fontSize="xs" mt={2} fontStyle="italic" letterSpacing="0.04em">
                  {dia} de {MESES.find((m) => m.num === mes)?.nombre.toLowerCase()} de {anio}
                </Text>
              )}
            </RevealItem>

            <RevealItem>
              <Text color={`${astrologiaTxt}aa`} fontSize="xs" letterSpacing="0.14em" mb={1.5} fontWeight="600" textTransform="uppercase">
                {t("metodo.astro.horaNacimiento")}
              </Text>
              <Input
                type="time"
                value={hora}
                onChange={(e) => setHora(e.target.value)}
                bg="rgba(8,13,30,0.55)"
                border={`1px solid ${astrologiaTxt}44`}
                color={astrologiaTxt}
                borderRadius="lg"
                size="md"
                fontFamily="'EB Garamond', serif"
                _hover={{ borderColor: `${astrologiaTxt}88` }}
                _focus={{
                  borderColor: astrologiaTxt,
                  boxShadow: `0 0 0 1px ${astrologiaTxt}55, 0 0 14px ${astrologiaTxt}33`,
                  bg: "rgba(8,13,30,0.7)",
                }}
                sx={{
                  "::-webkit-calendar-picker-indicator": { filter: "invert(0.9)" },
                }}
              />
            </RevealItem>
            <RevealItem>
              <Campo label={t("metodo.astro.pais")} value={pais} onChange={setPais} color={astrologiaTxt} placeholder={t("metodo.astro.paisEj")} />
            </RevealItem>
            <RevealItem display="flex" flexDirection={{ base: "column", md: "row" }} gap={4}>
              <Campo label={t("metodo.astro.lugar")} value={lugar} onChange={setLugar} color={astrologiaTxt} placeholder={t("metodo.astro.lugarEj")} />
              <Campo label={t("metodo.astro.region")} value={region} onChange={setRegion} color={astrologiaTxt} placeholder={t("metodo.astro.regionEj")} />
            </RevealItem>

            {error && (
              <Text color="#ffb8b8" fontSize="sm" textAlign="center" fontStyle="italic">{error}</Text>
            )}

            <RevealItem display="flex" justifyContent="flex-end" alignItems="center" gap={3} mt={4}>
              {editando && (
                <Box
                  as="button"
                  onClick={() => { setError(null); onCancelar?.(); }}
                  px={{ base: 6, md: 7 }}
                  py={{ base: 3, md: 3.5 }}
                  borderRadius="full"
                  bg="transparent"
                  color={`${astrologiaTxt}cc`}
                  border={`1px solid ${astrologiaTxt}55`}
                  fontFamily="'EB Garamond', serif"
                  fontSize={{ base: "md", md: "lg" }}
                  fontWeight="600"
                  letterSpacing="0.06em"
                  cursor="pointer"
                  transition="all 0.22s"
                  _hover={{ borderColor: astrologiaTxt, color: astrologiaTxt }}
                >
                  {t("comun.cancelar")}
                </Box>
              )}
              <Box
                as="button"
                onClick={() => { if (camposCompletos) abrirConfirmacion(); }}
                disabled={!camposCompletos}
                px={{ base: 7, md: 9 }}
                py={{ base: 3, md: 3.5 }}
                borderRadius="full"
                bg={camposCompletos ? astrologiaTxt : `${astrologiaTxt}33`}
                color={camposCompletos ? "#0a0a1a" : `${astrologiaTxt}aa`}
                border={`1px solid ${astrologiaTxt}88`}
                fontFamily="'EB Garamond', serif"
                fontSize={{ base: "md", md: "lg" }}
                fontWeight="700"
                letterSpacing="0.08em"
                cursor={camposCompletos ? "pointer" : "not-allowed"}
                opacity={camposCompletos ? 1 : 0.6}
                boxShadow={camposCompletos
                  ? `0 0 18px ${astrologiaTxt}66, 0 0 38px ${astrologiaTxt}33`
                  : "none"}
                transition="all 0.22s"
                _hover={camposCompletos ? {
                  transform: "translateY(-2px)",
                  boxShadow: `0 0 28px ${astrologiaTxt}88, 0 0 58px ${astrologiaTxt}44`,
                } : {}}
              >
                {editando ? "Guardar" : "Recibir mi lectura"}
              </Box>
            </RevealItem>
          </RevealStagger>
        </Box>
      </Reveal>

    {confirmOpen && (
      <Box
        position="fixed" inset={0} zIndex={500}
        display="flex" alignItems="center" justifyContent="center"
        px={{ base: 4, md: 10 }} py={{ base: 6, md: 10 }}
        bg="rgba(0,0,0,0.82)"
        sx={{ backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)" }}
        onClick={() => { if (!enviando) setConfirmOpen(false); }}
      >
        <Box
          onClick={(e: React.MouseEvent) => e.stopPropagation()}
          position="relative" w="100%" maxW="480px"
          maxH={{ base: "calc(100vh - 48px)", md: "calc(100vh - 80px)" }}
          borderRadius="2xl" overflow="hidden"
          border={`1px solid ${astrologiaTxt}66`}
          boxShadow={`0 0 32px ${astrologiaTxt}55, 0 0 80px ${astrologiaTxt}28, 0 12px 60px rgba(0,0,0,0.6)`}
          display="flex" flexDirection="column"
        >
          <SpaceBg overlay="rgba(8,13,30,0.38)" />

          <Box position="relative" zIndex={1} px={{ base: 6, md: 9 }} py={{ base: 8, md: 9 }}>
            <Flex direction="column" align="center" gap={5}>
              <Text color={astrologiaTxt} fontSize={{ base: "xl", md: "2xl" }} fontWeight="700" textAlign="center"
                    letterSpacing="0.03em" style={{ textShadow: `0 0 14px ${astrologiaTxt}66` }}>
                {t("metodo.astro.seguroDatos")}
              </Text>

              <Flex direction="column" align="center" gap={2} w="100%"
                    bg="rgba(8,13,30,0.5)" borderRadius="xl" border={`1px solid ${astrologiaTxt}33`} px={5} py={5}>
                <Text color={astrologiaTxt} fontSize={{ base: "lg", md: "xl" }} fontWeight="600" textAlign="center">
                  {fechaLegible}{hora ? ` · ${hora}` : ""}
                </Text>
                <Text color={`${astrologiaTxt}cc`} fontSize={{ base: "sm", md: "md" }} textAlign="center">
                  {lugarLegible}
                </Text>
              </Flex>

              {popupError && (
                <Text color="#ffb8b8" fontSize="sm" textAlign="center" fontStyle="italic">{popupError}</Text>
              )}

              <Flex gap={3} mt={1} w="100%" justify="center" wrap="wrap">
                <Box as="button" onClick={() => { if (!enviando) setConfirmOpen(false); }}
                     px={6} py={2.5} borderRadius="full" bg="transparent" color={`${astrologiaTxt}cc`}
                     border={`1px solid ${astrologiaTxt}55`} fontFamily="'EB Garamond', serif" fontWeight="600"
                     cursor={enviando ? "not-allowed" : "pointer"} opacity={enviando ? 0.5 : 1}
                     _hover={enviando ? {} : { borderColor: astrologiaTxt, color: astrologiaTxt }}>
                  {t("metodo.astro.volverRevisar")}
                </Box>
                <Box as="button" onClick={() => { if (!enviando) void confirmarEnvio(); }}
                     px={7} py={2.5} borderRadius="full" bg={astrologiaTxt} color="#0a0a1a"
                     border={`1px solid ${astrologiaTxt}88`} fontFamily="'EB Garamond', serif" fontWeight="700"
                     letterSpacing="0.06em" cursor={enviando ? "wait" : "pointer"} opacity={enviando ? 0.7 : 1}
                     boxShadow={`0 0 18px ${astrologiaTxt}66`}
                     _hover={enviando ? {} : { boxShadow: `0 0 28px ${astrologiaTxt}88`, transform: "translateY(-1px)" }}
                     transition="all 0.2s">
                  {enviando ? "Enviando…" : editando ? "Sí, actualizar" : "Sí, confirmar"}
                </Box>
              </Flex>
            </Flex>
          </Box>
        </Box>
      </Box>
    )}

    </>
  );
}

const Campo = ({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  color,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  color: string;
}) => (
  <Box flex="1">
    <Text color={`${color}aa`} fontSize="xs" letterSpacing="0.14em" mb={1.5} fontWeight="600" textTransform="uppercase">
      {label}
    </Text>
    <Input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      bg="rgba(8,13,30,0.55)"
      border={`1px solid ${color}44`}
      color={color}
      borderRadius="lg"
      size="md"
      fontFamily="'EB Garamond', serif"
      _placeholder={{ color: `${color}55` }}
      _hover={{ borderColor: `${color}88` }}
      _focus={{
        borderColor: color,
        boxShadow: `0 0 0 1px ${color}55, 0 0 14px ${color}33`,
        bg: "rgba(8,13,30,0.7)",
      }}
      sx={{
        // Iconos de date/time visibles sobre fondo oscuro
        "::-webkit-calendar-picker-indicator": { filter: "invert(0.9)" },
      }}
    />
  </Box>
);

