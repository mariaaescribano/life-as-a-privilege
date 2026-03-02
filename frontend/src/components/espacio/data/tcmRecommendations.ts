/* ══════════════════════════════════════════════════════════════
   RECOMENDACIONES TCM
   Fuentes: Huangdi Neijing (s. II a.C.), Giovanni Maciocia
   "Foundations of Chinese Medicine", Jiangsu College of New
   Medicine "Encyclopedia of Chinese Materia Medica", Ted Kaptchuk
   "The Web That Has No Weaver", Zhang Enqin "Clinic of TCM",
   formularios clásicos Si Jun Zi Tang, Ba Zhen Tang,
   Liu Wei Di Huang Wan, Xiao Yao San, Suan Zao Ren Tang, etc.
══════════════════════════════════════════════════════════════ */

export type Recs = {
  infusiones: string[];
  hierbas: string[];
  estiloDeVida: string[];
  nutricion: string[];
};

/* ─── CONSTITUCIONES (Test 1) ─────────────────────────────── */
export const RECS_CONSTITUCIONES: Record<string, Recs> = {
  "Equilibrado": {
    infusiones: [
      "Té verde (Camellia sinensis) · 1 taza mañana, antioxidante y equilibrante",
      "Crisantemo (Ju Hua) · ocasional en épocas de calor o estrés visual",
      "Rosa mosqueta · vitamina C natural, equilibra los 5 movimientos",
    ],
    hierbas: [
      "Huang Qi (Astragalus) · mantenimiento preventivo del Wei Qi",
      "Shan Yao (Dioscorea opposita) · tonifica Bazo y Riñón, adaptógeno suave",
      "Gou Qi Zi (Lycium / goji) · nutre Hígado y Riñón, antioxidante",
    ],
    estiloDeVida: [
      "Sueño regular: acostarse antes de las 23 h, levantarse con el sol",
      "Ejercicio moderado: caminata, tai chi o natación 30 min al día",
      "Autoobservación estacional: adaptar hábitos en los cambios de estación",
      "Gratitud y emoción positiva: nutre el Shen (mente-espíritu)",
    ],
    nutricion: [
      "5 sabores equilibrados · ácido, amargo, dulce, picante y salado en armonía",
      "Alimentos de temporada · adaptarse a cada estación, locales y frescos",
      "Cereales integrales · arroz, mijo, cebada como base diaria",
      "Moderación en todo · ni excesos ni restricciones, escuchar al cuerpo",
    ],
  },

  "Deficiencia de Qi": {
    infusiones: [
      "Dang Shen (Codonopsis) + Da Zao (dátil rojo) · tónica diaria del Centro",
      "Huang Qi (Astragalus) · cocción 15 min, refuerza Wei Qi y defensas",
      "Jengibre fresco (Sheng Jiang) + miel · calienta y tonifica el Bazo-Estómago",
    ],
    hierbas: [
      "Ren Shen (Panax ginseng) · principal tónico del Qi, base de Si Jun Zi Tang",
      "Huang Qi (Astragalus membranaceus) · refuerza Wei Qi y la defensa",
      "Bai Zhu (Atractylodes macrocephala) · fortalece Bazo, seca Humedad",
      "Gan Cao (Glycyrrhiza uralensis) · armoniza Centro y tonifica con suavidad",
    ],
    estiloDeVida: [
      "Evitar sobreesfuerzo físico y mental prolongado; respetar el descanso",
      "Qi Gong suave y Tai Chi: movimiento que genera Qi sin gastarlo",
      "Comidas calientes, cocinadas y a horas regulares; no saltarse el desayuno",
      "Descanso de 20 min después de comer para no drenar el Bazo",
      "Moxibustión en ST 36 (Zu San Li) y Ren 6 (Qi Hai)",
    ],
    nutricion: [
      "Pollo, cordero, huevo · proteína calórica que tonifica directamente el Qi",
      "Arroz, mijo, avena caliente · cereales que nutren y refuerzan el Bazo",
      "Dátil rojo (Da Zao) y goji · dulces naturales tónicos del Centro",
      "Evitar: crudos, batidos fríos, bebidas heladas y azúcares refinados",
    ],
  },

  "Deficiencia de Yang": {
    infusiones: [
      "Gui Zhi (canela en rama) + Gan Jiang (jengibre seco) · calienta el Interior",
      "Astrágalo + canela en rama · tonifica Yang y refuerza Wei Qi frente al frío",
      "Nuez (He Tao Ren) cocida con dátil · nutre Riñón Yang y calienta",
    ],
    hierbas: [
      "Rou Gui (Cinnamomum cassia) · calienta Riñón Yang, activa el Ren Mai",
      "Du Zhong (Eucommia ulmoides) · tonifica Yang de Riñón y fortalece tendones",
      "Ba Ji Tian (Morinda officinalis) · Yang de Riñón, base de You Gui Wan",
      "Fu Zi (Aconitum) · solo con supervisión cualificada; precaución máxima",
    ],
    estiloDeVida: [
      "Moxibustión en Ren 4 (Guan Yuan), Du 4 (Ming Men) y ST 36",
      "Evitar fríos externos: baños fríos, aire acondicionado directo, ropa insuficiente",
      "Ejercicio suave con sudoración ligera al sol; baños de sol en zona lumbar",
      "Dormir con ropa suficiente; mantener pies y zona lumbar calientes",
    ],
    nutricion: [
      "Cordero, gambas, venado · proteína cálida que activa el Yang de Riñón",
      "Canela, jengibre seco, clavo, cebollino · especias calorígenas del Interior",
      "Nueces, castañas, semillas de girasol · nutren el Yang de Riñón",
      "Evitar: pepino, sandía, yogur, batidos fríos, lácteos y crudos en exceso",
    ],
  },

  "Deficiencia de Yin": {
    infusiones: [
      "Gou Qi Zi (Lycium) + Ju Hua (crisantemo) · nutre Hígado, enfría ojos",
      "Mai Men Dong (Ophiopogon) · humedece Pulmón y Estómago, Yin de fluidos",
      "Bai He (Lilium brownii) · calma el Shen y nutre el Yin del Pulmón-Corazón",
    ],
    hierbas: [
      "Shu Di Huang (Rehmannia preparada) · nutre Yin y Sangre, Liu Wei Di Huang Wan",
      "Nu Zhen Zi (Ligustrum lucidum) · Yin de Hígado y Riñón, vértigo y tinnitus",
      "Tian Men Dong (Asparagus cochinchinensis) · Yin de Pulmón y Riñón profundo",
      "Bai Shao (Paeonia lactiflora) · nutre Sangre de Hígado, ablanda el carácter",
    ],
    estiloDeVida: [
      "Dormir antes de las 23 h; el Yin se regenera en el sueño profundo",
      "Evitar alcohol, picantes fuertes y alimentos muy secos o ahumados",
      "Meditación, yoga Yin y actividades sin exceso de calor",
      "Hidratación: 1,5–2 L agua templada al día; no beber muy fría",
      "Acupuntura en KD 3 (Tai Xi), SP 6 y Ren 4",
    ],
    nutricion: [
      "Cerdo, pato, mejillones, almejas · nutren el Yin sin calentar",
      "Sésamo negro, tofu, yema de huevo · nutren el Yin y la Sangre",
      "Pera, mora, uva, melón · enfrían y humedecen los fluidos internos",
      "Evitar: alcohol, picantes fuertes, ahumados y alimentos muy secos o tostados",
    ],
  },

  "Flema-Humedad": {
    infusiones: [
      "Yi Yi Ren (Coix / cebada china) · drena Humedad, cocción 20 min",
      "Chen Pi (piel de mandarina) + Ban Xia · disuelve Flema, base de Er Chen Tang",
      "Canela + jengibre seco · activa el Bazo y seca la Humedad interna",
    ],
    hierbas: [
      "Fu Ling (Poria cocos) · drena Humedad, tonifica Bazo, calma la mente",
      "Cang Zhu (Atractylodes lancea) · seca Humedad con más fuerza que Bai Zhu",
      "Chen Pi (Citrus reticulata) · mueve Qi de Bazo, disuelve Flema",
      "Yi Yi Ren (Coix lacryma-jobi) · elimina Humedad a través de la orina",
    ],
    estiloDeVida: [
      "Ejercicio diario activo: caminar, nadar, bicicleta (mínimo 30 min)",
      "Ambiente seco y ventilado; evitar sótanos, humedad y ropa húmeda",
      "Comidas calientes, regulares y moderadas; no picar entre horas",
      "Masticación pausada: 20–25 masticaciones por bocado",
    ],
    nutricion: [
      "Cebada perlada, centeno, rábano · secan la Humedad del Bazo-Estómago",
      "Ajo, puerro, mostaza, cebolla · calientan y drenan la Flema interna",
      "Rábano, nabo, apio · mueven y secan la Humedad con suavidad",
      "Eliminar: lácteos, azúcares refinados, alcohol, fritos y harinas blancas",
    ],
  },

  "Calor-Humedad": {
    infusiones: [
      "Pu Gong Ying (diente de león) · drena Calor-Humedad del Hígado y piel",
      "He Ye (hoja de loto) + Ju Hua (crisantemo) · enfría el Interior, hidrata",
      "Yin Chen Hao (Artemisia capillaris) · Calor-Humedad hepatobiliar",
    ],
    hierbas: [
      "Huang Lian (Coptis chinensis) · limpia Calor intenso, seca Humedad",
      "Long Dan Cao (Gentiana scabra) · Calor-Humedad en Hígado y Vesícula Biliar",
      "Yin Chen Hao (Artemisia capillaris) · clásico para afecciones hepatobiliares",
      "Yi Yi Ren (Coix) · remueve Humedad con componente calórico leve",
    ],
    estiloDeVida: [
      "Dieta fresca y ligera: verduras verdes, cereales, pescado blanco",
      "Gestión del estrés: meditación, respiración abdominal, contacto con naturaleza",
      "Ejercicio moderado con sudoración: yoga activo, natación matutina",
      "Acupuntura en GB 34 (Yang Ling Quan), SP 9 (Yin Ling Quan), LV 3",
    ],
    nutricion: [
      "Judía mungo, loto · clásicos anticalóricos de la MTC, drenan Calor-Humedad",
      "Pepino, apio, amaranto · enfrían el Interior y drenan la Humedad",
      "Té verde, fruta fresca de temporada · refrescan sin generar más Humedad",
      "Eliminar: alcohol, fritos, picantes, carnes grasas y azúcares refinados",
    ],
  },

  "Estancamiento de Qi": {
    infusiones: [
      "Mei Gui Hua (rosa roja seca) · mueve Qi de Hígado, alivia tensión emocional",
      "Bo He (menta) + Chen Pi (piel mandarina) · desestanca y refresca",
      "Mo Li Hua (jazmín) · armoniza Hígado-Estómago, suaviza las emociones",
    ],
    hierbas: [
      "Chai Hu (Bupleurum chinense) · mueve Qi de Hígado, base de Xiao Yao San",
      "Xiang Fu (Cyperus rotundus) · regulador maestro del Qi estancado",
      "Yu Jin (Curcuma aromatica) · mueve Qi y Sangre, drena Calor de Hígado",
      "Bai Shao (Paeonia lactiflora) · nutre Sangre de Hígado, suaviza el carácter",
    ],
    estiloDeVida: [
      "Ejercicio aeróbico regular: correr, baile, natación (mínimo 30 min/día)",
      "Expresión emocional: escritura, conversación honesta, arte, música",
      "Respiración consciente y pranayama expansivo en el tórax",
      "Acostarse antes de las 23 h; el Hígado se regenera de 23 a 3 h",
      "Acupuntura en LV 3 (Tai Chong), PC 6 (Nei Guan), GB 34",
    ],
    nutricion: [
      "Puerro, cebolla, hinojo, ajo · mueven el Qi estancado del Hígado",
      "Rábano, nabo, naranja · activan la digestión y liberan el Qi",
      "Rosa seca, azafrán · condimentos que mueven el Qi y la Sangre",
      "Reducir: alcohol, grasas, azúcares; comer despacio y masticar bien",
    ],
  },
};

