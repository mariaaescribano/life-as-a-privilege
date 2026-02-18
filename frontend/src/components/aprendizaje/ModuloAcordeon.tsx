import { Box, Flex, Text, Collapse } from "@chakra-ui/react";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import React from "react";
import type { Submodulo } from "../../dtos/aprendizaje.type";
import { NotViewIcon, ViewIcon } from "../../GlobalVariables";
import { useNavigate } from "react-router-dom";

export function ModuloAcordeon(props:{
  title:string, bgColor:string, color:string,
  submodules: Submodulo[]
}) {

  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <Box w="100%" maxW="800px" mx="auto" mb={6}>
      {/* Módulo principal */}
      <Flex
        align="center"
        justify="space-between"
        bg={props.bgColor ?? "white"}
        p={5}
        color={props.color}
        borderRadius="2xl"
        boxShadow="md"
        cursor="pointer"
        onClick={() => setOpen(!open)}
        transition="all 0.2s"
        _hover={{ boxShadow: "lg", transform: "translateY(-2px)" }}
      >
        <Text fontSize="xl" fontWeight="700">
          {props.title}
        </Text>

        <Box
          as={ChevronDown}
          w="24px"
          h="24px"
          transition="transform 0.3s"
          transform={open ? "rotate(180deg)" : "rotate(0deg)"}
        />
      </Flex>

      {/* Submódulos */}
      <Collapse in={open} animateOpacity>
        <Box mt={4} pl={4} display="flex" flexDirection="column" gap={3}>
          {props.submodules.map((sub, i) => (
            <Flex
              key={i}
              align="center"
              justify="space-between"
              opacity={0.8}
              bg={props.bgColor ?? "white"}
              color={props.color}
              cursor="pointer"
              onClick={()=> navigate(sub.link)}
              p={4}
              borderRadius="xl"
              boxShadow="sm"
              _hover={{ bg: "gray.100" }}
            >
              <Text fontWeight="600">{sub.nom}</Text>

              {/* <Box
                w="32px"
                h="32px"
                borderRadius="md"
              >
                <ViewIcon/>
              </Box> */}

            </Flex>
          ))}
        </Box>
      </Collapse>
    </Box>
  );
}
