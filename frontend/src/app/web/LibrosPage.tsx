import { useT } from "../../i18n";
import React, { useEffect, useRef, useState } from "react";
import { Box, Flex, Grid, Image, Text, useToast } from "@chakra-ui/react";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { LifeLoader } from "../../components/metodo/comicLoaders";
import { apuntes, libros, librosPago, type Apunte, type Libro, type LibroPago } from "../../hardCoded/libros/libros";
import { API_URL } from "../../GlobalVariables";

const PRECIO_LIBRO_PAGO = "5 €";

// Reveal por scroll: cada tarjeta se enciende al entrar en el viewport.
// rootMargin negativo abajo → aparece un pelín antes de estar del todo dentro,
// que es lo que da la sensación de que los libros van "brotando" al bajar.
const useReveal = (threshold = 0.15) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold, rootMargin: "0px 0px -8% 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
};

function DescargarBtn({
  href,
  onClick,
  disabled = false,
  label,
  icon = "↓",
}: {
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  label?: string;
  icon?: string;
}) {
  const t = useT();
  const labelTxt = label ?? t("libros.descargarPdf");
  const isLink = !onClick && !!href;
  const commonProps = {
    align: "center" as const,
    justify: "center" as const,
    gap: 2,
    px: { base: 5, md: 6 },
    py: { base: "8px", md: "10px" },
    borderRadius: "full",
    border: "1px solid rgba(255,255,255,0.5)",
    bg: "rgba(255,255,255,0.06)",
    cursor: disabled ? "not-allowed" : "pointer",
    color: "white",
    fontFamily: "'EB Garamond', serif",
    fontWeight: "600",
    fontSize: "xs",
    letterSpacing: "0.16em",
    textTransform: "uppercase" as const,
    textDecoration: "none",
    boxShadow: "0 0 12px rgba(255,255,255,0.25), 0 0 28px rgba(255,255,255,0.12)",
    textShadow: "0 0 10px rgba(255,255,255,0.38), 0 0 22px rgba(255,255,255,0.21)",
    _hover: disabled ? {} : {
      bg: "rgba(255,255,255,0.16)",
      borderColor: "rgba(255,255,255,0.85)",
      boxShadow: "0 0 20px rgba(255,255,255,0.45), 0 0 42px rgba(180,255,245,0.28)",
    },
    transition: "all 0.25s ease",
    whiteSpace: "nowrap" as const,
    opacity: disabled ? 0.6 : 1,
  };

  if (isLink) {
    return (
      <Flex as="a" href={href} target="_blank" rel="noopener noreferrer" {...commonProps}>
        {labelTxt}
        <Box as="span" fontSize="sm" style={{ textShadow: "0 0 8px rgba(255,255,255,0.45)" }}>
          {icon}
        </Box>
      </Flex>
    );
  }

  return (
    <Flex as="button" onClick={disabled ? undefined : onClick} disabled={disabled} {...commonProps}>
      {labelTxt}
      <Box as="span" fontSize="sm" style={{ textShadow: "0 0 8px rgba(255,255,255,0.45)" }}>
        {icon}
      </Box>
    </Flex>
  );
}

type Item = { id: string; img?: string; titulo: string; link: string };
type PaidItem = Item & { descripcion: string };

const LINE = "1px solid rgba(255,255,255,0.22)";

