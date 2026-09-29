// ─────────────────────────────────────────────────────────────────────────────
// DIARIO DE TERAPIAS (/admin/diario/:userId) — donde se escriben las notas de
// las sesiones de una persona.
//
// Gira alrededor del CALENDARIO: los días con notas llevan un puntito con el
// color de su disciplina, y tocar un día enseña SOLO sus notas —dos días
// distintos nunca se ven a la vez—. Debajo, el formulario para escribir otra
// nota más de ese día (siempre se puede seguir escribiendo).
//
// Cada nota se pinta del color de su disciplina (o neutra si la sesión no fue
// de ninguna), y admite el mini-formato del diario: **negrita**, *cursiva* y
// --- para una rayita separadora (TextoMarcado).
//
// Borrador vs publicada: lo que se escribe nace en BORRADOR y no se ve en su
// /diario hasta que se pulsa «Publicar». Así se puede dejar una nota a medias
// sin que la persona se encuentre media frase.
//
// Lo que se escribe aquí se lee en /diario (app/home/Diario.tsx).
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
import CalendarioDiario from "../home/CalendarioDiario";
import { TextoMarcado } from "../../components/global/TextoMarcado";
import { DisciplinaBgLayer, hasDisciplinaBg } from "../../components/global/DisciplinaBgLayer";
import { astrologiaNom } from "../../GlobalVariables";

/** Velo sobre la FOTO de la disciplina: teñido con su color, salvo Astrología,
 *  cuyo cielo va con el velo ligero por defecto (nunca se oscurece). `fuerte`
 *  para el formulario, que tiene campos y necesita más reposo que una nota. */
const veloDe = (nom: string, bg: string, fuerte = false): string | undefined =>
  nom === astrologiaNom ? (fuerte ? "rgba(8,13,30,0.45)" : undefined) : `${bg}${fuerte ? "b3" : "8c"}`;

/** Lo que hay en el formulario mientras se escribe. */
interface Borrador {
  fecha: string;
  disciplina: string;
  titulo: string;
  contenido: string;
  porque: string;
}

const hoy = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

