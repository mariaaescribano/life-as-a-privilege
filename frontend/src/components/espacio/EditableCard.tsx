import React, { useRef, useState } from "react";
import {
  Box,
  Card,
  CardBody,
  Collapse,
  Flex,
  IconButton,
  Text,
  Textarea,
  VStack
} from "@chakra-ui/react";
import { ChevronDown, Eye, EyeOff, Pencil } from "lucide-react";
import { turquesa } from "../../GlobalVariables";

const EditableCard = (props:{
  idPregunta:string, pregunta:string,
  bgColor:string, color:string
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState("Aquí puedes escribir varias frases...");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const toggleEdit = () => {
    // Si ya está editando → cerrar todo
    if (isEditing) {
      setIsEditing(false);
      setIsVisible(false);
      setIsOpen(false);
      return;
    }

    // Si no está editando → abrir y enfocar
    setIsOpen(true);
    setIsEditing(true);
    setIsVisible(true);

    setTimeout(() => {
      textareaRef.current?.focus();
    }, 0);
  };

  return (
    <Box w="100%">
      {/* Barra superior */}
      <Flex
        align="center"
        justify="space-between"
        p={5}
        opacity={0.8}
        borderRadius="3xl"
        bg={props.bgColor}
        boxShadow="md"
        cursor="pointer"
        transition="all 0.2s"
        _hover={{ boxShadow: "lg", transform: "translateY(-2px)" }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <Text fontSize="lg" fontWeight="700" color={props.color} >
          {props.pregunta}
        </Text>

        <Box
          as={ChevronDown}
          w="22px"
          h="22px"
          transition="transform 0.3s"
          transform={isOpen ? "rotate(180deg)" : "rotate(0deg)"}
        />
      </Flex>

      <Collapse in={isOpen} animateOpacity>
        <Box mt={4} pl={4}>
          <Card
            borderRadius="3xl"
            boxShadow="sm"
            bg={props.bgColor}
            p={4}
          >
            <CardBody>
              <Flex gap={4}>
              <Textarea
                ref={textareaRef}
                value={isVisible ? text : "•".repeat(text.length)}
                onChange={(e) => setText(e.target.value)}
                isReadOnly={!isEditing}
                resize="none"
                minH="130px"
                bgColor={props.bgColor}
                color={props.color}
                borderRadius="2xl"
                bg={!isVisible ? "gray.200" : "white"}
                _hover={{
                  cursor: "not-allowed"
                }}
                _focus={{
                  borderColor: turquesa,
                  boxShadow: "0 0 0 3px rgba(0, 128, 128, 0.3)",
                }}
              />

                <VStack>
                  <IconButton
                    aria-label="Ver"
                    icon={isVisible ? <EyeOff size={18} /> : <Eye size={18} />}
                    borderRadius="full"
                    onClick={() => setIsVisible(!isVisible)}
                  />
                  <IconButton
                    aria-label="Editar"
                    icon={<Pencil size={18} />}
                    borderRadius="full"
                    onClick={toggleEdit}
                  />
                </VStack>
              </Flex>
            </CardBody>
          </Card>
        </Box>
      </Collapse>
    </Box>
  );
};

export default EditableCard;
