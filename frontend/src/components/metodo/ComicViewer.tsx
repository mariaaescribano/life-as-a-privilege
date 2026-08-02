import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  Box,
  Flex,
  IconButton,
  Image,
  ModalBody,
  Text,
  type TextProps,
} from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { comicLoaderPorColor } from "./comicLoaders";
import { astrologiaTxt } from "../../GlobalVariables";

// Frontend único del cómic: misma vista, misma maquetación, mismas animaciones.
// Lo que varía entre cómics son las viñetas (foto + texto) y las acciones
// (qué hace el botón de "volver" o el tick final).

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const twinkle = keyframes`
  0%, 100% { opacity: 0.35; }
  50%      { opacity: 1; }
`;

export interface Vineta {
  src: string;
  paragraphs: string[];
  /** Encabezado opcional sobre el texto (p.ej. "La Madera genera el Fuego"). */
  titulo?: string;
  /** Antetítulo pequeño en mayúsculas sobre el título (p.ej. "Ciclo generador"). */
  eyebrow?: string;
  /** La ilustración de esta viñeta es VERTICAL (9:16). En vez del cuadrado
   *  (desktop) / hero recortado (móvil), se muestra entera y alta: columna
   *  estrecha en desktop y foto completa centrada en móvil. Lo usa la última
   *  viñeta del cómic de estrellas (la tabla periódica). */
  fotoVertical?: boolean;
}

const Stars = () => {
  const stars = [
    { top: "12%", left: "8%",  size: 2, delay: "0s" },
    { top: "20%", left: "92%", size: 2, delay: "1.4s" },
    { top: "38%", left: "4%",  size: 3, delay: "0.7s" },
    { top: "52%", left: "96%", size: 2, delay: "2.1s" },
    { top: "70%", left: "6%",  size: 2, delay: "1.1s" },
    { top: "82%", left: "94%", size: 3, delay: "0.4s" },
    { top: "26%", left: "50%", size: 2, delay: "1.8s" },
    { top: "88%", left: "48%", size: 2, delay: "2.6s" },
  ];
  return (
    <>
      {stars.map((s, i) => (
        <Box
          key={i}
          position="absolute"
          top={s.top}
          left={s.left}
          w={`${s.size}px`}
          h={`${s.size}px`}
          borderRadius="full"
          bg="white"
          animation={`${twinkle} 3.5s ease-in-out ${s.delay} infinite`}
          boxShadow="0 0 6px rgba(255,255,255,0.85), 0 0 14px rgba(180,255,245,0.55)"
          pointerEvents="none"
          zIndex={1}
        />
      ))}
    </>
  );
};

