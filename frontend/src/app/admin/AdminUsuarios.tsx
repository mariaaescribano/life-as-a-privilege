import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Flex, Input, Text, Image } from "@chakra-ui/react";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import SpinnerTurquesa from "../../components/global/Spinner";
import { disciplinaByKey } from "../../data/adminDisciplinas";
import { AdminDisciplinaHeader } from "./AdminDisciplinaHeader";
import { API_URL } from "../../GlobalVariables";
import { useAdminGuard, adminHeaders } from "./useAdminGuard";

interface RecorridoUser {
  id: string;
  name: string;
  email: string;
  img?: string | null;
}

export default function AdminUsuarios() {
  const navigate = useNavigate();
  const { disciplina } = useParams<{ disciplina: string }>();
  const { verificando } = useAdminGuard();
  const disc = disciplinaByKey(disciplina ?? "");

  const [usuarios, setUsuarios] = useState<RecorridoUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  useEffect(() => {
    if (verificando) return;
    if (!disc) { navigate("/admin"); return; }
    (async () => {
      try {
        const res = await axios.get<RecorridoUser[]>(`${API_URL}/user/admin/recorrido`, { headers: adminHeaders() });
        setUsuarios(res.data ?? []);
      } catch {
        setUsuarios([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [verificando, disc, navigate]);

  const filtrados = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return usuarios;
    return usuarios.filter(
      (u) => (u.name ?? "").toLowerCase().includes(t) || (u.email ?? "").toLowerCase().includes(t),
    );
  }, [q, usuarios]);

  if (verificando || !disc) {
    return <Box minH="100vh" bg="#008080"><SpinnerTurquesa /></Box>;
  }

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 5, md: 10 }} py={{ base: 8, md: 12 }}>
        <Box w="100%" maxW="720px">
          <Flex align="center" gap={3} mb={3}>
            <Text as="button" onClick={() => navigate("/admin")} color="rgba(255,255,255,0.75)" fontSize="sm"
                  _hover={{ color: "white" }}>← Disciplinas</Text>
          </Flex>

          <AdminDisciplinaHeader disc={disc} subtitle="Usuarios del recorrido" />

          {!disc.editable && (
            <Text color="rgba(255,220,180,0.85)" fontSize="sm" fontStyle="italic" mb={4}>
              Esta disciplina aún no tiene editor de contenido. Puedes ver la lista, pero la edición llegará pronto.
            </Text>
          )}

          {/* buscador */}
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar por nombre o email…"
            mb={5}
            bg="rgba(255,255,255,0.08)"
            border="1px solid rgba(255,255,255,0.28)"
            color="white"
            borderRadius="full"
            fontFamily="'EB Garamond', serif"
            _placeholder={{ color: "rgba(255,255,255,0.45)" }}
            _hover={{ borderColor: "rgba(255,255,255,0.5)" }}
            _focus={{ borderColor: "white", boxShadow: "0 0 0 1px rgba(255,255,255,0.3)" }}
          />

          {loading ? (
            <Flex justify="center" py={10}><SpinnerTurquesa /></Flex>
          ) : (
            <Flex direction="column" gap={2}>
              {filtrados.map((u) => (
                <Flex
                  key={u.id}
                  as="button"
                  onClick={() => navigate(`/admin/${disc.key}/${u.id}`)}
                  align="center"
                  gap={3}
                  textAlign="left"
                  px={4}
                  py={3}
                  borderRadius="xl"
                  bg="rgba(255,255,255,0.06)"
                  border="1px solid rgba(255,255,255,0.18)"
                  cursor="pointer"
                  transition="all 0.18s"
                  _hover={{ bg: "rgba(255,255,255,0.13)", borderColor: `${disc.txt}66` }}
                >
                  <Box w="40px" h="40px" borderRadius="full" overflow="hidden" flexShrink={0}
                       border="1px solid rgba(255,255,255,0.3)" bg="rgba(255,255,255,0.08)">
                    <Image src={u.img || "/img/icono/noImg.png"} w="100%" h="100%" objectFit="cover" alt="" />
                  </Box>
                  <Box minW={0} flex="1">
                    <Text color="white" fontWeight="600" noOfLines={1}>{u.name}</Text>
                    <Text color="rgba(255,255,255,0.6)" fontSize="sm" noOfLines={1}>{u.email}</Text>
                  </Box>
                  <Text color={disc.txt} fontSize="lg">→</Text>
                </Flex>
              ))}
              {filtrados.length === 0 && (
                <Text color="rgba(255,255,255,0.6)" fontStyle="italic" textAlign="center" py={8}>
                  {usuarios.length === 0 ? "No hay usuarios en el recorrido todavía." : "Ningún usuario coincide con la búsqueda."}
                </Text>
              )}
            </Flex>
          )}
        </Box>
      </Flex>

      <SiteFooter />
    </Box>
  );
}
