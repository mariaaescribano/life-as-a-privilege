'use client';

import { Box } from "@chakra-ui/react";
import React from "react";

export const API_URL ='http://localhost:3000'; // "https://life-as-a-privilege.onrender.com"; 

// COLORES
export const turquesa = "#48C0B5";

// Fisiología
export const fisiologiaNom = "Fisiología";
export const fisiologiaBg = "#e6d7ff";
export const fisiologiaTxt = "#34106d";
export function FisiologiaIcon({ size = "24px"}) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" height={size} viewBox="0 -960 960 960" width={size ?? "24px"} fill={fisiologiaTxt}><path d="m316-240 76-364-72 28v96h-80v-148l202-85q14-6 29.5-7.5T501-717q14 5 26.5 14t20.5 23l40 64q28 45 73.5 70.5T760-520v80q-70 0-125.5-28T540-540l-24 60 84 80v160h-80v-122l-78-72-42 194h-84Zm167.5-523.5Q460-787 460-820t23.5-56.5Q507-900 540-900t56.5 23.5Q620-853 620-820t-23.5 56.5Q573-740 540-740t-56.5-23.5ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-119 61.5-214T302-838l36 71q-79 39-128.5 115.5T160-480q0 134 93 227t227 93q134 0 227-93t93-227h80q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z"/></svg>
  );
}
export const fisiologiaDescrip = "Redescubre tu cuerpo como el milagro que es. Comprende su funcionamiento y transforma el enfado y la frustración en amor y respeto."

// Neuropsicología
export const neuropsicologiaNom = "Neuropsicología";
export const neuropsicologiaBg = "#daa889";
export const neuropsicologiaTxt = "#5e2d10";
export function NeuropsicologiaIcon({ size = { base: "24px", md: "24px" } }: { size?: string | { base: string; md: string } }) {
  return (
    <Box
      as="svg"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 -960 960 960"
      fill={neuropsicologiaTxt}
      w={size}
      h={size}
    >
      <path d="M240-80v-172q-57-52-88.5-121.5T120-520q0-150 105-255t255-105q125 0 221.5 73.5T827-615l52 205q5 19-7 34.5T840-360h-80v120q0 33-23.5 56.5T680-160h-80v80h-80v-160h160v-200h108l-38-155q-23-91-98-148t-172-57q-116 0-198 81t-82 197q0 60 24.5 114t69.5 96l26 24v208h-80Zm254-360Zm-54 80h80l6-50q8-3 14.5-7t11.5-9l46 20 40-68-40-30q2-8 2-16t-2-16l40-30-40-68-46 20q-5-5-11.5-9t-14.5-7l-6-50h-80l-6 50q-8 3-14.5 7t-11.5 9l-46-20-40 68 40 30q-2 8-2 16t2 16l-40 30 40 68 46-20q5 5 11.5 9t14.5 7l6 50Zm-2.5-117.5Q420-495 420-520t17.5-42.5Q455-580 480-580t42.5 17.5Q540-545 540-520t-17.5 42.5Q505-460 480-460t-42.5-17.5Z"/>
    </Box>
  );
}
export const neuropsicologiaDescrip = "Entiende el porqué de tus hábitos diarios, de tus enfados, frustraciones y dolores, para transformarlos en el impulso que te libere del pasado."

// Astrología
export const astrologiaNom = "Astrología";
export const astrologiaBg = "#1e296b";
export const astrologiaTxt = "#feffe4";
export function AstrologiaIcon({ size = { base: "24px", md: "24px" } }: { size?: string | { base: string; md: string } }) {
  return (
    <Box
      as="svg"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 -960 960 960"
      fill={astrologiaTxt}
      w={size}
      h={size}
    >
      <path d="m354-287 126-76 126 77-33-144 111-96-146-13-58-136-58 135-146 13 111 97-33 143ZM233-120l65-281L80-590l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Zm457-560 21-89-71-59 94-8 36-84 36 84 94 8-71 59 21 89-80-47-80 47ZM480-481Z"/>
    </Box>
  );
}
export const astrologiaDescrip =  "Entiende los arquetipos que actúan en cada área de tu vida, comprende su propósito y utilízalos conscientemente para dejar de hacerte daño y de autosabotearte."

