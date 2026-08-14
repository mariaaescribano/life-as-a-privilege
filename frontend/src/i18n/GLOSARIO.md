# Glosario ES → EN

Lo que hace que una traducción parezca profesional no es la frase suelta: es que
el mismo concepto se diga SIEMPRE igual. Antes de traducir una cadena nueva,
mira si el término está aquí.

## Variante de inglés

**Inglés de Estados Unidos.** `-ize` (no `-ise`), `-ization` (no `-isation`),
`color` (no `colour`). Coherente con `og:locale = en_US` y con el público
internacional. Comillas tipográficas dobles `"…"` en las citas.

## Marca y navegación

| Español | Inglés | Nota |
|---|---|---|
| El Mapa | The Map | El producto. Siempre con mayúscula y artículo. |
| El Recorrido | The Map | Nombre antiguo del mismo producto: en inglés se unifica a *The Map*, para no inventar una segunda marca. |
| Materiales | Materials | |
| Estudio | Study | El estudio estadístico de astrología. |
| Cursos | Courses | |
| Quién soy | About me | |
| Experiencias reales | Real experiences | |
| Mi Espacio | My Space | La zona privada (/espacio). |
| Herbario | Herbarium | |
| Alimentos (la sección) | Foods | |

## Las ocho disciplinas

| Español | Inglés |
|---|---|
| Astrología | Astrology |
| Psicología | Psychology |
| Hinduismo | Hinduism |
| Ayurveda | Ayurveda |
| Medicina China | Chinese Medicine |
| Fisiología | Physiology |
| Nutrición | Nutrition |
| Cultura | Culture |
| Cábala | Kabbalah |
| Fitoterapia | Phytotherapy |

Ojo: el nombre INTERNO (`astrologiaNom`, `tcmNomLink`…) no se traduce nunca,
va en las URLs y en la base de datos. Ver `nombreDisciplina.ts`.

## Vocabulario del contenido

