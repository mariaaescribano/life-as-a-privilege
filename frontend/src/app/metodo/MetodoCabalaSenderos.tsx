import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Box, Flex, Text } from "@chakra-ui/react";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { CabalaLoading } from "../../components/metodo/comicLoaders";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { IndiceCabala } from "../../components/metodo/IndiceCabala";
import { BotonCompania } from "../../components/global/BotonCompania";
import { Reveal } from "../../components/global/Reveal";
import { DisciplinaBgLayer } from "../../components/global/DisciplinaBgLayer";
import ArbolDeLaVida from "../../components/global/ArbolDeLaVida";
import { CabalaSefiraIlustracionModal } from "../../components/metodo/CabalaSefiraIlustracionModal";
import { CABALA_SENDEROS } from "../../components/metodo/cabalaSenderos";
import { CABALA_SENDERO_VINETA_NUMS } from "../../components/metodo/cabalaSenderoIlustraciones";
import { useVinetasSenderos } from "../../components/metodo/cabalaEn";
import { CABALA_TOTAL_PAGINAS, CABALA_PAG } from "../../components/metodo/cabalaSefirot";
import { API_URL, cabalaBg, cabalaNom, cabalaTxt, CabalaIcon } from "../../GlobalVariables";
import { CAJA_GLOW } from "../../components/metodo/cabalaGlow";
import { CabalaIlustracionesModal } from "../../components/metodo/CabalaIlustracionesModal";
import { useT } from "../../i18n";
import { flushSaves } from "../../utils/flushSaves";

