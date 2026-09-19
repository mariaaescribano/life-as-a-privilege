// ─────────────────────────────────────────────────────────────────────────────
// DIARIO DE SESIONES (/admin/diario/:userId) — donde se escriben las notas de
// las sesiones de una persona.
//
// Una sola página para las OCHO disciplinas: la disciplina es una etiqueta de
// la entrada, no una ruta. Una sesión puede tocar varias cosas o ninguna, así
// que obligar a elegir el panel antes de escribir sobraba.
//
// Borrador vs publicada: lo que se escribe nace en BORRADOR y no se ve en su
// Home hasta que se pulsa «Publicar». Así se puede dejar una nota a medias sin
// que la persona se encuentre media frase.
//
// Lo que escribe aquí se lee en /diario (app/home/Diario.tsx).
// ─────────────────────────────────────────────────────────────────────────────
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Flex, Input, Text, Textarea, useToast } from "@chakra-ui/react";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { LifeLoading } from "../../components/global/LifeLoading";
import { LifeLoader } from "../../components/metodo/comicLoaders";
import { API_URL } from "../../GlobalVariables";
import { adminHeaders, useAdminGuard } from "./useAdminGuard";
import {
  actualizarEntrada,
  borrarEntrada,
  crearEntrada,
  listarDe,
  type EntradaDiario,
} from "../../api/diario";
import { DISCIPLINAS_DIARIO, caraDeEntrada, fechaLarga } from "../home/diarioCara";

/** Lo que hay en el formulario mientras se escribe. */
interface Borrador {
  fecha: string;
  disciplina: string;
  titulo: string;
  contenido: string;
  porque: string;
}

const hoy = () => new Date().toISOString().slice(0, 10);

const borradorVacio = (): Borrador => ({
  fecha: hoy(),
  disciplina: "",
  titulo: "",
  contenido: "",
  porque: "",
});

const deEntrada = (e: EntradaDiario): Borrador => ({
  fecha: e.fecha?.slice(0, 10) || hoy(),
  disciplina: e.disciplina ?? "",
  titulo: e.titulo ?? "",
  contenido: e.contenido,
  porque: e.porque ?? "",
});

const campoSx = {
  bg: "rgba(255,255,255,0.08)",
  border: "1px solid rgba(255,255,255,0.3)",
  color: "white",
  fontFamily: "'EB Garamond', serif",
  _placeholder: { color: "rgba(255,255,255,0.45)" },
  _hover: { borderColor: "rgba(255,255,255,0.55)" },
  _focus: { borderColor: "white", boxShadow: "none" },
  _focusVisible: { boxShadow: "none" },
} as const;

