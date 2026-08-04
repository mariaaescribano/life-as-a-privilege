// ─────────────────────────────────────────────────────────────────────────
// FotoPersonaBoton · el círculo de foto de un familiar (páginas «Tu familia» y
// «Genograma»). Se toca para elegir una foto del dispositivo; la sube al bucket
// (POST /upload/genograma/:userId) y devuelve su URL al padre, que la guarda en
// el recorrido. Las fotos NO caben en el blob del recorrido: por eso van al
// bucket y aquí solo viaja la URL.
//
// Un solo componente para las dos páginas: si cambia el aspecto o el límite de
// tamaño, cambia en las dos.
// ─────────────────────────────────────────────────────────────────────────
import React, { useRef, useState } from "react";
import { Box, Flex, Image, Text } from "@chakra-ui/react";
import { API_URL, neuropsicologiaTxt } from "../../GlobalVariables";

const TINTA = neuropsicologiaTxt;

/** Tamaño máximo aceptado (el móvil saca fotos de varios MB). */
const MAX_MB = 8;

export function FotoPersonaBoton({
  foto, alt, size = { base: "76px", md: "92px" }, onSubida, onError,
}: {
  foto?: string;
  alt: string;
  size?: { base: string; md: string };
  onSubida: (url: string) => void;
  /** Mensaje de error para que lo pinte la página (null = se limpia). */
  onError?: (mensaje: string | null) => void;
}) {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [subiendo, setSubiendo] = useState(false);

  const subir = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";            // permite volver a elegir la misma foto
    if (!file) return;
    if (!file.type.startsWith("image/")) { onError?.("Elige un archivo de imagen."); return; }
    if (file.size > MAX_MB * 1024 * 1024) { onError?.(`La foto es demasiado grande (máximo ${MAX_MB} MB).`); return; }
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (!userId || !token) return;
    onError?.(null);
    setSubiendo(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch(`${API_URL}/upload/genograma/${userId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (!data.url) throw new Error("Sin URL devuelta");
      onSubida(data.url);
    } catch {
      onError?.("No se pudo subir la foto. Inténtalo de nuevo.");
    } finally {
      setSubiendo(false);
    }
  };

  return (
    <>
      <Box as="button" onClick={() => !subiendo && fileRef.current?.click()} flexShrink={0}
           position="relative" w={size} h={size}
           borderRadius="full" overflow="hidden" border={`1.5px solid ${TINTA}88`}
           bg="rgba(255,251,243,0.82)" cursor={subiendo ? "default" : "pointer"}
           boxShadow={`0 3px 14px ${TINTA}33`} transition="all 0.16s"
           _hover={subiendo ? {} : { borderColor: TINTA, transform: "translateY(-1px)" }}>
        {foto ? (
          <Image src={foto} alt={alt} w="100%" h="100%" objectFit="cover" />
        ) : (
          <Flex w="100%" h="100%" align="center" justify="center" direction="column" gap={0.5}>
            <Text color={`${TINTA}aa`} fontSize={{ base: "xl", md: "2xl" }} lineHeight="1">+</Text>
            <Text color={`${TINTA}aa`} fontSize="2xs" fontWeight="700" letterSpacing="0.08em">FOTO</Text>
          </Flex>
        )}
        {subiendo && (
          <Flex position="absolute" inset={0} align="center" justify="center" bg="rgba(251,244,232,0.82)">
            <Text color={TINTA} fontSize="2xs" fontWeight="700">Subiendo…</Text>
          </Flex>
        )}
      </Box>
      <input ref={fileRef} type="file" accept="image/*" onChange={subir} style={{ display: "none" }} />
    </>
  );
}
