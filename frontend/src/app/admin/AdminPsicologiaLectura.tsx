import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Flex, Text, Spinner } from "@chakra-ui/react";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { API_URL, neuropsicologiaNom, neuropsicologiaTxt } from "../../GlobalVariables";
import { disciplinaByKey } from "../../data/adminDisciplinas";
import { AdminDisciplinaHeader } from "./AdminDisciplinaHeader";
import { useAdminGuard, adminHeaders } from "./useAdminGuard";
import { LecturaCard, QA, Chips, SubTitulo, LecturaVacio } from "./AdminLecturaUI";
import {
  experienciaById,
  NECESIDADES,
  opcionNecesidad,
  itemsDeRespuesta,
  estadoDelAno,
  heridaLabel,
  type LineaDeVidaData,
  type Constelacion,
  type RelacionHuellaNudo,
  type ArquetipoRef,
} from "../../components/metodo/psicologiaRecorrido";
import { cuerpoByKey } from "../../components/metodo/astrologiaData";
import { NUMEROS_ROMANOS } from "../../components/metodo/casasAspectos";

const TXT = neuropsicologiaTxt;
const OVERLAY = "rgba(244,230,214,0.87)"; // velo cálido para que el texto oscuro sea legible

/** Etiqueta legible de un arquetipo de la carta (cuerpo en signo / en casa). */
function arquetipoLabel(a: ArquetipoRef): string {
  const cuerpo = cuerpoByKey(a.cuerpoKey)?.label ?? a.cuerpoKey;
  if (a.faceta === "casa" && a.casa) return `${cuerpo} · casa ${NUMEROS_ROMANOS[a.casa - 1] ?? a.casa}`;
  if (a.signo) return `${cuerpo} en ${a.signo}`;
  return cuerpo;
}

