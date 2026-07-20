import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Flex, Text, Spinner } from "@chakra-ui/react";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import {
  API_URL,
  ayurvedaNom, ayurvedaTxt,
  vataColor, pittaColor, kaphaColor,
  VataIcon, PittaIcon, KaphaIcon,
} from "../../GlobalVariables";
import { disciplinaByKey } from "../../data/adminDisciplinas";
import { AdminDisciplinaHeader } from "./AdminDisciplinaHeader";
import { useAdminGuard, adminHeaders } from "./useAdminGuard";
import { LecturaCard, QA, Chips, SubTitulo, LecturaVacio } from "./AdminLecturaUI";
import { DOSHA_INTRO, type DoshaKey } from "../../hardCoded/metodo/doshaIntro";
import { DOSHA_DESCUBRE } from "../../hardCoded/metodo/doshaDescubre";
import { DOSHA_CUERPO } from "../../hardCoded/metodo/doshaCuerpo";
import { DOSHA_DESEQUILIBRIO } from "../../hardCoded/metodo/doshaDesequilibrio";
import { DOSHA_CUIDARTE } from "../../hardCoded/metodo/doshaCuidarte";

const TXT = ayurvedaTxt;
const OVERLAY = "rgba(255,251,244,0.30)"; // velo TENUE: la foto de Hinduismo debe verse bien

const DOSHA_META: Record<DoshaKey, { label: string; color: string; Icon: any }> = {
  vata: { label: "Vata", color: vataColor, Icon: VataIcon },
  pitta: { label: "Pitta", color: pittaColor, Icon: PittaIcon },
  kapha: { label: "Kapha", color: kaphaColor, Icon: KaphaIcon },
};
const DOSHA_KEYS: DoshaKey[] = ["vata", "pitta", "kapha"];

interface Bloque { id?: number; hora?: string; actividad?: string; comida?: boolean; alimentos?: string[]; }

