import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Box } from "@chakra-ui/react";
import SpinnerTurquesa from "../../components/global/Spinner";

export default function GoogleAuthCallback() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token  = params.get("token");
    const userId = params.get("userId");
    const name   = params.get("name");
    const img    = params.get("img");

    if (token && userId && name) {
      sessionStorage.setItem("token",  token);
      sessionStorage.setItem("userId", userId);
      sessionStorage.setItem("name",   name);
      sessionStorage.setItem("img",    img && img !== "" ? img : "/img/icono/noImg.png");
      navigate("/home", { replace: true });
    } else {
      navigate("/logIn", { replace: true });
    }
  }, []);

  return (
    <Box minH="100vh" bg="#008080">
      <SpinnerTurquesa />
    </Box>
  );
}
