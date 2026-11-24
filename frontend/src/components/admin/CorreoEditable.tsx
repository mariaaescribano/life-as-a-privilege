import React, { useEffect, useState } from "react";
import { Box, Flex, Input, Modal, ModalBody, ModalContent, ModalOverlay, Text, Textarea } from "@chakra-ui/react";

/**
 * EL CORREO QUE ESCRIBE MARÍA ANTES DE ENVIARLO. Sirve para los dos correos de acceso:
 *   · cuenta real («en sesión»): con el usuario y la contraseña (`conContrasena`), y el botón «Entrar a mi cuenta»;
 *   · persona de lectura astral: sin contraseña, y el botón con la llave para leer su carta.
 * El texto sale tal cual lo deje aquí (mini-formato: **negrita**, *cursiva*, `---`, línea en blanco = párrafo); el
 * botón se añade solo al final del correo. `onEnviar` devuelve si salió; si no, el mensaje se queda en pantalla.
 */
export interface DatosCorreo { asunto: string; texto: string; contrasena?: string }

export function CorreoEditable({
  abierto, titulo, para, asuntoInicial, textoInicial, contrasenaInicial, etiquetaEnviar = "Enviar correo", etiquetaBoton, onEnviar, onCerrar,
}: {
  abierto: boolean;
  titulo: string;
  para: string;
  asuntoInicial: string;
  textoInicial: string;
  /** Si se define (aunque sea ""), sale el campo de contraseña de la cuenta: lo que escribas se pone en el texto y en la cuenta. */
  contrasenaInicial?: string;
  etiquetaEnviar?: string;
  /** Cómo se llama el botón que llevará el correo (solo para avisar de que se añade solo). */
  etiquetaBoton: string;
  onEnviar: (d: DatosCorreo) => Promise<{ ok: boolean; mensaje?: string }>;
  onCerrar: () => void;
}) {
  const [asunto, setAsunto] = useState(asuntoInicial);
  const [texto, setTexto] = useState(textoInicial);
  const [contra, setContra] = useState(contrasenaInicial ?? "");
  const [enviando, setEnviando] = useState(false);
  const [aviso, setAviso] = useState<{ ok: boolean; texto: string } | null>(null);
  const conContra = contrasenaInicial !== undefined;

  // Cada vez que se abre, parte de lo que le toca (no arrastra lo de la vez anterior).
  useEffect(() => {
    if (!abierto) return;
    setAsunto(asuntoInicial); setTexto(textoInicial); setContra(contrasenaInicial ?? ""); setAviso(null); setEnviando(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [abierto]);

  // La contraseña que tecleas se cambia también DENTRO del texto (donde estaba la anterior, o en el marcador
  // {{contraseña}} si aún no había ninguna), para que correo y cuenta digan lo mismo.
  const cambiarContra = (nueva: string) => {
    const antes = contra || "{{contraseña}}";
    setTexto((t) => (t.includes(antes) ? t.split(antes).join(nueva || "{{contraseña}}") : t));
    setContra(nueva);
  };

  const enviar = async () => {
    if (enviando) return;
    if (!asunto.trim() || !texto.trim()) { setAviso({ ok: false, texto: "Faltan el asunto o el texto." }); return; }
    setEnviando(true); setAviso(null);
    try {
      const r = await onEnviar({ asunto: asunto.trim(), texto: texto.trim(), contrasena: conContra && contra ? contra : undefined });
      setAviso({ ok: r.ok, texto: r.mensaje ?? (r.ok ? "Correo enviado." : "El correo no ha salido.") });
    } catch (e: any) {
      setAviso({ ok: false, texto: e?.response?.data?.message ?? "No se pudo enviar." });
    } finally { setEnviando(false); }
  };

  const T = "#005F5F";
  const campo = { bg: "#F7EBD9", border: `1.5px solid ${T}66`, color: T, fontFamily: "'EB Garamond', serif", _placeholder: { color: `${T}8c` }, _focus: { borderColor: T, boxShadow: "none" }, _focusVisible: { borderColor: T, boxShadow: "none" } } as const;
  const etiqueta = { display: "block", color: T, fontSize: "sm", letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 600, mb: 2 } as const;

  return (
    <Modal isOpen={abierto} onClose={onCerrar} size="2xl" scrollBehavior="inside" isCentered>
      <ModalOverlay bg="rgba(0,60,60,0.45)" />
      <ModalContent bg="#F0DCC0" borderRadius="28px" fontFamily="'EB Garamond', serif" mx={4}>
        <ModalBody px={{ base: 5, md: 9 }} py={{ base: 6, md: 8 }}>
          <Text color={T} fontSize={{ base: "xl", md: "2xl" }} fontWeight="700" letterSpacing="0.06em" textTransform="uppercase" mb={1}>{titulo}</Text>
          <Text color={T} opacity={0.8} fontSize="md" fontStyle="italic" mb={6}>Para: {para}</Text>

          <Text as="label" htmlFor="correo-asunto" {...etiqueta}>Asunto</Text>
          <Input id="correo-asunto" value={asunto} onChange={(e) => setAsunto(e.target.value)} h="48px" fontSize="lg" borderRadius="full" px={5} mb={5} {...campo} />

          {conContra && (
            <>
              <Text as="label" htmlFor="correo-contra" {...etiqueta}>Contraseña de la cuenta</Text>
              <Input id="correo-contra" value={contra} onChange={(e) => cambiarContra(e.target.value)} autoComplete="off" placeholder="La que le vas a dar" h="48px" fontSize="lg" borderRadius="full" px={5} mb={1} {...campo} />
              <Text color={T} opacity={0.75} fontSize="sm" fontStyle="italic" mb={5}>
                Se guarda como la contraseña de la cuenta al enviar, y se cambia también en el texto de abajo. Mínimo 6 caracteres.
              </Text>
            </>
          )}

          <Text as="label" htmlFor="correo-texto" {...etiqueta}>Texto del correo</Text>
          <Textarea id="correo-texto" value={texto} onChange={(e) => setTexto(e.target.value)} rows={13} fontSize="lg" lineHeight="1.7" borderRadius="22px" px={5} py={4} {...campo} />
          <Text color={T} opacity={0.75} fontSize="sm" fontStyle="italic" mt={2} mb={5}>
            **negrita** · *cursiva* · --- una raya · una línea en blanco separa párrafos. Al final del correo se añade solo el botón «{etiquetaBoton}».
          </Text>

          {aviso && (
            <Text role="status" color={aviso.ok ? T : "#b3261e"} fontSize="md" fontWeight={600} mb={4}>{aviso.texto}</Text>
          )}

          <Flex justify="flex-end" gap={3} wrap="wrap">
            <Box as="button" type="button" onClick={onCerrar} px={7} py="10px" borderRadius="full" border={`1.5px solid ${T}`} color={T} fontWeight={600}
                 _hover={{ bg: `${T}12` }} _focusVisible={{ outline: `2px solid ${T}cc`, outlineOffset: "2px" }}>
              {aviso?.ok ? "Cerrar" : "Cancelar"}
            </Box>
            {!aviso?.ok && (
              <Box as="button" type="button" onClick={enviar} disabled={enviando} px={7} py="10px" borderRadius="full" bg={T} border={`1.5px solid ${T}`} color="#F0DCC0" fontWeight={700}
                   opacity={enviando ? 0.6 : 1} cursor={enviando ? "wait" : "pointer"} _hover={enviando ? undefined : { bg: "#004a4a" }} _focusVisible={{ outline: `2px solid ${T}cc`, outlineOffset: "2px" }}>
                {enviando ? "Enviando…" : etiquetaEnviar}
              </Box>
            )}
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
