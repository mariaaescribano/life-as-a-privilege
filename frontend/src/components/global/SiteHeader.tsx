import React, { useEffect, useState } from "react";
import { Box, Flex, Image, Text } from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";
import { rutaHome } from "../../api/sesion";
import { useT } from "../../i18n";
import SelectorIdioma from "./SelectorIdioma";
import MenuHamburguesa, { type ItemMenu } from "./MenuHamburguesa";
import { focoBlanco } from "./foco";

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
  // Solo se pinta una foto que el navegador pueda cargar de verdad (http/https,
  // una ruta del propio sitio o una imagen embebida). Una ruta local guardada
  // por error en la sesión («file:///…», «C:\…») no se puede abrir desde una web:
  // el navegador la rechaza con «Content … may not load or link to file:///».
  const fotoValida = (u: string | null | undefined) =>
    u && /^(https?:\/\/|\/|data:image\/|blob:)/i.test(u.trim()) ? u.trim() : null;
  const avatarSrc  = fotoValida(userImg) ?? fotoValida(sessionImg) ?? "/img/icono/noImg.webp";

  const path = location.pathname.toLowerCase();
  // «El Mapa» ya no está en el menú, así que no hace falta saber si estás en él.
  // const isRecorridoPage = path.startsWith("/elmetodo") || path.startsWith("/checkoutmetodo") || path.startsWith("/metodo/");
  const isMaterialesPage = path.startsWith("/materiales") || path.startsWith("/aprendizaje") || path.startsWith("/libros");
  // Programas: fuera del menú (ver más abajo, en los destinos). La sección
  // sigue existiendo como cuarta caja de Materiales.
  // const isProgramasPage = path.startsWith("/programas");
  const isContactoPage = path.startsWith("/contacto");
  // const isEstudioPage = path.startsWith("/estudio");   // estudio aparcado
  // Vídeos: apartado aparcado (ver más abajo, en los destinos del menú).
  // const isVideosPage = path.startsWith("/videos");
  // La última opción del menú: con sesión es «Mi cuenta», sin ella «Iniciar
  // sesión». Es el mismo sitio visto desde los dos lados de la puerta.
  //
  // «Mi cuenta» sí se marca como página actual; «Iniciar sesión» NO, y por eso
  // no hay aquí ningún `isEntrarPage`: entrar es una acción, no un sitio del
  // menú, así que va sin la rayita de «estás aquí» —una opción más, como las
  // demás— también cuando ya estás en la pantalla de login.
  const isCuentaPage = path.startsWith("/user");
  // Navegación de administración (pestañas en el header).
  const isAdminPage = path.startsWith("/admin");
  const adminCursosActive = path.startsWith("/admin/cursos");
  const adminUsuariosActive = path.startsWith("/admin/usuarios") || path.startsWith("/admin/diario") || path.startsWith("/admin/actividad");
  const adminArquetiposActive = path.startsWith("/admin/astrologia-textos");
  const adminSuscriptoresActive = path.startsWith("/admin/suscriptores");
  const adminPremiumActive = path.startsWith("/admin/premium");

  // Cambiar de página cierra el menú: si no, al volver navegando el panel
  // seguiría abierto encima de la página nueva.
  useEffect(() => { setMenuAbierto(false); }, [location.pathname]);

  // Destinos del menú: en administración, las dos pestañas de admin; y fuera de
  // ella los mismos sitios con sesión y sin ella —El Mapa, Materiales, Estudio
  // y Contactar— cambiando solo la última opción: «Mi cuenta» con sesión,
  // «Iniciar sesión» sin ella.
  //
  // «Programas» estaba pegado a «Materiales», pero se ha quitado del menú: ya
  // es la cuarta cajita DENTRO de Materiales, así que aquí solo repetía puerta.
  // La sección sigue viva (/programas y su página), solo desaparece de aquí.
  //
  // «Vídeos» iba justo detrás de «Materiales» (las dos secciones de contenido
  // suelto, lo que se ve sin recorrer el mapa), pero el apartado está aparcado:
  // sus dos entradas quedan comentadas, igual que la ruta /videos en App.tsx.
  //
  // Mi cuenta va también en el menú aunque el avatar lleve al mismo sitio: el
  // avatar es un icono sin rótulo y no todo el mundo lo lee como un botón.
  //
  // Las opciones de la web, iguales con sesión y sin ella (cambia solo la
  // última). «El Mapa» y «Materiales» salieron del menú mientras esas páginas
  // no se usan; las rutas /elMetodo y /materiales siguen vivas.
  const itemsWeb: ItemMenu[] = [
    { etiqueta: t("header.asesoria"),    onSelect: () => navigate("/asesoria"),    activo: path.startsWith("/asesoria") },
    { etiqueta: t("header.premium"),     onSelect: () => navigate("/premium"),     activo: path.startsWith("/premium") },
    { etiqueta: t("header.disciplinas"), onSelect: () => navigate("/disciplinas"), activo: path.startsWith("/disciplinas") },
    { etiqueta: t("header.material"),    onSelect: () => navigate("/materiales"),   activo: isMaterialesPage },
    { etiqueta: t("header.sobreMi"),     onSelect: () => navigate("/quienSoy"),     activo: path.startsWith("/quiensoy") },
    { etiqueta: t("header.contacto"),    onSelect: () => navigate("/contacto"),     activo: isContactoPage },
  ];

  const items: ItemMenu[] = isPrivate
    ? isAdminPage
      ? [
          { etiqueta: t("header.mapa"),         onSelect: () => navigate("/admin"),                   activo: !adminCursosActive && !adminUsuariosActive && !adminArquetiposActive && !adminSuscriptoresActive && !adminPremiumActive },
          { etiqueta: t("header.cursos"),       onSelect: () => navigate("/admin/cursos"),            activo: adminCursosActive },
          // La tabla de las personas: todas las cuentas con sus disciplinas,
          // sus sesiones, regalar el recorrido y borrar. «El Mapa» mira una
          // disciplina; esta mira una persona (y su diario y su actividad).
          { etiqueta: t("header.usuarios"),     onSelect: () => navigate("/admin/usuarios"),          activo: adminUsuariosActive },
          // Los textos de los arquetipos de la carta astral.
          { etiqueta: t("header.arquetipos"),   onSelect: () => navigate("/admin/astrologia-textos"), activo: adminArquetiposActive },
          // Los correos apuntados en el formulario de la portada.
          { etiqueta: t("header.suscriptores"), onSelect: () => navigate("/admin/suscriptores"),      activo: adminSuscriptoresActive },
          // Subir podcasts y reels del contenido premium (desde el móvil).
          { etiqueta: t("header.premium"),      onSelect: () => navigate("/admin/premium"),            activo: adminPremiumActive },
        ]
      : [
          ...itemsWeb,
          { etiqueta: t("header.miCuenta"), onSelect: () => navigate("/user/account"), activo: isCuentaPage },
        ]
    : [
        ...itemsWeb,
        { etiqueta: t("header.iniciarSesion"), onSelect: () => navigate("/logIn") },
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
      borderBottom="1px solid rgba(255,255,255,0.22)"
    >
      {/* Logo. Es un <button> de verdad (antes era un div con onClick): con el
          tabulador no se podía llegar a él, y es la vuelta a casa. */}
      <Flex
        as="button"
        type="button"
        aria-label={t("header.marca")}
        direction="row"
        align="center"
        cursor="pointer"
        onClick={() => navigate(logoTarget)}
        bg="transparent"
        border="none"
        p="2px"
        borderRadius="lg"
        _hover={{ opacity: 0.85 }}
        _focusVisible={focoBlanco}
        transition="opacity 0.2s"
        gap={{ base: 2, md: 3 }}
      >
        <Image
          src="/img/icono/life.webp"
          alt=""
          h={{ base: compact ? "36px" : "40px", md: compact ? "63px" : "70px" }}
          objectFit="contain"
          style={{ filter: "drop-shadow(0 0 9px rgba(255,255,255,0.35)) drop-shadow(0 0 20px rgba(255,255,255,0.17)) drop-shadow(0 0 42px rgba(180,255,245,0.13))" }}
        />
        {/* La marca es «MARÍA ESCRIBANO»: el nombre arriba y el apellido debajo,
            los dos empezando en el mismo borde izquierdo. */}
        <Flex direction="column" align="flex-start" lineHeight="1.15">
          {t("header.marca").split(" ").map((palabra) => (
            <Text
              key={palabra}
              color="white"
              fontFamily="'EB Garamond', serif"
              fontWeight="600"
              fontSize={{ base: "12px", md: "20px" }}
              letterSpacing="0.18em"
              // El mismo halo que lleva el mandala de al lado.
              textShadow="0 0 9px rgba(255,255,255,0.35), 0 0 20px rgba(255,255,255,0.17)"
              whiteSpace="nowrap"
            >
              {palabra}
            </Text>
          ))}
        </Flex>
      </Flex>

      {/* ── CENTRO ──
          Las cuatro primeras opciones del menú (Asesorías, Premium, Disciplinas, Material), a la vista y en medio (solo en
          pantallas anchas; en las demás viven dentro de la hamburguesa, que se
          queda siempre a la derecha). No hay admin: ahí el menú es otro. */}
      {!isAdminPage && (
        <Flex
          as="nav"
          // Con cuatro opciones hacen falta ~1180 px para que no pisen el nombre
          // de la izquierda; por debajo, viven dentro de la hamburguesa.
          display="none"
          sx={{ "@media (min-width: 1180px)": { display: "flex" } }}
          position="absolute"
          left="50%"
          top="50%"
          transform="translate(-50%, -50%)"
          align="center"
          gap={{ lg: 6, xl: 10 }}
        >
          {itemsWeb.slice(0, 4).map((it) => (
            <Box
              key={it.etiqueta}
              as="button"
              type="button"
              onClick={it.onSelect}
              color="white"
              fontFamily="'EB Garamond', serif"
              fontWeight="600"
              fontSize="md"
              letterSpacing="0.14em"
              textTransform="uppercase"
              whiteSpace="nowrap"
              pb="3px"
              borderBottom={it.activo ? "1px solid rgba(255,255,255,0.85)" : "1px solid transparent"}
              _hover={{ borderBottomColor: "rgba(255,255,255,0.55)" }}
              _focusVisible={focoBlanco}
              transition="border-color 0.2s"
            >
              {it.etiqueta}
            </Box>
          ))}
        </Flex>
      )}

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
            boxShadow="0 0 12px rgba(255,255,255,0.32), 0 0 28px rgba(255,255,255,0.15), 0 0 50px rgba(180,255,245,0.14)"
            transition="border-color 0.25s ease, box-shadow 0.25s ease"
            _hover={{
              borderColor: "white",
              boxShadow: "0 0 18px rgba(255,255,255,0.49), 0 0 42px rgba(180,255,245,0.28)",
            }}
            _focusVisible={{ borderColor: "white", ...focoBlanco }}
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