interface ComicViewerProps {
  vinetas: Vineta[];
  onClose: () => void;
  /** Si se define, se llama al pulsar el tick de la última viñeta (en vez de cerrar). */
  onComplete?: () => void;
  /** Si se define, muestra el botón "volver" (top-left) — usado por Astrología para volver al selector. */
  onBack?: () => void;
  /** Color de acento. Por defecto el de astrología. */
  themeColor?: string;
  /** Foto de la modalidad. Si se pasa, sustituye al fondo de Astrología
   *  (estrellas) tanto en el fondo completo (muy blureado + pantalla negra)
   *  como en el box del texto (poco blureado, brillando con disciplinaBgColor).
   *  Útil para Ilustraciones de Hinduismo / Medicina China. */
  disciplinaBgImage?: string;
  /** Color hex del bg de la disciplina. Se usa para el glow del box de texto. */
  disciplinaBgColor?: string;
  /** Sombra del texto de las viñetas. Por defecto una sombra oscura (la usa
   *  TCM). Cada cómic puede pasar la suya (p.ej. Hinduismo/Astrología usan una
   *  sombra del color de su disciplina en vez de negra). */
  textShadow?: string;
  /** Color del texto de las viñetas. Por defecto = themeColor. Útil cuando el
   *  acento es un color poco legible sobre la foto (p.ej. verde de Madera). */
  textColor?: string;
  /** Contenido extra por página (p.ej. un mini-test), bajo el texto de la viñeta.
   *  Devuelve el JSX a pintar para ese índice, o null si no hay nada. Recibe
   *  `api` para poder avanzar el cómic desde dentro (botón "Continuar →"). */
  pageExtra?: (index: number, api: { goNext: () => void; isLast: boolean }) => React.ReactNode;
  /** Si devuelve true para la página actual, bloquea el avance (flecha derecha,
   *  tecla → y swipe) hasta que deje de estarlo (p.ej. hasta responder el test). */
  bloqueado?: (index: number) => boolean;
  /** Si devuelve true para una página, esa página se muestra SIN foto: solo el
   *  texto/box a todo el ancho (p.ej. el paso de test del cómic de elemento). */
  sinFoto?: (index: number) => boolean;
  /** Si true, cada frase (tras un punto) se pinta como un bloque aparte con
   *  doble separación, para un texto más aireado y limpio (cómics de TCM). */
  separarFrases?: boolean;
  /** Solo en modo disciplina: si true, la foto de FONDO (a pantalla completa,
   *  detrás del box) se ve NÍTIDA (blur muy suave) y apenas oscurecida, cubriendo
   *  todo el viewport, en vez del fondo muy blureado + pantalla negra. El box
   *  (foto izquierda + texto derecha) NO cambia. Útil cuando la foto de la
   *  disciplina es protagonista (cómic de elementos de TCM). No afecta a las
   *  Ilustraciones (Hinduismo / TCM). */
  fondoNitido?: boolean;
  /** Viñeta por la que empezar (para abrir directamente en una concreta). */
  initialIndex?: number;
  /** Se llama con el índice de la viñeta cada vez que se muestra una (también al
   *  abrir). Útil, p.ej., para marcar como «leída» cada sefirá de Cábala según se
   *  navega de una a otra con las flechas. */
  onPageView?: (index: number) => void;
  /** Animación de espera mientras la ilustración de la viñeta carga. Si no se
   *  pasa, se usa un spinner del color de la disciplina. Nutrición pasa aquí su
   *  manzana (AppleLoader). */
  loader?: React.ReactNode;
  /** Si true, la caja (foto + texto) NO lleva sombra/glow alrededor. Lo usan las
   *  Ilustraciones de Astrología, que se ven más limpias sin el shadow box. */
  sinSombra?: boolean;
  /** Color de la barra de scroll vertical. Por defecto el acento (themeColor);
   *  algunos cómics (TCM: elementos, ciclos) la piden blanca para que case con
   *  su letra blanca. */
  scrollbarColor?: string;
  /** Color de la X de cerrar. Por defecto va blanca sobre un chip oscuro. Si se
   *  pasa (Nutrición: nutricionTxt), la X va de ESE color sobre un chip CLARO
   *  (el color de fondo de la disciplina), igual que el botón de continuar que
   *  tiene al lado; si no, la letra oscura no se leería sobre el chip negro. */
  cerrarColor?: string;
  /** @deprecated El botón «Saltar» se eliminó de todos los cómics. Se mantiene el
   *  prop (no-op) solo para no romper los llamadores que aún lo pasan. */
  sinSaltar?: boolean;
  /** @deprecated Sin efecto: ya no hay botón «Saltar». Se conserva por compat. */
  saltarTextColor?: string;
  /** Tamaño de la letra de lectura de las viñetas. Por defecto el tamaño único de
   *  la app (`{ base: "2xl", md: "3xl" }`). Astrología lo baja un punto para su
   *  cómic de intro. */
  textSize?: TextProps["fontSize"];
  /** Si true, las flechas de navegación se pegan a los bordes IZQ/DER del box
   *  (centradas en su altura) en vez de ir fijas a los bordes del viewport. Lo
   *  usa el cómic de intro de astrología. */
  flechasEnBox?: boolean;
  /** Si true (y hay `disciplinaBgImage`), NO se muestra el cómic hasta que la
   *  foto de fondo de la disciplina esté completamente cargada: mientras tanto se
   *  ve el loader a pantalla completa. Evita ver el box con el fondo a medio
   *  cargar. Lo usan los cómics de TCM (elementos). */
  esperarFondo?: boolean;
}

const DEFAULT_TEXT_SHADOW =
  "0 1px 4px rgba(0,0,0,0.9), 0 2px 12px rgba(0,0,0,0.75), 0 0 5px rgba(0,0,0,0.7), 0 0 18px rgba(255,255,255,0.25)";

