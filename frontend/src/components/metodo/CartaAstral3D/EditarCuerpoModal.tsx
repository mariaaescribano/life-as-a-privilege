import React, { useState } from "react";
import { Box, Flex, Input, Select, Text } from "@chakra-ui/react";
import axios from "axios";
import { API_URL } from "../../../GlobalVariables";
import { ZODIAC_SIGNS } from "../astrologiaData";
import type { CartaNatal } from "./types";
import { useT } from "../../../i18n";

type CuerpoManual = "quiron" | "lilith" | "nodoNorte" | "nodoSur";

const CUERPO_LABEL: Record<CuerpoManual, string> = {
  quiron: "Quirón",
  lilith: "Lilith",
  nodoNorte: "Nodo Norte",
  nodoSur: "Nodo Sur",
};

interface EditarCuerpoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdated: (carta: CartaNatal) => void;
  color: string;
}

export function EditarCuerpoModal({ isOpen, onClose, onUpdated, color }: EditarCuerpoModalProps) {
  const t = useT();
  const [planeta, setPlaneta] = useState<CuerpoManual>("quiron");
  const [signoIdx, setSignoIdx] = useState(0);
  const [gradoSigno, setGradoSigno] = useState("0");
  const [minutos, setMinutos] = useState("0");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const guardar = async () => {
    setError(null);
    const g = parseFloat(gradoSigno);
    const m = parseFloat(minutos);
    if (!Number.isFinite(g) || g < 0 || g >= 30) {
      setError(t("metodo.astro.ajustar.errorGrado"));
      return;
    }
    if (!Number.isFinite(m) || m < 0 || m >= 60) {
      setError(t("metodo.astro.ajustar.errorMinutos"));
      return;
    }
    const gradoAbsoluto = signoIdx * 30 + g + m / 60;

    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (!userId || !token) {
      setError("Sesión caducada");
      return;
    }

    setSaving(true);
    try {
      const res = await axios.patch<{ success: boolean; message?: string; carta?: CartaNatal }>(
        `${API_URL}/metodo-astrologia/carta-natal/${userId}/cuerpo`,
        { planeta, grado: gradoAbsoluto },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (!res.data.success) {
        setError(res.data.message || t("metodo.astro.ajustar.errorGuardar"));
        return;
      }
      if (res.data.carta) onUpdated(res.data.carta);
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Error desconocido");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box
      position="fixed"
      inset={0}
      zIndex={300}
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg="rgba(0,0,0,0.6)"
      sx={{ backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)" }}
      onClick={onClose}
      px={{ base: 5, md: 10 }}
    >
      <Box
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
        bg="#0c1230f0"
        border={`1px solid ${color}55`}
        sx={{ backdropFilter: "blur(20px)" }}
        borderRadius="2xl"
        boxShadow={`0 12px 60px rgba(0,0,0,0.55), 0 0 80px ${color}33`}
        p={{ base: 6, md: 8 }}
        maxW="460px"
        w="100%"
        display="flex"
        flexDirection="column"
        gap={4}
      >
        <Text
          color={color}
          fontSize={{ base: "xl", md: "2xl" }}
          fontWeight="700"
          letterSpacing="0.04em"
          textAlign="center"
          style={{ textShadow: `0 0 12px ${color}99` }}
        >
          {t("metodo.astro.ajustar.titulo")}
        </Text>

        <Text color={`${color}cc`} fontSize="sm" textAlign="center" fontStyle="italic" lineHeight="1.55">
          {t("metodo.astro.ajustar.nodos")}
        </Text>

        <Box>
          <Text color={`${color}aa`} fontSize="xs" letterSpacing="0.14em" mb={1.5} fontWeight="600" textTransform="uppercase">
            {t("metodo.astro.ajustar.cuerpo")}
          </Text>
          <Select
            value={planeta}
            onChange={(e) => setPlaneta(e.target.value as CuerpoManual)}
            bg="rgba(8,13,30,0.55)"
            color={color}
            borderColor={`${color}44`}
            sx={{ option: { background: "#0c1230", color } }}
          >
            <option value="quiron">{CUERPO_LABEL.quiron}</option>
            <option value="lilith">{CUERPO_LABEL.lilith}</option>
            <option value="nodoNorte">{CUERPO_LABEL.nodoNorte}</option>
            <option value="nodoSur">{CUERPO_LABEL.nodoSur}</option>
          </Select>
        </Box>

        <Box>
          <Text color={`${color}aa`} fontSize="xs" letterSpacing="0.14em" mb={1.5} fontWeight="600" textTransform="uppercase">
            {t("metodo.astro.ajustar.signo")}
          </Text>
          <Select
            value={signoIdx}
            onChange={(e) => setSignoIdx(parseInt(e.target.value, 10))}
            bg="rgba(8,13,30,0.55)"
            color={color}
            borderColor={`${color}44`}
            sx={{ option: { background: "#0c1230", color } }}
          >
            {ZODIAC_SIGNS.map((s, i) => (
              <option key={s.name} value={i}>{s.name}</option>
            ))}
          </Select>
        </Box>

        <Flex gap={3}>
          <Box flex="1">
            <Text color={`${color}aa`} fontSize="xs" letterSpacing="0.14em" mb={1.5} fontWeight="600" textTransform="uppercase">
              {t("metodo.astro.ajustar.grado")}
            </Text>
            <Input
              type="number"
              min={0}
              max={29}
              value={gradoSigno}
              onChange={(e) => setGradoSigno(e.target.value)}
              bg="rgba(8,13,30,0.55)"
              color={color}
              borderColor={`${color}44`}
              _hover={{ borderColor: `${color}88` }}
            />
          </Box>
          <Box flex="1">
            <Text color={`${color}aa`} fontSize="xs" letterSpacing="0.14em" mb={1.5} fontWeight="600" textTransform="uppercase">
              {t("metodo.astro.ajustar.minutos")}
            </Text>
            <Input
              type="number"
              min={0}
              max={59}
              value={minutos}
              onChange={(e) => setMinutos(e.target.value)}
              bg="rgba(8,13,30,0.55)"
              color={color}
              borderColor={`${color}44`}
              _hover={{ borderColor: `${color}88` }}
            />
          </Box>
        </Flex>

        {error && (
          <Text color="#ffb8b8" fontSize="sm" fontStyle="italic" textAlign="center">{error}</Text>
        )}

        <Flex gap={3} mt={2}>
          <Box
            as="button"
            flex="1"
            py={2.5}
            borderRadius="full"
            border={`1px solid ${color}55`}
            color={color}
            cursor="pointer"
            onClick={onClose}
            fontWeight="600"
            letterSpacing="0.06em"
            _hover={{ bg: `${color}1a` }}
            transition="background 0.2s ease"
          >
            {t("comun.cancelar")}
          </Box>
          <Box
            as="button"
            flex="1"
            py={2.5}
            borderRadius="full"
            bg={color}
            color="#0c1230"
            cursor="pointer"
            onClick={guardar}
            fontWeight="700"
            letterSpacing="0.06em"
            opacity={saving ? 0.6 : 1}
            pointerEvents={saving ? "none" : "auto"}
            boxShadow={`0 0 18px ${color}55`}
            _hover={{ boxShadow: `0 0 28px ${color}88` }}
            transition="box-shadow 0.2s ease"
          >
            {saving ? t("comun.guardando") : t("comun.guardar")}
          </Box>
        </Flex>
      </Box>
    </Box>
  );
}
