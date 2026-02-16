import React from "react";
import { Box, Flex, Image, Link } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { turquesa } from "../../GlobalVariables";

export function Header(props:
  {
    textRight:string, textLeft:string, linkRight:string, linkLeft:string, 
    linkHeader?:string,
    mb?:string,
  }) {
  const navigate = useNavigate();

  return (
    <Box mb={props.mb ?? "20px"}>
      <Box
        position="relative"
        top="0"
        left="0"
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
         <Link
            position="absolute"
            right="40px"
            onClick={() => navigate(props.linkLeft)} 
            color="white"
            fontWeight="600"
            _hover={{ opacity: 0.8 }}
          >
            {props.textLeft}
          </Link>

          {/* CENTER LOGO */}
          <Box width="230px" height="130px" cursor="pointer" onClick={() => navigate(props.linkHeader ?? "/")}>
            <Image
              src="/public/img/life.png"
              alt="Life"
              width="100%"
              height="100%"
              objectFit="contain"
            />
          </Box>

           <Link
            onClick={() => navigate(props.linkRight)} 
            position="absolute"
            left="40px"
            color="white"
            fontWeight="600"
            _hover={{ opacity: 0.8 }}
          >
            {props.textRight}
          </Link>
        </Flex>
      </Box>
    </Box>
  );
}
