import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Collapse,
  Flex,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { ChevronDown } from "lucide-react";
import { API_URL, turquesa } from "../../../GlobalVariables";
import axios from "axios";
import type { Respuesta } from "../../../dtos/respuesta.type";
import { useNavigate } from "react-router-dom";

const EditableCard = (props:{
  idPregunta:string, pregunta:string,
  bgColor:string, color:string, consejo?:string,
  apiPath?: string
}) => {

  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [text, setText] = useState<string | null>(null);
  const [saveColor, setSaveColor] = useState<string | null>(null);

  const subeRespuesta = async () => {
    const userId = sessionStorage.getItem("userId");
    if (!userId) navigate("/");
    else {
      const pregunta: Respuesta = {
        idPregunta: props.idPregunta,
        userId,
        respuesta: text ?? "",
      };
      try {
        const response = await axios.post(
          `${API_URL}/${props.apiPath ?? "respuesta"}`,
          pregunta,
          { headers: { "Content-Type": "application/json" } }
        );
        setSaveColor(response.data === true ? "green.500" : "red.500");
      } catch (error) {
        setSaveColor("red.500");
        console.log(error);
      }
    }
  };

  useEffect(() => {
    if (saveColor != null) {
      const timer = setTimeout(() => setSaveColor(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [saveColor]);

  const getRespuesta = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/${props.apiPath ?? "respuesta"}/${props.idPregunta}/${sessionStorage.getItem("userId")}`,
        { headers: { "Content-Type": "application/json" } }
      );
      if (response.data) setText(response.data?.respuesta);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (isOpen) getRespuesta();
  }, [isOpen]);

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
        cursor="pointer"
        transition="all 0.2s"
        userSelect="none"
        _hover={{ transform: "translateY(-2px)" }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <Text fontSize={{ base: "lg", md: "xl" }} fontWeight="700" color={props.color} userSelect="none">
          {props.pregunta}
        </Text>

        <Box
          as={ChevronDown}
          w="22px"
          color={props.color}
          h="22px"
          transition="transform 0.3s"
          transform={isOpen ? "rotate(180deg)" : "rotate(0deg)"}
        />
      </Flex>

      <Collapse in={isOpen} animateOpacity>
        <Box mt={3} pl={3}>
          <Box borderRadius="3xl" bg={props.bgColor} p={5}>
            {props.consejo && (
              <Flex justify="center" align="center" mb={4}>
                <Flex
                  w="100%"
                  bg="rgba(255,255,255,0.15)"
                  border="1px solid rgba(255,255,255,0.2)"
                  p={3}
                  borderRadius="20px"
                  alignItems="center"
                  gap={3}
                >
                  <Text color={props.color} fontSize={{ base: "sm", md: "md" }}>
                    {"♥  " + props.consejo}
                  </Text>
                </Flex>
              </Flex>
            )}

            <Textarea
              value={text ?? ""}
              onChange={(e) => setText(e.target.value)}
              resize="none"
              minH="140px"
              color={props.color}
              borderRadius="2xl"
              border="1px solid rgba(255,255,255,0.2)"
              bg="rgba(0,0,0,0.18)"
              fontSize={{ base: "md", md: "lg" }}
              _hover={{ cursor: "text" }}
              _focus={{
                borderColor: turquesa,
                boxShadow: "0 0 0 3px rgba(0, 128, 128, 0.3)",
              }}
            />

            <Flex justify="flex-end" mt={3}>
              <Button
                onClick={subeRespuesta}
                bg={saveColor ?? "rgba(255,255,255,0.15)"}
                color={props.color}
                border="1px solid rgba(255,255,255,0.3)"
                borderRadius="full"
                px={6}
                fontWeight="700"
                letterSpacing="0.04em"
                _hover={{ bg: "rgba(255,255,255,0.28)" }}
                transition="all 0.2s"
              >
                Guardar
              </Button>
            </Flex>
          </Box>
        </Box>
      </Collapse>
    </Box>
  );
};

export default EditableCard;
