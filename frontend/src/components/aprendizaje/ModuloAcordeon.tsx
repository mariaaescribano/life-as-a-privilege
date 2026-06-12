import { Box, Flex, Text, Collapse, HStack } from "@chakra-ui/react";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import React from "react";
import type { Submodulo } from "../../dtos/aprendizaje.type";
import { useNavigate } from "react-router-dom";
import { DisciplinaBgLayer, hasDisciplinaBg } from "../global/DisciplinaBgLayer";

// Velo oscuro sobre el fondo de la disciplina para que el texto (en color de la
// disciplina) se lea bien dentro de los boxes de módulo / submódulo.
const BOX_OVERLAY = "linear-gradient(180deg, rgba(0,0,0,0.42) 0%, rgba(0,0,0,0.52) 100%)";

export function ModuloAcordeon(props:{
  title:string, bgColor:string, color:string,
  submodules: Submodulo[], icon:any,
  /** Nombre de la disciplina (para pintar su imagen de fondo en los boxes). */
  disciplina?: string,
  onToggle?: (isOpen: boolean) => void,
}) {

  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const disc = props.disciplina;
  const hasBg = !!disc && hasDisciplinaBg(disc);

  const handleToggle = () => {
    const next = !open;
    setOpen(next);
    props.onToggle?.(next);
  };

  const glow = `0 4px 20px rgba(0,0,0,0.3), 0 0 18px ${props.color}55`;
  const glowHover = `0 6px 26px rgba(0,0,0,0.4), 0 0 28px ${props.color}88`;

  return (
    <Box w="100%" maxW="800px" mx="auto" mb={5}>
      {/* Módulo principal */}
      <Box
        position="relative"
        overflow="hidden"
        borderRadius="2xl"
        bg={props.bgColor ?? "white"}
        boxShadow={glow}
        cursor="pointer"
        onClick={handleToggle}
        transition="all 0.25s"
        _hover={{ transform: "translateY(-3px)", boxShadow: glowHover }}
      >
        {hasBg && <DisciplinaBgLayer nom={disc!} borderRadius="2xl" overlay={BOX_OVERLAY} />}
        <Flex position="relative" zIndex={1} align="center" justify="space-between" p={5} color={props.color}>
          <HStack>
            {< props.icon color={props.color} />}
            <Text fontSize={{ base: "xl", md: "2xl" }} fontWeight="700" style={{ textShadow: "0 1px 6px rgba(0,0,0,0.7)" }}>
              {props.title}
            </Text>
          </HStack>

          <Box
            as={ChevronDown}
            w="24px"
            h="24px"
            transition="transform 0.3s"
            transform={open ? "rotate(180deg)" : "rotate(0deg)"}
          />
        </Flex>
      </Box>

      {/* Submódulos — glow individual, no se fusionan */}
      <Collapse in={open} animateOpacity>
        <Box mt={4} pl={2} pb={1} display="flex" flexDirection="column" gap={4}>
          {props.submodules.map((sub, i) => (
            <Box
              key={i}
              position="relative"
              overflow="hidden"
              borderRadius="2xl"
              bg={props.bgColor ?? "white"}
              cursor="pointer"
              onClick={() => navigate(sub.link)}
              boxShadow={`0 3px 14px rgba(0,0,0,0.25), 0 0 12px ${props.color}44`}
              transition="all 0.25s"
              _hover={{ transform: "translateY(-2px)", boxShadow: `0 5px 20px rgba(0,0,0,0.35), 0 0 20px ${props.color}66` }}
            >
              {hasBg && <DisciplinaBgLayer nom={disc!} borderRadius="2xl" overlay={BOX_OVERLAY} />}
              <Flex position="relative" zIndex={1} align="center" justify="space-between" color={props.color} p={4}>
                <Text fontWeight="600" fontSize={{ base: "md", md: "lg" }} style={{ textShadow: "0 1px 6px rgba(0,0,0,0.7)" }}>
                  {sub.nom}
                </Text>
              </Flex>
            </Box>
          ))}
        </Box>
      </Collapse>
    </Box>
  );
}
