import type { CuerpoKey } from "./astrologiaData";

/**
 * Textos por (planeta, signo) — se muestran en la página de profundizar
 * cuando el usuario ha elegido un signo concreto para ese planeta.
 */
export const TEXTOS_SIGNO: Partial<Record<CuerpoKey, Partial<Record<string, string>>>> = {
  ascendente: {
    Aries: `Independiente, fuerte, impulsivo.

¿Cómo buscas imponerte? ¿Eres capaz de canalizar tu agresividad o te arrastra ella a ti?

Tu acercamiento a la vida es directo y enérgico. Aprende a usar esa fuerza para construir y comprometerte, no solo para arrancar. Necesitas expresar tu creatividad y, si no lo haces, te frustras. Date permiso de crear a solas: no necesitas público para que lo que haces tenga valor.

Cuidado con dejar cosas a medias (te conozco). Aprende a encontrar lo nuevo dentro de lo cotidiano; siempre hay algo que descubrir.

No olvides el movimiento físico, te conviene invertir y transformar toda tu energía.`,

    Tauro: `Cuerpo que tiende a sentirse pesado. El ejercicio aeróbico te devuelve ligereza, físicamente y por dentro.

Eres trabajador, constante, sistemático. Buscas estructura en todo lo que haces y tienes un método para llegar a cada meta.

Escribe los sistemas que sueles sostener a lo largo del tiempo y que te hacen sentir seguro. Revisa si de verdad quieres mantenerlos o te gustaría cambiar algo. Recuerda que te apegas a rutinas y patrones del pasado aunque hace tiempo que dejaron de servirte. Por eso, escríbelas. Tenlas a la vista. Y ve cambiándolas poco a poco por hábitos que sí te cuiden.

Te apegas también a lo que produces. Aprende a soltar el resultado. Lo importante no es lo que consigues, sino el camino y la fuerza que cultivas al recorrerlo.

Si pierdes la conexión con tu cuerpo, este suele recordártelo: sobrepeso, problemas económicos, fracturas e incluso embarazos no deseados. Escucha los susurros de tu cuerpo antes de que se conviertan en gritos.`,

    Géminis: `Apariencia juvenil. Pareces seguro de ti mismo, pero por dentro hay más nervio del que aparentas. Tensiones, prisa mental, ruido. Necesitas meditar, salir de la cabeza y bajar al cuerpo.

Tienes una curiosidad enorme y asimilas información a una velocidad que asusta. Cuidado con perderte en cotilleos, conversaciones vacías o un scroll infinito que solo te deja más disperso.

Haz una lista de aquello con lo que de verdad quieres comprometerte y profundizar. Si solo te mueves sin integrar, tu vacío y frustración aumentan.

No olvides bajar al corazón. Necesitas desarrollar empatía y compasión hacia ti y hacia los demás, no solo entendimiento mental.`,

    Cáncer: `Figura redondeada, rasgos dulces, casi aniñados. Sueles ser tímido, pero pregúntate con honestidad: ¿te das el valor que mereces?

A veces la timidez es una coraza para que no se acerquen y no te hagan daño. Pero esa coraza se asienta justo encima del corazón, y lo único que consigue es congelar el dolor dentro. No protege; aísla.

Eres sensible y vulnerable. Percibes las emociones de los demás como si fueran tuyas. ¿Cómo te sientes cuando eso pasa?

Escribe cada vez que necesites desahogarte de lo que no es tuyo o de lo que te han hecho. Escribe qué necesitas para sentir conexión emocional y material. Hazlo consciente: así sabrás qué le pides a otros (y a la Vida) y podrás empezar a dártelo tú. Escribe las situaciones del pasado que aún te pesan para liberarlas. No necesitas cargar con ello.

Parte de tu camino es nutrir a otros y acompañarles en su individualización. Pero si no te nutres tú primero, solo repartes carencia disfrazada de cuidado. Escribe cómo vas a empezar a nutrirte, y cuándo. Ponle horario y comprométete, para que no te entre la pereza.`,

    Leo: `Atraes miradas. Tienes un pelo precioso (sí, lo sabes).

Generoso, idealista, ambicioso, creativo, romántico, con una confianza que se nota a metros. Pero pregúntate: ¿cómo intentas dominar a otros? ¿Te merece la pena? ¿Qué ganas con eso?

No necesitas subordinados para ser un líder. El verdadero liderazgo es crear un espacio donde los demás puedan ser ellos. Tienes el poder de dar permiso a los otros para abrir su corazón, úsalo para el bien.

Anhelas ser amado y, sobre todo, sentirte válido. Pero por mucho que te validen, seguirás con sed, porque la validación que buscas es la tuya propia.

Escribe las maneras en que pides validación fuera, y reemplázalas por cómo puedes dártela tú. No necesitas el reconocimiento social que tanto persigues. Tu miedo al ridículo nace de tus propios juicios; nadie te juzga tan duramente como tú. No necesitas enfadarte ni inflar el ego para ser importante. Ya lo eres.`,

    Virgo: `Pareces más joven de lo que eres. Tus movimientos tienen un punto nervioso, como si siempre estuvieras pendiente de algo.

Tiendes a sentirte inadecuado, y eso te condiciona: nunca te ves del todo suficiente. Puede que arrastres heridas de experiencias pasadas que aún te resienten. Necesitas quedarte con lo que de verdad te nutre y soltar el resto.

Haz una lista de lo que es importante para ti.

Eres crítico y juzgador. Persigues una perfección que en el fondo sabes imposible, y eso te lleva a un reproche interno agotador. Los detalles, por cierto, no son tan importantes como crees.

¿Qué cosas juzgas en los demás? Todo lo que juzgas fuera es algo que juzgas en ti. Sánalo dentro y dejarás de verlo fuera.

Práctico y eficiente, puedes obsesionarte con el orden y la limpieza. Pero recuerda: la vida no se mide.`,

    Libra: `Rasgos armoniosos, piel delicada, proporciones simétricas. La naturaleza se esmeró contigo.

Te sientes mejor rodeado de gente o en pareja: los demás te funcionan como espejo para conocerte.

¿Qué te han enseñado los otros sobre ti mismo?

Eres diplomático, dulce, capaz de ver las cosas desde la razón cuando otros pierden los nervios. Pero cuidado con dejar que otros decidan por ti. Tu voz también cuenta. Cuenta contigo.

No te pierdas buscando la vida ideal: existe el riesgo de pasarte la vida diseñándola, tratando de buscar la perfección y la armonía, en lugar de viviéndola. Haz lo que puedas cada día con lo que tienes. El ahora es lo único real.

Haz una lista de cosas que te gustaría que pasaran cada día, solo por hoy (repítelo cada mañana), y llévalas a cabo.`,

    Escorpio: `Tienes un magnetismo sexual evidente. Lo sabes y, a veces, te incomoda.

Escondes una parte de ti y solo muestras lo que te gusta o lo que quieres parecer. Prefieres observar y analizar porque eres capaz de ver el lado oscuro y profundo.

¿Qué has percibido a lo largo de tu vida?

Por fuera pareces calmado, pero por dentro hay una gran actividad, formas de ti transformándose continuamente. No te gusta que se note, porque necesitas dar la sensación de tener el control en todo momento.

Buscas poder para sostener tu camino, y a menudo se lo pides a otros. Eso puede llevarte al narcisismo o a relaciones donde el poder se convierte en moneda. Recuerda: tu verdadero poder ya está dentro de ti. No tienes que negociarlo.

El sexo es importante en tu vida, y puede haber sido un terreno doloroso hasta que descubriste lo que había debajo de la superficie.

Escribe las estructuras del pasado que has destruido y por cuáles las has reemplazado.
Escribe las estructuras que te gustaría destruir ahora y por cuáles las cambiarías. Recuerda que tienes el poder para ello.

Estás bendecido para iluminar lo oscuro, así que no escondas tu propia oscuridad: es una herramienta más.

Escríbelo todo, lo más raro, macabro o impresentable que pienses. Aquí nada es juzgable.`,

    Sagitario: `Cuerpo atlético, alto. Y, aunque no lo parezca, puedes tenerle miedo a la vida; te cuesta creerte que pueda ser bonita.

En tu mejor versión, para ti no hay límites, o no están donde otros los ponen. Eres filosófico y puedes usar esa mente para encontrar valores que te ayuden a vivir mejor.

Cuidado con hablar de más. Suele ser porque estás intentando ordenar ideas en voz alta.

Escribe las ideas dispersas que rondan tu cabeza. Dales un sentido.

Cuando alcanzas una meta, solo te sirve de trampolín para la siguiente. Escribe aquí todas las metas que querrías conseguir en esta vida (y atención: no es "tener un hijo", es "formar una familia"). Ve una a una y describe cómo puedes acercarte un poco cada día. Sea lo que sea, en tu interior está la semilla para el árbol.

Cuidado con exagerar, porque a veces te impulsa hacia atrás. Cuidado con no comprometerte por querer abarcarlo todo.

Sé sincero contigo. Escribe tu situación actual. No escapes al futuro en un falso optimismo.`,

    Capricornio: `Piel con un tono apagado, complexión huesuda. Orientado al futuro.

Sueles tratar de complacer a una figura paternal que percibes como estricta. ¿Quiénes son esas figuras en tu vida?

Desde la infancia, y luego en la adolescencia, te has sentido inadecuado. ¿Por qué? ¿Cómo podrías empezar a revertirlo? ¿Para qué lo mantienes?

Eres disciplinado, responsable, práctico y a veces frío. Deja de reprimirte tanto. Aprende flexibilidad: la rigidez no es fortaleza, es miedo bien vestido.

Escribe las maneras en las que te reprimes. Para soltar, primero hay que verse.

No intentes esquivar tus responsabilidades; en el fondo te sientes mejor cuando las cumples.

Trabajas duro y eres capaz de poner orden en el caos.`,

    Acuario: `Huesudo, angular, con rasgos armoniosos y dedos largos.

Tu papel es el del observador sin juicio. Tienes que dar un paso atrás y mirar desde fuera, en lugar de meterte en el centro de la actividad.

Te cuesta encontrar tu lugar y tu reconocimiento dentro de los grupos grandes; nunca acabas de encajar, y tampoco lo deseas del todo.

Tienes mucha esperanza puesta en un futuro mejor, y eso te lleva a un idealismo que a veces se aleja de lo posible: tus visiones de igualdad y fraternidad necesitan aterrizar para ser útiles.

Convivir contigo no siempre es fácil: puedes ser cabezota, irracional y bastante egocéntrico, aunque tus ideales sean honestos y fraternales.

Tu trabajo es aprender disciplina, paciencia y observación atenta. Esa es la brújula real que te permite moverte entre lo práctico y tus ideales más elevados sin perder el norte.`,

    Piscis: `Tendencia a las lágrimas fáciles. Cuerpo que cambia con el ambiente (ojo a esto, te afecta más de lo que crees). Dientes delicados, rasgos suaves. Tu apariencia tiene algo vulnerable y seductor a la vez.

Hipersensible, soñador, compasivo y místico, sueles ser poco práctico. Tu reto es aprender a gestionar tus emociones en lugar de dejarte arrastrar por ellas como por una marea.

Necesitas descubrir tu identidad propia sin olvidar que formas parte de algo mucho más grande.

Absorbes emociones y energías que no son tuyas. Aprender a diferenciarlas (y a soltar lo que no es tuyo) es esencial en tu camino.

Esa confusión puede empujarte a tres roles típicos: víctima, salvador o agresor. Puedes querer salvar a otros, o esperar que otros te salven. Cuidado con escapar a través de sustancias o de dejarte moldear demasiado por la influencia ajena.

Aprende a no sacrificarte por otros y a poner límites para que no se aprovechen de ti.`,
  },

  sol: {
    Aries: `**En sombra:** Puede que hayas tenido padres o educadores estrictos, emocionalmente castradores, o que te sientas bloqueado, incapaz de cambiar las cosas o de dejar huella. Lo peor que te puede pasar es dudar de tu propio poder y de tu capacidad.

Puedes volverte dominante, competitivo, con poca empatía y serias dificultades para gestionar tus emociones. Te muestras arrogante, irritable, intolerante, impulsivo, violento, combativo e imprudente. Escapas hacia el futuro a base de conquistas compulsivas, empujado por el miedo a no dejar marca en el mundo. En las relaciones te aburres rápido, porque necesitas seguir conquistando.

Puedes ser prepotente, egocéntrico, inestable, impaciente e inconsistente, con reacciones emocionales repentinas y poca reflexión detrás. Rechazas las reglas, los límites y las prohibiciones, y te sientes atrapado cuando te controlan.

**En luz:** Abierto a aprender, con confianza, independencia, ambición, generosidad, valentía y actitud conquistadora pero no tóxica. Eres un iniciador: dinámico, rápido, entusiasta, impulsivo y valiente.

Eres franco y directo. Dices lo que piensas sin violencia, y eres leal a tus "hermanos de armas". No te gusta que te regalen nada: necesitas sentir que lo has conquistado por ti mismo.

Necesitas libertad, aire libre y movimiento físico, y sueles identificarte con los niños. No soportas la indecisión ni el estancamiento. Eres individualista y autónomo: necesitas espacio e independencia para florecer.

El fracaso lo entiendes como aprendizaje. Vives en el presente, sin interés por el pasado, esquivando el peso del inconsciente colectivo y de los patrones transgeneracionales.

Tienes una vitalidad enorme y una energía vital descomunal. Apenas paras, apenas te cansas, y te empuja una fuerza profunda. Lo que necesitas es que te dejen en paz para moverte a tu propio ritmo.

**En alta frecuencia:** Valiente y capaz de reconocer lo que realmente quieres como individuo, más allá de lo que te imponen las lealtades ciegas que has interiorizado. Tienes la capacidad de pasar a la acción para perseguir tus deseos, pero sabiendo medir las consecuencias. Y entiendes que, aunque desees algo, no debes tomarlo ni perseguirlo si no te pertenece legítimamente.`,

    Tauro: `**En sombra:** Has perdido el control sobre la materialización de la energía. Pones tu seguridad en lo material y en lo fijo (dinero, posesiones, una pareja, un trabajo), porque necesitas que la realidad sea estable y duradera para sentirte a salvo. Cuando la Vida te exige cambiar, pierdes perspectiva y te desbordas.

Eres celoso hasta extremos absurdos, convencido de que el cariño y el afecto ajenos te pertenecen. Detrás de esos celos hay una carencia emocional profunda.

Eres terco y rígido. Rara vez te cuestionas, y te aferras a puntos de vista anticuados o directamente arcaicos. Te cuesta reconocer cuándo toca cambiar, y puedes quedarte atrapado en situaciones tóxicas durante años.

Puedes volverte insaciable, obstinado, lento, posesivo, codicioso, materialista, glotón, ingrato, perezoso y obsesionado con el dinero, la propiedad y el estímulo sensorial (comida, sexo, placer, "más"). Sueles desarrollar adicciones a tener, comer y consumir.

Tienes que aceptar la pérdida, entender que todo final es solo una transición.

**En luz:** Paciente, resiliente, firme, lento pero tenaz, conservador, hogareño, consciente, calmado, práctico, artístico, fiable, trabajador, leal y emocionalmente duradero.

Construyes seguridad material y económica, no solo para ti, sino para compartirla con los demás. Disfrutas del mundo físico (la comida, el tacto, la belleza, el placer sensual) y sabes hacer disfrutar a otros de la vida.

Eres tierra firme: estable, protector y profundamente fiable. Rara vez te enfadas, pero cuando lo haces es serio. Como el toro. Mejor apartarse.

Necesitas validarte a ti mismo al margen de lo que posees.`,

    Géminis: `**En sombra:** Neurótico, superficial, juicioso y maestro en justificarte mientras pierdes de vista la verdad. Irresponsable. Cuando las cosas no salen como quieres, te tensas y te hundes.

Los nervios te impiden alcanzar la calma física o intelectual, y en situaciones de emergencia puedes perder los papeles, aunque al final casi siempre encuentras una salida.

Puedes ser cambiante, dual, disperso, hiperactivo, nervioso, astuto, intrigante, inconsistente, demasiado hablador y emocionalmente insensible.

Maduras en Sagitario, buscando una verdad que no siempre cabe en tu mente analítica, y aprendiendo a profundizar en lugar de revolotear.

**En luz:** Profundidad, sociabilidad, orientación hacia fuera, amor por el aprendizaje, cultura, curiosidad, adaptabilidad, expresividad, talento verbal y literario, inteligencia (aprendes rápido y te aburres igual de rápido), racionalidad, objetividad, claridad mental, desapego y una necesidad fuerte de comunicar.

Eres buen profesor y comunicador, y sueles tener muchas amistades. En el amor buscas fraternidad y conexión intelectual.

Debes aprender y estudiar conectando con el corazón, los sentimientos y las emociones, en lugar de vivir solo en la cabeza y tu ruido mental.`,

    Cáncer: `**En sombra:** El apego te impide evolucionar. Das sin tener nada que dar, porque necesitas sentirte imprescindible. Hay un terror profundo a la soledad y a los finales. Cargas con un apego intenso, miedos hondos y obsesiones.

Eres lunático y muy vulnerable: tu estado emocional sube y baja como las mareas, y sueles perderte en fantasías poco prácticas. Tiendes a ser miedoso, aunque no te guste que se note. Cuando estás mal, eres capaz de arrastrar emocionalmente a quien tienes al lado.

Te hieres e influencias con facilidad: susceptible, retraído, negativo, caprichoso, fantasioso hasta confundir realidad y deseo, manipulador, perezoso, egoísta, autocompasivo, emocionalmente volátil, rutinario, sobreprotector y muy pendiente de lo que piensen los demás.

Maduras cuando entiendes que nada es un castigo y te atreves a salir de tu caparazón (tu casa, tus raíces) para crear las tuyas propias.

**En luz:** Familiar, maternal, imaginativo y receptivo. Tu meta es la seguridad emocional: necesitas un hogar. Tímido pero tenaz, intuitivo, hogareño, sensible, introspectivo, emocional, empático, tradicional, imaginativo y con una memoria que da envidia.

Necesitas desarrollar maestría emocional: ser capaz de sostenerte a ti mismo y sostener a otros sin apego, sin manipulación y sin depender de los demás o de una familia para existir.`,

    Leo: `**En sombra:** Cuando te sientes mediocre o insignificante, o cuando no consigues encontrarte, puedes volverte puro ego o hundirte en la depresión, buscando atención y validación fuera con verdadera desesperación.

Puedes volverte vanidoso, irritable, tiránico, dramático, exagerado, infantil, arrogante, pretencioso y cruel, con un miedo profundo al ridículo. Necesitas una "corte" de admiradores, y te deprimes cuando no estás brillando o cuando te has pasado de la raya por excesos varios.

Eres impaciente, exigente y dependiente del reconocimiento ajeno, en lugar del propio. No te gusta que te dirijan, pero sí que te adulen. Es frecuente que arrastres la ausencia de una figura paterna, es decir, una figura que te haga ver que es seguro "salir a cazar" y volver sano y salvo, que hay un suelo bajo tus pies, que puedes caerte y levantarte.

Tienes que aprender a ser, simplemente por el placer de ser, sin necesitar que nadie te aplauda.

**En luz:** Líder, expansivo, enérgico, voluntarioso, idealista, orgulloso, ambicioso, noble, sincero, creativo, romántico, generoso, optimista y con una confianza propia que se nota a metros. Eres organizado y sabes organizar, trabajador, hábil para detectar dónde hay oportunidad o negocio, y rebosas vitalidad. Iluminas a quien tienes cerca.

Necesitas amar (a veces con cierto dramatismo escénico), disfrutas expresando emociones y sentimientos, y eres especialmente bueno con los niños. Sueles tener muchas amistades y una presencia natural que atrae sin esfuerzo.`,

    Virgo: `**En sombra:** Rechazas tu propio caos interno en lugar de aceptar que no controlas el mundo. Tu curiosidad puede llevarte a tus propios "infiernos" internos. Cuando las cosas no salen como quieres, se activa el modo neurótico y de crisis: empiezas a limpiar, a ordenar o a intentar arreglar y gestionar la vida de los demás, en un intento de mantener tu propio caos a raya.

Tienes que trabajar el desapego de la madre; sin eso, la evolución se bloquea.

Lidias con una dualidad interna y un doble rasero que no siempre reconoces, y maduras en Piscis al darte cuenta de que no controlas absolutamente nada.

Puedes volverte crítico, tacaño, obsesivo, melancólico, egoísta, pedante, escéptico, descuidado, malhumorado, hipocondríaco, entrometido, victimista, con miedo a la enfermedad, la pobreza y la vejez. Puedes obsesionarte con la puntualidad, los números y los detalles, perder la perspectiva, cerrarte al disfrute y manipular a los demás.

**En luz:** Analítico, responsable, introspectivo, trabajador, metódico, científico, exigente, limpio y perfeccionista en el trabajo y en lo material.

Eres capaz de hacer crítica constructiva, ordenado, práctico, atento al detalle, gran conversador y observador agudo que retiene y analiza todo lo que pasa a tu alrededor.

Debes entender que todo tiene su propio orden, aunque no se comprenda al primer vistazo, y dejar de juzgar cuando las cosas no encajan con tus expectativas.`,

    Libra: `**En sombra:** Te falta objetividad para sostener el equilibrio en tus relaciones y te enredas en tus propias emociones. Te aferras a cómo crees que deberían funcionar la sociedad y los vínculos, y acabas atrapado en tus propios juicios. Como todos los signos de aire, toleras mal el dolor emocional.

Puedes necesitar rodearte de gente constantemente y depender de las relaciones externas para validarte. Te vuelves inconstante, apático, quejica, indeciso, indolente, autocrítico en exceso, fácil de persuadir y muy aficionado al camino que ofrece menos resistencia.

Eres hipersensible a la estética, lo piensas todo demasiado y vives en una incertidumbre constante. Puedes sentirte dependiente, impaciente, perezoso ("ya lo hará otro"), cobarde y angustiado ante cualquier decisión. El estatus social puede pesarte más de lo que reconoces.

**En luz:** Diplomático, sociable y capaz de mantener muchas relaciones en armonía. Pacífico, cooperativo, justo y orientado hacia el exterior.

Eres armónico, seductor, persuasivo, delicado, amable, prudente y artístico. Sabes ver más de un punto de vista y disfrutas del arte de seducir y conectar.

Debes cultivar la armonía en la dualidad sin necesitar a otra persona ni volverte dependiente.`,

    Escorpio: `Escorpio tiene tres niveles, y conviene que sepas en cuál estás:

1) **El Lagarto Gris:** preocupación neurótica, obsesiva y morbosa.
2) **El Escorpión:** hieres por el placer de herir, a veces como experimento. Recuerda que el escorpión se suicida después de picar.
3) **El Águila:** te elevas por encima de las limitaciones y observas sin quedar atrapado.

**En sombra:** Te enganchas al abandono, a la traición, a la humillación o a los finales dolorosos, y te escondes en un caparazón del que nacen los celos y la necesidad de control. Puedes volverte profundamente neurótico y adicto a relaciones tóxicas.

El primer paso es que reconozcas que tienes un problema y aceptes tu propia vulnerabilidad.

Eres capaz de penetrar la mente humana y detectar los puntos débiles ajenos casi sin esfuerzo, lo que te tienta a usar ese poder de formas poco sanas. Desprecias la debilidad en ti y en los demás, buscas venganza y puedes ser de verdad cruel, a veces con apenas unas palabras, aunque sueles preferir tomarte tu tiempo.

Te quedas atrapado en el poder y el control, los secretos, los celos, la exclusividad y la intensidad emocional.

Maduras cuando te apoyas en tus fortalezas y las reconoces como valores. Cuando creces, te conviertes en un gran "terminador" de lo que ya no corresponde, de lo que está podrido. Te liberas al soltar.

**En luz:** Penetrante, introspectivo, capaz de una fusión profunda, con una curiosidad real (nada superficial), misticismo, conciencia, pasión, poder, vulnerabilidad y una enorme capacidad de regeneración.

Eres leal, no le temes a la muerte, profundamente concentrado, determinado, sagaz y persistente. Tu voluntad férrea, tu valentía y tu confianza propia te permiten alcanzar tus metas y ejercer autoridad con integridad.

**En negativo:** Vengativo, envidioso, autodestructivo, crítico destructivo, temperamental, demasiado reservado, arrogante, violento, sarcástico, obsesivo, secretista, manipulador (porque conoces los secretos de los demás), cruel, celoso, tiránico, excluyente, intolerante, obsesionado con el poder y el control, con una vulnerabilidad excesiva que puede llevarte a la depresión.

Debes reconocer los procesos y los finales de la vida sin apego, viéndolos como fases naturales de las que aprender.`,

    Sagitario: `**En sombra:** Te aferras a una única verdad y te cierras a seguir buscando, porque temes descubrir la mentira que hay detrás. También puedes convertir tus revelaciones en dogma rígido.

**En negativo:** Exagerado, demasiado hablador, desmedido, brusco, impaciente, agresivo, pragmático a destiempo, inquieto, difuso, rebelde, imprudente, moralmente flexible, impulsivo, desconectado de la tierra (siempre proyectado al futuro) y con poca empatía.

Tienes que recordar que lo importante es el viaje hacia la tierra prometida, no el destino. Te desconectas con facilidad del momento presente y de la realidad práctica.

Maduras al encontrar tu fuego interno y desarrollar humildad y compasión. Debes entender que, para ti, dejar de buscar se siente como morir, y que a veces los "demonios" se esconden en los detalles que tanto te aburren.

**En luz:** Extrovertido, adaptable, vital, entusiasta, optimista, ético, sabio, profético, franco, filosófico, valiente, apasionado, amante de la libertad, comprensivo, generoso, justo, independiente y expansivo.

Eres viajero por naturaleza. Disfrutas de la Vida en amplio espectro: alegre, extrovertido, idealista, explorador, inquieto y siempre en movimiento. Los signos de fuego son signos de misión, y la tuya la vives como algo casi divino.

Debes saber que hay un sentido profundo en todas las cosas, aunque no pueda percibirse del todo, y dejar que tus acciones fluyan desde esa conciencia.`,

    Capricornio: `**En sombra:** Construyes muros internos y externos para sentirte a salvo, y te vuelves paranoico con el control. Uno de tus peores miedos es sentirte pequeño y no respetado frente a una estructura superior (una empresa, el Estado, la autoridad).

Puedes volverte rígido, miedoso y obsesionado con la seguridad, el estatus y el control. Maduras cuando aprendes que los únicos límites que importan de verdad son los que tú eliges conscientemente, no los que te imponen desde fuera. Tienes que descubrir tu propio valor y convertirte en tu propio padre.

**En luz:** Ambicioso, serio, responsable y nada impulsivo. Piensas dos veces antes de actuar (a veces tres). La vida puede sentirse cuesta arriba (por eso cargas tantos miedos), pero si insistes, acabas llegando.

Eres autodisciplinado, práctico, metódico, perseverante, austero, prudente, eficiente y trabajador. Razonas bien y mantienes la cabeza fría.

Reservado y leal, con un fuerte sentido de la dignidad. No te gusta llamar la atención. Respetas las leyes y las reglas, y te tomas las responsabilidades muy en serio.

Temes la dependencia en la vejez, pero no envejecer ni el paso del tiempo en sí. La salud puede darte guerra sobre todo en la infancia y la juventud, y de joven sueles parecer mayor de lo que eres.

**En negativo:** Egoísta, dominante, demasiado conservador, cruel, fatalista, susceptible, pesimista, resentido, aislado, terco, reprimido, sufridor, rígido, frío, distante, miedoso y obsesionado con el estatus y la seguridad material; buscas reconocimiento, pero te falta espontaneidad y alegría.

Debes encarnar la responsabilidad como una virtud profunda, dejando una huella positiva en el mundo que perdure más allá de tu vida.`,

    Acuario: `**En sombra:** Ves las emociones como algo peligroso, porque amenazan tu esquema mental y tu visión del mundo. Tus sistemas éticos y morales son muy rígidos, y dejan poco espacio a la empatía o a la espontaneidad. Te desconectas de los ciclos biológicos y de los ritmos emocionales.

Maduras desarrollando intimidad sin miedo. Para eso, tienes que conocerte y aceptarte de verdad, y disfrutar de tu propia esencia.

Disfrutas de las posesiones, pero no eres codicioso. Trabajas mejor con personas, sobre todo con quienes persiguen ideales universales. Integras información y gente con una facilidad que va más allá de la simple buena memoria.

**En negativo:** Difícil de conocer de verdad. Temperamental, frío, rebelde, despectivo con los sistemas establecidos, excéntrico, radical, tímido pero impredecible, con reacciones bruscas o inesperadas.

Puedes ser dogmático, utópico, ansioso, frustrado por el sufrimiento del mundo, nervioso, terco, rígido y convencido de que lo entiendes todo. Tienes convicciones profundas más que principios fijos, y puedes parecer perverso u obstinado al defenderlas.

**En luz:** Excéntrico, decidido, intolerante con la hipocresía y empeñado en vivir en un mundo más refinado e igualitario. Original y creativo, buscas alcanzar y compartir una conciencia más alta, casi cósmica.

Independiente, ingenioso, tolerante, creador ("crear lo nuevo"), lógico, intelectual, fraternal, amistoso, leal y altruista. Puedes parecer frío o insensible, porque te resulta más fácil amar a muchos que conectar profundamente con uno solo.

Tienes una capacidad notable para integrar personas e ideas, y rindes mejor en entornos colaborativos orientados a ideales universales.

Debes desarrollar conciencia de que todos estamos conectados con todo y con todos, sin perder tu propia individualidad: debes saber quién eres y cuál es tu propósito dentro de esa red.`,

    Piscis: `**En sombra:** Escapas porque no sabes gestionar lo que percibes, acabas interiorizándolo todo y ahogándote con dolor que no es tuyo. Puedes oscilar entre salvador, víctima y verdugo.

**En negativo:** Demasiado hablador, melancólico, influenciable, deshonesto, propenso a las adicciones, obsesivo, pesimista, depresivo, emocionalmente reprimido, escapista, tímido, poco práctico, malinterpretado, ingenuo, irracional, frágil, irreal y reacio a enfrentar dificultades o tomar decisiones.

Tu tendencia a huir de la realidad o a esconderte detrás de unas gafas de color de rosa no te sirve. Te cuestan las dificultades, evitas la confrontación y prefieres retirarte antes que pelear.

Maduras cuando dejas de querer que las cosas sean de otra manera, aprendes a fluir y entiendes que sanar el dolor del mundo no está en tus manos (pero sí puedes sanarte a ti y entiendes que eso es colaborar en la salvación del mundo). Para encontrar paz, tienes que "nadar contra corriente" en lugar de tomar siempre el camino más fácil.

**En luz:** Soñador, tolerante, amable, compasivo, creativo, espiritual y místico. A menudo poco práctico y demasiado confiado, eres capaz de conseguir cosas enormes sin hacer ruido.

Eres dulce, encantador, caritativo, intuitivo, hospitalario, generoso, introspectivo, artístico e imaginativo en tu forma de percibir. Llevas a otros más allá de la realidad convencional, hacia lo invisible. Te adaptas con facilidad y tienes un sexto sentido para lo que los demás desean (de ahí tu olfato para las tendencias o la moda).

Tienes fe, y necesitas que los demás tengan fe en ti.

Traes lo intangible a lo tangible, a veces a través del arte, pero siempre de una manera creativa y única.`,
  },
};

/**
 * Textos por (planeta, casa) — se rellenan más adelante.
 */
export const TEXTOS_CASA: Partial<Record<CuerpoKey, Partial<Record<number, string>>>> = {};

export function getTextoSigno(planetaKey: string, signo: string): string | null {
  return TEXTOS_SIGNO[planetaKey as CuerpoKey]?.[signo] ?? null;
}

export function getTextoCasa(planetaKey: string, casa: number): string | null {
  return TEXTOS_CASA[planetaKey as CuerpoKey]?.[casa] ?? null;
}
