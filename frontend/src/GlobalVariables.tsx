'use client';

import { Box } from "@chakra-ui/react";
import React from "react";

export const API_URL =  "http://localhost:3000"; //"https://life-as-a-privilege.onrender.com"; //

// COLORES
export const turquesa = "#48C0B5";

// Fisiología
export const fisiologiaNom = "Fisiología";
export const  fisiologiaTxt= "#c8b5d1";
export const  fisiologiaBg = "#331c35";
export function FisiologiaIcon({ size = { base: "24px", md: "24px" } }: { size?: string | { base: string; md: string } })  {
  return (
    <Box
      as="svg"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 -960 960 960"
      fill={fisiologiaTxt}
      w={size}
      h={size}
    >
      <path d="m316-240 76-364-72 28v96h-80v-148l202-85q14-6 29.5-7.5T501-717q14 5 26.5 14t20.5 23l40 64q28 45 73.5 70.5T760-520v80q-70 0-125.5-28T540-540l-24 60 84 80v160h-80v-122l-78-72-42 194h-84Zm167.5-523.5Q460-787 460-820t23.5-56.5Q507-900 540-900t56.5 23.5Q620-853 620-820t-23.5 56.5Q573-740 540-740t-56.5-23.5ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-119 61.5-214T302-838l36 71q-79 39-128.5 115.5T160-480q0 134 93 227t227 93q134 0 227-93t93-227h80q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z"/>
    </Box>
  
  );
}
export function CelulasOrganosIcon({ size = { base: "24px", md: "24px" } }: { size?: string | { base: string; md: string } }) {
  return (
    <Box
      as="svg"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 -960 960 960"
      fill={fisiologiaTxt}
      w={size}
      h={size}
    >
      <path d="M521-80q-60 0-150-16.5T227-154q-30-23-63-72t-60.5-107Q76-391 58-449t-18-99q0-85 58-138.5T222-783q60-39 133-68t151-29q78 0 141.5 30T774-777q15 10 39 30t47.5 50q23.5 30 41 70.5T920-534q2 74-30.5 154.5t-88 147Q746-166 673-123T521-80Zm-1-80q62 0 120.5-36T744-287.5q45-55.5 71.5-121T840-532q-2-69-41-113t-70-65q-51-35-105-62.5T506-800q-66 0-130 26t-116 61q-39 26-90 66.5T119-552q0 32 15.5 82t39 100q23.5 50 50.5 92.5t50 59.5q36 27 111 42.5T520-160Zm-106-80q54 0 89-38t35-86q0-22-9-43.5T500-447q-22-20-36-44t-21-53q-10-44-43.5-70T324-640q-49 0-86.5 37.5T200-516q0 39 16.5 87t45.5 90q29 42 68 70.5t84 28.5Zm0-80q-27 0-51-22.5T320.5-396Q302-427 291-460.5T280-516q0-17 13.5-30.5T324-560q12 0 24.5 8.5T366-526q11 42 29.5 75.5T446-388q6 5 9 12t3 14q0 16-12 29t-32 13Zm236-120q17 0 28.5-11.5T690-480v-10l10 5q15 8 30.5 3.5T754-500q9-14 5-30.5T740-555l-10-5 10-5q15-8 18.5-24t-4.5-31q-8-14-23.5-18t-30.5 4l-10 5v-11q0-17-11.5-28.5T650-680q-17 0-28.5 11.5T610-640v11l-9-5q-14-8-30-3.5T546-619q-8 14-4.5 31t19.5 24l9 4-9 6q-14 9-18.5 24.5T546-500q8 15 24.5 19t30.5-4l9-5v10q0 17 11.5 28.5T650-440Zm-168-40Z"/>
    </Box>
  );
}
export function SistemaNerviosoIcon({ size = { base: "24px", md: "24px" } }: { size?: string | { base: string; md: string } }) {
  return (
    <Box
      as="svg"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 -960 960 960"
      fill={fisiologiaTxt}
      w={size}
      h={size}
    >
      <path d="M390-120q-51 0-88-35.5T260-241q-60-8-100-53t-40-106q0-21 5.5-41.5T142-480q-11-18-16.5-38t-5.5-42q0-61 40-105.5t99-52.5q3-51 41-86.5t90-35.5q26 0 48.5 10t41.5 27q18-17 41-27t49-10q52 0 89.5 35t40.5 86q59 8 99.5 53T840-560q0 22-5.5 42T818-480q11 18 16.5 38.5T840-400q0 62-40.5 106.5T699-241q-5 50-41.5 85.5T570-120q-25 0-48.5-9.5T480-156q-19 17-42 26.5t-48 9.5Zm130-590v460q0 21 14.5 35.5T570-200q20 0 34.5-16t15.5-36q-21-8-38.5-21.5T550-306q-10-14-7.5-30t16.5-26q14-10 30-7.5t26 16.5q11 16 28 24.5t37 8.5q33 0 56.5-23.5T760-400q0-5-.5-10t-2.5-10q-17 10-36.5 15t-40.5 5q-17 0-28.5-11.5T640-440q0-17 11.5-28.5T680-480q33 0 56.5-23.5T760-560q0-33-23.5-56T680-640q-11 18-28.5 31.5T613-587q-16 6-31-1t-20-23q-5-16 1.5-31t22.5-20q15-5 24.5-18t9.5-30q0-21-14.5-35.5T570-760q-21 0-35.5 14.5T520-710Zm-80 460v-460q0-21-14.5-35.5T390-760q-21 0-35.5 14.5T340-710q0 16 9 29.5t24 18.5q16 5 23 20t2 31q-6 16-21 23t-31 1q-21-8-38.5-21.5T279-640q-32 1-55.5 24.5T200-560q0 33 23.5 56.5T280-480q17 0 28.5 11.5T320-440q0 17-11.5 28.5T280-400q-21 0-40.5-5T203-420q-2 5-2.5 10t-.5 10q0 33 23.5 56.5T280-320q20 0 37-8.5t28-24.5q10-14 26-16.5t30 7.5q14 10 16.5 26t-7.5 30q-14 19-32 33t-39 22q1 20 16 35.5t35 15.5q21 0 35.5-14.5T440-250Zm40-230Z"/>
    </Box>
  );
}
export function MilagroIcon({ size = { base: "24px", md: "24px" } }: { size?: string | { base: string; md: string } }) {
  return (
    <Box
      as="svg"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 -960 960 960"
      fill={fisiologiaTxt}
      w={size}
      h={size}
    >
      <path d="M480-80q-73-9-145-39.5T206.5-207Q150-264 115-351T80-560v-40h40q51 0 105 13t101 39q12-86 54.5-176.5T480-880q57 65 99.5 155.5T634-548q47-26 101-39t105-13h40v40q0 122-35 209t-91.5 144q-56.5 57-128 87.5T480-80Zm-2-82q-11-166-98.5-251T162-518q11 171 101.5 255T478-162Zm2-254q15-22 36.5-45.5T558-502q-2-57-22.5-119T480-742q-35 59-55.5 121T402-502q20 17 42 40.5t36 45.5Zm78 236q37-12 77-35t74.5-62.5q34.5-39.5 59-98.5T798-518q-94 14-165 62.5T524-332q12 32 20.5 70t13.5 82Zm-78-236Zm78 236Zm-80 18Zm46-170ZM480-80Z"/>
    </Box>
  );
}
export function EstrellaIcon({ size = { base: "24px", md: "24px" } }: { size?: string | { base: string; md: string } }) {
  return (
    <Box
      as="svg"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 -960 960 960"
      fill={fisiologiaTxt}
      w={size}
      h={size}
    >
      <path d="M233-120l65-281L80-590l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Zm247-350Z"/>
    </Box>
  );
}
export function BioelectricidadIcon({ size = { base: "24px", md: "24px" } }: { size?: string | { base: string; md: string } }) {
  return (
    <Box
      as="svg"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 -960 960 960"
      fill={fisiologiaTxt}
      w={size}
      h={size}
    >
      <path d="M87-556q26-140 135.5-232T480-880q74 0 139.5 24T737-788q-14 26-22.5 44.5T703-709q-44-42-101-66.5T480-800q-101 0-181 56.5T183-599q-27-1-52.5 10T87-556ZM480-80q-148 0-257.5-92T87-404q17 22 42.5 33.5T183-360q36 88 116 144t181 56q133 0 226.5-93.5T800-480q0-17-1.5-34t-5.5-34q11 4 22.5 6t24.5 2q9 0 18-1t17-3q2 16 3.5 31.5T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80ZM336-496l84-84-85-85-42 42 43 42-43 43 43 42Zm447.5-127.5Q760-647 760-680q0-27 15-57.5T840-840q50 72 65 102.5t15 57.5q0 33-23.5 56.5T840-600q-33 0-56.5-23.5ZM625-495l43-43-43-43 42-42-42-42-85 85 85 85Zm-145 75q-26 0-50.5 6T383-397l-143-83q0-16-8-30t-22-22q-22-12-45.5-5.5T128-510q-12 22-5.5 45.5T150-428q14 8 30 8t30-8l119 69q-17 17-30.5 36.5T276-280h66q21-36 57-58t81-22q45 0 81 22t57 58h66q-24-62-78.5-101T480-420Zm0-60Z"/>
    </Box>
  );
}
export const fisiologiaDescrip = "No tenemos un cuerpo, somos un cuerpo. Redescúbrete como el milagro que eres. Comprendente tu naturaleza intrínseca y transforma el enfado y la frustración en Amor y respeto."