| Español | Inglés | Nota |
|---|---|---|
| carta natal / carta astral | birth chart | Consistente; *natal chart* también existe pero no se mezclan. |
| signo | sign | |
| casa | house | |
| aspecto | aspect | |
| Sefirot | Sefirot | Invariable en plural; singular *Sefirah*. |
| Árbol de la Vida | Tree of Life | |
| dosha | dosha | Minúscula, sin cursiva. Los nombres (Vata, Pitta, Kapha) son invariables y van con mayúscula. |
| Prakriti | Prakriti | Invariable. Se deja el binomio del original: *Prakriti ~ Constitución* → *Prakriti ~ Constitution*. |
| Alimentación (como encabezado) | Food | En un rótulo de sección. Si es «la sección de Alimentos» → *Foods*. |
| Mente y emociones | Mind and emotions | |
| Predominante | Predominant | La etiqueta del dosha que más puntúa. |
| los cinco elementos | the Five Elements | En MTC van con mayúscula, es un término técnico. |
| autoconocimiento | self-knowledge | |
| órgano Zang / Fu | Zang organ / Fu organ | Invariables, con mayúscula. |
| la Sangre (MTC) | Blood | Con mayúscula: no es la sangre del análisis. Igual con *Qi*, *Yin*, *Yang*, *Shen*, *Wei Qi*. |
| la Esencia (Jing) | the Essence (Jing) | |
| ácido / amargo / dulce / picante / salado | sour / bitter / sweet / pungent / salty | Los cinco sabores. *Picante* es siempre *pungent*, nunca *spicy*. |
| Lao-Tse, Tao Te King | Lao Tzu, Tao Te Ching | La grafía inglesa de siempre, la que sale en cualquier edición. |
| s. IV a.C. / s. II d.C. | 4th c. BC / 2nd c. AD | Las fechas de una línea del tiempo. |
| recorrido (el camino guiado) | journey | Cuando es el producto → *The Map*. |
| disciplina | discipline | |
| ficha | card | |
| Vida (con mayúscula, sentido amplio) | Life | Se respeta la mayúscula: es intencionada. |
| lección | lesson | Nunca *class*: una lección es material, no una clase en directo. |
| módulo | module | |
| ejercicio | exercise | Los de dentro de un test de curso. |
| test | test | Igual en los dos idiomas. |
| Acceso Libre | Free access | El precio «gratis» de un curso. |
| Precauciones | Cautions | En las fichas de plantas y alimentos. |
| Datos curiosos | Fun facts | |
| adrenalina / noradrenalina | adrenaline / noradrenaline | NO *epinephrine*, aunque sea lo académico en EE. UU.: se dicen así en la calle y encajan con *adrenal gland* y *adrenergic receptors*, que no tienen otra forma. |
| la Vida (con mayúscula) | Life | Ya está arriba, pero ojo en Fisiología: aparece dentro de frases largas y se cuela en minúscula. |
| 37 °C · pH 7,4 | 37 °C · pH 7.4 | La coma decimal pasa a punto. Los grados se quedan en Celsius. |
| nudo (Psicología) | knot | El nudo del recorrido, no un nudo cualquiera. |
| huella | mark | «Las Huellas» = the marks that a memory left. |
| herida | wound | Nunca *trauma*: el español evita la palabra clínica a propósito. |
| Línea de Vida | Life Line | El nombre de la experiencia. |
| ACE | ACE | Adverse Childhood Experiences. Las 10 preguntas vuelven al original de Felitti & Anda, no se retraducen del español. |
| solo/a, querido/a | (sin marca) | El inglés no lleva género y no se inventa un equivalente. |
| relación (Psicología) | connection | El paso del recorrido y sus «boxes». Nunca *relationship*: no habla de parejas, sino de lo que la persona relaciona. |
| necesidad no cubierta | uncovered need | Igual que en `heridasIntro`: *uncovered*, no *unmet*. |
| Cuándo la notas: | When you notice it: | Rótulo que abre párrafo en Profundiza. Igual con *How it's made:*, *Its receptor:*, *When it matters:*. Son el ritmo del texto: se repiten literales, no se varían. |

## Medicina China · los resultados de los test

Los nombres van SIEMPRE con la grafía inglesa de la MTC, no con una traducción
literal. La clave interna se queda en español (es lo que guarda la BD): esto es
solo lo que se pinta. Ver `components/espacio/data/tcmEspacio.en.ts`.

| Español | Inglés | Nota |
|---|---|---|
| Equilibrado | Balanced | Constitución del Test 1. |
| Deficiencia de Qi / Yang / Yin | Qi Deficiency / Yang Deficiency / Yin Deficiency | En este orden: el término va delante. |
| Flema-Humedad | Phlegm-Dampness | |
| Calor-Humedad | Damp-Heat | El orden se invierte, es la forma consagrada en inglés. |
| Estancamiento de Qi | Qi Stagnation | |
| Humedad / Calor / Flema / Frío (patógenos) | Dampness / Heat / Phlegm / Cold | Con mayúscula, como *Blood* o *Qi*: no es la humedad del salón. |
| Movimiento Madera | the Wood Element | Nunca *Wood Movement*. Los cinco juntos, *the Five Elements*. |
| terreno constitucional | constitutional ground | El resultado del Test 2. |
| desarmonía de Madera | Wood disharmony | |
| Infusiones y Tés | Teas and Infusions | Título de la caja de recomendaciones; la categoría suelta es *Teas*. |
| Hierbas Medicinales | Medicinal Herbs | La categoría suelta es *Herbs*. |
| Estilo de Vida | Lifestyle | |
| acostarse antes de las 23 h | in bed before 11 p.m. | Las horas, en formato de EE. UU. Igual «de 23 a 3 h» → *from 11 p.m. to 3 a.m.* |
| hígado / bazo / riñón / pulmón | liver / spleen / kidney / lung | En MINÚSCULA, como en español y como en el resto de los ficheros de MTC. |

