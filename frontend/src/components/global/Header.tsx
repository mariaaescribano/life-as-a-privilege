import React from "react";
import { Box, Flex, HStack, Image, Link, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { turquesa } from "../../GlobalVariables";
import { ArrowLeft, ArrowRight } from "lucide-react";

export function Header(props: {
  textRight: string;
  textLeft: string;
  linkRight: string;
  linkLeft: string;
  linkHeader?: string;
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
          {(
            <Link
              position="absolute"
              right="0"
              px={6}
              top="50%"
              transform="translateY(-50%)"
              onClick={() => navigate(props.linkRight)}
              color="white"
              fontWeight="600"
              _hover={{ opacity: 0.8 }}
              textAlign="end"
            >
              <HStack spacing={2} justify="flex-end">
                {/* SVG personalizado derecho */}
                <Box
                  as="svg"
                  xmlns="http://www.w3.org/2000/svg"
                  height="50px"
                  viewBox="0 -960 960 960"
                  width="50px"
                  fill="currentColor"
                >
                  <path d="M440-278v-394q-41-24-87-36t-93-12q-36 0-71.5 7T120-692v396q35-12 69.5-18t70.5-6q47 0 91.5 10.5T440-278Zm40 118q-48-38-104-59t-116-21q-42 0-82.5 11T100-198q-21 11-40.5-1T40-234v-482q0-11 5.5-21T62-752q46-24 96-36t102-12q74 0 126 17t112 52q11 6 16.5 14t5.5 21v418q44-21 88.5-31.5T700-320q36 0 70.5 6t69.5 18v-481q15 5 29.5 11t28.5 14q11 5 16.5 15t5.5 21v482q0 23-19.5 35t-40.5 1q-37-20-77.5-31T700-240q-60 0-116 21t-104 59Zm140-240v-440l120-40v440l-120 40Zm-340-99Z"/>
                </Box>

                {/* ArrowRight */}
                <Box as={ArrowRight} w="24px" h="24px" />
                <Text>{props.textRight}</Text>
              </HStack>
            </Link>
          )}

          {/* Logo central */}
          <Box
            width="230px"
            height="130px"
            cursor="pointer"
            onClick={() => navigate(props.linkHeader ?? "/")}
          >
            <Image
              src="/public/img/life.png"
              alt="Life"
              width="100%"
              height="100%"
              objectFit="contain"
            />
          </Box>

          {/* Link Izquierdo */}
          { (
            <Link
              position="absolute"
              left="0"
              px={6}
              top="50%"
              transform="translateY(-50%)"
              onClick={() => navigate(props.linkLeft)}
              color="white"
              fontWeight="600"
              _hover={{ opacity: 0.8 }}
              textAlign="start"
            >
              <HStack spacing={2} justify="flex-start">
                {/* ArrowLeft */}
                <Box as={ArrowLeft} w="24px" h="24px" />

                {/* SVG personalizado izquierdo */}
                <Box
                  as="svg"
                  xmlns="http://www.w3.org/2000/svg"
                  height="50px"
                  viewBox="0 -960 960 960"
                  width="50px"
                  fill="currentColor"
                >
                  <path d="M480-240Zm-320 80v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440h14q-11 18-16.5 38.5T472-360q-54 1-107.5 14.5T260-306q-9 5-14.5 14t-5.5 20v32h283l80 80H160Zm207-367q-47-47-47-113t47-113q47-47 113-47t113 47q47 47 47 113t-47 113q-47 47-113 47t-113-47Zm169.5-56.5Q560-607 560-640t-23.5-56.5Q513-720 480-720t-56.5 23.5Q400-673 400-640t23.5 56.5Q447-560 480-560t56.5-23.5ZM480-640Zm236 480L576-300q-13-13-18.5-28t-5.5-30q0-32 23-57t59-25q28 0 44 13t38 35q20-20 36.5-34t45.5-14q37 0 59.5 25.5T880-357q0 15-6 30t-18 27L716-160Z"/>
                </Box>

                <Text>{props.textLeft}</Text>
              </HStack>
            </Link>
          )}
        </Flex>
      </Box>
    </Box>
  );
}
