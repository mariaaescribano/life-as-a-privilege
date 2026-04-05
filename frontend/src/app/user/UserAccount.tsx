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

// Spinner inline (no deps externas)
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

// ── Fila de campo — definida FUERA del componente principal ───────────────────

function FieldRow({ label, field, value, editing, setEditing, onSave, savedField }: FieldRowProps) {
  const isPass = field === "password";

  // showPass es LOCAL a esta fila — no afecta al padre ni a otras filas
  const [showPass, setShowPass] = useState(false);
  const [draft,    setDraft]    = useState(isPass ? "" : value);

  const isEditing = editing === field;
  const justSaved = savedField === field;

  // Cuando llegan los datos del back (nombre/email), sincroniza el draft
  useEffect(() => {
    if (!isPass) setDraft(value);
  }, [value]);

  // Al abrir edición: nombre/email pre-rellena, contraseña empieza vacía
  // Al cerrar edición: resetea showPass
  useEffect(() => {
    if (isEditing) {
      setDraft(isPass ? "" : value);
    } else {
      setShowPass(false);
    }
  }, [isEditing]);

  const inputStyle = {
    bg: "rgba(255,255,255,0.10)",
    border: "1px solid rgba(255,255,255,0.30)",
    color: "white",
    borderRadius: "xl",
    fontSize: { base: "md", md: "lg" },
    _focus: {
      border: "1px solid rgba(255,255,255,0.80)",
      boxShadow: "none",
      bg: "rgba(255,255,255,0.15)",
      outline: "none",
    },
    _placeholder: { color: "rgba(255,255,255,0.45)" },
  };

  return (
    <Box w="100%">
      <Text
        fontSize={{ base: "xs", md: "sm" }}
        color="rgba(255,255,255,0.55)"
        letterSpacing="0.08em"
        textTransform="uppercase"
        mb={1}
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
          // En display: contraseña siempre muestra puntos fijos (el valor real no llega del back)
          <Text
            flex={1}
            color="white"
            fontSize={{ base: "md", md: "lg" }}
            letterSpacing={isPass ? "0.18em" : "0.02em"}
            fontFamily={isPass ? "monospace" : undefined}
          >
            {isPass ? "••••••••" : value}
          </Text>
        )}

        {/* ojo — solo visible cuando se está editando la contraseña */}
        {isPass && isEditing && (
          <Box
            as="button"
            color="rgba(255,255,255,0.60)"
            _hover={{ color: "white" }}
            cursor="pointer"
            onClick={() => setShowPass(p => !p)}
            flexShrink={0}
          >
            <EyeIcon open={showPass} />
          </Box>
        )}

        {/* editar / confirmar */}
        {isEditing ? (
          <Box
            as="button"
            color={justSaved ? turquesa : "rgba(255,255,255,0.75)"}
            _hover={{ color: turquesa }}
            cursor="pointer"
            onClick={() => onSave(field, draft)}
            flexShrink={0}
            title="Confirmar"
            transition="color 0.2s, filter 0.2s"
            style={justSaved ? { filter: `drop-shadow(0 0 6px ${turquesa})` } : {}}
          >
            <CheckIcon />
          </Box>
        ) : justSaved ? (
          <Box
            color={turquesa}
            flexShrink={0}
            style={{ filter: `drop-shadow(0 0 8px ${turquesa})` }}
            transition="color 0.3s, filter 0.3s"
          >
            <CheckIcon />
          </Box>
        ) : (
          <Box
            as="button"
            color="rgba(255,255,255,0.45)"
            _hover={{ color: turquesa }}
            cursor="pointer"
            onClick={() => setEditing(field)}
            flexShrink={0}
            title="Editar"
            transition="color 0.3s, filter 0.3s"
          >
            <EditIcon />
          </Box>
        )}
      </Flex>

      <Box h="1px" bg="rgba(255,255,255,0.12)" mt={3} />
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

  const fileRef = useRef<HTMLInputElement>(null);

  // Cargar datos del usuario al montar
  useEffect(() => {
    if (!userId) { navigate("/welcome"); return; }
    fetch(`${API_URL}/user/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(u => {
        setName(u.name   ?? "");
        setEmail(u.email ?? "");
        // La contraseña NO viene del backend (está hasheada). Se muestra siempre como ••••••••
      })
      .catch(() => setError("Error al cargar los datos"))
      .finally(() => setLoading(false));
  }, []);

  // Guardar un campo
  const handleSave = async (field: Field, value: string) => {
    // Contraseña: si no se escribe nada nuevo, simplemente cierra el modo edición
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
      // password: no se actualiza el estado local (el hash nunca viaja al front)

      // Tick iluminado durante 2 s
      setSavedField(field);
      setTimeout(() => setSavedField(null), 2000);
    } catch {
      setError("Error al guardar");
    } finally {
      setEditing(null);
    }
  };

  // Cerrar sesión
  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/welcome");
  };

  // Eliminar cuenta
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

  // Subir foto
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

  // ── Estilos reutilizables ─────────────────────────────────────────────────

  const glass = {
    bg: "rgba(255,255,255,0.10)",
    border: "1px solid rgba(255,255,255,0.22)",
    sx: { backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)" },
    borderRadius: "2xl",
  };

  const actionBtn = (color: string) => ({
    display: "flex" as const,
    alignItems: "center" as const,
    gap: "8px",
    cursor: "pointer",
    color,
    fontWeight: "500",
    fontSize: { base: "sm", md: "md" },
    letterSpacing: "0.03em",
    px: 4,
    py: "10px",
    borderRadius: "full",
    border: `1.5px solid ${color}`,
    bg: "transparent",
    transition: "all 0.2s",
    _hover: { bg: `${color}22` },
  });

  // ── Render ────────────────────────────────────────────────────────────────

  if (loading) return (
    <Flex minH="100vh" bg="#008080" justify="center" align="center">
      <Spinner />
    </Flex>
  );

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080">
      <SiteHeader variant="private" userImg={img} />

      <Flex flex={1} justify="center" align="flex-start" px={{ base: 4, md: 8 }} py={{ base: 10, md: 16 }}>
        <Box
          {...glass}
          w="100%"
          maxW="520px"
          px={{ base: 6, md: 10 }}
          py={{ base: 8, md: 12 }}
          boxShadow="0 8px 48px rgba(0,0,0,0.25)"
        >
          <>

          {/* ── Foto ── */}
          <Flex direction="column" align="center" mb={10}>
            <Box position="relative" mb={4}>
              <Box
                w={{ base: "100px", md: "130px" }}
                h={{ base: "100px", md: "130px" }}
                borderRadius="full"
                overflow="hidden"
                border={`3px solid ${uploading ? "rgba(255,255,255,0.3)" : turquesa}`}
                boxShadow={`0 0 0 4px rgba(72,192,181,0.25)`}
                cursor={uploading ? "default" : "pointer"}
                onClick={() => !uploading && fileRef.current?.click()}
                transition="box-shadow 0.2s, border 0.2s"
                _hover={uploading ? {} : { boxShadow: `0 0 0 6px rgba(72,192,181,0.40)` }}
                position="relative"
              >
                {uploading ? (
                  // Spinner centrado mientras se sube
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
                ) : null}

                {img ? (
                  <Image src={img} w="100%" h="100%" objectFit="cover" />
                ) : (
                  <Flex w="100%" h="100%" align="center" justify="center" bg="rgba(255,255,255,0.08)">
                    <svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960" width="48px" fill="rgba(255,255,255,0.4)">
                      <path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Z"/>
                    </svg>
                  </Flex>
                )}
              </Box>
            </Box>

            <Text color="rgba(255,255,255,0.55)" fontSize="xs" letterSpacing="0.06em">
              {uploading ? "Subiendo…" : "Toca la foto para cambiarla"}
            </Text>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFileChange} />
          </Flex>

          {/* ── Campos ── */}
          <VStack spacing={6} align="stretch" mb={10}>
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

          {/* ── Error ── */}
          {error && (
            <Text color="#ff8080" fontSize="sm" textAlign="center" mb={4}>{error}</Text>
          )}

          {/* ── Acciones ── */}
          <Flex direction="column" gap={3} align="stretch">
            <Box
              as="button"
              {...actionBtn("rgba(255,255,255,0.75)")}
              onClick={handleLogout}
              justifyContent="center"
            >
              <LogoutIcon /> Cerrar sesión
            </Box>

            {!confirmDelete ? (
              <Box
                as="button"
                {...actionBtn("#ff6b6b")}
                onClick={() => setConfirmDelete(true)}
                justifyContent="center"
              >
                <DeleteIcon /> Eliminar cuenta
              </Box>
            ) : (
              <Flex direction="column" gap={2} align="center" {...glass} p={4}>
                <Text color="white" fontSize="sm" textAlign="center" mb={1}>
                  ¿Estás segura? Esta acción no se puede deshacer.
                </Text>
                <Flex gap={3}>
                  <Box as="button" {...actionBtn("#ff6b6b")} onClick={handleDelete} fontSize="sm">
                    Sí, eliminar
                  </Box>
                  <Box as="button" {...actionBtn("rgba(255,255,255,0.60)")} onClick={() => setConfirmDelete(false)} fontSize="sm">
                    Cancelar
                  </Box>
                </Flex>
              </Flex>
            )}
          </Flex>
          </>
        </Box>
      </Flex>
    </Box>
  );
}