// Neuropsicología
export const neuropsicologiaNom = "Psicología";
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
export const neuropsicologiaDescrip = "Entiende el porqué de tus hábitos diarios, de tus enfados, frustraciones y dolores, para transformarlos en el impulso que te libere del pasado y te acerquen a tu corazón."

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
export const astrologiaDescrip =  "Entiende los arquetipos que actúan en cada área de tu Vida, comprende sus propósitos y utilízalos conscientemente para dejar de hacerte daño."

// TCM
export const tcmNom = "Medicina China";
export const tcmNomLink = "medicinachina";
export const tcmBg = "#6b0404";
export const  tcmTxt = "#ffa2a2";
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
export const tcmDescrip = "Comprende el funcionamiento del ser Humano y el origen de sus desequilibrios desde la medicina milenaria de Oriente."

// Nutrición
export const nutricionNom = "Nutrición";
export const nutricionNomLink = "nutricion";
export const nutricionBg = "#e4f8e1";
export const nutricionTxt = "#2b362a";
export function NutricionIcon({ size = { base: "24px", md: "24px" }}) {
   return (
   <Box as="svg" xmlns="http://www.w3.org/2000/svg" height={size} viewBox="0 -960 960 960" width={size} fill={nutricionTxt}>
      <path d="M640-80q-100 0-170-70t-70-170q0-100 70-170t170-70q100 0 170 70t70 170q0 100-70 170T640-80Zm0-80q66 0 113-47t47-113q0-66-47-113t-113-47q-66 0-113 47t-47 113q0 66 47 113t113 47Zm-480 0q-33 0-56.5-23.5T80-240v-304q0-8 1.5-16t4.5-16l80-184h-6q-17 0-28.5-11.5T120-800v-40q0-17 11.5-28.5T160-880h280q17 0 28.5 11.5T480-840v40q0 17-11.5 28.5T440-760h-6l66 152q-19 10-36 21t-32 25l-84-198h-96l-92 216v304h170q5 21 13.5 41.5T364-160H160Zm480-440q-42 0-71-29t-29-71q0-42 29-71t71-29v200q0-42 29-71t71-29q42 0 71 29t29 71H640Z"/></Box>
    );
}
export function IntestinoIcon({ size = { base: "24px", md: "24px" } }: { size?: string | { base: string; md: string } }) {
  return (
    <Box as="svg" xmlns="http://www.w3.org/2000/svg" height={size} viewBox="0 -960 960 960" width={size} fill={nutricionTxt}>
      <path d="M423.5-743.5Q400-767 400-800t23.5-56.5Q447-880 480-880t56.5 23.5Q560-833 560-800t-23.5 56.5Q513-720 480-720t-56.5-23.5ZM360-80v-520H120v-80h720v80H600v520h-80v-240h-80v240h-80Z"/>
    </Box>
  );
}
export function CalculadoraIcon() {
  return (
    <Box flexShrink={0} display="flex" alignItems="center">
      <svg xmlns="http://www.w3.org/2000/svg" height="32px" viewBox="0 -960 960 960" width="32px" fill={nutricionTxt}>
        <path d="M320-240h60v-80h80v-60h-80v-80h-60v80h-80v60h80v80Zm200-30h200v-60H520v60Zm0-100h200v-60H520v60Zm44-152 56-56 56 56 42-42-56-56 56-56-42-42-56 56-56-56-42 42 56 56-56 56 42 42Zm-314-70h200v-60H250v60Zm-50 472q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm0-560v560-560Z"/>
      </svg>
    </Box>
  );
}
export const nutricionDescrip="Descubre qué hay más allá de los alimentos que consumimos cada día. Entiende, sin rodeos, por qué unos alimentos son saludables y otros pueden perjudicarnos. Toma las riendas de tu claridad mental transformando tu dieta.";

