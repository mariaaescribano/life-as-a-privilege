import React, { useEffect, useRef, useState } from "react";
import { Box, Flex, Image, Input, Text, VStack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import SiteHeader from "../../components/global/SiteHeader";
import { API_URL, turquesa } from "../../GlobalVariables";

// Spinner inline
const Spinner = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="44px"
    height="44px"
    viewBox="0 0 44 44"
    style={{ animation: "spin 0.9s linear infinite" }}
  >
    <circle cx="22" cy="22" r="18" fill="none" stroke={turquesa} strokeWidth="3.5" strokeDasharray="90 30" strokeLinecap="round"/>
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </svg>
);

const inputStyles = {
  bg: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.28)",
  color: "white",
  borderRadius: "full",
  size: "lg" as const,
  h: "62px",
  fontSize: "xl",
  textAlign: "center" as const,
  fontFamily: "'EB Garamond', serif",
  letterSpacing: "0.04em",
  boxShadow: "0 0 10px rgba(255,255,255,0.12)",
  _placeholder: { color: "rgba(255,255,255,0.4)" },
  _hover: { border: "1px solid rgba(255,255,255,0.55)" },
  _focus: {
    border: "1px solid rgba(255,255,255,0.85)",
    boxShadow: "0 0 0 1px rgba(255,255,255,0.25), 0 0 18px rgba(255,255,255,0.3)",
    bg: "rgba(255,255,255,0.12)",
    outline: "none",
  },
};