## Ayurveda · el submapa del doṣha

Los seis textos del recorrido del doṣha (`hardCoded/metodo/dosha*.en.ts` y
`pranayama.en.ts`). La clave del doṣha (`vata` / `pitta` / `kapha`) es lo que
guarda la BD y no se traduce; de aquí sale solo el rótulo.

| Español | Inglés | Nota |
|---|---|---|
| Doṣha | Doṣha | Con su grafía, como ya hace `en/espacio.ts`. En genérico y en minúscula, *dosha*. |
| Prakṛti | Prakriti | Sin diacrítico, como el resto de la casa. |
| Tu tendencia mental | How your mind leans | Título de la página. No *Your mental tendency*. |
| Así funciona tu cuerpo | This is how your body works | |
| ¿Qué te desequilibra? | What throws you off balance? | Y «Lo que aumenta Vata» → *What increases Vata*. |
| Tu alimentación ideal | The way of eating that suits you | Nunca *Your ideal diet*: no es una dieta. Igual «Tu estilo de Vida ideal» → *The way of living that suits you*. |
| Dulce · Ácido · Salado · Picante · Amargo · Astringente | Sweet · Sour · Salty · Pungent · Bitter · Astringent | Los seis sabores. «Picante» es *pungent* (el sabor), no *spicy* (el plato). |
| ¿Te reconoces? | Do you recognize yourself? | |
| Lo que el Ayurveda quiere que recuerdes | What Ayurveda wants you to remember | Sin artículo: *Ayurveda*, no *the Ayurveda*. |
| Reflexiona · Mi compromiso | Reflect · My commitment | |
| Un día de ejemplo | A sample day | |
| Abhyanga · ghee · dhal · chai | Abhyanga · ghee · dhal · chai | No se traducen. |
| Nāḍī Śodhana · Śītalī · Śītkārī · Bhastrikā · Viṣṇu mudrā | (igual) | Los nombres de las técnicas se quedan con sus diacríticos. |
| Inhala · Retén · Exhala | Inhale · Hold · Exhale | Los rótulos del guía de respiración. |

## Astrología y psicología · los rótulos

Aquí no hay ficheros `.en.ts`: son etiquetas cortas y viven junto al dato
(`astrologiaNombres.ts`, `familiaSimbolos.ts`). El dato se guarda SIEMPRE en
español porque es la clave con la que se indexa el texto.

| Español | Inglés | Nota |
|---|---|---|
| Conjunción · Oposición · Trígono · Cuadratura | Conjunction · Opposition · Trine · Square | Los aspectos. *Cuadratura* es *Square*, nunca *Quadrature*. |
| Sextil · Semisextil · Quincuncio | Sextile · Semisextile · Quincunx | |
| Casa VII | House VII | El número romano no cambia. |
| Regente | Ruler | |
| Animales · Personajes | Animals · Characters | Los dos grupos del selector de «Tu familia». |
| Niña (el personaje) | Child | Sin género: el personaje lo elige cualquiera. |
| Sombra · Sabio · Mago · Payaso | Shadow · Sage · Magician · Clown | |

## Nutrición · la calculadora

| Español | Inglés | Nota |
|---|---|---|
| Peso (kg) · Altura (cm) | Weight (kg) · Height (cm) | ⚠️ NO se pasa a libras ni a pulgadas: son los números que entran en la fórmula de Mifflin-St Jeor y los que se guardan en la BD. |
| Género · Mujer · Hombre | Gender · Woman · Man | Se mantiene la palabra del original, no se cambia a *Sex / Female / Male*. |
| Valores nutricionales (por 100 g) | Nutrition facts (per 100 g) | |
| G. insaturadas / G. saturadas | Unsat. fat / Sat. fat | Abreviado, como en español: son rótulos de una tabla estrecha. |
| Frutos secos | Nuts | Y *Soja* → *Soybeans*, *Aceite de oliva* → *Olive oil*. |