// Ayurveda
export const ayurvedaNom = "Hinduismo";
export const ayurvedaNomLink = "ayurveda";
export const ayurvedaBg = "#ffffff"; // "#ecd5ed";
export const ayurvedaTxt = "#853e0b" ; //"#672d67" ;
export function AyurvedaIcon({ size = { base: "24px", md: "24px" }}) {
  return (
    <Box as="svg" xmlns="http://www.w3.org/2000/svg" height={size} viewBox="0 -960 960 960" width={size} fill={ayurvedaTxt}>
      <path d="M272-160q-30 0-51-21t-21-51q0-21 12-39.5t32-26.5l156-62v-90q-54 63-125.5 96.5T120-320v-80q68 0 123.5-28T344-508l54-64q12-14 28-21t34-7h40q18 0 34 7t28 21l54 64q45 52 100.5 80T840-400v80q-83 0-154.5-33.5T560-450v90l156 62q20 8 32 26.5t12 39.5q0 30-21 51t-51 21H400v-20q0-26 17-43t43-17h120q9 0 14.5-5.5T600-260q0-9-5.5-14.5T580-280H460q-42 0-71 29t-29 71v20h-88Zm151.5-503.5Q400-687 400-720t23.5-56.5Q447-800 480-800t56.5 23.5Q560-753 560-720t-23.5 56.5Q513-640 480-640t-56.5-23.5Z"/>
    </Box>
  );
}
export const ayurvedaDescrip= "Redescubre al ser humano, desde la sabiduría ancestral de la India, como un ser holístico e interconectado con la naturaleza.";
export const vataColor  = "#7c5cbf";
export const pittaColor = "#c0522a";
export const kaphaColor = "#3a8a5c";
export function VataIcon({ size = "28px", color = vataColor }: { size?: string; color?: string }) {
  return (
    <Box as="svg" xmlns="http://www.w3.org/2000/svg" height={size} viewBox="0 -960 960 960" width={size} fill={color} display="block">
      <path d="M460-160q-50 0-85-35t-35-85h80q0 17 11.5 28.5T460-240q17 0 28.5-11.5T500-280q0-17-11.5-28.5T460-320H80v-80h380q50 0 85 35t35 85q0 50-35 85t-85 35ZM80-560v-80h540q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43h-80q0-59 40.5-99.5T620-840q59 0 99.5 40.5T760-700q0 59-40.5 99.5T620-560H80Zm660 320v-80q26 0 43-17t17-43q0-26-17-43t-43-17H80v-80h660q59 0 99.5 40.5T880-380q0 59-40.5 99.5T740-240Z" />
    </Box>
  );
}
export function PittaIcon({ size = "28px", color = pittaColor }: { size?: string; color?: string }) {
  return (
    <Box as="svg" xmlns="http://www.w3.org/2000/svg" height={size} viewBox="0 -960 960 960" width={size} fill={color} display="block">
      <path d="M240-400q0 52 21 98.5t60 81.5q-1-5-1-9v-9q0-32 12-60t35-51l113-111 113 111q23 23 35 51t12 60v9q0 4-1 9 39-35 60-81.5t21-98.5q0-50-18.5-94.5T648-574q-20 13-42 19.5t-45 6.5q-62 0-107.5-41T401-690q-39 33-69 68.5t-50.5 72Q261-513 250.5-475T240-400Zm240 52-57 56q-11 11-17 25t-6 29q0 32 23.5 55t56.5 23q33 0 56.5-23t23.5-55q0-16-6-29.5T537-292l-57-56Zm0-492v132q0 34 23.5 57t57.5 23q18 0 33.5-7.5T622-658l18-22q74 42 117 117t43 163q0 134-93 227T480-80q-134 0-227-93t-93-227q0-129 86.5-245T480-840Z" />
    </Box>
  );
}
export function KaphaIcon({ size = "28px", color = kaphaColor }: { size?: string; color?: string }) {
  return (
    <Box as="svg" xmlns="http://www.w3.org/2000/svg" height={size} viewBox="0 -960 960 960" width={size} fill={color} display="block">
      <path d="M80-160v-80h230q-22-85-83.5-146.5T80-470q20-5 39.5-7.5T160-480q134 0 227 93t93 227H80Zm480 0q0-42-9-83.5T525-323q42-71 114.5-114T800-480q21 0 40.5 2.5T880-470q-85 22-146 83.5T650-240h230v80H560Zm-80-239q0-65 24-122t66-100.5q42-43.5 98.5-69.5T789-719q-56 35-98 86t-65 114q-44 21-80.5 51.5T480-399Zm-73-75q-12-9-24-17t-25-16q0-6 1-12.5t1-12.5q0-76-24-144t-68-124q66 27 114.5 77.5T457-606q-18 30-31 63.5T407-474Z" />
    </Box>
  );
}
// Candado (blanco por defecto). 
export function CandadoIcon({ size = "16px", color = "#fff" }: { size?: string; color?: string }) {
  return (
    <Box as="svg" xmlns="http://www.w3.org/2000/svg" height={size} viewBox="0 -960 960 960" width={size} fill={color} display="block">
      <path d="M240-80q-33 0-56.5-23.5T160-160v-400q0-33 23.5-56.5T240-640h40v-80q0-83 58.5-141.5T480-920q83 0 141.5 58.5T680-720v80h40q33 0 56.5 23.5T800-560v400q0 33-23.5 56.5T720-80H240Zm240-200q33 0 56.5-23.5T560-360q0-33-23.5-56.5T480-440q-33 0-56.5 23.5T400-360q0 33 23.5 56.5T480-280ZM360-640h240v-80q0-50-35-85t-85-35q-50 0-85 35t-35 85v80Z" />
    </Box>
  );
}
export function VataIconAyu({ size = "28px" }: { size?: string }) {
  return <VataIcon size={size} color={ayurvedaTxt} />;
}
export function PittaIconAyu({ size = "28px" }: { size?: string }) {
  return <PittaIcon size={size} color={ayurvedaTxt} />;
}
export function KaphaIconAyu({ size = "28px" }: { size?: string }) {
  return <KaphaIcon size={size} color={ayurvedaTxt} />;
}