function PaidBookCell({ item, i, total }: { item: PaidItem; i: number; total: number }) {
  const lastRowStart2 = total - ((total % 2) || 2);
  const [loading, setLoading] = useState(false);
  // Igual que en el pago de las disciplinas: el PDF se entrega al instante, así
  // que hay que recoger el consentimiento expreso y la renuncia al desistimiento
  // ANTES de cobrar (art. 103.m TRLGDCU). Sin marcar, no se puede comprar.
  const [acepta, setAcepta] = useState(false);
  const { ref, visible } = useReveal();
  const toast = useToast();
  const t = useT();

  const handleComprar = async () => {
    if (loading || !acepta) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/payment/libros/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ libroId: item.id }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: { url?: string } = await res.json();
      if (!data.url) throw new Error("Sin URL de checkout");
      window.location.href = data.url;
    } catch (err) {
      console.error("Error iniciando checkout:", err);
      toast({
        title: t("libros.pagoError"),
        description: t("libros.pagoErrorTexto"),
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      setLoading(false);
    }
  };

  return (
    <Flex
      ref={ref}
      direction="row"
      align="center"
      gap={{ base: 5, md: 7 }}
      px={{ base: 5, md: 8 }}
      py={{ base: 7, md: 10 }}
      opacity={visible ? 1 : 0}
      transform={visible ? "translateY(0)" : "translateY(24px)"}
      transition={`opacity 0.7s ease ${(i % 2) * 0.12}s, transform 0.7s ease ${(i % 2) * 0.12}s`}
      sx={{
        "@media (max-width: 767px)": {
          borderBottom: i < total - 1 ? LINE : "none",
        },
        "@media (min-width: 768px)": {
          borderRight: i % 2 === 0 ? LINE : "none",
          borderBottom: i < lastRowStart2 ? LINE : "none",
        },
      }}
    >
      {item.img && (
        <Box
          flexShrink={0}
          w={{ base: "150px", md: "210px" }}
          aspectRatio={1}
          borderRadius="lg"
          overflow="hidden"
          boxShadow="0 0 22px rgba(255,255,255,0.34), 0 0 48px rgba(255,255,255,0.18), 0 6px 22px rgba(0,0,0,0.3)"
        >
          <Image
            src={item.img}
            alt={item.titulo}
            w="100%"
            h="100%"
            objectFit="cover"
            objectPosition="center"
            loading="eager"
            decoding="async"
          />
        </Box>
      )}

      <Flex direction="column" gap={{ base: 2, md: 3 }} flex="1" minW={0}>
        <Text
          color="white"
          fontFamily="'EB Garamond', serif"
          fontSize={{ base: "lg", md: "xl" }}
          fontWeight="700"
          letterSpacing="0.04em"
          lineHeight="1.25"
          textShadow="0 0 12px rgba(255,255,255,0.34), 0 0 26px rgba(255,255,255,0.17)"
        >
          {item.titulo}
        </Text>
        <Text
          color="rgba(255,255,255,0.82)"
          fontFamily="'EB Garamond', serif"
          fontSize={{ base: "sm", md: "md" }}
          fontStyle="italic"
          lineHeight="1.5"
          textShadow="0 0 6px rgba(255,255,255,0.14)"
        >
          {item.descripcion}
        </Text>
        <Flex align="center" gap={{ base: 3, md: 4 }} mt={{ base: 1, md: 2 }} flexWrap="wrap">
          <Text
            color="white"
            fontFamily="'EB Garamond', serif"
            fontSize={{ base: "md", md: "lg" }}
            fontWeight="700"
            letterSpacing="0.08em"
            textShadow="0 0 10px rgba(255,255,255,0.41), 0 0 22px rgba(255,255,255,0.21)"
          >
            {PRECIO_LIBRO_PAGO}
          </Text>
          <DescargarBtn
            onClick={handleComprar}
            disabled={loading || !acepta}
            label={loading ? "Cargando…" : "Comprar"}
            icon="→"
          />
        </Flex>

        {/* Consentimiento previo al pago (ver comentario del estado `acepta`). */}
        <Flex
          align="flex-start"
          gap={2.5}
          mt={2}
          cursor="pointer"
          onClick={() => setAcepta((v) => !v)}
          role="checkbox"
          aria-checked={acepta}
        >
          <Flex
            flexShrink={0}
            mt="2px"
            w="18px"
            h="18px"
            borderRadius="4px"
            border={`1.5px solid rgba(255,255,255,${acepta ? 0.9 : 0.45})`}
            bg={acepta ? "rgba(255,255,255,0.9)" : "transparent"}
            align="center"
            justify="center"
            transition="all 0.18s"
          >
            {acepta && (
              <Box as="svg" viewBox="0 0 24 24" w="12px" h="12px" fill="none" stroke="#008080" strokeWidth="3.5">
                <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
              </Box>
            )}
          </Flex>
          <Text
            color="rgba(255,255,255,0.72)"
            fontFamily="'EB Garamond', serif"
            fontSize="xs"
            lineHeight="1.55"
          >
            Acepto las{" "}
            <Text
              as="span"
              textDecoration="underline"
              onClick={(e) => { e.stopPropagation(); window.open("/terminos", "_blank"); }}
              _hover={{ color: "white" }}
            >
              {t("libros.condiciones")}
            </Text>
          </Text>
        </Flex>
      </Flex>
    </Flex>
  );
}