export default function AdminDiario() {
  const navigate = useNavigate();
  const toast = useToast();
  const { userId } = useParams<{ userId: string }>();
  const { verificando } = useAdminGuard();

  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [persona, setPersona] = useState<{ name: string; email: string }>({ name: "", email: "" });
  const [entradas, setEntradas] = useState<EntradaDiario[]>([]);

  /** null = el formulario está creando una entrada nueva; si no, la que edita. */
  const [editando, setEditando] = useState<string | null>(null);
  const [form, setForm] = useState<Borrador>(borradorVacio());

  const set = <K extends keyof Borrador>(k: K, v: Borrador[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  useEffect(() => {
    if (verificando || !userId) return;
    (async () => {
      try {
        const [userRes, lista] = await Promise.all([
          axios.get(`${API_URL}/user/${userId}`, { headers: adminHeaders() }),
          listarDe(userId),
        ]);
        setPersona({ name: userRes.data?.name ?? "", email: userRes.data?.email ?? "" });
        setEntradas(lista);
      } catch {
        setEntradas([]);
      } finally {
        setCargando(false);
      }
    })();
  }, [verificando, userId]);

  const publicadas = useMemo(() => entradas.filter((e) => e.publicada).length, [entradas]);

  const recargar = async () => {
    if (!userId) return;
    setEntradas(await listarDe(userId));
  };

  const limpiar = () => {
    setEditando(null);
    setForm(borradorVacio());
  };

  const avisarError = (msg: string) =>
    toast({ title: msg, status: "error", duration: 5000, isClosable: true });

  /** Guarda lo que hay en el formulario. `publicar` decide si lo verá o no. */
  const guardar = async (publicar: boolean) => {
    if (!userId) return;
    if (!form.contenido.trim()) {
      avisarError("Escribe al menos qué pasó en la sesión.");
      return;
    }
    setGuardando(true);
    try {
      const datos = {
        fecha: form.fecha,
        disciplina: form.disciplina || null,
        titulo: form.titulo,
        contenido: form.contenido,
        porque: form.porque,
        publicada: publicar,
      };
      const res = editando
        ? await actualizarEntrada(userId, editando, datos)
        : await crearEntrada(userId, datos);

      if (!res?.success) {
        avisarError(res?.error ?? "No se pudo guardar.");
        return;
      }
      await recargar();
      limpiar();
      toast({
        title: publicar ? "Publicada — ya la ve en su Home" : "Guardada como borrador",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch {
      avisarError("No se pudo guardar. Inténtalo de nuevo.");
    } finally {
      setGuardando(false);
    }
  };

  /** Publica o vuelve a borrador una entrada ya guardada, sin abrir el formulario. */
  const cambiarVisibilidad = async (e: EntradaDiario) => {
    if (!userId) return;
    const res = await actualizarEntrada(userId, e.id, { publicada: !e.publicada });
    if (!res?.success) {
      avisarError(res?.error ?? "No se pudo cambiar.");
      return;
    }
    await recargar();
  };

  const eliminar = async (e: EntradaDiario) => {
    if (!userId) return;
    if (!window.confirm("¿Borrar esta entrada? No se puede deshacer.")) return;
    await borrarEntrada(userId, e.id);
    if (editando === e.id) limpiar();
    await recargar();
  };

  if (verificando) return <LifeLoading variant="private" />;

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 5, md: 10 }} py={{ base: 8, md: 12 }}>
        <Box w="100%" maxW="860px">
          {/* ── TÍTULO ── */}
          <Flex direction="column" align="center" textAlign="center" gap={2} mb={{ base: 6, md: 8 }}>
            <Text
              color="white"
              fontSize={{ base: "2xl", md: "4xl" }}
              fontWeight="700"
              letterSpacing="0.08em"
              textTransform="uppercase"
              lineHeight="1.15"
              textShadow="0 0 14px rgba(255,255,255,0.6), 0 0 30px rgba(180,255,245,0.3)"
            >
              Diario de sesiones
            </Text>
            <Text color="rgba(255,255,255,0.72)" fontSize={{ base: "sm", md: "md" }} fontStyle="italic">
              {cargando
                ? "Cargando…"
                : `${persona.name || persona.email} · ${entradas.length} ${entradas.length === 1 ? "entrada" : "entradas"}` +
                  ` · ${publicadas} ${publicadas === 1 ? "publicada" : "publicadas"}`}
            </Text>
          </Flex>

          {/* ── FORMULARIO ── */}
          <Box
            px={{ base: 4, md: 6 }}
            py={{ base: 5, md: 6 }}
            borderRadius="2xl"
            bg="rgba(255,255,255,0.07)"
            border="1px solid rgba(255,255,255,0.25)"
            mb={{ base: 8, md: 10 }}
          >
            <Flex align="center" justify="space-between" gap={3} mb={4} flexWrap="wrap">
              <Text color="white" fontWeight="700" fontSize="lg" letterSpacing="0.04em">
                {editando ? "Editar la entrada" : "Escribir una sesión"}
              </Text>
              {editando && (
                <Box
                  as="button"
                  onClick={limpiar}
                  color="rgba(255,255,255,0.75)"
                  fontSize="sm"
                  textDecoration="underline"
                  cursor="pointer"
                  _hover={{ color: "white" }}
                >
                  Cancelar y escribir una nueva
                </Box>
              )}
            </Flex>

            {/* fecha + disciplina */}
            <Flex gap={3} mb={3} direction={{ base: "column", md: "row" }}>
              <Box flex={{ md: "0 0 190px" }}>
                <Etiqueta>Fecha de la sesión</Etiqueta>
                <Input
                  type="date"
                  value={form.fecha}
                  onChange={(ev) => set("fecha", ev.target.value)}
                  borderRadius="lg"
                  sx={{ "&::-webkit-calendar-picker-indicator": { filter: "invert(1)" } }}
                  {...campoSx}
                />
              </Box>
              <Box flex="1" minW={0}>
                <Etiqueta>Disciplina (opcional)</Etiqueta>
                <Flex gap={2} flexWrap="wrap">
                  <Pastilla
                    activa={form.disciplina === ""}
                    bg="rgba(255,255,255,0.1)"
                    txt="#ffffff"
                    onClick={() => set("disciplina", "")}
                  >
                    Sin disciplina
                  </Pastilla>
                  {DISCIPLINAS_DIARIO.map((d) => (
                    <Pastilla
                      key={d.key}
                      activa={form.disciplina === d.key}
                      bg={d.bg}
                      txt={d.txt}
                      onClick={() => set("disciplina", d.key)}
                    >
                      {d.nombre}
                    </Pastilla>
                  ))}
                </Flex>
              </Box>
            </Flex>

            <Etiqueta>Título (opcional)</Etiqueta>
            <Input
              value={form.titulo}
              onChange={(ev) => set("titulo", ev.target.value)}
              placeholder="Una frase que resuma la sesión"
              borderRadius="lg"
              mb={3}
              {...campoSx}
            />

            <Etiqueta>Qué trabajamos</Etiqueta>
            <Textarea
              value={form.contenido}
              onChange={(ev) => set("contenido", ev.target.value)}
              placeholder="Lo que se habló, lo que salió, lo que quedó pendiente…"
              rows={7}
              borderRadius="lg"
              mb={3}
              lineHeight="1.8"
              {...campoSx}
            />

            <Etiqueta>Por qué te digo esto</Etiqueta>
            <Textarea
              value={form.porque}
              onChange={(ev) => set("porque", ev.target.value)}
              placeholder="El sentido de lo anterior: por qué se lo cuentas, qué quieres que entienda."
              rows={4}
              borderRadius="lg"
              mb={4}
              lineHeight="1.8"
              {...campoSx}
            />

            <Flex gap={3} flexWrap="wrap">
              <Boton onClick={() => guardar(true)} disabled={guardando} principal>
                {guardando ? "Guardando…" : "Publicar"}
              </Boton>
              <Boton onClick={() => guardar(false)} disabled={guardando}>
                Guardar como borrador
              </Boton>
            </Flex>
            <Text color="rgba(255,255,255,0.55)" fontSize="xs" fontStyle="italic" mt={3}>
              Un borrador no se ve en su Home. Al publicar, le aparece la marca de «nuevo».
            </Text>
          </Box>

          {/* ── LAS ENTRADAS ── */}
          {cargando ? (
            <Flex justify="center" py={12}>
              <LifeLoader color="#ffffff" />
            </Flex>
          ) : entradas.length === 0 ? (
            <Text color="rgba(255,255,255,0.6)" fontStyle="italic" textAlign="center" py={8}>
              Todavía no has escrito ninguna sesión de esta persona.
            </Text>
          ) : (
            <Flex direction="column" gap={3}>
              {entradas.map((e) => {
                const cara = caraDeEntrada(e.disciplina);
                return (
                  <Box
                    key={e.id}
                    px={{ base: 4, md: 5 }}
                    py={4}
                    borderRadius="xl"
                    bg="rgba(255,255,255,0.07)"
                    border={`1px solid ${editando === e.id ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.22)"}`}
                    transition="border-color 0.18s"
                    _hover={{ borderColor: "rgba(255,255,255,0.5)" }}
                  >
                    <Flex align="center" gap={2} flexWrap="wrap" mb={2}>
                      <Box px={2.5} py="2px" borderRadius="full" bg={cara.bg} border={`1px solid ${cara.txt}aa`}>
                        <Text color={cara.txt} fontSize="xs" fontWeight="600">
                          {cara.nom || "Sin disciplina"}
                        </Text>
                      </Box>
                      <Text color="rgba(255,255,255,0.7)" fontSize="sm">
                        {fechaLarga(e.fecha)}
                      </Text>
                      <Box flex="1" />
                      {e.publicada ? (
                        <Text color="rgba(180,255,245,0.95)" fontSize="xs" fontWeight="700" letterSpacing="0.08em">
                          {e.leida_at ? "PUBLICADA · LEÍDA" : "PUBLICADA · SIN LEER"}
                        </Text>
                      ) : (
                        <Text color="rgba(255,220,180,0.9)" fontSize="xs" fontWeight="700" letterSpacing="0.08em">
                          BORRADOR
                        </Text>
                      )}
                    </Flex>

                    {e.titulo && (
                      <Text color="white" fontWeight="700" fontSize="lg" mb={1}>
                        {e.titulo}
                      </Text>
                    )}
                    <Text color="rgba(255,255,255,0.8)" fontSize="sm" lineHeight="1.7" noOfLines={3} whiteSpace="pre-wrap">
                      {e.contenido}
                    </Text>

                    <Flex gap={4} mt={3} flexWrap="wrap">
                      <Enlace
                        onClick={() => {
                          setEditando(e.id);
                          setForm(deEntrada(e));
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                      >
                        Editar
                      </Enlace>
                      <Enlace onClick={() => cambiarVisibilidad(e)}>
                        {e.publicada ? "Volver a borrador" : "Publicar"}
                      </Enlace>
                      <Enlace onClick={() => eliminar(e)} peligro>
                        Borrar
                      </Enlace>
                    </Flex>
                  </Box>
                );
              })}
            </Flex>
          )}

          <Flex justify="center" mt={{ base: 8, md: 10 }}>
            <Enlace onClick={() => navigate("/admin/usuarios")}>← Volver a los usuarios</Enlace>
          </Flex>
        </Box>
      </Flex>

      <SiteFooter />
    </Box>
  );
}

// ── Piezas sueltas del panel ────────────────────────────────────────────────

const Etiqueta = ({ children }: { children: React.ReactNode }) => (
  <Text color="rgba(255,255,255,0.7)" fontSize="xs" letterSpacing="0.1em" textTransform="uppercase" mb={1.5}>
    {children}
  </Text>
);

const Pastilla = ({
  activa,
  bg,
  txt,
  onClick,
  children,
}: {
  activa: boolean;
  bg: string;
  txt: string;
  onClick: () => void;
  children: React.ReactNode;
}) => (
  <Box
    as="button"
    onClick={onClick}
    px={3}
    py="5px"
    borderRadius="full"
    bg={bg}
    border={`1px solid ${activa ? txt : `${txt}55`}`}
    cursor="pointer"
    transition="all 0.15s"
    opacity={activa ? 1 : 0.65}
    style={activa ? { boxShadow: `0 0 12px ${txt}66` } : undefined}
    _hover={{ opacity: 1, borderColor: txt }}
  >
    <Text color={txt} fontSize="xs" fontWeight="600" whiteSpace="nowrap">
      {children}
    </Text>
  </Box>
);

const Boton = ({
  onClick,
  disabled,
  principal,
  children,
}: {
  onClick: () => void;
  disabled?: boolean;
  principal?: boolean;
  children: React.ReactNode;
}) => (
  <Box
    as="button"
    onClick={onClick}
    disabled={disabled}
    px={6}
    py={2.5}
    borderRadius="full"
    bg={principal ? "rgba(255,255,255,0.22)" : "rgba(255,255,255,0.08)"}
    border={`1.5px solid ${principal ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.4)"}`}
    color="white"
    fontWeight="700"
    fontSize={{ base: "sm", md: "md" }}
    letterSpacing="0.04em"
    cursor={disabled ? "not-allowed" : "pointer"}
    opacity={disabled ? 0.55 : 1}
    transition="all 0.2s"
    _hover={disabled ? undefined : { bg: "rgba(255,255,255,0.3)", transform: "translateY(-2px)" }}
  >
    {children}
  </Box>
);

const Enlace = ({
  onClick,
  peligro,
  children,
}: {
  onClick: () => void;
  peligro?: boolean;
  children: React.ReactNode;
}) => (
  <Box
    as="button"
    onClick={onClick}
    color={peligro ? "rgba(255,190,190,0.9)" : "rgba(255,255,255,0.8)"}
    fontSize="sm"
    textDecoration="underline"
    cursor="pointer"
    _hover={{ color: peligro ? "#ffcccc" : "white" }}
  >
    {children}
  </Box>
);