// TCM
export const tcmNom = "Medicina China";
export const tcmNomLink = "medicinachina";
export const tcmBg = "#6b0404";
export const tcmTxt = "#da7171";
export function TCMIcon({ size = { base: "24px", md: "24px" } }: { size?: string | { base: string; md: string } }) {
  return (
    <Box
      as="svg"
      xmlns="http://www.w3.org/2000/svg"
      w={size}
      h={size}
      viewBox="0 -960 960 960"
      fill={tcmTxt}
    >
      <path d="M440-120v-319q-64 0-123-24.5T213-533q-45-45-69-104t-24-123v-80h80q63 0 122 24.5T426-746q31 31 51.5 68t31.5 79q5-7 11-13.5t13-13.5q45-45 104-69.5T760-720h80v80q0 64-24.5 123T746-413q-45 45-103.5 69T520-320v200h-80Zm0-400q0-48-18.5-91.5T369-689q-34-34-77.5-52.5T200-760q0 48 18 92t52 78q34 34 78 52t92 18Zm80 120q48 0 91.5-18t77.5-52q34-34 52.5-78t18.5-92q-48 0-92 18.5T590-569q-34 34-52 77.5T520-400Z" />
    </Box>
  );
}
export const tcmDescrip = "Comprende el funcionamiento del ser humano y el origen de sus desequilibrios desde la medicina tradicional china y su visión taoísta."

// Nutrición
export const nutricionNom = "Nutrición";
export const nutricionBg = "#e4f8e1";
export const nutricionTxt = "#536a50";
export function NutricionIcon({ size = "24px"}) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" height={size ?? "24px"} viewBox="0 -960 960 960" width={size ?? "24px"} fill={nutricionTxt}><path d="M640-80q-100 0-170-70t-70-170q0-100 70-170t170-70q100 0 170 70t70 170q0 100-70 170T640-80Zm0-80q66 0 113-47t47-113q0-66-47-113t-113-47q-66 0-113 47t-47 113q0 66 47 113t113 47Zm-480 0q-33 0-56.5-23.5T80-240v-304q0-8 1.5-16t4.5-16l80-184h-6q-17 0-28.5-11.5T120-800v-40q0-17 11.5-28.5T160-880h280q17 0 28.5 11.5T480-840v40q0 17-11.5 28.5T440-760h-6l66 152q-19 10-36 21t-32 25l-84-198h-96l-92 216v304h170q5 21 13.5 41.5T364-160H160Zm480-440q-42 0-71-29t-29-71q0-42 29-71t71-29v200q0-42 29-71t71-29q42 0 71 29t29 71H640Z"/></svg>
  );
}
export const nutricionDescrip="Descubre qué hay más allá de los alimentos que consumimos cada día. Entiende, sin rodeos, por qué unos alimentos son saludables y otros pueden perjudicarnos, y toma las riendas de tu claridad mental transformando tu dieta.";

// Ayurveda
export const ayurvedaNom = "Ayúrveda";
export const ayurvedaBg = "#ecd5ed";
export const ayurvedaTxt = "#906891" ;
export function AyurvedaIcon({ size = "24px"}) {
  return (
   <svg xmlns="http://www.w3.org/2000/svg" height={size ?? "24px"} viewBox="0 -960 960 960" width={size ?? "24px"} fill={ayurvedaTxt}><path d="M272-160q-30 0-51-21t-21-51q0-21 12-39.5t32-26.5l156-62v-90q-54 63-125.5 96.5T120-320v-80q68 0 123.5-28T344-508l54-64q12-14 28-21t34-7h40q18 0 34 7t28 21l54 64q45 52 100.5 80T840-400v80q-83 0-154.5-33.5T560-450v90l156 62q20 8 32 26.5t12 39.5q0 30-21 51t-51 21H400v-20q0-26 17-43t43-17h120q9 0 14.5-5.5T600-260q0-9-5.5-14.5T580-280H460q-42 0-71 29t-29 71v20h-88Zm151.5-503.5Q400-687 400-720t23.5-56.5Q447-800 480-800t56.5 23.5Q560-753 560-720t-23.5 56.5Q513-640 480-640t-56.5-23.5Z"/></svg>
  );
}
export const ayurvedaDescrip= "Descubre, desde la sabiduría ancestral de Oriente, tu constitución y cómo influye en tu vida, tus gustos y tus desequilibrios.";

