import React, { useEffect, useState } from "react";
import { Box, Flex, Grid, Text, type FlexProps } from "@chakra-ui/react";
import { Reveal, RevealItem, RevealStagger } from "../global/Reveal";
import { RecorridoVideosMuestra } from "../global/MandalaRecorrido";
import { useT, TextoRico, type ClaveTexto } from "../../i18n";
import { PrecioConAntes } from "./PrecioConAntes";
import {
  NUM_DISCIPLINAS,
  PRECIO_DISCIPLINA,
  PRECIO_DISCIPLINA_ANTES_EUR,
  PRECIO_MAPA_COMPLETO,
} from "./pagoDisciplinaLink";

/* ─────────────────────────────────────────────────────────────────────────────
 *  BLOQUES DE VENTA DE /elMetodo
 *
 *  La página era una descripción larguísima de qué hay dentro: preciosa, pero
 *  sin una sola frase que le hablase a quien todavía no ha comprado. Estos son
 *  los bloques que faltaban, en el orden en el que se leen:
 *
 *    2. El espejo        — que se reconozca antes de contarle nada.
 *    3. La frase        — lo que diferencia esto de un curso, en una línea.
 *    8. El precio        — a la vista; escondido era «esto debe de ser caro».
 *   10. Por dónde empiezo — ocho puertas iguales paralizan; hay que señalar una.
 *   12. Preguntas        — las objeciones, contestadas de frente.
 *   13. Barra fija       — en móvil, el botón siempre a mano.
 *
 *  Faltan números a propósito: el 4 (los entregables) y el 9 (una garantía de
 *  devolución) estuvieron aquí y se han retirado. La numeración es la del orden
 *  de lectura de la página, no un inventario.
 *
 *  Los textos NO están aquí: viven en i18n/textos/es/elMetodo.ts (con su espejo
 *  inglés), como el resto de la página.
 * ───────────────────────────────────────────────────────────────────────────── */

// ── Piezas compartidas ──────────────────────────────────────────────────────

/**
 * El vidrio de la página: el MISMO material que la caja de «Qué obtienes», para
 * que todos los bloques nuevos pesen igual que los que ya estaban.
 *
 * Las props van ENUMERADAS a mano y NO como `FlexProps` entero, y entre ellas
 * no está `as`: las props de Chakra son una unión gigantesca y, en cuanto se le
 * pasa un `as` que no conoce de antemano, la compilación revienta con «union
 * type too complex to represent». Si algo de dentro tiene que ser un <button>,
 * se pone el botón DENTRO de la caja (es lo que hace el desplegable de las
 * preguntas), no se convierte la caja en botón.
 */
type CajaCristalProps = { children?: React.ReactNode } & Pick<
  FlexProps,
  | "w" | "maxW" | "h" | "mx" | "mt" | "px" | "py" | "pr"
  | "gap" | "align" | "textAlign" | "border" | "borderColor" | "boxShadow" | "transition" | "_hover"
>;

