import type { NutrienteTarjeta } from "./NutrientesNutricion";

// ── Página «Preguntas y mitos» del recorrido de Nutrición.
// Cada mito es una tarjeta (misma forma que NutrienteTarjeta): la pregunta como
// título, su viñeta y la respuesta en párrafos. Se abre en el visor de
// ilustración (NutrienteFichaModal), con el fondo de la disciplina cambiado.
//
// Fotos: /recorrido/nutricion/mitos/<archivo>.png
// Faltan por subir: alcohol-calorias y picante-metabolismo (muestran la inicial
// de la pregunta como marcador mientras no exista el archivo).

// Clave en metodo_nutricion.data con los mitos ya leídos (string[] de keys).
// La comparten la página de «Preguntas y mitos» y el «Respuestas» de la
// Biblioteca: se lea por donde se lea, la tarjeta se queda con su marquita.
export const MITOS_LEIDOS_KEY = "mitos_leidos";

export const MITOS_NUTRICION: NutrienteTarjeta[] = [
  {
    key: "soja-cancer",
    titulo: "¿La soja causa cáncer?",
    foto: "/recorrido/nutricion/mitos/sojacancer.webp",
    parrafos: [
      "La soja contiene isoflavonas, unas moléculas llamadas fitoestrógenos porque se parecen a los estrógenos humanos. Por eso pueden unirse a algunos de sus receptores, aunque con una fuerza muchísimo menor.",
      "El miedo nació de experimentos en ratones a los que se daban dosis enormes de isoflavonas aisladas, muy lejos de lo que aporta un plato de tofu o edamame. En personas, los estudios no encuentran que el consumo habitual de soja aumente el riesgo de cáncer.",
      "De hecho, en el cáncer de mama la evidencia apunta a un efecto protector. Comer soja como alimento (tofu, tempeh, edamame, bebida de soja) en cantidades normales es seguro.",
    ],
  },
  {
    key: "soja-hombres",
    titulo: "¿La soja es mala para los hombres?",
    foto: "/recorrido/nutricion/mitos/hombresoja.webp",
    parrafos: [
      "El mito dice que, al contener fitoestrógenos, la soja «feminiza» o baja la testosterona. Pero recuerda: esas moléculas son estrógenos muy débiles y nuestro cuerpo los regula.",
      "Los análisis que reúnen muchos estudios en hombres no encuentran cambios en los niveles de testosterona ni de estrógenos, ni efectos sobre la fertilidad, con un consumo normal de soja.",
      "Los pocos casos llamativos que circulan venían de consumos extremos y muy poco realistas. Para la inmensa mayoría, la soja es una fuente de proteína vegetal perfectamente saludable.",
    ],
  },
  {
    key: "proteinas-exceso",
    titulo: "¿Se pueden comer demasiadas proteínas?",
    foto: "/recorrido/nutricion/mitos/proteinasdemasiadas.webp",
    parrafos: [
      "La proteína es esencial para construir y reparar tejidos. El cuerpo no dispone de un almacén específico de proteínas, por lo que los aminoácidos que no necesita para sintetizar proteínas se utilizan como energía o pueden convertirse en glucosa o grasa.",
      "El nitrógeno sobrante se elimina principalmente en forma de urea por la orina. En personas sanas, consumir entre 1,2 y 2 g de proteína por kilo de peso al día es seguro para la mayoría, y cantidades algo superiores también suelen ser bien toleradas.",
      "Más importante que consumir mucha proteína es mantener una dieta equilibrada que incluya suficiente fibra, frutas, verduras y otros nutrientes.",
    ],
  },
  {
    key: "proteina-rinones",
    titulo: "¿La proteína daña los riñones?",
    foto: "/recorrido/nutricion/mitos/proteinadañariñones.webp",
    parrafos: [
      "Este miedo nace de un dato real pero mal aplicado: en personas que ya tienen una enfermedad renal, reducir la proteína ayuda a no sobrecargar unos riñones dañados.",
      "En personas con riñones sanos es distinto. Los estudios no muestran que una dieta alta en proteína provoque daño renal; el riñón simplemente trabaja un poco más, como un músculo que se adapta a la carga.",
      "Si tienes los riñones sanos, no hay motivo para temer la proteína. Si padeces una enfermedad renal, sí conviene ajustar la cantidad con tu médico. El contexto lo es todo.",
    ],
  },
  {
    key: "proteina-vegetal",
    titulo: "¿La proteína vegetal es peor que la animal?",
    foto: "/recorrido/nutricion/mitos/proteinavegetalvsanimal.webp",
    parrafos: [
      "La proteína animal suele tener todos los aminoácidos esenciales en buena proporción, por eso se llama «completa». Muchas vegetales tienen alguno más limitado, pero eso se resuelve fácilmente.",
      "Combinando legumbres con cereales (lentejas con arroz, garbanzos con pan) o simplemente variando a lo largo del día, obtienes todos los aminoácidos que necesitas. La soja, además, ya es proteína completa por sí sola.",
      "La proteína vegetal viene acompañada de fibra, minerales y compuestos protectores, y sin el colesterol ni la grasa saturada de algunas fuentes animales. No es peor: es distinta y muy recomendable.",
    ],
  },
  {
    key: "carne-roja",
    titulo: "¿Comer carne roja es malo para la salud?",
    foto: "/recorrido/nutricion/mitos/carneroja.webp",
    parrafos: [
      "Conviene separar dos cosas. La carne roja sin procesar y de granja (un filete, por ejemplo) puede formar parte de una dieta sana con moderación (2-3 veces por semana): aporta proteína, hierro y vitamina B12.",
      "La carne procesada (embutidos, salchichas, bacon) es otra historia: su consumo habitual sí se asocia con más riesgo de ciertos cánceres y de enfermedad cardiovascular. Ahí sí merece la pena reducir.",
      "La recomendación general es moderar la carne roja a un par de raciones por semana, minimizar la procesada y dar más peso a legumbres, pescado, aves y proteína vegetal. No es prohibir: es equilibrar.",
    ],
  },
  {
    key: "colageno",
    titulo: "¿El colágeno funciona de verdad?",
    foto: "/recorrido/nutricion/mitos/colageno.webp",
    parrafos: [
      "El colágeno es la proteína más abundante del cuerpo y da estructura a piel, tendones y articulaciones. La idea de tomarlo para «rellenar» esas zonas suena lógica, pero el cuerpo no lo usa así de directo.",
      "Cuando lo tomas, se digiere y se rompe en aminoácidos, igual que cualquier otra proteína. Tu cuerpo decide luego dónde y cómo fabricar su propio colágeno; no va directo a la piel.",
      "Hay algunos estudios que sugieren mejoras leves en hidratación de la piel o molestias articulares con suplementos de péptidos de colágeno, pero la evidencia es modesta. Una dieta con suficiente proteína y vitamina C hace más por tu colágeno que cualquier bote.",
    ],
  },
  {
    key: "azucar-adictivo",
    titulo: "¿Por qué el azúcar «engancha»?",
    foto: "/recorrido/nutricion/mitos/azucarengancha.webp",
    parrafos: [
      "El azúcar activa el circuito de recompensa del cerebro liberando dopamina, la misma señal que nos empuja a repetir lo que nos gusta. Es un mecanismo natural: la energía rápida siempre fue valiosa para sobrevivir.",
      "En los ultraprocesados ese efecto se dispara, porque combinan azúcar, grasa y sal en proporciones que casi no existen en la naturaleza y que resultan enormemente apetecibles.",
      "Además, el azúcar provoca un pico de glucosa seguido de una bajada brusca. Esa «montaña rusa» genera más hambre y antojos al poco rato. No es una adicción química como la de las drogas, pero sí un potente impulso a querer más.",
    ],
  },
  {
    key: "azucar-energia",
    titulo: "¿De verdad el azúcar da energía?",
    foto: "/recorrido/nutricion/mitos/azucarenergia.webp",
    parrafos: [
      "Sí y no. La glucosa es la molécula con la que nuestras células fabrican ATP con más facilidad, así que el azúcar da energía de forma muy rápida.",
      "El problema es que esa energía dura poco: el pico de glucosa dispara la insulina, la glucosa baja de golpe y a menudo acabamos más cansados y con más hambre que antes.",
      "La energía estable y sostenida viene de los carbohidratos acompañados de fibra (avena, legumbres, fruta entera), que se absorben poco a poco. El famoso «subidón de azúcar» es breve y, en buena parte, un mito.",
    ],
  },
  {
    key: "azucar-moreno",
    titulo: "¿El azúcar moreno es más saludable que el blanco?",
    foto: "/recorrido/nutricion/mitos/azucarmoreno.webp",
    parrafos: [
      "El azúcar moreno es básicamente azúcar blanco con algo de melaza, que le da color y ese punto de humedad. Esa melaza conserva trazas de minerales, pero en cantidades tan pequeñas que no cambian nada.",
      "En la práctica, tu cuerpo procesa ambos casi igual: el efecto sobre la glucosa en sangre y las calorías son prácticamente los mismos.",
      "Cambiar blanco por moreno no aporta beneficio real para la salud. Si quieres cuidar el azúcar, lo que ayuda es reducir la cantidad total, no cambiar de color.",
    ],
  },
  {
    key: "miel",
    titulo: "¿La miel es mejor que el azúcar?",
    foto: "/recorrido/nutricion/mitos/azucaromiel.webp",
    parrafos: [
      "La miel tiene un aura de alimento natural y saludable, y es cierto que aporta pequeñas cantidades de antioxidantes y compuestos con actividad antimicrobiana que el azúcar no tiene.",
      "Pero, en el fondo, sigue siendo azúcar: una mezcla de glucosa y fructosa que eleva la glucosa en sangre y suma calorías muy parecidas a las del azúcar de mesa.",
      "Usarla con moderación por su sabor está bien, pero no es un permiso para tomar más «porque es sana». Para el cuerpo, un exceso de miel se parece mucho a un exceso de azúcar.",
    ],
  },
  {
    key: "edulcorantes",
    titulo: "¿Los edulcorantes son malos?",
    foto: "/recorrido/nutricion/mitos/edulcorantes.webp",
    parrafos: [
      "Los edulcorantes aprobados (como la sucralosa, el aspartamo o la estevia) han sido de los aditivos más estudiados que existen, y a las dosis habituales de consumo se consideran seguros.",
      "Su gran ventaja es que endulzan sin apenas calorías ni picos de glucosa, lo que puede ayudar a quien quiere reducir azúcar, sobre todo en bebidas.",
      "El matiz es que mantienen el gusto por lo muy dulce y que algunas investigaciones estudian su posible efecto sobre la microbiota. No son un alimento saludable en sí, pero como sustituto puntual del azúcar suelen ser una opción razonable.",
    ],
  },
  {
    key: "carbohidratos-engordan",
    titulo: "¿Los carbohidratos engordan?",
    foto: "/recorrido/nutricion/mitos/carbsengordan.webp",
    parrafos: [
      "Ningún nutriente engorda por sí solo. Se gana peso cuando, de forma mantenida, se ingiere más energía de la que se gasta, vengan esas calorías de donde vengan.",
      "Los carbohidratos cargan con mala fama porque los que más abundan en la dieta moderna son refinados (azúcar, bollería, refrescos), fáciles de comer en exceso y de digerir muy rápido.",
      "Pero los carbohidratos con fibra (legumbres, avena, fruta, tubérculos, cereales integrales) sacian, dan energía estable y forman parte de las dietas más saludables del mundo. El problema no es el grupo entero, sino la calidad y la cantidad.",
    ],
  },
  {
    key: "carbohidratos-noche",
    titulo: "¿Hay que evitar los carbohidratos por la noche?",
    foto: "/recorrido/nutricion/mitos/carbsdenoche.webp",
    parrafos: [
      "La idea de que «por la noche los carbohidratos se convierten en grasa» no tiene base sólida. El cuerpo no lleva un reloj que decida engordar a partir de cierta hora.",
      "Lo que cuenta es el balance total de energía del día, no el momento exacto en que comes los hidratos. De hecho, una cena con algo de carbohidrato puede ayudar al descanso.",
      "Lo que sí conviene por la noche es no llegar a una cena enorme por haber comido poco durante el día, y elegir opciones ligeras. La hora importa mucho menos que el conjunto.",
      "Profundiza: Los carbohidratos en la cena ayudan a que el aminoácido triptófano llegue mejor al cerebro, donde se convierte en serotonina y luego en melatonina, facilitando el descanso.",
    ],
  },
  {
    key: "pan-engorda",
    titulo: "¿El pan engorda?",
    foto: "/recorrido/nutricion/mitos/panengorda.webp",
    parrafos: [
      "El pan es, sobre todo, harina: un carbohidrato. Como cualquier alimento, suma calorías, pero no tiene un poder mágico de engordar por sí mismo.",
      "Suele engordar lo que le ponemos encima y la cantidad: mantequilla, embutidos, salsas… y las raciones grandes de pan blanco muy refinado, que sacia poco y se come de más.",
      "Un pan integral de buena calidad, en una ración razonable, encaja perfectamente en una dieta sana.",
      "La diferencia está en el tipo de pan y en cuánto, no en el pan como enemigo.",
    ],
  },
  {
    key: "fruta-azucar",
    titulo: "¿La fruta tiene demasiado azúcar?",
    foto: "/recorrido/nutricion/mitos/frutaazucar.webp",
    parrafos: [
      "La fruta contiene azúcar (fructosa), sí, pero viene envuelto en fibra, agua, vitaminas y antioxidantes. Esa fibra hace que el azúcar se absorba despacio, sin los picos bruscos del azúcar añadido.",
      "Por eso comer fruta entera no se parece en nada a beber un refresco: la matriz del alimento cambia por completo cómo lo procesa el cuerpo.",
      "Salvo indicación médica concreta, no hay motivo para temer la fruta. Es de los alimentos con mejor relación entre lo que aporta y las calorías que tiene. Distinto es el zumo, donde se pierde la fibra.",
    ],
  },
  {
    key: "zumo-vs-fruta",
    titulo: "¿Por qué el zumo no es lo mismo que la fruta?",
    foto: "/recorrido/nutricion/mitos/zumovsfruta.webp",
    parrafos: [
      "Empecemos por los números, que aquí lo explican casi todo. Para llenar un vaso de zumo de naranja natural hacen falta entre tres y cuatro naranjas. Ese vaso lleva unos 22 gramos de azúcar; el mismo vaso lleno de refresco de cola lleva unos 26. La diferencia es mucho menor de lo que casi nadie imagina.",
      "Pero el azúcar no es lo que más cambia. Esas tres o cuatro naranjas contenían entre 8 y 10 gramos de fibra —cerca de un tercio de todo lo que deberías tomar en un día— y en el vaso no queda prácticamente nada: la fibra se ha quedado en el exprimidor o en el colador. Y con ella se ha ido el freno.",
      "Ahí está la clave, porque la fructosa la gestiona casi en exclusiva el hígado, y lo hace de una forma peculiar. Cuando le llega glucosa, el hígado tiene un regulador que la procesa más despacio si ya va sobrado. Con la fructosa no existe ese freno: la enzima que la capta, la fructoquinasa, trabaja a toda velocidad sin poder pararse. Fosforila toda la que le llegue, tan rápido como llegue.",
      "Y eso tiene un precio. Cada molécula de fructosa consume una de ATP, la moneda energética de la célula, y deja el fósforo atrapado. Cuando llega un chorro grande y de golpe, la energía del hepatocito cae en picado durante unos minutos. Al reponerse, esa degradación genera ácido úrico como residuo. Además, los carbonos de la fructosa entran en la ruta por debajo del punto que está regulado, así que fluyen sin control hacia la fabricación de grasa: triglicéridos y grasa que se deposita en el propio hígado.",
      "Con la fruta entera esto no pasa. La fibra forma una especie de gel que hace que la fructosa se libere poco a poco, y a esas dosis pequeñas y lentas el propio intestino se encarga de la mayor parte antes de que llegue al hígado. La fruta entrega la misma molécula, pero a cuentagotas. El zumo la entrega de golpe.",
      "Un matiz sobre la vitamina C, porque suele contarse al revés: el zumo NO pierde la vitamina C, la conserva casi entera, y tampoco es verdad que haya que bebérselo en dos minutos «antes de que se vayan las vitaminas». Ese es un mito. Lo que ocurre es más incómodo: una sola naranja ya te cubre prácticamente toda la vitamina C que necesitas en un día. Así que si te tomas el zumo por la vitamina C, la primera naranja ya te la dio; las otras tres solo han añadido azúcar sin fibra.",
      "Súmale el tiempo. Comerte cuatro naranjas te llevaría un buen rato de pelar y masticar, y lo más probable es que no pudieras acabártelas. El zumo se bebe en veinte segundos y no llena nada, porque masticar y la propia fibra son parte de la señal de saciedad. Por eso es tan fácil tomar en un vaso una cantidad de fruta que jamás te comerías.",
      "No es una impresión: en un seguimiento de más de 180.000 personas durante años, comer fruta entera se asoció a menos riesgo de diabetes tipo 2, mientras que beber zumo se asoció a más. Cambiar el zumo por la pieza entera bastaba para que el riesgo bajara.",
      "Nada de esto convierte un zumo en veneno. Un zumo puntual no le hace daño a nadie. Pero conviene tenerlo claro: el zumo no cuenta como una ración de fruta, no debería ser la bebida de todos los desayunos y no sustituye a la pieza entera. La fruta hay que masticarla.",
    ],
  },
  {
    key: "grasa-engorda",
    titulo: "¿Comer grasa engorda?",
    foto: "/recorrido/nutricion/mitos/grasaengorda.webp",
    parrafos: [
      "La grasa es el nutriente con más calorías por gramo, así que en exceso, como cualquier alimento, contribuye a engordar. Pero la grasa de la comida no se convierte directamente en grasa corporal.",
      "Lo que hace ganar o perder peso es el balance total de energía a lo largo del tiempo, no un nutriente aislado.",
      "Además, las grasas saludables (aceite de oliva, aguacate, frutos secos, pescado azul) son imprescindibles: forman tus membranas, transportan vitaminas y son la base de muchas hormonas. Quitarlas del todo no es ni necesario ni sano.",
    ],
  },
  {
    key: "grasa-saturada",
    titulo: "¿La grasa saturada es tan mala como dicen?",
    foto: "/recorrido/nutricion/mitos/grasasaturada.webp",
    parrafos: [
      "Durante décadas se señaló a la grasa saturada como la gran culpable de las enfermedades del corazón. Hoy la imagen es más matizada: importa, pero no es el único factor ni actúa igual en todos los alimentos.",
      "No es lo mismo la grasa saturada de un ultraprocesado que la de un yogur, un queso o el chocolate negro. El alimento completo (su «matriz») influye en cómo nos afecta.",
      "La recomendación sensata sigue siendo no abusar de ella y sustituir parte por grasas insaturadas (aceite de oliva, frutos secos, pescado). Pero el villano absoluto de antaño ha dado paso a una visión más equilibrada.",
    ],
  },
  {
    key: "aceite-coco",
    titulo: "¿El aceite de coco es saludable?",
    foto: "/recorrido/nutricion/mitos/aceitecoco.webp",
    parrafos: [
      "El aceite de coco se popularizó como «superalimento», pero es de las grasas con más contenido de saturadas que existen, por encima incluso de la mantequilla.",
      "Sí eleva el colesterol, tanto el «malo» (LDL) como el «bueno» (HDL), y la evidencia no respalda los beneficios milagrosos que se le atribuyen para adelgazar o para el corazón.",
      "Como toque de sabor puntual en la cocina no pasa nada, pero no es un sustituto saludable del aceite de oliva virgen extra, que sigue siendo la mejor grasa de referencia para el día a día.",
    ],
  },
  {
    key: "mantequilla-aceite",
    titulo: "¿La mantequilla es peor que el aceite de oliva?",
    foto: "/recorrido/nutricion/mitos/mantequillapeoraceite.webp",
    parrafos: [
      "El aceite de oliva virgen extra es rico en grasas monoinsaturadas y en antioxidantes (polifenoles), y es un pilar de la dieta mediterránea, asociada a mejor salud cardiovascular.",
      "La mantequilla, en cambio, es principalmente grasa saturada. No es un veneno, pero como grasa habitual del día a día el aceite de oliva le gana con claridad.",
      "Usar mantequilla de vez en cuando por su sabor está perfectamente bien; el aceite de oliva es la mejor opción para cocinar y aliñar a diario. Es una cuestión de cuál usas a diario.",
    ],
  },
  {
    key: "frutos-secos",
    titulo: "¿Los frutos secos engordan?",
    foto: "/recorrido/nutricion/mitos/frutossecos.webp",
    parrafos: [
      "Los frutos secos son calóricos porque tienen mucha grasa (saludable), así que la lógica dice que deberían engordar. Pero la realidad es más curiosa.",
      "Sacian mucho, parte de su grasa no se absorbe del todo por su estructura, y en los estudios su consumo habitual no se asocia con ganar peso, sino incluso con mantenerlo mejor y con más salud cardiovascular.",
      "La clave es la forma de comerlos: un puñado al natural o tostados, no fritos ni azucarados ni en bolsas enormes frente a la tele. Bien usados, son un tentempié excelente.",
    ],
  },
  {
    key: "light",
    titulo: "¿Los alimentos «light» ayudan a adelgazar?",
    foto: "/recorrido/nutricion/mitos/alimentoslight.webp",
    parrafos: [
      "«Light» solo significa que tiene menos calorías o menos grasa/azúcar que su versión normal, pero no que sea un alimento sano ni bajo en calorías en términos absolutos.",
      "A veces, al quitar grasa se añade azúcar (o al revés) para mantener el sabor, así que la diferencia real puede ser pequeña. Y el efecto psicológico juega en contra: solemos comer más «porque es light».",
      "Adelgazar depende del conjunto de la dieta, no de una etiqueta.",
      "Muchas veces la versión normal en menor cantidad, o directamente un alimento sin procesar, es mejor opción que su equivalente «light».",
    ],
  },
  {
    key: "huevos-colesterol",
    titulo: "¿Los huevos suben el colesterol?",
    foto: "/recorrido/nutricion/mitos/huevoscolesterol.webp",
    parrafos: [
      "El huevo tiene colesterol, pero el colesterol que comemos influye mucho menos en el de la sangre de lo que se pensaba. Nuestro hígado fabrica la mayor parte y ajusta su producción según lo que llega de la dieta.",
      "Para la mayoría de las personas, comer huevos con normalidad no aumenta el riesgo cardiovascular. Lo que más eleva el colesterol «malo» (LDL) es un exceso de grasas trans y saturadas.",
      "Existe una minoría de personas que responden más al colesterol de la dieta, pero incluso ahí el contexto global de la alimentación pesa mucho más que el huevo en sí.",
    ],
  },
  {
    key: "huevos-dia",
    titulo: "¿Cuántos huevos se pueden comer al día?",
    foto: "/recorrido/nutricion/mitos/huevosaldia.webp",
    parrafos: [
      "Durante años se limitaron los huevos por su colesterol, pero hoy sabemos que ese colesterol de la dieta influye poco en el de la sangre de la mayoría de las personas.",
      "Para gente sana, comer uno o incluso dos huevos al día encaja sin problema en una dieta equilibrada. El huevo es, de hecho, una de las fuentes de proteína más completas y nutritivas.",
      "El matiz está en el conjunto: no es lo mismo un huevo cocido que uno frito acompañado de bacon a diario. Personas con ciertas condiciones deben ajustar la cantidad con su médico, pero el límite rígido de antaño ya no se sostiene.",
    ],
  },
  {
    key: "colesterol-dieta",
    titulo: "¿El colesterol de los alimentos aumenta el colesterol en sangre?",
    foto: "/recorrido/nutricion/mitos/colesterolalimentos.webp",
    parrafos: [
      "Parece de sentido común: si como colesterol, sube mi colesterol. Pero el cuerpo es más listo. Tu hígado fabrica la mayor parte del colesterol y baja su producción cuando llega más de la comida.",
      "Los números lo dejan claro. Tu cuerpo produce cada día entre 800 y 1.000 miligramos de colesterol por su cuenta, mientras que una dieta normal aporta unos 300. Es decir: la mayor parte del colesterol que llevas dentro no lo has comido, lo has fabricado tú. Y es lógico, porque lo necesitas para las membranas de todas tus células, para las hormonas sexuales, para el cortisol, para la vitamina D y para las sales biliares.",
      "El primer freno es un termostato. La enzima que dirige la fábrica se llama HMG-CoA reductasa —exactamente la misma que bloquean las estatinas—, y el hígado la regula según lo que le llega: si comes más colesterol, produce menos; si comes menos, produce más. Por eso quitar el colesterol de la dieta rara vez baja tanto el análisis como uno esperaría: el cuerpo compensa.",
      "El segundo freno está en el intestino. No absorbes todo lo que comes: de media, alrededor de la mitad. El colesterol tiene que entrar por una puerta concreta (una proteína llamada NPC1L1) y, además, hay unas bombas en la pared intestinal que devuelven parte de lo que ya había entrado. Dos filtros antes de que nada llegue a la sangre.",
      "Ahí está también la explicación de por qué esto no es igual para todo el mundo. La eficacia de esa puerta, la de esas bombas y el tipo de apolipoproteína E que hayas heredado varían de una persona a otra. Se calcula que en torno a una de cada cuatro o cinco personas es «hiperrespondedora»: a ellas el colesterol de la dieta sí les sube el de la sangre de forma apreciable. La única manera de saber en qué grupo estás es un análisis.",
      "¿De dónde salió entonces el miedo? De unos conejos. En 1913, un investigador ruso alimentó conejos con yema de huevo y les llenó las arterias de placas. El problema es que el conejo es herbívoro: en la naturaleza no come colesterol jamás y no tiene forma de deshacerse de él. Era el peor modelo posible para estudiar a un omnívoro, pero aquel experimento marcó un siglo de recomendaciones.",
      "Por eso las guías han cambiado. El famoso límite de 300 miligramos al día se retiró de las recomendaciones estadounidenses en 2015, y los organismos europeos han ido en la misma dirección. No porque el colesterol de la dieta sea irrelevante, sino porque contar miligramos no predecía bien quién iba a tener un problema.",
      "Y aquí viene el aviso importante, porque este mito se ha dado la vuelta y ahora mucha gente concluye que el colesterol de la comida da igual del todo. No es eso. Lo que pasa es que la mayoría de los alimentos ricos en colesterol vienen acompañados de grasa saturada en el mismo bocado —embutidos, carnes grasas, mantequilla, quesos curados, bollería—, y es esa grasa saturada la que sí te sube el LDL. El mecanismo es distinto: hace que el hígado reduzca sus receptores de LDL, así que las partículas se quedan más tiempo dando vueltas por la sangre en lugar de ser retiradas.",
      "El huevo y el marisco son la excepción que lo demuestra: llevan colesterol pero muy poca grasa saturada. Por eso han sido rehabilitados, mientras que el grupo de la mantequilla y el embutido no. No era el colesterol: era la compañía.",
      "Hay personas para las que esto sí importa mucho, y conviene decirlo. Quien tiene hipercolesterolemia familiar —un fallo hereditario en los receptores de LDL que afecta a alrededor de 1 de cada 250 personas y que está enormemente infradiagnosticado— no regula bien nada de esto. También quien tiene diabetes tipo 2 o ya ha tenido un evento cardiovascular. Si en tu familia hay infartos tempranos o colesterol muy alto desde joven, coméntalo con tu médica o médico.",
      "Lo que más eleva el colesterol «malo» (LDL) es el exceso de grasas saturadas y, sobre todo, de grasas trans de los ultraprocesados. Ahí es donde de verdad merece la pena poner el foco.",
      "Y si lo que quieres es bajarlo, esto es lo que funciona de verdad: fibra soluble (avena, cebada, legumbres), que atrapa las sales biliares y obliga al hígado a gastar colesterol para fabricar más; cambiar grasa saturada por insaturada en lugar de simplemente quitar grasa; los esteroles vegetales, que compiten por esa misma puerta del intestino y pueden bajar el LDL en torno a un 10 %; y perder grasa abdominal y moverte. Nada de eso pasa por contar los miligramos de colesterol del plato.",
    ],
  },
  {
    key: "sal-hipertension",
    titulo: "¿La sal provoca hipertensión en todo el mundo?",
    foto: "/recorrido/nutricion/mitos/salhipertension.webp",
    parrafos: [
      "El exceso de sal se asocia con más presión arterial en la población en general, y por eso la recomendación de no pasarse es sensata para casi todos.",
      "Pero la sensibilidad a la sal varía de una persona a otra: hay quien nota mucho la subida de tensión al comer sal y quien apenas la nota. No todos respondemos igual.",
      "El problema real no suele ser el salero de casa, sino la sal escondida en ultraprocesados, embutidos y comida preparada, que aporta la mayor parte del sodio de la dieta. Ahí está el margen de mejora.",
    ],
  },
  {
    key: "sal-agua",
    titulo: "¿La sal en el agua es buena?",
    foto: "/recorrido/nutricion/mitos/salenagua.webp",
    parrafos: [
      "Circula la moda de añadir una pizca de sal al agua para «hidratarse mejor». Tiene algo de lógica en contextos muy concretos: ejercicio intenso y prolongado, mucho calor y sudoración abundante.",
      "En esos casos, reponer sodio junto con el agua ayuda a mantener el equilibrio de líquidos. Es la base de las bebidas isotónicas de los deportistas.",
      "Pero para la vida normal, con una dieta que ya suele tener sal de sobra, echar sal al agua no aporta beneficio y puede sumar sodio innecesario. Para el día a día, agua sin más es perfecto.",
    ],
  },
  {
    key: "sueno-comer",
    titulo: "¿Por qué me da sueño después de comer?",
    foto: "/recorrido/nutricion/mitos/sueñodespuescomer.webp",
    parrafos: [
      "Tras una comida, el cuerpo dedica recursos a la digestión y libera insulina. Esa insulina facilita que un aminoácido llamado triptófano entre en el cerebro, donde se transforma en serotonina y melatonina, moléculas que invitan al descanso.",
      "Si la comida es abundante y rica en azúcares o harinas refinadas, el pico y la bajada de glucosa acentúan ese bajón de energía.",
      "A todo esto se suma el ritmo circadiano: a primera hora de la tarde hay una somnolencia natural, comas lo que comas. Platos más ligeros y equilibrados ayudan a notarlo menos.",
    ],
  },
  {
    key: "detox",
    titulo: "¿Los zumos «detox» limpian el cuerpo?",
    foto: "/recorrido/nutricion/mitos/zumosdetox.webp",
    parrafos: [
      "Tu cuerpo ya tiene un sistema de desintoxicación potentísimo: el hígado y los riñones trabajan sin descanso para transformar y eliminar lo que no necesita. Ningún zumo hace ese trabajo por ellos.",
      "Muchos «detox» son, además, zumos de fruta sin su fibra, así que aportan una gran carga de azúcar de absorción rápida, justo lo contrario de lo que buscan.",
      "Lo que de verdad ayuda a tu hígado y a tus riñones es beber agua, comer fruta y verdura enteras, dormir bien y moderar el alcohol. No hay atajos milagrosos.",
    ],
  },
  {
    key: "alimentos-detox",
    titulo: "¿Hay alimentos que desintoxican el organismo?",
    foto: "/recorrido/nutricion/mitos/alimentosdesintoxican.webp",
    parrafos: [
      "Ningún alimento «desintoxica» en el sentido en que lo vende el marketing. Quienes hacen ese trabajo son tu hígado, tus riñones, tus pulmones y tu intestino, sin necesidad de ayudas milagrosas.",
      "Lo que sí es cierto es que algunos alimentos apoyan el buen funcionamiento de esos órganos: fruta y verdura, fibra, agua y comida poco procesada les facilitan la tarea.",
      "Así que la mejor «detox» no es un producto ni un batido especial, sino comer bien de forma constante, moverte, dormir y beber agua. El cuerpo hace el resto solo.",
    ],
  },
  {
    key: "agua-limon",
    titulo: "¿El agua con limón en ayunas tiene beneficios?",
    foto: "/recorrido/nutricion/mitos/aguaconlimon.webp",
    parrafos: [
      "El agua con limón en ayunas se ha vendido como remedio para adelgazar, «alcalinizar» o desintoxicar el cuerpo. Ninguna de esas promesas tiene respaldo científico serio.",
      "Lo que sí es real es más sencillo: te hidratas al empezar el día y tomas un poco de vitamina C. Y si te ayuda a beber más agua o a arrancar la mañana con un hábito, bienvenido sea.",
      "No cambia el pH de la sangre (el cuerpo lo regula con gran precisión) ni funde grasa. Es una costumbre agradable e inofensiva, pero sin poderes especiales.",
    ],
  },
  {
    key: "agua-comidas",
    titulo: "¿Es malo beber agua durante las comidas?",
    foto: "/recorrido/nutricion/mitos/malobeberdurantecomida.webp",
    parrafos: [
      "Se dice que el agua «diluye los jugos gástricos» y estropea la digestión. En realidad, el estómago regula perfectamente su acidez y beber agua no lo impide.",
      "Beber durante las comidas es totalmente normal y para muchas personas incluso ayuda: facilita tragar, aporta saciedad y acompaña la fibra.",
      "Solo quien note pesadez o reflujo con mucho líquido puede preferir beber menos en la mesa. Pero como norma general, beber agua mientras comes no tiene nada de malo.",
    ],
  },
  {
    key: "masticar",
    titulo: "¿Masticar más ayuda a adelgazar?",
    foto: "/recorrido/nutricion/mitos/masticar.webp",
    parrafos: [
      "Masticar despacio no quema calorías por sí mismo, pero sí influye en cuánto comemos. Las señales de saciedad tardan unos minutos en llegar al cerebro.",
      "Al comer más lento y masticar bien, das tiempo a que esas señales aparezcan, y sueles quedarte satisfecho con menos cantidad, disfrutando además más de la comida.",
      "También ayuda a la digestión, porque el alimento llega más triturado al estómago. No es una fórmula mágica para adelgazar, pero comer con calma es un aliado real del apetito y del bienestar.",
    ],
  },
  {
    key: "probioticos",
    titulo: "¿Los probióticos funcionan?",
    foto: "/recorrido/nutricion/mitos/probioticos.webp",
    parrafos: [
      "Los probióticos son microorganismos vivos que, en cantidad suficiente, pueden aportar beneficios.",
      "La evidencia es más sólida en situaciones concretas, como la diarrea asociada a antibióticos o algunos problemas digestivos.",
      "El matiz importante es que no todos son iguales: los efectos dependen de la cepa concreta y de la dosis, así que no vale cualquier producto para cualquier objetivo.",
      "Para cuidar tu microbiota en el día a día, suele importar más el conjunto de la dieta: mucha fibra, alimentos fermentados (yogur, kéfir, chucrut) y variedad vegetal. Los probióticos en cápsula son útiles en casos puntuales, no un imprescindible diario.",
    ],
  },
  {
    key: "cenar-tarde",
    titulo: "¿Cenar tarde hace ganar peso?",
    foto: "/recorrido/nutricion/mitos/cenartarde.webp",
    parrafos: [
      "Durante años se respondió a esto con un «da igual la hora, lo que cuenta son las calorías». Es una simplificación: la hora sí importa, porque tu cuerpo no procesa igual la misma comida a mediodía que a medianoche.",
      "Tienes un reloj interno, el ritmo circadiano, que va preparando al organismo para dormir mucho antes de que te acuestes. Al caer la noche empiezas a segregar melatonina, y resulta que las células beta del páncreas —las que fabrican la insulina— tienen receptores para ella. Cuando la melatonina se une a esos receptores, frena la liberación de insulina.",
      "El resultado es que, por la noche, la sensibilidad a la insulina y la tolerancia a la glucosa disminuyen. La misma cena, tomada tarde, deja más glucosa en sangre y durante más tiempo que si la hubieras tomado temprano. El cuerpo procesa peor los nutrientes justo cuando se está preparando para descansar, no para digerir.",
      "Ahora bien, matiz igual de importante: eso no convierte la hora en la causa principal de ganar peso. El factor que más pesa sigue siendo el total de energía del día. Cenar tarde modula cómo gestionas esa comida; no sustituye al balance global.",
      "Y a lo anterior se suma lo de siempre: quien cena muy tarde suele llegar con más hambre, servirse raciones más grandes, picotear después y dormir peor. Eso también empuja en la misma dirección.",
      "En la práctica: intenta cenar dos o tres horas antes de acostarte y que la cena no sea la comida más copiosa del día. No por un efecto mágico sobre la báscula, sino porque le pones las cosas fáciles a tu metabolismo en el momento en que peor las tiene.",
    ],
  },
  {
    key: "calorias-iguales",
    titulo: "¿Las calorías son todas iguales?",
    foto: "/recorrido/nutricion/mitos/caloriasiguales.webp",
    parrafos: [
      "En términos de energía pura, una caloría es una caloría. Para el balance de peso a largo plazo, la cantidad total de energía es lo que más pesa.",
      "Pero no todas las calorías se comportan igual en el cuerpo: 100 calorías de refresco y 100 de legumbres sacian, se digieren y afectan a tus hormonas de forma muy distinta.",
      "Las de alimentos ricos en fibra y proteína llenan más y ayudan a comer menos sin esfuerzo; las de ultraprocesados invitan a seguir comiendo. Así que las calorías cuentan, pero la calidad de esas calorías cambia mucho la partida.",
    ],
  },
  {
    key: "efecto-rebote",
    titulo: "¿Por qué recupero el peso después de una dieta?",
    foto: "/recorrido/nutricion/mitos/recuperarpeso.webp",
    parrafos: [
      "El famoso «efecto rebote» tiene explicación biológica. Cuando adelgazas mucho, el cuerpo se defiende: baja el gasto de energía y aumentan las hormonas del hambre, como intentando volver a su peso anterior.",
      "Si además la dieta fue muy restrictiva y temporal, al terminarla se recuperan los viejos hábitos, y con ese cuerpo «ahorrador» el peso vuelve, a veces con creces.",
      "Por eso funcionan mejor los cambios sostenibles y graduales que las dietas extremas: en lugar de una guerra corta, se trata de construir hábitos que puedas mantener toda la Vida.",
    ],
  },
  {
    key: "fruta-noche",
    titulo: "¿La fruta por la noche engorda?",
    foto: "/recorrido/nutricion/mitos/frutanoche.webp",
    parrafos: [
      "La fruta no cambia sus calorías ni su azúcar según la hora. El cuerpo no la procesa distinto por la noche que por la mañana.",
      "Lo que engorda, si acaso, es el balance total del día, no una pieza de fruta a última hora. De hecho, es una opción de postre o tentempié nocturno mucho mejor que un dulce.",
      "Solo quien tenga digestiones muy sensibles puede preferir ciertas frutas más ligeras por la noche, pero como norma general, fruta de noche es una buena elección, no un error.",
    ],
  },
  {
    key: "fruta-antes-comidas",
    titulo: "¿Es mejor comer la fruta antes de las comidas?",
    foto: "/recorrido/nutricion/mitos/frutaantescomidas.webp",
    parrafos: [
      "Existe la creencia de que la fruta «se pudre» en el estómago si se come de postre y que hay que tomarla antes. Es un mito: tu sistema digestivo mezcla y procesa todo sin problema.",
      "Sí hay un matiz práctico: comer fruta antes o al empezar la comida puede aumentar la saciedad y ayudar a comer un poco menos del resto, gracias a su fibra y su volumen.",
      "Pero de postre también es perfectamente saludable. Lo importante es que comas fruta; el momento exacto es secundario y puedes elegirlo según lo que mejor te siente.",
    ],
  },
  {
    key: "verduras-congeladas",
    titulo: "¿Las verduras congeladas son menos saludables?",
    foto: "/recorrido/nutricion/mitos/verdurascongeladas.webp",
    parrafos: [
      "Las verduras congeladas suelen recolectarse en su punto óptimo y congelarse enseguida, lo que «atrapa» buena parte de sus vitaminas justo cuando están en su mejor momento.",
      "Curiosamente, una verdura fresca que pasa días de transporte y nevera puede perder más nutrientes que una congelada. En muchos casos, la congelada gana en nutrición.",
      "Son cómodas, duran mucho, evitan desperdicio y mantienen su valor nutritivo. Lejos de ser una opción de segunda, son una forma excelente de comer más verdura sin complicarte.",
    ],
  },
  {
    key: "verduras-cocinar",
    titulo: "¿Las verduras pierden nutrientes al cocinarlas?",
    foto: "/recorrido/nutricion/mitos/verduraspierdennutrientes.webp",
    parrafos: [
      "Cocinar sí puede reducir algunos nutrientes, sobre todo las vitaminas sensibles al calor y al agua, como la vitamina C, especialmente si hierves mucho tiempo y tiras el agua.",
      "Pero también tiene ventajas: el calor rompe las paredes vegetales y hace más disponibles otros compuestos. El licopeno del tomate o los carotenoides de la zanahoria se aprovechan mejor cocinados.",
      "La mejor estrategia es variar: come verduras crudas y cocinadas, prioriza métodos suaves (vapor, salteado corto, microondas) y no las hiervas en exceso. Lo que de verdad importa es comer verdura, en la forma que sea.",
    ],
  },
  {
    key: "ecologicos",
    titulo: "¿Los alimentos ecológicos son más nutritivos?",
    foto: "/recorrido/nutricion/mitos/alimentosecologicos.webp",
    parrafos: [
      "La diferencia nutricional entre un alimento ecológico y uno convencional es, en general, pequeña. Una manzana ecológica y una convencional se parecen mucho en vitaminas y minerales.",
      "Donde sí hay diferencias es en otros aspectos: los ecológicos suelen tener menos residuos de pesticidas de síntesis y tienen distinto impacto ambiental y de bienestar animal.",
      "Comprar ecológico puede ser una elección válida por medio ambiente o preferencia personal, pero no es imprescindible para comer sano. Comer más fruta y verdura, sea o no ecológica, importa mucho más para tu salud.",
    ],
  },
  {
    key: "cafe-malo",
    titulo: "¿El café es malo para la salud?",
    foto: "/recorrido/nutricion/mitos/cafemalo.webp",
    parrafos: [
      "El café ha pasado de sospechoso a bien valorado.",
      "En cantidades moderadas, su consumo se asocia incluso con algunos beneficios y con menor riesgo de varias enfermedades.",
      "Aporta antioxidantes y, por supuesto, cafeína, que mejora el estado de alerta. En personas sanas, un consumo razonable no perjudica al corazón ni a la salud general.",
      "Los matices son individuales: quien es sensible a la cafeína puede notar nerviosismo, palpitaciones o mal sueño, y el embarazo requiere moderación. Y ojo con el café «postre» cargado de azúcar y nata, que es otra cosa muy distinta.",
    ],
  },
  {
    key: "cafe-cantidad",
    titulo: "¿Cuánto café es demasiado?",
    foto: "/recorrido/nutricion/mitos/cuantocafe.webp",
    parrafos: [
      "Para la mayoría de los adultos sanos, hasta unos 400 mg de cafeína al día (aproximadamente 3-4 tazas de café) se considera un consumo seguro.",
      "Pasar de ahí puede provocar nerviosismo, taquicardia, insomnio o molestias digestivas, sobre todo en personas sensibles o si se toma a última hora del día.",
      "La tolerancia es muy personal, y hay que contar también el café de otras fuentes (té, refrescos de cola, bebidas energéticas, chocolate). En el embarazo, la recomendación baja a unos 200 mg. La clave es escuchar a tu cuerpo.",
    ],
  },
  {
    key: "bebidas-energeticas",
    titulo: "¿Las bebidas energéticas dan energía de verdad?",
    foto: "/recorrido/nutricion/mitos/bebidasenergeticas.webp",
    parrafos: [
      "Lo que sientes con una bebida energética es, sobre todo, el efecto de la cafeína y del azúcar: más alerta y un empujón rápido. Pero eso no es energía real, sino una sensación temporal.",
      "La energía de verdad (las calorías que usan tus células) viene de los alimentos. Estas bebidas dan un chute breve seguido a menudo de bajón, y suman mucho azúcar.",
      "Además, mezclan dosis altas de cafeína con otros estimulantes, lo que puede causar nerviosismo, palpitaciones o problemas de sueño, y son especialmente desaconsejables en menores y mezcladas con alcohol.",
    ],
  },
  {
    key: "alcohol-calorias",
    titulo: "¿El alcohol tiene calorías?",
    foto: "/recorrido/nutricion/mitos/alcohol-calorias.webp",
    parrafos: [
      "Sí, y bastantes. El alcohol aporta 7 calorías por gramo, casi tantas como la grasa y más que el azúcar o la proteína. Son, además, «calorías vacías»: energía sin nutrientes.",
      "Encima, el cuerpo prioriza metabolizar el alcohol porque lo trata como un tóxico, y mientras tanto aparca la quema de grasa. Por eso el alcohol frecuente dificulta perder peso.",
      "A esas calorías se suman las de lo que suele acompañarlo: refrescos, zumos, picoteo… Reducir el alcohol es una de las palancas más sencillas para recortar calorías y ganar salud.",
    ],
  },
  {
    key: "cerveza",
    titulo: "¿La cerveza engorda?",
    foto: "/recorrido/nutricion/mitos/cervezaengorda.webp",
    parrafos: [
      "La cerveza tiene calorías, sobre todo por su alcohol, más que por los hidratos.",
      "El clásico «michelín» o «barriga cervecera» tiene que ver con ese aporte extra de calorías líquidas y con el picoteo que suele acompañar a la cerveza, más que con un efecto mágico sobre el abdomen.",
      "Con moderación no es un drama, pero como bebida habitual sí puede favorecer ganar peso. La versión sin alcohol reduce buena parte de las calorías y puede ser una alternativa razonable.",
    ],
  },
  {
    key: "dos-litros-agua",
    titulo: "¿Es necesario beber dos litros de agua al día?",
    foto: "/recorrido/nutricion/mitos/beber2litros.webp",
    parrafos: [
      "Los famosos «dos litros» son una cifra orientativa, no una regla exacta. Las necesidades cambian según tu tamaño, el clima, la actividad física y lo que comes.",
      "Además, parte del agua la obtienes de los alimentos (fruta, verdura, sopas) y de otras bebidas, no solo del agua que bebes a sorbos. La cuenta total es mayor de lo que parece.",
      "La mejor guía es tu propio cuerpo: bebe cuando tengas sed y vigila el color de la orina (clara es buena señal). No hace falta obsesionarse con llegar a un número concreto cada día.",
    ],
  },
  {
    key: "toxinas",
    titulo: "¿El cuerpo acumula toxinas?",
    foto: "/recorrido/nutricion/mitos/cuerpotoxinas.webp",
    parrafos: [
      "La palabra «toxinas» se usa muy a la ligera en marketing, casi siempre sin decir cuáles. En una persona sana, el cuerpo no va acumulando venenos que necesiten limpiezas especiales.",
      "El hígado, los riñones, los pulmones y el intestino transforman y eliminan de forma continua los productos de desecho y las sustancias que no necesitamos. Es un sistema muy eficaz que funciona solo.",
      "Lo que de verdad les ayuda es lo de siempre: comer bien, beber agua, dormir, moverte y no abusar del alcohol ni del tabaco. No existen «curas detox» que hagan ese trabajo mejor que tus propios órganos.",
    ],
  },
  {
    key: "grasa-toxinas",
    titulo: "¿La grasa acumula toxinas?",
    foto: "/recorrido/nutricion/mitos/grasatoxinas.webp",
    parrafos: [
      "Aquí hay un matiz importante respecto a lo anterior. Tu cuerpo no acumula «toxinas» genéricas que necesiten limpiezas milagrosas, pero sí existe un grupo concreto de sustancias que se guardan en la grasa: los contaminantes liposolubles.",
      "Son compuestos que no se disuelven en agua, así que el riñón no puede eliminarlos por la orina. Al no encontrar salida, se disuelven en lo único que les resulta afín: el tejido graso. Ahí pueden quedarse años. Hablamos de restos de pesticidas antiguos, PCB o dioxinas, que llegan sobre todo a través de la grasa animal.",
      "Y ahora lo que casi nadie cuenta: que se queden ahí es, en realidad, una forma de protegerte. Guardados en la grasa están fuera de circulación y lejos de tus órganos. El tejido adiposo funciona como un almacén de seguridad.",
      "Eso explica algo curioso: cuando se pierde peso muy rápido, parte de esos compuestos se liberan de nuevo a la sangre y sus niveles suben temporalmente. No es un motivo para no adelgazar —los beneficios de perder peso son enormemente mayores—, sino un argumento más para hacerlo de forma progresiva y sostenida, no a base de dietas exprés.",
      "Lo que ayuda es lo aburrido de siempre: variedad en la dieta, fibra abundante (facilita que se eliminen por la bilis en lugar de reabsorberse), moderar la grasa animal y bajar peso poco a poco. Ningún zumo verde hace nada de esto.",
    ],
  },
  {
    key: "sin-gluten",
    titulo: "¿Los alimentos «sin gluten» son más saludables?",
    foto: "/recorrido/nutricion/mitos/singluten.webp",
    parrafos: [
      "Los alimentos sin gluten son imprescindibles para quien tiene celiaquía o sensibilidad al gluten, porque para ellos el gluten sí es un problema de salud real.",
      "Pero para el resto de la gente, «sin gluten» no significa más sano. Muchos productos procesados sin gluten llevan más azúcar, grasa o aditivos para compensar la textura, y suelen ser más caros.",
      "Quitar el gluten sin necesidad médica no aporta beneficios y puede reducir el consumo de cereales integrales y fibra. Si no eres celíaco ni sensible, no hay razón para evitarlo.",
    ],
  },
  {
    key: "celiaquia",
    titulo: "¿Cómo se reconoce la celiaquía?",
    foto: "/recorrido/nutricion/mitos/celiaquia.webp",
    parrafos: [
      "Primero, qué es: la celiaquía no es una alergia ni una intolerancia. Es una enfermedad autoinmune. El gluten hace que el sistema inmunitario ataque al propio intestino y vaya destruyendo las vellosidades que absorben los nutrientes. Por eso no se trata de «sentar mal»: se trata de daño real en el tejido.",
      "Afecta aproximadamente al 1 % de la población, una de cada cien personas. Pero el dato que importa es otro: se estima que alrededor del 75 % de los casos están sin diagnosticar. La mayoría de las personas celíacas no sabe que lo es, y el retraso hasta el diagnóstico se ha estimado en más de cinco años en adultos.",
      "Se diagnostica poco por dos ideas equivocadas muy extendidas. La primera, que es cosa de niños: puede aparecer a cualquier edad, y hoy muchos diagnósticos llegan pasados los cuarenta. La segunda, que el celíaco está delgado: se puede tener celiaquía con peso normal o con sobrepeso.",
      "Los síntomas digestivos son los conocidos —diarrea o estreñimiento, hinchazón, dolor abdominal, gases, náuseas—, pero en adultos muchas veces son leves o ni siquiera aparecen. Lo que más se pasa por alto son las señales de fuera del intestino: anemia por falta de hierro que no mejora tomando hierro (la pista clásica), cansancio persistente, llagas en la boca que se repiten, dolor articular, osteoporosis temprana, migrañas, hormigueo en manos y pies, abortos de repetición o problemas de fertilidad, y transaminasas altas sin explicación. En la piel puede dar una erupción con picor intenso y ampollitas (dermatitis herpetiforme). En niños, falta de crecimiento, retraso puberal o irritabilidad.",
      "Hay un aviso práctico que puede ahorrarte años: si sospechas, NO dejes el gluten antes de hacerte las pruebas. Los análisis y la biopsia se basan en la reacción al gluten, así que quitarlo antes da falsos negativos y obliga a volver a comerlo durante semanas para poder diagnosticarte. Primero se consulta y se analiza; después se retira.",
      "Y si tienes un familiar de primer grado celíaco, tu probabilidad ronda el 10 %: merece la pena comentarlo con tu médica o médico aunque te encuentres bien.",
    ],
  },
  {
    key: "microondas",
    titulo: "¿El microondas destruye los nutrientes?",
    foto: "/recorrido/nutricion/mitos/microondas.webp",
    parrafos: [
      "El microondas calienta haciendo vibrar las moléculas de agua del alimento; no emite radiación peligrosa ni «destroza» la comida. Es una forma de cocinar como otra cualquiera.",
      "De hecho, suele conservar bien los nutrientes: cocina rápido, con poco o nada de agua, y esa combinación evita muchas de las pérdidas de vitaminas que sí ocurren al hervir largo rato.",
      "Como cualquier método, un calentamiento excesivo puede reducir algunas vitaminas sensibles, pero el microondas está entre las opciones más respetuosas con los nutrientes. Es seguro y práctico.",
    ],
  },
  {
    key: "recalentar",
    titulo: "¿Es malo recalentar la comida?",
    foto: "/recorrido/nutricion/mitos/malorecalentar.webp",
    parrafos: [
      "Recalentar comida es perfectamente seguro si se hace bien. La clave está en la conservación: enfriar rápido las sobras, guardarlas en la nevera y recalentarlas a fondo, bien calientes.",
      "El verdadero riesgo no es el hecho de recalentar, sino dejar la comida horas a temperatura ambiente, donde las bacterias se multiplican. Ahí sí puede haber problemas.",
      "Algunos alimentos concretos (como el arroz mal conservado) requieren más cuidado, y no conviene recalentar una y otra vez lo mismo. Pero, en general, aprovechar las sobras con buena higiene no tiene nada de malo.",
    ],
  },
  {
    key: "pasta-fuera",
    titulo: "¿Pasa algo por dejar la pasta fuera de la nevera?",
    foto: "/recorrido/nutricion/mitos/pastafuera.webp",
    parrafos: [
      "Sí, y es de las pocas cosas de esta sección donde el riesgo es serio. Dejar la pasta ya cocida en la olla, tapada en la encimera o «al fresco» hasta el día siguiente no es una costumbre inocente.",
      "La culpable es una bacteria llamada Bacillus cereus, muy común en la tierra y por tanto en los cereales. Aquí está el problema: hervir la pasta mata a la bacteria, pero no a sus esporas, que aguantan perfectamente el agua hirviendo. Mientras la pasta está caliente no pasa nada; en cuanto se templa y se queda a temperatura ambiente, esas esporas despiertan, se multiplican y empiezan a fabricar una toxina.",
      "Y esa toxina es el verdadero problema, porque resiste el calor. Puedes recalentar la pasta hasta que humee, saltearla en la sartén o meterla en el horno: matarás a las bacterias, pero la toxina seguirá intacta. Recalentar bien no arregla una mala conservación.",
      "No es teoría. Hay un caso documentado en la literatura médica de un joven de veinte años que murió tras comerse unos espaguetis que llevaban cinco días fuera de la nevera y que había recalentado antes de cenar. Es un caso extremo y muy raro, pero explica por qué esto se toma en serio.",
      "La regla es sencilla: en cuanto la pasta deje de estar caliente, a la nevera. No más de dos horas fuera (una sola si hace calor en la cocina) y consumirla en un par de días. Si te la has dejado toda la noche fuera, no la recalientes: tírala.",
    ],
  },
  {
    key: "arroz-fuera",
    titulo: "¿Y el arroz? ¿Puede quedarse fuera?",
    foto: "/recorrido/nutricion/mitos/arrozfuera.webp",
    parrafos: [
      "Todavía menos que la pasta. El arroz es el ejemplo clásico de este problema, hasta el punto de que en inglés lo llaman «síndrome del arroz frito»: la mayoría de los brotes descritos venían de arroz cocido que había pasado la noche fuera y se había salteado al día siguiente.",
      "El motivo es el mismo que en la pasta —las esporas de Bacillus cereus sobreviven a la cocción y su toxina resiste el recalentado—, pero el arroz lo agrava por su forma de enfriarse: una olla llena, compacta y húmeda tarda muchísimo en bajar de temperatura, y guarda el calor justo en la franja en la que las bacterias se multiplican mejor. Puede pasar horas en la zona de peligro sin que tú lo notes.",
      "Así que el truco no es solo meterlo en la nevera, sino enfriarlo rápido: extiéndelo en una bandeja o en un recipiente ancho y plano en cuanto termines de comer, en lugar de dejarlo apelmazado en la olla. Cuanta más superficie, antes se enfría.",
      "Después: a la nevera antes de una hora, en un recipiente cerrado, y consumirlo en 24 horas. Recalentarlo una sola vez y bien caliente, nunca templado. Y si vas a congelarlo, hazlo también cuanto antes, no al día siguiente.",
      "Dicho esto, tampoco hay que vivir con miedo: millones de personas comen arroz sobrante todos los días sin problema. Basta con no dejarlo horas al aire y no confiar en que un buen recalentado lo arregle todo, porque no lo hace.",
    ],
  },
  {
    key: "picante-metabolismo",
    titulo: "¿El picante acelera el metabolismo?",
    foto: "/recorrido/nutricion/mitos/picante-metabolismo.webp",
    parrafos: [
      "El picante contiene capsaicina, un compuesto que sí produce un pequeño aumento del gasto de energía y puede reducir algo el apetito a corto plazo.",
      "El problema es la magnitud: ese efecto es tan pequeño que no adelgaza por sí solo. No vas a quemar grasa de forma notable por echarle guindilla a la comida.",
      "Lo bueno del picante es otra cosa: da mucho sabor con pocas calorías, lo que ayuda a disfrutar de platos sanos y a usar menos sal o salsas. Como aliado del sabor, sí; como quemagrasas, no.",
    ],
  },
  {
    key: "comer-rapido",
    titulo: "¿Comer rápido engorda?",
    foto: "/recorrido/nutricion/mitos/comerrapido.webp",
    parrafos: [
      "Comer deprisa no engorda por la velocidad en sí, pero sí influye en cuánto acabas comiendo. Las señales de saciedad tardan unos minutos en llegar al cerebro.",
      "Si comes muy rápido, terminas el plato antes de que tu cuerpo te avise de que ya está lleno, y sueles comer más de lo que necesitas casi sin darte cuenta.",
      "Los estudios asocian comer rápido con mayor tendencia al sobrepeso. Bajar el ritmo, masticar y hacer pausas ayuda a comer la cantidad justa y a disfrutar más. La velocidad influye, sobre todo, a través del apetito.",
    ],
  },
  {
    key: "chocolate-negro",
    titulo: "¿El chocolate negro es realmente saludable?",
    foto: "/recorrido/nutricion/mitos/chocolatenegro.webp",
    parrafos: [
      "El chocolate negro con alto porcentaje de cacao aporta flavonoides, unos antioxidantes asociados con algunos beneficios cardiovasculares, además de minerales como el magnesio.",
      "Pero sigue siendo un alimento calórico y con grasa, así que «saludable» no es un permiso para comerlo sin límite. La clave está en la cantidad y en elegir uno con mucho cacao y poco azúcar.",
      "Un par de onzas de chocolate negro (70% o más) pueden encajar bien en una dieta equilibrada. El chocolate con leche o el blanco, en cambio, son sobre todo azúcar y grasa: ahí el aura saludable desaparece.",
    ],
  },
  {
    key: "canela",
    titulo: "¿La canela ayuda a controlar el azúcar en sangre?",
    foto: "/recorrido/nutricion/mitos/canela.webp",
    parrafos: [
      "Algunos estudios sugieren que la canela podría tener un efecto leve sobre la glucosa en sangre, pero los resultados son mixtos y poco consistentes entre unas investigaciones y otras.",
      "En ningún caso sustituye a la medicación ni al tratamiento de la diabetes. Confiar en la canela para controlar el azúcar sería un error con consecuencias serias.",
      "Como especia es estupenda: da dulzor y aroma sin azúcar, lo que ayuda a endulzar de forma más sana. Disfrútala por su sabor, no como si fuera un medicamento.",
    ],
  },
  {
    key: "fruta-engorda",
    titulo: "¿La fruta engorda?",
    foto: "/recorrido/nutricion/mitos/frutaengorda.webp",
    parrafos: [
      "La fruta tiene fructosa, pero también fibra, agua y muchos nutrientes, y aporta relativamente pocas calorías para lo que llena. Es de los alimentos que mejor sacian por caloría.",
      "En los estudios, comer fruta se asocia con mejor control del peso, no con engordar. Su fibra ralentiza la absorción del azúcar y ayuda a comer menos de otras cosas.",
      "Salvo indicación médica muy concreta, no hay motivo para limitar la fruta por miedo a engordar. El «peligro» del azúcar está en los añadidos y los zumos, no en una manzana o un plátano enteros.",
    ],
  },
  {
    key: "comer-poco-muchas-veces",
    titulo: "¿Es mejor comer poco y muchas veces?",
    foto: "/recorrido/nutricion/mitos/comerpoco.webp",
    parrafos: [
      "Durante años se dijo que hacer muchas comidas pequeñas «acelera el metabolismo». Hoy sabemos que el número de comidas apenas cambia las calorías que gastas al día.",
      "Lo que de verdad cuenta es el total de energía y la calidad de lo que comes, no repartirlo en tres tomas o en cinco. No hay una fórmula única mejor para todo el mundo.",
      "Lo ideal es lo que a ti te funcione: a algunas personas comer varias veces les evita el picoteo; a otras, menos comidas más completas les sacia mejor.",
      "Elige el patrón que puedas mantener y te siente bien.",
    ],
  },
  {
    key: "alimentos-sacian",
    titulo: "¿Qué alimentos realmente sacian más?",
    foto: "/recorrido/nutricion/mitos/alimentossaciantes.webp",
    parrafos: [
      "No todos los alimentos llenan igual para las mismas calorías. Los que más sacian combinan proteína, fibra, agua y volumen, porque llenan el estómago y mandan señales de saciedad al cerebro.",
      "Por eso llenan tanto las legumbres, los huevos, el pescado, las verduras, la fruta entera, la avena o las patatas cocidas: dan mucho «relleno» con relativamente pocas calorías.",
      "En el extremo contrario están los ultraprocesados: mucha energía en poco volumen, fáciles de comer sin parar y que sacian poco.",
      "Elegir alimentos que llenan de verdad es una de las claves para comer bien sin pasar hambre.",
    ],
  },
];