// Fitoterapia
export const fitoterapiaNom = "Fitoterapia";
export const fitoterapiaBg = "#0e590d";
export const fitoterapiaTxt = "#d5ffd5";
export function FitoterapiaIcon({ size = { base: "30px", md: "24px" }}) {
  return (
   <Box as="svg" xmlns="http://www.w3.org/2000/svg" height={size} viewBox="0 -960 960 960" width={size} fill={fitoterapiaTxt}><path d="m720-600-32 28q-14 13-33 13t-33-11q-14-11-19-28t1-36l16-50-34-20q-16-9-22.5-26t-1.5-34q5-17 20-26.5t34-9.5h40l12-38q6-19 20.5-30.5T720-880q17 0 31.5 11.5T772-838l12 38h40q19 0 33.5 9.5T878-764q7 18 0 35t-22 25l-36 20 16 50q6 19 1 36.5T818-570q-15 11-33.5 11T752-572l-32-28Zm28.5-91.5Q760-703 760-720t-11.5-28.5Q737-760 720-760t-28.5 11.5Q680-737 680-720t11.5 28.5Q703-680 720-680t28.5-11.5ZM552-244q23 60-15 112T430-80q-33 0-62.5-17T324-142q-83 12-137.5-42.5T142-324q-30-17-46-46.5T80-438q0-61 55.5-98.5T244-552l62 26q20-31 53-50.5t71-21.5v-82h60v90q37 11 61 34.5t41 65.5h88v60h-82q-2 38-20.5 71T528-306l24 62Zm-248 24q0-27 4.5-52.5T322-322q-23 11-49.5 15.5T220-304q0 39 22.5 61.5T304-220Zm-74-164q32 0 56.5-8t63.5-32l-120-50q-29-12-49.5.5T160-434q0 26 17 38t53 12Zm200 224q25 0 40.5-17.5T478-214l-54-136q-19 32-29.5 64T384-228q0 33 11.5 50.5T430-160Zm66-222q10-10 16-26.5t6-34.5q0-32-21-54t-52-22q-18 0-34 6t-27 17l78 36 34 78Zm-174 60Z"/></Box>
  );
}
export function FitoterapiaIconOscuro({ size = { base: "30px", md: "34px" }}) {
  return (
   <Box as="svg" xmlns="http://www.w3.org/2000/svg" height={size} viewBox="0 -960 960 960" width={size} fill={fitoterapiaBg}><path d="m720-600-32 28q-14 13-33 13t-33-11q-14-11-19-28t1-36l16-50-34-20q-16-9-22.5-26t-1.5-34q5-17 20-26.5t34-9.5h40l12-38q6-19 20.5-30.5T720-880q17 0 31.5 11.5T772-838l12 38h40q19 0 33.5 9.5T878-764q7 18 0 35t-22 25l-36 20 16 50q6 19 1 36.5T818-570q-15 11-33.5 11T752-572l-32-28Zm28.5-91.5Q760-703 760-720t-11.5-28.5Q737-760 720-760t-28.5 11.5Q680-737 680-720t11.5 28.5Q703-680 720-680t28.5-11.5ZM552-244q23 60-15 112T430-80q-33 0-62.5-17T324-142q-83 12-137.5-42.5T142-324q-30-17-46-46.5T80-438q0-61 55.5-98.5T244-552l62 26q20-31 53-50.5t71-21.5v-82h60v90q37 11 61 34.5t41 65.5h88v60h-82q-2 38-20.5 71T528-306l24 62Zm-248 24q0-27 4.5-52.5T322-322q-23 11-49.5 15.5T220-304q0 39 22.5 61.5T304-220Zm-74-164q32 0 56.5-8t63.5-32l-120-50q-29-12-49.5.5T160-434q0 26 17 38t53 12Zm200 224q25 0 40.5-17.5T478-214l-54-136q-19 32-29.5 64T384-228q0 33 11.5 50.5T430-160Zm66-222q10-10 16-26.5t6-34.5q0-32-21-54t-52-22q-18 0-34 6t-27 17l78 36 34 78Zm-174 60Z"/></Box>
  );
}
export const fitoterapiaDescrip="Explora el poder de las plantas medicinales y comprende cómo la Madre Tierra nos acompaña y nos cuida, si se lo permitimos.";

// Cábala
export const cabalaNom = "Cábala";
export const cabalaBg = "#593d25";
export const cabalaTxt = "#cb8e59";
export function CabalaIcon({ size = { base: "24px", md: "24px" } }: { size?: string | { base: string; md: string } }) {
  return (
    <Box
      as="svg"
      xmlns="http://www.w3.org/2000/svg"
      w={size}
      h={size}
      viewBox="0 -960 960 960"
      fill={cabalaTxt}
    >
      <path d="M240-160h480q17 0 28.5-11.5T760-200H200q0 17 11.5 28.5T240-160Zm160-513.5Q368-707 370-755q2-52 36.5-91.5T480-920q39 34 73.5 73.5T590-755q2 48-30 81.5T480-640q-48 0-80-33.5ZM440-280h80v-240h-80v240Zm61.5-449q8.5-9 8.5-22 0-17-9.5-31T480-809q-11 13-20.5 27t-9.5 31q0 13 8.5 22t21.5 9q13 0 21.5-9Zm330 440.5Q840-297 840-310t-8.5-21.5Q823-340 810-340t-21.5 8.5Q780-323 780-310t8.5 21.5Q797-280 810-280t21.5-8.5ZM720-80H240q-50 0-85-35t-35-85v-80h240v-240q0-33 23.5-56.5T440-600h80q33 0 56.5 23.5T600-520v240h104q-2-8-3-15t-1-15q0-46 32-78t78-32q46 0 78 32t32 78q0 38-22.5 67T840-204v4q0 50-35 85t-85 35Zm-240-80Zm-40-120h80-80Zm40-484Z"/>
    </Box>
  );
}
export const cabalaDescrip="Explora la sabiduría de la Cábala y descubre qué te desequilibra para transformarlo y vivir desde la conexión con tu esencia.";