// Fitoterapia
export const fitoterapiaNom = "Fitoterapia";
export const fitoterapiaBg = "#0e590d";
export const fitoterapiaTxt = "#d5ffd5";
export function FitoterapiaIcon({ size = { base: "30px", md: "24px" }, color = nutricionTxt }: { size?: string | { base: string; md: string }; color?: string }) {
  return (
   <Box as="svg" xmlns="http://www.w3.org/2000/svg" height={size} viewBox="0 -960 960 960" width={size} fill={color}><path d="m720-600-32 28q-14 13-33 13t-33-11q-14-11-19-28t1-36l16-50-34-20q-16-9-22.5-26t-1.5-34q5-17 20-26.5t34-9.5h40l12-38q6-19 20.5-30.5T720-880q17 0 31.5 11.5T772-838l12 38h40q19 0 33.5 9.5T878-764q7 18 0 35t-22 25l-36 20 16 50q6 19 1 36.5T818-570q-15 11-33.5 11T752-572l-32-28Zm28.5-91.5Q760-703 760-720t-11.5-28.5Q737-760 720-760t-28.5 11.5Q680-737 680-720t11.5 28.5Q703-680 720-680t28.5-11.5ZM552-244q23 60-15 112T430-80q-33 0-62.5-17T324-142q-83 12-137.5-42.5T142-324q-30-17-46-46.5T80-438q0-61 55.5-98.5T244-552l62 26q20-31 53-50.5t71-21.5v-82h60v90q37 11 61 34.5t41 65.5h88v60h-82q-2 38-20.5 71T528-306l24 62Zm-248 24q0-27 4.5-52.5T322-322q-23 11-49.5 15.5T220-304q0 39 22.5 61.5T304-220Zm-74-164q32 0 56.5-8t63.5-32l-120-50q-29-12-49.5.5T160-434q0 26 17 38t53 12Zm200 224q25 0 40.5-17.5T478-214l-54-136q-19 32-29.5 64T384-228q0 33 11.5 50.5T430-160Zm66-222q10-10 16-26.5t6-34.5q0-32-21-54t-52-22q-18 0-34 6t-27 17l78 36 34 78Zm-174 60Z"/></Box>
  );
}
export function FitoterapiaIconOscuro({ size = { base: "30px", md: "34px" }}) {
  return (
   <Box as="svg" xmlns="http://www.w3.org/2000/svg" height={size} viewBox="0 -960 960 960" width={size} fill={fitoterapiaBg}><path d="m720-600-32 28q-14 13-33 13t-33-11q-14-11-19-28t1-36l16-50-34-20q-16-9-22.5-26t-1.5-34q5-17 20-26.5t34-9.5h40l12-38q6-19 20.5-30.5T720-880q17 0 31.5 11.5T772-838l12 38h40q19 0 33.5 9.5T878-764q7 18 0 35t-22 25l-36 20 16 50q6 19 1 36.5T818-570q-15 11-33.5 11T752-572l-32-28Zm28.5-91.5Q760-703 760-720t-11.5-28.5Q737-760 720-760t-28.5 11.5Q680-737 680-720t11.5 28.5Q703-680 720-680t28.5-11.5ZM552-244q23 60-15 112T430-80q-33 0-62.5-17T324-142q-83 12-137.5-42.5T142-324q-30-17-46-46.5T80-438q0-61 55.5-98.5T244-552l62 26q20-31 53-50.5t71-21.5v-82h60v90q37 11 61 34.5t41 65.5h88v60h-82q-2 38-20.5 71T528-306l24 62Zm-248 24q0-27 4.5-52.5T322-322q-23 11-49.5 15.5T220-304q0 39 22.5 61.5T304-220Zm-74-164q32 0 56.5-8t63.5-32l-120-50q-29-12-49.5.5T160-434q0 26 17 38t53 12Zm200 224q25 0 40.5-17.5T478-214l-54-136q-19 32-29.5 64T384-228q0 33 11.5 50.5T430-160Zm66-222q10-10 16-26.5t6-34.5q0-32-21-54t-52-22q-18 0-34 6t-27 17l78 36 34 78Zm-174 60Z"/></Box>
  );
}
export const fitoterapiaDescrip="Explora el poder de las plantas medicinales y comprende cómo la Madre Tierra nos acompaña y nos cuida, si se lo permitimos.";

