import React from "react";
import { Box, Flex, HStack, Image, Link, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { AprendizajeIcon, EspacioPersonalIcon, turquesa } from "../../GlobalVariables";
import { ArrowLeft, ArrowRight } from "lucide-react";

export function Header(props: {
  textRight?: string;
  textLeft?: string;
  linkRight?: string;
  linkLeft?: string;
  linkHeader?: string;
  dondeEstoy?:string;
  mb?: string;
}) {
  const navigate = useNavigate();

  return (
    <Box mb={props.mb ?? "20px"}>
      <Box
        position="relative"
        width="100%"
        height="130px"
        bg={turquesa}
        opacity={0.9}
        color="white"
        zIndex="1000"
      >
        <Flex
          height="100%"
          align="center"
          justify="center"
          position="relative"
          px={6}
        >
          {/* Link Derecho */}
          {!props.textRight && (
            <Link
              position="absolute"
              right="0"
              px={6}
              top="50%"
              transform="translateY(-50%)"
              onClick={() => navigate("/aprendizaje/aprendizajeHome")}
              fontWeight="600"
              _hover={{ opacity: 0.8 }}
              textAlign="end"
            >
              <HStack spacing={2} justify="flex-end">
                <AprendizajeIcon color={props.dondeEstoy == "aprendizaje" ? "gray.300" : "white"} />
                {props.dondeEstoy != "aprendizaje" && <Box as={ArrowRight} w="24px" h="24px" />}
              </HStack>
            </Link>
          )}

          {props.textRight && (
            <Link
              position="absolute"
              right="0"
              px={6}
              top="50%"
              transform="translateY(-50%)"
               onClick={() => navigate(props.linkRight ?? "/")}
              fontWeight="600"
              _hover={{ opacity: 0.8 }}
              textAlign="end"
            >
              <HStack spacing={2} justify="flex-end">
                <svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#ffffff"><path d="M720-400v-120H600v-80h120v-120h80v120h120v80H800v120h-80ZM247-527q-47-47-47-113t47-113q47-47 113-47t113 47q47 47 47 113t-47 113q-47 47-113 47t-113-47ZM40-160v-112q0-34 17.5-62.5T104-378q62-31 126-46.5T360-440q66 0 130 15.5T616-378q29 15 46.5 43.5T680-272v112H40Zm80-80h480v-32q0-11-5.5-20T580-306q-54-27-109-40.5T360-360q-56 0-111 13.5T140-306q-9 5-14.5 14t-5.5 20v32Zm296.5-343.5Q440-607 440-640t-23.5-56.5Q393-720 360-720t-56.5 23.5Q280-673 280-640t23.5 56.5Q327-560 360-560t56.5-23.5ZM360-640Zm0 400Z"/></svg>
              </HStack>
            </Link>
          )}

          {/* Logo central */}
          <Box
            width="230px"
            height="130px"
            cursor="pointer"
            onClick={() => navigate(props.linkHeader ?? "/home")}
          >
            <Image
              src="/img/life.png"
              alt="Life"
              width="100%"
              height="100%"
              objectFit="contain"
            />
          </Box>

          {/* Link Izquierdo */}
          {!props.textLeft &&(
            <Link
              position="absolute"
              left="0"
              px={6}
              top="50%"
              transform="translateY(-50%)"
              onClick={() => navigate("/espacio/espacioHome")}
              fontWeight="600"
              _hover={{ opacity: 0.8 }}
              textAlign="start"
            >
              <HStack spacing={2} justify="flex-start">
                {props.dondeEstoy != "espacio" && <Box as={ArrowLeft} w="24px" h="24px" />}
                <EspacioPersonalIcon color={props.dondeEstoy == "espacio" ? "gray.300" : "white"} />
              </HStack>
            </Link>
          )}

          {props.textLeft && (
            <Link
              position="absolute"
              left="0"
              px={6}
              top="50%"
              transform="translateY(-50%)"
              onClick={() => navigate(props.linkLeft ?? "/")}
              fontWeight="600"
              _hover={{ opacity: 0.8 }}
              textAlign="start"
            >
              <HStack spacing={2} justify="flex-start">
                <svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#FFFFFF"><path d="M480-120v-80h280v-560H480v-80h280q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H480Zm-80-160-55-58 102-102H120v-80h327L345-622l55-58 200 200-200 200Z"/></svg>
              </HStack>
            </Link>
          )}

        </Flex>
      </Box>
    </Box>
  );
}