/* ─── ELEMENTOS (Test 2) ──────────────────────────────────── */
export const RECS_ELEMENTOS: Record<string, Recs> = {
  "Madera": {
    infusiones: [
      "Mei Gui Hua (rosa) + Bo He (menta) · mueve y refresca el Qi de Hígado",
      "Ju Hua (crisantemo) · enfría el Calor de Hígado, mejora visión",
      "Pu Gong Ying (diente de León) · drena Hígado y Vesícula Biliar",
    ],
    hierbas: [
      "Chai Hu (Bupleurum) · referente del Movimiento Madera, mueve Hígado",
      "Bai Shao (Paeonia) · nutre Sangre de Hígado, suaviza la tensión",
      "Chuan Lian Zi (Melia toosendan) · mueve Qi y alivia dolor costal",
      "Mu Gua (Chaenomeles speciosa) · relaja tendones y músculos, Madera",
    ],
    estiloDeVida: [
      "Estación clave: primavera — revisar y renovar hábitos en marzo–abril",
      "Ejercicio aeróbico: corre, nada o baila para liberar el Qi estancado",
      "Actividades creativas: diseño, música, escritura, danza expresiva",
      "Acostarse antes de las 23 h; el Hígado trabaja de 23 a 3 h",
      "Trabajar la gestión de la ira y la frustración con herramientas conscientes",
    ],
    nutricion: [
      "Sabor ácido suave · limón, vinagre de umeboshi, ciruela fermentada",
      "Verduras amargas verdes · espinacas, perejil, albahaca, brotes frescos",
      "Hígado de pollo (ocasional) · nutre directamente el órgano Hígado",
      "Evitar: alcohol en exceso, fritos y alimentos muy grasos o ácidos artificiales",
    ],
  },

  "Fuego": {
    infusiones: [
      "Lian Zi Xin (corazón de loto) · enfría Calor del Corazón, calma el Shen",
      "Suan Zao Ren (Ziziphus) cocido · nutre el Corazón, favorece el sueño",
      "Dan Shen (Salvia miltiorrhiza) en tintura suave · activa la Sangre",
    ],
    hierbas: [
      "Suan Zao Ren (Ziziphus jujuba) · tónico clásico del Corazón y el Shen",
      "Yuan Zhi (Polygala tenuifolia) · conecta Corazón y Riñón, calma la mente",
      "He Huan Pi (Albizia julibrissin) · alivia depresión, ansiedad y tristeza",
      "Bai Zi Ren (semilla de biota) · nutre el Corazón, calma el Shen agitado",
    ],
    estiloDeVida: [
      "Estación clave: verano — cuidar el exceso de calor y estimulación",
      "Meditación diaria y técnicas de regulación emocional consciente",
      "Reducir estimulación digital especialmente después de las 18 h",
      "Relaciones sociales equilibradas; evitar intensidad afectiva sin descanso",
      "Acupuntura en HT 7 (Shen Men), PC 6 (Nei Guan), KD 6",
    ],
    nutricion: [
      "Sabor amargo · cacao puro, endivias, achicoria, rúcula, té rojo",
      "Rojo y naranja · cereza, granada, tomate, pimiento, bayas del bosque",
      "Quinoa, avena · granos ligeros que nutren el Corazón y la Sangre",
      "Moderar: cafeína, picantes fuertes y exceso de estimulantes o alcohol",
    ],
  },

  "Tierra": {
    infusiones: [
      "Sheng Jiang (jengibre fresco) + Da Zao (dátil) · calienta el Centro",
      "Sha Ren (cardamomo verde) · activa Bazo-Estómago, reduce gases",
      "Dang Shen (Codonopsis) · tónico suave del Qi de Bazo sin calentar en exceso",
    ],
    hierbas: [
      "Bai Zhu (Atractylodes macrocephala) · fortalece Bazo y Estómago",
      "Fu Ling (Poria cocos) · drena Humedad, calma la mente y el Shen",
      "Mu Xiang (Saussurea lappa) · regula Qi de Bazo, alivia distensión",
      "Shan Zha (Crataegus) · ayuda a la digestión, activa la Sangre",
    ],
    estiloDeVida: [
      "Estación clave: verano tardío (agosto–septiembre), transición estacional",
      "Comidas regulares a las mismas horas; nunca saltarse el desayuno",
      "Masticar 20–30 veces por bocado; comer sin pantallas ni prisa",
      "Paseos de 15 min después de comer: activa el Qi de Bazo",
      "Reducir rumiación mental: meditación Vipassana, journaling, naturaleza",
    ],
    nutricion: [
      "Sabor dulce natural · calabaza, boniato, zanahoria, maíz, miel",
      "Alimentos cocinados y cálidos · sopas, guisos, cremas, compotas de fruta",
      "Fermentados suaves · miso, kéfir de agua, chucrut — activan el Bazo",
      "Evitar: crudos, lácteos en exceso, azúcares refinados y comer con prisa",
    ],
  },

  "Metal": {
    infusiones: [
      "Jie Geng (Platycodon grandiflorus) · abre el Pulmón, expectorante",
      "Pera + miel de abejas · humedece el Pulmón, calma la tos seca",
      "Mai Men Dong (Ophiopogon) · nutre el Yin de Pulmón y Estómago",
    ],
    hierbas: [
      "Huang Qi (Astragalus) · fortalece el Wei Qi (defensa), tónico del Pulmón",
      "Bai He (Lilium brownii) · nutre Yin de Pulmón, calma el Shen en duelo",
      "Bai Mu Er (Tremella fuciformis) · humedece Pulmón y piel seca",
      "Bei Sha Shen (Glehnia littoralis) · Yin de Pulmón-Estómago, sequedad",
    ],
    estiloDeVida: [
      "Estación clave: otoño — reforzar la defensa inmune y la piel",
      "Respiración profunda diaria: pranayama, qigong respiratorio, 10 min",
      "Contacto con naturaleza y aire limpio; abrir ventanas cada día",
      "Permitir el duelo y expresar la tristeza sin suprimirla",
      "Acupuntura en LU 7 (Lie Que), LU 9 (Tai Yuan), SP 6",
    ],
    nutricion: [
      "Sabor picante suave · ajo, cebolla, puerro, jengibre moderado",
      "Blanco y cremoso · pera, almendras, setas, arroz, nabo cocido",
      "Miel de abeja pura · humedece el Pulmón y calma la tos seca",
      "Evitar: tabaco, ambientes secos, alimentos muy picantes o muy ácidos",
    ],
  },

  "Agua": {
    infusiones: [
      "Gou Qi Zi (Lycium / goji) · nutre el Yin de Riñón e Hígado",
      "Wu Wei Zi (Schisandra chinensis) · astringente, conserva el Jing",
      "Hei Zhi Ma (sésamo negro) tostado en leche de avena · nutre Riñón",
    ],
    hierbas: [
      "Shu Di Huang (Rehmannia preparada) · nutre Yin y Jing de Riñón",
      "Du Zhong (Eucommia ulmoides) · tonifica Riñón-Yang y los tendones",
      "Nu Zhen Zi (Ligustrum lucidum) · Yin de Riñón-Hígado, ojos y tinnitus",
      "He Shou Wu (Polygonum multiflorum) · nutre Jing y Sangre, longevidad",
    ],
    estiloDeVida: [
      "Estación clave: invierno — conservar la energía vital (Jing)",
      "Descanso profundo: acostarse antes de las 22:30 h",
      "Moxibustión en KD 1 (Yong Quan), Ren 4 (Guan Yuan), Du 4 (Ming Men)",
      "Evitar actividad nocturna excesiva y el trabajo emocional intenso",
      "Reducir sal en exceso y alimentos muy fríos o crudos en invierno",
    ],
    nutricion: [
      "Sabor salado moderado · algas marinas, miso, pescado azul, mariscos",
      "Negro y oscuro · judías negras, sésamo negro, arándanos, mora",
      "Nueces, semillas de chía, castañas · nutren el Riñón y el Jing",
      "Moderar: sal en exceso, café, alcohol y alimentos muy fríos o crudos",
    ],
  },
};

