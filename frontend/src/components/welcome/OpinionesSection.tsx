import React, { useEffect, useRef, useState } from "react";
import { Box, Flex, Grid, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../GlobalVariables";
import type { Opinion } from "../../dtos/opinion.type";

const useReveal = (threshold = 0.15) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
};

const OpinionesSection: React.FC = () => {
  const navigate = useNavigate();
  const reveal = useReveal(0.1);
  const [opiniones, setOpiniones] = useState<Opinion[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/opinion`)
      .then(r => r.ok ? r.json() : [])
      .then((data: Opinion[]) => setOpiniones(Array.isArray(data) ? data.slice(0, 3) : []))
      .catch(() => setOpiniones([]))
      .finally(() => setLoaded(true));
  }, []);

  if (loaded && opiniones.length === 0) return null;

  return (
    <Box
      ref={reveal.ref}
      px={{ base: 5, md: 10, lg: 16 }}
      pt={{ base: 12, md: 16 }}
      pb={{ base: 4, md: 6 }}
    >
      <Flex direction="column" align="center" w="100%">
        <Flex align="center" justify="center" gap={3} mb={{ base: 6, md: 8 }}>
          <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" w={{ base: "28px", md: "36px" }} h={{ base: "28px", md: "36px" }} fill="white" flexShrink={0}>
            <path d="M580-240q-42 0-71-29t-29-71q0-42 29-71t71-29q42 0 71 29t29 71q0 42-29 71t-71 29ZM280-560q-42 0-71-29t-29-71q0-42 29-71t71-29q42 0 71 29t29 71q0 42-29 71t-71 29Zm0 320q-33 0-56.5-23.5T200-320v-200q0-33 23.5-56.5T280-600q33 0 56.5 23.5T360-520v200q0 33-23.5 56.5T280-240Zm300 0q-33 0-56.5-23.5T500-320v-200q0-33 23.5-56.5T580-600q33 0 56.5 23.5T660-520v200q0 33-23.5 56.5T580-240Z"/>
          </Box>
          <Text
            color="white"
            fontSize={{ base: "3xl", md: "4xl" }}
            fontWeight="700"
            letterSpacing="0.04em"
            textShadow="0 2px 10px rgba(0,100,90,0.5)"
            fontFamily="'EB Garamond', serif"
          >
            Opiniones
          </Text>
        </Flex>

        <Grid
          w={{ base: "100%", md: "85%" }}
          templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
          gap={{ base: 6, md: 7 }}
        >
          {opiniones.map((op, i) => (
            <Box
              key={op.id}
              bg="rgba(255,255,255,0.18)"
              border="1px solid rgba(255,255,255,0.4)"
              sx={{ backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)" }}
              borderRadius="2xl"
              boxShadow="0 6px 24px rgba(107,196,200,0.4)"
              px={{ base: 6, md: 7 }}
              py={{ base: 6, md: 7 }}
              display="flex"
              flexDirection="column"
              gap={3}
              opacity={reveal.visible ? 1 : 0}
              transform={reveal.visible ? "translateY(0)" : "translateY(28px)"}
              transition={`opacity 0.6s ease ${i * 0.12}s, transform 0.6s ease ${i * 0.12}s`}
            >
              <Text
                color="white"
                fontSize="3xl"
                lineHeight="1"
                opacity={0.55}
                fontFamily="'EB Garamond', serif"
              >
                “
              </Text>
              <Text
                color="rgba(255,255,255,0.92)"
                fontSize={{ base: "md", md: "lg" }}
                lineHeight="1.7"
                fontStyle="italic"
                fontFamily="'EB Garamond', serif"
                noOfLines={6}
              >
                {op.texto}
              </Text>
              <Text
                color="white"
                fontSize={{ base: "md", md: "lg" }}
                fontWeight="700"
                letterSpacing="0.04em"
                mt={1}
                fontFamily="'EB Garamond', serif"
                textShadow="0 1px 5px rgba(0,60,50,0.3)"
              >
                — {op.nombre}
              </Text>
            </Box>
          ))}
        </Grid>

        <Flex justify={{ base: "center", md: "flex-end" }} w={{ base: "100%", md: "85%" }} mt={{ base: 6, md: 7 }}>
          <Box
            as="button"
            onClick={() => navigate("/opiniones")}
            color="white"
            fontFamily="'EB Garamond', serif"
            fontWeight="600"
            fontSize={{ base: "md", md: "lg" }}
            letterSpacing="0.06em"
            px={7}
            py="10px"
            borderRadius="full"
            border="1.5px solid rgba(255,255,255,0.6)"
            bg="rgba(255,255,255,0.12)"
            cursor="pointer"
            _hover={{ bg: "rgba(255,255,255,0.25)", borderColor: "white" }}
            transition="all 0.2s"
          >
            Ver más →
          </Box>
        </Flex>
      </Flex>
    </Box>
  );
};

export default OpinionesSection;
