// ─────────────────────────────────────────────────────────────────────────────
// LA CAJA DE MARÍA · un recuadro dentro de una página donde escribe María y lee la
// persona. Con la foto de la disciplina de fondo.
//
//   · María (en el camino de una persona) ve un cuadro de texto: lo escribe con
//     autoguardado (es un borrador que la persona NO ve), y con «Publicar» lo
//     deja a la vista. «Quitar de su vista» lo retira (el borrador se queda).
//   · La persona solo ve lo publicado. Sin nada publicado, la caja no sale.
//
// Usa las mismas notas por página que la pestaña lateral (NotaPagina), pero con su
// propia clave (`clave`, una ruta inventada que no existe), así que no se pisan.
// ─────────────────────────────────────────────────────────────────────────────
import React, { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { Box, Flex, Text, Textarea } from "@chakra-ui/react";
import { API_URL } from "../../GlobalVariables";
import { personaActiva, esMariaMirando } from "../../api/persona";
import { DisciplinaBgLayer } from "../global/DisciplinaBgLayer";
import { focoBlanco } from "../global/foco";
import { glowHeader } from "./FotoBox";
import { Reveal } from "../global/Reveal";

interface Nota {
  borrador: string;
  publicada: string | null;
  publicada_at: string | null;
}

type Guardado = "quieto" | "guardando" | "guardado" | "error";

export function CajaDeMaria({ clave, nom, tinta }: {
  /** Clave de la nota: una ruta que empiece por «/» y no exista (p. ej. `/metodo/astrologia/sintesis/caja`). */
  clave: string;
  /** Disciplina, para la foto de fondo. */
  nom: string;
  /** Color de la letra dentro de la caja (el <disc>Txt). */
  tinta: string;
}) {
  // A quién se le escribe: a la persona del camino abierto, o a quien tiene la sesión.
  const persona = personaActiva();
  const userId = persona?.id ?? localStorage.getItem("userId");
  const maria = esMariaMirando() && !!persona;
  const [nota, setNota] = useState<Nota | null>(null);
  const [texto, setTexto] = useState("");
  const [estado, setEstado] = useState<Guardado>("quieto");
  const [aviso, setAviso] = useState<string | null>(null);
  const [ocupado, setOcupado] = useState(false);
  const base = useRef("");
  const actual = useRef("");
  actual.current = texto;

  useEffect(() => {
    if (!userId || userId === "admin") return;
    let cancel = false;
    axios.get<Nota>(`${API_URL}/notas-pagina/${userId}`, { params: { pagina: clave } })
      .then((r) => {
        if (cancel) return;
        const n: Nota = { borrador: r.data?.borrador ?? "", publicada: r.data?.publicada ?? null, publicada_at: r.data?.publicada_at ?? null };
        setNota(n);
        setTexto(n.borrador);
        base.current = n.borrador;
      })
      .catch(() => { /* sin red o sin tabla: la caja no sale */ });
    return () => { cancel = true; };
  }, [userId, clave]);

  const guardar = useCallback(async (): Promise<boolean> => {
    if (!maria || !userId) return false;
    const t = actual.current;
    if (t === base.current) return true;
    setEstado("guardando");
    try {
      await axios.put(`${API_URL}/notas-pagina/${userId}`, { pagina: clave, borrador: t });
      base.current = t;
      setEstado("guardado");
      return true;
    } catch (e: any) {
      setEstado("error");
      setAviso(e?.response?.data?.message ?? "No se pudo guardar.");
      return false;
    }
  }, [maria, userId, clave]);

  // Autoguardado: un momento después de dejar de escribir.
  useEffect(() => {
    if (!maria || !nota || texto === base.current) return;
    setEstado("quieto");
    const id = setTimeout(() => { void guardar(); }, 800);
    return () => clearTimeout(id);
  }, [texto, maria, nota, guardar]);

  if (!nota) return null;
  const hayPublicada = !!nota.publicada?.trim();
  // La persona solo ve la caja si hay algo publicado.
  if (!maria && !hayPublicada) return null;

  const publicar = async () => {
    setOcupado(true); setAviso(null);
    try {
      if (!(await guardar())) return;
      const { data } = await axios.post<{ publicada_at: string }>(`${API_URL}/notas-pagina/${userId}/publicar`, { pagina: clave });
      setNota((n) => (n ? { ...n, publicada: actual.current, publicada_at: data.publicada_at } : n));
      setAviso("Publicada: ya la ve.");
    } catch (e: any) {
      setAviso(e?.response?.data?.message ?? "No se pudo publicar.");
    } finally { setOcupado(false); }
  };

  const retirar = async () => {
    setOcupado(true); setAviso(null);
    try {
      await axios.post(`${API_URL}/notas-pagina/${userId}/retirar`, { pagina: clave });
      setNota((n) => (n ? { ...n, publicada: null, publicada_at: null } : n));
      setAviso("Retirada: ya no la ve. El borrador se queda.");
    } catch (e: any) {
      setAviso(e?.response?.data?.message ?? "No se pudo retirar.");
    } finally { setOcupado(false); }
  };

  const pildora = (rotulo: string, onClick: () => void, solido = false) => (
    <Box
      as="button" type="button" onClick={onClick} disabled={ocupado}
      px={5} py="7px" borderRadius="full" fontSize="sm" fontWeight="700" letterSpacing="0.04em"
      border={`1.5px solid ${tinta}`} bg={solido ? tinta : "rgba(8,13,30,0.45)"} color={solido ? "#0a0a1a" : tinta}
      cursor={ocupado ? "wait" : "pointer"} opacity={ocupado ? 0.6 : 1} transition="all 0.2s"
      _hover={{ transform: "translateY(-1px)", boxShadow: `0 0 16px ${tinta}66` }} _focusVisible={focoBlanco}
    >
      {rotulo}
    </Box>
  );

  const estadoMaria = !hayPublicada ? "Borrador: no la ve" : nota.publicada === texto ? "Publicada" : "Cambios sin publicar";

  return (
    <Reveal inView amount={0.15} direction="up" distance={26} scaleFrom={0.96} duration={0.75} w="100%"
            position="relative" borderRadius="2xl" overflow="hidden" boxShadow={glowHeader(tinta)}>
      <DisciplinaBgLayer nom={nom} borderRadius="2xl" overlay="rgba(8,13,30,0.3)" />
      <Flex position="relative" zIndex={1} direction="column" gap={4} px={{ base: 5, md: 9 }} py={{ base: 7, md: 10 }}>
        {maria ? (
          <>
            <Textarea
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              rows={9}
              resize="vertical"
              bg="rgba(8,13,30,0.45)"
              color="white"
              border={`1px solid ${tinta}66`}
              borderRadius="xl"
              fontFamily="'EB Garamond', serif"
              fontSize={{ base: "lg", md: "xl" }}
              lineHeight="1.7"
              p={4}
              _focus={{ borderColor: tinta, boxShadow: `0 0 0 1px ${tinta}66` }}
              _placeholder={{ color: "rgba(255,255,255,0.4)" }}
            />
            <Flex align="center" justify="space-between" gap={3} wrap="wrap">
              <Text color="white" fontSize="sm" opacity={0.85} fontStyle="italic">
                {estado === "guardando" ? "Guardando…" : estado === "error" ? "No se pudo guardar" : estado === "guardado" ? "Guardado" : estadoMaria}
                {aviso ? ` · ${aviso}` : ""}
              </Text>
              <Flex gap={2} wrap="wrap">
                {hayPublicada && pildora("Quitar de su vista", () => void retirar())}
                {pildora("Publicar", () => void publicar(), true)}
              </Flex>
            </Flex>
          </>
        ) : (
          <Text color={tinta} fontSize={{ base: "lg", md: "xl" }} lineHeight="1.85" whiteSpace="pre-wrap"
                style={{ textShadow: "0 1px 6px rgba(0,0,0,0.55)" }}>
            {nota.publicada}
          </Text>
        )}
      </Flex>
    </Reveal>
  );
}
