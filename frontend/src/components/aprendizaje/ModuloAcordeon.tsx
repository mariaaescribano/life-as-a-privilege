import { Box, Flex, Text, Collapse, HStack } from "@chakra-ui/react";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import React from "react";
import type { Submodulo } from "../../dtos/aprendizaje.type";
import { useNavigate } from "react-router-dom";

const GLOW = "0 4px 20px rgba(0,0,0,0.22), 0 0 22px rgba(107,196,200,0.8)";
const GLOW_HOVER = "0 8px 24px rgba(0,0,0,0.28), 0 0 32px rgba(107,196,200,1)";

export function ModuloAcordeon(props:{
  title:string, bgColor:string, color:string,
  submodules: Submodulo[], icon:any,
  onToggle?: (isOpen: boolean) => void,
}) {

  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleToggle = () => {
    const next = !open;
    setOpen(next);
    props.onToggle?.(next);
  };

  return (
    <Box w="100%" maxW="800px" mx="auto" mb={5}>
      {/* Módulo principal */}
      <Flex
        align="center"
        justify="space-between"
        bg={props.bgColor ?? "white"}
        p={5}
        color={props.color}
        borderRadius="2xl"
        boxShadow={GLOW}
        cursor="pointer"
        onClick={handleToggle}
        transition="all 0.25s"
        _hover={{ transform: "translateY(-3px)", boxShadow: GLOW_HOVER }}
      >
        <HStack>
          {< props.icon />}
          <Text fontSize={{ base: "xl", md: "2xl" }} fontWeight="700">
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

      {/* Submódulos — glow individual, no se fusionan */}
      <Collapse in={open} animateOpacity>
        <Box mt={4} pl={2} pb={1} display="flex" flexDirection="column" gap={4}>
          {props.submodules.map((sub, i) => (
            <Flex
              key={i}
              align="center"
              justify="space-between"
              bg={props.bgColor ?? "white"}
              color={props.color}
              cursor="pointer"
              onClick={() => navigate(sub.link)}
              p={4}
              borderRadius="2xl"
              transition="all 0.25s"
              _hover={{ transform: "translateY(-2px)"}}
            >
              <Text fontWeight="600" fontSize={{ base: "md", md: "lg" }}>{sub.nom}</Text>
            </Flex>
          ))}
        </Box>
      </Collapse>
    </Box>
  );
}
