// LogIn.tsx
import React from "react";
import { Box, Flex, VStack, Text, Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { Header } from "../../components/global/Header";
import Card from "../../components/global/Card";
import { turquesa } from "../../Global";
import InputField from "../../components/global/InputField";
import BtnTurquesa from "../../components/global/BtnTurquesa";
import Footer from "../../components/global/Footer";

export default function LogIn() {
  const navigate = useNavigate();

  return (
    <Flex
      direction="column"      // stack header, main, footer vertically
      minH="100vh"            // full viewport height
      overflow="hidden"       // prevent scrolling
    >
    <Header textRight={"Registrarse"} textLeft={"Iniciar sesión"} linkRight={""} linkLeft={"/logIn"} />
      <Flex
        align="center"
        justify="center"
        px={4}
        mt="20px"
        mb="100px"
      >
        <Card maxW="500px">
          <VStack spacing={4} align="stretch">
            <Text fontSize="2xl" fontWeight="bold" mb="20px">
              Iniciar sesión
            </Text>

            <InputField title={"Nombre de usuario"} value={""} onChange={undefined} placeholder={""}></InputField>
            <InputField title={"Contraseña"} type="password" value={""} onChange={undefined} placeholder={""} mt="5px"></InputField>
            <Text
              onClick={() => navigate("/")}
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


            <Flex justifyContent={"center"}>
              <BtnTurquesa text={"Iniciar sesión"} onClick={() => navigate("/plans")} />
            </Flex>
           
          </VStack>
        </Card>
      </Flex>
      <Footer mt="10px"></Footer>
    </Flex>
  );
}