export default function UserAccount() {
  const navigate = useNavigate();
  const userId = sessionStorage.getItem("userId") ?? "";
  const token  = sessionStorage.getItem("token")  ?? "";

  const [img, setImg] = useState<string>(sessionStorage.getItem("img") ?? "");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contra, setContra] = useState("");

  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [mounted, setMounted] = useState(false);

  const fileRef = useRef<HTMLInputElement>(null);
  const initialRef = useRef<{ name: string; email: string }>({ name: "", email: "" });

  useEffect(() => {
    if (!userId) { navigate("/welcome"); return; }
    fetch(`${API_URL}/user/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(u => {
        setName(u.name ?? "");
        setEmail(u.email ?? "");
        setIsAdmin(!!u.is_admin);
        initialRef.current = { name: u.name ?? "", email: u.email ?? "" };
      })
      .catch(() => setError("Error al cargar los datos"))
      .finally(() => setLoading(false));
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  const handleGuardar = async () => {
    setError("");
    const payload: Record<string, string> = {};
    if (name.trim() && name !== initialRef.current.name) payload.name = name.trim();
    if (email.trim() && email !== initialRef.current.email) payload.email = email.trim();
    if (contra.trim()) payload.password = contra.trim();

    if (Object.keys(payload).length === 0) return;

    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/user/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();
      const updated = await res.json();
      if (updated.name) {
        setName(updated.name);
        sessionStorage.setItem("name", updated.name);
        initialRef.current.name = updated.name;
      }
      if (updated.email) {
        setEmail(updated.email);
        initialRef.current.email = updated.email;
      }
      setContra("");
      setSaved(true);
      setTimeout(() => setSaved(false), 2200);
    } catch {
      setError("Error al guardar los cambios");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/welcome");
  };

  const handleDelete = async () => {
    try {
      await fetch(`${API_URL}/user/${userId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      sessionStorage.clear();
      navigate("/welcome");
    } catch {
      setError("Error al eliminar la cuenta");
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch(`${API_URL}/upload/profile-pic/${userId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      const newUrl = `${data.url}?v=${Date.now()}`;
      setImg(newUrl);
      sessionStorage.setItem("img", newUrl);
    } catch {
      setError("Error al subir la foto");
    } finally {
      setUploading(false);
    }
  };

  if (loading) return (
    <Flex minH="100vh" bg="#008080" justify="center" align="center">
      <Spinner />
    </Flex>
  );

  const hayCambios =
    (name.trim() && name !== initialRef.current.name) ||
    (email.trim() && email !== initialRef.current.email) ||
    !!contra.trim();

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" userImg={img} />

      <Box flex="1" display="flex" flexDirection="column" transform="scale(0.9)" transformOrigin="top center">

      {/* ── MANDALA SEPARADOR ── */}
      <Flex justify="center" pt={{ base: 10, md: 14 }}>
        <Image
          src="/img/icono/life.png"
          alt=""
          h={{ base: "60px", md: "80px" }}
          objectFit="contain"
          style={{ filter: "drop-shadow(0 0 11px rgba(255,255,255,0.78)) drop-shadow(0 0 26px rgba(255,255,255,0.42)) drop-shadow(0 0 52px rgba(180,255,245,0.32))" }}
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
        pt={{ base: 8, md: 10 }}
        gap={{ base: 3, md: 4 }}
      >
        <Text
          color="white"
          fontSize={{ base: "4xl", md: "5xl", lg: "6xl" }}
          fontWeight="700"
          letterSpacing="0.1em"
          lineHeight="1.1"
          textTransform="uppercase"
          textShadow="0 0 18px rgba(255,255,255,0.85), 0 0 38px rgba(255,255,255,0.55), 0 0 70px rgba(180,255,245,0.45)"
          opacity={mounted ? 1 : 0}
          transform={mounted ? "translateY(0)" : "translateY(24px)"}
          transition="opacity 0.85s ease 0.25s, transform 0.85s ease 0.25s"
        >
          Mi cuenta
        </Text>
      </Flex>

      {/* ── CONTENIDO ── */}
      <Flex flex={1} justify="center" px={{ base: 5, md: 10 }} pt={{ base: 12, md: 16 }} pb={{ base: 24, md: 32 }}>
        <VStack
          w={{ base: "100%", sm: "520px" }}
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
              border="2px solid rgba(255,255,255,0.85)"
              boxShadow="0 0 22px rgba(255,255,255,0.55), 0 0 50px rgba(255,255,255,0.3), 0 0 100px rgba(180,255,245,0.28)"
              cursor={uploading ? "default" : "pointer"}
              onClick={() => !uploading && fileRef.current?.click()}
              transition="box-shadow 0.25s"
              _hover={uploading ? {} : { boxShadow: "0 0 34px rgba(255,255,255,0.75), 0 0 70px rgba(180,255,245,0.45), 0 0 120px rgba(180,255,245,0.35)" }}
              position="relative"
            >
              {uploading && (
                <Flex
                  w="100%"
                  h="100%"
                  align="center"
                  justify="center"
                  bg="rgba(0,0,0,0.45)"
                  position="absolute"
                  top={0}
                  left={0}
                  zIndex={2}
                >
                  <Spinner />
                </Flex>
              )}
              {img ? (
                <Image src={img} w="100%" h="100%" objectFit="cover" />
              ) : (
                <Flex w="100%" h="100%" align="center" justify="center" bg="rgba(255,255,255,0.08)">
                  <svg xmlns="http://www.w3.org/2000/svg" height="56px" viewBox="0 -960 960 960" width="56px" fill="rgba(255,255,255,0.5)">
                    <path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Z"/>
                  </svg>
                </Flex>
              )}
            </Box>
            <Text
              color="rgba(255,255,255,0.65)"
              fontSize="sm"
              letterSpacing="0.06em"
              fontStyle="italic"
              textShadow="0 0 8px rgba(255,255,255,0.3)"
            >
              {uploading ? "Subiendo…" : "Toca la foto para cambiarla"}
            </Text>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFileChange} />
          </Flex>

          {/* ── Campos ── */}
          <VStack spacing={5} align="stretch">
            <Box>
              <Text color="rgba(255,255,255,0.78)" fontSize="md" letterSpacing="0.18em" mb={2.5} fontWeight="600" textAlign="center" textShadow="0 0 8px rgba(255,255,255,0.35)">
                NOMBRE
              </Text>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                {...inputStyles}
              />
            </Box>

            <Box>
              <Text color="rgba(255,255,255,0.78)" fontSize="md" letterSpacing="0.18em" mb={2.5} fontWeight="600" textAlign="center" textShadow="0 0 8px rgba(255,255,255,0.35)">
                EMAIL
              </Text>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                {...inputStyles}
              />
            </Box>

            <Box>
              <Text color="rgba(255,255,255,0.78)" fontSize="md" letterSpacing="0.18em" mb={2.5} fontWeight="600" textAlign="center" textShadow="0 0 8px rgba(255,255,255,0.35)">
                CONTRASEÑA
              </Text>
              <Input
                type="password"
                value={contra}
                onChange={(e) => setContra(e.target.value)}
                placeholder="Nueva contraseña"
                {...inputStyles}
              />
            </Box>
          </VStack>

          {error && (
            <Text color="#ff8a8a" fontSize="sm" textAlign="center" fontStyle="italic" textShadow="0 0 8px rgba(255,140,140,0.4)">
              {error}
            </Text>
          )}

          {saved && (
            <Text color={turquesa} fontSize="sm" textAlign="center" fontStyle="italic" style={{ textShadow: `0 0 10px ${turquesa}88, 0 0 22px ${turquesa}55` }}>
              ✓ Cambios guardados
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
              border="1.5px solid rgba(255,255,255,0.6)"
              bg="rgba(255,255,255,0.10)"
              cursor={(saving || !hayCambios) ? "not-allowed" : "pointer"}
              opacity={(saving || !hayCambios) ? 0.5 : 1}
              boxShadow="0 0 18px rgba(255,255,255,0.36), 0 0 40px rgba(255,255,255,0.18), 0 0 70px rgba(180,255,245,0.18), 0 4px 14px rgba(0,0,0,0.18)"
              _hover={(saving || !hayCambios) ? {} : {
                bg: "rgba(255,255,255,0.2)",
                borderColor: "white",
                boxShadow: "0 0 28px rgba(255,255,255,0.55), 0 0 58px rgba(180,255,245,0.35), 0 6px 18px rgba(0,0,0,0.22)",
                transform: "translateY(-1px)",
              }}
              transition="all 0.25s ease"
            >
              <Image
                src="/img/icono/life.png"
                alt=""
                h={{ base: "26px", md: "32px" }}
                objectFit="contain"
                flexShrink={0}
                style={{ filter: "drop-shadow(0 0 9px rgba(255,255,255,0.7)) drop-shadow(0 0 20px rgba(255,255,255,0.35))" }}
              />
              <Text
                color="white"
                fontFamily="'EB Garamond', serif"
                fontWeight="700"
                fontSize={{ base: "md", md: "xl" }}
                letterSpacing="0.2em"
                textTransform="uppercase"
                textShadow="0 0 12px rgba(255,255,255,0.65), 0 0 26px rgba(255,255,255,0.4)"
              >
                {saving ? "Guardando…" : "Guardar"}
              </Text>
            </Flex>
          </Flex>

          {/* Acciones secundarias */}
          <Flex direction="column" align="center" gap={3} pt={6}>
            {isAdmin && (
              <Text
                as="button"
                onClick={() => navigate("/admin")}
                color={turquesa}
                fontSize="sm"
                fontWeight="600"
                letterSpacing="0.1em"
                textTransform="uppercase"
                bg="transparent"
                cursor="pointer"
                mb={2}
                style={{ textShadow: `0 0 10px ${turquesa}88, 0 0 22px ${turquesa}44` }}
                _hover={{ color: "white", textShadow: `0 0 14px ${turquesa}, 0 0 28px ${turquesa}88` }}
                transition="all 0.22s ease"
              >
                Panel de administración
              </Text>
            )}
            <Text
              as="button"
              onClick={handleLogout}
              color="rgba(255,255,255,0.78)"
              fontSize="lg"
              fontWeight="600"
              letterSpacing="0.06em"
              bg="transparent"
              cursor="pointer"
              textShadow="0 0 8px rgba(255,255,255,0.35)"
              _hover={{ color: "white", textShadow: "0 0 12px rgba(255,255,255,0.6), 0 0 24px rgba(255,255,255,0.35)" }}
              transition="all 0.22s ease"
            >
              Cerrar sesión
            </Text>

            <Text
              as="button"
              onClick={() => setConfirmDelete(true)}
              color="rgba(255,160,160,0.75)"
              fontSize="md"
              letterSpacing="0.06em"
              fontStyle="italic"
              bg="transparent"
              cursor="pointer"
              textShadow="0 0 6px rgba(255,140,140,0.3)"
              _hover={{ color: "rgba(255,200,200,1)", textShadow: "0 0 12px rgba(255,140,140,0.55)" }}
              transition="all 0.22s ease"
            >
              Eliminar cuenta
            </Text>
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
          bg="rgba(0,0,0,0.55)"
          backdropFilter="blur(6px)"
          px={5}
          onClick={() => setConfirmDelete(false)}
        >
          <Flex
            direction="column"
            align="center"
            textAlign="center"
            onClick={(e) => e.stopPropagation()}
            w={{ base: "100%", sm: "480px" }}
            bgGradient="linear(to-b, #5a1522, #3d0d17)"
            borderRadius="30px"
            border="1.5px solid rgba(226,140,140,0.5)"
            boxShadow="0 0 34px rgba(200,70,70,0.4), 0 0 80px rgba(150,40,40,0.28), 0 24px 70px rgba(0,0,0,0.55), inset 0 0 34px rgba(255,180,180,0.06)"
            px={{ base: 9, md: 14 }}
            py={{ base: 12, md: 16 }}
            gap={6}
          >
            <Text
              color="rgba(255,235,235,0.98)"
              fontSize={{ base: "2xl", md: "3xl" }}
              fontWeight="700"
              letterSpacing="0.04em"
              lineHeight="1.25"
              textShadow="0 0 18px rgba(255,120,120,0.5), 0 0 40px rgba(255,90,90,0.3)"
            >
              ¿Seguro que quieres eliminar tu cuenta?
            </Text>

            {/* Línea horizontal separadora bajo el título */}
            <Box
              w={{ base: "70%", md: "60%" }}
              h="1px"
              bgGradient="linear(to-r, transparent, rgba(255,180,180,0.65), transparent)"
              boxShadow="0 0 10px rgba(255,150,150,0.5)"
            />

            <Text
              color="rgba(255,225,225,0.85)"
              fontSize={{ base: "md", md: "lg" }}
              lineHeight="1.75"
              fontStyle="italic"
              textShadow="0 0 8px rgba(255,150,150,0.2)"
            >
              Todos tus datos se borrarán y no podrás recuperarlos. No se devolverá lo abonado. No se guardará tu información personalizada.
            </Text>

            <Flex gap={4} pt={4} w="100%" justify="center" wrap="wrap">
              {/* Aceptar (discreto: acción destructiva) */}
              <Text
                as="button"
                onClick={handleDelete}
                color="rgba(255,225,225,0.82)"
                fontSize="md"
                fontWeight="600"
                letterSpacing="0.08em"
                textTransform="uppercase"
                bg="rgba(0,0,0,0.2)"
                cursor="pointer"
                px={7}
                py={3}
                borderRadius="full"
                border="1px solid rgba(255,200,200,0.32)"
                textShadow="0 0 8px rgba(0,0,0,0.4)"
                _hover={{ color: "white", bg: "rgba(0,0,0,0.32)", borderColor: "rgba(255,210,210,0.6)" }}
                transition="all 0.22s ease"
              >
                Aceptar
              </Text>

              {/* Cancelar (destacado) */}
              <Flex
                as="button"
                onClick={() => setConfirmDelete(false)}
                align="center"
                justify="center"
                px={10}
                py={3}
                borderRadius="full"
                border="1.5px solid rgba(255,255,255,0.75)"
                bg="rgba(255,255,255,0.18)"
                cursor="pointer"
                boxShadow="0 0 22px rgba(255,255,255,0.45), 0 0 50px rgba(255,210,210,0.32)"
                _hover={{
                  bg: "rgba(255,255,255,0.3)",
                  borderColor: "white",
                  boxShadow: "0 0 32px rgba(255,255,255,0.65), 0 0 64px rgba(255,200,200,0.45)",
                  transform: "translateY(-1px)",
                }}
                transition="all 0.22s ease"
              >
                <Text
                  color="white"
                  fontSize="lg"
                  fontWeight="700"
                  letterSpacing="0.1em"
                  textTransform="uppercase"
                  textShadow="0 0 12px rgba(255,255,255,0.7), 0 0 26px rgba(255,255,255,0.4)"
                >
                  Cancelar
                </Text>
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      )}
    </Box>
  );
}
