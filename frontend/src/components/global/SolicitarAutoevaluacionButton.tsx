import React, { useState } from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import { ContactModal } from "./ContactModal";

interface SolicitarAutoevaluacionButtonProps {
  bgColor: string;
  color: string;
  icon: React.ReactNode;
  disciplineName: string;
}

export function SolicitarAutoevaluacionButton({
  bgColor, color, icon, disciplineName,
}: SolicitarAutoevaluacionButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Flex justify="center" w="100%" pt={{ base: 8, md: 12 }} pb={{ base: 10, md: 14 }}>
        <Flex
          as="button"
          align="center"
          justify="center"
          direction="row"
          gap={{ base: 2, md: 3 }}
          px={{ base: 5, md: 12 }}
          py={{ base: 2, md: 4 }}
          borderRadius="full"
          border={`3px solid ${color}`}
          bg={bgColor}
          cursor="pointer"
          color={color}
          fontFamily="'EB Garamond', serif"
          fontWeight="700"
          fontSize={{ base: "md", md: "xl" }}
          letterSpacing="0.12em"
          onClick={() => setIsOpen(true)}
          _hover={{ transform: "translateY(-2px)" }}
          transition="all 0.25s ease"
          boxShadow={"0 4px 20px rgba(0,0,0,0.22), 0 0 22px rgba(107,196,200,0.8)"}
        >
          <Box
            w={{ base: "20px", md: "26px" }}
            h={{ base: "20px", md: "26px" }}
            flexShrink={0}
            filter={`drop-shadow(0 0 6px ${color}88)`}
          >
            {icon}
          </Box>
          <Text>Solicitar autoevaluación personalizada</Text>
        </Flex>
      </Flex>

      <ContactModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Autoevaluación personalizada"
        icon={icon}
        bgColor={bgColor}
        color={color}
        emailSubject={`Solicitud de autoevaluación personalizada — ${disciplineName}`}
        showDescription={true}
        showCheckboxes={false}
        emailOrPhone={true}
        textareaPlaceholder="¿Te gustaría contarme algo por adelantado?"
      />
    </>
  );
}