// ejercicio fisio icon
export function FisioEjercicioIcon({ size = { base: "24px", md: "24px" } }: { size?: string | { base: string; md: string } }) {
  return (
    <Box as="svg" xmlns="http://www.w3.org/2000/svg" h={size} viewBox="0 -960 960 960" w={size} fill={fisiologiaTxt}>
      <path d="m536-84-56-56 142-142-340-340-142 142-56-56 56-58-56-56 84-84-56-58 56-56 58 56 84-84 56 56 58-56 56 56-142 142 340 340 142-142 56 56-56 58 56 56-84 84 56 58-56 56-58-56-84 84-56-56-58 56Z"/>
    </Box>
  );
}

export function EquilibrioIcon({ size = { base: "24px", md: "24px" } }: { size?: string | { base: string; md: string } }) {
  return (
    <Box as="svg" xmlns="http://www.w3.org/2000/svg" h={size} viewBox="0 -960 960 960" w={size} fill={fisiologiaTxt}>
      <path d="M80-120v-80h360v-447q-26-9-45-28t-28-45H240l120 280q0 50-41 85t-99 35q-58 0-99-35t-41-85l120-280h-80v-80h247q12-35 43-57.5t70-22.5q39 0 70 22.5t43 57.5h247v80h-80l120 280q0 50-41 85t-99 35q-58 0-99-35t-41-85l120-280H593q-9 26-28 45t-45 28v447h360v80H80Zm585-320h150l-75-174-75 174Zm-520 0h150l-75-174-75 174Zm335-280q17 0 28.5-11.5T520-760q0-17-11.5-28.5T480-800q-17 0-28.5 11.5T440-760q0 17 11.5 28.5T480-720Z"/>
    </Box>
  );
}

export function CardioIcon({ size = { base: "24px", md: "24px" } }: { size?: string | { base: string; md: string } }) {
  return (
    <Box as="svg" xmlns="http://www.w3.org/2000/svg" h={size} viewBox="0 -960 960 960" w={size} fill={fisiologiaTxt}>
      <path d="M520-40v-240l-84-80-40 176-276-56 16-80 192 40 64-324-72 28v136h-80v-188l158-68q35-15 51.5-19.5T480-720q21 0 39 11t29 29l40 64q26 42 70.5 69T760-520v80q-66 0-123.5-27.5T540-540l-24 120 84 80v300h-80Zm-36.5-723.5Q460-787 460-820t23.5-56.5Q507-900 540-900t56.5 23.5Q620-853 620-820t-23.5 56.5Q573-740 540-740t-56.5-23.5Z"/>
    </Box>
  );
}

// comida fisio icon
export function FisioComidaIcon({ size = { base: "24px", md: "24px" }}) {
   return (
   <Box as="svg" xmlns="http://www.w3.org/2000/svg" height={size} viewBox="0 -960 960 960" width={size} fill={fisiologiaTxt}>
      <path d="M640-80q-100 0-170-70t-70-170q0-100 70-170t170-70q100 0 170 70t70 170q0 100-70 170T640-80Zm0-80q66 0 113-47t47-113q0-66-47-113t-113-47q-66 0-113 47t-47 113q0 66 47 113t113 47Zm-480 0q-33 0-56.5-23.5T80-240v-304q0-8 1.5-16t4.5-16l80-184h-6q-17 0-28.5-11.5T120-800v-40q0-17 11.5-28.5T160-880h280q17 0 28.5 11.5T480-840v40q0 17-11.5 28.5T440-760h-6l66 152q-19 10-36 21t-32 25l-84-198h-96l-92 216v304h170q5 21 13.5 41.5T364-160H160Zm480-440q-42 0-71-29t-29-71q0-42 29-71t71-29v200q0-42 29-71t71-29q42 0 71 29t29 71H640Z"/></Box>
    );
}


// Cultura
export const culturaNom = "Cultura";
export const culturaNomLink = "cultura";
export const  culturaTxt = "#79dcd4";
export const  culturaBg= "#0c3c3c";
export function CulturaIcon({ size = { base: "24px", md: "24px" } }: { size?: string | { base: string; md: string } }) {
  return (
    <Box as="svg" xmlns="http://www.w3.org/2000/svg" h={size} viewBox="0 -960 960 960" w={size} fill={culturaTxt}>
      <path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-7-.5-14.5T799-507q-5 29-27 48t-52 19h-80q-33 0-56.5-23.5T560-520v-40H400v-80q0-33 23.5-56.5T480-720h40q0-23 12.5-40.5T563-789q-20-5-40.5-8t-42.5-3q-134 0-227 93t-93 227h200q66 0 113 47t47 113v40H400v110q20 5 39.5 7.5T480-160Z"/>
    </Box>
  );
}
export const culturaDescrip = "Conoce la sabiduría de los grandes filósofos y profundiza en distintas disciplinas. Descubre más allá de lo que te han contado.";
export function SpinozaFiloIcon({ size = { base: "24px", md: "24px" } }: { size?: string | { base: string; md: string } }) {
  return (
    <Box as="svg" xmlns="http://www.w3.org/2000/svg" h={size} viewBox="0 -960 960 960" w={size} fill={culturaTxt}>
      <path d="M180-520q-26 0-43-17t-17-43q0-26 17-43t43-17q26 0 43 17t17 43q0 26-17 43t-43 17ZM120-80v-200H80v-160q0-17 11.5-28.5T120-480h120q17 0 28.5 11.5T280-440v160h-40v120h320v-200h-70q-71 0-120.5-49.5T320-530q0-53 28.5-94.5T422-686q11-65 60.5-109.5T600-840q68 0 117.5 44.5T778-686q45 20 73.5 61.5T880-530q0 71-49.5 120.5T710-360h-70v200h200v80H120Zm370-360h220q38 0 64-26t26-64q0-27-14.5-49T746-612l-42-18-6-44q-6-37-33.5-61.5T600-760q-37 0-64.5 24.5T502-674l-6 44-42 18q-25 11-39.5 33T400-530q0 38 26 64t64 26Zm110-160Z"/>
    </Box>
  );
}

