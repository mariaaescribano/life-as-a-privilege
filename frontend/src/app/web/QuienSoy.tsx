import {
  Box,
  Flex,
  Image,
  VStack,
  Heading,
  Grid,
  Text,
  SimpleGrid,
  Button,
  HStack,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import { Header } from "../../components/global/Header";
import BadgeText from "../../components/welcome/BadgeText";
import Footer from "../../components/global/Footer";
import { astrologiaBg, AstrologiaIcon, astrologiaNom, astrologiaTxt, ayurvedaBg, AyurvedaIcon, ayurvedaNom, ayurvedaTxt, biologiaBg, BiologiaIcon, biologiaNom, biologiaTxt, cabalaBg, CabalaIcon, cabalaNom, cabalaTxt, fisiologiaBg, FisiologiaIcon, fisiologiaNom, fisiologiaTxt, neuropsicologiaBg, NeuropsicologiaIcon, neuropsicologiaNom, neuropsicologiaTxt, nutricionBg, NutricionIcon, nutricionNom, nutricionTxt, tcmBg, TCMIcon, tcmNom, tcmTxt, turquesa } from "../../GlobalVariables";
import Card from "../../components/global/Card";
import { useNavigate } from "react-router-dom";
import BtnTurquesa from "../../components/global/BtnTurquesa";

type Libro = {
  title: string;
  descripcion: string;
  img: string;
  link: string;
};

type Certificado = {
  img:string;
};

const QuienSoy = () => {
    
    const libros: Libro[] = [ 
        {   
            title: "Life as a Privilege", 
            descripcion: "Entiende al ser humano, al milagro de la naturaleza y al universo de manera holística.", 
            img:"/libros/img/book.png", 
            link:"/libros/pdfs/book.pdf" 
        },
        {   
            title: "Traditional chinese medicine", 
            descripcion: "Una recopilación completa y holística de esta medicina, tradición y ciencia.", 
            img:"/libros/img/tcm.png", 
            link:"/libros/pdfs/tcm.pdf" 
        },
        {   
            title: "The Kabbalah", 
            descripcion: "Una recopilación del antiguo y poderoso misticismo judio enfocado al crecimiento personal.", 
            img:"/libros/img/cabala.png", 
            link:"/libros/pdfs/cabala.pdf" 
        },
    ];

    const certificados: Certificado[] = [ 
        {img:"/certificados/1.png"}, {img:"/certificados/2.png"}, {img:"/certificados/3.png"}, {img:"/certificados/4.png"}, {img:"/certificados/5.png"}, {img:"/certificados/6.png"}, 
        {img:"/certificados/7.png"}, {img:"/certificados/8.png"}, {img:"/certificados/9.png"}, {img:"/certificados/10.png"}, {img:"/certificados/11.png"}, {img:"/certificados/12.png"}, 
        {img:"/certificados/13.png"}, {img:"/certificados/14.png"}, {img:"/certificados/15.png"}, {img:"/certificados/16.png"} 
    ];

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "auto" });
    }, []);

    
    return (
         <Box
            minH="100vh"
            display="flex"
            flexDirection="column"
        >
            <Header />
            
            <Box
                flex="1"
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                position="relative"
                mb="100px"
            >
            <VStack spacing={10} align="center" w="100%" py={20}>
                {/* Card de presentación */}
                <Box
                    w={{ base: "90%", md: "80%" }}
                    bg="white"
                    p={8}
                    borderRadius="20px"
                    boxShadow="lg"
                    display="flex"
                    flexDirection={{ base: "column", md: "row" }}
                    alignItems="center"
                    gap={8} // mejor que usar mr y mb separados
                    textAlign={{ base: "center", md: "left" }}
                    >
                    {/* Foto circular fija */}
                    <Box
                        flexShrink={0} 
                        w={{ base: "150px", md: "200px" }}
                        h={{ base: "150px", md: "200px" }}
                        borderRadius="full"
                        overflow="hidden"
                    >
                        <Image
                        src="/img/me3.jpg" // ✅ SIN /public
                        alt="Mi foto"
                        w="100%"
                        h="100%"
                        objectFit="cover"
                        />
                    </Box>

                    {/* Texto flexible */}
                    <Box flex="1">
                        <Heading size="2xl" filter="drop-shadow(2px 2px 2px rgba(0,0,0,0.4))">María Escribano</Heading>

                        <Text fontSize="lg" color="gray.600" mt={2}>
                        Comunicadora / Investigadora / Aprendiz
                        </Text>

                        <Text mt={4} fontSize="md" color="gray.700">
                        Busco conocer la Verdad profunda del ser humano que va más allá
                        de cualquier religión, tradición o percepción. El conocimiento
                        y la sabiduría pertenecen al pueblo y esta web tiene como
                        propósito compartir aquello que me ha ayudado a crecer.
                        </Text>
                    </Box>
                </Box>


                {/* Card de libros */}
                <Box
                    w={{ base: "90%", md: "80%" }}
                    bg="white"
                    p={{ base: 5, md: 10 }}
                    borderRadius="20px"
                    boxShadow="lg"
                >
                    <Heading textAlign="center" mb={6}>
                        <HStack justify="center" spacing={3}>
                            {/* Ícono SVG */}
                            <Box as="span"  filter="drop-shadow(2px 2px 2px rgba(0,0,0,0.4))" display="inline-block">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                height="35px"
                                viewBox="0 -960 960 960"
                                width="35px"
                                fill="#000000"
                            >
                                <path d="M480-160q-48-38-104-59t-116-21q-42 0-82.5 11T100-198q-21 11-40.5-1T40-234v-482q0-11 5.5-21T62-752q46-24 96-36t102-12q58 0 113.5 15T480-740v484q51-32 107-48t113-16q36 0 70.5 6t69.5 18v-480q15 5 29.5 10.5T898-752q11 5 16.5 15t5.5 21v482q0 23-19.5 35t-40.5 1q-37-20-77.5-31T700-240q-60 0-116 21t-104 59Zm80-200v-380l200-200v400L560-360Zm-160 65v-396q-33-14-68.5-21.5T260-720q-37 0-72 7t-68 21v397q35-13 69.5-19t70.5-6q36 0 70.5 6t69.5 19Zm0 0v-396 396Z"/>
                            </svg>
                            </Box>

                            {/* Texto con sombra */}
                            <Text textShadow="2px 2px 4px rgba(0,0,0,0.3)" fontSize="3xl" color="black" fontWeight="bold">
                            Mis Libros
                            </Text>
                        </HStack>
                    </Heading>

                    <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mt="20px">
                    {libros.map((libro, index) => (
                        <Box key={index+"libro"} borderRadius="20px" p={4} bg="gray.100" textAlign="center">
                            <Image
                                src={libro.img} // tu imagen
                                alt={`Libro`}
                                borderWidth="2px"
                                borderStyle="solid"
                                borderColor="gray.100"   // aquí sí funciona
                                borderRadius="20px"
                                mb={4}
                                objectFit="cover"
                                h="500px"
                                w="100%"
                            />


                            <Heading size="md">{libro.title}</Heading>
                            <Text mt={2} fontSize="sm" color="gray.600" mb="20px">
                                {libro.descripcion}
                            </Text>
                            
                            <Button
                                as="a"
                                href={libro.link}
                                download
                                bg={turquesa}
                                color="white"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M480-320 280-520l56-58 104 104v-326h80v326l104-104 56 58-200 200ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z"/></svg>
                                <Text> Descargar</Text>
                            </Button>
                        </Box>
                    ))}
                    </SimpleGrid>
                </Box>

                {/* Card de títulos */}
                <Box
                    w={{ base: "90%", md: "80%" }}
                    bg="white"
                    p={8}
                    borderRadius="xl"
                    boxShadow="lg"
                >
                    <Heading textAlign="center" mb={6}>
                        <HStack justify="center" spacing={3}>
                            {/* Ícono SVG */}
                            <Box as="span"  filter="drop-shadow(2px 2px 2px rgba(0,0,0,0.4))" display="inline-block">
                           <svg
                            xmlns="http://www.w3.org/2000/svg"
                            height="35px"
                            viewBox="0 -960 960 960"
                            width="35px"
                            fill="#000000"
                            >
                                <path d="M395-475q-35-35-35-85t35-85q35-35 85-35t85 35q35 35 35 85t-35 85q-35 35-85 35t-85-35ZM240-40v-309q-38-42-59-96t-21-115q0-134 93-227t227-93q134 0 227 93t93 227q0 61-21 115t-59 96v309l-240-80-240 80Zm410-350q70-70 70-170t-70-170q-70-70-170-70t-170 70q-70 70-70 170t70 170q70 70 170 70t170-70ZM320-159l160-41 160 41v-124q-35 20-75.5 31.5T480-240q-44 0-84.5-11.5T320-283v124Zm160-62Z"/>
                            </svg>

                            </Box>

                            {/* Texto con sombra */}
                            <Text textShadow="2px 2px 4px rgba(0,0,0,0.3)" fontSize="3xl" color="black" fontWeight="bold">
                            Mis Certificados
                            </Text>
                        </HStack>
                    </Heading>

                    <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
                    {certificados.map((titulo, idx) => (
                    <Box key={idx} p={4} bg="gray.50" borderRadius="lg" textAlign="center">
                        <Image
                            src={titulo.img}
                            alt="certificado"
                            w="100%"
                            h="200px"

                            borderRadius="md"
                            mb={4}
                        />
                    </Box>

                    ))}
                    </SimpleGrid>
                </Box>

              <Box
                w={{ base: "90%", md: "80%" }}
                bg="white"
                p={8}
                borderRadius="xl"
                boxShadow="lg"
                display="flex"
                alignItems="center"
                justifyContent="center"
                minH="120px"
                textAlign="center"
                >
                    <Text
                        fontSize={{ base: "lg", md: "xl" }}
                        fontWeight="semibold"
                        color="black"
                        textShadow="1px 1px 3px rgba(0,0,0,0.3)"
                    >
                        ♊︎ Esto es solo el principio... 
                    </Text>
                </Box>
            </VStack>

            </Box>
        <Footer mt="100px" />
        </Box>
    );
};

export default QuienSoy;
