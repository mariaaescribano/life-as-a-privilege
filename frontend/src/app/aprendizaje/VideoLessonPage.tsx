import React, { useEffect, useState } from "react";
import { Box, Flex, Text, Button } from "@chakra-ui/react";
import { Header } from "../../components/global/Header";
import Footer from "../../components/global/Footer";
import BtnTurquesa from "../../components/global/BtnTurquesa";
import Title from "../../components/global/Title";
import { useParams } from "react-router-dom";
import type { Submodulo } from "../../dtos/aprendizaje.type";
import { modulosNeuroPsicologia } from "../../hardCoded/aprendizajes/ModulosNeuroPsicologia";

export default function VideoLessonPage() {
  const { moduloId, submoduloId } = useParams<{ moduloId: string, submoduloId:string }>();
  const [datos, setdatos] = useState<Submodulo | null>(null);

  const getNeuroPsicologiaSubmoduleByTitle = (title: string): Submodulo | null => {
    for (const modulo of modulosNeuroPsicologia) {
      const found = modulo.submodules.find(
        (sub) => sub.nom === title
      );
      if (found) return found;
    }
    return null;
  };

  useEffect(() => {
    if (moduloId && submoduloId) {
      const submodulo: Submodulo | null = getNeuroPsicologiaSubmoduleByTitle(submoduloId!);
      setdatos(submodulo);
    }
  }, [moduloId, submoduloId]);

  
  return (
    <Box minH="100vh" display="flex" flexDirection="column">
      <Header />

      {/* CONTENIDO */}
      {datos && <Box flex="1" display="flex" flexDirection="column" alignItems="center" px={4}>

        <Title icon={<datos.detalles.icon size="60px"/>} title={datos.nom} color={datos.detalles.color} />
        
        {/* VIDEO */}
        <Box
          w={{ base: "100%", md: "70%", xl: "60%" }}
          aspectRatio={16 / 9}
          borderRadius="2xl"
          overflow="hidden"
          boxShadow="2xl"
          mb={6}
        >
          <video
            src={datos.video}
            controls
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </Box>

        {/* DESCRIPCIÓN */}
        <Text
          maxW="800px"
          textAlign="center"
          fontSize={{ base: "md", md: "lg" }}
          color={datos.detalles.color}
          mb={10}
        >
          {datos.descripcion}
        </Text>

        {/* BOTONES */}
        <Flex w="100%" justify="center" mb="100px" gap="20px" p="5px">
          <BtnTurquesa text={"←"} onClick={undefined} w="100px" color={datos.detalles.color} bgColor={datos.detalles.bgColor} />
          <BtnTurquesa text={"→"} onClick={undefined} w="100px" color={datos.detalles.color} bgColor={datos.detalles.bgColor} />
        </Flex>
      </Box>}

      <Footer />
    </Box>
  );
}
