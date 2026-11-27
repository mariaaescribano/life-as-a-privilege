import { FONDO_PAGINA_TURQUESA } from "../../GlobalVariables";
import { MandalaTinte } from "./MandalaTinte";
import React, { useEffect, useState } from "react";
import { Box, Flex, Image, Text } from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";
import { cerrarSesionLocal, esAdminDesbloqueado, esSoloLectura, rutaHome } from "../../api/sesion";
import { salirDeLaPersona, personaActiva, esMariaMirando } from "../../api/persona";
// (Premium aparcado) import { getUserMe } from "../../api/userMe";
import { useT } from "../../i18n";
import SelectorIdioma from "./SelectorIdioma";
import MenuHamburguesa, { type ItemMenu } from "./MenuHamburguesa";
import { focoBlanco } from "./foco";
import { claveDeRutaMetodo } from "../../data/camino";
import { marcarVisto } from "../../hooks/useCaminoVistos";

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
    // «/metodo/astrologia» a secas es la puerta del cómic de la historia espiritual (EMPEZAR), no
    // un paso: ni se recuerda para «Continuar» ni cuenta como página vista.
    const esPuertaDelComic = location.pathname.toLowerCase().replace(/\/+$/, "") === "/metodo/astrologia";
    if (location.pathname.toLowerCase().startsWith("/metodo/") && !esPuertaDelComic) {
      try { localStorage.setItem("ultimoRecorrido", location.pathname + location.search); } catch { /* noop */ }
    }
  }, [location.pathname, location.search]);

  // El tick del camino lo pone la PERSONA, no María, y solo cuando ha visto el contenido de la
  // página (no al abrirla): al llegar al final de la página, o de lo que scrollea dentro. Una
  // página que cabe entera en pantalla cuenta como vista tras unos segundos con la persona
  // interactuando (tocar, teclear o scrollear). María (en su sesión o mirando a alguien) nunca marca.
  useEffect(() => {
    const ruta = location.pathname;
    const esPuertaDelComic = ruta.toLowerCase().replace(/\/+$/, "") === "/metodo/astrologia";
    const clave = claveDeRutaMetodo(ruta);
    if (!ruta.toLowerCase().startsWith("/metodo/") || esPuertaDelComic || !clave) return;
    if (esMariaMirando() || !localStorage.getItem("userId")) return;

    let hecho = false;
    let interactuo = false;
    const visto = () => {
      if (hecho) return;
      hecho = true;
      limpiar();
      marcarVisto(clave, ruta);
    };
    const alFinal = (el: Element | Document | null) => {
      const e = (el instanceof Document ? el.scrollingElement : el) as HTMLElement | null;
      if (!e) return false;
      return e.scrollHeight - e.scrollTop - e.clientHeight <= 80 && e.scrollHeight > e.clientHeight + 40;
    };
    const alScroll = (ev: Event) => {
      interactuo = true;
      if (alFinal(ev.target as Element | Document)) visto();
    };
    const alToque = () => { interactuo = true; };
    // Página que cabe entera: sin scroll posible, vale con haber estado ahí e interactuado.
    const temporizador = window.setInterval(() => {
      const raiz = document.scrollingElement;
      const cabe = !raiz || raiz.scrollHeight <= raiz.clientHeight + 40;
      if (cabe && interactuo && document.visibilityState === "visible") visto();
    }, 4000);
    function limpiar() {
      window.clearInterval(temporizador);
      document.removeEventListener("scroll", alScroll, true);
      document.removeEventListener("pointerdown", alToque, true);
      document.removeEventListener("keydown", alToque, true);
    }
    document.addEventListener("scroll", alScroll, true);
    document.addEventListener("pointerdown", alToque, true);
    document.addEventListener("keydown", alToque, true);
    return limpiar;
  }, [location.pathname]);

  const hasSession = !!localStorage.getItem("userId");
  // Premium APARCADO: detección de cuentas solo-Premium comentada.
  // // Cuenta solo de Premium: el menú se reduce a Podcasts y Reels. Se recuerda en el
  // // navegador para no parpadear y se confirma con /user/me.
  // const [soloPremium, setSoloPremium] = useState<boolean>(() => hasSession && esSoloPremium());
  // useEffect(() => {
  //   if (!hasSession) return;
  //   let vivo = true;
  //   getUserMe()
  //     .then(({ data }) => {
  //       const es = data?.solo_premium === true;
  //       recordarSoloPremium(es);
  //       if (vivo) setSoloPremium(es);
  //     })
  //     .catch(() => { /* sin red: se queda lo recordado */ });
  //   return () => { vivo = false; };
  // }, [hasSession]);
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
  // const isContactoPage = path.startsWith("/contacto");
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
  const adminArquetiposActive = path.startsWith("/admin/astrologia-textos");
  const adminSuscriptoresActive = path.startsWith("/admin/suscriptores");
  const adminLecturasActive = path.startsWith("/admin/lecturas");
  // const adminPremiumActive = path.startsWith("/admin/premium"); // Premium (admin) aparcado
  const adminInformesActive = path.startsWith("/admin/informes");
  const adminCorreosActive = path.startsWith("/admin/correos");

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
  const itAsesorias: ItemMenu = { etiqueta: t("header.asesorias"), onSelect: () => navigate("/asesoria"), activo: path.startsWith("/asesoria") };
  const itRecursos: ItemMenu = { etiqueta: t("header.formacion"), onSelect: () => navigate("/materiales"), activo: isMaterialesPage };
  const itQuienSoy: ItemMenu = { etiqueta: t("header.quienSoy"), onSelect: () => navigate("/quienSoy"), activo: path.startsWith("/quiensoy") };
  // Menú desplegable (hamburguesa): Asesorías, las cuatro perspectivas (portada de cada disciplina) y luego Recursos y Quién soy.
  const itemsWeb: ItemMenu[] = [
    itAsesorias,
    { etiqueta: t("header.psicologia"), onSelect: () => navigate("/disciplina/psicologia"), activo: path.startsWith("/disciplina/psicologia") },
    { etiqueta: t("header.cuerpo"),     onSelect: () => navigate("/disciplina/fisiologia"), activo: path.startsWith("/disciplina/fisiologia") },
    { etiqueta: t("header.filosofia"),  onSelect: () => navigate("/disciplina/cultura"),    activo: path.startsWith("/disciplina/cultura") },
    { etiqueta: t("header.astrologia"), onSelect: () => navigate("/disciplina/astrologia"), activo: path.startsWith("/disciplina/astrologia") },
    itRecursos,
    itQuienSoy,
    // Premium APARCADO (ver App.tsx): { etiqueta: t("header.premium"), onSelect: () => navigate("/premium"), activo: path.startsWith("/premium") },
  ];
  // Las opciones a la vista en el centro del header (solo en ordenador): estas tres.
  const itemsArriba: ItemMenu[] = [itAsesorias, itRecursos, itQuienSoy];

  // Premium APARCADO: el menú de las cuentas solo-Premium (Podcasts, Reels) y su detección están comentados.
  // const itemsPremium: ItemMenu[] = [
  //   { etiqueta: t("premium.espacio.podcasts"), onSelect: () => navigate("/premium/podcasts"), activo: path.startsWith("/premium/podcasts") },
  //   { etiqueta: t("premium.espacio.reels"),    onSelect: () => navigate("/premium/reels"),    activo: path.startsWith("/premium/reels") },
  // ];
  const premiumSolo = false; // antes: isPrivate && soloPremium && !isAdminPage

  // Cerrar sesión desde el menú, para que nadie se quede sin salida. Dentro del
  // camino de una persona (María en el de ella) cerrar sesión la echaría del
  // todo: lo que toca es volver a Asesorías, que cierra ese camino.
  const enCaminoDePersona = personaActiva() !== null;
  // La cuenta «solo carta» NO es una cuenta de verdad, es un espacio prestado para leer su carta: ni foto, ni «Mi cuenta»,
  // ni menú. María, abriendo su camino, lo ve igual (solo con su salida «Volver a Asesorías» en el menú).
  const sinCuenta = esSoloLectura();
  const itemSalir: ItemMenu = enCaminoDePersona
    ? { etiqueta: t("header.volverAsesorias"), onSelect: () => salirDeLaPersona() }
    : { etiqueta: t("cuenta.cerrarSesion"), onSelect: () => { cerrarSesionLocal(); navigate("/welcome"); } };

  // DENTRO: la persona en su espacio, o María en el de ella. Ahí el menú se
  // queda en lo justo —Home, Mi cuenta y salir— y la cabecera no lleva las
  // opciones de la web pública. María con el panel de admin sin entrar en el
  // espacio de nadie no cuenta: tiene el suyo.
  const dentro = isPrivate && !isAdminPage && !premiumSolo && !esAdminDesbloqueado();
  // El nombre que María asignó a la cuenta, para la marca de dentro (nunca en el panel ni con el panel desbloqueado).
  const nombrePersona = isPrivate && !isAdminPage && (!esAdminDesbloqueado() || sinCuenta)
    ? (localStorage.getItem("name") ?? "").trim().replace(/\s+/g, " ")
    : "";

  const items: ItemMenu[] = dentro
    ? [
        ...(sinCuenta ? [] : [
          { etiqueta: t("header.home"),     onSelect: () => navigate(homeTarget),     activo: path === "/home" },
          { etiqueta: t("header.miCuenta"), onSelect: () => navigate("/user/account"), activo: isCuentaPage },
        ]),
        itemSalir,
      ]
    : isPrivate
    ? isAdminPage
      ? [
          { etiqueta: t("header.asesorias"),    onSelect: () => navigate("/admin/asesorias"),          activo: path.startsWith("/admin/asesorias") || path.startsWith("/admin/diario") || path.startsWith("/admin/actividad") },
          { etiqueta: t("header.cursos"),       onSelect: () => navigate("/admin/cursos"),            activo: adminCursosActive },
          // Los textos de los arquetipos de la carta astral.
          { etiqueta: t("header.arquetipos"),   onSelect: () => navigate("/admin/astrologia-textos"), activo: adminArquetiposActive },
          // Los correos apuntados en el formulario de la portada.
          { etiqueta: t("header.suscriptores"), onSelect: () => navigate("/admin/suscriptores"),      activo: adminSuscriptoresActive },
          // Los pedidos de la carta de la lectura (Astrología → Adquirir): datos de nacimiento y acceso a la cuenta.
          { etiqueta: t("header.lecturas"),     onSelect: () => navigate("/admin/lecturas"),             activo: adminLecturasActive },
          // Subir podcasts y reels del contenido premium (desde el móvil). APARCADO.
          // { etiqueta: t("header.premium"),      onSelect: () => navigate("/admin/premium"),            activo: adminPremiumActive },
          // Informes: documentos para clientes en PDF. Correos: los correos que se mandan (con o sin informe).
          { etiqueta: t("header.informes"),     onSelect: () => navigate("/admin/informes"),            activo: adminInformesActive },
          { etiqueta: t("header.correos"),      onSelect: () => navigate("/admin/correos"),             activo: adminCorreosActive },
          itemSalir,
        ]
      : [
          ...itemsWeb,
          // Contáctame aparcado (la página está fuera por ahora): { etiqueta: t("header.contacto"), onSelect: () => navigate("/contacto"), activo: isContactoPage },
          { etiqueta: t("header.miCuenta"), onSelect: () => navigate("/user/account"), activo: isCuentaPage },
        ]
    : [
        ...itemsWeb,
        // Contáctame aparcado: { etiqueta: t("header.contacto"), onSelect: () => navigate("/contacto"), activo: isContactoPage },
        // «Entra a tu cuenta» QUITADO del menú público (nov-2026): a las cuentas se entra desde el correo que María les manda;
        // la ruta /logIn sigue existiendo. { etiqueta: t("header.iniciarSesion"), onSelect: () => navigate("/logIn") },
      ];

  return (
    <Flex
      as="header"
      align="center"
      justify="space-between"
      px={{ base: 5, md: 12 }}
      pt={{ base: 2, md: compact ? 3 : 4 }}
      pb={{ base: compact ? "10px" : "13px", md: compact ? 3 : 4 }}
      bg="#F0DCC0"
      position="sticky"
      top="0"
      // Con el menú abierto la cabecera se pone POR ENCIMA del velo (que va a
      // 300): así el logo sigue encendido y, sobre todo, las tres rayas siguen
      // ahí convertidas en X — cerrar es volver a pulsar donde acabas de
      // pulsar, sin buscar un aspa en otro sitio.
      zIndex={menuAbierto ? 400 : 100}
      borderBottom={`1px solid ${FONDO_PAGINA_TURQUESA}4D`}
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
        <MandalaTinte h={{ base: compact ? "36px" : "40px", md: compact ? "63px" : "70px" }} />
        {/* Con la sesión dentro de un espacio (la persona, o María en su camino) el nombre que María le puso al crear
            la cuenta va arriba, y debajo, más pequeña y en cursiva, la firma. Fuera de eso (web pública, panel) la marca de
            siempre: «MARÍA ESCRIBANO», el nombre arriba y el apellido debajo, empezando en el mismo borde izquierdo. */}
        {nombrePersona ? (
          <Flex direction="column" align="flex-start" lineHeight="1.15" minW={0}>
            <Text
              color={FONDO_PAGINA_TURQUESA}
              fontFamily="'EB Garamond', serif"
              fontWeight="600"
              fontSize={{ base: "12px", md: "20px" }}
              letterSpacing="0.18em"
              textTransform="uppercase"
              // El mismo halo que lleva el mandala de al lado.
              whiteSpace="nowrap"
              overflow="hidden"
              textOverflow="ellipsis"
              maxW={{ base: "140px", md: "340px" }}
            >
              {nombrePersona}
            </Text>
            <Text
              color={FONDO_PAGINA_TURQUESA}
              fontFamily="'EB Garamond', serif"
              fontStyle="italic"
              fontWeight="500"
              fontSize={{ base: "10px", md: "14px" }}
              letterSpacing="0.08em"
              whiteSpace="nowrap"
            >
              {t("header.con")}{" "}
              <Box as="span" textTransform="capitalize">{t("header.marca").toLowerCase()}</Box>
            </Text>
          </Flex>
        ) : (
        <Flex direction="column" align="flex-start" lineHeight="1.15">
          {t("header.marca").split(" ").map((palabra) => (
            <Text
              key={palabra}
              color={FONDO_PAGINA_TURQUESA}
              fontFamily="'EB Garamond', serif"
              fontWeight="600"
              fontSize={{ base: "12px", md: "20px" }}
              letterSpacing="0.18em"
              // El mismo halo que lleva el mandala de al lado.
              whiteSpace="nowrap"
            >
              {palabra}
            </Text>
          ))}
        </Flex>
        )}
      </Flex>

      {/* ── CENTRO ──
          Las cuatro primeras opciones del menú (por ahora: Asesorías 1:1, Astrología, Formación, Quién soy), a la vista y en medio (solo en
          pantallas anchas; en las demás viven dentro de la hamburguesa, que se
          queda siempre a la derecha). No hay admin: ahí el menú es otro. */}
      {/* Con la sesión dentro (la persona, o María desbloqueada) NUNCA salen las opciones públicas (Asesorías, Astrología…). */}
      {!isAdminPage && !dentro && !isPrivate && (
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
          {itemsArriba.map((it) => (
            <Box
              key={it.etiqueta}
              as="button"
              type="button"
              onClick={it.onSelect}
              color={FONDO_PAGINA_TURQUESA}
              fontFamily="'EB Garamond', serif"
              fontWeight="600"
              fontSize="md"
              letterSpacing="0.14em"
              textTransform="uppercase"
              whiteSpace="nowrap"
              pb="3px"
              borderBottom={it.activo ? `1px solid ${FONDO_PAGINA_TURQUESA}` : "1px solid transparent"}
              _hover={{ borderBottomColor: `${FONDO_PAGINA_TURQUESA}8C` }}
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
        {/* La persona de lectura (sin cuenta) no cambia de idioma: sin «ES · EN». */}
        {(!sinCuenta || !isPrivate) && <SelectorIdioma compact={compact} />}

        {isPrivate && !sinCuenta && (
          <Box
            as="button"
            onClick={() => navigate("/user/account")}
            aria-label={t("header.miCuenta")}
            w={{ base: "40px", md: "50px" }}
            h={{ base: "40px", md: "50px" }}
            borderRadius="full"
            overflow="hidden"
            border={`2px solid ${FONDO_PAGINA_TURQUESA}`}
            cursor="pointer"
            transition="border-color 0.25s ease, box-shadow 0.25s ease"
            _hover={{
              borderColor: FONDO_PAGINA_TURQUESA,
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

        {/* La cuenta «solo carta» va FOCALIZADA: sin menú, solo el camino (el mandala de la izquierda siempre vuelve a él). */}
        {(!sinCuenta || enCaminoDePersona || !isPrivate) && (
          <MenuHamburguesa
            abierto={menuAbierto}
            onToggle={() => setMenuAbierto((v) => !v)}
            onClose={() => setMenuAbierto(false)}
            items={items}
          />
        )}
      </Flex>
    </Flex>
  );
};

export default SiteHeader;