export function ComicViewer({
  vinetas,
  onClose,
  onComplete,
  onBack,
  themeColor = astrologiaTxt,
  disciplinaBgImage,
  disciplinaBgColor,
  textShadow = DEFAULT_TEXT_SHADOW,
  textColor,
  pageExtra,
  bloqueado,
  sinFoto,
  separarFrases,
  fondoNitido,
  initialIndex = 0,
  loader,
  onPageView,
  sinSombra,
  scrollbarColor,
  cerrarColor,
  textSize,
  flechasEnBox,
  esperarFondo,
}: ComicViewerProps) {
  const isDisciplinaMode = !!disciplinaBgImage;
  // Color de la scrollbar: el que pidan o, por defecto, el acento del cómic.
  const sbColor = scrollbarColor ?? themeColor;
  // Fondo a pantalla completa: parámetros según modo. `fondoNitido` (cómic de
  // elementos de TCM) muestra la foto casi nítida y a plena pantalla; el resto
  // del modo disciplina la deja muy blureada + pantalla negra para contrastar
  // con la foto nítida del box del texto.
  const bgBlurPx = isDisciplinaMode ? (fondoNitido ? 26 : 20) : 0;
  const bgSpreadPx = bgBlurPx > 0 ? bgBlurPx + 8 : 0; // compensa el sangrado del blur
  const bgOverlay = isDisciplinaMode
    ? (fondoNitido ? "rgba(0,0,0,0.38)" : "rgba(0,0,0,0.45)")
    : "rgba(0,0,0,0.35)";
  const [index, setIndex] = useState(() =>
    Math.min(Math.max(initialIndex, 0), Math.max(vinetas.length - 1, 0)));
  const [imgFailed, setImgFailed] = useState<Record<number, boolean>>({});
  const [imgLoaded, setImgLoaded] = useState<Record<number, boolean>>({}); // viñeta ya cargada
  // Espera de la foto de FONDO de la disciplina (solo con `esperarFondo`): hasta
  // que cargue del todo se muestra el loader a pantalla completa y no el box.
  const esperaFondo = !!(esperarFondo && disciplinaBgImage);
  const [bgReady, setBgReady] = useState(false);
  const fondoListo = !esperaFondo || bgReady;
  useEffect(() => {
    if (!esperaFondo || !disciplinaBgImage) return;
    let cancel = false;
    const img = new window.Image();
    const listo = () => { if (!cancel) setBgReady(true); };
    img.onload = listo;
    img.onerror = listo;
    img.src = encodeURI(disciplinaBgImage);
    if (img.complete) listo();
    return () => { cancel = true; };
  }, [esperaFondo, disciplinaBgImage]);
  const contentRef = useRef<HTMLDivElement>(null);
  const textScrollRef = useRef<HTMLDivElement>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const total = vinetas.length;
  const current = vinetas[index];
  const isFirst = index === 0;
  const isLast = index === total - 1;
  // Página bloqueada: no se puede avanzar hasta cumplir su requisito (p.ej.
  // responder el mini-test embebido). Sí se puede retroceder.
  const blocked = bloqueado ? bloqueado(index) : false;
  // Página sin foto: solo el texto/box a todo el ancho (p.ej. el paso de test).
  const hideFoto = sinFoto ? sinFoto(index) : false;
  // Viñeta con ilustración vertical (9:16): se ve ENTERA (contain), alta y
  // estrecha, en vez del cuadrado de desktop / hero recortado de móvil.
  const fotoVertical = !!current?.fotoVertical;
  // El panel entero (foto + texto) espera a que la ilustración de la izquierda
  // esté cargada: mientras tanto se ve solo un spinner del color de la
  // disciplina. Si no hay foto (hideFoto) o la foto falló, no hay nada que
  // esperar y se muestra el contenido directamente.
  const imgReady = hideFoto || imgFailed[index] || imgLoaded[index];
  // Color y sombra del título / antetítulo de la viñeta. Por defecto blanco con
  // sombra oscura (para las fotos oscuras del resto de disciplinas). Si el cómic
  // define un `textColor` NO blanco (p.ej. Nutrición: verde oscuro sobre foto
  // clara), el título usa ese color y su misma sombra (`textShadow`), que en
  // Nutrición es "none". Los cómics con título blanco no cambian.
  const tituloColor = textColor ?? "white";
  const tituloBlanco =
    !textColor || textColor.toLowerCase() === "#ffffff" || textColor.toLowerCase() === "white";
  const tituloShadow = tituloBlanco ? "0 2px 8px rgba(0,0,0,0.9)" : textShadow;

  // Al cambiar de viñeta, la nueva SIEMPRE empieza desde arriba, aunque en la
  // anterior se hubiera bajado hasta el final. Reseteamos el scroll interno
  // (texto en desktop, panel en móvil) y TAMBIÉN el de cualquier contenedor
  // scrollable por encima (los Modal con scrollBehavior="outside" scrollean en
  // su propio contenedor, no en los boxes internos) y el de la ventana. Va en
  // useLayoutEffect para que ocurra ANTES de pintar (sin salto visible).
  useLayoutEffect(() => {
    const resetArriba = (start: HTMLElement | null) => {
      let el: HTMLElement | null = start;
      while (el) {
        if (el.scrollTop) el.scrollTop = 0;
        el = el.parentElement;
      }
    };
    if (contentRef.current) contentRef.current.scrollTop = 0;
    if (textScrollRef.current) textScrollRef.current.scrollTop = 0;
    resetArriba(contentRef.current);
    resetArriba(textScrollRef.current);
    if (typeof window !== "undefined") window.scrollTo(0, 0);
  }, [index]);

  // Avisa de qué viñeta se está viendo (al abrir y en cada cambio). Vía ref para
  // no reejecutar el efecto si el callback cambia de identidad entre renders.
  const onPageViewRef = useRef(onPageView);
  onPageViewRef.current = onPageView;
  useEffect(() => { onPageViewRef.current?.(index); }, [index]);

  // Prefetch de las viñetas vecinas: al abrir y cada vez que se pasa de página,
  // calentamos en caché la viñeta actual y las siguientes (y la anterior), y las
  // marcamos como cargadas en cuanto terminan. Así, al avanzar, la foto ya está
  // lista y NO vuelve a aparecer el spinner (salvo la primera, si aún descarga).
  useEffect(() => {
    const vecinas = [index, index + 1, index + 2, index - 1].filter(
      (i) => i >= 0 && i < total,
    );
    const imgs: HTMLImageElement[] = [];
    vecinas.forEach((i) => {
      if (sinFoto?.(i)) return;
      const src = vinetas[i]?.src;
      if (!src) return;
      const img = new window.Image();
      img.onload = () => setImgLoaded((s) => (s[i] ? s : { ...s, [i]: true }));
      img.onerror = () => setImgFailed((s) => (s[i] ? s : { ...s, [i]: true }));
      img.src = encodeURI(src);
      imgs.push(img);
    });
    return () => {
      imgs.forEach((img) => { img.onload = null; img.onerror = null; });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, total]);

  const handleComplete = () => {
    if (onComplete) onComplete();
    else onClose();
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        setIndex((i) => {
          if (bloqueado && bloqueado(i)) return i; // página bloqueada: no avanzar
          if (i >= total - 1) {
            handleComplete();
            return i;
          }
          return i + 1;
        });
      } else if (e.key === "ArrowLeft") {
        setIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Escape" && onBack) {
        onBack();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [total, onBack, bloqueado]);

  const goPrev = () => setIndex((i) => Math.max(i - 1, 0));
  const goNext = () => setIndex((i) => Math.min(i + 1, total - 1));

  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart.current) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchStart.current.x;
    const dy = t.clientY - touchStart.current.y;
    touchStart.current = null;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
      if (dx > 0) goPrev();
      else if (blocked) return; // página bloqueada: no avanzar con swipe
      else if (isLast) handleComplete();
      else goNext();
    }
  };

  const glowTextSoft = `0 0 10px rgba(255,255,255,0.4), 0 0 22px rgba(255,255,255,0.2)`;

  // Flechas de navegación. Por defecto fijas a los bordes del viewport; con
  // `flechasEnBox` (astrología) se pegan a los bordes del box, centradas en su
  // altura (position absolute dentro del box, zIndex sobre el contenido).
  const arrowPos = flechasEnBox
    ? ({ position: "absolute", zIndex: 4 } as const)
    : ({ position: "fixed", zIndex: 10 } as const);
  const prevArrow = (
    <IconButton
      aria-label="Anterior"
      onClick={goPrev}
      isDisabled={isFirst}
      {...arrowPos}
      left={flechasEnBox ? { base: 1, md: 1 } : { base: 1, md: 6 }}
      top="50%"
      transform="translateY(-50%)"
      variant="ghost"
      color={themeColor}
      opacity={isFirst ? 0.3 : 1}
      bg="rgba(0,0,0,0.5)"
      border={`1px solid ${themeColor}aa`}
      borderRadius="full"
      w={{ base: "40px", md: "60px" }}
      h={{ base: "40px", md: "60px" }}
      minW={{ base: "40px", md: "60px" }}
      boxShadow={isFirst ? "none" : "0 2px 14px rgba(0,0,0,0.45)"}
      sx={{ backdropFilter: "blur(4px)" }}
      _hover={isFirst ? {} : { bg: "rgba(0,0,0,0.72)", borderColor: themeColor }}
      _focus={{ boxShadow: isFirst ? "none" : "0 2px 14px rgba(0,0,0,0.45)" }}
      _focusVisible={{ boxShadow: isFirst ? "none" : "0 2px 14px rgba(0,0,0,0.45)" }}
      icon={
        <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" w={{ base: "24px", md: "32px" }} h={{ base: "24px", md: "32px" }} fill="#ffffff"
          style={{ filter: `drop-shadow(0 0 6px ${themeColor}) drop-shadow(0 1px 2px rgba(0,0,0,0.85))` }}>
          <path d="M560-240 320-480l240-240 56 56-184 184 184 184-56 56Z" />
        </Box>
      }
    />
  );
  const nextArrow = (
    <IconButton
      aria-label={isLast ? "Terminar" : "Siguiente"}
      onClick={blocked ? undefined : (isLast ? handleComplete : goNext)}
      isDisabled={blocked}
      {...arrowPos}
      right={flechasEnBox ? { base: 1, md: 1 } : { base: 1, md: 6 }}
      top="50%"
      transform="translateY(-50%)"
      variant="ghost"
      color={themeColor}
      opacity={blocked ? 0.3 : 1}
      bg="rgba(0,0,0,0.5)"
      border={`1px solid ${themeColor}aa`}
      borderRadius="full"
      w={{ base: "40px", md: "60px" }}
      h={{ base: "40px", md: "60px" }}
      minW={{ base: "40px", md: "60px" }}
      boxShadow={blocked ? "none" : "0 2px 14px rgba(0,0,0,0.45)"}
      sx={{ backdropFilter: "blur(4px)" }}
      _hover={blocked ? {} : { bg: "rgba(0,0,0,0.72)", borderColor: themeColor }}
      _focus={{ boxShadow: blocked ? "none" : "0 2px 14px rgba(0,0,0,0.45)" }}
      _focusVisible={{ boxShadow: blocked ? "none" : "0 2px 14px rgba(0,0,0,0.45)" }}
      icon={
        isLast ? (
          <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" w={{ base: "24px", md: "32px" }} h={{ base: "24px", md: "32px" }} fill="#ffffff"
            style={{ filter: `drop-shadow(0 0 6px ${themeColor}) drop-shadow(0 1px 2px rgba(0,0,0,0.85))` }}>
            <path d="M382-200 154-428l57-57 171 171 367-367 57 57-424 424Z" />
          </Box>
        ) : (
          <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" w={{ base: "24px", md: "32px" }} h={{ base: "24px", md: "32px" }} fill="#ffffff"
            style={{ filter: `drop-shadow(0 0 6px ${themeColor}) drop-shadow(0 1px 2px rgba(0,0,0,0.85))` }}>
            <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" />
          </Box>
        )
      }
    />
  );

  return (
    <>
      {/* Fondo a pantalla completa. La foto cubre TODO el viewport sin dejar
          huecos en negro: position:fixed + inset:0 + objectFit:cover.
          - Astrología: foto espacial nítida.
          - Disciplina mode (Hinduismo / TCM Ilustraciones): foto de la
            modalidad con blur fuerte + pantalla negra translúcida para crear
            distinción con la foto nítida del box del texto. */}
      <Box
        position="fixed"
        top="-40px"
        left="-40px"
        right="-40px"
        bottom="-40px"
        pointerEvents="none"
        zIndex={0}
        overflow="hidden"
        bg={isDisciplinaMode ? disciplinaBgColor : undefined}
      >
        <Box
          as="img"
          src={isDisciplinaMode ? disciplinaBgImage : "/img/astrologia/space.jpg"}
          alt=""
          loading="eager"
          position="absolute"
          top={`-${bgSpreadPx}px`}
          left={`-${bgSpreadPx}px`}
          right={`-${bgSpreadPx}px`}
          bottom={`-${bgSpreadPx}px`}
          w={`calc(100% + ${bgSpreadPx * 2}px)`}
          h={`calc(100% + ${bgSpreadPx * 2}px)`}
          style={{
            objectFit: "cover",
            objectPosition: "center",
            filter: bgBlurPx > 0 ? `blur(${bgBlurPx}px)` : undefined,
          }}
        />
        <Box position="absolute" inset="0" bg={bgOverlay} />
      </Box>

      {/* X cerrar — chip oscuro con la X blanca para que resalte sobre cualquier
          fondo. Con `cerrarColor` (Nutrición) se invierte: X del color pedido
          sobre un chip CLARO del color de la disciplina, a juego con el botón de
          continuar que lleva al lado.
          zIndex 12: por encima del loader de espera de fondo (11) para poder
          cerrar aunque la foto aún no haya cargado. */}
      <IconButton
        aria-label="Cerrar"
        onClick={onClose}
        position="fixed"
        top={{ base: 3, md: 5 }}
        right={{ base: 3, md: 5 }}
        zIndex={12}
        variant="ghost"
        borderRadius="full"
        w={{ base: "42px", md: "48px" }}
        h={{ base: "42px", md: "48px" }}
        minW={{ base: "42px", md: "48px" }}
        bg={cerrarColor ? `${disciplinaBgColor ?? "#ffffff"}d9` : "rgba(0,0,0,0.5)"}
        border={cerrarColor ? `2px solid ${cerrarColor}` : `1px solid ${themeColor}aa`}
        boxShadow="0 2px 12px rgba(0,0,0,0.45)"
        sx={{ backdropFilter: "blur(4px)" }}
        _hover={cerrarColor
          ? { bg: disciplinaBgColor ?? "#ffffff", transform: "translateY(-1px)" }
          : { bg: "rgba(0,0,0,0.7)", borderColor: themeColor }}
        _focus={{ boxShadow: "0 2px 12px rgba(0,0,0,0.45)" }}
        _focusVisible={{ boxShadow: "0 2px 12px rgba(0,0,0,0.45)" }}
        icon={
          <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" w="26px" h="26px"
            fill={cerrarColor ?? "#ffffff"}
            style={{
              filter: cerrarColor
                ? undefined
                : `drop-shadow(0 0 5px ${themeColor}) drop-shadow(0 1px 2px rgba(0,0,0,0.8))`,
            }}>
            <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
          </Box>
        }
      />

      {/* Espera de la foto de fondo (`esperarFondo`): loader a pantalla completa
          sobre un fondo del color de la disciplina, hasta que la foto cargue del
          todo. Tapa el box a medio cargar; la X (zIndex 12) queda por encima. */}
      {!fondoListo && (
        <Flex
          position="fixed"
          inset="0"
          zIndex={11}
          align="center"
          justify="center"
          bg={disciplinaBgColor ?? "rgba(0,0,0,0.92)"}
        >
          {loader ?? comicLoaderPorColor(themeColor)}
        </Flex>
      )}

      {/* Botón "volver" (solo si onBack está definido) */}
      {onBack && (
        <IconButton
          aria-label="Volver al menú"
          onClick={onBack}
          position="fixed"
          top={{ base: 3, md: 5 }}
          left={{ base: 3, md: 5 }}
          zIndex={10}
          variant="ghost"
          color={themeColor}
          _hover={{ bg: `${themeColor}22` }}
          _focus={{ boxShadow: "none" }}
          _focusVisible={{ boxShadow: "none" }}
          icon={
            <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" w="22px" h="22px" fill={themeColor}>
              <path d="M480-160 160-480l320-320 56 57-223 223h487v80H313l224 224-57 56Z" />
            </Box>
          }
        />
      )}

      {/* Flechas de navegación fijas a los bordes del viewport (modo por defecto).
          Con `flechasEnBox` se pintan dentro del box (más abajo) y aquí no. */}
      {!flechasEnBox && prevArrow}
      {!flechasEnBox && nextArrow}

      {/* Contenido: ocupa la pantalla justa y NUNCA la desborda, así que el
          cómic no saca barra de scroll de página (no aportaba nada: el texto ya
          scrollea dentro de la caja). El py deja un margen visible arriba y
          abajo para que la caja no se pegue a los bordes. */}
      <ModalBody
        position="relative"
        zIndex={2}
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        // Exactamente la pantalla, ni un píxel más: la caja de abajo se ajusta a
        // lo que quede libre y hace su propio scroll por dentro, así que la
        // página NO necesita barra de scroll. `dvh` para que en móvil no cuente
        // de más la franja de la barra del navegador.
        h="100dvh"
        overflow="hidden"
        // Móvil: px = 5 para que el box quede EXACTAMENTE del ancho del header de
        // la disciplina (la página usa px base 5). py más corto para que el box +
        // las flechas quepan juntos en el viewport sin scroll.
        px={{ base: 5, md: 24 }}
        py={{ base: 8, md: 14 }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        sx={{
          touchAction: "pan-y",
        }}
      >
        {/* Caja única: contiene foto + texto sobre el fondo de la disciplina.
            El scroll vertical ocurre DENTRO de la caja (el área de contenido),
            no a nivel de página. */}
        <Box
          key={`box-${index}`}
          w="100%"
          // Móvil: el box se estrecha para dejar un hueco a cada lado donde
          // caben las flechas fijas al viewport, en vez de que estas se le
          // monten encima. Así la caja es más pequeña y se lee mejor.
          maxW={{ base: "calc(100vw - 104px)", md: "940px" }}
          // Los 540px de siempre… salvo que la ventana sea baja: entonces la
          // caja se encoge a lo que hay (descontando el py del ModalBody) en vez
          // de desbordar y sacarle una barra de scroll a la página entera.
          h={{ base: "auto", md: "min(540px, calc(100dvh - 112px))" }}
          maxH={{ base: "calc(100dvh - 72px)", md: "calc(100dvh - 112px)" }}
          display="flex"
          flexDirection="column"
          position="relative"
          borderRadius="xl"
          overflow="hidden"
          animation={`${fadeIn} 0.55s ease both`}
          boxShadow={
            sinSombra
              ? "none"
              : fondoNitido
              // Cómic de elementos TCM: SIN glow de color, solo una sombra suave
              // de profundidad para separar el box del fondo blureado.
              ? "0 24px 70px rgba(0,0,0,0.5), inset 0 0 20px rgba(0,0,0,0.22)"
              : isDisciplinaMode && disciplinaBgColor
              ? `0 0 22px ${disciplinaBgColor}88, 0 0 50px ${disciplinaBgColor}55, 0 0 18px ${themeColor}44, 0 0 40px ${themeColor}22, inset 0 0 20px rgba(0,0,0,0.35)`
              : `0 0 16px rgba(255,255,255,0.16), 0 0 34px rgba(255,255,255,0.08), 0 0 60px rgba(180,255,245,0.09), 0 0 20px ${themeColor}1a, 0 0 48px ${themeColor}10, inset 0 0 20px rgba(0,0,0,0.35)`
          }
        >
          {/* Fondo de la caja (foto de disciplina blureada + overlay) */}
          <Box
            position="absolute"
            inset="0"
            pointerEvents="none"
            zIndex={0}
            style={{
              background:
                "radial-gradient(ellipse at 30% 20%, #2a1b5c 0%, #14143a 45%, #050816 100%)",
            }}
          >
            <Box
              as="img"
              src={isDisciplinaMode ? disciplinaBgImage : "/img/astrologia/space.jpg"}
              alt=""
              loading="eager"
              position="absolute"
              inset="0"
              w="100%"
              h="100%"
              style={{
                objectFit: "cover",
                objectPosition: "center",
                opacity: isDisciplinaMode ? 1 : 0.75,
                // TCM ciclos (fondoNitido): un pelín de blur para que la letra se
                // lea mejor, pero la foto se sigue viendo bonita. El scale evita
                // que el desenfoque deje ver los bordes del box.
                filter: fondoNitido ? "saturate(1.05) blur(3px)" : isDisciplinaMode ? "saturate(1.05)" : undefined,
                transform: fondoNitido ? "scale(1.05)" : undefined,
              }}
            />
            <Box
              position="absolute"
              inset="0"
              // Velo de color sobre la foto del box. En TCM (fondoNitido) va más
              // suave (~19%) para que la pintura de tinta respire y se vea nítida.
              bg={isDisciplinaMode && disciplinaBgColor
                ? `${disciplinaBgColor}${fondoNitido ? "12" : "55"}`
                : "rgba(8,13,30,0.55)"}
            />
            {/* Velo oscuro en TODAS las viñetas del cómic de TCM (fondoNitido),
                para que el texto y las opciones se lean bien sobre la pintura.
                Opacidad ~20% menor que la del test para que no quede tan oscuro. */}
            {fondoNitido && (
              <Box position="absolute" inset="0"
                   bgGradient="linear(to-b, rgba(0,0,0,0.18), rgba(0,0,0,0.1))" />
            )}
          </Box>

          {!isDisciplinaMode && <Stars />}

          {/* Línea de luz superior (se oculta con `sinSombra`, p.ej. las
              Ilustraciones de Astrología, que van sin luz de box). */}
          {!sinSombra && (
          <Box
            position="absolute"
            top="-1px"
            left="15%"
            right="15%"
            h="1px"
            bgGradient={`linear(to-r, transparent, ${themeColor}aa, transparent)`}
            zIndex={3}
          />
          )}

          {/* Flechas pegadas a los bordes del box (centradas en su altura). Solo
              con `flechasEnBox`; en el modo normal van fijas al viewport. */}
          {flechasEnBox && prevArrow}
          {flechasEnBox && nextArrow}

          {/* Área de contenido: foto + texto.
              Escritorio: foto FIJA a la izquierda (centrada) y texto a la
              derecha con su PROPIO scroll vertical — la foto no se mueve y el
              texto arranca siempre en el mismo sitio (arriba, con margen).
              Móvil: foto arriba, texto abajo (columna) con scroll conjunto y
              una rayita corta y elegante entre medias. */}
          <Flex
            ref={contentRef}
            direction={{ base: "column", md: "row" }}
            align={{ base: "center", md: "stretch" }}
            justify="center"
            gap={{ base: 5, md: 10 }}
            position="relative"
            zIndex={2}
            flex="1"
            minH={0}
            overflowY={{ base: "auto", md: "hidden" }}
            overflowX="hidden"
            // En móvil SIN padding para que la foto sea hero (full-bleed) arriba;
            // el texto añade su propio padding. En desktop, padding normal.
            // OJO con `pr`: en escritorio va a 0 para que la barra de scroll del
            // texto quede pegada al borde derecho del box y no flotando a 56px
            // de él. El aire que se pierde aquí lo recupera la columna de texto
            // con su propio `pr` (así se mueve la barra, no el texto).
            pl={{ base: 0, md: 10 }}
            pr={0}
            py={{ base: 0, md: 10 }}
            sx={{
              "&::-webkit-scrollbar": { width: "6px" },
              "&::-webkit-scrollbar-thumb": {
                background: `${sbColor}55`,
                borderRadius: "3px",
              },
            }}
          >
            {/* Mientras la ilustración de la izquierda no ha cargado, el panel
                entero muestra solo un spinner del color de la disciplina. La
                <Image> preloader (oculta) dispara onLoad/onError sin que se vea
                nada a medio pintar. */}
            {!imgReady && (
              <Flex
                flex="1"
                w="100%"
                minH={{ base: "40vh", md: "auto" }}
                align="center"
                justify="center"
              >
                {loader ?? comicLoaderPorColor(themeColor)}
                <Image
                  src={encodeURI(current.src)}
                  alt=""
                  position="absolute"
                  w="1px"
                  h="1px"
                  opacity={0}
                  pointerEvents="none"
                  onLoad={() => setImgLoaded((s) => ({ ...s, [index]: true }))}
                  onError={() => setImgFailed((s) => ({ ...s, [index]: true }))}
                />
              </Flex>
            )}

            {imgReady && !hideFoto && (
            <Box
              // Desktop (md): foto cuadrada a la izquierda, vista lado a lado.
              // Móvil / tablet (base): hero a TODO el ancho que marca el ancho
              //   del box y cubre la parte de arriba (nada de cuadrado centrado
              //   con márgenes: quedaba amorfo).
              // Vertical (9:16): columna estrecha en desktop; en móvil la foto
              // entera centrada (alto limitado por el viewport, no recortada).
              w={{ base: "100%", md: fotoVertical ? "250px" : "440px" }}
              maxW={{ base: "100%", md: fotoVertical ? "250px" : "440px" }}
              // En móvil la foto es 1:1 (cuadrada, como la ilustración
              // original), no el hero ancho de 36vh que la recortaba.
              h={{
                base: fotoVertical ? "52vh" : "auto",
                md: "auto",
              }}
              aspectRatio={{
                base: fotoVertical ? "auto" : 1,
                md: fotoVertical ? 9 / 16 : 1,
              }}
              flexShrink={0}
              alignSelf={{ base: fotoVertical ? "center" : "stretch", md: "center" }}
              mt={{ base: fotoVertical ? 5 : 0, md: 0 }}
              position="relative"
              // Luz alrededor de la ilustración: tres capas, de dentro a fuera.
              // Un filo blanco corto que despega la foto del box, un halo medio
              // del color del cómic y un resplandor amplio muy tenue.
              //
              // Solo de `md` hacia arriba, que es cuando la foto va al lado del
              // texto. Mientras la maquetación es la de móvil (foto arriba,
              // texto debajo) el halo se recorta contra los bordes de la caja y
              // parece una mancha de luz; además los filtros son costosos de
              // pintar justo donde menos potencia hay. Ojo: el corte tiene que
              // ser en `md` y no en `sm`, para que coincida con el cambio de
              // maquetación.
              filter={{
                base: "none",
                md: `drop-shadow(0 0 10px rgba(255,255,255,0.26)) drop-shadow(0 0 26px ${themeColor}55) drop-shadow(0 0 56px ${themeColor}2b)`,
              }}
            >
              {!imgFailed[index] ? (
                <>
                  <Image
                    src={encodeURI(current.src)}
                    alt={`Viñeta ${index + 1}`}
                    w="100%"
                    h="100%"
                    // La ilustración es cuadrada y el hueco también, así que
                    // `contain` la enseña entera sin recortar nada, igual que en
                    // escritorio. Vertical (9:16): contain SIEMPRE.
                    objectFit="contain"
                    borderRadius="lg"
                    opacity={imgLoaded[index] ? 1 : 0}
                    transition="opacity 0.4s ease"
                    onLoad={() => setImgLoaded((s) => ({ ...s, [index]: true }))}
                    onError={() => setImgFailed((s) => ({ ...s, [index]: true }))}
                  />
                  {/* Mientras la viñeta carga, el loader de la disciplina. */}
                  {!imgLoaded[index] && (
                    <Box position="absolute" inset="0" display="flex" alignItems="center" justifyContent="center">
                      {loader ?? comicLoaderPorColor(themeColor)}
                    </Box>
                  )}
                </>
              ) : (
                <Flex
                  w="100%"
                  h="100%"
                  align="center"
                  justify="center"
                  direction="column"
                  gap={2}
                  px={4}
                  textAlign="center"
                  bg="rgba(8,13,30,0.55)"
                  border={`1px dashed ${themeColor}44`}
                  borderRadius="2xl"
                >
                  {/* Sin emoji: si no hay ilustración, solo el aviso en texto. */}
                  <Text color={`${themeColor}cc`} fontSize="sm" fontStyle="italic">
                    Viñeta {index + 1} próximamente
                  </Text>
                </Flex>
              )}
            </Box>
            )}

            {imgReady && (
            <Box
              ref={textScrollRef}
              flex="1"
              minW={0}
              w={{ base: "100%", md: "auto" }}
              alignSelf={{ base: "auto", md: "stretch" }}
              // Escritorio: contenedor con su propio scroll vertical. El texto
              // arranca arriba (flex-start) con un margen superior constante, así
              // que empieza siempre en el mismo sitio sin cortarse por arriba.
              maxH={{ base: "none", md: "100%" }}
              overflowY={{ base: "visible", md: "auto" }}
              overflowX="hidden"
              display="flex"
              flexDirection="column"
              justifyContent="flex-start"
              pt={{ base: 0, md: 6 }}
              pb={{ base: 9, md: 6 }}
              // pl > 0 SIEMPRE: el texto arranca alineado a la izquierda y su
              // glow (textShadow) se extiende hacia la izquierda; con pl:0 +
              // overflowX:hidden ese halo se recortaba en seco contra el borde
              // del contenedor (una raya vertical de luz cortada, poco pro).
              // El padding le da aire para que la luz respire sin recortarse.
              pl={{ base: 5, md: 4 }}
              // 14 (56px) en escritorio = los 4 de antes + los 10 que se le
              // quitaron a la fila. El texto queda donde estaba; lo que se ha
              // movido a la derecha es la barra de scroll.
              pr={{ base: 5, md: 14 }}
              sx={{
                "&::-webkit-scrollbar": { width: "6px" },
                "&::-webkit-scrollbar-track": { background: "transparent" },
                "&::-webkit-scrollbar-thumb": {
                  background: `${sbColor}55`,
                  borderRadius: "3px",
                },
                "&::-webkit-scrollbar-thumb:hover": { background: `${sbColor}88` },
                scrollbarWidth: "thin",
                scrollbarColor: `${sbColor}55 transparent`,
              }}
            >
              {/* Encabezado opcional (antetítulo + título + separador) */}
              {current.eyebrow && (
                <Text color={tituloColor} fontSize={{ base: "xs", md: "sm" }} fontWeight={700} letterSpacing="0.14em"
                      textTransform="uppercase" mb={2} textAlign={{ base: "center", md: "left" }}
                      style={{ textShadow: tituloShadow }}>
                  {current.eyebrow}
                </Text>
              )}
              {current.titulo && (
                <Text color={tituloColor} fontSize={{ base: "2xl", md: "3xl" }} fontWeight={700} lineHeight="1.2"
                      mb={{ base: 4, md: 5 }} textAlign={{ base: "center", md: "left" }}
                      style={{ textShadow: tituloShadow }}>
                  {current.titulo}
                </Text>
              )}

              {/* Cada bloque se pinta con separación (línea en blanco) respecto
                  al anterior. Con `separarFrases`, además, cada frase (tras un
                  punto) es su propio bloque → texto más aireado y limpio. */}
              {(separarFrases
                ? current.paragraphs
                    .flatMap((p) => p.split(/(?<=\.)\s+/))
                    .map((s) => s.trim())
                    .filter(Boolean)
                : current.paragraphs
              ).map((bloque, i) => (
                <Text
                  key={i}
                  color={textColor ?? themeColor}
                  // Tamaño ÚNICO del texto de lectura en TODA la app (cómics,
                  // ilustraciones y boxes de lectura): siempre igual y bien visible.
                  // `textSize` lo puede bajar puntualmente (astrología en su intro).
                  fontSize={textSize ?? { base: "2xl", md: "3xl" }}
                  lineHeight="1.9"
                  letterSpacing="0.02em"
                  textAlign={{ base: "center", md: "left" }}
                  fontWeight="400"
                  mt={i === 0 ? 0 : { base: 5, md: 6 }}
                  style={{ textShadow }}
                >
                  {bloque}
                </Text>
              ))}
              {/* Contenido extra de la página (p.ej. el mini-test del elemento). */}
              {pageExtra && (() => {
                const extra = pageExtra(index, { goNext, isLast });
                return extra ? <Box mt={{ base: 6, md: 7 }}>{extra}</Box> : null;
              })()}
            </Box>
            )}
          </Flex>

          {/* Línea de luz inferior (se oculta con `sinSombra`). */}
          {!sinSombra && (
          <Box
            position="absolute"
            bottom="-1px"
            left="15%"
            right="15%"
            h="1px"
            bgGradient={`linear(to-r, transparent, ${themeColor}aa, transparent)`}
            zIndex={3}
          />
          )}

          {/* Contador de página. Usa el color del texto (si se pasó, p.ej. el
              verde oscuro de Nutrición) para que sea legible sobre fotos claras;
              si no, cae en el acento como el resto de cómics. */}
          <Text
            position="absolute"
            bottom={{ base: 2, md: 3 }}
            right={{ base: 3, md: 4 }}
            color={`${textColor ?? themeColor}99`}
            fontSize={{ base: "xs", md: "sm" }}
            fontStyle="italic"
            letterSpacing="0.18em"
            style={{ textShadow: glowTextSoft }}
            zIndex={3}
          >
            {index + 1} / {total}
          </Text>
        </Box>
      </ModalBody>
    </>
  );
}
