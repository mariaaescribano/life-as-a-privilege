import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex, Text } from "@chakra-ui/react";
import { EstudioLayout } from "../../components/estudio/EstudioLayout";
import { PreguntasEstudioModal, type PreguntaConEje } from "../../components/estudio/PreguntasEstudioModal";
import { PlanetaEstudioBox } from "../../components/estudio/PlanetaEstudioBox";
import { BotonLecturaCarta } from "../../components/estudio/LecturaCartaModal";
import { SPACE_IMG } from "../../components/metodo/SpaceBg";
import { GlifoSigno } from "../../components/metodo/Glifo";
import { CUERPOS, type Cuerpo, type CuerpoKey } from "../../components/metodo/astrologiaData";
import { Reveal, RevealItem, RevealStagger } from "../../components/global/Reveal";
import { useImagesReady } from "../../hooks/useImagesReady";
import { LifeLoading } from "../../components/global/LifeLoading";
import { preguntasDe as preguntasDelEje } from "../../data/estudioPreguntas";
import {
  getEstudioId,
  getParticipante,
  guardarRespuesta,
  type ParticipanteEstudio,
} from "../../data/estudioApi";

/** Clave de una respuesta dentro del estado local. */
const clave = (planeta: string, preguntaId: string) => `${planeta}|${preguntaId}`;

