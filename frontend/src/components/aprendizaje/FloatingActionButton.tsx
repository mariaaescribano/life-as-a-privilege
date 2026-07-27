import React, { useState } from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import type { FloatingButtonConfig } from "../../dtos/aprendizaje.type";
import { ContactModal } from "../global/ContactModal";
import { LoginRequiredModal } from "../global/LoginRequiredModal";
import { AstrologiaServicesModal } from "./AstrologiaServicesModal";

interface FloatingActionButtonProps {
  config: FloatingButtonConfig;
  color: string;
  bgColor: string;
  icon?: React.ReactNode;
  modalityName?: string;
}

export function FloatingActionButton({
  config,
  color,
  bgColor,
  icon,
  modalityName = "",
}: FloatingActionButtonProps) {
  const navigate = useNavigate();
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [astrologiaModalOpen, setAstrologiaModalOpen] = useState(false);

  const handleClick = () => {
    if (config.action === "route" && config.route) {
      navigate(config.route);
    } else if (config.action === "espacio") {
      navigate("/espacio/espacioHome");
    } else if (config.action === "espacio-auth") {
      const userId = localStorage.getItem("userId");
      if (userId) {
        navigate(config.route ?? "/espacio/espacioHome");
      } else {
        setLoginModalOpen(true);
      }
    } else if (config.action === "modal") {
      setContactModalOpen(true);
    } else if (config.action === "astrologia-services") {
      setAstrologiaModalOpen(true);
    }
  };

  return (
    <>
      <Box
        position="fixed"
        bottom={{ base: "20px", md: "28px" }}
        right={{ base: "14px", md: "28px" }}
        zIndex={900}
        maxW={{ base: "calc(100vw - 28px)", md: "320px" }}
      >
        <Flex
          as="button"
          onClick={handleClick}
          align="center"
          gap={{ base: 2, md: 3 }}
          pl={{ base: 3, md: 5 }}
          pr={{ base: 4, md: 6 }}
          py={{ base: "10px", md: "14px" }}
          borderRadius="full"
          bg={bgColor}
          border={`1.5px solid ${color}88`}
          boxShadow={`0 4px 20px rgba(0,0,0,0.22), 0 0 22px rgba(107,196,200,0.8)`}
          cursor="pointer"
          transition="all 0.22s ease"
          _hover={{
            boxShadow: `0 6px 28px rgba(0,0,0,0.32), 0 0 32px rgba(107,196,200,1)`,
            transform: "translateY(-2px)",
            border: `1.5px solid ${color}cc`,
          }}
          _active={{ transform: "translateY(0px)" }}
          w="fit-content"
        >
          {/* Icono — siempre a la izquierda */}
          {icon && (
            <Box
              flexShrink={0}
              w={{ base: "22px", md: "26px" }}
              h={{ base: "22px", md: "26px" }}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              {icon}
            </Box>
          )}
          <Text
            color={color}
            fontFamily="'EB Garamond', serif"
            fontWeight="700"
            fontSize={{ base: "sm", md: "lg" }}
            letterSpacing="0.06em"
            lineHeight="1"
            filter={`drop-shadow(0 1px 3px rgba(0,0,0,0.3))`}
          >
            {config.label}
          </Text>
        </Flex>
      </Box>

      {config.action === "modal" && (
        <ContactModal
          isOpen={contactModalOpen}
          onClose={() => setContactModalOpen(false)}
          title={config.modalTitle ?? config.label}
          icon={icon}
          subtitle={config.modalSubtitle}
          bgColor={bgColor}
          color={color}
          emailSubject={config.emailSubject ?? `${config.label} — ${modalityName}`}
          showDescription
          showCheckboxes={false}
        />
      )}

      {config.action === "espacio-auth" && (
        <LoginRequiredModal
          isOpen={loginModalOpen}
          onClose={() => setLoginModalOpen(false)}
        />
      )}

      {config.action === "astrologia-services" && (
        <AstrologiaServicesModal
          isOpen={astrologiaModalOpen}
          onClose={() => setAstrologiaModalOpen(false)}
        />
      )}
    </>
  );
}
