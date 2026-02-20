// LogIn.tsx
import React, { useEffect, useState } from "react";
import { Box, Flex, VStack, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { Header } from "../../components/global/Header";
import Card from "../../components/global/Card";
import { API_URL, turquesa } from "../../GlobalVariables";
import InputField from "../../components/global/InputField";
import BtnTurquesa from "../../components/global/BtnTurquesa";
import Footer from "../../components/global/Footer";
import type { SuccessErrorMessageDto } from "../../components/global/SuccessErrorMessage";
import SuccessErrorMessage from "../../components/global/SuccessErrorMessage";
import axios from "axios";
import { gestionaError } from "../../GlobalHelper";
import type { CreateUser } from "../../dtos/user.types";

export default function SignIn() {
  const navigate = useNavigate();

  const [contra, setcontra] = useState<string>("");
  const [name, setname] = useState<string>("");
  const [contraRepite, setcontraRepite] = useState<string>("");
  const [email, setemail] = useState<string>("");
  const [message, setmessage] = useState<SuccessErrorMessageDto | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  const registroFinal = async () =>
  {
    try 
    {
      let body: CreateUser = {
        name: name,
        email: email,
        password: contra
      };

      const response = await axios.post(
      `${API_URL}/user/signIn`,
      body,
      {
        headers: {
        'Content-Type': 'application/json',
        },
      }
      );

      if(response.data!= null)
      {
        sessionStorage.setItem("userId", response.data?.user.id)
        sessionStorage.setItem("name", response.data?.user.name)
        sessionStorage.setItem("token", response.data?.token)
        sessionStorage.setItem(
          "img",
          response.data?.user.img && response.data.user.img !== ""
            ? response.data.user.img
            : "/img/noImg.png"
        );

        setmessage({
          soy : 1,
          title: "Bienvenido",
          description: "Lo estamos preparando para ti"
        });
      } 
    } 
    catch (err:any) {
      let error = gestionaError(err);
      setmessage(error)
    }
  }

  const registro = () =>
  {
    if(name == "" || contra == "" || contraRepite == "" || email == "")
    {
      setmessage({
        soy : 2,
        title: "Faltan datos",
        description: "Rellena todos los campos"
      })
    }
    else
    {
      if(contra !== contraRepite)
      {
        setmessage({
          soy : 2,
          title: "Error",
          description: "Las contraseñas no son iguales"
        })
      }
      else if (!email.includes("@"))
      {
        setmessage({
          soy : 2,
          title: "Error",
          description: "El email no es correcto"
        })
      }
      else
      {
        registroFinal();
      }
    }
  }

  useEffect(() => {
    if (message && message?.soy == 1) {
      const timer = setTimeout(() => {
        navigate("/home")
      }, 3000);

      return () => clearTimeout(timer); 
    }
  }, [message]); 

  return (
    <Box
      minH="100vh"
      display="flex"
      flexDirection="column"
    >
    <Header textRight={"Registrarse"} textLeft={"Iniciar sesión"} linkRight={"/signIn"} linkLeft={"/logIn"} linkHeader={"/"} />

      <Box flex="1">
        <Flex
          align="center"
          justify="center"
          px={4}
          mt="20px"
          mb="100px"
        >
          <Card maxW="500px" h="800px">
            <VStack spacing={4} align="stretch">
              <Text fontSize="2xl" fontWeight="bold" mb="20px">
                Registro 
              </Text>

              <InputField title={"Nombre"} value={name} onChange={setname} placeholder={""} autoFocus={true}></InputField>
              <InputField title={"Email"} value={email} onChange={setemail} placeholder={""}></InputField>
              <InputField title={"Contraseña"} type="password" value={contra} onChange={setcontra} placeholder={""} mt="5px"></InputField>
              <InputField title={"Repite la contraseña"} type="password" value={contraRepite} onChange={setcontraRepite} placeholder={""} mt="5px"></InputField>

              <Text
                onClick={() => navigate("/logIn")}
                display="block"
                textAlign="center"
                mb="30px"
                color={turquesa}
                fontWeight="500"
                cursor="pointer"
                _hover={{ textDecoration: "underline" }}
              >
                Ya tengo una cuenta
              </Text>

              <Flex justifyContent={"center"} direction={"column"}>
                <VStack>
                  {message && <SuccessErrorMessage soy={message.soy} title={message.title} description={message.description} onClick={()=>setmessage(null)}></SuccessErrorMessage>}
                  <BtnTurquesa text={"Registrarme"} onClick={() => registro()} />
                </VStack>
              </Flex>
            
            </VStack>
          </Card>
        </Flex>
      </Box>
      <Footer mt="10px" />
    </Box>
  );
}