const borradorVacio = (fecha?: string): Borrador => ({
  fecha: fecha || hoy(),
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

/** Los campos del formulario se visten con el Txt de la disciplina elegida:
 *  lo que se teclea, el placeholder y los bordes van de su color. */
const campoSx = (txt: string) =>
  ({
    bg: "rgba(0,0,0,0.25)",
    border: `1px solid ${txt}4d`,
    color: txt,
    caretColor: txt,
    fontFamily: "'EB Garamond', serif",
    transition: "color 0.25s, border-color 0.25s",
    _placeholder: { color: `${txt}73` },
    _hover: { borderColor: `${txt}8c` },
    _focus: { borderColor: txt, boxShadow: "none" },
    _focusVisible: { boxShadow: "none" },
  }) as const;

export default function AdminDiario() {
  const navigate = useNavigate();
  const toast = useToast();
  const { userId } = useParams<{ userId: string }>();
  const { verificando } = useAdminGuard();

  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [persona, setPersona] = useState<{ name: string; email: string }>({ name: "", email: "" });
  const [entradas, setEntradas] = useState<EntradaDiario[]>([]);

  /** El día que se está mirando: sus notas y nada más. */
  const [dia, setDia] = useState<string>(hoy());
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
        // Se abre por el último día con notas; sin ninguna, por hoy.
        const ultima = lista
          .map((e) => e.fecha?.slice(0, 10))
          .filter(Boolean)
          .sort()
          .pop();
        if (ultima) {
          setDia(ultima);
          setForm((f) => ({ ...f, fecha: ultima }));
        }
      } catch {
        setEntradas([]);
      } finally {
        setCargando(false);
      }
    })();
  }, [verificando, userId]);

  const publicadas = useMemo(() => entradas.filter((e) => e.publicada).length, [entradas]);

  /** Las notas del día seleccionado, de la primera a la última escrita. */
  const delDia = useMemo(
    () =>
      entradas
        .filter((e) => e.fecha?.slice(0, 10) === dia)
        .sort((a, b) => (a.created_at ?? "").localeCompare(b.created_at ?? "")),
    [entradas, dia],
  );

  /** Tocar el calendario mueve el día Y la fecha del formulario: lo que se
   *  escriba a continuación cae en el día que se está mirando. */
  const elegirDia = (iso: string) => {
    setDia(iso);
    set("fecha", iso);
  };

  const recargar = async () => {
    if (!userId) return;
    setEntradas(await listarDe(userId));
  };

  const limpiar = () => {
    setEditando(null);
    setForm(borradorVacio(dia));
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
      // La vista se va al día de la nota recién guardada.
      setDia(form.fecha);
      setEditando(null);
      setForm(borradorVacio(form.fecha));
      toast({
        title: publicar ? "Publicada — ya la ve en su diario" : "Guardada como borrador",
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
    if (!window.confirm("¿Borrar esta nota? No se puede deshacer.")) return;
    await borrarEntrada(userId, e.id);
    if (editando === e.id) limpiar();
    await recargar();
  };

  // La cara del formulario: el color de la disciplina elegida (o neutra).
  const caraForm = caraDeEntrada(form.disciplina || null);

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
              Diario de terapias
            </Text>
            <Text color="rgba(255,255,255,0.72)" fontSize={{ base: "sm", md: "md" }} fontStyle="italic">
              {cargando
                ? "Cargando…"
                : `${persona.name || persona.email} · ${entradas.length} ${entradas.length === 1 ? "nota" : "notas"}` +
                  ` · ${publicadas} ${publicadas === 1 ? "publicada" : "publicadas"}`}
            </Text>
          </Flex>

          {cargando ? (
            <Flex justify="center" py={12}>
              <LifeLoader color="#ffffff" />
            </Flex>
          ) : (
            <>
              {/* ── EL CALENDARIO ── un puntito por disciplina en cada día con
                  notas; tocar un día enseña solo lo suyo. */}
              <Box mb={{ base: 6, md: 8 }}>
                <CalendarioDiario entradas={entradas} seleccionada={dia} onSeleccionar={elegirDia} />
              </Box>

              {/* ── LAS NOTAS DEL DÍA ── */}
              <Flex align="center" gap={3} mb={4}>
                {/* Las rayitas se desvanecen hacia fuera: la fecha queda arropada. */}
                <Box flex="1" h="1px" bgGradient="linear(to-r, #ffffff00, #ffffff40)" />
                <Text
                  color="white"
                  fontWeight="700"
                  fontSize={{ base: "md", md: "lg" }}
                  letterSpacing="0.04em"
                  whiteSpace="nowrap"
                >
                  {fechaLarga(dia)}
                </Text>
                <Box flex="1" h="1px" bgGradient="linear(to-l, #ffffff00, #ffffff40)" />
              </Flex>

              {delDia.length === 0 ? (
                <Text color="rgba(255,255,255,0.6)" fontStyle="italic" textAlign="center" py={4} mb={{ base: 6, md: 8 }}>
                  Este día no tiene ninguna nota. Escríbele una abajo.
                </Text>
              ) : (
                <Flex direction="column" gap={4} mb={{ base: 8, md: 10 }}>
                  {delDia.map((e) => (
                    <NotaDelDia
                      key={e.id}
                      entrada={e}
                      editandoEsta={editando === e.id}
                      onEditar={() => {
                        setEditando(e.id);
                        setForm(deEntrada(e));
                      }}
                      onVisibilidad={() => cambiarVisibilidad(e)}
                      onBorrar={() => eliminar(e)}
                    />
                  ))}
                </Flex>
              )}

              {/* ── EL FORMULARIO ── al elegir disciplina se pone su FOTO de
                  fondo (con un velo más cargado que las notas: aquí hay campos
                  que rellenar). Sin disciplina, la caja neutra de siempre. */}
              <Box
                position="relative"
                overflow="hidden"
                px={{ base: 4, md: 6 }}
                py={{ base: 5, md: 6 }}
                borderRadius="2xl"
                bg={caraForm.nom ? caraForm.bg : "rgba(255,255,255,0.07)"}
                border={`1px solid ${caraForm.txt}55`}
                // Con disciplina, un halo suave de su acento envuelve el formulario.
                boxShadow={caraForm.nom ? `0 0 26px ${caraForm.txt}33` : undefined}
                transition="background 0.25s, border-color 0.25s, box-shadow 0.35s"
              >
                {caraForm.nom && hasDisciplinaBg(caraForm.nom) && (
                  <DisciplinaBgLayer
                    nom={caraForm.nom}
                    borderRadius="2xl"
                    overlay={veloDe(caraForm.nom, caraForm.bg, true)}
                  />
                )}
                <Box position="relative" zIndex={1}>
                <Flex align="center" justify="space-between" gap={3} mb={4} flexWrap="wrap">
                  <Text color={caraForm.txt} fontWeight="700" fontSize="lg" letterSpacing="0.04em">
                    {editando ? "Editar la nota" : "Escribir una nota"}
                  </Text>
                  {editando && (
                    <Box
                      as="button"
                      onClick={limpiar}
                      color={`${caraForm.txt}bb`}
                      fontSize="sm"
                      textDecoration="underline"
                      cursor="pointer"
                      _hover={{ color: caraForm.txt }}
                    >
                      Cancelar y escribir una nueva
                    </Box>
                  )}
                </Flex>

                {/* fecha + disciplina */}
                <Flex gap={3} mb={3} direction={{ base: "column", md: "row" }}>
                  <Box flex={{ md: "0 0 190px" }}>
                    <Etiqueta color={caraForm.txt}>Fecha de la sesión</Etiqueta>
                    <Input
                      type="date"
                      value={form.fecha}
                      onChange={(ev) => {
                        set("fecha", ev.target.value);
                        // La fecha tecleada mueve también el calendario y la vista.
                        if (ev.target.value) setDia(ev.target.value);
                      }}
                      borderRadius="lg"
                      sx={{ "&::-webkit-calendar-picker-indicator": { filter: "invert(1)" } }}
                      {...campoSx(caraForm.txt)}
                    />
                  </Box>
                  <Box flex="1" minW={0}>
                    <Etiqueta color={caraForm.txt}>Disciplina (el color de la nota)</Etiqueta>
                    <Flex gap={2} flexWrap="wrap">
                      <Pastilla
                        activa={form.disciplina === ""}
                        bg="rgba(0,0,0,0.25)"
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

                <Etiqueta color={caraForm.txt}>Título (opcional)</Etiqueta>
                <Input
                  value={form.titulo}
                  onChange={(ev) => set("titulo", ev.target.value)}
                  placeholder="Una frase que resuma la sesión"
                  borderRadius="lg"
                  mb={3}
                  {...campoSx(caraForm.txt)}
                />

                <Etiqueta color={caraForm.txt}>Qué trabajamos</Etiqueta>
                <Textarea
                  value={form.contenido}
                  onChange={(ev) => set("contenido", ev.target.value)}
                  placeholder="Lo que se habló, lo que salió, lo que quedó pendiente…"
                  rows={7}
                  borderRadius="lg"
                  mb={1.5}
                  lineHeight="1.8"
                  {...campoSx(caraForm.txt)}
                />
                <Text color={`${caraForm.txt}99`} fontSize="xs" fontStyle="italic" mb={3}>
                  Se puede marcar: **negrita**, *cursiva* y una línea con --- pinta una rayita separadora.
                </Text>

                <Etiqueta color={caraForm.txt}>Por qué te digo esto</Etiqueta>
                <Textarea
                  value={form.porque}
                  onChange={(ev) => set("porque", ev.target.value)}
                  placeholder="El sentido de lo anterior: por qué se lo cuentas, qué quieres que entienda."
                  rows={4}
                  borderRadius="lg"
                  mb={4}
                  lineHeight="1.8"
                  {...campoSx(caraForm.txt)}
                />

                <Flex gap={3} flexWrap="wrap">
                  <Boton onClick={() => guardar(true)} disabled={guardando} principal>
                    {guardando ? "Guardando…" : "Publicar"}
                  </Boton>
                  <Boton onClick={() => guardar(false)} disabled={guardando}>
                    Guardar como borrador
                  </Boton>
                </Flex>
                <Text color={`${caraForm.txt}99`} fontSize="xs" fontStyle="italic" mt={3}>
                  Un borrador no se ve en su diario. Al publicar, le aparece la marca de «nuevo».
                </Text>
                </Box>
              </Box>
            </>
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

// ── Una nota del día, con el color de su disciplina ─────────────────────────

function NotaDelDia({
  entrada,
  editandoEsta,
  onEditar,
  onVisibilidad,
  onBorrar,
}: {
  entrada: EntradaDiario;
  editandoEsta: boolean;
  onEditar: () => void;
  onVisibilidad: () => void;
  onBorrar: () => void;
}) {
  const cara = caraDeEntrada(entrada.disciplina);
  const conFoto = cara.nom ? hasDisciplinaBg(cara.nom) : false;
  return (
    <Box
      position="relative"
      overflow="hidden"
      px={{ base: 4, md: 5 }}
      py={4}
      borderRadius="xl"
      bg={cara.bg}
      border={`1px solid ${editandoEsta ? cara.txt : `${cara.txt}55`}`}
      transition="border-color 0.18s, box-shadow 0.25s"
      // El halo, solo con el acento de la disciplina: la nota neutra no brilla.
      boxShadow={editandoEsta && cara.nom ? `0 0 18px ${cara.txt}40` : undefined}
      _hover={{
        borderColor: `${cara.txt}aa`,
        boxShadow: cara.nom ? `0 0 18px ${cara.txt}40` : undefined,
      }}
    >
      {/* La FOTO de la disciplina de fondo (no el color plano), con su velo —
          la misma capa que la página /diario del usuario. */}
      {conFoto && (
        <DisciplinaBgLayer nom={cara.nom} borderRadius="xl" overlay={veloDe(cara.nom, cara.bg)} />
      )}
      <Box position="relative" zIndex={1}>
      <Flex align="center" gap={2} flexWrap="wrap" mb={2}>
        <Text color={cara.txt} fontSize="xs" fontWeight="700" letterSpacing="0.12em" textTransform="uppercase">
          {cara.nom || "Sin disciplina"}
        </Text>
        <Box flex="1" />
        {entrada.publicada ? (
          <Text color="rgba(180,255,245,0.95)" fontSize="xs" fontWeight="700" letterSpacing="0.08em">
            {entrada.leida_at ? "PUBLICADA · LEÍDA" : "PUBLICADA · SIN LEER"}
          </Text>
        ) : (
          <Text color="rgba(255,220,180,0.9)" fontSize="xs" fontWeight="700" letterSpacing="0.08em">
            BORRADOR
          </Text>
        )}
      </Flex>

      {entrada.titulo && (
        <Text color={cara.txt} fontWeight="700" fontSize="lg" mb={1}>
          {entrada.titulo}
        </Text>
      )}
      <TextoMarcado
        texto={entrada.contenido}
        colorRaya={cara.txt}
        color={cara.txt}
        fontSize="sm"
        lineHeight="1.7"
      />
      {entrada.porque && (
        <Box mt={3} pl={3} borderLeft={`3px solid ${cara.txt}`}>
          <TextoMarcado
            texto={entrada.porque}
            colorRaya={cara.txt}
            color={cara.txt}
            fontSize="sm"
            fontStyle="italic"
            lineHeight="1.7"
          />
        </Box>
      )}

      <Flex gap={4} mt={3} flexWrap="wrap">
        <Enlace color={cara.txt} onClick={onEditar}>Editar</Enlace>
        <Enlace color={cara.txt} onClick={onVisibilidad}>
          {entrada.publicada ? "Volver a borrador" : "Publicar"}
        </Enlace>
        <Enlace onClick={onBorrar} peligro>Borrar</Enlace>
      </Flex>
      </Box>
    </Box>
  );
}

// ── Piezas sueltas del panel ────────────────────────────────────────────────

const Etiqueta = ({ color = "#ffffff", children }: { color?: string; children: React.ReactNode }) => (
  <Text color={`${color}b3`} fontSize="xs" letterSpacing="0.1em" textTransform="uppercase" mb={1.5}>
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
    transform={activa ? "scale(1.05)" : undefined}
    style={activa ? { boxShadow: `0 0 12px ${txt}66` } : undefined}
    _hover={{ opacity: 1, borderColor: txt, transform: "scale(1.05)" }}
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
  color,
  children,
}: {
  onClick: () => void;
  peligro?: boolean;
  color?: string;
  children: React.ReactNode;
}) => (
  <Box
    as="button"
    onClick={onClick}
    color={peligro ? "rgba(255,190,190,0.9)" : color ? `${color}cc` : "rgba(255,255,255,0.8)"}
    fontSize="sm"
    textDecoration="underline"
    cursor="pointer"
    _hover={{ color: peligro ? "#ffcccc" : color || "white" }}
  >
    {children}
  </Box>
);
