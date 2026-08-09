import React, { useEffect, useState } from "react";
import { Box, Flex, Image, Text } from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";
import { rutaHome } from "../../api/sesion";
import { useT } from "../../i18n";
import SelectorIdioma from "./SelectorIdioma";
import MenuHamburguesa, { type ItemMenu } from "./MenuHamburguesa";

type SiteHeaderProps = {
  /**
   * "public"  → logo a /, botones Inicio de sesión / Registrarse
   * "private" → logo a /home, iconos Mi Espacio / Aprendizajes / avatar
   * "auto"    → detecta localStorage: si hay userId → private, si no → public
   */
  variant: "public" | "private" | "auto";
  /**
   * Imagen de perfil del usuario. Úsalo cuando el componente padre gestione
   * el estado del avatar (p.ej. EspacioHome tras subir foto). Si no se pasa,
   * el componente lee localStorage.getItem("img") al montarse.
   */
  userImg?: string;
};

const SiteHeader = ({ variant, userImg }: SiteHeaderProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const t = useT();
  const [sessionImg] = useState<string | null>(() => localStorage.getItem("img"));
  const [menuAbierto, setMenuAbierto] = useState(false);

  // Recordamos la última página del Mapa (recorrido) visitada, para que /home
  // pueda ofrecer «Continuar por dónde lo dejé». Persiste en localStorage, así
  // sigue ahí por mucho tiempo que pase entre sesiones.
  useEffect(() => {
    if (location.pathname.toLowerCase().startsWith("/metodo/")) {
      try { localStorage.setItem("ultimoRecorrido", location.pathname + location.search); } catch { /* noop */ }
    }
  }, [location.pathname, location.search]);

  const hasSession = !!localStorage.getItem("userId");
  const isPrivate  = variant === "private" || (variant === "auto" && hasSession);
  // En el área privada (logueado: /home, /metodo, …) el header es ~10% más compacto.
  const compact = isPrivate;
  // Para admins el "home" es el panel de administración (ver rutaHome()).
  // Sin sesión el "home" es la raíz, que vuelve a ser la portada de Life as a
  // Privilege (mientras la casa enseñe un solo proyecto). Si algún día «/» pasa
  // a ser la landing de dos proyectos, esto tiene que volver a «/welcome»: el
  // mandala de dentro del proyecto no puede echarte fuera de él.
  const homeTarget = isPrivate ? rutaHome() : "/";
  const logoTarget = homeTarget;
  const avatarSrc  = userImg ?? sessionImg ?? "/img/icono/noImg.png";

  const path = location.pathname.toLowerCase();
  const isRecorridoPage = path.startsWith("/elmetodo") || path.startsWith("/checkoutmetodo") || path.startsWith("/metodo/");
  const isMaterialesPage = path.startsWith("/materiales") || path.startsWith("/aprendizaje") || path.startsWith("/libros");
  const isEstudioPage = path.startsWith("/estudio");
  // Navegación de administración (pestañas en el header).
  const isAdminPage = path.startsWith("/admin");
  const adminCursosActive = path.startsWith("/admin/cursos");

  // Cambiar de página cierra el menú: si no, al volver navegando el panel
  // seguiría abierto encima de la página nueva.
  useEffect(() => { setMenuAbierto(false); }, [location.pathname]);

  // Destinos del menú. Son EXACTAMENTE los que antes estaban escritos en la
  // cabecera: en administración, las dos pestañas de admin; con sesión,
  // Materiales y Estudio (a Mi cuenta se va por el avatar, que sigue fuera); y
  // sin sesión, además, El Mapa.
  const items: ItemMenu[] = isPrivate
    ? isAdminPage
      ? [
          { etiqueta: t("header.mapa"),   onSelect: () => navigate("/admin"),        activo: !adminCursosActive },
          { etiqueta: t("header.cursos"), onSelect: () => navigate("/admin/cursos"), activo: adminCursosActive },
        ]
      : [
          { etiqueta: t("header.materiales"), onSelect: () => navigate("/materiales"), activo: isMaterialesPage },
          { etiqueta: t("header.estudio"),    onSelect: () => navigate("/estudio"),    activo: isEstudioPage },
        ]
    : [
        { etiqueta: t("header.mapa"),       onSelect: () => navigate("/elMetodo"),   activo: isRecorridoPage },
        { etiqueta: t("header.materiales"), onSelect: () => navigate("/materiales"), activo: isMaterialesPage },
        { etiqueta: t("header.estudio"),    onSelect: () => navigate("/estudio"),    activo: isEstudioPage },
      ];

  return (
    <Flex
      as="header"
      align="center"
      justify="space-between"
      px={{ base: 5, md: 12 }}
      pt={{ base: 2, md: compact ? 3 : 4 }}
      pb={{ base: compact ? "10px" : "13px", md: compact ? 3 : 4 }}
      bg="#008080"
      position="sticky"
      top="0"
      // Con el menú abierto la cabecera se pone POR ENCIMA del velo (que va a
      // 300): así el logo sigue encendido y, sobre todo, las tres rayas siguen
      // ahí convertidas en X — cerrar es volver a pulsar donde acabas de
      // pulsar, sin buscar un aspa en otro sitio.
      zIndex={menuAbierto ? 400 : 100}
      borderBottom="1px solid rgba(255,255,255,0.12)"
    >
      {/* Logo */}
      <Flex
        direction="column"
        align="center"
        cursor="pointer"
        onClick={() => navigate(logoTarget)}
        _hover={{ opacity: 0.85 }}
        transition="opacity 0.2s"
        gap="2px"
      >
        <Image
          src="/img/icono/life.png"
          h={{ base: compact ? "36px" : "40px", md: compact ? "63px" : "70px" }}
          objectFit="contain"
          style={{ filter: "drop-shadow(0 0 9px rgba(255,255,255,0.78)) drop-shadow(0 0 20px rgba(255,255,255,0.38)) drop-shadow(0 0 42px rgba(180,255,245,0.28))" }}
        />
        <Text
          color="rgba(255,255,255,0.85)"
          fontFamily="'EB Garamond', serif"
          fontWeight="600"
          fontSize={{ base: "7px", md: "11px" }}
          letterSpacing="0.18em"
          textShadow="0 0 8px rgba(255,255,255,0.55), 0 0 16px rgba(255,255,255,0.3)"
          whiteSpace="nowrap"
        >
          {t("header.marca")}
        </Text>
      </Flex>

      {/* ── LADO DERECHO ──
          Ya no lleva los enlaces escritos uno detrás de otro: todos viven
          dentro del menú de hamburguesa. Aquí se queda solo lo que NO es
          navegación (el idioma, que es una preferencia) y el avatar, que es
          identidad y tiene que verse siempre. El botón del menú va el último,
          pegado al margen derecho. */}
      <Flex align="center" gap={{ base: 3, md: 5 }}>
        <SelectorIdioma compact={compact} />

        {isPrivate && (
          <Box
            as="button"
            onClick={() => navigate("/user/account")}
            aria-label={t("header.miCuenta")}
            w={{ base: "40px", md: "50px" }}
            h={{ base: "40px", md: "50px" }}
            borderRadius="full"
            overflow="hidden"
            border="2px solid rgba(255,255,255,0.7)"
            bg="rgba(255,255,255,0.08)"
            cursor="pointer"
            boxShadow="0 0 12px rgba(255,255,255,0.45), 0 0 28px rgba(255,255,255,0.22), 0 0 50px rgba(180,255,245,0.2)"
            transition="border-color 0.25s ease, box-shadow 0.25s ease"
            _hover={{
              borderColor: "white",
              boxShadow: "0 0 18px rgba(255,255,255,0.7), 0 0 42px rgba(180,255,245,0.4)",
            }}
            flexShrink={0}
            p={0}
          >
            <Image
              src={avatarSrc}
              alt={t("header.miCuenta")}
              w="100%"
              h="100%"
              objectFit="cover"
            />
          </Box>
        )}

        <MenuHamburguesa
          abierto={menuAbierto}
          onToggle={() => setMenuAbierto((v) => !v)}
          onClose={() => setMenuAbierto(false)}
          items={items}
        />
      </Flex>
    </Flex>
  );
};

export default SiteHeader;
