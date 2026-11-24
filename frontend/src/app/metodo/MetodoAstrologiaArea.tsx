import React, { useEffect, useState } from "react";
import axios from "axios";
import { Navigate, useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Box, Flex } from "@chakra-ui/react";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { AREAS_TEXTO, AREAS_TOTAL, pasoDeArea, rutaArea, tituloArea } from "../../components/metodo/astrologiaAreas";
import { useAstrologiaProgreso } from "../../hooks/useAstrologiaProgreso";
import { esMariaMirando } from "../../api/persona";
import { ASTROLOGIA_TOTAL } from "../../components/metodo/astrologiaRecorrido";
import { Reveal } from "../../components/global/Reveal";
import { AstrologiaLoading } from "../../components/metodo/comicLoaders";
import { AreaCasa } from "../../components/metodo/AreaCasa";
import { API_URL, astrologiaBg, astrologiaTxt, AstrologiaIcon } from "../../GlobalVariables";
import { useIdioma } from "../../i18n";

/**
 * Una ÁREA del camino de Astrología (ÁREA 1 … ÁREA 12, una por casa). De arriba abajo: la cabecera de la
 * disciplina, la barra de progreso (n de 12), una raya y la caja de texto con scroll vertical.
 * Progreso y rayas, SIEMPRE en turquesa oscuro. El texto de cada área se escribe en `astrologiaAreas.ts`.
 */
export default function MetodoAstrologiaArea() {
  const { t, segunIdioma } = useIdioma();
  const navigate = useNavigate();
  const { n: nParam } = useParams<{ n: string }>();
  const [params] = useSearchParams();
  // «Hacia atrás» desde la ilustración de la siguiente Área se llega aquí sin abrir la ilustración de ésta.
  const sinComicAlEntrar = !!(useLocation().state as { sinComic?: boolean } | null)?.sinComic;
  // El «←» del header, estando en la lectura, vuelve a la ilustración de ESTA Área (no salta de página).
  const [reabrir, setReabrir] = useState(0);
  const n = Number(nParam);
  const valida = Number.isInteger(n) && n >= 1 && n <= AREAS_TOTAL;

  useEffect(() => { window.scrollTo({ top: 0, behavior: "auto" }); }, [n]);

  // El texto de ESTA persona para cada área (lo escribe María en el editor de su carta, `data.areas`). null = aún leyéndose.
  // Con el cómic de entrada abierto no se enseña el pie (si no, asoma antes que el contenido).
  const [comicAbierto, setComicAbierto] = useState(true);
  const [propios, setPropios] = useState<Record<string, string> | null>(null);
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) { setPropios({}); return; }
    let vivo = true;
    axios.get<{ data?: { areas?: Record<string, string> } } | null>(`${API_URL}/metodo-astrologia/${userId}`)
      .then((r) => { if (vivo) setPropios(r.data?.data?.areas && typeof r.data.data.areas === "object" ? r.data.data.areas : {}); })
      .catch(() => { if (vivo) setPropios({}); });
    return () => { vivo = false; };
  }, []);
  if (!valida) return <Navigate to={rutaArea(1)} replace />;

  const global = AREAS_TEXTO[n] ? segunIdioma({ es: AREAS_TEXTO[n].es, en: AREAS_TEXTO[n].en }) : "";
  const propio = typeof propios?.[String(n)] === "string" ? propios[String(n)].trim() : "";
  const texto = propio || global;
  const titulo = tituloArea(n);
  const { bloqueada, cargado } = useAstrologiaProgreso();

  // Mientras se lee el texto de esta persona, solo el loader (nunca la página a medias con el pie a la vista).
  if (propios === null) return <AstrologiaLoading />;

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#F0DCC0" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 20, md: 28 }}>
        <Flex direction="column" align="center" w="100%" maxW="850px" gap={{ base: 6, md: 8 }}>
          <Reveal direction="down" distance={16} duration={0.6} w="100%">
            <MetodoStepHeader
              icon={<AstrologiaIcon size={{ base: "40px", md: "52px" }} />}
              title={titulo}
              bgColor={`${astrologiaBg}dd`}
              color={astrologiaTxt}
              space
              step={{ current: pasoDeArea(n), total: ASTROLOGIA_TOTAL }}
              mb={0}
              prev={n > 1
                ? { label: `← ${tituloArea(n - 1)}`, onClick: () => setReabrir((x) => x + 1) }
                : { label: `← ${t("metodo.astro.paso.introduccion")}`, onClick: () => setReabrir((x) => x + 1) }}
              next={{
                label: `${n < AREAS_TOTAL ? tituloArea(n + 1) : t("metodo.astro.paso.pdf")} →`,
                onClick: () => navigate(n < AREAS_TOTAL ? rutaArea(n + 1) : "/metodo/astrologia/pdf"),
                disabled: !esMariaMirando() && cargado && bloqueada(pasoDeArea(n) + 1),
              }}
            />
          </Reveal>

          {/* Las doce áreas, con la misma presentación (AreaCasa): bajo el header la fila de planetas de la casa; después
              la barra de progreso y la raya; y el texto grande y por pasos, sin scroll. `?demo` rellena con texto y
              planetas de ejemplo para ver el diseño sin tener nada escrito. */}
          <AreaCasa
            n={n} texto={texto} pendiente={t("metodo.astro.area.pendiente")} demo={params.has("demo")} cargandoTexto={propios === null} alCambiarComic={setComicAbierto} sinComicAlEntrar={sinComicAlEntrar} reabrirComic={reabrir}
          />
        </Flex>
      </Flex>

      {!comicAbierto && <SiteFooter />}
    </Box>
  );
}
