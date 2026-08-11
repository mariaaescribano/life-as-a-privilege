// ─────────────────────────────────────────────────────────────────────────
// PASO 11 · «CREA TUS PROPIOS APUNTES» (Medicina China)
//
// El último paso antes de volver al Mapa. Aquí no se aprende nada nuevo: se
// decide qué se lleva de todo lo recorrido y se descarga en un PDF hecho para
// leer en el sofá o imprimir.
//
// La pantalla es el componente compartido `CreaTusApuntes`; lo único de esta
// página es su LIBRO (components/metodo/apuntes/tcmApuntes.ts), que necesita los
// datos guardados de la persona: sin sus tests no hay diagnóstico que imprimir y
// sin su lengua no hay lectura, así que esos dos capítulos salen con candado.
// ─────────────────────────────────────────────────────────────────────────
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex, Text } from "@chakra-ui/react";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { TcmLoading } from "../../components/metodo/comicLoaders";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { useIlustracionesTcm } from "../../components/metodo/IlustracionesTcm";
import { BotonCompania } from "../../components/global/BotonCompania";
import { IndiceTcm } from "../../components/metodo/IndiceTcm";
import { Reveal } from "../../components/global/Reveal";
import { BotonPaso } from "../../components/metodo/BotonPaso";
import { CreaTusApuntes } from "../../components/metodo/CreaTusApuntes";
import { libroApuntesTcm } from "../../components/metodo/apuntes/tcmApuntes";
import { disciplinaBgImg } from "../../components/global/DisciplinaBgLayer";
import { usePrecargarImagenes } from "../../hooks/usePrecargarImagenes";
import { API_URL, tcmBg, tcmNom, tcmTxt, TCMIcon } from "../../GlobalVariables";
import type { DatosTcm } from "../../components/metodo/tcmRecorrido";

const CAJA_GLOW = `0 0 16px rgba(255,255,255,0.16), 0 0 34px rgba(255,255,255,0.08), 0 0 60px rgba(180,255,245,0.09), 0 0 20px ${tcmTxt}1a, 0 0 48px ${tcmTxt}10`;

// Candado blanco con brillo (mismo que el resto de botones de disciplina
// bloqueada). Estaba en «Cursos», que era el último paso; ahora el último es
// este, así que el enlace a la Fisiología —y su candado— viven aquí.
const Candado = ({ size }: { size: any }) => (
  <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"
       w={size} h={size} fill={tcmTxt}
       style={{ filter: "drop-shadow(0 0 6px rgba(255,255,255,0.55)) drop-shadow(0 1px 3px rgba(0,0,0,0.6))" }}>
    <path d="M240-80q-33 0-56.5-23.5T160-160v-400q0-33 23.5-56.5T240-640h40v-80q0-83 58.5-141.5T480-920q83 0 141.5 58.5T680-720v80h40q33 0 56.5 23.5T800-560v400q0 33-23.5 56.5T720-80H240Zm0-80h480v-400H240v400Zm240-120q33 0 56.5-23.5T560-360q0-33-23.5-56.5T480-440q-33 0-56.5 23.5T400-360q0 33 23.5 56.5T480-280ZM360-640h240v-80q0-50-35-85t-85-35q-50 0-85 35t-35 85v80Z" />
  </Box>
);

