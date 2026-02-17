'use client';

import { Box } from "@chakra-ui/react";
import React from "react";

export const API_URL = "http://localhost:3000";

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

// Neuropsicología
export const neuropsicologiaNom = "Neuropsicología";
export const neuropsicologiaBg = "#daa889";
export const neuropsicologiaTxt = "#5e2d10";
export function NeuropsicologiaIcon({ size = "24px"}) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" height={size ?? "24px"} viewBox="0 -960 960 960" width={size ?? "24px"} fill={neuropsicologiaTxt}><path d="M240-80v-172q-57-52-88.5-121.5T120-520q0-150 105-255t255-105q125 0 221.5 73.5T827-615l52 205q5 19-7 34.5T840-360h-80v120q0 33-23.5 56.5T680-160h-80v80h-80v-160h160v-200h108l-38-155q-23-91-98-148t-172-57q-116 0-198 81t-82 197q0 60 24.5 114t69.5 96l26 24v208h-80Zm254-360Zm-54 80h80l6-50q8-3 14.5-7t11.5-9l46 20 40-68-40-30q2-8 2-16t-2-16l40-30-40-68-46 20q-5-5-11.5-9t-14.5-7l-6-50h-80l-6 50q-8 3-14.5 7t-11.5 9l-46-20-40 68 40 30q-2 8-2 16t2 16l-40 30 40 68 46-20q5 5 11.5 9t14.5 7l6 50Zm-2.5-117.5Q420-495 420-520t17.5-42.5Q455-580 480-580t42.5 17.5Q540-545 540-520t-17.5 42.5Q505-460 480-460t-42.5-17.5Z"/></svg>
  );
}

// Astrología
export const astrologiaNom = "Astrología";
export const astrologiaBg = "#1e296b";
export const astrologiaTxt = "#feffe4";
export function AstrologiaIcon({ size = "24px"}) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" height={size ?? "24px"} viewBox="0 -960 960 960" width={size ?? "24px"} fill={astrologiaTxt}><path d="m354-287 126-76 126 77-33-144 111-96-146-13-58-136-58 135-146 13 111 97-33 143ZM233-120l65-281L80-590l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Zm457-560 21-89-71-59 94-8 36-84 36 84 94 8-71 59 21 89-80-47-80 47ZM480-481Z"/></svg>
  );
}

// TCM
export const tcmNom = "Medicina China";
export const tcmBg = "#6b0404";
export const tcmTxt = "#da7171";
export function TCMIcon({ size = "24px"}) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" height={size ?? "24px"} viewBox="0 -960 960 960" width={size ?? "24px"} fill={tcmTxt}><path d="M440-120v-319q-64 0-123-24.5T213-533q-45-45-69-104t-24-123v-80h80q63 0 122 24.5T426-746q31 31 51.5 68t31.5 79q5-7 11-13.5t13-13.5q45-45 104-69.5T760-720h80v80q0 64-24.5 123T746-413q-45 45-103.5 69T520-320v200h-80Zm0-400q0-48-18.5-91.5T369-689q-34-34-77.5-52.5T200-760q0 48 18 92t52 78q34 34 78 52t92 18Zm80 120q48 0 91.5-18t77.5-52q34-34 52.5-78t18.5-92q-48 0-92 18.5T590-569q-34 34-52 77.5T520-400Zm0 0Zm-80-120Z"/></svg>
  );
}

// Nutrición
export const nutricionNom = "Nutrición";
export const nutricionBg = "#e4f8e1";
export const nutricionTxt = "#536a50";
export function NutricionIcon({ size = "24px"}) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" height={size ?? "24px"} viewBox="0 -960 960 960" width={size ?? "24px"} fill={nutricionTxt}><path d="M640-80q-100 0-170-70t-70-170q0-100 70-170t170-70q100 0 170 70t70 170q0 100-70 170T640-80Zm0-80q66 0 113-47t47-113q0-66-47-113t-113-47q-66 0-113 47t-47 113q0 66 47 113t113 47Zm-480 0q-33 0-56.5-23.5T80-240v-304q0-8 1.5-16t4.5-16l80-184h-6q-17 0-28.5-11.5T120-800v-40q0-17 11.5-28.5T160-880h280q17 0 28.5 11.5T480-840v40q0 17-11.5 28.5T440-760h-6l66 152q-19 10-36 21t-32 25l-84-198h-96l-92 216v304h170q5 21 13.5 41.5T364-160H160Zm480-440q-42 0-71-29t-29-71q0-42 29-71t71-29v200q0-42 29-71t71-29q42 0 71 29t29 71H640Z"/></svg>
  );
}

// Ayurveda
export const ayurvedaNom = "Ayúrveda";
export const ayurvedaBg = "#ecd5ed";
export const ayurvedaTxt = "#906891";
export function AyurvedaIcon({ size = "24px"}) {
  return (
   <svg xmlns="http://www.w3.org/2000/svg" height={size ?? "24px"} viewBox="0 -960 960 960" width={size ?? "24px"} fill={ayurvedaTxt}><path d="M272-160q-30 0-51-21t-21-51q0-21 12-39.5t32-26.5l156-62v-90q-54 63-125.5 96.5T120-320v-80q68 0 123.5-28T344-508l54-64q12-14 28-21t34-7h40q18 0 34 7t28 21l54 64q45 52 100.5 80T840-400v80q-83 0-154.5-33.5T560-450v90l156 62q20 8 32 26.5t12 39.5q0 30-21 51t-51 21H400v-20q0-26 17-43t43-17h120q9 0 14.5-5.5T600-260q0-9-5.5-14.5T580-280H460q-42 0-71 29t-29 71v20h-88Zm151.5-503.5Q400-687 400-720t23.5-56.5Q447-800 480-800t56.5 23.5Q560-753 560-720t-23.5 56.5Q513-640 480-640t-56.5-23.5Z"/></svg>
  );
}

