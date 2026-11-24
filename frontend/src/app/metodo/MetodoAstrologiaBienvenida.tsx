import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Flex } from "@chakra-ui/react";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { TextoPorSecciones, construirSecciones } from "../../components/metodo/TextoPorSecciones";
import { AstrologiaLoading } from "../../components/metodo/comicLoaders";
import { Reveal } from "../../components/global/Reveal";
import { API_URL, astrologiaBg, astrologiaTxt, AstrologiaIcon } from "../../GlobalVariables";
import { useT } from "../../i18n";

/**
 * Paso 1 del camino de Astrología (justo después de EMPEZAR): el recibimiento que María escribe para ESA persona
 * (editor de su carta, /admin/astrologia/:userId, «La bienvenida»; se guarda en `data.bienvenida`).
 * Es el paso 1 del camino. Aquí no se escribe nada. Sin texto escrito, la página salta sola a la Historia (paso 2).
 */
export default function MetodoAstrologiaBienvenida() {
  const t = useT();
  const navigate = useNavigate();
  // Si se llega «hacia atrás» (desde la Historia) y no hay texto, no se salta a la Historia otra vez: se sigue hacia atrás.
  const vieneDeAtras = !!(useLocation().state as { atras?: boolean } | null)?.atras;
  const sinTexto = vieneDeAtras ? "/metodo/astrologia/origen" : "/metodo/astrologia/historia";
  const [texto, setTexto] = useState<string | null>(null);

  useEffect(() => { window.scrollTo({ top: 0, behavior: "auto" }); }, []);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) { navigate(sinTexto, { replace: true }); return; }
    let vivo = true;
    axios.get<{ data?: { bienvenida?: string } } | null>(`${API_URL}/metodo-astrologia/${userId}`)
      .then((r) => {
        const b = typeof r.data?.data?.bienvenida === "string" ? r.data.data.bienvenida.trim() : "";
        if (!vivo) return;
        if (!b) navigate(sinTexto, { replace: true });
        else setTexto(b);
      })
      .catch(() => { if (vivo) navigate(sinTexto, { replace: true }); });
    return () => { vivo = false; };
  }, [navigate]);

  if (texto === null) return <AstrologiaLoading />;

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#F0DCC0" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 28, md: 36 }}>
        <Flex direction="column" align="center" w="100%" maxW="850px" gap={{ base: 7, md: 9 }}>
          <Reveal direction="down" distance={16} duration={0.6} w="100%">
            <MetodoStepHeader
              icon={<AstrologiaIcon size={{ base: "40px", md: "52px" }} />}
              title={t("metodo.astro.paso.bienvenida")}
              bgColor={`${astrologiaBg}dd`}
              color={astrologiaTxt}
              space
              step={{ current: 1, total: 19 }}
              mb={0}
              next={{ label: `${t("metodo.astro.paso.historia")} →`, onClick: () => navigate("/metodo/astrologia/historia") }}
            />
          </Reveal>

          {/* Mismo texto y separadores que las Áreas: cada «---» es una línea con el icono de Astrología en medio. */}
          <TextoPorSecciones secciones={construirSecciones(texto)} retraso={0.2} />
        </Flex>
      </Flex>

      <SiteFooter />
    </Box>
  );
}