export default function MetodoTcmApuntes() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [datos, setDatos] = useState<DatosTcm>({});
  const [nombre, setNombre] = useState("");
  // ¿Ha pagado ya la Fisiología? (la disciplina que se aconseja después).
  const [fisioSuscrito, setFisioSuscrito] = useState(false);
  const { extra: ilustracionesBtn, modal: ilustracionesModal } = useIlustracionesTcm();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (!userId || !token) { navigate("/welcome"); return; }

    (async () => {
      try {
        const me = await axios.get(`${API_URL}/user/me`, { headers: { Authorization: `Bearer ${token}` } });
        if (!me.data?.tcm_suscrito) { navigate("/metodo/tcm"); return; }
        // Su nombre va en la portada: estos apuntes son suyos.
        setNombre(String(me.data?.name ?? "").trim());
        setFisioSuscrito(!!me.data?.fisiologia_suscrito);
      } catch {
        navigate("/metodo/tcm");
        return;
      }

      // Lo guardado del recorrido. Si no hay nada (o viene con otra forma), se
      // sigue: lo único que pasa es que los dos capítulos personales salen con
      // candado en vez de reventar la página.
      try {
        const res = await axios.get(`${API_URL}/metodo-tcm/${userId}`, { headers: { Authorization: `Bearer ${token}` } });
        const d = res.data?.data;
        setDatos(d && typeof d === "object" ? (d as DatosTcm) : {});
      } catch { /* sin datos guardados */ }

      setLoading(false);
    })();
  }, [navigate]);

  const libro = useMemo(() => libroApuntesTcm(datos), [datos]);

  // El loader se queda puesto hasta tener el fondo y las miniaturas de las
  // portadas: la página entra completa, no a trozos.
  const imagenesListas = usePrecargarImagenes([
    disciplinaBgImg(tcmNom),
    ...libro.portadas.map((p) => p.src),
  ]);

  if (loading || !imagenesListas) {
    return <TcmLoading />;
  }

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 12, md: 16 }}>
        <Flex direction="column" align="center" w="100%" maxW="850px" gap={7}>

          <Reveal direction="down" distance={16} duration={0.6} w="100%" display="flex" justifyContent="center">
          <MetodoStepHeader
            icon={<TCMIcon size={{ base: "40px", md: "56px" }} />}
            title="Crea tus propios apuntes"
            pageLabel="11/11"
            compact
            bgColor={`${tcmBg}dd`}
            color={tcmTxt}
            nom={tcmNom}
            mb={0}
            prev={{ label: "← Cursos", onClick: () => navigate("/metodo/tcm/cursos") }}
            extra={ilustracionesBtn}
            next={fisioSuscrito
              ? { label: "Fisiología →", onClick: () => navigate("/metodo/fisiologia") }
              : { label: "Fisiología →", icon: <Candado size="15px" />, onClick: () => navigate("/metodo/fisiologia") }}
          />
          </Reveal>

          {/* Sobre el turquesa: blanco y sin sombra (regla de la casa). */}
          <Reveal direction="up" distance={20} delay={0.12} duration={0.65} display="flex" justifyContent="center">
          <Flex direction="column" align="center" gap={2} maxW="680px">
            <Text color="white" fontSize={{ base: "md", md: "lg" }} lineHeight="1.9" textAlign="center">
              Has recorrido la Medicina China entera. Ahora decide qué te llevas: marca lo que quieras
              —tu diagnóstico, la lectura de tu lengua, las cocinas, las leyes del Tao, las prácticas— y
              te lo montamos en un cuaderno para leer sin pantalla.
            </Text>
            <Text color="white" fontSize={{ base: "sm", md: "md" }} fontStyle="italic" opacity={0.9}
                  textAlign="center">
              Se prepara aquí mismo, en tu navegador. Puedes volver y montarlo otra vez cuantas veces quieras.
            </Text>
          </Flex>
          </Reveal>

          <CreaTusApuntes
            libro={libro}
            nom={tcmNom}
            txt={tcmTxt}
            bg={tcmBg}
            nombre={nombre}
            glow={CAJA_GLOW}
          />

          {/* Mismo texto que el botón del header, como en todo el recorrido. */}
          <BotonPaso label="Fisiología" nom={tcmNom} color={tcmTxt} bg={tcmBg}
                     onClick={() => navigate("/metodo/fisiologia")} />
        </Flex>
      </Flex>

      {ilustracionesModal}

      <IndiceTcm />

      <BotonCompania color={tcmTxt} bgColor={tcmBg} disciplinaNom={tcmNom} />

      <SiteFooter />
    </Box>
  );
}