function BookCell({ item, i, total }: { item: Item; i: number; total: number }) {
  const lastRowStart3 = total - ((total % 3) || 3);
  const lastRowStart2 = total - ((total % 2) || 2);
  const { ref, visible } = useReveal();

  return (
    <Flex
      ref={ref}
      direction={{ base: "column", md: "row" }}
      align="center"
      gap={{ base: 3, md: 5 }}
      px={{ base: 3, md: 7 }}
      py={{ base: 5, md: 8 }}
      opacity={visible ? 1 : 0}
      transform={visible ? "translateY(0)" : "translateY(24px)"}
      transition={`opacity 0.7s ease ${(i % 3) * 0.1}s, transform 0.7s ease ${(i % 3) * 0.1}s`}
      sx={{
        "@media (max-width: 1023.98px)": {
          borderRight: i % 2 === 0 ? LINE : "none",
          borderBottom: i < lastRowStart2 ? LINE : "none",
        },
        "@media (min-width: 1024px)": {
          borderRight: i % 3 !== 2 ? LINE : "none",
          borderBottom: i < lastRowStart3 ? LINE : "none",
        },
      }}
    >
      {/* Foto */}
      {item.img && (
        <Box
          flexShrink={0}
          w={{ base: "100px", md: "110px" }}
          aspectRatio={1}
          borderRadius="lg"
          overflow="hidden"
          boxShadow="0 0 14px rgba(255,255,255,0.28), 0 0 32px rgba(255,255,255,0.14), 0 4px 16px rgba(0,0,0,0.22)"
        >
          <Image
            src={item.img}
            alt={item.titulo}
            w="100%"
            h="100%"
            objectFit="cover"
            objectPosition="center"
            loading="eager"
            decoding="async"
          />
        </Box>
      )}

      {/* Título + botón debajo */}
      <Flex
        direction="column"
        gap={3}
        flex="1"
        minW={0}
        w={{ base: "100%", md: "auto" }}
        align={{ base: "center", md: "flex-start" }}
        textAlign={{ base: "center", md: "left" }}
      >
        <Text
          color="white"
          fontFamily="'EB Garamond', serif"
          fontSize={{ base: "sm", md: "lg" }}
          fontWeight="700"
          letterSpacing="0.04em"
          lineHeight="1.3"
          textShadow="0 0 10px rgba(255,255,255,0.3), 0 0 22px rgba(255,255,255,0.15)"
        >
          {item.titulo}
        </Text>
        <DescargarBtn href={item.link} />
      </Flex>
    </Flex>
  );
}