// Espacio personal
export function EspacioPersonalIcon({ color = "white", size = "50px", shadow = true }) {
  return (
    <Box
      as="svg"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 -960 960 960"
      width={size}
      height={size}
      fill={color}
      style={ shadow == true ? {
        filter: "drop-shadow(4px 4px 6px rgba(0,0,0,0.5))"
      } : {filter:""}}
    >
      <path d="M480-240Zm-320 80v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440h14q-11 18-16.5 38.5T472-360q-54 1-107.5 14.5T260-306q-9 5-14.5 14t-5.5 20v32h283l80 80H160Zm207-367q-47-47-47-113t47-113q47-47 113-47t113 47q47 47 47 113t-47 113q-47 47-113 47t-113-47Zm169.5-56.5Q560-607 560-640t-23.5-56.5Q513-720 480-720t-56.5 23.5Q400-673 400-640t23.5 56.5Q447-560 480-560t56.5-23.5ZM480-640Zm236 480L576-300q-13-13-18.5-28t-5.5-30q0-32 23-57t59-25q28 0 44 13t38 35q20-20 36.5-34t45.5-14q37 0 59.5 25.5T880-357q0 15-6 30t-18 27L716-160Z"/>
    </Box>
  );
}

// Aprendizaje
export function AprendizajeIcon({ color = "white", size = "50px", shadow = true }) {
  return (
    <Box
      as="svg"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 -960 960 960"
      width={size}
      height={size}
      fill={color}
      style={ shadow == true ? {
        filter: "drop-shadow(4px 4px 6px rgba(0,0,0,0.5))"
      } : {filter:""}}
    >
      <path d="M440-278v-394q-41-24-87-36t-93-12q-36 0-71.5 7T120-692v396q35-12 69.5-18t70.5-6q47 0 91.5 10.5T440-278Zm40 118q-48-38-104-59t-116-21q-42 0-82.5 11T100-198q-21 11-40.5-1T40-234v-482q0-11 5.5-21T62-752q46-24 96-36t102-12q74 0 126 17t112 52q11 6 16.5 14t5.5 21v418q44-21 88.5-31.5T700-320q36 0 70.5 6t69.5 18v-481q15 5 29.5 11t28.5 14q11 5 16.5 15t5.5 21v482q0 23-19.5 35t-40.5 1q-37-20-77.5-31T700-240q-60 0-116 21t-104 59Zm140-240v-440l120-40v440l-120 40Zm-340-99Z"/>
    </Box>
  );
}

// VIEW OR NOT
export function NotViewIcon({ size = "24px"}) {
  return (
   <svg xmlns="http://www.w3.org/2000/svg" height={size ?? "24px"} viewBox="0 -960 960 960" width={size ?? "24px"} fill="#cd0404"><path d="M296-270h75l107-164 108 164h78L519-488l133-202h-75l-98 152-98-152h-77l135 203-143 217Zm28 158.5Q251-143 197-197t-85.5-127Q80-397 80-480t31.5-156Q143-709 197-763t127-85.5Q397-880 480-880t156 31.5Q709-817 763-763t85.5 127Q880-563 880-480t-31.5 156Q817-251 763-197t-127 85.5Q563-80 480-80t-156-31.5ZM480-160q133 0 226.5-93.5T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160Zm0-320Z"/></svg>
  );
}

export function ViewIcon({ size = "24px"}) {
  return (
   <svg xmlns="http://www.w3.org/2000/svg" height={size ?? "24px"} viewBox="0 -960 960 960" width={size ?? "24px"} fill="#0c8710"><path d="m424-296 282-282-56-56-226 226-114-114-56 56 170 170Zm56 216q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>
  );
}

// #region tcm

