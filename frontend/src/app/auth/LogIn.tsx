// LogIn.tsx
import React, { useState } from "react";
import { Box, Flex, VStack, Text, Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { Header } from "../../components/global/Header";
import Card from "../../components/global/Card";
import { API_URL, turquesa } from "../../GlobalVariables";
import InputField from "../../components/global/InputField";
import BtnTurquesa from "../../components/global/BtnTurquesa";
import Footer from "../../components/global/Footer";
import type { SuccessErrorMessageDto } from "../../components/global/SuccessErrorMessage";
import axios from "axios";
import SuccessErrorMessage from "../../components/global/SuccessErrorMessage";
import type { LoginUser } from "../../dtos/user.types";

export default function LogIn() {
  const navigate = useNavigate();

  const [name, setname] = useState<string>("");
  const [contra, setcontra] = useState<string>("");
  const [message, setmessage] = useState<SuccessErrorMessageDto | null>(null);

  const inicioSesion = async () =>
  {
    try 
    {
      let body: LoginUser = {
        name: name,
        password: contra
      };

      const response = await axios.post(
      `${API_URL}/user/logIn`,
      body,
      {
        headers: {
        'Content-Type': 'application/json',
        },
      }
      );

      if(response.data!= null)
      {
        setmessage({
          soy : 1,
          title: "Bienvenido",
          description: "Lo estamos preparando para ti"
        })
      } 
    } 
    catch (err:any) {
      if (err.response?.status === 409) {
        let message = err.response.data.message;
        setmessage({
          soy : 2,
          title: "Error",
          description: message
        })
      } else {
        console.error(err);
      }
    }
  }

  const validarInicioSesion = () =>
  {
    if(name == "" ||  contra == "")
    {
      setmessage({
        soy : 2,
        title: "Faltan datos",
        description: "Rellena todos los campos"
      })
    }
    else
    {
      inicioSesion();
    }
  }

  return (
    <Flex
      direction="column"      
      minH="100vh"            
      overflow="hidden"      
    >
    <Header textRight={"Registrarse"} textLeft={"Iniciar sesión"} linkRight={"/signIn"} linkLeft={"/logIn"} />
      <Flex
        align="center"
        justify="center"
        px={4}
        mt="20px"
        mb="100px"
      >
        <Card maxW="500px" h="600px">
          <VStack spacing={4} align="stretch">
            <Text fontSize="2xl" fontWeight="bold" mb="20px">
              Iniciar sesión
            </Text>

            <InputField title={"Nombre o email"} value={name} onChange={setname} ></InputField>
            <InputField title={"Contraseña"} type="password" value={contra} onChange={setcontra} mt="5px"></InputField>
            <Text
              onClick={() => navigate("/signIn")}
              display="block"
              textAlign="center"
              mb="50px"
              color={turquesa}
              fontWeight="500"
              cursor="pointer"
              _hover={{ textDecoration: "underline" }}
            >
              Crear una cuenta
            </Text>

            <Flex justifyContent={"center"} direction={"column"}>
              <VStack>
                {message && <SuccessErrorMessage soy={message.soy} title={message.title} description={message.description} onClick={()=>setmessage(null)}></SuccessErrorMessage>}
                <BtnTurquesa text={"Iniciar sesión"} onClick={() => validarInicioSesion()} />
              </VStack>
            </Flex>
           
          </VStack>
        </Card>
      </Flex>
      <Footer mt="10px"></Footer>
    </Flex>
  );
}
