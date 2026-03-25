import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Collapse,
  Flex,
  IconButton,
  Text,
  Textarea,
  VStack
} from "@chakra-ui/react";
import { CheckIcon, ChevronDown, Eye, EyeOff, Pencil } from "lucide-react";
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
  const [isVisible, setIsVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState<string | null>(null);
  const [color, setColor] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const toggleEdit = () => {
    setIsOpen(true);
    setIsEditing(true);
    setIsVisible(true);

    setTimeout(() => {
      textareaRef.current?.focus();
    }, 0);
  };

  const subeRespuesta = async() =>
  {
    let userId =  sessionStorage.getItem("userId");

    if(!userId) navigate("/");
    else
    {
      let pregunta: Respuesta = {
        idPregunta: props.idPregunta,
        userId: userId,
        respuesta: text ?? ""
      };

      try
      {
        const response = await axios.post(
        `${API_URL}/${props.apiPath ?? "respuesta"}`,
        pregunta,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if(response.data === true)
        {
          setColor("green.500");
        }
        else
        {
          setColor("red.500");
        }

      }
      catch(error)
      {
        setColor("red.500");
        console.log(error)
      }
    }
  }

  useEffect(() => {
    if (color != null) {
      const timer = setTimeout(() => {
        setColor(null)
      }, 3000);

      return () => clearTimeout(timer); 
    }
  }, [color]); 

  const toggleSave = () => {
    setIsEditing(false);
    setIsVisible(false);
    subeRespuesta();
  };

  // llama a por la respuesta previamente guardada (si existe)
  const getRespuesta = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/${props.apiPath ?? "respuesta"}/${props.idPregunta}/${sessionStorage.getItem("userId")}`,
        { headers: { 'Content-Type': 'application/json' } }
      );

      if(response.data)
      {
        setText(response.data?.respuesta);
      }

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if(isOpen == true)
    {
      getRespuesta();
    }
  }, [isOpen]);

  useEffect(() => {
    if(isVisible == false)
    {
      setIsEditing(false);
    }
  }, [isVisible]);

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
          <Box
            borderRadius="3xl"
            bg={props.bgColor}
            p={5}
          >
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

            <Flex gap={4}>
              <Textarea
                ref={textareaRef}
                value={text ? (isVisible ? text : "•".repeat(text?.length)) : ""}
                onChange={(e) => isEditing ? setText(e.target.value) : ""}
                isReadOnly={!isEditing}
                resize="none"
                minH="140px"
                color={props.color}
                borderRadius="2xl"
                border="1px solid rgba(255,255,255,0.2)"
                bg={!isVisible ? "rgba(0,0,0,0.18)" : "rgba(0,0,0,0.28)"}
                _hover={{ cursor: isEditing ? "text" : "default" }}
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
                  bg="rgba(255,255,255,0.15)"
                  color={props.color}
                  _hover={{ bg: "rgba(255,255,255,0.28)" }}
                  onClick={() => setIsVisible(!isVisible)}
                />
                <IconButton
                  aria-label="Editar"
                  icon={<Pencil size={18} />}
                  borderRadius="full"
                  bg="rgba(255,255,255,0.15)"
                  color={props.color}
                  _hover={{ bg: "rgba(255,255,255,0.28)" }}
                  onClick={toggleEdit}
                />
                <IconButton
                  aria-label="Guardar"
                  disabled={!isEditing || color != null}
                  icon={<CheckIcon size={18} />}
                  borderRadius="full"
                  bg={color ?? "rgba(255,255,255,0.15)"}
                  color={props.color}
                  _hover={isEditing ? { bg: "rgba(255,255,255,0.28)" } : {}}
                  onClick={toggleSave}
                />
              </VStack>
            </Flex>
          </Box>
        </Box>
      </Collapse>
    </Box>
  );
};

export default EditableCard;