export default function MetodoCabalaSenderos() {
  const t = useT();
  const navigate = useNavigate();
  // Las ilustraciones en el idioma activo (el orden y las fotos, del español).
  const vinetasSenderos = useVinetasSenderos();
  const [loading, setLoading] = useState(true);
  const [ilustracionesOpen, setIlustracionesOpen] = useState(false);
  // Senderos con su ilustración ya vista, y el que se está viendo en el modal.
  const [readNums, setReadNums] = useState<Set<number>>(new Set());
  const [modalNum, setModalNum] = useState<number | null>(null);
  const dataRef = useRef<any>({}); // copia de metodo_cabala.data para mergear al guardar

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (!userId || !token) { navigate("/welcome"); return; }
    (async () => {
      try {
        const me = await axios.get(`${API_URL}/user/me`, { headers: { Authorization: `Bearer ${token}` } });
        if (!me.data?.cabala_suscrito) { navigate("/metodo/cabala"); return; }
        try {
          const res = await axios.get(`${API_URL}/metodo-cabala/${userId}`, { headers: { Authorization: `Bearer ${token}` } });
          dataRef.current = res.data?.data ?? {};
          const vistos: any[] = Array.isArray(dataRef.current.senderoIlustracionesVistas) ? dataRef.current.senderoIlustracionesVistas : [];
          setReadNums(new Set(vistos.map((n) => Number(n))));
        } catch { /* sin fila todavía */ }
      } catch {
        navigate("/metodo/cabala");
        return;
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  // Marca un sendero como visto (badge dorado) y persiste en metodo_cabala.data.
  const marcarLeido = useCallback((num: number) => {
    setReadNums((prev) => {
      if (prev.has(num)) return prev;
      const next = new Set(prev);
      next.add(num);
      const data = { ...dataRef.current, senderoIlustracionesVistas: Array.from(next) };
      dataRef.current = data;
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");
      if (userId && token) {
        axios.patch(`${API_URL}/metodo-cabala/${userId}`, { data }, { headers: { Authorization: `Bearer ${token}` } }).catch(() => {});
      }
      return next;
    });
  }, []);

  // El recorrido sendero a sendero se desbloquea cuando están TODOS vistos.
  const todosVistos = CABALA_SENDEROS.every((s) => readNums.has(s.num));
  const primero = CABALA_SENDEROS[0];

  // Marcar ilustraciones vistas dispara PATCHes que reescriben el blob entero;
  // se espera a que lleguen antes de cambiar de página para que la siguiente no
  // lea datos viejos y los revierta al guardar (ver flushSaves).
  const ir = async (ruta: string) => {
    await flushSaves();
    navigate(ruta);
  };

  if (loading) {
    return <CabalaLoading />;
  }

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 12, md: 16 }}>
        <Flex direction="column" align="center" w="100%" maxW="850px" gap={7}>

          <Reveal direction="down" distance={22} duration={1.2} w="100%" display="flex" justifyContent="center">
            <MetodoStepHeader
              icon={<CabalaIcon size={{ base: "40px", md: "56px" }} />}
              title={t("metodo.cabala.paso.senderos22")}
              pageLabel={`${CABALA_PAG.senderos}/${CABALA_TOTAL_PAGINAS}`}
              compact
              bgColor={`${cabalaBg}dd`}
              color={cabalaTxt}
              nom={cabalaNom}
              mb={0}
              prev={{ label: `← ${t("metodo.cabala.mapaEvolutivo")}`, onClick: () => void ir("/metodo/cabala/diagnostico") }}
              extra={{ label: t("metodo.ilustraciones"), onClick: () => setIlustracionesOpen(true)}}
              next={{
                label: `${t("metodo.cabala.senderos.recorrer")} →`,
                onClick: () => void ir(`/metodo/cabala/sendero/${primero.num}`),
                disabled: !todosVistos,
                disabledTooltip: t("metodo.cabala.senderos.desbloquea"),
              }}
            />
          </Reveal>

          <Reveal direction="up" distance={22} delay={0.55} duration={1.3} display="flex" justifyContent="center">
            {/* Sin sombra: el texto de debajo del header va sobre el turquesa limpio. */}
            <Text color="rgba(255,255,255,0.9)" fontSize={{ base: "md", md: "lg" }} fontStyle="italic" textAlign="center"
                  lineHeight="1.8" maxW="600px">
              {t("metodo.cabala.senderos.intro")}
            </Text>
          </Reveal>

          {/* Árbol en modo senderos: al pulsar un camino, se entra en su página.
              El box aparece rápido (sin blur ni gran retardo) para que se VEA el
              trazado épico de los 22 senderos dibujándose dentro del SVG. */}
          <Reveal direction="up" distance={20} delay={0.3} duration={0.55} w="100%">
            <Box
              w="100%"
              position="relative"
              overflow="hidden"
              boxShadow={CAJA_GLOW}
              border={`1.5px solid ${cabalaTxt}55`}
              borderRadius="3xl"
              // Padding corto a propósito: el Árbol es el contenido del box, así
              // que se le deja casi todo el hueco en vez de rodearlo de aire.
              px={{ base: 2, md: 5 }}
              pt={{ base: 4, md: 6 }}
              pb={{ base: 4, md: 6 }}
            >
              {/* Fondo del box = imagen de la disciplina (cabala.png). */}
              <DisciplinaBgLayer nom={cabalaNom} borderRadius="3xl" overlay="rgba(6,3,1,0.5)" />
              <Box position="relative" zIndex={1}>
                <ArbolDeLaVida
                  // Más ancho que el 520px por defecto: con el padding corto, el
                  // Árbol llena el box en vez de quedarse pequeño en el centro.
                  maxWidth="620px"
                  variant="senderos"
                  readSenderos={readNums}
                  onSenderoClick={(s) => setModalNum(s.num)}
                />
              </Box>
            </Box>
          </Reveal>

          {/* Comenzar por el principio — se desbloquea al ver TODAS las ilustraciones */}
          <Reveal direction="up" distance={22} delay={1.7} duration={1.3} display="flex" justifyContent="center">
            <Box as="button"
                 onClick={todosVistos ? () => void ir(`/metodo/cabala/sendero/${primero.num}`) : undefined}
                 disabled={!todosVistos}
                 px={8} py={3} borderRadius="full"
                 bg={todosVistos ? `${cabalaTxt}18` : `${cabalaTxt}0a`}
                 border={`1.5px solid ${todosVistos ? `${cabalaTxt}66` : `${cabalaTxt}2a`}`}
                 color={todosVistos ? cabalaTxt : `${cabalaTxt}66`}
                 fontSize={{ base: "md", md: "lg" }} fontWeight="700" letterSpacing="0.04em"
                 cursor={todosVistos ? "pointer" : "not-allowed"} transition="all 0.18s"
                 boxShadow={todosVistos ? `0 0 18px ${cabalaTxt}44` : "none"}
                 _hover={todosVistos ? { bg: `${cabalaTxt}2e`, borderColor: cabalaTxt, transform: "translateY(-2px)" } : undefined}>
              {todosVistos
                ? `${t("metodo.cabala.senderos.comenzarPor", { letra: `${primero.letra} (${primero.hebreo})` })} →`
                : t("metodo.cabala.senderos.descubreTodos")}
            </Box>
          </Reveal>
        </Flex>
      </Flex>

      {/* Ilustraciones de los 22 senderos: se abre en el pulsado y se puede ir de
          uno a otro con las flechas (sin salir y entrar). Cada uno se marca como
          visto según se navega (su insignia se invierte en el árbol). */}
      {modalNum !== null && (
        <CabalaSefiraIlustracionModal
          isOpen={modalNum !== null}
          vinetas={vinetasSenderos}
          initialIndex={Math.max(0, CABALA_SENDERO_VINETA_NUMS.indexOf(modalNum))}
          onPageView={(i) => marcarLeido(CABALA_SENDERO_VINETA_NUMS[i])}
          onClose={() => setModalNum(null)}
          onComplete={() => setModalNum(null)}
        />
      )}

      <CabalaIlustracionesModal isOpen={ilustracionesOpen} onClose={() => setIlustracionesOpen(false)} />

      <BotonCompania color={cabalaTxt} bgColor={cabalaBg} disciplinaNom={cabalaNom} />
      <SiteFooter />

      <IndiceCabala />
    </Box>
  );
}
