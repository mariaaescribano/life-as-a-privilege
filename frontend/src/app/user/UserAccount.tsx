import React, { useEffect, useRef, useState } from "react";
import { Box, Flex, Image, Input, Text, VStack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import SiteHeader from "../../components/global/SiteHeader";
import { API_URL, turquesa } from "../../GlobalVariables";

// ── Iconos ────────────────────────────────────────────────────────────────────

const EyeIcon = ({ open, size = "22px" }: { open: boolean; size?: string }) =>
  open ? (
    <svg xmlns="http://www.w3.org/2000/svg" height={size} viewBox="0 -960 960 960" width={size} fill="currentColor">
      <path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Z"/>
    </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" height={size} viewBox="0 -960 960 960" width={size} fill="currentColor">
      <path d="m644-428-58-58q9-47-27-88t-93-32l-58-58q17-8 34.5-12t37.5-4q75 0 127.5 52.5T660-500q0 20-4 37.5T644-428Zm128 126-58-56q38-29 67.5-63.5T832-500q-50-101-143.5-160.5T480-720q-29 0-57 4t-55 12l-62-62q41-17 84-25.5t90-8.5q151 0 269 83.5T920-500q-23 59-60.5 109.5T772-302Zm20 246L624-222q-35 11-70.5 16.5T480-200q-151 0-269-83.5T40-500q21-53 53-98.5t73-81.5L56-792l56-56 736 736-56 56ZM222-624q-29 26-53 57t-41 67q50 101 143.5 160.5T480-280q20 0 39-2.5t39-5.5l-36-38q-11 3-21 4.5t-21 1.5q-75 0-127.5-52.5T300-500q0-11 1.5-21t4.5-21l-84-82Z"/>
    </svg>
  );

const EditIcon = ({ size = "20px" }: { size?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" height={size} viewBox="0 -960 960 960" width={size} fill="currentColor">
    <path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/>
  </svg>
);

const CheckIcon = ({ size = "22px" }: { size?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" height={size} viewBox="0 -960 960 960" width={size} fill="currentColor">
    <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/>
  </svg>
);

const LogoutIcon = ({ size = "20px" }: { size?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" height={size} viewBox="0 -960 960 960" width={size} fill="currentColor">
    <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z"/>
  </svg>
);

const DeleteIcon = ({ size = "20px" }: { size?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" height={size} viewBox="0 -960 960 960" width={size} fill="currentColor">
    <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/>
  </svg>
);

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

// ── Tipos ─────────────────────────────────────────────────────────────────────

type Field = "name" | "email" | "password";

type FieldRowProps = {
  label: string;
  field: Field;
  value: string;
  editing: Field | null;
  setEditing: (f: Field | null) => void;
  onSave: (field: Field, draft: string) => void;
  savedField: Field | null;
};

// ── Fila de campo ────────────────────────────────────────────────────────────

function FieldRow({ label, field, value, editing, setEditing, onSave, savedField }: FieldRowProps) {
  const isPass = field === "password";

  const [showPass, setShowPass] = useState(false);
  const [draft,    setDraft]    = useState(isPass ? "" : value);

  const isEditing = editing === field;
  const justSaved = savedField === field;

  useEffect(() => {
    if (!isPass) setDraft(value);
  }, [value]);

  useEffect(() => {
    if (isEditing) {
      setDraft(isPass ? "" : value);
    } else {
      setShowPass(false);
    }
  }, [isEditing]);

  const inputStyle = {
    bg: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.28)",
    color: "white",
    borderRadius: "full",
    fontSize: { base: "md", md: "lg" } as any,
    px: 5,
    py: 3,
    h: "auto" as any,
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

  return (
    <Box w="100%">
      <Text
        fontSize={{ base: "xs", md: "sm" }}
        color="rgba(255,255,255,0.78)"
        letterSpacing="0.18em"
        textTransform="uppercase"
        fontWeight="600"
        mb={2}
        textAlign="center"
        textShadow="0 0 8px rgba(255,255,255,0.35)"
      >
        {label}
      </Text>

      <Flex align="center" gap={2}>
        {isEditing ? (
          <Input
            {...inputStyle}
            type={isPass && !showPass ? "password" : "text"}
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onKeyDown={e => {
              if (e.key === "Enter")  onSave(field, draft);
              if (e.key === "Escape") setEditing(null);
            }}
            autoFocus
            flex={1}
          />
        ) : (
          <Text
            flex={1}
            color="white"
            fontSize={{ base: "md", md: "lg" }}
            letterSpacing={isPass ? "0.18em" : "0.02em"}
            fontFamily={isPass ? "monospace" : undefined}
            textAlign="center"
            textShadow="0 0 10px rgba(255,255,255,0.45), 0 0 22px rgba(255,255,255,0.22)"
          >
            {isPass ? "••••••••" : value}
          </Text>
        )}

        {isPass && isEditing && (
          <Box
            as="button"
            color="rgba(255,255,255,0.65)"
            _hover={{ color: "white" }}
            cursor="pointer"
            onClick={() => setShowPass(p => !p)}
            flexShrink={0}
            transition="color 0.2s"
          >
            <EyeIcon open={showPass} />
          </Box>
        )}

        {isEditing ? (
          <Box
            as="button"
            color={justSaved ? turquesa : "rgba(255,255,255,0.8)"}
            _hover={{ color: turquesa }}
            cursor="pointer"
            onClick={() => onSave(field, draft)}
            flexShrink={0}
            title="Confirmar"
            transition="color 0.2s, filter 0.2s"
            style={justSaved ? { filter: `drop-shadow(0 0 8px ${turquesa})` } : { filter: "drop-shadow(0 0 6px rgba(255,255,255,0.4))" }}
          >
            <CheckIcon />
          </Box>
        ) : justSaved ? (
          <Box
            color={turquesa}
            flexShrink={0}
            style={{ filter: `drop-shadow(0 0 10px ${turquesa}) drop-shadow(0 0 22px ${turquesa}55)` }}
            transition="color 0.3s, filter 0.3s"
          >
            <CheckIcon />
          </Box>
        ) : (
          <Box
            as="button"
            color="rgba(255,255,255,0.55)"
            _hover={{ color: "white" }}
            cursor="pointer"
            onClick={() => setEditing(field)}
            flexShrink={0}
            title="Editar"
            transition="color 0.3s, filter 0.3s"
            style={{ filter: "drop-shadow(0 0 6px rgba(255,255,255,0.3))" }}
          >
            <EditIcon />
          </Box>
        )}
      </Flex>
    </Box>
  );
}

// ── Componente principal ──────────────────────────────────────────────────────

export default function UserAccount() {
  const navigate = useNavigate();
  const userId = sessionStorage.getItem("userId") ?? "";
  const token  = sessionStorage.getItem("token")  ?? "";

  const [img,   setImg]   = useState<string>(sessionStorage.getItem("img") ?? "");
  const [name,  setName]  = useState("");
  const [email, setEmail] = useState("");

  const [loading,    setLoading]    = useState(true);
  const [editing,    setEditing]    = useState<Field | null>(null);
  const [savedField, setSavedField] = useState<Field | null>(null);
  const [error,         setError]         = useState("");
  const [uploading,     setUploading]     = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [mounted, setMounted] = useState(false);

  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!userId) { navigate("/welcome"); return; }
    fetch(`${API_URL}/user/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(u => {
        setName(u.name   ?? "");
        setEmail(u.email ?? "");
      })
      .catch(() => setError("Error al cargar los datos"))
      .finally(() => setLoading(false));
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  const handleSave = async (field: Field, value: string) => {
    if (!value.trim()) { setEditing(null); return; }
    setError("");
    try {
      const res = await fetch(`${API_URL}/user/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ [field]: value }),
      });
      if (!res.ok) throw new Error();
      const updated = await res.json();

      if (field === "name") {
        setName(updated.name ?? value);
        sessionStorage.setItem("name", updated.name ?? value);
      }
      if (field === "email") setEmail(updated.email ?? value);

      setSavedField(field);
      setTimeout(() => setSavedField(null), 2000);
    } catch {
      setError("Error al guardar");
    } finally {
      setEditing(null);
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
    formData.append("userId", userId);
    try {
      const res = await fetch(`${API_URL}/upload/profile-pic`, {
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

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" userImg={img} />

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
          fontSize={{ base: "4xl", md: "6xl", lg: "7xl" }}
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

      {/* ── FOTO + CAMPOS + ACCIONES ── */}
      <Flex flex={1} justify="center" px={{ base: 5, md: 10 }} pt={{ base: 12, md: 16 }} pb={{ base: 24, md: 32 }}>
        <Flex
          direction="column"
          w={{ base: "100%", sm: "460px" }}
          gap={10}
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
          <VStack spacing={6} align="stretch">
            <FieldRow
              label="Nombre"   field="name"     value={name}
              editing={editing} setEditing={setEditing}
              onSave={handleSave} savedField={savedField}
            />
            <FieldRow
              label="Email"    field="email"    value={email}
              editing={editing} setEditing={setEditing}
              onSave={handleSave} savedField={savedField}
            />
            <FieldRow
              label="Contraseña" field="password" value=""
              editing={editing}  setEditing={setEditing}
              onSave={handleSave} savedField={savedField}
            />
          </VStack>

          {error && (
            <Text color="#ff8a8a" fontSize="sm" textAlign="center" fontStyle="italic" textShadow="0 0 8px rgba(255,140,140,0.4)">
              {error}
            </Text>
          )}

          {/* ── Acciones ── */}
          <Flex direction="column" gap={4} align="center" pt={4}>
            <Flex
              as="button"
              onClick={handleLogout}
              align="center"
              justify="center"
              gap={2}
              px={{ base: 7, md: 9 }}
              py={{ base: "10px", md: "12px" }}
              borderRadius="full"
              border="1px solid rgba(255,255,255,0.5)"
              bg="rgba(255,255,255,0.06)"
              color="white"
              fontFamily="'EB Garamond', serif"
              fontWeight="600"
              fontSize={{ base: "sm", md: "md" }}
              letterSpacing="0.16em"
              textTransform="uppercase"
              cursor="pointer"
              boxShadow="0 0 12px rgba(255,255,255,0.25), 0 0 28px rgba(255,255,255,0.12)"
              textShadow="0 0 10px rgba(255,255,255,0.5), 0 0 22px rgba(255,255,255,0.28)"
              _hover={{
                bg: "rgba(255,255,255,0.16)",
                borderColor: "rgba(255,255,255,0.85)",
                boxShadow: "0 0 20px rgba(255,255,255,0.45), 0 0 42px rgba(180,255,245,0.25)",
              }}
              transition="all 0.25s ease"
            >
              <Box as="span" style={{ filter: "drop-shadow(0 0 6px rgba(255,255,255,0.45))" }}>
                <LogoutIcon />
              </Box>
              Cerrar sesión
            </Flex>

            {!confirmDelete ? (
              <Flex
                as="button"
                onClick={() => setConfirmDelete(true)}
                align="center"
                justify="center"
                gap={2}
                px={{ base: 6, md: 8 }}
                py={{ base: "8px", md: "10px" }}
                borderRadius="full"
                border="1px solid rgba(255,130,130,0.55)"
                bg="rgba(255,130,130,0.05)"
                color="rgba(255,160,160,0.85)"
                fontFamily="'EB Garamond', serif"
                fontWeight="500"
                fontSize={{ base: "xs", md: "sm" }}
                letterSpacing="0.12em"
                textTransform="uppercase"
                fontStyle="italic"
                cursor="pointer"
                boxShadow="0 0 10px rgba(255,130,130,0.18)"
                _hover={{
                  bg: "rgba(255,130,130,0.14)",
                  borderColor: "rgba(255,150,150,0.85)",
                  color: "rgba(255,200,200,1)",
                  boxShadow: "0 0 16px rgba(255,130,130,0.4)",
                }}
                transition="all 0.25s ease"
              >
                <DeleteIcon /> Eliminar cuenta
              </Flex>
            ) : (
              <Flex direction="column" align="center" gap={3} pt={2}>
                <Text
                  color="rgba(255,200,200,0.95)"
                  fontSize={{ base: "sm", md: "md" }}
                  textAlign="center"
                  fontStyle="italic"
                  textShadow="0 0 8px rgba(255,150,150,0.35)"
                  maxW="320px"
                  lineHeight="1.6"
                >
                  ¿Estás segura? Esta acción no se puede deshacer.
                </Text>
                <Flex gap={3}>
                  <Flex
                    as="button"
                    onClick={handleDelete}
                    align="center"
                    justify="center"
                    px={6}
                    py="9px"
                    borderRadius="full"
                    border="1px solid rgba(255,130,130,0.7)"
                    bg="rgba(255,130,130,0.12)"
                    color="rgba(255,200,200,1)"
                    fontFamily="'EB Garamond', serif"
                    fontWeight="600"
                    fontSize="sm"
                    letterSpacing="0.12em"
                    textTransform="uppercase"
                    cursor="pointer"
                    boxShadow="0 0 14px rgba(255,130,130,0.32)"
                    _hover={{
                      bg: "rgba(255,130,130,0.22)",
                      borderColor: "rgba(255,160,160,1)",
                      boxShadow: "0 0 22px rgba(255,130,130,0.5)",
                    }}
                    transition="all 0.25s ease"
                  >
                    Sí, eliminar
                  </Flex>
                  <Flex
                    as="button"
                    onClick={() => setConfirmDelete(false)}
                    align="center"
                    justify="center"
                    px={6}
                    py="9px"
                    borderRadius="full"
                    border="1px solid rgba(255,255,255,0.45)"
                    bg="rgba(255,255,255,0.05)"
                    color="white"
                    fontFamily="'EB Garamond', serif"
                    fontWeight="500"
                    fontSize="sm"
                    letterSpacing="0.12em"
                    textTransform="uppercase"
                    cursor="pointer"
                    boxShadow="0 0 10px rgba(255,255,255,0.18)"
                    textShadow="0 0 8px rgba(255,255,255,0.35)"
                    _hover={{
                      bg: "rgba(255,255,255,0.14)",
                      borderColor: "rgba(255,255,255,0.8)",
                      boxShadow: "0 0 16px rgba(255,255,255,0.35)",
                    }}
                    transition="all 0.25s ease"
                  >
                    Cancelar
                  </Flex>
                </Flex>
              </Flex>
            )}
          </Flex>
        </Flex>
      </Flex>
    </Box>
  );
}
