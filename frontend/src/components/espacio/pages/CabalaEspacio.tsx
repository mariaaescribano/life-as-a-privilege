import React from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import SiteHeader from "../../global/SiteHeader";
import { DisciplineHeader } from "../../global/DisciplineHeader";
import {
  CabalaIcon,
  cabalaNom,
  cabalaBg,
  cabalaTxt,
} from "../../../GlobalVariables";
import ArbolDeLaVida from "../../global/ArbolDeLaVida";

export default function CabalaEspacio() {

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="auto" />

      <Box flex="1">
        <Flex
          direction="column" alignItems="center"
          px={{ base: 5, md: 10, lg: 16 }}
          pt={{ base: 10, md: 14 }}
          pb={{ base: 14, md: 20 }}
        >
          <DisciplineHeader
            icon={<CabalaIcon size={{ base: "40px", md: "56px" }} />}
            title={cabalaNom}
            bgColor={cabalaBg}
            color={cabalaTxt}
            maxW="900px"
          />

            <Box
                w="100%"
                maxW="900px"
                boxShadow={"0 4px 20px rgba(0,0,0,0.22), 0 0 22px rgba(107,196,200,0.8)"}
                bg={cabalaBg}
                border={`1.5px solid ${cabalaTxt}55`}
                borderRadius="3xl"
                px={{ base: 6, md: 10 }}
                pt={{ base: 8, md: 10 }}
                pb={{ base: 8, md: 10 }}
            >
                <ArbolDeLaVida />
            </Box>
         
        </Flex>
      </Box>

       <Box
            as="footer"
            borderTop="1px solid rgba(255,255,255,0.1)"
            px={{ base: 6, md: 16 }}
            py={{ base: 8, md: 10 }}
        >
            <Text
            color="rgba(255,255,255,0.38)"
            fontSize="xs"
            letterSpacing="0.05em"
            textAlign="center"
            >
            © 2026 Life as a Privilege · María Escribano · Todos los derechos reservados
            </Text>
        <Text
          as="a"
          href="/contacto"
          color="rgba(255,255,255,0.4)"
          fontSize="xs"
          letterSpacing="0.05em"
          display="block"
          textAlign="center"
          mt={1}
          textDecoration="underline"
          cursor="pointer"
        >
          Contactar
        </Text>
        </Box>
    </Box>
  );
}