## Nutrición · la biblioteca, el plato y los juegos

| Español | Inglés | Nota |
|---|---|---|
| fibra | fiber | Y *fibra soluble / insoluble* → *soluble / insoluble fiber*. |
| ácidos grasos de cadena corta | short-chain fatty acids | Siempre entero, sin siglas: en español tampoco se dice «AGCC». |
| microbiota | microbiota | Nunca *gut flora*. |
| intestino (el ecosistema) | gut | *pared intestinal* → *gut wall*; *barrera intestinal* → *gut barrier*. |
| Constructora · Combustible · Protectora · Dañina en exceso | Builder · Fuel · Protector · Harmful in excess | Las cuatro píldoras de función de una molécula. |
| Protectores vegetales | Plant protectors | El grupo de los fitoquímicos en la ficha del alimento. |
| Almidón · Grasa monoinsaturada · Azúcar añadido | Starch · Monounsaturated fat · Added sugar | Grafía química inglesa de siempre. |
| Verduras · Fruta · Cereales integrales · Proteína saludable | Vegetables · Fruit · Whole grains · Healthy protein | Los cuatro sectores del plato de Harvard: los nombres con los que se conoce en inglés. |
| a ojo | by eye | Las medidas son con el cuerpo: *a fist*, *your palm*, *a tablespoon*, *a teaspoon*, *your cupped hand*. Se dicen igual siempre. |
| Desayuno · Media mañana · Comida · Merienda · Cena | Breakfast · Mid-morning · Lunch · Afternoon snack · Dinner | Las comidas españolas (cinco). Se traducen por lo que son, no se cambian por el horario anglosajón. |
| ración | portion | Y en el juego de macros, la ración se dice como en la cocina: *1 medium (180 g)*, *1 handful (30 g)*. |
| cocido / en seco | cooked / dry | Media lección depende de que se distingan. |
| Clavado · Cerca · Lejos | Spot on · Close · Way off | El tino de «Cuenta los macros». No son notas: el juego no tiene puntos. |
| prediabetes | prediabetes | *glucosa en ayunas* → *fasting glucose*; *hemoglobina glicosilada (HbA1c)* → *HbA1c*; *resistencia a la insulina* → *insulin resistance*; *acantosis nigricans* no se traduce. |
| tu médica o médico | your doctor | El inglés no lleva género y no se inventa un equivalente. |
| ⚠️ etiqueta de peso | (no existe) | En el test de prediabetes NUNCA se escribe *overweight* ni *obese*: el IMC puntúa por dentro y no se enseña. Tampoco se traducen «Tu complexión» / «Tu cintura» por algo más clínico: *Your build* / *Your waist*. |
| g · ml · cm · kg | g · ml · cm · kg | ⚠️ NO se pasan a onzas, tazas ni pulgadas: son los números que se estiman, se suman y se guardan. |

## Registro

La voz de María es cercana y directa, tutea y a veces corta la frase en seco
(«Eres un cuerpo.»). En inglés eso es **segunda persona, contracciones
naturales** (*you're*, *don't*, *it's*) y frases cortas. No pasarlo a un inglés
corporativo ni almidonado.

## Acciones (verbos de botón)

| Español | Inglés |
|---|---|
| Entrar / Iniciar sesión | Log in |
| Crear cuenta | Create account |
| Registrarme | Sign up |
| Continuar | Continue |
| Volver | Back |
| Saltar | Skip |
| Guardar | Save |
| Enviar | Send |
| Explorar | Explore |
| Leído | Read |

## Lo que NO se traduce

- Nombres propios: *María Escribano*, *Drea Burbank*, *Savimbo*, *Life as a Privilege*.
- Citas textuales de personas reales: hay que usar el original, no una
  retraducción. Ver la nota en `en/quienSoy.ts`.
