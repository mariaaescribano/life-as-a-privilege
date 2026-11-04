// El acceso de UNA persona: qué disciplinas tiene abiertas y hasta qué paso llega
// el Mapa de cada una. Es lo que antes vivía en la ficha desplegable de
// /admin/usuarios, que ya no existe. Aquí María abre y cierra: la persona no
// desbloquea nada por su cuenta.
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Flex, Text } from "@chakra-ui/react";
import { DISCIPLINAS_PAGO } from "../../data/adminDisciplinas";
import { CAMINO, type CaminoKey } from "../../data/camino";
import { focoBlanco } from "../../components/global/foco";
import { fechaDMA } from "../../utils/fechas";
import { API_URL } from "../../GlobalVariables";
import { adminHeaders } from "./useAdminGuard";
import { BotonPildora } from "./PildorasAdmin";

/** Disciplinas cuyo mapa abre solo la admin (mismas claves que el backend). */
const MAPA_ADMIN = ["psicologia", "fisiologia", "nutricion", "ayurveda", "tcm"] as const;

/** La cuenta con sus `<scope>_suscrito` y `<scope>_fecha_compra`. */
export interface CuentaAcceso {
  id: string;
  name: string;
  acceso_libre?: boolean;
  [flag: string]: any;
}

interface Props {
  persona: CuentaAcceso;
  /** Se llama con los campos nuevos de la cuenta tras abrir o cerrar algo. */
  onCambio: (nuevos: Partial<CuentaAcceso>) => void;
  onAviso: (texto: string | null) => void;
}