export function DiagnosticoIcon({ size = { base: "24px", md: "24px" } }) {
  return (
    <Box
      as="svg"
      viewBox="0 -960 960 960"
      w={size}
      h={size}              
      fill={tcmTxt}                    
    >
      <path d="M343.5-743.5Q320-767 320-800t23.5-56.5Q367-880 400-880t56.5 23.5Q480-833 480-800t-23.5 56.5Q433-720 400-720t-56.5-23.5ZM731-269q29-29 29-71t-29-71q-29-29-71-29t-71 29q-29 29-29 71t29 71q29 29 71 29t71-29ZM864-80 756-188q-22 14-46 21t-50 7q-75 0-127.5-52.5T480-340q0-75 52.5-127.5T660-520q75 0 127.5 52.5T840-340q0 26-7 50t-21 46l108 108-56 56Zm-424 0v-121q15 24 35.5 44t44.5 36v41h-80Zm-160 0v-520q-61-5-121-14.5T40-640l20-80q84 23 168.5 31.5T400-680q87 0 171.5-8.5T740-720l20 80q-59 16-119 25.5T520-600v41q-54 35-87 92.5T400-340v10q0 5 1 10h-41v240h-80Z"/>
    </Box>
  );
}

export function CincoElementosIcon({ size = { base: "24px", md: "24px" } }) {
  return (
    <Box
      as="svg"
      viewBox="0 -960 960 960"
      w={size}
      h={size}              
      fill={tcmTxt}                    
    >
     <path d="M852-212 732-332l56-56 120 120-56 56ZM708-692l-56-56 120-120 56 56-120 120Zm-456 0L132-812l56-56 120 120-56 56ZM108-212l-56-56 120-120 56 56-120 120Zm246-75 126-76 126 77-33-144 111-96-146-13-58-136-58 135-146 13 111 97-33 143ZM233-120l65-281L80-590l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Zm247-361Z"/>
    </Box>
  );
}

export function MouthIcon({ size = { base: "24px", md: "24px" } }) {
  return (
    <Box
      as="svg"
      viewBox="0 -960 960 960"
      w={size}
      h={size}              
      fill={tcmTxt}                    
    >
     <path d="M454-280h52q108 0 176.5-47T805-452q-60 18-146 35t-179 17q-93 0-178.5-17.5T156-452q54 78 122 125t176 47Zm0 80q-147 0-262-89T40-520l202-202q17-17 38.5-27.5T326-760q18 0 35.5 6.5T394-737l86 57 86-57q15-10 32.5-16.5T634-760q24 0 45.5 10.5T718-722l202 202q-37 142-152 231t-262 89h-52Zm27-280q91 0 174.5-18T795-533L662-666q-6-6-13.5-9t-15.5-3q-6 0-11.5 1.5T611-671l-131 87-130-87q-5-4-10.5-5.5T328-678q-8 0-15.5 3t-13.5 9L167-533q55 17 139 35t175 18Z"/>
    </Box>
  );
}


export function LifestyleIcon({ size = { base: "24px", md: "24px" } }) {
  return (
    <Box
      as="svg"
      viewBox="0 -960 960 960"
      w={size}
      h={size}              
      fill={tcmTxt}                    
    >
     <path d="M480-80q-73-9-145-39.5T206.5-207Q150-264 115-351T80-560v-40h40q51 0 105 13t101 39q12-86 54.5-176.5T480-880q57 65 99.5 155.5T634-548q47-26 101-39t105-13h40v40q0 122-35 209t-91.5 144q-56.5 57-128 87.5T480-80Zm-2-82q-11-166-98.5-251T162-518q11 171 101.5 255T478-162Zm2-254q15-22 36.5-45.5T558-502q-2-57-22.5-119T480-742q-35 59-55.5 121T402-502q20 17 42 40.5t36 45.5Zm78 236q37-12 77-35t74.5-62.5q34.5-39.5 59-98.5T798-518q-94 14-165 62.5T524-332q12 32 20.5 70t13.5 82Zm-78-236Zm78 236Zm-80 18Zm46-170ZM480-80Z"/>
    </Box>
  );
}

export function RecursosIconTCM({ size = { base: "24px", md: "24px" } }) {
  return (
    <Box
      as="svg"
      viewBox="0 -960 960 960"
      w={size}
      h={size}              
      fill={tcmTxt}                    
    >
      <path d="M270-80q-45 0-77.5-30.5T160-186v-558q0-38 23.5-68t61.5-38l395-78v640l-379 76q-9 2-15 9.5t-6 16.5q0 11 9 18.5t21 7.5h450v-640h80v720H270Zm90-233 200-39v-478l-200 39v478Zm-80 16v-478l-15 3q-11 2-18 9.5t-7 18.5v457q5-2 10.5-3.5T261-293l19-4Zm-40-472v482-482Z"/>
    </Box>
  );
}