// Fitoterapia
export const biologiaNom = "Fitoterapia";
export const biologiaBg = "#0e590d";
export const biologiaTxt = "#d5ffd5";
export function BiologiaIcon({ size = "24px"}) {
  return (
   <svg xmlns="http://www.w3.org/2000/svg" height={size ?? "30px"} viewBox="0 -960 960 960" width={size ?? "30px"} fill={biologiaTxt}><path d="m720-600-32 28q-14 13-33 13t-33-11q-14-11-19-28t1-36l16-50-34-20q-16-9-22.5-26t-1.5-34q5-17 20-26.5t34-9.5h40l12-38q6-19 20.5-30.5T720-880q17 0 31.5 11.5T772-838l12 38h40q19 0 33.5 9.5T878-764q7 18 0 35t-22 25l-36 20 16 50q6 19 1 36.5T818-570q-15 11-33.5 11T752-572l-32-28Zm28.5-91.5Q760-703 760-720t-11.5-28.5Q737-760 720-760t-28.5 11.5Q680-737 680-720t11.5 28.5Q703-680 720-680t28.5-11.5ZM552-244q23 60-15 112T430-80q-33 0-62.5-17T324-142q-83 12-137.5-42.5T142-324q-30-17-46-46.5T80-438q0-61 55.5-98.5T244-552l62 26q20-31 53-50.5t71-21.5v-82h60v90q37 11 61 34.5t41 65.5h88v60h-82q-2 38-20.5 71T528-306l24 62Zm-248 24q0-27 4.5-52.5T322-322q-23 11-49.5 15.5T220-304q0 39 22.5 61.5T304-220Zm-74-164q32 0 56.5-8t63.5-32l-120-50q-29-12-49.5.5T160-434q0 26 17 38t53 12Zm200 224q25 0 40.5-17.5T478-214l-54-136q-19 32-29.5 64T384-228q0 33 11.5 50.5T430-160Zm66-222q10-10 16-26.5t6-34.5q0-32-21-54t-52-22q-18 0-34 6t-27 17l78 36 34 78Zm-174 60Z"/></svg>
  );
}

// Cábala
export const cabalaNom = "Cábala";
export const cabalaBg = "#593d25";
export const cabalaTxt = "#cb8e59";
export function CabalaIcon({ size = "24px"}) {
  return (
   <svg xmlns="http://www.w3.org/2000/svg" height={size ?? "24px"} viewBox="0 -960 960 960" width={size ?? "24px"} fill={cabalaTxt}><path d="M240-160h480q17 0 28.5-11.5T760-200H200q0 17 11.5 28.5T240-160Zm160-513.5Q368-707 370-755q2-52 36.5-91.5T480-920q39 34 73.5 73.5T590-755q2 48-30 81.5T480-640q-48 0-80-33.5ZM440-280h80v-240h-80v240Zm61.5-449q8.5-9 8.5-22 0-17-9.5-31T480-809q-11 13-20.5 27t-9.5 31q0 13 8.5 22t21.5 9q13 0 21.5-9Zm330 440.5Q840-297 840-310t-8.5-21.5Q823-340 810-340t-21.5 8.5Q780-323 780-310t8.5 21.5Q797-280 810-280t21.5-8.5ZM720-80H240q-50 0-85-35t-35-85v-80h240v-240q0-33 23.5-56.5T440-600h80q33 0 56.5 23.5T600-520v240h104q-2-8-3-15t-1-15q0-46 32-78t78-32q46 0 78 32t32 78q0 38-22.5 67T840-204v4q0 50-35 85t-85 35Zm-240-80Zm-40-120h80-80Zm40-484Z"/></svg>
  );
}

// Espacio personal
export function EspacioPersonalIcon({ color = "white", size = "50px"}) {
  return (
    <Box
      as="svg"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 -960 960 960"
      width={size}
      height={size}
      fill={color}
    >
      <path d="M480-240Zm-320 80v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440h14q-11 18-16.5 38.5T472-360q-54 1-107.5 14.5T260-306q-9 5-14.5 14t-5.5 20v32h283l80 80H160Zm207-367q-47-47-47-113t47-113q47-47 113-47t113 47q47 47 47 113t-47 113q-47 47-113 47t-113-47Zm169.5-56.5Q560-607 560-640t-23.5-56.5Q513-720 480-720t-56.5 23.5Q400-673 400-640t23.5 56.5Q447-560 480-560t56.5-23.5ZM480-640Zm236 480L576-300q-13-13-18.5-28t-5.5-30q0-32 23-57t59-25q28 0 44 13t38 35q20-20 36.5-34t45.5-14q37 0 59.5 25.5T880-357q0 15-6 30t-18 27L716-160Z"/>
    </Box>
  );
}

// Aprendizaje
export function AprendizajeIcon({ color = "white", size = "50px"}) {
  return (
    <Box
      as="svg"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 -960 960 960"
      width={size}
      height={size}
      fill={color}
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