export default function AccesoPersona({ persona, onCambio, onAviso }: Props) {
  const [ocupado, setOcupado] = useState(false);
  const [pasos, setPasos] = useState<Record<string, number> | null>(null);
  const [guardandoMapa, setGuardandoMapa] = useState<string | null>(null);

  // Hasta qué paso llega cada disciplina: se lee al abrir y se guarda al pulsar − / +.
  useEffect(() => {
    let cancel = false;
    setPasos(null);
    axios
      .get<Record<string, number>>(`${API_URL}/recorrido-progreso/admin/${persona.id}`, { headers: adminHeaders() })
      .then((r) => { if (!cancel) setPasos(r.data ?? {}); })
      .catch(() => { if (!cancel) setPasos({}); });
    return () => { cancel = true; };
  }, [persona.id]);

  const cambiarAcceso = async (disciplina: string, abierta: boolean) => {
    setOcupado(true);
    onAviso(null);
    try {
      const { data } = await axios.post<CuentaAcceso>(
        `${API_URL}/user/admin/acceso`,
        { userId: persona.id, disciplina, abierta },
        { headers: adminHeaders() },
      );
      onCambio(data);
    } catch {
      onAviso(abierta ? "No se pudo conceder el acceso." : "No se pudo cerrar la disciplina.");
    } finally {
      setOcupado(false);
    }
  };

  const revocar = async () => {
    if (!window.confirm(`¿Quitar TODAS las disciplinas a ${persona.name}? Si había pagado, también las pierde.`)) return;
    setOcupado(true);
    onAviso(null);
    try {
      const { data } = await axios.post<CuentaAcceso>(
        `${API_URL}/user/admin/acceso/revocar`,
        { userId: persona.id },
        { headers: adminHeaders() },
      );
      onCambio(data);
    } catch {
      onAviso("No se pudo quitar el acceso.");
    } finally {
      setOcupado(false);
    }
  };

  const fijarPaso = async (disciplina: string, paso: number) => {
    setGuardandoMapa(disciplina);
    onAviso(null);
    try {
      const { data } = await axios.post<{ pasoMax: number }>(
        `${API_URL}/recorrido-progreso/admin/${persona.id}/${disciplina}`,
        { paso },
        { headers: adminHeaders() },
      );
      setPasos((prev) => ({ ...(prev ?? {}), [disciplina]: data.pasoMax }));
    } catch {
      onAviso("No se pudo guardar hasta dónde llega el mapa.");
    } finally {
      setGuardandoMapa(null);
    }
  };

  return (
    <Box>
      {persona.acceso_libre && (
        <Text color="#ffe3b0" fontSize="sm" fontStyle="italic" mb={3}>
          Esta cuenta tiene acceso libre por ACCESO_LIBRE_EMAILS: lo ve todo aunque aquí figure cerrado.
        </Text>
      )}

      {/* regalar / cerrar */}
      <Text color="rgba(255,255,255,0.78)" fontSize="sm" mb={2}>
        Toca una disciplina para regalársela; tócala otra vez para cerrarla. Van sueltas: abrir una no abre las anteriores.
      </Text>
      <Flex wrap="wrap" gap={2} mb={5}>
        {DISCIPLINAS_PAGO.map((d) => {
          const abiertaYa = !!persona[`${d.scope}_suscrito`];
          const fecha = fechaDMA(persona[`${d.scope}_fecha_compra`]);
          return (
            <Box
              key={d.scope}
              as="button"
              type="button"
              onClick={() => cambiarAcceso(d.scope, !abiertaYa)}
              title={abiertaYa ? `Cerrar ${d.nombre}${fecha ? ` (abierta el ${fecha})` : ""}` : `Regalar ${d.nombre}`}
              disabled={ocupado}
              px={3}
              py={1.5}
              borderRadius="full"
              bg={abiertaYa ? d.bg : "rgba(255,255,255,0.06)"}
              border={`1px solid ${abiertaYa ? d.txt : "rgba(255,255,255,0.28)"}`}
              color={abiertaYa ? d.txt : "rgba(255,255,255,0.8)"}
              fontSize="sm"
              fontWeight="600"
              cursor={ocupado ? "wait" : "pointer"}
              opacity={ocupado ? 0.6 : 1}
              transition="all 0.18s"
              _hover={{ transform: ocupado ? "none" : "translateY(-1px)", borderColor: d.txt }}
              _focusVisible={focoBlanco}
            >
              {abiertaYa ? "✓ " : ""}{d.nombre}
            </Box>
          );
        })}
      </Flex>

      {/* el mapa: hasta qué paso llega cada disciplina */}
      <Text color="rgba(255,255,255,0.78)" fontSize="sm" mb={2}>
        Mapa: el paso hasta el que puede entrar. Solo lo abres tú; la persona no lo desbloquea haciendo los ejercicios.
      </Text>
      <Flex wrap="wrap" gap={2} mb={5}>
        {MAPA_ADMIN.map((clave) => {
          const d = DISCIPLINAS_PAGO.find((x) => x.scope === clave);
          if (!d) return null;
          const total = CAMINO[clave as CaminoKey].total;
          const cargado = pasos !== null;
          const paso = Math.max(1, pasos?.[clave] ?? 1);
          const ocupadoMapa = ocupado || guardandoMapa === clave || !cargado;
          const botonPaso = (texto: string, nuevo: number, titulo: string) => (
            <Box
              as="button"
              type="button"
              onClick={() => fijarPaso(clave, nuevo)}
              disabled={ocupadoMapa || nuevo < 1 || nuevo > total}
              title={titulo}
              aria-label={titulo}
              w="26px"
              h="26px"
              borderRadius="full"
              border={`1px solid ${d.txt}`}
              color={d.txt}
              fontWeight="700"
              cursor={ocupadoMapa ? "wait" : "pointer"}
              opacity={ocupadoMapa || nuevo < 1 || nuevo > total ? 0.4 : 1}
              _focusVisible={focoBlanco}
            >
              {texto}
            </Box>
          );
          return (
            <Flex
              key={clave}
              align="center"
              gap={2}
              px={3}
              py={1}
              borderRadius="full"
              bg="rgba(255,255,255,0.06)"
              border={`1px solid ${d.txt}`}
            >
              <Text color={d.txt} fontSize="sm" fontWeight="600">{d.nombre}</Text>
              {botonPaso("−", paso - 1, `Cerrar el último paso abierto de ${d.nombre}`)}
              <Text color="white" fontSize="sm" minW="48px" textAlign="center">
                {cargado ? `${paso} / ${total}` : "…"}
              </Text>
              {botonPaso("+", paso + 1, `Abrir el siguiente paso de ${d.nombre}`)}
            </Flex>
          );
        })}
      </Flex>

      <Flex gap={3} wrap="wrap">
        <BotonPildora solido ocupado={ocupado} onClick={() => cambiarAcceso("all", true)}>Todo el recorrido gratis</BotonPildora>
        <BotonPildora peligro ocupado={ocupado} onClick={revocar}>Quitar acceso</BotonPildora>
      </Flex>
    </Box>
  );
}