function CajaCristal(props: CajaCristalProps) {
  return (
    <Flex
      direction="column"
      w="100%"
      borderRadius="2xl"
      border="1px solid rgba(255,255,255,0.28)"
      bg="rgba(255,255,255,0.07)"
      sx={{ backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)" }}
      boxShadow="0 4px 20px rgba(0,0,0,0.14), 0 0 24px rgba(180,255,245,0.10)"
      {...props}
    />
  );
}

/** Título de sección + su rayita corta. Igual que el de «Qué obtienes». */
function TituloBloque({
  children,
  sub,
  sinRaya,
}: {
  children: React.ReactNode;
  sub?: React.ReactNode;
  /** Sin la rayita entre el título y la frase. La lleva por defecto —es la que
   *  separa el titular de su bajada en el resto de bloques—, pero «El Mapa por
   *  dentro» va precedido de una cesura horizontal a media pantalla, y las dos
   *  líneas tan seguidas se leían como un tropiezo. */
  sinRaya?: boolean;
}) {
  return (
    <Flex direction="column" align="center" gap={{ base: 3, md: 4 }} textAlign="center">
      <Text
        color="white"
        fontWeight="700"
        fontSize={{ base: "2xl", md: "4xl" }}
        letterSpacing="0.03em"
        lineHeight="1.25"
        textShadow="0 0 12px rgba(255,255,255,0.4), 0 0 26px rgba(180,255,245,0.18)"
      >
        {children}
      </Text>
      {!sinRaya && <Box w={{ base: "70px", md: "90px" }} h="1px" bg="rgba(255,255,255,0.35)" />}
      {sub && (
        <Text
          color="rgba(255,255,255,0.88)"
          fontSize={{ base: "sm", md: "lg" }}
          fontStyle="italic"
          lineHeight="1.65"
          maxW="680px"
        >
          {sub}
        </Text>
      )}
    </Flex>
  );
}

// ── 2. EL ESPEJO ────────────────────────────────────────────────────────────
// Cuatro frases sueltas sobre el turquesa, sin caja: no son «contenido», son la
// voz de quien está leyendo. Entran una detrás de otra, con calma, para que se
// lean de una en una y no como una lista.

const ESPEJO: ClaveTexto[] = [
  "elMetodo.espejo.1",
  "elMetodo.espejo.2",
  "elMetodo.espejo.3",
  "elMetodo.espejo.4",
];

export function EspejoBloque() {
  const t = useT();
  return (
    <Flex direction="column" align="center" w="100%" maxW="760px" mx="auto" textAlign="center">
      <RevealStagger
        inView
        stagger={0.22}
        display="flex"
        flexDirection="column"
        alignItems="center"
        gap={{ base: 5, md: 7 }}
        w="100%"
      >
        {ESPEJO.map((clave, i) => (
          <RevealItem key={clave} direction="up" distance={16}>
            <Text
              color="white"
              fontSize={{ base: "lg", md: "2xl" }}
              lineHeight="1.5"
              letterSpacing="0.015em"
              // La cuarta es la que gira la pregunta: va en cursiva y con más
              // peso, para que se note que ahí se ha llegado a algún sitio.
              fontStyle={i === ESPEJO.length - 1 ? "italic" : undefined}
              fontWeight={i === ESPEJO.length - 1 ? "700" : "400"}
              opacity={i === ESPEJO.length - 1 ? 1 : 0.9}
            >
              {t(clave)}
            </Text>
          </RevealItem>
        ))}
      </RevealStagger>

      <Reveal inView direction="up" distance={18} delay={0.25} duration={0.8} mt={{ base: 9, md: 12 }}>
        <Text
          color="white"
          fontSize={{ base: "xl", md: "3xl" }}
          fontWeight="700"
          lineHeight="1.35"
          letterSpacing="0.02em"
          // Las dos mitades, una debajo de otra (el \n del diccionario). En
          // móvil no: ahí la frase ya se parte sola por el ancho.
          whiteSpace={{ base: "normal", md: "pre-line" }}
          textShadow="0 0 14px rgba(255,255,255,0.45), 0 0 30px rgba(180,255,245,0.2)"
        >
          <TextoRico>{t("elMetodo.espejo.cierre")}</TextoRico>
        </Text>
      </Reveal>
    </Flex>
  );
}

// ── 3. LA FRASE DEL MÉTODO ──────────────────────────────────────────────────
// Aquí había un bloque entero («Una sola persona, ocho lentes» + una línea por
// disciplina: «Astrología ve tu estructura», «Psicología ve tu historia»…).
// Fuera: enumeraba las ocho justo antes de que el mandala y las tarjetas las
// enumeren otra vez, y lo único que no decía ningún otro sitio de la página era
// la frase del final. Así que se queda la frase, sola y grande.

export function MecanismoBloque() {
  const t = useT();
  return (
    <Reveal inView direction="up" distance={20} duration={0.85} w="100%">
      {/* Las dos mitades son dos <Text> centrados, no un solo párrafo con salto
       *  de línea: así cada frase se centra por su cuenta y la de abajo no
       *  arrastra la sangría de la de arriba. */}
      {(["elMetodo.mecanismo.clave", "elMetodo.mecanismo.clave2"] as const).map((clave, i) => (
        <Text
          key={clave}
          color="white"
          fontSize={{ base: "xl", md: "3xl" }}
          fontWeight="500"
          lineHeight="1.5"
          letterSpacing="0.015em"
          textAlign="center"
          maxW="900px"
          mx="auto"
          mt={i === 0 ? undefined : { base: 2, md: 3 }}
          // La segunda es la que gira la frase: va en cursiva para que se lea
          // como la respuesta a la primera y no como su continuación.
          fontStyle={i === 0 ? undefined : "italic"}
          textShadow="0 0 14px rgba(255,255,255,0.42), 0 0 30px rgba(180,255,245,0.2)"
        >
          <TextoRico>{t(clave)}</TextoRico>
        </Text>
      ))}
    </Reveal>
  );
}

// ── 4. LOS ENTREGABLES ──────────────────────────────────────────────────────
// Aquí iba «Al terminar no tienes apuntes. Tienes esto.»: ocho tarjetas, una
// por disciplina, con lo que se lleva puesto de cada una (tu carta natal, tu
// genograma, tu Prakṛti, tu diagnóstico del Árbol…). Retirado entero.


// ── 7. LA PRUEBA ────────────────────────────────────────────────────────────
// Va JUSTO ANTES del precio, y no es casualidad: hasta aquí la página promete
// («comprenderás», «descubrirás»), y a nadie se le piden 30 € solo con
// promesas. Esto es lo único de la página que no promete nada: son pantallas
// reales del recorrido, las mismas que se ven al entrar.
//
// Son los ocho vídeos del recorrido, moviéndose a la vez: dos filas de cuatro
// en ordenador y cuatro de dos en móvil. Cada baldosa reproduce un clip corto y
// mudo, y al pulsarla se abre el vídeo completo (ver RecorridoVideosMuestra,
// que es quien explica por qué no se sirven los vídeos originales aquí).

export function PruebasBloque() {
  const t = useT();
  return (
    <Flex direction="column" align="center" w="100%" gap={{ base: 8, md: 10 }}>
      <TituloBloque sinRaya sub={t("elMetodo.pruebas.sub")}>{t("elMetodo.pruebas.titulo")}</TituloBloque>

      <Reveal inView direction="up" distance={24} duration={0.8} w="100%">
        <RecorridoVideosMuestra />
      </Reveal>
    </Flex>
  );
}

// ── 8. EL PRECIO ────────────────────────────────────────────────────────────
// Estaba comentado en la página. Un precio que no se ve no ahorra objeciones:
// las multiplica, porque quien no lo encuentra se imagina el peor.
//
// Las cifras salen TODAS de pagoDisciplinaLink (el mismo sitio del que bebe el
// box de pago), así que la web y el cobro no pueden decir cosas distintas.

/** Lo que costaría El Mapa entero al precio de referencia. Solo se enseña si
 *  ese precio de referencia existe de verdad (ver pagoDisciplinaLink). */
const MAPA_ANTES =
  PRECIO_DISCIPLINA_ANTES_EUR != null
    ? `${PRECIO_DISCIPLINA_ANTES_EUR * NUM_DISCIPLINAS} €`
    : null;

export function PrecioBloque({ onAcceder }: { onAcceder?: () => void }) {
  const t = useT();

  // DOS productos, no tres. El acompañamiento bajó de aquí a una línea suelta
  // debajo: es un extra opcional y, puesto en columna al lado de los otros dos,
  // se leía como una tercera cosa que hay que comprar.
  const columnas = [
    {
      nombre: t("elMetodo.precio.una.nombre"),
      desc: t("elMetodo.precio.una.desc"),
      importe: <PrecioConAntes color="white" sombra="0 0 14px rgba(255,255,255,0.45)" />,
      // La línea de tres golpes bajo el precio: cuánto, qué te llevas y qué NO
      // hay detrás. Es lo que hace fácil la decisión de probar una.
      resumen: t("elMetodo.precio.una.destacado", { precio: PRECIO_DISCIPLINA }),
      destacada: true,
    },
    {
      nombre: t("elMetodo.precio.mapa.nombre"),
      desc: t("elMetodo.precio.mapa.desc"),
      importe: (
        <Flex align="baseline" justify="center" gap={2}>
          <Text color="white" fontSize={{ base: "4xl", md: "5xl" }} fontWeight="700" lineHeight="1" textShadow="0 0 14px rgba(255,255,255,0.45)">
            {PRECIO_MAPA_COMPLETO}
          </Text>
          {MAPA_ANTES && (
            <Text as="span" color="white" opacity={0.62} fontSize={{ base: "lg", md: "xl" }} fontWeight="500" lineHeight="1" textDecoration="line-through">
              {MAPA_ANTES}
            </Text>
          )}
        </Flex>
      ),
      // La cuenta escrita: ocho × 30 € = 240 €. Sin esto, «240 €» al lado de
      // «30 €» parece un pack aparte que se paga de golpe, que es justo lo que
      // NO es (se compran una a una).
      resumen: t("elMetodo.precio.mapa.destacado", {
        num: String(NUM_DISCIPLINAS),
        precio: PRECIO_DISCIPLINA,
        total: PRECIO_MAPA_COMPLETO,
      }),
      destacada: false,
    },
  ];

  return (
    <Flex direction="column" align="center" w="100%" gap={{ base: 8, md: 10 }}>
      <TituloBloque>{t("elMetodo.precio.titulo")}</TituloBloque>

      <Grid
        w="100%"
        maxW="820px"
        templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
        gap={{ base: 5, md: 6 }}
        alignItems="stretch"
      >
        {columnas.map((col, i) => (
          <Reveal key={col.nombre} inView direction="up" distance={22} duration={0.7} delay={i * 0.1} h="100%">
            <CajaCristal
              h="100%"
              align="center"
              textAlign="center"
              gap={{ base: 3, md: 4 }}
              px={{ base: 6, md: 7 }}
              py={{ base: 8, md: 9 }}
              // La primera es la puerta de entrada real: se marca con un borde
              // más vivo, no con un cartelito de «recomendado».
              // Los dos casos van escritos: pasar `undefined` NO deja el valor
              // por defecto de CajaCristal, lo BORRA (el spread mete la clave
              // igualmente y la pisa).
              border={col.destacada
                ? "1.5px solid rgba(255,255,255,0.6)"
                : "1px solid rgba(255,255,255,0.28)"}
              boxShadow={col.destacada
                ? "0 0 26px rgba(255,255,255,0.28), 0 6px 24px rgba(0,0,0,0.18)"
                : "0 4px 20px rgba(0,0,0,0.14), 0 0 24px rgba(180,255,245,0.10)"}
            >
              <Text
                color="rgba(255,255,255,0.9)"
                fontWeight="600"
                fontSize={{ base: "lg", md: "xl" }}
                letterSpacing="0.04em"
              >
                {col.nombre}
              </Text>
              {col.importe}
              {/* La línea de golpes va pegada al precio y en blanco entero: es
                  la que se lee de un vistazo. La descripción, debajo y más
                  apagada, es para quien se para a leer. */}
              <Text
                color="white"
                fontWeight="600"
                fontSize={{ base: "sm", md: "md" }}
                lineHeight="1.6"
                letterSpacing="0.02em"
              >
                {col.resumen}
              </Text>
              <Text color="rgba(255,255,255,0.82)" fontSize={{ base: "sm", md: "md" }} lineHeight="1.7">
                {col.desc}
              </Text>
            </CajaCristal>
          </Reveal>
        ))}
      </Grid>

      {/* El acompañamiento, en una línea. Ni caja ni precio grande: es un extra
          que se contrata aparte cuando ya estás dentro, no un producto entre los
          dos de arriba. */}
      <Reveal inView direction="up" distance={14} delay={0.15} duration={0.7}>
        <Text
          color="rgba(255,255,255,0.82)"
          fontSize={{ base: "sm", md: "md" }}
          lineHeight="1.75"
          textAlign="center"
          maxW="720px"
        >
          <Text as="span" color="white" fontWeight="600">
            {t("elMetodo.precio.llamada.nombre")}
          </Text>
          {" · "}
          {t("elMetodo.precio.llamada.desc")}
        </Text>
      </Reveal>

      <Reveal inView direction="up" distance={14} delay={0.2} duration={0.7}>
        <Text
          color="rgba(255,255,255,0.85)"
          fontStyle="italic"
          fontSize={{ base: "sm", md: "md" }}
          lineHeight="1.75"
          textAlign="center"
          maxW="720px"
        >
          {t("elMetodo.precio.pie")}
        </Text>
      </Reveal>

      {/* Botón AQUÍ MISMO: quien acaba de ver el precio y le cuadra no tiene que
          buscar dónde se compra ni volver arriba. */}
      {onAcceder && <CtaEmpezar onAcceder={onAcceder} />}
    </Flex>
  );
}

// ── El botón de «empezar» con el precio dentro ───────────────────────────────
// Se repite tras el precio y tras «¿Por dónde empiezo?»: son los dos momentos en
// los que alguien decide. Lleva la cifra en el propio botón (no un «Acceder» a
// secas) porque el compromiso que se pide es exactamente ese y decirlo quita
// miedo. Es EL MISMO destino que el botón grande del final de la página.
export function CtaEmpezar({ onAcceder }: { onAcceder: () => void }) {
  const t = useT();
  return (
    <Reveal inView direction="up" distance={16} delay={0.1} duration={0.7}>
      <Flex direction="column" align="center" gap={{ base: 2, md: 2.5 }}>
        <Flex
          as="button"
          onClick={onAcceder}
          align="center"
          justify="center"
          gap={3}
          px={{ base: 8, md: 12 }}
          py={{ base: "13px", md: "16px" }}
          w={{ base: "min(84vw, 380px)", md: "auto" }}
          borderRadius="full"
          border="1.5px solid rgba(255,255,255,0.7)"
          bg="rgba(255,255,255,0.12)"
          cursor="pointer"
          boxShadow="0 0 22px rgba(255,255,255,0.36), 0 0 48px rgba(180,255,245,0.22)"
          _hover={{
            bg: "rgba(255,255,255,0.22)",
            borderColor: "white",
            boxShadow: "0 0 32px rgba(255,255,255,0.58), 0 0 66px rgba(180,255,245,0.38)",
          }}
          transition="background 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease"
        >
          <Text
            color="white"
            fontWeight="700"
            fontSize={{ base: "md", md: "xl" }}
            letterSpacing="0.12em"
            textTransform="uppercase"
            whiteSpace="nowrap"
            textShadow="0 0 12px rgba(255,255,255,0.45)"
          >
            {t("elMetodo.empezarPor", { precio: PRECIO_DISCIPLINA })}
          </Text>
        </Flex>

        <Text color="rgba(255,255,255,0.8)" fontSize={{ base: "xs", md: "sm" }} letterSpacing="0.04em" textAlign="center">
          {t("elMetodo.sinTarjeta.corto")}
        </Text>
      </Flex>
    </Reveal>
  );
}

// El bloque 9 era una GARANTÍA de devolución a 14 días. Está retirado a
// propósito: esa devolución no se ofrece, y anunciar una que luego no existe
// hace más daño que no tener ninguna.

// ── 10. ¿POR DÓNDE EMPIEZO? ─────────────────────────────────────────────────
// Ocho puertas idénticas no invitan: paralizan. Aquí se señalan tres caminos
// según lo que traiga cada uno, y con eso ya no hay que elegir entre ocho.

export function PorDondeEmpiezoBloque({ onAcceder }: { onAcceder?: () => void }) {
  const t = useT();
  const caminos: { titulo: ClaveTexto; texto: ClaveTexto }[] = [
    { titulo: "elMetodo.empiezo.a.titulo", texto: "elMetodo.empiezo.a.texto" },
    { titulo: "elMetodo.empiezo.b.titulo", texto: "elMetodo.empiezo.b.texto" },
    { titulo: "elMetodo.empiezo.c.titulo", texto: "elMetodo.empiezo.c.texto" },
  ];

  return (
    <Flex direction="column" align="center" w="100%" gap={{ base: 8, md: 10 }}>
      <TituloBloque sub={t("elMetodo.empiezo.intro")}>{t("elMetodo.empiezo.titulo")}</TituloBloque>

      <Grid
        w="100%"
        maxW="1000px"
        templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
        gap={{ base: 5, md: 6 }}
        alignItems="stretch"
      >
        {caminos.map((c, i) => (
          <Reveal key={c.titulo} inView direction="up" distance={20} duration={0.7} delay={i * 0.1} h="100%">
            <CajaCristal h="100%" gap={{ base: 3, md: 4 }} px={{ base: 6, md: 7 }} py={{ base: 7, md: 8 }}>
              <Text color="white" fontWeight="700" fontSize={{ base: "lg", md: "xl" }} letterSpacing="0.02em">
                {t(c.titulo)}
              </Text>
              <Text color="rgba(255,255,255,0.86)" fontSize={{ base: "sm", md: "md" }} lineHeight="1.75">
                {t(c.texto)}
              </Text>
            </CajaCristal>
          </Reveal>
        ))}
      </Grid>

      {/* Ya sabe cuánto cuesta y por dónde entrar: aquí es donde se decide, así
          que el botón va aquí y no a media página de scroll. */}
      {onAcceder && <CtaEmpezar onAcceder={onAcceder} />}
    </Flex>
  );
}

// ── 12. LAS PREGUNTAS ───────────────────────────────────────────────────────
// Un desplegable por pregunta. La primera es la incómoda a propósito (mezclar
// astrología con fisiología celular): si no se contesta, el escéptico se va sin
// llegar al precio.

const FAQ: { p: ClaveTexto; r: ClaveTexto }[] = [
  { p: "elMetodo.faq.1.p", r: "elMetodo.faq.1.r" },
  { p: "elMetodo.faq.2.p", r: "elMetodo.faq.2.r" },
  { p: "elMetodo.faq.3.p", r: "elMetodo.faq.3.r" },
  { p: "elMetodo.faq.4.p", r: "elMetodo.faq.4.r" },
  { p: "elMetodo.faq.5.p", r: "elMetodo.faq.5.r" },
  { p: "elMetodo.faq.6.p", r: "elMetodo.faq.6.r" },
  { p: "elMetodo.faq.7.p", r: "elMetodo.faq.7.r" },
  { p: "elMetodo.faq.8.p", r: "elMetodo.faq.8.r" },
  { p: "elMetodo.faq.9.p", r: "elMetodo.faq.9.r" },
];

export function FaqBloque() {
  const t = useT();
  // Solo una abierta cada vez: con ocho párrafos abiertos el bloque se convierte
  // en una pared de texto y deja de contestar nada.
  const [abierta, setAbierta] = useState<number | null>(0);

  // Sin título ni rayita encima: las preguntas se explican solas y la cesura
  // que va justo arriba ya dice que empieza otra cosa.
  return (
    <Flex direction="column" align="center" w="100%" gap={{ base: 8, md: 10 }}>
      <Flex direction="column" w="100%" maxW="820px" gap={{ base: 3, md: 3.5 }}>
        {FAQ.map((f, i) => {
          const open = abierta === i;
          return (
            <Reveal key={f.p} inView direction="up" distance={14} duration={0.55} delay={Math.min(i, 4) * 0.06}>
              <CajaCristal
                w="100%"
                textAlign="left"
                px={{ base: 5, md: 7 }}
                py={{ base: 4, md: 5 }}
                gap={open ? { base: 3, md: 4 } : 0}
                borderColor={open ? "rgba(255,255,255,0.45)" : "rgba(255,255,255,0.28)"}
                transition="border-color 0.25s ease, background 0.25s ease"
                _hover={{ bg: "rgba(255,255,255,0.11)" }}
              >
                {/* El <button> es la FILA de la pregunta, no la caja entera: así
                    la respuesta abierta no queda dentro de un botón (que no se
                    puede seleccionar con el ratón para copiarla). */}
                <Flex
                  as="button"
                  onClick={() => setAbierta(open ? null : i)}
                  align="center"
                  justify="space-between"
                  gap={4}
                  w="100%"
                  textAlign="left"
                  cursor="pointer"
                  bg="transparent"
                  border="none"
                >
                  <Text
                    color="white"
                    fontWeight="600"
                    fontSize={{ base: "md", md: "lg" }}
                    lineHeight="1.45"
                    letterSpacing="0.01em"
                  >
                    {t(f.p)}
                  </Text>
                  {/* Cruz que gira a «−» al abrir: dos rayas, sin fuentes de
                      iconos ni caracteres que cambien de tamaño con el idioma. */}
                  <Box
                    position="relative"
                    flexShrink={0}
                    w="18px"
                    h="18px"
                    transform={open ? "rotate(45deg)" : "rotate(0deg)"}
                    transition="transform 0.3s cubic-bezier(0.22,1,0.36,1)"
                  >
                    <Box position="absolute" top="50%" left={0} w="18px" h="1.5px" bg="white" transform="translateY(-50%)" />
                    <Box position="absolute" left="50%" top={0} h="18px" w="1.5px" bg="white" transform="translateX(-50%)" />
                  </Box>
                </Flex>

                {open && (
                  <Text
                    color="rgba(255,255,255,0.86)"
                    fontSize={{ base: "sm", md: "md" }}
                    lineHeight="1.8"
                    pr={{ base: 0, md: 8 }}
                  >
                    {t(f.r)}
                  </Text>
                )}
              </CajaCristal>
            </Reveal>
          );
        })}
      </Flex>
    </Flex>
  );
}

// ── 13. BARRA FIJA (móvil) ──────────────────────────────────────────────────
// La página es larguísima y el único botón grande está al final: quien se
// convence a mitad de camino tiene que seguir bajando para poder pulsar. Esta
// barra aparece al pasar la primera pantalla y ya no se va.
//
// SOLO en móvil: en ordenador el botón del final se ve sin esfuerzo y una barra
// pegada abajo taparía contenido sin ganar nada.

export function BarraFijaMovil({ onAcceder }: { onAcceder: () => void }) {
  const t = useT();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Aparece pasada la primera pantalla: antes de eso el hero ya tiene su
    // propio botón justo delante y la barra solo estorbaría.
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.9);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <Flex
      display={{ base: "flex", md: "none" }}
      position="fixed"
      bottom={0}
      left={0}
      right={0}
      zIndex={150}
      align="center"
      justify="space-between"
      gap={3}
      px={4}
      // Margen de seguridad para la barra del navegador en iPhone.
      pt={3}
      pb="calc(12px + env(safe-area-inset-bottom))"
      bg="rgba(0,64,64,0.92)"
      borderTop="1px solid rgba(255,255,255,0.28)"
      sx={{ backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)" }}
      boxShadow="0 -6px 24px rgba(0,0,0,0.28)"
      opacity={visible ? 1 : 0}
      transform={visible ? "translateY(0)" : "translateY(110%)"}
      pointerEvents={visible ? "auto" : "none"}
      transition="opacity 0.3s ease, transform 0.35s cubic-bezier(0.22,1,0.36,1)"
    >
      <Flex direction="column" lineHeight="1.15" flexShrink={0}>
        <Text color="rgba(255,255,255,0.75)" fontSize="xs" letterSpacing="0.04em">
          {t("elMetodo.barra.desde", { precio: PRECIO_DISCIPLINA })}
        </Text>
        <Text color="white" fontSize="sm" fontStyle="italic">
          {t("elMetodo.sinTarjeta.corto")}
        </Text>
      </Flex>

      <Flex
        as="button"
        onClick={onAcceder}
        align="center"
        justify="center"
        flex="1"
        maxW="180px"
        px={5}
        py="10px"
        borderRadius="full"
        border="1.5px solid rgba(255,255,255,0.7)"
        bg="rgba(255,255,255,0.14)"
        cursor="pointer"
        boxShadow="0 0 16px rgba(255,255,255,0.3)"
        _active={{ bg: "rgba(255,255,255,0.26)" }}
        transition="background 0.2s ease"
      >
        <Text color="white" fontWeight="700" fontSize="md" letterSpacing="0.08em" textTransform="uppercase" whiteSpace="nowrap">
          {t("elMetodo.barra.cta")}
        </Text>
      </Flex>
    </Flex>
  );
}