export default function AdminAyurvedaLectura() {
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();
  const { verificando } = useAdminGuard();

  const [loading, setLoading] = useState(true);
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [data, setData] = useState<Record<string, any>>({});

  const disc = disciplinaByKey("ayurveda")!;

  useEffect(() => {
    if (verificando || !userId) return;
    (async () => {
      try {
        const [userRes, rowRes] = await Promise.all([
          axios.get(`${API_URL}/user/${userId}`, { headers: adminHeaders() }),
          axios.get<{ data?: Record<string, any> } | null>(`${API_URL}/metodo-ayurveda/${userId}`, { headers: adminHeaders() }),
        ]);
        setNombre(userRes.data?.name ?? "");
        setEmail(userRes.data?.email ?? "");
        setData((rowRes.data?.data ?? {}) as Record<string, any>);
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

  // ¿Tiene el usuario algún dato escrito en este dosha?
  const tieneDosha = (k: DoshaKey): boolean => {
    const cambio = (data.doshaIntro?.[k]?.cambio || "").trim();
    const descubre = (data.doshaDescubre?.[k]?.reflexion || "").trim();
    const cuerpo = (data.doshaCuerpo?.[k]?.reflexion || "").trim();
    const deseq = (data.doshaDesequilibrio?.[k]?.reflexion || "").trim();
    const cuid = data.doshaCuidarte?.[k] || {};
    const cuidLleno =
      (cuid.reflexion || "").trim() ||
      (cuid.compromiso || "").trim() ||
      (Array.isArray(cuid.desequilibranSel) && cuid.desequilibranSel.length) ||
      (Array.isArray(cuid.equilibranSel) && cuid.equilibranSel.length);
    const bloques = data.doshaDia?.[k]?.bloques;
    const dia = Array.isArray(bloques) && bloques.length > 0;
    return !!(cambio || descubre || cuerpo || deseq || cuidLleno || dia);
  };

  const doshasConDatos = DOSHA_KEYS.filter(tieneDosha);

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 4, md: 8 }} py={{ base: 6, md: 10 }}>
        <Box w="100%" maxW="820px">
          <Text as="button" onClick={() => navigate("/admin/ayurveda")} color="rgba(255,255,255,0.85)" fontSize="sm" mb={3}
                _hover={{ color: "white" }}>← Usuarios de {disc.nombre.toLowerCase()}</Text>

          <AdminDisciplinaHeader disc={disc} subtitle={`${nombre || "Usuario"}${email ? ` · ${email}` : ""}`} imagen />

          {doshasConDatos.length === 0 ? (
            <LecturaVacio txt="rgba(255,255,255,0.92)">
              Este usuario todavía no ha escrito nada en su mapa de {disc.nombre.toLowerCase()}.
            </LecturaVacio>
          ) : (
            doshasConDatos.map((k) => {
              const meta = DOSHA_META[k];
              const cambio = data.doshaIntro?.[k]?.cambio as string | undefined;
              const descubre = data.doshaDescubre?.[k]?.reflexion as string | undefined;
              const cuerpo = data.doshaCuerpo?.[k]?.reflexion as string | undefined;
              const deseq = data.doshaDesequilibrio?.[k]?.reflexion as string | undefined;
              const cuid = data.doshaCuidarte?.[k] || {};
              const bloques: Bloque[] = Array.isArray(data.doshaDia?.[k]?.bloques) ? data.doshaDia[k].bloques : [];

              const desequilibranSel: string[] = Array.isArray(cuid.desequilibranSel) ? cuid.desequilibranSel : [];
              const equilibranSel: string[] = Array.isArray(cuid.equilibranSel) ? cuid.equilibranSel : [];

              const cInt = DOSHA_INTRO[k];
              const cDes = DOSHA_DESCUBRE[k];
              const cCue = DOSHA_CUERPO[k];
              const cDeq = DOSHA_DESEQUILIBRIO[k];
              const cCui = DOSHA_CUIDARTE[k];

              return (
                <Box key={k} mb={8}>
                  {/* Banner del dosha */}
                  <Flex align="center" gap={3} mb={4}>
                    <Box style={{ filter: `drop-shadow(0 0 6px ${meta.color}66)` }}>
                      <meta.Icon size="34px" color={meta.color} />
                    </Box>
                    <Text color="#ffffff" fontSize={{ base: "xl", md: "2xl" }} fontWeight="700" letterSpacing="0.06em"
                          style={{ textShadow: `0 1px 8px rgba(0,0,0,0.4), 0 0 14px ${meta.color}88` }}>
                      {meta.label}
                    </Text>
                  </Flex>

                  {(cambio || "").trim() && (
                    <LecturaCard nom={ayurvedaNom} txt={TXT} overlay={OVERLAY} accent={meta.color} titulo="Antes de empezar">
                      <QA txt={TXT} pregunta={cInt?.preguntaFinal?.pregunta} respuesta={cambio} />
                    </LecturaCard>
                  )}

                  {(descubre || "").trim() && (
                    <LecturaCard nom={ayurvedaNom} txt={TXT} overlay={OVERLAY} accent={meta.color} titulo="Tu tendencia mental">
                      <QA txt={TXT} pregunta={cDes?.reflexion?.pregunta} respuesta={descubre} />
                    </LecturaCard>
                  )}

                  {(cuerpo || "").trim() && (
                    <LecturaCard nom={ayurvedaNom} txt={TXT} overlay={OVERLAY} accent={meta.color} titulo="Así funciona tu cuerpo">
                      <QA txt={TXT} pregunta={cCue?.reflexion?.pregunta} respuesta={cuerpo} />
                    </LecturaCard>
                  )}

                  {(deseq || "").trim() && (
                    <LecturaCard nom={ayurvedaNom} txt={TXT} overlay={OVERLAY} accent={meta.color} titulo="¿Qué te desequilibra?">
                      <QA txt={TXT} pregunta={cDeq?.reflexion?.pregunta} respuesta={deseq} />
                    </LecturaCard>
                  )}

                  {((cuid.reflexion || "").trim() || (cuid.compromiso || "").trim() || desequilibranSel.length > 0 || equilibranSel.length > 0) && (
                    <LecturaCard nom={ayurvedaNom} txt={TXT} overlay={OVERLAY} accent={meta.color} titulo="Cuidarte: alimentación y estilo de Vida">
                      {desequilibranSel.length > 0 && (
                        <Box mb={4}>
                          <SubTitulo txt={TXT}>{cCui?.desequilibran?.titulo ?? "Le desequilibra"}</SubTitulo>
                          <Chips txt={TXT} items={desequilibranSel} accent={meta.color} />
                        </Box>
                      )}
                      {equilibranSel.length > 0 && (
                        <Box mb={4}>
                          <SubTitulo txt={TXT}>{cCui?.equilibran?.titulo ?? "Le equilibra"}</SubTitulo>
                          <Chips txt={TXT} items={equilibranSel} accent={meta.color} />
                        </Box>
                      )}
                      {(cuid.reflexion || "").trim() && (
                        <QA txt={TXT} pregunta={cCui?.reflexion?.pregunta} respuesta={cuid.reflexion} />
                      )}
                      {(cuid.compromiso || "").trim() && (
                        <Box>
                          <SubTitulo txt={TXT}>{cCui?.reflexion?.compromisoTitulo ?? "Mi compromiso"}</SubTitulo>
                          <Chips txt={TXT} items={[cuid.compromiso]} accent={meta.color} />
                        </Box>
                      )}
                    </LecturaCard>
                  )}

                  {bloques.length > 0 && (
                    <LecturaCard nom={ayurvedaNom} txt={TXT} overlay={OVERLAY} accent={meta.color}
                                 titulo="Crea tu día" meta={`${bloques.length} momentos`}>
                      <Flex direction="column" gap={4}>
                        {bloques.map((b, i) => (
                          <Box key={b.id ?? i} borderLeft={`2px solid ${meta.color}66`} pl={4}>
                            <Flex align="baseline" gap={2} wrap="wrap" mb={(b.alimentos?.length ?? 0) > 0 ? 2 : 0}>
                              {(b.hora || "").trim() && (
                                <Text color={TXT} fontWeight="700" fontSize={{ base: "md", md: "lg" }}>{b.hora}</Text>
                              )}
                              {(b.actividad || "").trim() && (
                                <Text color={TXT} fontSize={{ base: "md", md: "lg" }}>{b.actividad}</Text>
                              )}
                            </Flex>
                            {Array.isArray(b.alimentos) && b.alimentos.length > 0 && (
                              <Chips txt={TXT} items={b.alimentos} accent={meta.color} />
                            )}
                          </Box>
                        ))}
                      </Flex>
                    </LecturaCard>
                  )}
                </Box>
              );
            })
          )}
        </Box>
      </Flex>

      <SiteFooter />
    </Box>
  );
}
