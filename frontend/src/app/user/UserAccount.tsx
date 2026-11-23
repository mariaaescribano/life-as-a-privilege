import React, { useEffect, useRef, useState } from "react";
import { MandalaTinte } from "../../components/global/MandalaTinte";
import { useT } from "../../i18n";
import { Box, Flex, Image, Input, SimpleGrid, Text, VStack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import SiteHeader from "../../components/global/SiteHeader";
import { API_URL, FONDO_PAGINA_BEIGE as BEIGE, FONDO_PAGINA_TURQUESA as T } from "../../GlobalVariables";
import { cerrarSesionLocal } from "../../api/sesion";
import { salirDeLaPersona, personaActiva, cabeceraPersona } from "../../api/persona";
import { encogerFoto } from "../../utils/encogerFoto";
import { LifeLoader } from "../../components/metodo/comicLoaders";

import { inputAuthStyles } from "../../components/global/CampoContrasena";
import { fechaDMA, mascaraDMA, dmaAIso } from "../../utils/fechas";

/** Años cumplidos a partir de la fecha (ISO), o null si no hay fecha válida.
 *  El mismo cálculo que la columna «Edad» de /admin/usuarios. */
const edadDe = (iso: string): number | null => {
  if (!iso) return null;
  const [a, m, d] = iso.slice(0, 10).split("-").map(Number);
  if (!a || !m || !d) return null;
  const hoy = new Date();
  let edad = hoy.getFullYear() - a;
  if (hoy.getMonth() + 1 < m || (hoy.getMonth() + 1 === m && hoy.getDate() < d)) edad -= 1;
  return edad >= 0 && edad < 130 ? edad : null;
};

/** Un dato que se mira y no se toca: sin hover, sin halo de foco y con el cursor quieto. */
const SOLO_LECTURA = {
  cursor: "default",
  _hover: { border: `1.5px solid ${T}66` },
  _focus: { border: `1.5px solid ${T}66`, boxShadow: "none", outline: "none" },
};

const inputStyles = { ...inputAuthStyles, h: "56px" };

export default function UserAccount() {
  const t = useT();
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId") ?? "";
  const token  = localStorage.getItem("token")  ?? "";

  const [img, setImg] = useState<string>(localStorage.getItem("img") ?? "");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contra, setContra] = useState("");
  const [telefono, setTelefono] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  // Lo que se ve y se teclea: día/mes/año. `fechaNacimiento` guarda la ISO (aaaa-mm-dd) que espera el servidor.
  const [fechaTxt, setFechaTxt] = useState("");
  // Cuenta de asesoría: sus datos personales los fija María; aquí solo se ven.
  const [soloLectura, setSoloLectura] = useState(false);
  const [nacCarta, setNacCarta] = useState<{ hora: string; lugar: string }>({ hora: "", lugar: "" });

  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [delPassword, setDelPassword] = useState("");
  const [delWord, setDelWord] = useState("");
  const [delError, setDelError] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [mounted, setMounted] = useState(false);

  const fileRef = useRef<HTMLInputElement>(null);
  const initialRef = useRef({ name: "", email: "", telefono: "", fechaNacimiento: "" });

  useEffect(() => {
    if (!userId) { navigate("/welcome"); return; }
    fetch(`${API_URL}/user/me`, {
      headers: { Authorization: `Bearer ${token}`, ...cabeceraPersona() },
    })
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(u => {
        setName(u.name ?? "");
        setEmail(u.email ?? "");
        setIsAdmin(!!u.is_admin);
        setTelefono(u.telefono ?? "");
        setFechaNacimiento(u.fecha_nacimiento ?? "");
        setFechaTxt(fechaDMA(u.fecha_nacimiento) ?? "");
        setSoloLectura(u.en_sesiones === true);
        initialRef.current = {
          name: u.name ?? "",
          email: u.email ?? "",
          telefono: u.telefono ?? "",
          fechaNacimiento: u.fecha_nacimiento ?? "",
        };
      })
      .catch(() => setError(t("cuenta.error.cargar")))
      .finally(() => setLoading(false));
    // La hora y el lugar de nacimiento de su carta astral (si ya los hay).
    fetch(`${API_URL}/metodo-astrologia/${userId}`, { headers: { Authorization: `Bearer ${token}`, ...cabeceraPersona() } })
      .then(r => (r.ok ? r.json() : null))
      .then(c => {
        if (!c) return;
        setNacCarta({
          hora: (c.hora_nacimiento ?? "").slice(0, 5),
          lugar: [c.lugar, c.region, c.pais].filter(Boolean).join(", "),
        });
      })
      .catch(() => {});
    const temporizador = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(temporizador);
  }, []);

  const handleGuardar = async () => {
    setError("");
    const payload: Record<string, string | null> = {};
    if (name.trim() && name !== initialRef.current.name) payload.name = name.trim();
    if (email.trim() && email !== initialRef.current.email) payload.email = email.trim();
    if (contra.trim()) payload.password = contra.trim();
    // Estos dos se pueden vaciar (vaciar la fecha apaga la felicitación).
    if (telefono.trim() !== initialRef.current.telefono) payload.telefono = telefono.trim() || null;
    if (fechaNacimiento !== initialRef.current.fechaNacimiento) payload.fecha_nacimiento = fechaNacimiento || null;

    if (Object.keys(payload).length === 0) return;
    // El mismo mínimo que al registrarse y al recuperarla.
    if (payload.password && payload.password.length < 6) {
      setError(t("auth.error.contraCorta6"));
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/user/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, ...cabeceraPersona(),
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();
      const updated = await res.json();
      if (updated.name) {
        setName(updated.name);
        localStorage.setItem("name", updated.name);
        initialRef.current.name = updated.name;
      }
      if (updated.email) {
        setEmail(updated.email);
        initialRef.current.email = updated.email;
      }
      if ("telefono" in payload) initialRef.current.telefono = telefono.trim();
      if ("fecha_nacimiento" in payload) initialRef.current.fechaNacimiento = fechaNacimiento;
      setContra("");
      setSaved(true);
      setTimeout(() => setSaved(false), 2200);
    } catch {
      setError(t("cuenta.error.guardar"));
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    // Si María está en el camino de una persona, cerrar sesión aquí la echaría
    // del todo en vez de devolverla a Asesorías. Lo que toca es cerrar el camino.
    if (personaActiva()) {
      salirDeLaPersona();
      return;
    }
    cerrarSesionLocal();
    navigate("/welcome");
  };

  // Cierra el pop-up y limpia los campos de confirmación.
  const cerrarConfirmDelete = () => {
    setConfirmDelete(false);
    setDelPassword("");
    setDelWord("");
    setDelError("");
  };

  // Para eliminar hace falta: contraseña + escribir exactamente la palabra que
  // se pide. La palabra sale del diccionario («BORRAR» / «DELETE»): si se
  // escribiera aquí, en inglés la pantalla pediría una palabra y la
  // comprobación esperaría otra.
  const palabraBorrar = t("cuenta.borrar.palabra");
  const puedeBorrar =
    delPassword.trim().length > 0 && delWord.trim().toUpperCase() === palabraBorrar.toUpperCase();

  const handleDelete = async () => {
    if (!puedeBorrar || deleting) return;
    setDelError("");
    setDeleting(true);
    try {
      const res = await fetch(`${API_URL}/user/${userId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, ...cabeceraPersona(),
        },
        body: JSON.stringify({ password: delPassword.trim() }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        // OJO: cuando el backend manda su propio `message`, llega en español.
        throw new Error(data?.message || t("cuenta.error.eliminar"));
      }
      cerrarSesionLocal();
      navigate("/welcome");
    } catch (err: any) {
      setDelError(err?.message || t("cuenta.error.eliminar"));
      setDeleting(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    // Encogida en el navegador antes de viajar: ~40 kB en vez de varios MB.
    formData.append("file", await encogerFoto(file));
    try {
      const res = await fetch(`${API_URL}/upload/profile-pic/${userId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, ...cabeceraPersona() },
        body: formData,
      });
      const data = await res.json();
      const newUrl = `${data.url}?v=${Date.now()}`;
      setImg(newUrl);
      localStorage.setItem("img", newUrl);
    } catch {
      setError(t("cuenta.error.foto"));
    } finally {
      setUploading(false);
    }
  };

  if (loading) return (
    <Flex minH="100vh" bg={BEIGE} justify="center" align="center">
      <LifeLoader />
    </Flex>
  );

  const hayCambios =
    (name.trim() && name !== initialRef.current.name) ||
    (email.trim() && email !== initialRef.current.email) ||
    !!contra.trim() ||
    telefono.trim() !== initialRef.current.telefono ||
    fechaNacimiento !== initialRef.current.fechaNacimiento;

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg={BEIGE} fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" userImg={img} />

      <Box flex="1" display="flex" flexDirection="column" transform="scale(0.9)" transformOrigin="top center">

      {/* ── MANDALA SEPARADOR ── */}
      <Flex justify="center" pt={{ base: 10, md: 14 }}>
        <MandalaTinte h={{ base: "60px", md: "80px" }} style={{ opacity: mounted ? 1 : 0, transform: mounted ? "scale(1) rotate(0deg)" : "scale(0.7) rotate(-12deg)", transition: "opacity 1s ease 0.1s, transform 1s ease 0.1s" }} />
      </Flex>

      {/* ── TÍTULO ── */}
      <Flex
        direction="column"
        align="center"
        textAlign="center"
        px={{ base: 5, md: 10 }}
        pt={{ base: 8, md: 10 }}
        gap={{ base: 3, md: 4 }}
      >
        <Text
          color={T}
          fontSize={{ base: "4xl", md: "5xl", lg: "6xl" }}
          fontWeight="700"
          letterSpacing="0.1em"
          lineHeight="1.1"
          textTransform="uppercase"
          opacity={mounted ? 1 : 0}
          transform={mounted ? "translateY(0)" : "translateY(24px)"}
          transition="opacity 0.85s ease 0.25s, transform 0.85s ease 0.25s"
        >
          {t("cuenta.titulo")}
        </Text>
      </Flex>

      {/* ── CONTENIDO ── */}
      <Flex flex={1} justify="center" px={{ base: 5, md: 10 }} pt={{ base: 12, md: 16 }} pb={{ base: 24, md: 32 }}>
        <VStack
          // Ancho para DOS columnas de campos; en móvil ocupa todo y la caja
          // interior baja a una sola columna.
          w={{ base: "100%", sm: "520px", md: "780px" }}
          spacing={8}
          align="stretch"
          opacity={mounted ? 1 : 0}
          transform={mounted ? "translateY(0)" : "translateY(28px)"}
          transition="opacity 0.85s ease 0.5s, transform 0.85s ease 0.5s"
        >

          {/* ── Foto ── */}
          <Flex direction="column" align="center" gap={3}>
            <Box
              w={{ base: "130px", md: "160px" }}
              h={{ base: "130px", md: "160px" }}
              borderRadius="full"
              overflow="hidden"
              border={`2px solid ${T}`}
              cursor={uploading ? "default" : "pointer"}
              onClick={() => !uploading && fileRef.current?.click()}
              transition="transform 0.25s"
              _hover={uploading ? {} : { transform: "scale(1.03)" }}
              position="relative"
            >
              {uploading && (
                <Flex
                  w="100%"
                  h="100%"
                  align="center"
                  justify="center"
                  bg={`${BEIGE}cc`}
                  position="absolute"
                  top={0}
                  left={0}
                  zIndex={2}
                >
                  <LifeLoader size="46px" />
                </Flex>
              )}
              {img ? (
                <Image src={img} w="100%" h="100%" objectFit="cover" />
              ) : (
                <Flex w="100%" h="100%" align="center" justify="center" bg={`${T}14`}>
                  <svg xmlns="http://www.w3.org/2000/svg" height="56px" viewBox="0 -960 960 960" width="56px" fill={`${T}99`}>
                    <path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Z"/>
                  </svg>
                </Flex>
              )}
            </Box>
            <Text
              color={`${T}b3`}
              fontSize="sm"
              letterSpacing="0.06em"
              fontStyle="italic"
            >
              {uploading ? t("cuenta.foto.subiendo") : t("cuenta.foto.tocaParaCambiar")}
            </Text>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFileChange} />
          </Flex>

          {/* ── Campos, en su cajita ──
              Caja con el borde turquesa oscuro
              con los campos a DOS columnas en ordenador y UNA en móvil. La
              fecha, al ser la quinta y llevar su nota debajo, cruza las dos
              columnas: así la rejilla nunca deja un hueco cojo. */}
          <SimpleGrid
            columns={{ base: 1, md: 2 }}
            spacingX={7}
            spacingY={5}
            border={`1.5px solid ${T}`}
            borderRadius="3xl"
            px={{ base: 5, md: 9 }}
            py={{ base: 7, md: 9 }}
          >
            <Box>
              <Text color={T} fontSize="md" letterSpacing="0.18em" mb={2.5} fontWeight="600" textAlign="center">
                {t("auth.campo.nombre")}
              </Text>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                {...inputStyles}
              />
            </Box>

            <Box>
              <Text color={T} fontSize="md" letterSpacing="0.18em" mb={2.5} fontWeight="600" textAlign="center">
                {t("auth.campo.email")}
              </Text>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                {...inputStyles}
              />
            </Box>

            <Box>
              <Text color={T} fontSize="md" letterSpacing="0.18em" mb={2.5} fontWeight="600" textAlign="center">
                {t("auth.campo.contrasena")}
              </Text>
              <Input
                type="password"
                value={contra}
                onChange={(e) => setContra(e.target.value)}
                // La contraseña real no se puede mostrar (en el servidor solo se guarda cifrada): aparece puesta
                // con puntos y, al escribir, se cambia por la nueva.
                placeholder="••••••••••"
                aria-label={t("cuenta.nuevaContrasena")}
                autoComplete="new-password"
                {...inputStyles}
              />
            </Box>

            <Box>
              <Text color={T} fontSize="md" letterSpacing="0.18em" mb={2.5} fontWeight="600" textAlign="center">
                {t("auth.campo.telefono")}
              </Text>
              <Input
                type="tel"
                autoComplete="tel"
                placeholder="+34 600 000 000"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                {...inputStyles}
              />
            </Box>

            {/* La fecha y la edad comparten fila: la fecha a la izquierda y a
                su lado la edad, que no se escribe: se calcula sola de la fecha
                y cambia en vivo al elegirla. El rótulo de la fecha es más largo
                y puede caer en dos líneas, así que las dos celdas se alinean
                por abajo para que las cajitas queden a la misma altura. */}
            <Flex direction="column" justify="flex-end">
              <Text color={T} fontSize="md" letterSpacing="0.18em" mb={2.5} fontWeight="600" textAlign="center">
                {t("auth.campo.fechaNacimiento")}
              </Text>
              {soloLectura ? (
                // Solo se mira: en día/mes/año y como texto (un campo de fecha dejaría abrir el calendario).
                <Input value={fechaDMA(fechaNacimiento) ?? ""} {...inputStyles} isReadOnly {...SOLO_LECTURA} />
              ) : (
                <Input
                  inputMode="numeric"
                  autoComplete="bday"
                  placeholder="día/mes/año"
                  maxLength={10}
                  value={fechaTxt}
                  onChange={(e) => {
                    const txt = mascaraDMA(e.target.value);
                    setFechaTxt(txt);
                    // Completa y válida → ISO; incompleta → vacía (no se guarda a medias).
                    setFechaNacimiento(dmaAIso(txt) ?? "");
                  }}
                  {...inputStyles}
                />
              )}
            </Flex>

            <Flex direction="column" justify="flex-end">
              <Text color={T} fontSize="md" letterSpacing="0.18em" mb={2.5} fontWeight="600" textAlign="center">
                {t("cuenta.edad")}
              </Text>
              {/* Solo se mira, no se toca: la misma píldora que los campos pero
                  sin hover ni foco, para que se lea como un dato y no como un
                  hueco por rellenar. Sin fecha enseña un guion apagado. */}
              <Flex
                h="56px"
                align="center"
                justify="center"
                borderRadius="full"
                bg="#F7EBD9"
                border={`1.5px solid ${T}66`}
              >
                {edadDe(fechaNacimiento) !== null ? (
                  <Text color={T} fontSize="2xl" fontWeight="600" letterSpacing="0.04em">
                    {edadDe(fechaNacimiento)}{" "}
                    <Box as="span" fontSize="lg" fontWeight="400" color={`${T}99`} letterSpacing="0.06em">
                      {t("cuenta.edad.anios")}
                    </Box>
                  </Text>
                ) : (
                  <Text color={`${T}55`} fontSize="2xl">
                    —
                  </Text>
                )}
              </Flex>
            </Flex>

            {/* Los datos de nacimiento de su carta astral: solo se ven. */}
            {nacCarta.hora && (
              <Flex direction="column" justify="flex-end">
                <Text color={T} fontSize="md" letterSpacing="0.18em" mb={2.5} fontWeight="600" textAlign="center">
                  {t("cuenta.horaNacimiento")}
                </Text>
                <Input value={nacCarta.hora} {...inputStyles} isReadOnly {...SOLO_LECTURA} />
              </Flex>
            )}
            {nacCarta.lugar && (
              <Flex direction="column" justify="flex-end">
                <Text color={T} fontSize="md" letterSpacing="0.18em" mb={2.5} fontWeight="600" textAlign="center">
                  {t("cuenta.lugarNacimiento")}
                </Text>
                <Input value={nacCarta.lugar} {...inputStyles} isReadOnly {...SOLO_LECTURA} />
              </Flex>
            )}
          </SimpleGrid>

          {error && (
            <Text color="#b3261e" fontSize="sm" textAlign="center" fontStyle="italic">
              {error}
            </Text>
          )}

          {saved && (
            <Text color={T} fontSize="sm" textAlign="center" fontStyle="italic">
              ✓ {t("cuenta.cambiosGuardados")}
            </Text>
          )}

          {/* Botón GUARDAR */}
          <Flex justify="center" pt={{ base: 4, md: 6 }}>
            <Flex
              as="button"
              onClick={(saving || !hayCambios) ? undefined : handleGuardar}
              align="center"
              justify="center"
              gap={{ base: 3, md: 4 }}
              px={{ base: 10, md: 14 }}
              py={{ base: "14px", md: "16px" }}
              borderRadius="full"
              border={`1.5px solid ${T}`}
              bg={T}
              cursor={(saving || !hayCambios) ? "not-allowed" : "pointer"}
              opacity={(saving || !hayCambios) ? 0.5 : 1}
              _hover={(saving || !hayCambios) ? {} : { opacity: 0.92, transform: "translateY(-2px)" }}
              _focusVisible={{ outline: `2px solid ${T}cc`, outlineOffset: "2px" }}
              transition="all 0.25s ease"
            >
              <MandalaTinte h={{ base: "26px", md: "32px" }} color={BEIGE} />
              <Text
                color={BEIGE}
                fontFamily="'EB Garamond', serif"
                fontWeight="700"
                fontSize={{ base: "md", md: "xl" }}
                letterSpacing="0.2em"
                textTransform="uppercase"
              >
                {saving ? t("comun.guardando") : t("comun.guardar")}
              </Text>
            </Flex>
          </Flex>

          {/* Acciones secundarias */}
          <Flex direction="column" align="center" gap={3} pt={6}>
            {isAdmin && (
              <Text
                as="button"
                onClick={() => navigate("/admin")}
                color={T}
                fontSize="sm"
                fontWeight="600"
                letterSpacing="0.1em"
                textTransform="uppercase"
                textDecoration="underline"
                textUnderlineOffset="3px"
                bg="transparent"
                cursor="pointer"
                mb={2}
                _hover={{ opacity: 0.75 }}
                _focusVisible={{ outline: `2px solid ${T}cc`, outlineOffset: "2px" }}
                transition="all 0.22s ease"
              >
                {t("cuenta.panelAdmin")}
              </Text>
            )}
            {/* Las dos píldoras GEMELAS: mismo ancho y misma altura, para que
                ninguna parezca la hermana pequeña. Cambian solo los colores:
                cerrar sesión habla en turquesa y eliminar cuenta en rojo, que es
                su aviso. En móvil se apilan a lo ancho. */}
            <Flex
              w="100%"
              justify="center"
              align="center"
              gap={{ base: 3, sm: 5 }}
              direction={{ base: "column", sm: "row" }}
              pt={2}
            >
              <Flex
                as="button"
                onClick={handleLogout}
                align="center"
                justify="center"
                w={{ base: "100%", sm: "250px" }}
                py="13px"
                borderRadius="full"
                border={`1.5px solid ${T}`}
                bg="transparent"
                cursor="pointer"
                _hover={{ bg: `${T}14`, transform: "translateY(-1px)" }}
                _focusVisible={{ outline: `2px solid ${T}cc`, outlineOffset: "2px" }}
                transition="all 0.22s ease"
              >
                <Text
                  color={T}
                  fontWeight="600"
                  fontSize="md"
                  letterSpacing="0.12em"
                  textTransform="uppercase"
                >
                  {t("cuenta.cerrarSesion")}
                </Text>
              </Flex>

              <Flex
                as="button"
                onClick={() => setConfirmDelete(true)}
                align="center"
                justify="center"
                w={{ base: "100%", sm: "250px" }}
                py="13px"
                borderRadius="full"
                border="1.5px solid #b3261e"
                bg="transparent"
                cursor="pointer"
                _hover={{ bg: "#b3261e14", transform: "translateY(-1px)" }}
                _focusVisible={{ outline: "2px solid #b3261ecc", outlineOffset: "2px" }}
                transition="all 0.22s ease"
              >
                <Text
                  color="#b3261e"
                  fontWeight="600"
                  fontSize="md"
                  letterSpacing="0.12em"
                  textTransform="uppercase"
                >
                  {t("cuenta.eliminarCuenta")}
                </Text>
              </Flex>
            </Flex>
          </Flex>
        </VStack>
      </Flex>

      </Box>

      {/* ── POP-UP ELIMINAR CUENTA ── */}
      {confirmDelete && (
        <Flex
          position="fixed"
          top={0}
          left={0}
          w="100vw"
          h="100vh"
          align="center"
          justify="center"
          zIndex={1000}
          bg={`${BEIGE}d9`}
          px={5}
          onClick={cerrarConfirmDelete}
        >
          <Flex
            direction="column"
            align="center"
            textAlign="center"
            onClick={(e) => e.stopPropagation()}
            w={{ base: "100%", sm: "480px" }}
            bg={BEIGE}
            borderRadius="30px"
            border="1.5px solid #b3261e"
            px={{ base: 9, md: 14 }}
            py={{ base: 12, md: 16 }}
            gap={6}
          >
            <Text
              color="#b3261e"
              fontSize={{ base: "2xl", md: "3xl" }}
              fontWeight="700"
              letterSpacing="0.04em"
              lineHeight="1.25"
            >
              {t("cuenta.borrar.titulo")}
            </Text>

            {/* Línea horizontal separadora bajo el título */}
            <Box
              w={{ base: "70%", md: "60%" }}
              h="1px"
              bgGradient="linear(to-r, #b3261e00, #b3261e99, #b3261e00)"
            />

            <Text
              color={T}
              fontSize={{ base: "md", md: "lg" }}
              lineHeight="1.75"
              fontStyle="italic"
            >
              {t("cuenta.borrar.aviso")}
            </Text>

            {/* Confirmación: contraseña + escribir la palabra BORRAR */}
            <VStack w="100%" spacing={4} align="stretch">
              <Box>
                <Text color={T} fontSize="sm" letterSpacing="0.14em" mb={2} fontWeight="600" textAlign="center">
                  {t("cuenta.borrar.tuContrasena")}
                </Text>
                <Input
                  type="password"
                  value={delPassword}
                  onChange={(e) => { setDelPassword(e.target.value); setDelError(""); }}
                  placeholder={t("cuenta.borrar.contrasena")}
                  autoComplete="current-password"
                  {...inputStyles}
                />
              </Box>
              <Box>
                <Text color={T} fontSize="sm" letterSpacing="0.14em" mb={2} fontWeight="600" textAlign="center">
                  {t("cuenta.borrar.escribe")}{" "}
                  <Box as="span" fontWeight="800" color="#b3261e">{palabraBorrar}</Box>{" "}
                  {t("cuenta.borrar.paraConfirmar")}
                </Text>
                <Input
                  type="text"
                  value={delWord}
                  onChange={(e) => { setDelWord(e.target.value); setDelError(""); }}
                  placeholder={palabraBorrar}
                  {...inputStyles}
                />
              </Box>
            </VStack>

            {delError && (
              <Text color="#b3261e" fontSize="sm" textAlign="center" fontStyle="italic">
                {delError}
              </Text>
            )}

            <Flex gap={4} pt={4} w="100%" justify="center" wrap="wrap">
              {/* Aceptar (discreto: acción destructiva). Deshabilitado hasta que
                  la contraseña esté escrita y la palabra sea exactamente BORRAR. */}
              <Text
                as="button"
                onClick={handleDelete}
                disabled={!puedeBorrar || deleting}
                color="#b3261e"
                fontSize="md"
                fontWeight="600"
                letterSpacing="0.08em"
                textTransform="uppercase"
                bg="transparent"
                cursor={puedeBorrar && !deleting ? "pointer" : "not-allowed"}
                opacity={puedeBorrar && !deleting ? 1 : 0.4}
                px={7}
                py={3}
                borderRadius="full"
                border="1.5px solid #b3261e"
                _hover={puedeBorrar && !deleting ? { bg: "#b3261e14" } : undefined}
                _focusVisible={{ outline: "2px solid #b3261ecc", outlineOffset: "2px" }}
                transition="all 0.22s ease"
              >
                {deleting ? t("cuenta.borrar.eliminando") : t("comun.aceptar")}
              </Text>

              {/* Cancelar (destacado) */}
              <Flex
                as="button"
                onClick={cerrarConfirmDelete}
                align="center"
                justify="center"
                px={10}
                py={3}
                borderRadius="full"
                border={`1.5px solid ${T}`}
                bg={T}
                cursor="pointer"
                _hover={{ opacity: 0.92, transform: "translateY(-1px)" }}
                _focusVisible={{ outline: `2px solid ${T}cc`, outlineOffset: "2px" }}
                transition="all 0.22s ease"
              >
                <Text
                  color={BEIGE}
                  fontSize="lg"
                  fontWeight="700"
                  letterSpacing="0.1em"
                  textTransform="uppercase"
                >
                  {t("comun.cancelar")}
                </Text>
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      )}
    </Box>
  );
}