export default function AdminPsicologiaLectura() {
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();
  const { verificando } = useAdminGuard();

  const [loading, setLoading] = useState(true);
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [data, setData] = useState<LineaDeVidaData>({});

  const disc = disciplinaByKey("psicologia")!;

  useEffect(() => {
    if (verificando || !userId) return;
    (async () => {
      try {
        const [userRes, rowRes] = await Promise.all([
          axios.get(`${API_URL}/user/${userId}`, { headers: adminHeaders() }),
          axios.get<{ data?: LineaDeVidaData } | null>(`${API_URL}/metodo-psicologia/${userId}`, { headers: adminHeaders() }),
        ]);
        setNombre(userRes.data?.name ?? "");
        setEmail(userRes.data?.email ?? "");
        setData((rowRes.data?.data ?? {}) as LineaDeVidaData);
      } catch {
        // silencioso
      } finally {
        setLoading(false);
      }
    })();
  }, [verificando, userId]);

  if (verificando || loading) {
    return (
      <Flex minH="100vh" bg="#008080" justify="center" align="center">
        <Spinner size="xl" color="white" />
      </Flex>
    );
  }

  const exp = experienciaById("linea-de-vida")!;
  const problema = (data["problema-actual"] as string) ?? "";
  const edad = typeof data.edad === "number" ? data.edad : 0;

  const necesidadesMarcadas = NECESIDADES.filter((n) => data.necesidades?.[n.key]);

  // Años con recuerdo escrito (páginas del libro de vida).
  const aniosCompletados: number[] = [];
  const aniosSinRecuerdos: number[] = [];
  for (let a = 0; a <= edad; a++) {
    const est = estadoDelAno(data, a);
    if (est === "completado") aniosCompletados.push(a);
    else if (est === "sin-recuerdos") aniosSinRecuerdos.push(a);
  }

  const nudos = Array.isArray(data.nudos) ? data.nudos.filter((x) => (x || "").trim()) : [];
  const heridas: RelacionHuellaNudo[] = Array.isArray(data.heridas) ? data.heridas : [];
  const constelaciones: Constelacion[] = Array.isArray(data.constelaciones) ? data.constelaciones : [];
  const proximo = (data.proximoCapitulo as string) ?? "";

  const haleAlgo =
    problema.trim() ||
    necesidadesMarcadas.length ||
    aniosCompletados.length ||
    aniosSinRecuerdos.length ||
    nudos.length ||
    heridas.length ||
    constelaciones.length ||
    proximo.trim();

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 4, md: 8 }} py={{ base: 6, md: 10 }}>
        <Box w="100%" maxW="820px">
          <Text as="button" onClick={() => navigate("/admin/psicologia")} color="rgba(255,255,255,0.85)" fontSize="sm" mb={3}
                _hover={{ color: "white" }}>← Usuarios de psicología</Text>

          <AdminDisciplinaHeader disc={disc} subtitle={`${nombre || "Usuario"}${email ? ` · ${email}` : ""}`} />

          {!haleAlgo ? (
            <LecturaVacio txt="rgba(255,255,255,0.92)">
              Este usuario todavía no ha escrito nada en su recorrido de psicología.
            </LecturaVacio>
          ) : (
            <>
              {/* ── El problema actual ── */}
              {problema.trim() && (
                <LecturaCard nom={neuropsicologiaNom} txt={TXT} overlay={OVERLAY} titulo="El problema actual">
                  <QA txt={TXT} pregunta={exp.problemaInicial.pregunta} respuesta={problema} />
                </LecturaCard>
              )}

              {/* ── Las necesidades de la infancia ── */}
              {necesidadesMarcadas.length > 0 && (
                <LecturaCard nom={neuropsicologiaNom} txt={TXT} overlay={OVERLAY}
                             titulo="Las necesidades de la infancia" meta={`${necesidadesMarcadas.length} marcadas`}>
                  <Flex direction="column" gap={2.5}>
                    {necesidadesMarcadas.map((n) => {
                      const op = opcionNecesidad(data.necesidades?.[n.key]);
                      return (
                        <Flex key={n.key} align="center" justify="space-between" gap={3} wrap="wrap">
                          <Text color={TXT} fontSize={{ base: "md", md: "lg" }}>{n.necesidad}</Text>
                          {op && (
                            <Flex align="center" gap={2} flexShrink={0}>
                              <Box w="10px" h="10px" borderRadius="full" bg={op.color} />
                              <Text color={TXT} fontSize="sm" fontWeight="600">{op.label}</Text>
                            </Flex>
                          )}
                        </Flex>
                      );
                    })}
                  </Flex>
                </LecturaCard>
              )}

              {/* ── Línea de vida ── */}
              {(aniosCompletados.length > 0 || aniosSinRecuerdos.length > 0) && (
                <LecturaCard nom={neuropsicologiaNom} txt={TXT} overlay={OVERLAY}
                             titulo="Línea de vida" meta={edad ? `${edad} años · ${aniosCompletados.length} con recuerdos` : undefined}>
                  <Flex direction="column" gap={5}>
                    {aniosCompletados.map((a) => {
                      const ano = data.anos?.[String(a)];
                      const huellas = Array.isArray(ano?.huellas) ? ano!.huellas! : [];
                      return (
                        <Box key={a} borderLeft={`2px solid ${TXT}44`} pl={4}>
                          <Text color={TXT} fontWeight="700" fontSize={{ base: "md", md: "lg" }} mb={2}>
                            {a} {a === 1 ? "año" : "años"}
                          </Text>
                          <Flex direction="column" gap={2.5}>
                            {exp.preguntasPorAno.map((p) => {
                              const items = itemsDeRespuesta(ano?.respuestas?.[p.key]).map((x) => x.trim()).filter(Boolean);
                              if (items.length === 0) return null;
                              return (
                                <Box key={p.key}>
                                  <Text color={TXT} fontSize="sm" fontWeight="600" opacity={0.8} mb={1}>{p.pregunta}</Text>
                                  <Flex direction="column" gap={1}>
                                    {items.map((it, i) => {
                                      const esHuella = huellas.includes(it);
                                      return (
                                        <Text key={i} color={TXT} fontSize={{ base: "md", md: "lg" }} lineHeight="1.6">
                                          {esHuella && <Box as="span" color={TXT} fontWeight="700">✦ </Box>}
                                          {it}
                                        </Text>
                                      );
                                    })}
                                  </Flex>
                                </Box>
                              );
                            })}
                          </Flex>
                        </Box>
                      );
                    })}
                    {aniosSinRecuerdos.length > 0 && (
                      <Text color={TXT} fontSize="sm" fontStyle="italic" opacity={0.6}>
                        Años marcados «sin recuerdos»: {aniosSinRecuerdos.join(", ")}.
                      </Text>
                    )}
                  </Flex>
                  <Text color={TXT} fontSize="xs" fontStyle="italic" opacity={0.55} mt={3}>
                    ✦ Recuerdos que el usuario marcó como huella.
                  </Text>
                </LecturaCard>
              )}

              {/* ── Los nudos ── */}
              {nudos.length > 0 && (
                <LecturaCard nom={neuropsicologiaNom} txt={TXT} overlay={OVERLAY}
                             titulo="Los nudos" meta={`${nudos.length}`}>
                  <Chips txt={TXT} items={nudos} />
                </LecturaCard>
              )}

              {/* ── Las heridas ── */}
              {heridas.length > 0 && (
                <LecturaCard nom={neuropsicologiaNom} txt={TXT} overlay={OVERLAY}
                             titulo="Las heridas" meta={`${heridas.length}`}>
                  <Flex direction="column" gap={5}>
                    {heridas.map((h) => (
                      <Box key={h.id} borderLeft={`2px solid ${TXT}44`} pl={4}>
                        <Text color={TXT} fontWeight="700" fontSize={{ base: "md", md: "lg" }} mb={1.5}>{heridaLabel(h)}</Text>
                        {(h.texto || "").trim() && (
                          <Text color={TXT} fontSize={{ base: "md", md: "lg" }} whiteSpace="pre-wrap" lineHeight="1.7" mb={3}>
                            {h.texto}
                          </Text>
                        )}
                        {Array.isArray(h.huellas) && h.huellas.length > 0 && (
                          <Box mb={2}>
                            <SubTitulo txt={TXT}>Huellas</SubTitulo>
                            <Chips txt={TXT} items={h.huellas} />
                          </Box>
                        )}
                        {Array.isArray(h.nudos) && h.nudos.length > 0 && (
                          <Box>
                            <SubTitulo txt={TXT}>Nudos</SubTitulo>
                            <Chips txt={TXT} items={h.nudos} />
                          </Box>
                        )}
                      </Box>
                    ))}
                  </Flex>
                </LecturaCard>
              )}

              {/* ── La integración (constelaciones) ── */}
              {constelaciones.length > 0 && (
                <LecturaCard nom={neuropsicologiaNom} txt={TXT} overlay={OVERLAY}
                             titulo="La integración" meta={`${constelaciones.length} constelaciones`}>
                  <Flex direction="column" gap={6}>
                    {constelaciones.map((c) => (
                      <Box key={c.id} borderLeft={`2px solid ${TXT}44`} pl={4}>
                        <Text color={TXT} fontWeight="700" fontSize={{ base: "md", md: "lg" }} mb={2}>
                          {(c.titulo || "").trim() || "Constelación sin título"}
                        </Text>
                        {(c.texto || "").trim() && (
                          <Text color={TXT} fontSize={{ base: "md", md: "lg" }} whiteSpace="pre-wrap" lineHeight="1.7" mb={3}>
                            {c.texto}
                          </Text>
                        )}
                        {Array.isArray(c.nudos) && c.nudos.length > 0 && (
                          <Box mb={2}>
                            <SubTitulo txt={TXT}>Nudos</SubTitulo>
                            <Chips txt={TXT} items={c.nudos} />
                          </Box>
                        )}
                        {Array.isArray(c.arquetipos) && c.arquetipos.length > 0 && (
                          <Box mb={3}>
                            <SubTitulo txt={TXT}>Arquetipos</SubTitulo>
                            <Chips txt={TXT} items={c.arquetipos.map(arquetipoLabel)} />
                          </Box>
                        )}
                        {(c.proteger || "").trim() && <QA txt={TXT} pregunta="¿Qué intentaba proteger este patrón?" respuesta={c.proteger} />}
                        {(c.coste || "").trim() && <QA txt={TXT} pregunta="¿Qué coste tiene mantenerlo?" respuesta={c.coste} />}
                        {(c.verdadSana || "").trim() && <QA txt={TXT} pregunta="¿Qué verdad más sana quiere practicar?" respuesta={c.verdadSana} />}
                        {(c.recordatorio || "").trim() && <QA txt={TXT} pregunta="Recordatorio para cuando recaiga" respuesta={c.recordatorio} />}
                        {(c.aprendizaje || "").trim() && <QA txt={TXT} pregunta="Aprendizaje que se lleva" respuesta={c.aprendizaje} />}
                        {(c.nuevoPatron || "").trim() && <QA txt={TXT} pregunta="Nuevo patrón que quiere vivir" respuesta={c.nuevoPatron} />}
                      </Box>
                    ))}
                  </Flex>
                </LecturaCard>
              )}

              {/* ── Síntesis del camino ── */}
              {proximo.trim() && (
                <LecturaCard nom={neuropsicologiaNom} txt={TXT} overlay={OVERLAY} titulo="Síntesis del camino">
                  <QA txt={TXT} pregunta="El capítulo que quiere empezar a escribir ahora" respuesta={proximo} />
                </LecturaCard>
              )}
            </>
          )}
        </Box>
      </Flex>

      <SiteFooter />
    </Box>
  );
}
