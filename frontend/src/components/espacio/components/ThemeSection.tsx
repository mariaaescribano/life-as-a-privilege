import React, { useState } from "react";
import {
  Box,
  Collapse,
  Flex,
  HStack,
  Text,
  VStack
} from "@chakra-ui/react";
import { ChevronDown } from "lucide-react";
import EditableCard from "./EditableCard";
import type { Pregunta } from "../../../dtos/espacio.type";

const GLOW = "0 4px 20px rgba(0,0,0,0.22), 0 0 22px rgba(107,196,200,0.8)";
const GLOW_HOVER = "0 8px 24px rgba(0,0,0,0.28), 0 0 32px rgba(107,196,200,1)";

const ThemeSection = (props:{
  title:string, icon:any, subPreguntas: Pregunta[], color: string,
  bgColor:string
}) => {

  const [isOpen, setIsOpen] = useState(false);

  return (
    <Box w="100%">
      {/* Barra principal */}
      <Flex
        align="center"
        justify="space-between"
        bg={props.bgColor}
        p={5}
        borderRadius="2xl"
        boxShadow={GLOW}
        cursor="pointer"
        transition="all 0.25s"
        _hover={{ transform: "translateY(-3px)", boxShadow: GLOW_HOVER }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <HStack>
          {< props.icon />}
          <Text fontSize={{ base: "xl", md: "2xl" }} fontWeight="800" color={props.color}>
            {props.title}
          </Text>
        </HStack>

        <Box
          as={ChevronDown}
          w="24px"
          h="24px"
          color={props.color}
          transition="transform 0.3s"
          transform={isOpen ? "rotate(180deg)" : "rotate(0deg)"}
        />
      </Flex>

      {/* Preguntas expandidas — glow individual, no se fusionan */}
      <Collapse in={isOpen} animateOpacity>
        <VStack mt={4} spacing={4} pl={2} pb={1}>
          {props.subPreguntas.map((subPreg, index) => (
            <EditableCard
              key={index + "subPreg"}
              idPregunta={subPreg.idPregunta}
              pregunta={subPreg.pregunta}
              bgColor={props.bgColor}
              color={props.color}
              consejo={subPreg.consejo}
            />
          ))}
        </VStack>
      </Collapse>
    </Box>
  );
};


export default ThemeSection;
