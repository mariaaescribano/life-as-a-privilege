// ─────────────────────────────────────────────────────────────────────────────
// POPUP de una zona del cerebro (paso 7 de psicología).
//
// Al tocar una zona —en el dibujo, en la leyenda o en su barra— la ficha ya no
// se abre dentro de la página: sale en un popup con la FOTO de esa zona a la
// izquierda y su texto a la derecha, como el resto de fichas con ilustración
// del método. Por eso usa FichaFisioModal, que es el box común: no se duplica
// el markup, solo cambian los colores (los de psicología) y el contenido.
//
// Las flechas pasan de una zona a otra sin cerrar el popup.
// ─────────────────────────────────────────────────────────────────────────────
import React from "react";
import { Box, Text } from "@chakra-ui/react";
import { FichaFisioModal } from "./celulasUi";
import { useT } from "../../i18n";
import { neuropsicologiaBg, neuropsicologiaTxt } from "../../GlobalVariables";
import { ZONAS, zonaPorKey, type ZonaKey } from "./psicologiaCerebro";

const TINTA = neuropsicologiaTxt;
const PAPEL = "#fbf4e8";
const FONDO = "/img/fondos/psciologia.webp";
/** La misma sombra de la página: resplandor de papel, no mancha negra (el box
 *  de psicología es claro y la tinta oscura). */
const INK_SHADOW = `0 1px 2px ${PAPEL}, 0 0 6px ${PAPEL}, 0 0 13px ${neuropsicologiaBg}`;

/** Un apartado del texto: su antetítulo pequeño y su párrafo.
 *  Va en `span`s de bloque porque FichaFisioModal mete cada párrafo dentro de
 *  un <p>: un <div> ahí dentro sería HTML inválido. */
function Seccion({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <Box as="span" display="block">
      <Text as="span" display="block" color={TINTA} fontSize="2xs" fontWeight="700"
            letterSpacing="0.22em" textTransform="uppercase" opacity={0.7} mb={2}
            style={{ textShadow: INK_SHADOW }}>
        {titulo}
      </Text>
      <Text as="span" display="block" fontSize={{ base: "lg", md: "xl" }} lineHeight="1.7">
        {children}
      </Text>
    </Box>
  );
}

export function CerebroZonaModal({
  zonaKey,
  onZona,
  onClose,
}: {
  /** La zona abierta, o null si el popup está cerrado. */
  zonaKey: ZonaKey | null;
  /** Cambia la zona mostrada (lo usan las flechas). */
  onZona: (key: ZonaKey) => void;
  onClose: () => void;
}) {
  const t = useT();
  if (!zonaKey) return null;

  const zona = zonaPorKey(zonaKey);
  const idx = ZONAS.findIndex((z) => z.key === zona.key);
  const salta = (d: number) => onZona(ZONAS[(idx + d + ZONAS.length) % ZONAS.length].key);

  return (
    <FichaFisioModal
      foto={zona.foto}
      alt={zona.apodo}
      titulo={
        <>
          {zona.apodo}
          <Text as="span" display="block" fontSize={{ base: "md", md: "lg" }} fontWeight={500}
                fontStyle="italic" opacity={0.85} mt={1}>
            {zona.nombre}
          </Text>
        </>
      }
      parrafos={[
        <Seccion key="para" titulo={t("metodo.psico.cerebroParaQue")}>{zona.paraQueSirve}</Seccion>,
        <Seccion key="hizo" titulo={t("metodo.psico.cerebroQueLeHizo")}>{zona.queLeHizo}</Seccion>,
        <Seccion key="nota" titulo={t("metodo.psico.cerebroComoSeNota")}>
          {zona.comoSeNota.map((linea, i) => (
            <Box as="span" key={i} display="flex" alignItems="flex-start" gap={2.5} mb={2}>
              <Box as="span" flexShrink={0} mt="11px" w="6px" h="6px" borderRadius="full" bg={zona.color} />
              <Box as="span">{linea}</Box>
            </Box>
          ))}
        </Seccion>,
        <Seccion key="cambia" titulo={t("metodo.psico.cerebroLoQueLaCambia")}>{zona.loQueLaCambia}</Seccion>,
      ]}
      onClose={onClose}
      onPrev={() => salta(-1)}
      onNext={() => salta(1)}
      contador={`${idx + 1} / ${ZONAS.length}`}
      accent={zona.color}
      bgImage={FONDO}
      bgColor={neuropsicologiaBg}
      txtColor={TINTA}
      textShadow={INK_SHADOW}
      fotoFallback={
        <Text color={TINTA} fontWeight="800" fontSize={{ base: "4xl", md: "5xl" }}
              style={{ textShadow: INK_SHADOW }}>
          {zona.nombre}
        </Text>
      }
    />
  );
}

export default CerebroZonaModal;