export function PlantasIcon({ size = { base: "24px", md: "24px" } }) {
  return (
    <Box
      as="svg"
      viewBox="0 -960 960 960"
      w={size}
      h={size}
      fill={fitoterapiaTxt}
    >
      <path d="M80-160v-80h230q-22-85-83.5-146.5T80-470q20-5 39.5-7.5T160-480q134 0 227 93t93 227H80Zm480 0q0-42-9-83.5T525-323q42-71 114.5-114T800-480q21 0 40.5 2.5T880-470q-85 22-146 83.5T650-240h230v80H560Zm-80-239q0-65 24-122t66-100.5q42-43.5 98.5-69.5T789-719q-56 35-98 86t-65 114q-44 21-80.5 51.5T480-399Zm-73-75q-12-9-24-17t-25-16q0-6 1-12.5t1-12.5q0-76-24-144t-68-124q66 27 114.5 77.5T457-606q-18 30-31 63.5T407-474Z"/>
    </Box>
  );
}

export function RecursosIconFitoterpia({ size = { base: "24px", md: "24px" } }) {
  return (
    <Box
      as="svg"
      viewBox="0 -960 960 960"
      w={size}
      h={size}              
      fill={fitoterapiaTxt}                    
    >
      <path d="M270-80q-45 0-77.5-30.5T160-186v-558q0-38 23.5-68t61.5-38l395-78v640l-379 76q-9 2-15 9.5t-6 16.5q0 11 9 18.5t21 7.5h450v-640h80v720H270Zm90-233 200-39v-478l-200 39v478Zm-80 16v-478l-15 3q-11 2-18 9.5t-7 18.5v457q5-2 10.5-3.5T261-293l19-4Zm-40-472v482-482Z"/>
    </Box>
  );
}

export function RecursosIconCabala({ size = { base: "24px", md: "24px" } }) {
  return (
    <Box
      as="svg"
      viewBox="0 -960 960 960"
      w={size}
      h={size}              
      fill={fitoterapiaTxt}                    
    >
      <path d="M270-80q-45 0-77.5-30.5T160-186v-558q0-38 23.5-68t61.5-38l395-78v640l-379 76q-9 2-15 9.5t-6 16.5q0 11 9 18.5t21 7.5h450v-640h80v720H270Zm90-233 200-39v-478l-200 39v478Zm-80 16v-478l-15 3q-11 2-18 9.5t-7 18.5v457q5-2 10.5-3.5T261-293l19-4Zm-40-472v482-482Z"/>
    </Box>
  );
}


// #region np 

export function MadreIcon({ size = { base: "24px", md: "24px" } }) {
  return (
    <Box
      as="svg"
      viewBox="0 -960 960 960"
      w={size}
      h={size}              
      fill={neuropsicologiaTxt}                    
    >
      <path d="M477-80q-42 0-81.5-9T324-112q-46-20-75-48.5T220-224v-231q0-31 23.5-57t60.5-46q38-20 83.5-31t92.5-11q47 0 92.5 11t83.5 31q38 20 61 46t23 57v231q0 17-7.5 33T711-161q-14 14-32.5 26.5T637-112q1-5 3-28 0-58-41-99t-99-41q-43 0-76 23t-50 59q32 8 58.5 11t46.5 3q17 0 27.5-1t13.5-1v104q-11 1-21.5 1.5T477-80Zm123-220q33 0 56.5-23.5T680-380q0-33-23.5-56.5T600-460q-33 0-56.5 23.5T520-380q0 33 23.5 56.5T600-300ZM480-640q50 0 85-34.5t35-85.5q0-50-35-85t-85-35q-51 0-85.5 35T360-760q0 51 34.5 85.5T480-640Z"/>
    </Box>
  );
}

export function FamilyIcon({ size = { base: "24px", md: "24px" } }) {
  return (
    <Box
      as="svg"
      viewBox="0 -960 960 960"
      w={size}
      h={size}              
      fill={neuropsicologiaTxt}                    
    >
      <path d="M720-720q-33 0-56.5-23.5T640-800q0-33 23.5-56.5T720-880q33 0 56.5 23.5T800-800q0 33-23.5 56.5T720-720ZM680-80v-320q0-40-20.5-72T607-522l35-103q8-25 29.5-40t48.5-15q27 0 48.5 15t29.5 40l102 305H800v240H680ZM457.5-517.5Q440-535 440-560t17.5-42.5Q475-620 500-620t42.5 17.5Q560-585 560-560t-17.5 42.5Q525-500 500-500t-42.5-17.5ZM220-720q-33 0-56.5-23.5T140-800q0-33 23.5-56.5T220-880q33 0 56.5 23.5T300-800q0 33-23.5 56.5T220-720ZM140-80v-280H80v-240q0-33 23.5-56.5T160-680h120q33 0 56.5 23.5T360-600v240h-60v280H140Zm300 0v-160h-40v-160q0-25 17.5-42.5T460-460h80q25 0 42.5 17.5T600-400v160h-40v160H440Z"/>
    </Box>
  );
}