export function EstrellaCirculoIcon({ size = { base: "24px", md: "24px" } }: { size?: string | { base: string; md: string } }) {
  return (
    <Box as="svg" xmlns="http://www.w3.org/2000/svg" h={size} viewBox="0 -960 960 960" w={size} fill={culturaTxt}>
      <path d="m320-240 160-122 160 122-60-198 160-114H544l-64-208-64 208H220l160 114-60 198ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/>
    </Box>
  );
}
export function CorazonIcon({ size = { base: "24px", md: "24px" } }: { size?: string | { base: string; md: string } }) {
  return (
    <Box as="svg" xmlns="http://www.w3.org/2000/svg" h={size} viewBox="0 -960 960 960" w={size} fill={culturaTxt}>
      <path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Zm0-108q96-86 158-147.5t98-107q36-45.5 50-81t14-70.5q0-60-40-100t-100-40q-47 0-87 26.5T518-680h-76q-15-41-55-67.5T300-774q-60 0-100 40t-40 100q0 35 14 70.5t50 81q36 45.5 98 107T480-228Zm0-273Z"/>
    </Box>
  );
}
export function FisicaIcon({ size = { base: "24px", md: "24px" } }: { size?: string | { base: string; md: string } }) {
  return (
    <Box as="svg" xmlns="http://www.w3.org/2000/svg" h={size} viewBox="0 -960 960 960" w={size} fill={culturaTxt}>
      <path d="m280-80 160-300-320-40 480-460h80L520-580l320 40L360-80h-80Zm222-247 161-154-269-34 63-117-160 154 268 33-63 118Zm-22-153Z"/>
    </Box>
  );
}

// Cábala
export const cabalaNom = "Cábala";
export const cabalaBg = "#3b2612";
export const cabalaTxt = "#bd814d";
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
export const cabalaDescrip="Explora la sabiduría mística y descubre qué te desequilibra para transformarlo y vivir desde la conexión con tu esencia.";

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

// Libros
export function LibrosIcon({ color = "white", size = "50px", shadow = true }) {
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
      <path d="M560-564v-68q33-14 67.5-21t72.5-7q26 0 51 4t49 10v64q-24-9-48.5-13.5T700-600q-38 0-73 9.5T560-564Zm0 220v-68q33-14 67.5-21t72.5-7q26 0 51 4t49 10v64q-24-9-48.5-13.5T700-380q-38 0-73 9t-67 27Zm0-110v-68q33-14 67.5-21t72.5-7q26 0 51 4t49 10v64q-24-9-48.5-13.5T700-490q-38 0-73 9.5T560-454ZM260-320q47 0 91.5 10.5T440-278v-394q-41-24-87-36t-93-12q-36 0-71.5 7T120-692v396q35-12 69.5-18t70.5-6Zm260 42q44-21 88.5-31.5T700-320q36 0 70.5 6t69.5 18v-396q-33-14-68.5-21t-71.5-7q-47 0-93 12t-87 36v394Zm-40 118q-48-38-104-59t-116-21q-42 0-82.5 11T100-198q-21 11-40.5-1T40-234v-482q0-11 5.5-21T62-752q46-24 96-36t102-12q58 0 113.5 15T480-740q51-30 106.5-45T700-800q52 0 102 12t96 36q11 5 16.5 15t5.5 21v482q0 23-19.5 35t-40.5 1q-37-20-77.5-31T700-240q-60 0-116 21t-104 59ZM280-494Z"/>
    </Box>
  );
}

