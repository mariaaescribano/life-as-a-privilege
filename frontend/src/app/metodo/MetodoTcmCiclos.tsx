import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex, Text } from "@chakra-ui/react";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { TcmLoader } from "../../components/metodo/comicLoaders";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { useIlustracionesTcm } from "../../components/metodo/IlustracionesTcm";
import { BotonCompania } from "../../components/global/BotonCompania";
import { IndiceTcm } from "../../components/metodo/IndiceTcm";
import { Reveal } from "../../components/global/Reveal";
import { API_URL, tcmBg, tcmNom, tcmTxt, TCMIcon } from "../../GlobalVariables";
import { CICLO_SHENG, CICLO_KE, ORDEN_ELEMENTOS, type Elemento, type DatosTcm } from "../../components/metodo/tcmRecorrido";
import { ICONO_ELEMENTO } from "../../components/metodo/tcmElementosContenido";
import { EstrellaCiclo, RelacionModal, FONDO_CICLO, type Ciclo, type Relacion } from "../../components/metodo/tcmCiclosVisual";
import { usePrecargarImagenes } from "../../hooks/usePrecargarImagenes";

export default function MetodoTcmCiclos() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [sel, setSel] = useState<Relacion | null>(null);
  // Flechitas ya vistas (clave `${ciclo}-${origen}`). No se puede avanzar hasta
  // haberlas tocado todas (5 del Sheng + 5 del Ke = 10).
  const [vistas, setVistas] = useState<Set<string>>(new Set());
  const TOTAL_FLECHAS = ORDEN_ELEMENTOS.length * 2;
  // Blob completo de metodo_tcm.data (para no pisar otros campos al guardar) y
  // el flag persistido: si el usuario YA leyó todas las relaciones una vez, el
  // botón «Diagnóstico final» queda desbloqueado desde el principio, para siempre.
  const datosRef = useRef<DatosTcm>({});
  const [yaLeido, setYaLeido] = useState(false);
  const { extra: ilustracionesBtn, modal: ilustracionesModal } = useIlustracionesTcm();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (!userId || !token) { navigate("/welcome"); return; }

    (async () => {
      try {
        const me = await axios.get(`${API_URL}/user/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!me.data?.tcm_suscrito) { navigate("/metodo/tcm"); return; }
        const res = await axios.get(`${API_URL}/metodo-tcm/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const d: DatosTcm = res.data?.data ?? {};
        datosRef.current = d;
        // Ya visto antes: desbloqueamos y damos TODAS las relaciones por vistas,
        // para que la página cargue como completada (flechitas marcadas + botón
        // «Diagnóstico final» abierto) y no haya que volver a tocarlas.
        if (d.ciclosLeidos) {
          setYaLeido(true);
          const todas = new Set<string>();
          for (const ciclo of ["sheng", "ke"] as Ciclo[]) {
            for (const el of ORDEN_ELEMENTOS) todas.add(`${ciclo}-${el}`);
          }
          setVistas(todas);
        }
      } catch {
        navigate("/metodo/tcm");
        return;
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  // En cuanto el usuario descubre TODAS las relaciones por primera vez, lo
  // marcamos en la BD (merge sobre el blob) para que no tenga que repetirlo.
  useEffect(() => {
    if (yaLeido || vistas.size < TOTAL_FLECHAS) return;
    setYaLeido(true);
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (!userId || !token) return;
    const next: DatosTcm = { ...datosRef.current, ciclosLeidos: true };
    datosRef.current = next;
    axios.patch(`${API_URL}/metodo-tcm/${userId}`, { data: next },
      { headers: { Authorization: `Bearer ${token}` } })
      .catch(() => { /* el estado local ya lo refleja; se reintenta al volver a completar */ });
  }, [vistas, yaLeido, TOTAL_FLECHAS]);

  // Marca una relación como vista. Se llama tanto al pulsar su flechita como al
  // pasar por ella dentro del cómic (onView), porque el usuario puede recorrer
  // TODAS las relaciones de un ciclo navegando el cómic sin tocar cada flechita.
  const verRelacion = (ciclo: Ciclo, origen: Elemento) => {
    setVistas((prev) => {
      const key = `${ciclo}-${origen}`;
      if (prev.has(key)) return prev;
      const next = new Set(prev);
      next.add(key);
      return next;
    });
  };

  const abrir = (ciclo: Ciclo, origen: Elemento) => {
    const destino = ciclo === "sheng" ? CICLO_SHENG[origen] : CICLO_KE[origen];
    setSel({ ciclo, origen, destino });
    verRelacion(ciclo, origen);
  };

  // No quitamos el spinner hasta que estén descargados los iconos de los
  // elementos Y las fotos de fondo de las dos estrellas (generador/controlador),
  // para que la página no aparezca —ni las animaciones empiecen— hasta que los
  // fondos ya se vean.
  const iconosListos = usePrecargarImagenes([
    ...ORDEN_ELEMENTOS.map((el) => ICONO_ELEMENTO[el]),
    FONDO_CICLO.sheng,
    FONDO_CICLO.ke,
  ]);

  if (loading || !iconosListos) {
    return (
      <Box minH="100vh" bg="#008080" display="flex" alignItems="center" justifyContent="center">
        <TcmLoader color="#ffffff" />
      </Box>
    );
  }

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 12, md: 16 }}>
        <Flex direction="column" align="center" w="100%" maxW="1080px" gap={7}>

          <Reveal direction="down" distance={16} duration={0.6} w="100%" display="flex" justifyContent="center">
          <MetodoStepHeader
            icon={<TCMIcon size={{ base: "40px", md: "56px" }} />}
            title="Los Ciclos"
            pageLabel="3/10"
            compact
            bgColor={`${tcmBg}dd`}
            color={tcmTxt}
            nom={tcmNom}
            mb={0}
            prev={{ label: "← Los 5 elementos", onClick: () => navigate("/metodo/tcm/elementos") }}
            extra={ilustracionesBtn}
            next={{
              label: "Diagnóstico final →",
              onClick: () => navigate("/metodo/tcm/diagnostico"),
              disabled: !yaLeido && vistas.size < TOTAL_FLECHAS,
              disabledTooltip: "Toca todas las flechitas para descubrir cada relación",
            }}
          />
          </Reveal>

          <Reveal direction="up" distance={20} delay={0.12} duration={0.65} display="flex" justifyContent="center">
          <Text color="white" fontStyle="italic" fontSize={{ base: "md", md: "lg" }} lineHeight="1.8"
                textAlign="center" maxW="640px">
            Los Cinco Elementos no viven aislados: se relacionan en dos ciclos. Cuando
            fluyen, hay equilibrio; cuando se alteran, aparece el desequilibrio. Toca
            cada flechita para descubrir la relación.
          </Text>
          </Reveal>

          {/* ── Las dos estrellas ──
              Ambas cajas entran con el MISMO timing (sin desfase entre sí): en
              desktop están a la vez en pantalla → animan juntas; en móvil, cada
              una espera a su propio scroll (`inView`). La coreografía interna
              (elementos → flechas) la lleva la propia EstrellaCiclo. */}
          <Flex direction={{ base: "column", md: "row" }} gap={5} w="100%" align="stretch">
            <Reveal inView direction="right" distance={30} scaleFrom={0.97} duration={0.6} amount={0.2} w="100%" display="flex">
            <EstrellaCiclo
              titulo="Ciclo generador"
              pinyin="Sheng"
              hanzi="生"
              subtitulo=""
              ciclo="sheng"
              onEdge={abrir}
            />
            </Reveal>
            <Reveal inView direction="left" distance={30} scaleFrom={0.97} duration={0.6} amount={0.2} w="100%" display="flex">
            <EstrellaCiclo
              titulo="Ciclo de control"
              pinyin="Ke"
              hanzi="克"
              subtitulo=""
              ciclo="ke"
              onEdge={abrir}
            />
            </Reveal>
          </Flex>

          <Reveal inView direction="up" distance={14} duration={0.6} amount={0.3} display="flex" justifyContent="center">
          <Text color="rgba(255,255,255,0.6)" fontSize="xs" fontStyle="italic" textAlign="center" maxW="640px"
                lineHeight="1.6">
            En el ciclo generador la energía avanza por el perímetro (Madera → Fuego →
            Tierra → Metal → Agua). En el ciclo de control cruza la estrella: cada
            elemento frena al que tiene enfrente para mantener el conjunto en armonía.
          </Text>
          </Reveal>
        </Flex>
      </Flex>

      {ilustracionesModal}

      {/* Popup de la relación (reutiliza el ComicViewer inmersivo) */}
      <RelacionModal rel={sel} onClose={() => setSel(null)} onView={verRelacion} />

      <IndiceTcm />

      <BotonCompania color={tcmTxt} bgColor={tcmBg} disciplinaNom={tcmNom} />

      <SiteFooter />
    </Box>
  );
}
