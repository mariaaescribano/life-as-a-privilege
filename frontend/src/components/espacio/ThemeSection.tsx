import React, { useRef, useState } from "react";
import {
  Box,
  Card,
  CardBody,
  Collapse,
  Flex,
  HStack,
  IconButton,
  Text,
  Textarea,
  VStack
} from "@chakra-ui/react";
import { ChevronDown, Eye, EyeOff, Pencil } from "lucide-react";
import EditableCard from "./EditableCard";
import type { Pregunta } from "../../dtos/espacio.type";

const ThemeSection = (props:{
  title:string, icon:any, subPreguntas: Pregunta[], color: string,
  bgColor:string
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Box w="100%">
      <Flex
        align="center"
        justify="space-between"
        bg={props.bgColor}
        p={6}
        borderRadius="3xl"
        boxShadow="lg"
        cursor="pointer"
        transition="all 0.2s"
        _hover={{ boxShadow: "xl", transform: "translateY(-3px)" }}
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

      <Collapse in={isOpen} animateOpacity>
        <VStack mt={6} spacing={6} pl={2}>
          {props.subPreguntas.map((subPreg, index) => (
            <EditableCard 
              key={index + "subPreg"} 
              idPregunta={subPreg.idPregunta}
              pregunta={subPreg.pregunta} 
              bgColor={props.bgColor} color={props.color} 
            /> 
          ))}
        </VStack>
      </Collapse>
    </Box>
  );
};


export default ThemeSection;
