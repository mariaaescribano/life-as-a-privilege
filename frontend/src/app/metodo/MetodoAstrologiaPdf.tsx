// ─────────────────────────────────────────────────────────────────────────
// RECORRIDO · ASTROLOGÍA · paso 7: «Toda mi carta en PDF».
//
// Va después de Aspectos (cuando ya ha leído todo) y antes de la Llamada: aquí
// se lleva su lectura entera a un archivo — portada con su rueda dibujada,
// índice y una lectura por página. Ver components/metodo/pdf/pdfCartaAstral.ts.
//
// El PDF se monta EN EL NAVEGADOR: no hay que guardar nada en el servidor ni
// ocupar espacio por usuario, y cada quien se lo descarga cuando quiera con sus
// textos al día.
// ─────────────────────────────────────────────────────────────────────────
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex, Text } from "@chakra-ui/react";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { IndiceAstrologia } from "../../components/metodo/IndiceAstrologia";
import { RecorridoLoading } from "../../components/metodo/RecorridoLoading";
import { MetodoStepHeader, glowHeaderDisciplina } from "../../components/metodo/MetodoStepHeader";
import { SpaceBg, SPACE_IMG } from "../../components/metodo/SpaceBg";
import { useImagesReady } from "../../hooks/useImagesReady";
import { ComicAstrologiaModal } from "../../components/metodo/ComicAstrologiaModal";
import { Reveal } from "../../components/global/Reveal";
import { BotonCompania } from "../../components/global/BotonCompania";
import type { CartaNatal } from "../../components/metodo/CartaAstral3D/types";
import {
  generarPdfCarta,
  nombreArchivoPdf,
  resumenPdf,
  type DatosPdfCarta,
  type RetoPdf,
} from "../../components/metodo/pdf/pdfCartaAstral";
import { API_URL, astrologiaBg, astrologiaNom, astrologiaTxt, AstrologiaIcon } from "../../GlobalVariables";

const DescargaIcon = () => (
  <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" w="22px" h="22px" fill="currentColor"
       flexShrink={0} style={{ filter: "drop-shadow(0 0 6px rgba(255,255,255,0.5))" }}>
    <path d="M480-320 280-520l56-58 104 104v-326h80v326l104-104 56 58-200 200ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z" />
  </Box>
);

interface Row {
  link_carta?: string | null;
  aspectos_texto?: Record<string, string> | null;
  casas_texto?: Record<string, string> | null;
  retos?: RetoPdf[] | null;
  fecha_nacimiento?: string | null;
  hora_nacimiento?: string | null;
  lugar?: string | null;
  region?: string | null;
  pais?: string | null;
}

/** «1998-03-27» → «27 de marzo de 1998» (y si no es una fecha, se deja igual). */
const MESES = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];
function fechaBonita(iso?: string | null): string | null {
  if (!iso) return null;
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  if (!m) return iso;
  const mes = MESES[Number(m[2]) - 1] ?? m[2];
  return `${Number(m[3])} de ${mes} de ${m[1]}`;
}

