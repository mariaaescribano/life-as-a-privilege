import { Box, Flex, Link } from "@chakra-ui/react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import React from "react";
import { AprendizajeIcon, EspacioPersonalIcon, } from "../../GlobalVariables";

const UnderBtnFeatureCard = (props:{color:string, linkPersonal?:string, linkAprendizaje?:string}) => {
  return (
    <Flex
        direction="column"
        align="center"
        justify="center"
        mt="30px"  
        zIndex="1000"
        position="relative"
        gap={2}   
        >
        <Box
            w="40%"       // ancho de la línea
            h="1px"       // grosor
            mb="20px"
            bg="gray.300" // color gris
        />
        
        {/* Botones centrados en medio */}
        <Flex
            gap={6} // espacio entre los dos botones
            align="center"
            justify="center"
        >
            <Link
            display="flex"
            alignItems="center"
            gap={2}
            color="white"
            fontWeight="600"
            _hover={{ opacity: 0.8 }}
            >
                <Box as={ArrowLeft} w="24px" h="24px" color={props.color} />
                <EspacioPersonalIcon color={props.color}></EspacioPersonalIcon>
            </Link>

            <Link
                display="flex"
                alignItems="center"
                gap={2}
                color="white"
                fontWeight="600"
                _hover={{ opacity: 0.8 }}
            >
                <AprendizajeIcon color={props.color}></AprendizajeIcon>
                <Box as={ArrowRight} w="24px" h="24px" color={props.color}/>
            </Link>
        </Flex>
    </Flex>
  );
};

export default UnderBtnFeatureCard;