// Opiniones
export function OpinionesIcon({ color = "white", size = "50px", shadow = true }) {
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
      <path d="M240-400h122l200-200q9-9 13.5-20.5T580-643q0-11-5-21.5T562-684l-36-38q-9-9-20-13.5t-23-4.5q-11 0-22.5 4.5T440-722L240-522v122Zm280-243-37-37 37 37ZM300-460v-38l101-101 20 18 18 20-101 101h-38Zm121-121 18 20-38-38 20 18Zm26 181h273v-80H527l-80 80ZM80-80v-720q0-33 23.5-56.5T160-880h640q33 0 56.5 23.5T880-800v480q0 33-23.5 56.5T800-240H240L80-80Zm126-240h594v-480H160v525l46-45Zm-46 0v-480 480Z"/>
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
      <path d="M452-160q6 20 16.5 41.5T490-80H200q-33 0-56.5-23.5T120-160v-640q0-33 23.5-56.5T200-880h480q33 0 56.5 23.5T760-800v284q-18-2-40-2t-40 2v-284H480v280l-100-60-100 60v-280h-80v640h252Zm126.5 61.5Q520-157 520-240t58.5-141.5Q637-440 720-440t141.5 58.5Q920-323 920-240T861.5-98.5Q803-40 720-40T578.5-98.5ZM670-140l160-100-160-100v200ZM280-800h200-200Zm172 0H200h480-240 12Z"/>
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

export function RecursosIconAstrologia({ size = { base: "24px", md: "24px" } }) {
  return (
    <Box
      as="svg"
      viewBox="0 -960 960 960"
      w={size}
      h={size}
      fill={astrologiaTxt}
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
      fill={cabalaTxt}                    
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

export function RecursosIconFitoterapia({ size = { base: "24px", md: "24px" } }) {
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

// export function RecursosIconFitoterapia({ size = { base: "24px", md: "24px" } }) {
//   return (
//     <Box
//       as="svg"
//       viewBox="0 -960 960 960"
//       w={size}
//       h={size}              
//       fill={fitoterapiaTxt}                    
//     >
//       <path d="M270-80q-45 0-77.5-30.5T160-186v-558q0-38 23.5-68t61.5-38l395-78v640l-379 76q-9 2-15 9.5t-6 16.5q0 11 9 18.5t21 7.5h450v-640h80v720H270Zm90-233 200-39v-478l-200 39v478Zm-80 16v-478l-15 3q-11 2-18 9.5t-7 18.5v457q5-2 10.5-3.5T261-293l19-4Zm-40-472v482-482Z"/>
//     </Box>
//   );
// }

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


export function EsqComprenderIcon({ size = { base: "24px", md: "24px" } }) {
  return (
    <Box
      as="svg"
      viewBox="0 -960 960 960"
      w={size}
      h={size}
      fill={neuropsicologiaTxt}
    >
      <path d="M240-80v-172q-57-52-88.5-121.5T120-520q0-150 105-255t255-105q125 0 221.5 73.5T827-615l52 205q5 19-7 34.5T840-360h-80v120q0 33-23.5 56.5T680-160h-80v80h-80v-160h160v-200h108l-38-155q-23-91-98-148t-172-57q-116 0-198 81t-82 197q0 60 24.5 114t69.5 96l26 24v208h-80Zm254-360Zm-14 120q17 0 28.5-11.5T520-360q0-17-11.5-28.5T480-400q-17 0-28.5 11.5T440-360q0 17 11.5 28.5T480-320Zm-30-128h61q0-25 6.5-40.5T544-526q18-20 35-40.5t17-53.5q0-42-32.5-71T483-720q-40 0-72.5 23T365-637l55 23q7-22 24.5-35.5T483-663q22 0 36.5 12t14.5 31q0 21-12.5 37.5T492-549q-20 21-31 42t-11 59Z"/>
    </Box>
  );
}

export function EsqOrigenIcon({ size = { base: "24px", md: "24px" } }) {
  return (
    <Box
      as="svg"
      viewBox="0 -960 960 960"
      w={size}
      h={size}
      fill={neuropsicologiaTxt}
    >
      <path d="M491-339q70 0 119-45t49-109q0-57-36.5-96.5T534-629q-47 0-79.5 30T422-525q0 19 7.5 37t21.5 33l57-57q-3-2-4.5-5t-1.5-7q0-11 9-17.5t23-6.5q20 0 33 16.5t13 39.5q0 31-25.5 52.5T492-418q-47 0-79.5-38T380-549q0-29 11-55.5t31-46.5l-57-57q-32 31-49 72t-17 86q0 88 56 149.5T491-339ZM240-80v-172q-57-52-88.5-121.5T120-520q0-150 105-255t255-105q125 0 221.5 73.5T827-615l52 205q5 19-7 34.5T840-360h-80v120q0 33-23.5 56.5T680-160h-80v80h-80v-160h160v-200h108l-38-155q-23-91-98-148t-172-57q-116 0-198 81t-82 197q0 60 24.5 114t69.5 96l26 24v208h-80Zm254-360Z"/>
    </Box>
  );
}

export function EsqBiologiaIcon({ size = { base: "24px", md: "24px" } }) {
  return (
    <Box
      as="svg"
      viewBox="0 -960 960 960"
      w={size}
      h={size}
      fill={neuropsicologiaTxt}
    >
      <path d="M390-120q-51 0-88-35.5T260-241q-60-8-100-53t-40-106q0-21 5.5-41.5T142-480q-11-18-16.5-38t-5.5-42q0-61 40-105.5t99-52.5q3-51 41-86.5t90-35.5q26 0 48.5 10t41.5 27q18-17 41-27t49-10q52 0 89.5 35t40.5 86q59 8 99.5 53T840-560q0 22-5.5 42T818-480q11 18 16.5 38.5T840-400q0 62-40.5 106.5T699-241q-5 50-41.5 85.5T570-120q-25 0-48.5-9.5T480-156q-19 17-42 26.5t-48 9.5Zm130-590v460q0 21 14.5 35.5T570-200q20 0 34.5-16t15.5-36q-21-8-38.5-21.5T550-306q-10-14-7.5-30t16.5-26q14-10 30-7.5t26 16.5q11 16 28 24.5t37 8.5q33 0 56.5-23.5T760-400q0-5-.5-10t-2.5-10q-17 10-36.5 15t-40.5 5q-17 0-28.5-11.5T640-440q0-17 11.5-28.5T680-480q33 0 56.5-23.5T760-560q0-33-23.5-56T680-640q-11 18-28.5 31.5T613-587q-16 6-31-1t-20-23q-5-16 1.5-31t22.5-20q15-5 24.5-18t9.5-30q0-21-14.5-35.5T570-760q-21 0-35.5 14.5T520-710Zm-80 460v-460q0-21-14.5-35.5T390-760q-21 0-35.5 14.5T340-710q0 16 9 29.5t24 18.5q16 5 23 20t2 31q-6 16-21 23t-31 1q-21-8-38.5-21.5T279-640q-32 1-55.5 24.5T200-560q0 33 23.5 56.5T280-480q17 0 28.5 11.5T320-440q0 17-11.5 28.5T280-400q-21 0-40.5-5T203-420q-2 5-2.5 10t-.5 10q0 33 23.5 56.5T280-320q20 0 37-8.5t28-24.5q10-14 26-16.5t30 7.5q14 10 16.5 26t-7.5 30q-14 19-32 33t-39 22q1 20 16 35.5t35 15.5q21 0 35.5-14.5T440-250Zm40-230Z"/>
    </Box>
  );
}

export function EsqVocesIcon({ size = { base: "24px", md: "24px" } }) {
  return (
    <Box
      as="svg"
      viewBox="0 -960 960 960"
      w={size}
      h={size}
      fill={neuropsicologiaTxt}
    >
      <path d="M80-80v-80q46 0 91-6t88-22q-46-23-72.5-66.5T160-349v-91h160v-120h135L324-822l72-36 131 262q20 40-3 78t-68 38h-56v40q0 33-23.5 56.5T320-360h-80v11q0 35 21.5 61.5T316-252l12 3q40 10 45 50t-31 60q-60 33-126.5 46T80-80Zm572-114-57-56q21-21 33-48.5t12-59.5q0-32-12-59.5T595-466l57-57q32 32 50 74.5t18 90.5q0 48-18 90t-50 74ZM765-80l-57-57q43-43 67.5-99.5T800-358q0-66-24.5-122T708-579l57-57q54 54 84.5 125T880-358q0 81-30.5 152.5T765-80Z"/>
    </Box>
  );
}

export function AnxComidaIcon({ size = { base: "24px", md: "24px" } }) {
  return (
    <Box
      as="svg"
      viewBox="0 -960 960 960"
      w={size}
      h={size}
      fill={neuropsicologiaTxt}
    >
      <path d="M281.5-201.5Q200-283 200-400q0-94 55.5-168.5T401-669q-20-5-39-14.5T328-708q-33-33-42.5-78.5T281-879q47-5 92.5 4.5T452-832q23 23 33.5 52t13.5 61q13-31 31.5-58.5T572-828q11-11 28-11t28 11q11 11 11 28t-11 28q-22 22-39 48.5T564-667q88 28 142 101.5T760-400q0 117-81.5 198.5T480-120q-117 0-198.5-81.5Zm340-57Q680-317 680-400t-58.5-141.5Q563-600 480-600t-141.5 58.5Q280-483 280-400t58.5 141.5Q397-200 480-200t141.5-58.5ZM480-400Z"/>
    </Box>
  );
}

export function AnxSanacionIcon({ size = { base: "24px", md: "24px" } }) {
  return (
    <Box
      as="svg"
      viewBox="0 -960 960 960"
      w={size}
      h={size}
      fill={neuropsicologiaTxt}
    >
      <path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Zm0-108q96-86 158-147.5t98-107q36-45.5 50-81t14-70.5q0-60-40-100t-100-40q-47 0-87 26.5T518-680h-76q-15-41-55-67.5T300-774q-60 0-100 40t-40 100q0 35 14 70.5t50 81q36 45.5 98 107T480-228Zm0-273Z"/>
    </Box>
  );
}

export function AnxEntornoIcon({ size = { base: "24px", md: "24px" } }) {
  return (
    <Box
      as="svg"
      viewBox="0 -960 960 960"
      w={size}
      h={size}
      fill={neuropsicologiaTxt}
    >
      <path d="M240-320q-33 0-56.5-23.5T160-400q0-33 23.5-56.5T240-480q33 0 56.5 23.5T320-400q0 33-23.5 56.5T240-320Zm480 0q-33 0-56.5-23.5T640-400q0-33 23.5-56.5T720-480q33 0 56.5 23.5T800-400q0 33-23.5 56.5T720-320Zm-240-40q-42 0-71-29t-29-71q0-42 29-71t71-29q42 0 71 29t29 71q0 42-29 71t-71 29ZM284-120q14-69 68.5-114.5T480-280q73 0 127.5 45.5T676-120H284Zm-204 0q0-66 47-113t113-47q17 0 32 3t29 9q-30 29-50 66.5T224-120H80Zm656 0q-7-44-27-81.5T659-268q14-6 29-9t32-3q66 0 113 47t47 113H736ZM88-480l-48-64 440-336 160 122v-82h120v174l160 122-48 64-392-299L88-480Z"/>
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

export function PlanetIcon({ size = { base: "24px", md: "24px" }}) {
  return (
    <Box
      as="svg"
      viewBox="0 -960 960 960"
      w={size}
      h={size}
      fill={astrologiaTxt}
    >
      <path d="M484.5-553.5Q499-568 499-589t-14.5-35.5Q470-639 449-639t-35.5 14.5Q399-610 399-589t14.5 35.5Q428-539 449-539t35.5-14.5ZM822-80q-42 0-113-35t-152-95q-19 5-38.5 7.5T479-200q-117 0-198-81t-81-198q0-20 3-40t8-39q-59-81-94.5-151.5T81-822q0-27 15-42.5t41-15.5q26 0 67.5 18T319-801q-21 11-39 23t-35 26q-19-11-37-19t-38-17q18 38 38.5 74t43.5 71q38-54 97-85t130-31q117 0 198.5 81.5T759-479q0 71-31.5 130T642-252q35 23 71.5 44t74.5 38q-8-19-16.5-37T752-244q15-17 27-36t22-39q46 78 62.5 116.5T880-138q0 29-16 43.5T822-80ZM577.5-370.5Q589-382 589-399t-11.5-28.5Q566-439 549-439t-28.5 11.5Q509-416 509-399t11.5 28.5Q532-359 549-359t28.5-11.5Zm43-137Q629-516 629-529t-8.5-21.5Q612-559 599-559t-21.5 8.5Q569-542 569-529t8.5 21.5Q586-499 599-499t21.5-8.5ZM468-281q-51-44-98-91t-90-98q2 38 17 71.5t41 59.5q26 26 59 41t71 17Zm103-21q48-25 78-72.5T679-480q0-83-58.5-141T479-679q-58 0-105 30t-72 78q57 76 125 144t144 125Zm-197-73Zm117-116Z"/>
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
      <path d="M440-727 256-544l-56-56 280-280 280 280-56 57-184-184v287h-80v-287Zm0 487v-120h80v120h-80Zm0 160v-80h80v80h-80Z"/>
    </Box>
  );
}

export function InflamIcon({ size = { base: "24px", md: "24px" }, color = fisiologiaTxt }: { size?: string | { base: string; md: string }; color?: string }) {
  return (
    <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" w={size} h={size} fill={color}>
      <path d="m480-336 128-184H494l80-280H360v320h120v144ZM400-80v-320H280v-480h400l-80 280h160L400-80Zm80-400H360h120Z"/>
    </Box>
  );
}





