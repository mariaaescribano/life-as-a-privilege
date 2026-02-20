import { Box, Image, useBreakpointValue } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { API_URL, astrologiaBg, AstrologiaIcon, astrologiaNom, ayurvedaBg, AyurvedaIcon, ayurvedaNom, biologiaBg, BiologiaIcon, biologiaNom, cabalaBg, CabalaIcon, cabalaNom, EspacioPersonalIcon, fisiologiaBg, FisiologiaIcon, fisiologiaNom, neuropsicologiaBg, NeuropsicologiaIcon, neuropsicologiaNom, nutricionBg, NutricionIcon, nutricionNom, tcmBg, TCMIcon, tcmNom } from "../../GlobalVariables";
import { Header } from "../../components/global/Header";
import Footer from "../../components/global/Footer";
import Title from "../../components/global/Title";
import { useNavigate } from "react-router-dom";
import SpinnerTurquesa from "../../components/global/Spinner";

const EspacioHome = () => {
    const navigate = useNavigate();
    const photos = [ 
        { bg: fisiologiaBg, icon: <FisiologiaIcon size="50px"/>, link: "/espacio/questions/"+ fisiologiaNom, cursor:"not-allowed" },
        { bg: neuropsicologiaBg, icon: <NeuropsicologiaIcon size={{base:"50px", md:"50px"}} />, link: "/espacio/questions/" + neuropsicologiaNom, cursor:"pointer" } ,
        { bg: astrologiaBg, icon: <AstrologiaIcon size="50px" />, link: "/espacio/questions/" + astrologiaNom, cursor:"not-allowed" } ,
        { bg: tcmBg, icon: <TCMIcon size="50px" />, link: "/espacio/questions/" + tcmNom, cursor:"not-allowed" } ,
        { bg: nutricionBg, icon: <NutricionIcon size="50px" />, link: "/espacio/questions/" + nutricionNom, cursor:"not-allowed"} ,
        { bg: ayurvedaBg, icon: <AyurvedaIcon size="50px" />, link: "/espacio/questions/" + ayurvedaNom, cursor:"not-allowed"} ,
        { bg: biologiaBg, icon: <BiologiaIcon size="50px" />, link: "/espacio/questions/" + biologiaNom, cursor:"not-allowed"},
        { bg: cabalaBg, icon: <CabalaIcon size="50px" />, link: "/espacio/questions/" + cabalaNom , cursor:"not-allowed"} 
    ];

    const angleStep = (2 * Math.PI) / photos.length;

    const radius = useBreakpointValue({
        base: 120,
        sm: 150,
        md: 200,
        lg: 250,
        xl: 280
    });

    const containerSize = useBreakpointValue({
        base: "320px",
        sm: "400px",
        md: "520px",
        lg: "650px",
        xl: "750px"
    });

    const centerSize = useBreakpointValue({
        base: "140px",
        md: "180px",
        lg: "220px",
        xl: "260px"
    });

    // #region img

    const [img, setimg] = useState<string | null>(null);

    // 1) comprueba si el user ya tiene foto
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "auto" });
        if(img == null)
        {
            let img = sessionStorage.getItem("img");
            setimg(img);
        }
    }, []);


    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        let userId = sessionStorage.getItem("userId");
        let token = sessionStorage.getItem("token");

        if(userId && token)
        {
            const selectedFile = e.target.files[0];

            const formData = new FormData();
            formData.append('file', selectedFile);      
            formData.append('userId', userId);   

            const res = await fetch(`${API_URL}/upload/profile-pic`, {
                method: "POST",
                body: formData,
            });

            const data = await res.json();
            if (data.url) {
                sessionStorage.setItem("img", data.url); // guardar URL pública
                setimg(data.url);
            }

        }
        else
        {
            navigate("/home")
        }
    };
    
    return (
        <Box
            minH="100vh"
            display="flex"
            flexDirection="column"
        >
            <Header dondeEstoy="espacio" />
                {img != null && <Box
                    flex="1"
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    position="relative"
                    mb="100px"
                >

                    <Title icon={<EspacioPersonalIcon color="black" size="60px" />} title={"Mi Espacio"} />
                
                    <Box
                        position="relative"
                        w={containerSize}
                        h={containerSize}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                    >
                        {/* Centro */}
                        <Box
                            position="absolute"
                            w={centerSize}
                            h={centerSize}
                            borderRadius="full"
                            overflow="hidden"
                            boxShadow="2xl"
                            border="6px solid white"
                            zIndex={10}
                        >
                            <Image src={img} alt="Centro" w="100%" h="100%" objectFit="cover" />
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                style={{
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    width: "100%",
                                    height: "100%",
                                    opacity: 0,
                                    cursor: "pointer",
                                }}
                            />
                        </Box>

                            {/* Elementos alrededor */}
                            {photos.map((photo, index) => {
                            const angle = angleStep * index - Math.PI / 2;
                            const x = Math.cos(angle) * (radius ?? 150);
                            const y = Math.sin(angle) * (radius ?? 150);

                            return (
                                <Box
                                    key={index}
                                    cursor={photo.cursor}
                                    position="absolute"
                                    w={{ base: "70px", md: "90px", lg: "110px" }}
                                    h={{ base: "70px", md: "90px", lg: "110px" }}
                                    borderRadius="full"
                                    overflow="hidden"
                                    boxShadow="xl"
                                    onClick={()=> navigate(photo.link)}
                                    border="5px solid white"
                                    transform={`translate(${x}px, ${y}px)`}
                                    transition="all 0.3s ease"
                                    _hover={{
                                        transform: `translate(${x}px, ${y}px) scale(1.15)`
                                    }}
                                >
                                    <Box
                                        w="100%"
                                        h="100%"
                                        bg={photo.bg}
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="center"
                                    >
                                        {photo.icon}
                                    </Box>
                                </Box>
                            );
                        })}
                    </Box>
                </Box>}

                {img == null && 
                <SpinnerTurquesa />}
            <Footer />
        </Box>
    );
};

export default EspacioHome;