export default function MetodoAstrologiaPdf() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [comicOpen, setComicOpen] = useState(false);
  const [carta, setCarta] = useState<CartaNatal | null>(null);
  const [row, setRow] = useState<Row | null>(null);
  const [generando, setGenerando] = useState(false);
  const [avance, setAvance] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [listo, setListo] = useState(false);

  const fotosListas = useImagesReady([SPACE_IMG]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (!userId || !token) { navigate("/welcome"); return; }

    (async () => {
      try {
        const cabeceras = { headers: { Authorization: `Bearer ${token}` } };
        const rowRes = await axios.get<Row | null>(`${API_URL}/metodo-astrologia/${userId}`, cabeceras);

        // Igual que el resto del recorrido: si la carta no está procesada
        // (ni PDF de María ni puntos clave), aquí no hay nada que descargar.
        const retos = Array.isArray(rowRes.data?.retos) ? rowRes.data!.retos! : [];
        if (!rowRes.data?.link_carta && retos.length === 0) {
          navigate("/metodo/astrologia");
          return;
        }
        setRow({ ...rowRes.data, retos });

        const cartaRes = await axios.get<CartaNatal | null>(
          `${API_URL}/metodo-astrologia/carta-natal/${userId}`,
          cabeceras,
        );
        setCarta(cartaRes.data ?? null);
      } catch {
        setError("No hemos podido leer tu carta. Prueba a recargar la página.");
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  const datos = useMemo<DatosPdfCarta | null>(() => {
    if (!carta) return null;
    const lugar = [row?.lugar, row?.region, row?.pais]
      .map((p) => (p ?? "").trim())
      .filter(Boolean)
      .join(", ");
    return {
      nombre: localStorage.getItem("name") ?? "",
      carta,
      retos: (row?.retos ?? []).filter((r) => r?.texto?.trim()),
      casasTexto: row?.casas_texto ?? {},
      aspectosTexto: row?.aspectos_texto ?? {},
      nacimiento: {
        fecha: fechaBonita(row?.fecha_nacimiento),
        hora: row?.hora_nacimiento ?? null,
        lugar: lugar || null,
      },
      imgFondo: SPACE_IMG,
    };
  }, [carta, row]);

  // Cuántas lecturas va a llevar, para decirlo ANTES de que le dé al botón.
  const resumen = useMemo(() => (datos ? resumenPdf(datos) : null), [datos]);

  const descargar = async () => {
    if (!datos || generando) return;
    setGenerando(true);
    setListo(false);
    setError(null);
    setAvance(0);
    try {
      const blob = await generarPdfCarta(datos, (hecho, total) =>
        setAvance(Math.round((hecho / total) * 100)),
      );
      // Descarga con un enlace temporal: nada llega al servidor.
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = nombreArchivoPdf(datos.nombre);
      document.body.appendChild(a);
      a.click();
      a.remove();
      // Se libera un rato después: si se revoca al instante, algún navegador
      // cancela la descarga a medias.
      setTimeout(() => URL.revokeObjectURL(url), 60_000);
      setListo(true);
    } catch (e) {
      console.error("[pdf carta]", e);
      setError("Algo se ha torcido montando el PDF. Vuelve a intentarlo.");
    } finally {
      setGenerando(false);
    }
  };

  if (loading || !fotosListas) return <RecorridoLoading />;

  const sinTextos = !!resumen && resumen.lecturas === 0;

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 12, md: 16 }}>
        <Flex direction="column" align="center" w="100%" maxW="850px" gap={6}>
          <Reveal direction="down" distance={16} duration={0.6} w="100%">
            <MetodoStepHeader
              icon={<AstrologiaIcon size={{ base: "40px", md: "52px" }} />}
              title="Tu carta en PDF"
              bgColor={`${astrologiaBg}dd`}
              color={astrologiaTxt}
              space
              step={{ current: 7, total: 9 }}
              mb={0}
              prev={{ label: "← Aspectos", onClick: () => navigate("/metodo/astrologia/aspectos") }}
              extra={{ label: "Ilustraciones", onClick: () => setComicOpen(true)}}
              next={{ label: "Llamada →", onClick: () => navigate("/metodo/astrologia/llamada") }}
            />
          </Reveal>

          <Reveal direction="up" distance={20} delay={0.12} duration={0.65} w="100%">
            <Text
              color={`${astrologiaTxt}ee`}
              fontSize={{ base: "md", md: "lg" }}
              fontStyle="italic"
              textAlign="center"
              lineHeight="1.8"
            >
              Tu lectura entera, en un archivo que ya es tuyo para siempre.
            </Text>
          </Reveal>

          <Reveal direction="up" distance={34} scaleFrom={0.97} delay={0.24} duration={0.75} w="100%">
            {/* Sin línea de borde: la caja se sostiene con el MISMO halo que el
                header de la página (glowHeaderDisciplina), no con una sombra propia. */}
            <Box position="relative" borderRadius="2xl" overflow="hidden" w="100%"
                 boxShadow={glowHeaderDisciplina(astrologiaTxt)}>
              <SpaceBg />
              <Flex position="relative" zIndex={1} direction="column" align="center" gap={5}
                    px={{ base: 5, md: 10 }} py={{ base: 8, md: 10 }} textAlign="center">
                <Text color={astrologiaTxt} fontSize={{ base: "xl", md: "2xl" }} fontWeight="700"
                      letterSpacing="0.04em" style={{ textShadow: `0 0 14px ${astrologiaTxt}55` }}>
                  Toda tu carta, página a página
                </Text>

                {sinTextos ? (
                  <Text color="#ffd9a0" fontSize="sm" fontStyle="italic" maxW="560px">
                    Tu carta todavía no tiene lecturas escritas. En cuanto estén, aquí podrás
                    descargarla completa.
                  </Text>
                ) : (
                  <Flex
                    as="button"
                    onClick={generando ? undefined : descargar}
                    align="center"
                    justify="center"
                    gap={3}
                    px={{ base: 7, md: 10 }}
                    py={{ base: "13px", md: "15px" }}
                    borderRadius="full"
                    border={`1.5px solid ${astrologiaTxt}`}
                    bg={`${astrologiaTxt}1f`}
                    color={astrologiaTxt}
                    cursor={generando ? "wait" : "pointer"}
                    opacity={generando ? 0.75 : 1}
                    boxShadow={`0 0 18px ${astrologiaTxt}44, 0 0 44px ${astrologiaTxt}22`}
                    _hover={generando ? {} : {
                      bg: `${astrologiaTxt}33`,
                      boxShadow: `0 0 26px ${astrologiaTxt}66, 0 0 60px ${astrologiaTxt}33`,
                      transform: "translateY(-1px)",
                    }}
                    transition="all 0.25s ease"
                  >
                    <DescargaIcon />
                    <Text fontWeight="700" fontSize={{ base: "sm", md: "md" }} letterSpacing="0.1em"
                          textTransform="uppercase">
                      {generando ? `Montando tu PDF… ${avance}%` : "Descargar toda mi carta en PDF"}
                    </Text>
                  </Flex>
                )}

                {generando && (
                  <Box w="100%" maxW="360px" h="4px" borderRadius="full" bg={`${astrologiaTxt}22`} overflow="hidden">
                    <Box h="100%" w={`${avance}%`} bg={astrologiaTxt} transition="width 0.25s ease"
                         boxShadow={`0 0 10px ${astrologiaTxt}`} />
                  </Box>
                )}

                {listo && !generando && (
                  <Text color={astrologiaTxt} fontSize="sm" fontStyle="italic">
                    Descargado. Si no lo ves, mira en la carpeta de descargas de tu navegador.
                  </Text>
                )}

                {error && (
                  <Text color="#ffb3b3" fontSize="sm" fontStyle="italic">
                    {error}
                  </Text>
                )}

                <Text color={`${astrologiaTxt}99`} fontSize="xs" fontStyle="italic" maxW="560px">
                  Se monta en tu propio dispositivo, así que puede tardar unos segundos y
                  conviene no cerrar la página mientras avanza.
                </Text>
              </Flex>
            </Box>
          </Reveal>
        </Flex>
      </Flex>

      <BotonCompania color={astrologiaTxt} bgColor={astrologiaBg} disciplinaNom={astrologiaNom} precio={20}
                     llamadaTitulo="Reserva tu llamada de astrología" />
      <IndiceAstrologia />
      <ComicAstrologiaModal isOpen={comicOpen} onClose={() => setComicOpen(false)} />
      <SiteFooter />
    </Box>
  );
}
