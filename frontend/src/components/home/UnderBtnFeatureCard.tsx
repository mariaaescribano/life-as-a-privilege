import { Box, Flex, Link } from "@chakra-ui/react";
import { ArrowLeft } from "lucide-react";
// import { ArrowLeft, ArrowRight } from "lucide-react";
import React from "react";
import { EspacioPersonalIcon, } from "../../GlobalVariables";
// import { AprendizajeIcon, EspacioPersonalIcon, } from "../../GlobalVariables";
import { useNavigate } from "react-router-dom";

const UnderBtnFeatureCard = (props:{color:string, linkEspacio:string, linkAprendizaje:string}) => {
    const navigate = useNavigate();
    void props.linkAprendizaje; // comentado para v1: la prop sigue llegando pero el botón está oculto

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
            onClick={()=> navigate(props.linkEspacio)}
            color="white"
            fontWeight="600"
            _hover={{ opacity: 0.8 }}
            >
                <Box as={ArrowLeft} w="24px" h="24px" color={props.color} />
                <EspacioPersonalIcon color={props.color}></EspacioPersonalIcon>
            </Link>

            {/* Botón de Aprendizaje desactivado temporalmente para v1
            <Link
                display="flex"
                alignItems="center"
                gap={2}
                color="white"
                onClick={()=> navigate(props.linkAprendizaje)}
                fontWeight="600"
                _hover={{ opacity: 0.8 }}
            >
                <AprendizajeIcon color={props.color}></AprendizajeIcon>
                <Box as={ArrowRight} w="24px" h="24px" color={props.color}/>
            </Link>
            */}
        </Flex>
    </Flex>
  );
};

export default UnderBtnFeatureCard;