export default function LibrosPage() {
  const t = useT();
  const [mounted, setMounted] = useState(false);
  // La página no se muestra hasta que TODAS las portadas están descargadas:
  // así entra ya completa (nada de imágenes cargando a trozos) y transmite
  // que el material está cuidado.
  const [imagesReady, setImagesReady] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  // Precarga de todas las portadas (pago + gratis + apuntes).
  useEffect(() => {
    const urls = [
      ...(librosPago as LibroPago[]),
      ...(libros as Libro[]),
      ...(apuntes as Apunte[]),
    ]
      .map((x) => x.img)
      .filter((src): src is string => Boolean(src));

    if (urls.length === 0) {
      setImagesReady(true);
      return;
    }

    let cancelled = false;
    let done = 0;
    const marcarUna = () => {
      done += 1;
      if (!cancelled && done >= urls.length) setImagesReady(true);
    };

    urls.forEach((src) => {
      const img = new window.Image();
      img.onload = marcarUna;
      img.onerror = marcarUna; // una portada rota no debe colgar la página
      img.src = src;
    });

    // Red de seguridad: si alguna imagen nunca resuelve, mostramos igualmente.
    const failSafe = setTimeout(() => { if (!cancelled) setImagesReady(true); }, 10000);

    return () => { cancelled = true; clearTimeout(failSafe); };
  }, []);

  // Una vez cargadas las imágenes, disparamos la animación de entrada.
  useEffect(() => {
    if (!imagesReady) return;
    const t = setTimeout(() => setMounted(true), 40);
    return () => clearTimeout(t);
  }, [imagesReady]);

  const apuntesItems: Item[] = (apuntes as Apunte[]).map(a => ({
    id: a.id,
    img: a.img,
    titulo: a.titulo,
    link: a.link,
  }));
  const librosItems: Item[] = (libros as Libro[]).map(l => ({
    id: l.id,
    img: l.img,
    titulo: l.titulo,
    link: l.link,
  }));
  const paidItems: PaidItem[] = (librosPago as LibroPago[]).map(p => ({
    id: p.id,
    img: p.img,
    titulo: p.titulo,
    link: p.link,
    descripcion: p.descripcion,
  }));

  // Todo en una sola lista
  const allItems: Item[] = [...librosItems, ...apuntesItems];

  // Mientras se descargan las portadas: fondo teal con la animación de la
  // ESTRELLA de astrología en blanco, centrada (la misma que el recorrido, en
  // lugar del spinner). El header se pinta ya para que cargue antes.
  if (!imagesReady) {
    return (
      <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
        <SiteHeader variant="auto" />
        <Flex flex="1" align="center" justify="center" overflow="hidden">
          <LifeLoader color="#ffffff" />
        </Flex>
      </Box>
    );
  }

  return (
    <Box
      minH="100vh"
      display="flex"
      flexDirection="column"
      bg="#008080"
      fontFamily="'EB Garamond', serif"
    >
      <SiteHeader variant="auto" />

      {/* ── MANDALA SEPARADOR ── */}
      <Flex justify="center" pt={{ base: 10, md: 14 }}>
        <Image
          src="/img/icono/life.png"
          alt=""
          h={{ base: "48px", md: "64px" }}
          objectFit="contain"
          style={{ filter: "drop-shadow(0 0 9px rgba(255,255,255,0.59)) drop-shadow(0 0 21px rgba(255,255,255,0.32)) drop-shadow(0 0 42px rgba(180,255,245,0.24))" }}
          opacity={mounted ? 1 : 0}
          transform={mounted ? "scale(1) rotate(0deg)" : "scale(0.7) rotate(-12deg)"}
          transition="opacity 1s ease 0.1s, transform 1s ease 0.1s"
        />
      </Flex>

      {/* ── TÍTULO ── */}
      <Flex
        direction="column"
        align="center"
        textAlign="center"
        px={{ base: 5, md: 10 }}
        pt={{ base: 6, md: 8 }}
        gap={{ base: 3, md: 4 }}
      >
        <Text
          color="white"
          fontSize={{ base: "3xl", md: "5xl", lg: "6xl" }}
          fontWeight="700"
          letterSpacing="0.1em"
          lineHeight="1.1"
          textTransform="uppercase"
          textShadow="0 0 14px rgba(255,255,255,0.64), 0 0 30px rgba(255,255,255,0.41), 0 0 56px rgba(180,255,245,0.34)"
          opacity={mounted ? 1 : 0}
          transform={mounted ? "translateY(0)" : "translateY(20px)"}
          transition="opacity 0.85s ease 0.25s, transform 0.85s ease 0.25s"
        >
          {t("libros.titulo")}
        </Text>
        <Text
          color="rgba(255,255,255,0.88)"
          fontSize={{ base: "sm", md: "lg" }}
          fontStyle="italic"
          letterSpacing="0.05em"
          lineHeight="1.5"
          textShadow="0 0 8px rgba(255,255,255,0.38), 0 0 18px rgba(255,255,255,0.21)"
          maxW={{ base: "100%", md: "512px" }}
          opacity={mounted ? 1 : 0}
          transform={mounted ? "translateY(0)" : "translateY(13px)"}
          transition="opacity 0.85s ease 0.5s, transform 0.85s ease 0.5s"
        >
          {t("libros.subtitulo")}
        </Text>
      </Flex>

      {/* ── SECCIÓN LIBROS DE PAGO ── */}
      {paidItems.length > 0 && (
        <>
          <Flex
            justify="center"
            w="100%"
            px={{ base: 5, md: 10, lg: 16 }}
            pt={{ base: 20, md: 28 }}
            pb={{ base: 4, md: 6 }}
          >
            <Box w="100%" maxW="1080px" mx="auto">
              {/* Línea superior — cierra el tablero por arriba */}
              <Box
                w="100%"
                h="1px"
                bg="rgba(255,255,255,0.45)"
                boxShadow="0 0 10px rgba(255,255,255,0.35), 0 0 22px rgba(180,255,245,0.22)"
              />
              <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}>
                {paidItems.map((item, i) => (
                  <PaidBookCell
                    key={item.id}
                    item={item}
                    i={i}
                    total={paidItems.length}
                  />
                ))}
              </Grid>
            </Box>
          </Flex>

          {/* Separador horizontal blanco */}
          <Flex justify="center" w="100%" px={{ base: 5, md: 10, lg: 16 }} mt={{ base: 4, md: 6 }}>
            <Box
              w="100%"
              maxW="1080px"
              h="1px"
              bg="rgba(255,255,255,0.45)"
              boxShadow="0 0 10px rgba(255,255,255,0.35), 0 0 22px rgba(180,255,245,0.22)"
            />
          </Flex>
        </>
      )}

      {/* ── PLANTILLA 3 EN RAYA ── */}
      <Flex
        flex={1}
        justify="center"
        w="100%"
        px={{ base: 5, md: 10, lg: 16 }}
        pt={{ base: 11, md: 16 }}
        pb={{ base: 24, md: 32 }}
      >
        <Box w="100%" maxW="880px" mx="auto">
          <Grid templateColumns={{ base: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }} justifyContent="center">
            {allItems.map((item, i) => (
              <BookCell
                key={item.id}
                item={item}
                i={i}
                total={allItems.length}
              />
            ))}
          </Grid>
        </Box>
      </Flex>

      <SiteFooter />
    </Box>
  );
}