export default function EstudioPreguntas() {
  const navigate = useNavigate();
  const [participante, setParticipante] = useState<ParticipanteEstudio | null>(null);
  const [cargando, setCargando] = useState(true);
  // Respuestas en memoria: { "sol|sol-1": true, … }. Se llenan con lo que ya
  // había guardado y se van actualizando conforme responde.
  const [respuestas, setRespuestas] = useState<Record<string, boolean>>({});
  const [abierto, setAbierto] = useState<CuerpoKey | null>(null);

  const fotosListas = useImagesReady([SPACE_IMG]);

  // Sin participante no hay preguntas que hacer: se vuelve a pedir los datos.
  useEffect(() => {
    const id = getEstudioId();
    if (!id) { navigate("/estudio/datos", { replace: true }); return; }
    (async () => {
      try {
        const p = await getParticipante(id);
        setParticipante(p);
        const previas: Record<string, boolean> = {};
        for (const r of p.respuestas ?? []) previas[clave(r.planeta, r.preguntaId)] = r.respuesta;
        setRespuestas(previas);
      } catch {
        navigate("/estudio/datos", { replace: true });
      } finally {
        setCargando(false);
      }
    })();
  }, [navigate]);

  /**
   * Las preguntas que le tocan a esta persona en un arquetipo: primero las de
   * SU signo, después las de SU casa. Cada una viaja con su eje y su posición,
   * que es lo que decide en qué grupo se cuenta.
   *
   * En Quirón y los Nodos el texto de cada casa es el mismo que el de su signo
   * equivalente (casa 1 ↔ Aries, casa 2 ↔ Tauro…), así que a quien le coincidan
   * —Quirón en Aries Y en la casa 1— le saldría dos veces la misma pregunta.
   * Se filtran los textos repetidos: se pregunta una sola vez, por el signo.
   */
  const preguntasDe = useCallback(
    (c: Cuerpo): PreguntaConEje[] => {
      const signo = participante?.signos?.[c.key];
      const casa = participante?.casas?.[c.key];
      const deSigno: PreguntaConEje[] = preguntasDelEje(c.key, "signo", signo)
        .map((p) => ({ ...p, eje: "signo" as const, posicion: String(signo) }));
      const yaPreguntado = new Set(deSigno.map((p) => p.texto));
      const deCasa: PreguntaConEje[] = preguntasDelEje(c.key, "casa", casa)
        .filter((p) => !yaPreguntado.has(p.texto))
        .map((p) => ({ ...p, eje: "casa" as const, posicion: String(casa) }));
      return [...deSigno, ...deCasa];
    },
    [participante],
  );

  // Solo salen los arquetipos que están en SU carta y para los que hay preguntas
  // escritas en su posición. Lo demás, sencillamente no existe todavía.
  const cuerpos = useMemo(
    () => CUERPOS.filter((c) => !!participante?.signos?.[c.key] && preguntasDe(c).length > 0),
    [participante, preguntasDe],
  );

  const respondidasDe = useCallback(
    (c: Cuerpo) => preguntasDe(c).filter((p) => respuestas[clave(c.key, p.id)] !== undefined).length,
    [respuestas, preguntasDe],
  );

  const totalRespondidas = cuerpos.reduce((n, c) => n + respondidasDe(c), 0);
  const totalPreguntas = cuerpos.reduce((n, c) => n + preguntasDe(c).length, 0);
  const completado = totalPreguntas > 0 && totalRespondidas >= totalPreguntas;
  // Los resultados NO se guardan bajo llave hasta el final: cada respuesta ya
  // está guardada, así que con una sola ya hay algo que enseñar. Quien lo deje a
  // medias ve lo suyo, y puede volver cuando quiera a seguir.
  const puedeVerResultados = totalRespondidas > 0;

  const responder = async (planeta: CuerpoKey, pregunta: PreguntaConEje, valor: boolean) => {
    if (!participante) throw new Error("sin participante");
    await guardarRespuesta(participante.id, planeta, pregunta.eje, pregunta.id, valor);
    setRespuestas((prev) => ({ ...prev, [clave(planeta, pregunta.id)]: valor }));
  };

  if (cargando || !fotosListas) return <LifeLoading />;

  const cuerpoAbierto = abierto ? cuerpos.find((c) => c.key === abierto) ?? null : null;
  const preguntasDelAbierto = cuerpoAbierto ? preguntasDe(cuerpoAbierto) : [];
  const respuestasDelAbierto: Record<string, boolean> = {};
  for (const p of preguntasDelAbierto) {
    const v = respuestas[clave(cuerpoAbierto!.key, p.id)];
    if (v !== undefined) respuestasDelAbierto[p.id] = v;
  }

  return (
    <EstudioLayout>
      <Flex direction="column" align="center" w="100%" maxW="1240px" gap={{ base: 6, md: 8 }}>
        {/* ── Cabecera ── */}
        <Reveal direction="down" distance={16} duration={0.7}>
          <Flex direction="column" align="center" gap={3} textAlign="center">
            <Text color="white" fontSize={{ base: "2xl", md: "4xl" }} fontWeight="700"
                  letterSpacing="0.06em" textTransform="uppercase" lineHeight="1.15"
                  textShadow="0 0 14px rgba(255,255,255,0.55), 0 0 32px rgba(180,255,245,0.3)">
              Tu cielo, planeta a planeta
            </Text>
            <Text color="rgba(255,255,255,0.85)" fontSize={{ base: "md", md: "lg" }} maxW="680px" lineHeight="1.75">
              Ahí tienes tu carta. Pincha cada planeta y responde a sus preguntas: solo Sí o No, sin
              pensarlo demasiado. Se guardan una a una, así que puedes parar y volver cuando quieras.
            </Text>
          </Flex>
        </Reveal>

        {/* La lectura de pago, arriba del todo: quien entra ya sabe que existe,
            no hay que llegar al final para enterarse. */}
        <Reveal direction="up" distance={14} duration={0.65} delay={0.08}>
          <BotonLecturaCarta email={participante?.email} datos={participante?.datos}
                             participanteId={participante?.id} />
        </Reveal>

        {/* ── Progreso general ── */}
        <Reveal direction="up" distance={14} duration={0.65} delay={0.12} w="100%" maxW="640px">
          <Flex align="center" gap={4}>
            <Box flex="1" h="4px" borderRadius="full" bg="rgba(255,255,255,0.18)">
              <Box h="100%" borderRadius="full" bg="white" transition="width 0.4s ease"
                   w={`${totalPreguntas ? (totalRespondidas / totalPreguntas) * 100 : 0}%`}
                   boxShadow="0 0 12px rgba(255,255,255,0.75)" />
            </Box>
            <Text color="rgba(255,255,255,0.85)" fontSize="sm" fontWeight="600" letterSpacing="0.08em" flexShrink={0}>
              {totalRespondidas} / {totalPreguntas}
            </Text>
          </Flex>
        </Reveal>

        {/* ── Los planetas ── */}
        {/* En móvil UNO DEBAJO DE OTRO (nada de dos columnas: los nombres y los
            signos no caben y el box se estrecha). Dos a partir de tablet, tres
            en escritorio. */}
        <RevealStagger
          display="grid"
          w="100%"
          gridTemplateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }}
          gap={{ base: 4, md: 6 }}
          stagger={0.055}
          delayChildren={0.2}
        >
          {cuerpos.map((c) => {
            const signo = participante!.signos[c.key];
            const casa = participante!.casas?.[c.key];
            const hechas = respondidasDe(c);
            const total = preguntasDe(c).length;
            const listo = hechas >= total;

            return (
              <RevealItem key={c.key}>
                <PlanetaEstudioBox
                  cuerpo={c}
                  onClick={() => setAbierto(c.key)}
                  hecho={listo}
                  progreso={{ hechas, total }}
                  subtitulo={
                    <Flex align="center" gap={1.5} mt={0.5}>
                      <GlifoSigno nombre={signo} size={16} color={c.color} />
                      <Text color={`${c.color}cc`} fontSize="sm" fontStyle="italic">
                        en {signo}{casa != null ? ` · casa ${casa}` : ""}
                      </Text>
                    </Flex>
                  }
                  nota={listo
                    ? "Respondido · puedes revisarlo"
                    : hechas > 0
                    ? "A medias · sigue donde lo dejaste"
                    : "Pincha para responder"}
                />
              </RevealItem>
            );
          })}
        </RevealStagger>

        {/* ── Salida hacia las estadísticas ── */}
        <Reveal direction="up" distance={16} duration={0.7} delay={0.25} w="100%" maxW="520px">
          <Flex direction="column" align="center" gap={3}>
            <Box
              as="button"
              onClick={() => { if (puedeVerResultados) navigate("/estudio/resultados"); }}
              w="100%"
              py={{ base: 4, md: 5 }}
              borderRadius="full"
              bg={puedeVerResultados ? "rgba(255,255,255,0.16)" : "transparent"}
              border={`1px solid ${puedeVerResultados ? "white" : "rgba(255,255,255,0.3)"}`}
              color={puedeVerResultados ? "white" : "rgba(255,255,255,0.45)"}
              fontFamily="'EB Garamond', serif"
              fontSize={{ base: "lg", md: "xl" }}
              fontWeight="700"
              letterSpacing="0.16em"
              textTransform="uppercase"
              cursor={puedeVerResultados ? "pointer" : "not-allowed"}
              transition="all 0.22s"
              _hover={puedeVerResultados ? { bg: "rgba(255,255,255,0.26)", boxShadow: "0 0 26px rgba(255,255,255,0.4)" } : {}}
            >
              Ver mis estadísticas →
            </Box>
            <Text color="rgba(255,255,255,0.66)" fontSize="sm" fontStyle="italic" textAlign="center">
              {completado
                ? "Ya está todo respondido. Vamos a ver qué dicen los números."
                : puedeVerResultados
                ? `Puedes ver ya lo que llevas respondido. Te quedan ${totalPreguntas - totalRespondidas} preguntas; tus respuestas se guardan solas, así que puedes seguir cuando quieras.`
                : "Responde a lo que quieras: cada respuesta se guarda al momento."}
            </Text>
          </Flex>
        </Reveal>
      </Flex>

      <PreguntasEstudioModal
        isOpen={!!cuerpoAbierto}
        onClose={() => setAbierto(null)}
        cuerpo={cuerpoAbierto}
        signo={cuerpoAbierto ? participante!.signos[cuerpoAbierto.key] : ""}
        casa={cuerpoAbierto ? participante!.casas?.[cuerpoAbierto.key] ?? null : null}
        preguntas={preguntasDelAbierto}
        respuestas={respuestasDelAbierto}
        onResponder={(pregunta, valor) => responder(cuerpoAbierto!.key, pregunta, valor)}
      />
    </EstudioLayout>
  );
}