export function ChildIcon({ size = { base: "24px", md: "24px" } }) {
  return (
    <Box
      as="svg"
      viewBox="0 -960 960 960"
      w={size}
      h={size}           
      fill={neuropsicologiaTxt}                    
    >
      <path d="M430.5-680.5Q410-701 410-730t20.5-49.5Q451-800 480-800t49.5 20.5Q550-759 550-730t-20.5 49.5Q509-660 480-660t-49.5-20.5ZM400-160v-200h-40v-180q0-33 23.5-56.5T440-620h80q33 0 56.5 23.5T600-540v180h-40v200H400Z"/>
    </Box>
  );
}

export function AdultIcon({ size = { base: "24px", md: "24px" } }) {
  return (
    <Box
      as="svg"
      viewBox="0 -960 960 960"
      w={size}
      h={size}           
      fill={neuropsicologiaTxt}                    
    >
     <path d="M400-80v-280h-80v-240q0-33 23.5-56.5T400-680h160q33 0 56.5 23.5T640-600v240h-80v280H400Zm80-640q-33 0-56.5-23.5T400-800q0-33 23.5-56.5T480-880q33 0 56.5 23.5T560-800q0 33-23.5 56.5T480-720Z"/>
    </Box>
  );
}


export function ChildhoodIcon({ size = { base: "24px", md: "24px" } }) {
  return (
    <Box
      as="svg"
      viewBox="0 -960 960 960"
      w={size}
      h={size}           
      fill={neuropsicologiaTxt}                    
    >
      <path d="M203.5-743.5Q180-767 180-800t23.5-56.5Q227-880 260-880t56.5 23.5Q340-833 340-800t-23.5 56.5Q293-720 260-720t-56.5-23.5ZM680-520q-25 0-42.5-17.5T620-580q0-25 17.5-42.5T680-640q25 0 42.5 17.5T740-580q0 25-17.5 42.5T680-520ZM180-80v-280h-60v-240q0-33 23.5-56.5T200-680h120q22 0 40 10.5t29 29.5l143 247 41-61q8-12 21.5-19t28.5-7h117q25 0 42.5 17.5T800-420v140h-40v200H600v-284l-31 44h-88L380-496v416H180Z"/>
 </Box>
  );
}

export function CoupleIcon({ size = { base: "24px", md: "24px" } }) {
  return (
    <Box
      as="svg"
      viewBox="0 -960 960 960"
      w={size}
      h={size}           
      fill={neuropsicologiaTxt}                    
    >
      <path d="M40-120v-160q0-34 23.5-57t56.5-23h131q20 0 38 10t29 27q29 39 71.5 61t90.5 22q49 0 91.5-22t70.5-61q13-17 30.5-27t36.5-10h131q34 0 57 23t23 57v160H640v-91q-35 25-75.5 38T480-160q-43 0-84-13.5T320-212v92H40Zm120-280q-50 0-85-35t-35-85q0-51 35-85.5t85-34.5q51 0 85.5 34.5T280-520q0 50-34.5 85T160-400Zm640 0q-50 0-85-35t-35-85q0-51 35-85.5t85-34.5q51 0 85.5 34.5T920-520q0 50-34.5 85T800-400Zm-320-80q-68-62-111-104.5T302-658q-24-31-33-54.5t-9-47.5q0-50 35-85t86-35q28 0 54 12.5t45 33.5q19-21 45-33.5t54-12.5q51 0 86 35t35 85q0 24-9 47.5T658-658q-24 31-67 73.5T480-480Zm0-108q72-66 106-107.5t34-64.5q0-17-12-28.5T579-800q-12 0-23.5 7T532-772l-51 59-51-57q-14-16-25.5-23t-23.5-7q-17 0-29 11.5T340-760q0 23 34 64.5T480-588Zm0 0Z"/>
    </Box>
  );
}

