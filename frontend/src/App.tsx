import { useEffect, useState } from "react";
import { Box, Heading, Text, Spinner } from "@chakra-ui/react";
import React from "react";

function App() {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://localhost:3000/api")
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .catch(() => setMessage("Failed to fetch"));
  }, []);

  return (
    <Box textAlign="center" mt={10}>
      <Heading mb={4}>React + NestJS + Chakra UI</Heading>
      {message ? (
        <Text fontSize="xl">{message}</Text>
      ) : (
        <Spinner size="xl" />
      )}
    </Box>
  );
}

export default App;
