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
      localStorage.setItem("token",  token);
      localStorage.setItem("userId", userId);
      localStorage.setItem("name",   name);
      localStorage.setItem("img",    img && img !== "" ? img : "/img/icono/noImg.png");

      const next = localStorage.getItem("postAuthNext");
      localStorage.removeItem("postAuthNext");
      navigate(next || "/home", { replace: true });
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
