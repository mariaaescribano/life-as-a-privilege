// LogIn.tsx
import React, { useEffect, useState } from "react";
import { Box, Flex, VStack, Text, Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { Header } from "../../components/global/Header";
import Card from "../../components/global/Card";
import { API_URL, turquesa } from "../../Global";
import InputField from "../../components/global/InputField";
import BtnTurquesa from "../../components/global/BtnTurquesa";
import Footer from "../../components/global/Footer";
import type { SuccessErrorMessageDto } from "../../components/global/SuccessErrorMessage";
import SuccessErrorMessage from "../../components/global/SuccessErrorMessage";
import axios from "axios";
import type { User } from "../../dto/user";

export default function SignIn() {
  const navigate = useNavigate();

  const [contra, setcontra] = useState<string>("");
  const [name, setname] = useState<string>("");
  const [contraRepite, setcontraRepite] = useState<string>("");
  const [email, setemail] = useState<string>("");
  const [message, setmessage] = useState<SuccessErrorMessageDto | null>(null);


  const registroFinal = async () =>
  {
    try 
    {
      let body: User = {
        name: name,
        email: email,
        password: contra
      };

      const response = await axios.post(
      `${API_URL}/user`,
      body,
      {
        headers: {
        'Content-Type': 'application/json',
        },
      }
      );
      console.log(response.data)
      if(response.data!= null)
      {
        
      }   
    } catch (error) {
      console.error('Error in registroFinal:', error);
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

  return (
    <Flex
      direction="column"      
      minH="100vh"            
      overflow="hidden"       
    >
    <Header textRight={"Registrarse"} textLeft={"Iniciar sesión"} linkRight={""} linkLeft={"/logIn"} />
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

            <InputField title={"Nombre de usuario"} value={name} onChange={setname} placeholder={""}></InputField>
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
                <BtnTurquesa text={"Registrarme"} onClick={() => registro()} />
                {message && <SuccessErrorMessage soy={message.soy} title={message.title} description={message.description} onClick={()=>setmessage(null)}></SuccessErrorMessage>}
              </VStack>
            </Flex>
           
          </VStack>
        </Card>
      </Flex>
      <Footer mt="10px" />
    </Flex>
  );
}
