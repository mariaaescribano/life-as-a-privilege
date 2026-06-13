import { Box, Flex, Text, Collapse, HStack } from "@chakra-ui/react";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import React from "react";
import type { Submodulo } from "../../dtos/aprendizaje.type";
import { useNavigate } from "react-router-dom";
import { DisciplinaBgLayer, hasDisciplinaBg } from "../global/DisciplinaBgLayer";

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
  const tShadow = `0 1px 4px ${props.bgColor}, 0 0 10px ${props.bgColor}, 0 0 20px ${props.bgColor}`;

  const handleToggle = () => {
    const next = !open;
    setOpen(next);
    props.onToggle?.(next);
  };

  const glow = `0 0 16px rgba(255,255,255,0.16), 0 0 40px rgba(180,255,245,0.12), 0 0 22px ${props.color}55`;
  const glowHover = `0 0 24px rgba(255,255,255,0.24), 0 0 58px rgba(180,255,245,0.18), 0 0 34px ${props.color}88`;

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
        {hasBg && <DisciplinaBgLayer nom={disc!} borderRadius="2xl" />}
        <Flex position="relative" zIndex={1} align="center" justify="space-between" p={5} color={props.color}>
          <HStack>
            {< props.icon color={props.color} />}
            <Text fontSize={{ base: "xl", md: "2xl" }} fontWeight="700" style={{ textShadow: tShadow }}>
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

      {/* Submódulos */}
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
              transition="all 0.25s"
              _hover={{ transform: "translateY(-2px)" }}
            >
              {hasBg && <DisciplinaBgLayer nom={disc!} borderRadius="2xl" />}
              <Flex position="relative" zIndex={1} align="center" justify="space-between" color={props.color} p={4}>
                <Text fontWeight="600" fontSize={{ base: "md", md: "lg" }} style={{ textShadow: tShadow }}>
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