/* ─── DESEQUILIBRIOS (Test 3) ─────────────────────────────── */
export const RECS_DESEQUILIBRIOS: Record<string, Recs> = {
  "Madera": {
    infusiones: [
      "Mei Gui Hua (rosa) + Bo He · desestanca el Qi de Hígado con suavidad",
      "Chen Pi (piel de mandarina) · mueve el Qi, alivia la tensión costal",
      "Ju Hua (crisantemo) · enfría el Calor ascendente de Hígado",
    ],
    hierbas: [
      "Chai Hu (Bupleurum) + Bai Shao · base clásica de Xiao Yao San",
      "Xiang Fu (Cyperus rotundus) · regulador maestro del Qi estancado",
      "Yu Jin (Curcuma aromatica) · mueve Qi-Sangre y drena Calor de Hígado",
      "Chuan Xiong (Ligusticum chuanxiong) · mueve Sangre y Qi de forma activa",
    ],
    estiloDeVida: [
      "Ejercicio aeróbico intenso: correr, nadar, bici (30–45 min/día)",
      "Danza o artes marciales para liberar tensión corporal acumulada",
      "Diario emocional: identificar y expresar la ira y la frustración",
      "Acostarse antes de las 23 h; el Hígado trabaja de 23 a 3 h",
      "Acupuntura en LV 3 (Tai Chong), GB 34 (Yang Ling Quan), PC 6",
    ],
    nutricion: [
      "Sabor ácido suave · limón, ciruela, rosa mosqueta, vinagre de umeboshi",
      "Verduras amargas · cardo, endibia, diente de león, escarola",
      "Cúrcuma, azafrán · condimentos que mueven el Qi y la Sangre del Hígado",
      "Evitar: alcohol, grasas saturadas, fritos y alimentos procesados o picantes",
    ],
  },

  "Fuego": {
    infusiones: [
      "Lian Zi Xin (corazón de loto) · limpia el Calor del Corazón, calma el Shen",
      "Suan Zao Ren (Ziziphus) · nutre el Corazón, sedante suave, mejora el sueño",
      "Pasiflora + tilo (adaptación occidental) · calma el sistema nervioso",
    ],
    hierbas: [
      "Suan Zao Ren (Ziziphus jujuba) · fórmula Suan Zao Ren Tang para insomnio",
      "Bai Zi Ren (Platycladus orientalis) · nutre el Corazón, calma el Shen",
      "Yuan Zhi (Polygala tenuifolia) · conecta Corazón y Riñón, calma la mente",
      "Dan Shen (Salvia miltiorrhiza) · activa la Sangre, enfría el Corazón",
    ],
    estiloDeVida: [
      "Sin pantallas 1 h antes de dormir; acostarse antes de las 22:30 h",
      "Meditación Yin o Yoga Nidra antes de acostarse",
      "Técnica respiratoria 4-7-8 para bajar la activación simpática",
      "Evitar cafeína tras las 13 h y picantes o alcohol por la noche",
      "Acupuntura en HT 7 (Shen Men), KD 6 (Zhao Hai), Yin Tang",
    ],
    nutricion: [
      "Sabor amargo refrescante · cacao puro, lechuga, achicoria, pétalos de rosa",
      "Alimentos refrescantes · pepino, melón, tofu, pato, apio, germinados",
      "Semillas de loto, fruta de temporada suave · enfrían el Calor del Corazón",
      "Evitar: cafeína, alcohol, picantes y azúcares por la tarde-noche",
    ],
  },

  "Tierra": {
    infusiones: [
      "Sheng Jiang (jengibre) + Da Zao (dátil) · calienta el Bazo y el Centro",
      "Yi Yi Ren (Coix) cocido · drena la Humedad interna del Bazo",
      "Dang Shen (Codonopsis) · tónico suave del Qi de Bazo sin exceso de calor",
    ],
    hierbas: [
      "Ren Shen (Panax ginseng) · tonifica Yuan Qi y Bazo, base de Si Jun Zi Tang",
      "Bai Zhu (Atractylodes macrocephala) · seca la Humedad, fortalece el Bazo",
      "Fu Ling (Poria cocos) · drena la Humedad interna, nutre el Corazón",
      "Gan Cao (Glycyrrhiza uralensis) · armoniza el Centro y suaviza fórmulas",
    ],
    estiloDeVida: [
      "Comidas calientes a horas fijas; evitar cenar tarde, comer frío o crudo",
      "Masticación pausada: 20–30 masticaciones por bocado",
      "Tai Chi o Qi Gong: mueve el Qi de Bazo sin agotarlo",
      "Reducir la preocupación crónica y la rumiación mental excesiva",
      "Acupuntura en ST 36 (Zu San Li), SP 3 (Tai Bai), Ren 12 (Zhong Wan)",
    ],
    nutricion: [
      "Cereales calientes · arroz, mijo, avena cocinada, cebada perlada",
      "Raíces cocinadas · zanahoria, boniato, nabo, chirivía, remolacha",
      "Dátil rojo + jengibre cocido · tonifican directamente el Centro y el Bazo",
      "Eliminar: crudos, batidos fríos, lácteos, azúcares y comer deprisa",
    ],
  },

  "Metal": {
    infusiones: [
      "Huang Qi (Astragalus) · refuerza el Wei Qi y el Pulmón desde dentro",
      "Pera + Bai He (lirio) cocidos · humedece el Pulmón, calma la tos seca",
      "Jie Geng (Platycodon) · abre el Pulmón, expectorante suave",
    ],
    hierbas: [
      "Huang Qi (Astragalus membranaceus) · tonifica el Wei Qi y el Qi defensivo",
      "Bai He (Lilium brownii) · Yin de Pulmón, tristeza del Pulmón, calma el Shen",
      "Mai Men Dong (Ophiopogon japonicus) · hidrata las mucosas del Pulmón",
      "Dong Chong Xia Cao (Cordyceps sinensis) · tonifica Pulmón y Riñón",
    ],
    estiloDeVida: [
      "Ejercicios de respiración: pranayama, qigong, 10 min cada mañana",
      "Paseos en naturaleza abierta: oxigenación y contacto con el exterior",
      "Humidificador en casa si el ambiente es muy seco o hay calefacción",
      "Permitir expresar la tristeza y el duelo sin suprimirlos",
      "Acupuntura en LU 7 (Lie Que), ST 36, LI 4 (He Gu), LU 1 (Zhong Fu)",
    ],
    nutricion: [
      "Pera cocinada con miel de abeja · humedece el Pulmón, calma la tos",
      "Almendras, semillas de lino · nutren la mucosa pulmonar y la piel",
      "Ajo y cebolla suaves cocinados · depuran el Pulmón y refuerzan el Wei Qi",
      "Evitar: tabaco, ambientes secos, alimentos muy fríos, muy picantes o ácidos",
    ],
  },

  "Agua": {
    infusiones: [
      "Wu Wei Zi (Schisandra) · conserva el Jing y actúa como adaptógeno profundo",
      "Gou Qi Zi (goji) + sésamo negro · nutre el Yin y el Jing de Riñón",
      "He Tao Ren (nuez) cocida con miel · calienta el Yang de Riñón",
    ],
    hierbas: [
      "Shu Di Huang (Rehmannia preparada) · Jing de Riñón, Liu Wei Di Huang Wan",
      "He Shou Wu (Polygonum multiflorum) · nutre el Jing y la Sangre, longevidad",
      "Rou Cong Rong (Cistanche tubulosa) · Yang de Riñón, vitalidad y voluntad",
      "Du Zhong (Eucommia ulmoides) · Riñón Yang y zona lumbar, fortalece huesos",
    ],
    estiloDeVida: [
      "Moxibustión en Ren 4 (Guan Yuan), KD 3 (Tai Xi) y Du 4 (Ming Men)",
      "Dormir antes de las 22 h; la recuperación del Riñón ocurre de 22 a 2 h",
      "Mantener la zona lumbar caliente; evitar frío y corriente en la espalda",
      "Reducir actividad sexual en períodos de agotamiento profundo",
      "Meditación de arraigo: respiración consciente en zona baja del abdomen",
    ],
    nutricion: [
      "Sésamo negro, judías negras · nutren el Jing y el Yin del Riñón",
      "Nueces, castañas, semillas de girasol · calientan y consolidan el Yang de Riñón",
      "Caldo de huesos largo (4–8 h) · extrae minerales que nutren el Jing y los huesos",
      "Moderar: sal en exceso, café, alcohol y alimentos muy fríos o crudos",
    ],
  },
};
