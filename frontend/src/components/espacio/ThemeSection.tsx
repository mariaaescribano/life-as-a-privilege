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
import type { Pregunta } from "../../dtos/espacio.type";

const ThemeSection = (props:{
  title:string, icon:any, subPreguntas: Pregunta[], color: string,
  bgColor:string
}) => {

  const [isOpen, setIsOpen] = useState(false);

  return (
    <Box w="100%">
      {/* Barra principal con glow azul */}
      <Flex
        align="center"
        justify="space-between"
        bg={props.bgColor}
        p={6}
        borderRadius="3xl"
        boxShadow="0 4px 20px rgba(0,0,0,0.22), 0 0 28px rgba(107,196,200,0.75), 0 0 55px rgba(107,196,200,0.35)"
        cursor="pointer"
        transition="all 0.25s"
        _hover={{ transform: "translateY(-4px)", boxShadow: "0 8px 28px rgba(0,0,0,0.28), 0 0 38px rgba(107,196,200,0.95), 0 0 70px rgba(107,196,200,0.45)" }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <HStack>
          {< props.icon />}
          <Text fontSize="xl" fontWeight="800" color={props.color}>
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

      {/* Preguntas expandidas — cada una flota con glow */}
      <Collapse in={isOpen} animateOpacity>
        <VStack mt={5} spacing={5} pl={2}>
          {props.subPreguntas.map((subPreg, index) => (
            <Box
              key={index + "subPreg"}
              w="100%"
              borderRadius="3xl"
              boxShadow="0 4px 18px rgba(0,0,0,0.2), 0 0 24px rgba(107,196,200,0.65), 0 0 48px rgba(107,196,200,0.3)"
              transition="all 0.25s"
              _hover={{ transform: "translateY(-3px)", boxShadow: "0 8px 24px rgba(0,0,0,0.26), 0 0 35px rgba(107,196,200,0.9), 0 0 65px rgba(107,196,200,0.4)" }}
            >
              <EditableCard
                idPregunta={subPreg.idPregunta}
                pregunta={subPreg.pregunta}
                bgColor={props.bgColor}
                color={props.color}
                consejo={subPreg.consejo}
              />
            </Box>
          ))}
        </VStack>
      </Collapse>
    </Box>
  );
};


export default ThemeSection;