export function FriendsIcon({ size = { base: "24px", md: "24px" } }) {
  return (
    <Box
      as="svg"
      viewBox="0 -960 960 960"
      w={size}
      h={size}           
      fill={neuropsicologiaTxt}                    
    >
      <path d="M40-160v-160q0-34 23.5-57t56.5-23h131q20 0 38 10t29 27q29 39 71.5 61t90.5 22q49 0 91.5-22t70.5-61q13-17 30.5-27t36.5-10h131q34 0 57 23t23 57v160H640v-91q-35 25-75.5 38T480-200q-43 0-84-13.5T320-252v92H40Zm440-160q-38 0-72-17.5T351-386q-17-25-42.5-39.5T253-440q22-37 93-58.5T480-520q63 0 134 21.5t93 58.5q-29 0-55 14.5T609-386q-22 32-56 49t-73 17ZM160-440q-50 0-85-35t-35-85q0-51 35-85.5t85-34.5q51 0 85.5 34.5T280-560q0 50-34.5 85T160-440Zm640 0q-50 0-85-35t-35-85q0-51 35-85.5t85-34.5q51 0 85.5 34.5T920-560q0 50-34.5 85T800-440ZM480-560q-50 0-85-35t-35-85q0-51 35-85.5t85-34.5q51 0 85.5 34.5T600-680q0 50-34.5 85T480-560Z"/>
  </Box>
  );
}

// HELP
export function HelpIcon({ size = { base: "24px", md: "24px" },  color = "black"}) {
  return (
    <Box
      as="svg"
      viewBox="0 -960 960 960"
      w={size}
      h={size}           
      fill={color}                    
    >
      <path d="M640-440 474-602q-31-30-52.5-66.5T400-748q0-55 38.5-93.5T532-880q32 0 60 13.5t48 36.5q20-23 48-36.5t60-13.5q55 0 93.5 38.5T880-748q0 43-21 79.5T807-602L640-440Zm0-112 109-107q19-19 35-40.5t16-48.5q0-22-15-37t-37-15q-14 0-26.5 5.5T700-778l-60 72-60-72q-9-11-21.5-16.5T532-800q-22 0-37 15t-15 37q0 27 16 48.5t35 40.5l109 107ZM280-220l278 76 238-74q-5-9-14.5-15.5T760-240H558q-27 0-43-2t-33-8l-93-31 22-78 81 27q17 5 40 8t68 4q0-11-6.5-21T578-354l-234-86h-64v220ZM40-80v-440h304q7 0 14 1.5t13 3.5l235 87q33 12 53.5 42t20.5 66h80q50 0 85 33t35 87v40L560-60l-280-78v58H40Zm80-80h80v-280h-80v280Zm520-546Z"/> 
    </Box>
  );
}

// #region astro
//SUN
export function SunIcon({ size = { base: "24px", md: "24px" }}) {
  return (
    <Box
      as="svg"
      viewBox="0 -960 960 960"
      w={size}
      h={size}           
      fill={astrologiaTxt}                    
    >
      <path d="M440-760v-160h80v160h-80Zm266 110-55-55 112-115 56 57-113 113Zm54 210v-80h160v80H760ZM440-40v-160h80v160h-80ZM254-652 140-763l57-56 113 113-56 54Zm508 512L651-255l54-54 114 110-57 59ZM40-440v-80h160v80H40Zm157 300-56-57 112-112 29 27 29 28-114 114Zm113-170q-70-70-70-170t70-170q70-70 170-70t170 70q70 70 70 170t-70 170q-70 70-170 70t-170-70Zm283-57q47-47 47-113t-47-113q-47-47-113-47t-113 47q-47 47-47 113t47 113q47 47 113 47t113-47ZM480-480Z"/>  
    </Box>
  );
}

export function MoonIcon({ size = { base: "24px", md: "24px" }}) {
  return (
    <Box
      as="svg"
      viewBox="0 -960 960 960"
      w={size}
      h={size}           
      fill={astrologiaTxt}                    
    >
      <path d="M560-80q-82 0-155-31.5t-127.5-86Q223-252 191.5-325T160-480.5q0-82.5 31.5-155t86-127Q332-817 405-848.5T560-880q54 0 105 14t95 40q-91 53-145.5 143.5T560-480q0 112 54.5 202.5T760-134q-44 26-95 40T560-80Zm0-80h21q10 0 19-2-57-66-88.5-147.5T480-480q0-89 31.5-170.5T600-798q-9-2-19-2h-21q-133 0-226.5 93.5T240-480q0 133 93.5 226.5T560-160Zm-80-320Z"/>
     </Box>
  );
}

export function AscendenteIcon({ size = { base: "24px", md: "24px" }}) {
  return (
    <Box
      as="svg"
      viewBox="0 -960 960 960"
      w={size}
      h={size}           
      fill={astrologiaTxt}                    
    >
      <path d="M240-120v-240q0-33 23.5-56.5T320-440h320v-248l-64 64-56-56 160-160 160 160-56 56-64-64v248q0 33-23.5 56.5T640-360H320v240h-80Z"/>
    </Box>
  );
}



