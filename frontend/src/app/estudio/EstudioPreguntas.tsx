import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
import { estadisticasDeEjemplo } from "../../data/estudioDemo";
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
  const location = useLocation();
  const [participante, setParticipante] = useState<ParticipanteEstudio | null>(null);
  const [cargando, setCargando] = useState(true);
  // Respuestas en memoria: { "sol|sol-1": true, … }. Se llenan con lo que ya
  // había guardado y se van actualizando conforme responde.
  const [respuestas, setRespuestas] = useState<Record<string, boolean>>({});
  const [abierto, setAbierto] = useState<CuerpoKey | null>(null);
  const [errorGuardado, setErrorGuardado] = useState<string | null>(null);

  // Vista de ejemplo: /estudio/preguntas?demo — carta inventada (la misma de
  // estudioDemo.ts) y sin guardar nada, para poder ver la pantalla sin darse de
  // alta. Nadie llega aquí por accidente.
  const esEjemplo = new URLSearchParams(location.search).has("demo");

  const fotosListas = useImagesReady([SPACE_IMG]);

  // Sin participante no hay preguntas que hacer: se vuelve a pedir los datos.
  useEffect(() => {
    if (esEjemplo) {
      // La carta de ejemplo, pero SIN respuestas: así se ve la pantalla tal y
      // como se la encuentra quien acaba de dar sus datos.
      setParticipante({ ...estadisticasDeEjemplo().participante, respuestas: [] });
      setCargando(false);
      return;
    }
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
  }, [navigate, esEjemplo]);

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

  /**
   * Responder es INSTANTÁNEO: se apunta en pantalla y el POST viaja por detrás.
   * Son decenas de preguntas seguidas y cada guardado tarda lo suyo (viaje al
   * servidor + base de datos); esperar a cada Sí/No hacía el cuestionario lento.
   * Si un guardado falla, esa respuesta se deshace y se avisa: nada se da por
   * guardado sin estarlo.
   *
   * Al terminar todas NO pasa nada: no hay salida a estadísticas ni mensaje de
   * final. Quien responde deja sus respuestas y se queda donde está.
   */
  const responder = (planeta: CuerpoKey, pregunta: PreguntaConEje, valor: boolean) => {
    if (!participante) return;
    const k = clave(planeta, pregunta.id);
    const anterior = respuestas[k];

    setRespuestas((prev) => ({ ...prev, [k]: valor }));
    setErrorGuardado(null);
    if (esEjemplo) return; // la vista de ejemplo no guarda nada

    guardarRespuesta(participante.id, planeta, pregunta.eje, pregunta.id, valor)
      .catch(() => {
        setRespuestas((prev) => {
          const copia = { ...prev };
          if (anterior === undefined) delete copia[k];
          else copia[k] = anterior;
          return copia;
        });
        setErrorGuardado(
          "Alguna respuesta no se ha podido guardar. Revisa la conexión y vuelve a responderla.",
        );
      });
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
              Tus planetas y sus preguntas
            </Text>
            <Text color="rgba(255,255,255,0.85)" fontSize={{ base: "md", md: "lg" }} maxW="680px" lineHeight="1.75">
              Gracias por tu colaboración, tus respuestas son valiosas.
            </Text>
          </Flex>
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

        {/* ── Cierre: la lectura de pago ──
            El único botón de la pantalla, y va AL FINAL: primero se responde;
            quien quiera su lectura la encuentra al terminar de bajar. No hay
            salida a estadísticas: al responderlo todo no pasa nada. */}
        <Reveal direction="up" distance={16} duration={0.7} delay={0.25} w="100%" maxW="520px">
          <Flex direction="column" align="center" gap={3}>
            {errorGuardado && (
              <Text color="#ffb8b8" fontSize="sm" fontStyle="italic" textAlign="center">
                {errorGuardado}
              </Text>
            )}
            <BotonLecturaCarta email={participante?.email} datos={participante?.datos}
                               participanteId={participante?.id} variant="destacado" />
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
        error={errorGuardado}
      />
    </EstudioLayout>
  );
}
