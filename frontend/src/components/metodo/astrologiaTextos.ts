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

  luna: {
    Aries: `Competencia con la madre. Vives a tu madre como una enemiga: agresiva, reactiva, emocionalmente intensa, que da muchas órdenes o que se comporta con agresividad. Si eres mujer, te has visto obligada a competir contra ella; si eres hombre, temes a tu madre y a las mujeres en general.

Tienes una necesidad fuerte de acción, movimiento, novedad y cambio; la rutina te aburre profundamente. Te desarrollas a través de la experiencia y de las situaciones nuevas, y te sientes a salvo cuando estás moviéndote, tomando la iniciativa y actuando.

"Dependo de mí mismo para que nadie me diga lo que tengo que hacer." Quieres hacer las cosas a tu manera y no toleras la interferencia de otros, ni siquiera cuando el consejo es acertado.

Necesitas ser visto y captar atención. Tus impresiones sensoriales son muy rápidas, y actúas sobre ellas en el momento, sin reflexionar. Tus explosiones emocionales son repentinas, intensas y breves: berrinches fuertes que se queman rápido y se abandonan igual de rápido. Explotas, sueltas y sigues.

Detrás de esa apariencia agresiva hay una inseguridad profunda. Pareces emocionalmente aislado, rara vez pides ayuda y prefieres apoyarte enteramente en ti mismo. Tu forma de protegerte es a través de la acción: en un accidente no lloras, actúas, intervienes y salvas a otros.

Tiendes a dominar más que a ser abiertamente agresivo; emocionalmente, intentas dominar a los demás y te tomas muy a pecho las reacciones ajenas. La cercanía y la intimidad emocional pueden percibirse como una agresión. Es posible que el contacto físico, como los abrazos, pueda desagradarte o sentirse invasivo.

No aceptas con facilidad la autoridad, las reglas ni los consejos. No te van los detalles, no eres metódico y te falta perseverancia.

Funcionas mejor en trabajos enérgicos y activos que requieran movimiento e iniciativa, en lugar de rutina o precisión. Tienes una fuerte iniciativa para desligarte del entorno familiar. Te mueves mucho durante el sueño y puedes disfrutar de la comida picante.

**Afligida:** impulsividad excesiva, mal genio y actuar sin pensar en las consecuencias.

**En mujeres:** tendencia a dominar a la pareja. **En hombres:** tendencia a buscar una pareja dominante.

**Transgeneracional:** líneas de mujeres que tuvieron que asumir toda la responsabilidad y hacerlo todo solas porque los hombres estaban ausentes.`,

    Tauro: `Tienes un apego muy fuerte a tu madre. Ella te ha dado buena comida, buena ropa y comodidad material. El vínculo es intenso, pero no necesariamente emocionalmente feliz o sano.

Necesitas conexión con la tierra, nutrición y el momento presente. El amor lo experimentas a través de la satisfacción corporal: la comida equivale a seguridad, el dinero equivale a afecto, y la seguridad material y la emocional se confunden. El contacto físico es esencial. Te sientes a salvo cuando el cuerpo está satisfecho; la comida y el dinero te dan sensación de seguridad y bienestar.

Bajo estrés, inseguridad o peligro, puedes comer en exceso o, a veces, dejar de comer del todo. Tienes el foco muy puesto en lo material y quieres la mejor calidad en todo. Necesitas construir una base económica sólida para sostener tu seguridad emocional, y tarde o temprano descubres que la verdadera seguridad viene de dentro.

El arte, la belleza, el contacto físico, el apego, la lealtad y la fidelidad son valores centrales para ti. Eres afectuoso, sentimental, tímido, orgulloso y a menudo celoso. Eres firme en tus ideales y deseos, y necesitas satisfacer tus apetitos físicos. Tus sentidos, sobre todo el tacto y el gusto, están muy desarrollados; sueles tener una voz agradable o potente, y puedes tender a un cuerpo más bien robusto.

Asimilas las experiencias despacio pero con constancia. Una vez te comprometes con una relación o un proyecto, no lo abandonas hasta terminarlo. Te gusta terminar las cosas, y no empiezas nada nuevo hasta cerrar lo anterior, aunque a menudo necesitas un empujón externo para arrancar. Con la madurez, puedes ser muy bueno creando seguridad material y entornos nutritivos para ti y para los demás, y también enseñando a ello.

Estableces relaciones duraderas y valoras la estabilidad. Tu conciencia de los ciclos vitales, en sombra, puede manifestarse como inercia o pereza.

**Afligida:** terquedad excesiva y resistencia al cambio; apego a creencias, tradiciones o patrones familiares; intolerancia, convencionalismo, orgullo, celos, pereza, búsqueda de comodidad y avaricia. Puedes acumular ahorros en exceso y volverte demasiado austero.

**En mujeres:** buscas una pareja que te aporte seguridad y estabilidad. **En hombres:** sueles atraer parejas leales que apoyan e impulsan tus ambiciones.

**Transgeneracional:** líneas familiares marcadas por haber perdido dinero en el pasado, lo que lleva a una tendencia a acumular o ahorrar en exceso.`,

    Géminis: `Vacío emocional y falta de vínculo con la madre. La madre es una mujer inteligente, ocupada, versátil y emocionalmente poco disponible. Por eso, inconscientemente, puedes acabar buscando la figura materna en una hermana, una amiga u otra relación cercana. Es frecuente que la abuela o una hermana mayor tuviera que asumir el rol maternal.

Te gobierna la mente más que el corazón. Priorizas entender intelectualmente lo que te pasa, pero no te paras a sentir de verdad el dolor emocional. Las emociones las vives como una debilidad. Muchas veces no sabes si estás pensando tus emociones o sintiéndolas realmente, y tiendes a alejarte de la emoción a través del pensamiento.

Desconstruyes la realidad (separas la emoción de la experiencia) para sentirte a salvo. Tienes que aprender a observar las emociones sin negarlas, escaparte de ellas o intelectualizarlas. Lo que escuchas o lees puede tener un impacto emocional fuerte sobre ti, aunque no lo reconozcas conscientemente. Tienes una necesidad enorme de comunicar, expresar y entender lo que te pasa. Cuando no te expresas, te saboteas a través de la comida. Tu alimentación suele girar en torno a la comida rápida o basura, sobre todo cuando estás triste, estresado o emocionalmente bloqueado.

Versátil, ágil, observador, ingenioso y hábil con la palabra. Puedes hablar sin parar, a veces hasta llegar a irritar al otro, y eres muy nervioso e inquieto. Sueles hacer varias cosas a la vez y rara vez te concentras en una sola. Por esa misma versatilidad, puedes dejar proyectos a medias.

Prefieres la variedad a la profundidad y tiendes a buscar una intimidad inmediata y momentánea más que vínculos emocionales a largo plazo. La fidelidad puede costarte. Eres reservado con lo personal, emocionalmente frío y un punto superficial en tu expresión emocional.

Son frecuentes los viajes cortos, los cambios de residencia y el movimiento constante. No eres especialmente intuitivo, pero eres muy bueno haciéndote una primera impresión rápida y poniéndola en palabras. Disfrutas clasificando, analizando y observando a los demás. Funcionas bien en actividades de comunicación, manualidades y trabajos artesanales. Tienes buena habilidad manual y un olfato agudo.

**Afligida:** dispersión, nervios, frialdad emocional, tendencia al cotilleo, superficialidad e inquietud mental.

**En mujeres:** poco interés por los roles domésticos o de cuidado; superficialidad en lo emocional. **En hombres:** buscas una mujer intelectual capaz de adaptarse en todos los niveles.

**Transgeneracional:** linaje familiar marcado por dificultades con la educación, estudios interrumpidos o falta de escolarización formal.`,

    Cáncer: `Tienes un apego muy fuerte a tu madre, aunque ese vínculo no es necesariamente sano ni positivo. La vives como una figura que te nutre desde la manipulación, a menudo poniéndose por encima de los demás y transmitiéndote mensajes como: "Nadie te va a querer nunca como yo." Eso te genera dependencia emocional y confusión.

Tu funcionamiento emocional es altamente maternal y femenino. Tienes un deseo intenso de convertirte en padre o madre y de crear tu propio hogar y familia, que vives como tu refugio principal y tu fuente de seguridad. El amor por la casa y la familia es fuerte, y tus relaciones tienden a ser más románticas que pasionales. Eres profundamente empático y estás muy sintonizado emocionalmente con los demás.

De verdad intentas entender y cuidar lo que sienten los otros, pero tienes que aprender a no quedarte "poseído" por sus emociones. Tiendes a mezclar tus propias emociones con lo que percibes en ellos, absorbiendo sus vibraciones negativas, lo que te lleva al desbordamiento y a la infelicidad.

Esperas que los demás intuyan lo que sientes, porque tú mismo intuyes lo que sienten ellos. Cuando eso no ocurre, te sientes invisible, no querido y frustrado. Te metes en tu caparazón como forma de protegerte.

Extremadamente sensible e impresionable, te afectan mucho los cambios externos y los ambientes emocionales. Sobreprotector, controlador e hipersensible, puedes nutrir a otros en exceso mientras descuidas tus propias necesidades emocionales. Tienes que aprender a poner límites y a responsabilizarte de tus propias emociones en lugar de proyectarlas en otros.

Cuando te sientes emocionalmente mal, sobre todo en relación con la madre, puedes sabotearte con la comida, comiendo en exceso o dejando de comer. La seguridad financiera te importa, y no soportas el despilfarro.

Sueles actuar de forma calmada y cautelosa, ocultando lo que realmente sientes. Tus impresiones son precisas y certeras, pero no siempre las accionas. Tu mente es reflexiva, con reacciones emocionales lentas, inciertas o difíciles de prever. Te atraen la cocina, el arte y la expresión creativa. Tienes tendencia a la obsesión y al resentimiento cuando tus necesidades emocionales no son atendidas. Puedes percibir el mundo como un sitio hostil. Tienes que dejar de buscar una figura materna en los demás y evitar aislarte, porque eso te vuelve vulnerable a que se aprovechen de ti. Cuando eso pasa, el resentimiento se acumula.

**En mujeres:** emocionalmente vulnerable, pero dominante dentro del hogar. **En hombres:** tiendes a buscar una figura materna en lugar de una compañera de igual a igual; puedes ser hipersensible.

**Transgeneracional:** líneas familiares marcadas por madres ausentes, perdidas o fallecidas por abandono o muerte.`,

    Leo: `Madre dominante que se presenta a sí misma como una reina y que te enseña que tú también eres rey o reina, que mereces un trato especial y que puedes menospreciar a quien no te trate como tal.

En la infancia, puedes haber centrado tu mundo emocional en un familiar creativo, brillante, que te quería y te hacía sentir único; esa figura suele quedar idealizada. Sueles ser el favorito de los abuelos.

Confundes afecto con admiración: si no te sientes admirado, no te sientes querido, y si la admiración desaparece, te vas. Tienes una inclinación clara al drama, a la expresión emocional teatral y a una sensación inflada de importancia. Necesitas validación constante para sentirte emocionalmente nutrido y especial, idealmente de alguien a quien admires profundamente. Cuando el mundo no te da esa admiración, te retiras y te vas a vivir a la fantasía.

Brillante, seguro y carismático, pero propenso a sabotearte mientras esperas el reconocimiento externo. Tiendes a idealizar a otros y puedes vivir a la sombra de alguien. Eres seguro y firme, te interesa sobre todo lo que te afecta directamente, y no toleras la interferencia ni la crítica una vez has decidido el rumbo.

Sientes y actúas directamente desde el corazón, no desde la mente. Tu vida emocional está muy ligada al ego, y a menudo te falta objetividad emocional. Juzgas a los demás rápido y sabes poner a cada uno en su sitio. Tu temperamento es fogoso, egocéntrico, noble y apasionado.

Magnetismo sexual, dotes de liderazgo, ambición y una necesidad fuerte de "amar y ser amado". Cuando algo te interesa, te metes muy rápido. Todo lo que aprendes pasa por el filtro de tus emociones. Cuesta convencerte, y a ti mismo te cuesta ceder.

Tienes que aprender conscientemente a amarte y admirarte. Solo entonces descubres el amor verdadero. El desarrollo de un amor propio auténtico es esencial.

Esta Luna puede ser muy buena para criar hijos y ayudar a otros a desarrollar su autoestima. También puede haber una afinidad fuerte con los animales y con cuidarlos.

**En mujeres:** apasionada, con una necesidad fuerte de reconocimiento y admiración. **En hombres:** romántico y juguetón, o arrogante y dominante; te atraen mujeres brillantes, con talento, visibles socialmente y con buen gusto.

**Transgeneracional:** mujeres del linaje familiar que abandonaron su propio camino de vida o su vocación personal para convertirse en madres.`,

    Virgo: `Naciste en una familia marcada por un orden excesivo o por un caos excesivo. Desde la infancia, creces asumiendo responsabilidad por lo que ocurre a tu alrededor, a menudo creyendo que solo recibirás amor si eres útil y te haces cargo. Por eso te quedas sin una infancia despreocupada y puedes no saber disfrutar de la Vida con espontaneidad.

Experimentas contención y restricción, y sueles percibir a tu madre como emocionalmente distante, demasiado crítica o poco emotiva, con reglas estrictas en torno al orden y la limpieza. Tu forma de querer es a través del servicio, e impones dirección en las relaciones porque crees saber lo que es mejor. El amor, para ti, es práctico y funcional: dar ayuda concreta, regalos útiles o ser de utilidad. Para sentirte querido, necesitas que los demás se den cuenta de tus esfuerzos y los reconozcan en voz alta.

Eres racional y analítico, estudias y analizas las impresiones con detalle, normalmente con buena memoria. Tiendes a sobrevalorar tus propios procesos e insights y a infravalorar las experiencias emocionales de los demás. El conocimiento solo lo aprecias si tiene aplicación práctica. Sueles racionalizar tus emociones, creando una distancia interna con lo que sientes, y puedes parecer emocionalmente ansioso o cauto.

Eres conservador, trabajador, práctico, detallista y perfeccionista. Tu foco meticuloso en pequeños detalles puede hacerte perder la imagen general y construirte un mundo pequeño y controlable a tu alrededor. Son comunes los viajes cortos y las amistades variadas, aunque rara vez muestras curiosidad real por la vida de los otros.

Tiendes a tener una expresión sexual baja. Eres modesto, tímido y sencillo, pero excelente organizando el caos y poniendo orden en tu entorno. Con el tiempo, tienes que aprender a servirte a ti mismo, no solo a los demás.

Eres propenso a la somatización cuando ignoras tus propias necesidades o el presente, con posibles trastornos digestivos, nerviosos o alimentarios. Tienes un interés fuerte por la salud, los cuidados alternativos, la higiene y la nutrición.

**Afligida:** preocupación neurótica por detalles insignificantes, intimidad funcional en lugar de emocional, falta de confianza en ti mismo, foco excesivo en ser útil en lugar de querer realmente y perfeccionismo que se pierde lo importante de la vida.

**En mujeres:** falta de seguridad, frialdad emocional. **En hombres:** buscas una pareja independiente, que ni demande ni dé afecto en exceso.

**Transgeneracional:** líneas familiares marcadas por hacerse cargo de familiares enfermos o dependientes.`,

    Libra: `Tu madre te hacía querer a personas a las que en realidad no querías, dándole más peso a la apariencia social que al sentir auténtico. De niño te obligaban a interactuar con visitas o parientes, aprendiendo modales y etiqueta social a costa del juego espontáneo y despreocupado.

Valoras la feminidad, la armonía y la delicadeza. No toleras los gritos, la agresividad ni nada que sientas "fuera de lugar". Si te rebelas, puede que lo hagas vistiéndote mal o de forma provocadora como vía de expresión.

Eres muy social y necesitas comunicarte. Complaciente, diplomático y dependiente, te apoyas en el reconocimiento ajeno para definirte. Consideras importante el matrimonio, incluso si el amor no es lo central. Tu casa es bonita, estéticamente cuidada y llena de actividad social. Rara vez actúas solo, y te nutres a través de la conexión con otros.

Eres muy sensible a las reacciones y actitudes ajenas, especialmente las de las personas que te importan. Tiendes a vivir las emociones a través de la mente, sobreanalizando lo que sientes en lugar de simplemente sentirlo. Tienes que aprender a confiar en ti, a decir que no, a no depender tanto de los demás y a dejar de analizar las emociones en exceso.

Eres amable, encantador, popular y tolerante. Valoras el equilibrio y la armonía, y las relaciones poco armónicas pueden afectarte la salud. Buscas aprobación para sentirte seguro, y sueles agradar a los demás con cortesía y elegancia.

**En mujeres:** elegante, excelente anfitriona, te gustan los entornos y la ropa bonita, le das mucha importancia al matrimonio. **En hombres:** buscas parejas elegantes, atractivas, sociables, divertidas e inteligentes.

**Transgeneracional:** familias en las que los modales y las apariencias se priorizaron por encima del amor; matrimonios de conveniencia más que por afecto.`,

    Escorpio: `Tu madre es tóxica, excesivamente posesiva, controladora, asfixiante, dramática o demasiado idealizada por ti. Tu madre carga con duelos no resueltos, pérdidas o traumas que nunca llegaron a procesarse antes de tenerte. Sueles tener una conciencia y un miedo fuertes en torno a la muerte y a los finales.

Tu madre puede "engullirte": el amor se siente como perderte a ti mismo. Por eso, puedes evitar la intimidad, temiendo que la cercanía emocional te haga daño o te permita hacérselo a otros. Vives pérdidas cíclicas y transformaciones profundas, y a menudo pones a prueba a los demás para ver cuánta vulnerabilidad puedes mostrar sin peligro.

Eres intenso, apasionado, sexual y muy perceptivo, capaz de ver más allá de las apariencias y detectar lo que el otro esconde. Cuando te comprometes, es total: no hay punto medio. Tienes una capacidad excelente para acompañar a otros a través del trauma, el duelo y los procesos emocionales difíciles.

Lo que te nutre está muy ligado a la transformación, la muerte, los finales y las experiencias emocionales profundas. También te nutren las conversaciones hondas, los temas esotéricos y la exploración de lo desconocido. Si no trabajas esta Luna, puedes dejarte "devorar" emocionalmente por otros con tal de no sentir el abandono.

Tienes que aprender el perdón, la compasión y la capacidad de sacrificarte por causas que valgan la pena. Tienes una personalidad profunda e intensa, defensiva y reservada, propensa a los celos y a los silencios. Sueles ejercer dominio sobre tus hijos y experimentar intensidad en las relaciones íntimas.

**Afligida:** excesos sexuales, perversión, obsesiones emocionales, resentimiento, manipulación, control sutil y tendencia a la venganza. Detectas con facilidad las debilidades ajenas y puedes explotarlas si no estás sanado.

**En mujeres:** propensión a la promiscuidad sexual, al tormento emocional y a los conflictos familiares. **En hombres:** te atraen mujeres sensuales, dóciles pero sutilmente dominantes, capaces de intuir tus sentimientos, ya que tú mismo sueles ser callado y reservado.

**Transgeneracional:** líneas familiares marcadas por historias ocultas, abusos sexuales o de poder, secretos, y a veces prácticas ocultistas o esotéricas.`,

    Sagitario: `Creces en un entorno emocionalmente poco fiable. Tu madre vive su propia vida (distante pero generosa) y te enseña a relajarte, a "fluir" y a no preocuparte demasiado por el futuro. En la infancia sueles tener provisión constante, lo que te da confianza en la vida. Eres alguien criado en una familia abierta y exploradora, a menudo con exposición a viajes o influencias extranjeras.

Eres sociable, independiente y enérgico, con una necesidad fuerte de libertad. Te nutres viajando, viviendo aventuras y ayudando a otros a encontrar sentido a sus vidas. Eres un anfitrión, maestro y sanador natural, y creas espacios que dan propósito a otros. Eres inquisitivo, profético y de percepción clara, pero puedes carecer de continuidad en los proyectos y, a veces, hablar de forma impulsiva.

El optimismo es central para ti, aunque puede ser poco realista. Aspiras a metas altas, pero a veces te falta una base práctica, y eso te lleva a la decepción o a la depresión cuando aparecen las limitaciones. Tu optimismo tóxico puede impedirte procesar las emociones del todo. Eres espontáneo, imprudente y muy independiente. Pueden estar presentes fuertes tendencias psíquicas.

**Afligida:** optimismo ingenuo, estrechez de miras, superioridad moral, imprudencia y dificultad para ahorrar. Puede aparecer irresponsabilidad emocional o financiera cuando ignoras las lecciones sobre los límites.

**En mujeres:** excesivamente independiente, "sin obligaciones", a veces desligada de la familia o de las responsabilidades domésticas. **En hombres:** matrimonios tardíos, múltiples romances o infidelidades.

**Transgeneracional:** familias nómadas, migrantes o exploradoras; linajes que incluyen sanadores, maestros y guías.`,

    Capricornio: `Naciste en una familia en la que la madre es emocionalmente distante y exigente. Desde antes de nacer te enseñan a minimizar tus necesidades, creyendo que el amor y la aprobación se ganan con esfuerzo y logro. El afecto de tu madre se equipara con el reconocimiento por lo conseguido, más que con un apoyo emocional genuino. El espacio emocional se siente inhóspito, y los sentimientos suelen ser grises y austeros: aprendes a no pedir nada.

Te pasas buena parte de la vida buscando el reconocimiento de tu madre. Sueles crear estructuras que hacen que los demás se sientan seguros, a menudo desde un lugar de dependencia, esperando recibir amor a cambio. Tienes que aprender a cultivar la ternura, a dar y recibir libremente y a disfrutar de la vida sin esperar siempre validación.

Eres hipersensible, aunque no abiertamente emotivo. Puedes parecer frío, crítico o reservado. Confiar te lleva tiempo, y sueles tomarte las cosas como algo personal. Hacer amigos te cuesta, y a veces te comunicas mejor con personas mayores o con figuras de autoridad. Tu crítica refleja el valor que le das al otro, y eres muy sensible al rechazo, justificándote a menudo en exceso.

Las tendencias depresivas pueden manifestarse como pesimismo, melancolía, tacañería y seriedad excesiva. Priorizas la estabilidad material por encima de los valores espirituales, y eres muy cauto con el dinero. Eres responsable, trabajador y entregado, con perseverancia y habilidad práctica en aquello que te involucra.

**Afligida:** depresión crónica, sensación de soledad, búsqueda de poder o prestigio a cualquier precio, dificultad para confiar en tu propio valor, austeridad emocional e hipersensibilidad a la crítica.

**En mujeres:** tendencia a la melancolía y a la sensación de no ser querida. **En hombres:** buscas mujeres que apoyen tus ambiciones, lleven una casa cómoda y gestionen bien las finanzas.

**Transgeneracional:** familias con un legado de abandono emocional o sacrificio, particularmente mujeres solitarias que vivieron vidas de renuncia y responsabilidad. Es habitual una influencia parental fuerte, con antepasados que trabajaron duro, a menudo solos, con poco reconocimiento y poco afecto.`,

    Acuario: `Creciste en un entorno emocionalmente poco fiable, tu madre es una madre-niña que te obligó a convertirte en el cuidador. Tu madre es imprevisible: no se puede contar con su presencia, su ausencia ni su estado emocional. El afecto es inconsistente, y eso te deja incapaz de confiar plenamente o de aceptarlo, con tus necesidades emocionales sin atender.

Aprendes desde pronto que todo el mundo es reemplazable. La seguridad emocional se desliga de los vínculos biológicos, y estás siempre preparado para la pérdida. Puedes usar las conexiones sociales para llenar un vacío interno, pero la amistad suele ser más importante para ti que la familia. La libertad se convierte en tu única forma de seguridad. Tienes que desarrollar conscientemente la autosuficiencia y trabajar los cierres y las despedidas sanas.

Creces con una percepción amplia y una mente abierta, aprendiendo a menudo a navegar la incertidumbre con practicidad e idealismo. Eres original, inventivo, imaginativo y creativo, y sueles preferir caminos poco convencionales. Tus impresiones sensoriales son rápidas y precisas, lo que te permite anticipar situaciones por adelantado.

Leal y honesto, necesitas espacio personal y autonomía, pero valoras las amistades significativas. Puedes tener dificultades con las relaciones íntimas y no entender con facilidad las necesidades emocionales de los demás. Si te faltan objetivos o propósito, puedes deambular buscando algo indefinido.

**Afligida:** rebeldía, apego evitativo, miedo a que las relaciones comprometan tu libertad, desapego excesivo, excentricidad, inconstancia y frialdad emocional.

**En mujeres:** muy desapegada, orientada a la mente y desconectada de tus emociones. **En hombres:** igualmente desapegado; te atraen mujeres liberadas e independientes.

**Transgeneracional:** familias marcadas por el exilio, el abandono o la inestabilidad mental; antepasados emocionalmente no disponibles o socialmente marginados.`,

    Piscis: `Creciste sintiéndote emocionalmente desbordado, a menudo solo, sin que nadie te pregunte qué necesitas realmente. Tu madre puede ser tóxica, sobreprotectora o idealizada, creando un ambiente de amor asfixiante que no te deja ser tú mismo. Puedes terminar idealizándola o guardándole rencor.

Muy emocional y sensible, tienes que aprender a poner límites a los miedos de tu madre y a distinguir la nostalgia o el equipaje emocional colectivo de tus propias necesidades reales. A menudo no sabes quién eres y puedes imitar a otros inconscientemente. La disociación y la racionalización emocional son comunes en ti, y rara vez sabes pedir lo que necesitas: te apoyas en que los demás te lo anticipen.

Vulnerable, sensible e hipercompasivo, eres propenso a la depresión y a la autocompasión. Conseguir lo que deseas puede angustiarte por la intensidad con la que vives las emociones. Tienes que desarrollar sentido común, autonutrición y autosostén: esencialmente, aprender a ser tu propia madre.

Eres psíquicamente sensible, propenso al desánimo y puedes perder contacto con la realidad. Eres compasivo por naturaleza, amable y perdonador, pero tu hipervulnerabilidad puede crearte dificultades en las relaciones. Necesitas entornos armoniosos, protectores y amorosos para sentirte emocionalmente a salvo.

**Afligida:** sueño excesivo, consumo de sustancias, autoengaño, melancolía, dependencia, mentalidad de víctima, neurosis y pensamientos obsesivos. Según los aspectos, esta Luna puede darte una visión psíquica profunda o llevarte a la ilusión total y a la confusión emocional.

**En mujeres:** magnéticamente atractiva; emociones mal gestionadas pueden manifestarse en problemas de salud; matrimonio tardío. **En hombres:** buscas una esposa idealizada, devota, afectuosa y comprensiva; importante para tu vida personal, pero no necesariamente para tu carrera o influencia social.

**Transgeneracional:** antepasados ausentes, desaparecidos o emocionalmente no disponibles; esta Luna refleja una síntesis de la energía femenina dentro de la familia.`,
  },

  mercurio: {
    Aries: `Tu mente está proyectada hacia el futuro y prospera con los retos mentales. Muy imaginativo y de pensamiento rápido, hablas con soltura e improvisas con naturalidad, especialmente en situaciones críticas, lo que te convierte en un solucionador de problemas nato. Eres argumentativo, de lengua afilada y sarcástico; quedarte callado no es lo tuyo.

Deseas ser el primero en todo. Esa misma vitalidad mental que te impulsa hace también que cambies de opinión impulsivamente y te cueste terminar lo que empiezas. Impaciente, combativo y a veces egoísta, sueles arrancar muchos proyectos, pero rematarlos te resulta otra historia.

Puedes ser un lector y escritor compulsivo, siempre con hambre de conocimiento y de expresar lo que piensas.

Te animo a que te hables a ti mismo en voz alta —sin insultarte, por favor— pero tienes que darle salida a esa mente eficaz tuya. Si te apetece escribe, pero algo me dice que no es lo tuyo.

**En negativo:** terquedad, egocentrismo, mal genio e irritabilidad.`,

    Tauro: `Tienes una visión mental del mundo enraizada en la materia: necesitas construir, experimentar y comprender a través de la experiencia física y tangible. Te apoyas en lo directo y en lo que se saborea, no en la teoría abstracta.

Eres terco, con gustos y rechazos muy definidos, pero esto es porque te apegas a lo ya conocido. Te atraen el dinero, los placeres sensoriales y el arte. Tu mente es cauta y metódica; rara vez abandonas lo que empiezas y prefieres llegar a conclusiones desde la experiencia. La practicidad guía tu pensamiento, lo que te hace hábil en los negocios, la gestión y las tareas que requieren precisión.

Eres discreto, realista y con los pies en la tierra, aunque la originalidad y la imaginación pueden estar limitadas. El control te importa: necesitas dominar tu entorno y tus procesos. Comprendes a través del tacto, la observación y la interacción física. Tratas las palabras como posesiones: todo lo que se dice queda guardado, recordado y valorado, tienes buena memoria.

**En negativo:** terquedad excesiva, rigidez, aprendizaje lento y avaricia.`,

    Géminis: `Lógico y curioso, tienes una necesidad insaciable de aprender: un "pozo sin fondo" de información. Saltas de un tema a otro, y si no integras esa dispersión mental, puede acabar generándote una sensación de vacío interior. Tienes que aprender a profundizar, a concentrarte y a comprender, no solo a memorizar.

Tienes una memoria excelente y unas habilidades comunicativas expresivas, a menudo acompañando con las manos lo que dices. El pensamiento es algo distinto del sentir: necesitas habitar el cuerpo, no solo vivir en la cabeza. Requieres cambio, variedad y estímulo mental, porque el aburrimiento se te activa rápido.

Versátil, impersonal y sin prejuicios, tu inteligencia se apoya en la lógica, el pensamiento asociativo y la memoria. Te atraen más las preocupaciones del mundo real que las preferencias emocionales, lo que puede hacerte parecer superficial si no equilibras con foco. El movimiento, los viajes y la novedad son esenciales para tu bienestar.

Si Mercurio quedó poco desarrollado en tu infancia o adolescencia (si se restringió tu curiosidad), puedes tener problemas con la indecisión, la confusión, la falta de continuidad, la tensión nerviosa y el agotamiento mental.

Te recomiendo organizarte el día siguiente antes de irte a dormir, eso te ayudará a poder enfocar tu rápida mente en tareas concretas y así no derrochar energía buscando "lo siguiente".

Te van las ocupaciones intelectuales, la escritura, la oratoria, la enseñanza o cualquier rol que requiera pensamiento rápido y agilidad mental.

**En negativo:** dificultad para tomar decisiones, inconsistencia en tus ideas, nervios, agotamiento mental y, a veces, problemas físicos como vulnerabilidades respiratorias. Aun así, incluso afligido, te luces aportando soluciones en situaciones urgentes.`,

    Cáncer: `Eres muy sensible a tu entorno y a las emociones de los demás, y a menudo confundes lo que sientes tú con lo que sienten los otros. Tu memoria, excepcional, está especialmente sintonizada con la familia, el clan y la historia ancestral: recuerdas historias, patrones emocionales y linaje con precisión.

Tiendes a interpretar las emociones más que a escuchar con objetividad, anclándote en el pasado. Necesitas procesar del todo las experiencias emocionales para poder regresar al presente. Puedes confundir sentimientos con pensamientos, y eres muy sensible al elogio y a la validación externa.

Puede aparecerte una obstinación cuando las obsesiones emocionales se imponen a los hechos. A veces emocionalmente inestable, con una tendencia a creer que los demás están constantemente hablando de ti o juzgándote.

Escribe, ¿qué te da tanto miedo que piensen de ti? ¿Por qué? ¿Para qué? ¿Piensas eso tú de ti?

Sabes escuchar, aunque la objetividad puede costarte. Puedes destacar en los negocios, pero tu verdadera preferencia es el hogar y la familia.

**En negativo:** pensamiento demasiado teñido por la emoción, inestabilidad, falta de honestidad y una sensación persistente de estar siendo observado o juzgado.`,

    Leo: `Persuasivo e inspirador, tienes una mente que capta las ideas rápido y las convierte en realidad. Tu energía mental es potente, creativa y muy concentrada, y a veces puede rozar la arrogancia o la vanidad.

Tu pensamiento está guiado por el corazón: lo que comunicas lleva calidez, magnetismo y resonancia emocional. Te dejas influir con facilidad por los elogios y los halagos, y sueles acercarte a la vida con idealismo, romance y pasión.

Elegante, digno y ambicioso, te esfuerzas por causar buena impresión y deseas con naturalidad liderar y ser reconocido. Resuelves los problemas de forma estratégica, pero lenta; puedes pasar por alto los detalles, aunque tu perseverancia te permite afinar y mejorar las ideas de los demás.

Te relacionas con facilidad con niños y jóvenes, y tus palabras y tu presencia pueden inspirar y elevar a quienes te rodean.

**En negativo:** terquedad, indulgencia, irritabilidad, exageración y egocentrismo.`,

    Virgo: `Crítico, analítico y muy juicioso, eres emocionalmente reservado y extremadamente detallista, a veces de forma excesiva. Organizado, metódico, a menudo tímido, diseccionas la información por naturaleza buscando patrones y contrastándolos con la realidad. Tu mente clasifica y ordena todo lo que encuentra, transformando el conocimiento en beneficios prácticos, tangibles o materiales.

Tiendes a acumular conocimiento u objetos, aunque algunos os resistís a ello conscientemente. Escéptico, lógico e impersonal, valoras la eficiencia y la practicidad, y evitas las conversaciones vacías o superficiales. El perfeccionismo te empuja, pero también puede impedirte ejecutar tus planes.

Sueles reprimir las emociones y el dolor, negándote a reconocer lo que te bloquea; esto puede manifestarse como síntomas somáticos. Eres tu propio crítico más duro, propenso a la hipocondría, sobre todo en lo relacionado con la limpieza, el estrés o la salud. La tensión mental se te traduce fácilmente en malestar físico, así que aprender a relajarte es esencial.

Metódico, técnico y disciplinado, te luces en áreas donde se valoran la precisión, el análisis y la aplicación práctica: medicina, higiene, investigación o cualquier trabajo que requiera una organización meticulosa.

**En negativo:** crítica excesiva, foco obsesivo en los detalles, perfeccionismo que impide la acción, rigidez e intolerancia hacia quienes percibes como menos competentes.`,

    Libra: `Te esfuerzas por entender a todo el mundo, recogiendo información de todas partes para mantener la armonía. Amable, racional y conciliador, eres imparcial y orientado a la justicia, buscando el equilibrio en lo que piensas y en tus relaciones. Te importan la apariencia, el buen gusto y la elegancia, no por juicio, sino por una aversión natural a lo vulgar.

Las relaciones están en el centro de tu vida mental; a través del diálogo y la observación llegas a ser consciente de ti mismo. Haces preguntas, observas el comportamiento ajeno y tratas de entender al otro, a menudo sobreanalizando para asegurarte de que haya equidad y justicia.

Indeciso por naturaleza, evitas las decisiones precipitadas y odias la confrontación. Cuando se atacan tus principios, puedes volverte irracional, porque tu compromiso con la justicia y la armonía pesa más que la conveniencia. Si te excedes en indecisión, evitas el conflicto o no te implicas en los retos, puedes caer en la superficialidad, la inconsistencia o una variabilidad excesiva en pensamiento y conducta.

Floreces en ocupaciones que impliquen diplomacia, psicología, relaciones públicas, enseñanza o negociación: campos que premian el tacto, la comprensión y el juicio imparcial.

**En negativo:** demasiado titubeante, excesivamente variable, fácil de influir, impaciente con quienes son decididos, y propenso a la superficialidad si nadie te reta o te estimula.`,

    Escorpio: `Mente profunda, intensa, investigadora. Siempre hay algo escondido, siempre hay más bajo la superficie. Muy intuitivo y perceptivo, con una capacidad natural para detectar la sombra ajena. Desconstruyes la realidad porque intuyes que las cosas rara vez son lo que parecen.

Terco y lento para cambiar de opinión: necesitas investigar a fondo antes de sacar conclusiones. Tu comunicación es directa, precisa y penetrante. Prefieres decir lo que sientes a quedarte callado, y tus palabras pueden ser afiladas o cortantes cuando hace falta. Una vez que has decidido lo que piensas, eres muy difícil de persuadir.

Muy inteligente, crítico, enérgico, incisivo y reservado. Sueles conseguir lo que quieres, a veces reconociendo (e incluso aprovechando) las debilidades de los demás. Los factores emocionales pueden mermarte temporalmente esa cualidad incisiva.

Te luces en campos investigativos, analíticos o transformadores: trabajo detectivesco, forense, química, estudios ocultos, investigación o grandes empresas de negocio.

**En negativo:** desconfianza excesiva, sobrefoco en el sexo o en los temas tabú, tendencias manipuladoras, juicios duros contra los desfavorecidos o explotación de las vulnerabilidades ajenas.`,

    Sagitario: `Pensamiento inspirado e inspirador, futurista y estimulante. Anhelas la novedad y los nuevos modelos de pensamiento. Muy inteligente, capaz de comprender conceptos abstractos con claridad. Puedes reconstruir el todo a partir de un solo detalle. El pasado rara vez te interesa; te preocupan más las actitudes que los meros hechos. Buscador incansable de la verdad, lector voraz e intuitivo por naturaleza para captar el sentido profundo de la vida.

Muy honesto, a veces demasiado. Impulsivo, directo y entusiasta. Hablas con facilidad, a menudo sin filtrar las consecuencias, y disfrutas siendo reconocido como alguien intelectual. Tu humor puede ser sarcástico. Los viajes y la exposición a ideas nuevas te recargan.

Excelente profesor y comunicador. Captas grandes cantidades de información y sabes hacerla viva y entretenida, aunque tienes que aprender a darle dirección a tu mente para no caer en la dispersión y la superficialidad. Te mueves con naturalidad en la enseñanza superior, la filosofía y los temas religiosos o espirituales.

**En negativo:** pedante, propenso a dar lecciones, con juicios prematuros sobre los demás, dispersando el foco y con posibles dificultades en los viajes.`,

    Capricornio: `Mente tradicional, estratégica y calculadora. Planificas con cuidado y actúas de forma deliberada, guiado por una disciplina y una memoria fuertes. Una vez que te concentras, persistes hasta que las tareas están terminadas y las ideas llevadas a forma concreta.

Tiendes a la cautela o al pesimismo, hasta que desarrollas un sentido del humor seco o algo oscuro. Tu mente está orientada a anticipar lo que podría salir mal, con un perfeccionismo agudo y una concentración intensa.

Respetas las creencias establecidas, valoras la estructura, las reglas y la autoridad, y eres en general más práctico que idealista. Centrado en lo tangible, en la mejora económica y en el estatus social, eres diplomático y estratégico cuando persuades a otros.

**En negativo:** demasiado ambicioso y materialista sin tener en cuenta a los demás, mentalmente rígido, dogmático, o con una educación interrumpida.`,

    Acuario: `Objetivo, rápido, original e independiente. Observas la realidad con claridad y percibes las tendencias antes de que se manifiesten. Muy mental, innovador y atraído por estudios e ideas poco convencionales, incluidas la ciencia, la tecnología, la naturaleza humana y el ocultismo.

Absorbes los conceptos abstractos con facilidad y aprendes de forma autónoma, valorando la originalidad, aunque analizas cuidadosamente antes de cambiar de opinión.

No eres emocional, lo que te permite percibir las subjetividades con objetividad. Tu mente es muy mental, ingeniosa e intuitiva, capaz de ver la verdad de forma imparcial. Buscas aceptación social y estímulo mental a través de las amistades, a menudo perteneciendo a grupos y asociaciones diversas. Excelente para la astrología, la metafísica y otros temas esotéricos.

La tensión mental y el estrés son habituales en ti; cultivar el silencio, el foco y la quietud mental es esencial. Cuando te desequilibras, puedes pensar mucho sin pasar a la acción, volverte excéntrico, terco, demasiado hablador o arrogante.`,

    Piscis: `Psíquico e intuitivo, aprendes por absorción y puedes tener memoria fotográfica. Tu mente es meditativa y romántica.

Vulnerable y un punto taciturno, necesitas un entorno armónico, porque tu mente está muy activa a nivel subconsciente y absorbes lo que no es tuyo.

Indeciso a la hora de elegir. No se te dan bien las respuestas cerradas o definitivas. Escondes lo que realmente piensas como forma de intimidad.

Mezclas realidad y fantasía sin esfuerzo, lo que te hace excelente para la escritura de fantasía, la música, la poesía y otras búsquedas artísticas.

**En negativo:** pérdida de conexión con la realidad, pesimismo, confusión, fobias, pensamientos mórbidos, complejos, autocompasión, desorden mental y mala memoria.`,
  },

  venus: {
    Aries: `Impulsivo, audaz y apasionado, te mueves por el deseo, la iniciativa y el impulso de conquistar. Sientes una atracción inevitable hacia la energía de Aries: el coraje, la acción, la presencia física y la vitalidad. Te atraen las personas entusiastas, auténticas y ardientes, a menudo atléticas o físicamente trabajadas, y tienes una presencia magnética que te vuelve vivaz y cautivadora en el amor.

Eres expresivo, comunicativo y auténtico, con una naturaleza emocional fogosa y a veces agresiva. Tus pasiones son inmediatas e intensas, y tiendes a ponerte a prueba sexualmente, disfrutando de la conquista y la emoción. Puedes detestar la monotonía o las restricciones impuestas. Esto no significa que seas infiel, sino que para ti, las relaciones tienen que ser algo vibrante y ardiente.

La independencia y la libertad son esenciales para ti; no puedes florecer si otros dictan tus deseos, especialmente la familia o las convenciones sociales. La lealtad es posible, pero solo si se respeta tu autonomía personal. Tu amor debe reavivarse constantemente para sentirte vivo, vibrante y plenamente comprometido.

La apariencia y el magnetismo personal son importantes; atraes la atención de forma natural, y tu energía inspira y emociona a quienes te rodean. A menudo eres impulsivo y algo egocéntrico en tus deseos, buscando satisfacción inmediata e intensidad emocional. Abordas las relaciones con audacia e iniciativa, y sueles preferir la expresión directa antes que la sutileza o los largos rituales de cortejo.

Puedes tener matrimonios precipitados, conductas impulsivas, modales bruscos o toscos, falta de consideración hacia los demás y dificultad para moderar tus deseos. Debes aprender a pausar, reflexionar y cultivar sensibilidad hacia las necesidades del otro, equilibrando tu fuerte impulso con consideración y tacto.

Esta posición también enfatiza la expresión del corazón a través del coraje, la asertividad y la pasión. El amor es un terreno de acción, emoción y prueba de los propios límites, más que una experiencia pasiva o nutritiva. Cuando se integra, te otorga magnetismo, entusiasmo y la capacidad de inspirar, seducir y energizar a los demás de forma natural, manteniéndote leal y amoroso siempre que se respete tu independencia.`,

    Tauro: `Buscas, por encima de todo, estabilidad emocional y relacional. Formas vínculos duraderos y leales, y eres profundamente sentimental, valorando la consistencia y la permanencia por encima de los gestos vistosos o los regalos. Eres muy sensual, táctil y receptivo, y prefieres las relaciones y los placeres que se desarrollan despacio y de forma natural. La paciencia y «entrar en calor» son esenciales; amas lo que crece con el tiempo y necesitas la seguridad de que tu vínculo no será abandonado.

Puedes volverte celoso o posesivo si percibes una amenaza a la seguridad de tus relaciones, pero tu lealtad es profunda cuando te sientes emocionalmente seguro. Instintivo y muy sensual, estás conectado al tacto, al aroma y a los placeres sutiles de la vida.

Eres diplomático, refinado, y disfrutas del lujo, mostrando a menudo elegancia y un gusto cuidado. Aunque tu acercamiento sea naturalmente pasivo, sacas el máximo partido de la atracción que inspiras y recuerdas a quienes te tratan bien.

Puedes tener matrimonio tardío, terquedad excesiva, rigidez, aumento de peso o dificultades para confiar y abrirte emocionalmente. Cuando se integra, esta Venus te concede la capacidad de crear relaciones amorosas y duraderas, construidas sobre la sensualidad, la profundidad emocional y el respeto mutuo.`,

    Géminis: `Necesitas cambio constante y estímulo mental. Vives el amor a través de la comunicación, la curiosidad y el juego, más que por el apego emocional profundo. Tus vínculos se forman a menudo a través de las palabras, las ideas y los intereses intelectuales compartidos.

Tiendes a aburrirte rápido y puedes saltar de una relación o experiencia a otra. El matrimonio o los compromisos a largo plazo pueden repetirse o tomarse a la ligera, ya que tu necesidad de explorar y descubrir es fuerte.

Deseas la amistad con todo el mundo y te atraen las personas que te resultan familiares. Eres generoso, independiente, amistoso y poco ofensivo, con un encanto natural y un talento literario o verbal que atrae a los demás.

La libertad de movimiento y de pensamiento es esencial, y tus relaciones con hermanos, vecinos o amigos suelen tener un significado especial.

Puedes tener inconsistencia, superficialidad o infidelidad. Cuando se integra, expresas el amor a través del intercambio intelectual, la conversación viva y las conexiones lúdicas y estimulantes, pero eres capaz de cultivar vínculos emocionales más profundos cuando hace falta.`,

    Cáncer: `Eres muy sensible, idealista y emocionalmente perceptivo, aunque a menudo escondes tu vulnerabilidad tras una apariencia estable y digna.

Reaccionas de manera instintiva y emocional, y tus estados de ánimo pueden fluctuar. Tus sentimientos están fuertemente influidos por la familia, el entorno del hogar y la seguridad emocional o económica.

Te atraen las parejas nutritivas y necesitas ternura, cuidado y seguridad emocional. La comunicación y las muestras de afecto son esenciales para ti. A menudo asumes el papel de pilar emocional de la familia, organizando reuniones y manteniendo los vínculos. La inseguridad puede despertar celos o posesividad.

Puedes volverte excesivamente sensible, emocionalmente reactivo, propenso a enfurruñarse y fácilmente frustrado. Es posible que aparezca interferencia familiar u oposición a tus relaciones.`,

    Leo: `Vives amores intensos, dramáticos y tal vez algo egoicos. Adoras el lujo, la comodidad y los placeres de la vida, y a menudo disfrutas mostrando a tu pareja, tus posesiones o tus logros.

Ves la vida como un escenario y necesitas reconocimiento y admiración para sentirte valorado y amado. Si te ignoran, tu ego puede volverse insaciable.

Eres naturalmente atractivo y no puedes ocultar lo que deseas o buscas. Amas con pasión y buscas ser amado con la misma intensidad. La atracción y la conquista forman parte de tu experiencia, y la infidelidad puede surgir por inquietud o por la necesidad de validación. Tu lealtad es fuerte hacia quienes verdaderamente amas, aunque puede aparecer la posesividad si te sientes amenazada.

Puedes ser egoísta, esnob o desviar tu energía, lo que conduce a la decepción o al desacierto en el amor.`,

    Virgo: `Eres analítico y contenido hacia el amor. Para ti la limpieza es importante. Tienes conflictos internos y eres autocrítico, escapas de la intimidad pero en verdad la anhelas.

Muestras el amor señalando lo que se puede mejorar, creyendo que eso es cuidar. Esto molesta mucho a aquellos que lo reciben, debido a que en verdad solo suelen buscar tu aprobación.

Evalúas las relaciones de manera práctica e incluso analítica: «¿Esta relación me funciona?». Para ti, las relaciones tienen que «venirte bien» y poder cuadrarlas con tus horarios.

Te atrae lo útil y funcional, incluyendo la salud y el bienestar. Existe una profunda compasión hacia los verdaderamente vulnerables, y a menudo asumes el rol de cuidador o sostén, pero debes evitar hacerte responsable de la vida de los demás.

La sexualidad puede ser conflictiva, a veces explorada de forma obsesiva y mental a través de libros, pero sin práctica o con miedo o incomodidad a ello.

Necesitas autosuficiencia, independencia y satisfacción interna. Tu expresión emocional es limpia, controlada y medida. Trabajas para mantener relaciones funcionales y armoniosas, pero te retiras si el sistema no fluye, normalmente después de intentar «arreglar» al otro.`,

    Libra: `Expresas un fuerte interés por la apariencia, la belleza y la armonía. Eres naturalmente encantador y buscas ser atractivo, admirado y apreciado.

Las relaciones y la gracia social son centrales: eres sensible a los sentimientos de los demás y te esfuerzas por mantener la paz y el equilibrio a toda costa.

Eres complaciente por naturaleza, a menudo das para asegurarte de que los demás te necesiten o te quieran. Esto puede generar dependencia, ya que a veces ocultas el desorden interno o comprometes tu propia verdad para evitar el conflicto.

Eres muy selectivo, buscas el amor ideal, y puedes frustrarte cuando la realidad no está a la altura de tus estándares.

La seducción y la atracción se dan a través de la elegancia, el refinamiento y la belleza formal. Valoras el estímulo intelectual, aunque tu ambición es moderada. La armonía en las parejas, el matrimonio y las relaciones sociales es crucial para ti, y detestas la discordia.

Cuidado con ser superficialidad o tener una fuerte dependencia de los demás y de sus opiniones. Tienes que hacerte cargo de ti, tu opinión importa.`,

    Escorpio: `Deseas y ofreces un amor intenso, profundamente emocional y transformador. Vives las relaciones como una fusión total con el otro. Te atraen los extremos emocionales, el abismo, el sexo y la transformación profunda.

Tu amor es apasionado, lo consume todo. Carga con miedo y profundidad a la vez, porque eres consciente de que nada dura para siempre.

Rechazas la superficialidad y buscas la esencia en todas las conexiones. Reservado y digno, puedes sentirte resentido o desolado si el progreso o el crecimiento se ven bloqueados. Tu intensidad emocional puede oscilar entre el adormecimiento y la empatía profunda.

Existe una atracción natural hacia experiencias poderosas y transformadoras, y a veces hacia parejas que te desafían a enfrentar tus propias sombras.

Si no la integras conscientemente, puedes volverte celoso, obsesivo, controlador o autodestructivo, y atraer parejas igualmente intensas o destructivas.

Aprender la autointegración y el equilibrio emocional es esencial para evitar la obsesión y la devastación.`,

    Sagitario: `Tienes emociones abiertas, idealistas y espirituales. Vives el amor como un viaje de descubrimiento, crecimiento y propósito compartido.

Eres alegre y sociable. Declaras tus sentimientos abiertamente. Tienes una fuerte necesidad de libertad, exploración e integridad moral.

Eres tolerante con los defectos pequeños, pero intolerante con la pereza moral, la mezquindad o la falta de propósito. Tu pareja ideal es honesta, filosófica, ética y está alineada con tus valores.

Las relaciones deben inspirarte crecimiento, movimiento y sentido de aventura: te resistes a la rutina o al estancamiento.

Si no está bien integrada, puedes ser rígida, excesivamente franca, superficial o evasiva, soñando con un futuro mejor en lugar de comprometerse con el presente.`,

    Capricornio: `Buscas seguridad y pones el énfasis en la estabilidad emocional y financiera. Te atrae la fiabilidad, la solidez y las parejas que pueden ofrecerte seguridad, y a veces buscas inconscientemente ser «rescatada» por alguien más fuerte, más establecido o con autoridad. Puedes percibir a tu pareja como una figura parental o guía.

Temes el rechazo y, por eso, controlas estrechamente tu vulnerabilidad, mostrándote a menudo distante o emocionalmente reservado. Das ternura y apertura emocional con cautela.

Eres muy sensual y respondes al contacto físico, aunque puedes haber reprimido tu expresión sexual. Una vez comprometido, eres extremadamente leal y dedicado, y entras en las relaciones con seriedad y a largo plazo.

La figura paterna o las experiencias parentales tempranas influyen fuertemente en tus patrones emocionales. Experiencias pasadas de abandono o inseguridad pueden manifestarse como autocontención, frialdad emocional o exceso de cálculo en las relaciones. Prefieres la calidad antes que la cantidad y valoras una inversión emocional cuidadosa y responsable.

La preocupación excesiva, la frialdad emocional, el aislamiento, el sobrecontrol y la dificultad para expresar el afecto puede darse.`,

    Acuario: `Atraído por la libertad, la novedad y las conexiones poco convencionales. Buscas parejas estimulantes, inusuales o diferentes. A menudo te enamoras de la idea de una persona o de alguien que encarna tus ideales. El estímulo mental y emocional es esencial; las amistades pueden convertirse fácilmente en la base del romance.

Te resistes a la intensidad emocional y prefieres vivir según tus propias reglas. Sin libertad, puedes volverte emocionalmente deprimido o buscar la huida. Tu sensualidad es calmada, contenida y serena.

Eres socialmente popular y querido, y valoras a las parejas que respetan tu independencia y te aportan variedad y estímulo mental.

Puedes tener frialdad emocional, arrogancia, terquedad, desapego y sexualidad excéntrica o poco convencional.`,

    Piscis: `Anhela una unión total e incondicional. Simboliza el amor divino en la Tierra, pero esa intensidad también puede hacer que sin amor, te sientes perdida, vacía o a la deriva.

De corazón tierno, compasivo y profundamente sensible, eres naturalmente místico, romántico y empático. Al menos así vives tus relaciones.

Te atraen las personas heridas o que sufren, y a menudo intentas salvarlas, aunque esto te dañe. Las relaciones secretas u ocultas son comunes, y un solo comentario negativo puede herirte profundamente.

Lo que realmente buscas es la fusión perfecta, una unión completa de corazones y almas. Eres muy sensible y puedes parecer reservado o retraído para protegerte del dolor emocional.`,
  },

  marte: {
    Aries: `Trazas tu propio camino en la vida y eres el primero en pasar a la acción. Te resistes a la influencia, rara vez escuchas consejos y vives según el lema «vive y deja vivir», aunque prosperas más con la competencia que con la colaboración.

Independiente, vigoroso y autoritario, posees iniciativa, energía en bruto y un fuerte impulso para alcanzar tus metas. La rutina te aburre, y eres un líder naturalmente entusiasta que inspira a otros con su dinamismo.

Expresas tu energía agresiva a través de estallidos repentinos que pasan rápido. Esas erupciones liberan la energía acumulada y te permiten pasar al siguiente desafío. Si aprendes a medir las consecuencias, canalizar tu fuerza y cultivar la paciencia, dejas de malgastar energía en explosiones impulsivas y te vuelves muy efectivo e influyente.

La sexualidad es un aspecto importante de tu naturaleza: fuerte, apasionada e instintiva. Una vez satisfecho el deseo, tu interés suele desplazarse hacia el siguiente desafío, reflejando tu energía inquieta y orientada hacia adelante. Cuidado porque esto puede causar problemas.

Cuidado con tener accidentes o lesiones, en la cabeza. Deseos e impulsos descontrolados. Alta irritabilidad e impaciencia extrema. Dificultad para canalizar la energía con eficacia.`,

    Tauro: `Actúas con paciencia, reflexión y persistencia. No dejas las tareas a medias y estás decidido a llegar al final, avanzando de manera firme y segura hacia resultados tangibles.

No eres agresivo por naturaleza; respondes con decisión y firmeza solo cuando lo que es tuyo se ve amenazado. Tu enfoque es práctico, deliberado y duradero, lo que te hace muy apto para trabajos que requieren esfuerzo a largo plazo, cultivo o labores cuyos resultados se despliegan con el tiempo.

Eres terco e inflexible, y a menudo pareces tranquilo y seguro mientras avanzas en silencio hacia tus metas. Sabes ganar dinero y tienes un enfoque personal, a veces indulgente, hacia el gasto. Puedes ser muy crítico con los demás y al mismo tiempo permisivo contigo mismo. Rara vez olvidas las ofensas: el resentimiento puede durarte toda la vida.

Sexualmente, eres sensual y físico, más que imaginativo. El deseo está estrechamente ligado a la posesión y a la satisfacción de necesidades tangibles.

Puedes tener una ambición excesiva, esto se debe a que piensas que no vales y tratas de conseguir mucha materia, pensando que así vales más. Puede haber violencia movida por celos o posesividad y resentimiento profundo y duradero.`,

    Géminis: `Eres muy activo, mentalmente dinámico, observador e inquieto. La disciplina puede serte difícil porque tu atención se dispersa con facilidad: tiendes a tomar muchas direcciones a la vez, con varias «ventanas» abiertas en la mente. El estímulo mental constante es esencial; sin él, te vuelves disperso y desenfocado.

Posees excelentes reflejos, habilidad manual y reacciones rápidas, y a menudo haces malabarismos con varias tareas o trabajos a la vez. Conducir rápido, pensar rápido y manejar varias cosas simultáneamente te sale de forma natural.

Eres hábil con las palabras. En baja frecuencia, usas estrategias como «tú empezaste» para justificar tus respuestas. La argumentación y el debate te estimulan, y cuando necesitas liberar ira, puedes provocar a los demás para justificar la represalia.

El deseo sexual es principalmente mental. Necesitas imaginación, imágenes o descripciones verbales para activar el deseo. Puedes alternar entre relaciones superficiales y profundas, y rara vez te encuentras satisfacción con una sola pareja.

Puedes tener discusiones excesivas y sarcasmo. Irritabilidad e inquietud. Falta de disciplina. Infidelidad.`,

    Cáncer: `La frustración y la tensión emocional impulsan a menudo tu energía, generando una sensación de «la vida es dura conmigo». La familia y el hogar son profundamente importantes, pero también son las áreas donde ocurren los mayores conflictos, manipulaciones y desafíos emocionales.

Puedes ser persistente, pesado y emocionalmente exigente cuando no se trabaja conscientemente. Son comunes las tendencias pasivo-agresivas, la dramatización emocional y la ira reprimida. Cuanto más consciente y autoconsciente seas, más constructivamente podrás expresar esta energía.

Proteges con fiereza tu seguridad emocional y el bienestar de tu familia. Cuando deseas algo, insistes una y otra vez y te mantienes firme en tu posición. En situaciones de emergencia puedes parecer calmado, estable y fiable, pero en la vida diaria la ira no resuelta puede interiorizarse, somatizando a veces en problemas de estómago. La moderación y la gestión emocional son importantes.

Sexualmente eres refinado y sensible, percibiendo intuitivamente las necesidades de tu pareja, lo que a menudo te convierte en una amante muy hábil y atento.

Puedes haber tenido frustración emocional profunda y conducta pasivo-agresiva. Conflictos dentro del hogar. Asuntos intensos relacionados con la madre, incluyendo la posibilidad de una pérdida materna temprana.`,

    Leo: `Necesitas ser el primero e irradias naturalmente magnetismo personal, lo que atrae a los demás hacia ti. Deseas conquistar y triunfar, y a menudo piensas: «Lo quiero porque me lo merezco». Tienes un fuerte impulso para liderar, tomar la iniciativa y afirmarte, asumiendo a menudo un rol de macho alfa o de liderazgo. Cuando tu energía y tu ambición se bloquean, puedes frustrarte e incluso deprimirte.

Generoso, divertido, apasionado y carismático, puedes inspirar y motivar a otros a perseguir sus metas mientras alcanzas las tuyas. Destacas uniendo esfuerzos colectivos y liderando grupos, pero debes cultivar la humildad y aprender a actuar sin buscar siempre el reconocimiento. Tiendes a ver la vida a lo grande y abordas los desafíos con entusiasmo y audacia.

Sexualmente eres apasionado, cálido y conquistador. Expresas el deseo física y emocionalmente, usando el encanto y el afecto para cautivar a tu pareja. Eres demostrativo y afectuoso, y esperas lo mismo a cambio. A veces puedes volverte celoso o posesivo.

Cuidado porque puede haber una pérdida de energía a través de despliegues dramáticos de autoridad. Egoísmo marcado. Frustración o depresión cuando no logras afirmar tu liderazgo o triunfar.`,

    Virgo: `Estás enfocado en la funcionalidad, la eficiencia y la precisión. Quieres que las tareas se hagan correctamente y a menudo crees que nadie lo hace mejor que tú.

La rutina no te molesta; te gusta completar las tareas a fondo y de manera sistemática. Eres trabajador, y a menudo das instrucciones a los demás sobre cómo realizar su trabajo, lo que a veces puede crear tensión.

Eres tranquilo, lógico y metódico, disfrutas entender cómo funcionan las cosas y asegurarte de que todo opere correctamente. Aunque quieres integrarte con fluidez en tu entorno, puede costarte aceptar las ideas de los demás, ya que crees que es tu responsabilidad completar el trabajo tú misma o guiar a otros para que lo hagan.

Debes tener cuidado de no sobrecargarte ni negarte descanso y ocio, ya que esto puede derivar en problemas de salud. La pasión sexual es moderada, prefieres estudiar y aprender cómo dar placer, en vez de dejarte llevar por la pasión.

Tendencias hipercríticas y perfeccionistas pueden darse. Puedes necesitar de forma compulsiva demostrar que eres la única que conoce la forma correcta.`,

    Libra: `Eres reflexivo, persuasivo y encantador, capaz de inspirar o convencer a otros para que actúen según tu voluntad. Buscas equidad, equilibrio y armonía para ti mismo, y a respetas las reglas y las normas sociales. Disfrutas de amigos, de participar en actividades sociales e introducir nuevas ideas.

A veces puedes confundir tus propios deseos con lo que crees que los demás esperan de ti. Puedes actuar inicialmente según expectativas percibidas y solo después afirmar tus verdaderas necesidades. Aprender a confiar en ti misma y no depender de la validación externa es esencial para tu crecimiento personal.

Sexualmente, te estimula el ambiente, la belleza y la armonía. La música, la iluminación, los aceites y un entorno sensual realzan el deseo y la intimidad.

Puedes tener tendencias manipuladoras. Dificultades en sociedades, colaboraciones o matrimonio. Confusión entre los deseos personales y las expectativas ajenas.`,

    Escorpio: `Eres intenso, de todo o nada, y profundamente poderoso. Operas con estrategia, timing y paciencia, y rara vez actúas sin saber qué sirve a tus objetivos. Bajo tus acciones late un impulso de poder y transformación. Eres muy capaz de percibir profundidades ocultas, entender lo que está bloqueado o disfuncional y transformar las situaciones a fondo, como un cirujano que extirpa lo que ya no funciona.

Eres emocionalmente intenso, disciplinado y autosuficiente, y esperas la misma fiabilidad de los demás. Tu aire de misterio puede provocar desconfianza, aunque a menudo enmascara tus verdaderas intenciones.

Rara vez atacas de frente; esperas el momento adecuado para actuar, actuando cuando los demás están vulnerables, yendo directo a la raíz. Eres estratégico, terco e inflexible, te atrae el misterio y anhelas la fusión y la conexión profunda, aunque puedas reprimir tus deseos por miedo a perder el control.

Sexualmente, eres intenso, emocional, poderoso y reservado. Seduces despacio, estudias las vulnerabilidades y puedes ser extremadamente celoso y obsesivo. Tu deseo suele estar reprimido u ocultado para mantener el control.

Perfecto para la regeneración, la transformación y el trabajo con lo oculto o bloqueado. Apunta a la disfunción y al estancamiento, facilitando un cambio profundo.`,

    Sagitario: `Eres un explorador de espíritu libre que se mueve con audacia y optimismo, buscando aventura, crecimiento y desarrollo personal. Eres atrevido, ambicioso y a menudo impaciente o imprudente, lanzándote a nuevas ideas sin estudio ni preparación.

Detestas la rutina y la burocracia que desgasta la energía, y los compromisos te resultan limitantes, especialmente en las relaciones. La actividad al aire libre te energiza mucho más que los gimnasios o el ejercicio en interiores.

Te expresas con pasión, vitalidad y coraje, inspirando a menudo a los demás con tu entusiasmo y optimismo. Tu idealismo te empuja hacia metas elevadas, a veces con el riesgo de sobreexigirte.

Aunque no eres muy diplomático, tu filosofía de vida te da dirección y resiliencia. Tu presencia y tus actos pueden intimidar a los demás, que pueden verla tu audacia como arriesgada o peligrosa. Sueles ser bien recibido por tus amigos por tu encanto, vivacidad y personalidad gallarda.

Sexualmente, eres expansivo, aventurero y explorador. Disfrutas la libertad y la novedad en la intimidad, y los compromisos pueden resultarte asfixiantes, llevándote a veces a la infidelidad.

Cuidado con tener tendencias dogmáticas o fanáticas. Imprudencia o descuido, especialmente en viajes o nuevas empresas. Puedes experimentar frustración o agresividad si te critican o lo bloquean.`,

    Capricornio: `Eres disciplinado, paciente y decidido, te mueves con propósito y una planificación cuidadosa. No eres impulsivo: las pausas solo ocurren por un agotamiento genuino. Centrado en el logro, el éxito y los objetivos ambiciosos a largo plazo, muestras persistencia, resistencia y pensamiento estratégico. Actúas de forma metódica, canalizando tu energía para construir, conquistar y alcanzar metas cada vez más altas.

Eres práctico, magnético, orgulloso y capaz de usar a otros estratégicamente para conseguir tus fines. Tu tolerancia a la frustración es baja, y cultivar la humildad y los valores humanos es esencial para evitar el agotamiento o las tendencias autodestructivas.

Pueden aflorar desafíos con figuras de autoridad o asuntos no resueltos de la infancia, especialmente con el padre. Se aconseja precaución física, ya que las fracturas o los accidentes son más probables.

Ejemplos típicos de esta posición son montañistas, atletas y todo aquel que supera obstáculos mediante un esfuerzo sostenido.

Sexualmente eres persistente y decidido, pero debes cultivar la calidez, el humor y la humildad en la intimidad, sin apoyarte sólo en el poder o la dominación.

Puedes tener mucha ambición sin consideraciones éticas o humanas. Búsqueda implacable del éxito, usando a veces a los demás como herramientas. Tendencias autodestructivas si las metas carecen de objetivos con sentido.`,

    Acuario: `Te mueves por ideales elevados y un deseo de innovar, buscando hacer lo que nunca se ha hecho. Luchas por tus principios y te esfuerzas por crear un mundo mejor. A menudo intelectual y visionaria, trabajas mejor cuando lideras o diriges grupos, pero pueden surgir conflictos cuando otros no pueden seguir el ritmo de tus ideas.

Eres un pensador independiente que desafía la autoridad y cuestiona los sistemas establecidos, creyendo que al defender tu visión puedes mejorar el mundo.

Eres enérgico, experimental y aventurero tanto en la vida como en la sexualidad. El deseo sexual es intenso, pero el apego emocional puede resultarte difícil, lo que provoca oscilaciones entre la pasión y el desapego. Algunos pueden mantener varias relaciones simultáneamente para no sentirse limitados o atrapados.

Disfrutas la experimentación sexual, pero puedes carecer de profundidad personal o de inversión emocional en tus encuentros íntimos.

Cuando está bien aspectado, puedes canalizar tu energía innovadora para alcanzar metas colectivas y convertir los ideales en realidad.

Cuidado con tener obsesión por el cambio o la renovación constante. Dificultad para manejar el apego emocional. Desapego o frialdad en las relaciones íntimas. Conflictos con la autoridad y los entornos estructurados.`,

    Piscis: `Eres un guerrero espiritual e intuitivo, que se mueve a través del sentir y la guía interior más que por la fuerza bruta. Eres muy emocional, empático y compasivo, a veces puedes ser aprovechada por otros debido a tu receptividad. Tu poder asertivo es sutil y mágico, motivas a otros a actuar pero evitas la confrontación directa.

Consideras cuidadosamente las consecuencias de tus actos, buscando que tus deseos impacten positivamente en los demás. Puede costarte reconocer tus propios deseos, por eso cultivar la autoconciencia es esencial.

A menudo necesitas períodos de soledad para recargarte y debes encontrar canales saludables para tu energía abundante y fluida. Las actividades físicas recomendadas son la natación, la danza, las artes marciales u otras prácticas cuerpo-mente.

Sexualmente, eres profundamente romántico, sensual y enfocado en la fusión con la pareja. Tu energía no está movida por la ira, y el deseo se mezcla a menudo con la empatía y la devoción. Puedes reprimir la ira o la frustración si te bloquean, lo que puede derivar en autoagresión o conductas pasivo-agresivas.

Cuidado con creer que eres la única que percibe la verdad. Ira y resentimiento reprimidos. Atracción a través de problemas psicológicos o físicos. Riesgo de autosabotaje o abuso de sustancias si la energía no se expresa.`,
  },

  jupiter: {
    Aries: `Traes una fuerte confianza en tu misión de vida. Eres entusiasta, heroico, generoso y un líder natural, con un profundo deseo de libertad: te resistes a que te digan cuándo o cómo actuar.

Eres capaz de aprender de los errores del pasado y sueles ser innovador, especialmente en áreas como la educación, la filosofía o las búsquedas creativas. Tu fe en los demás te motiva a pasar a la acción y a seguir adelante. Tiendes a decir «sí» a todo y debes aprender a poner límites.

Cuidado con volverte egocéntrico, exagerando tu propia importancia, imprudente, impulsivo o incluso ateo.

En positivo, eres optimista, inspirador, y ganas con facilidad la confianza de los demás, asumiendo de manera natural roles de liderazgo y persiguiendo una vida con sentido y propósito, con coraje e iniciativa.`,

    Tauro: `Tienes dominio del dinero, las finanzas y las inversiones. Sueles generar riqueza creando una base estable, sembrando con paciencia y generosidad —entiendes que dar conduce a recibir— y también puedes administrar con éxito el dinero de otros.

Tienes una fuerte fe en la vida y disfrutas los placeres de estar vivo, el confort material y el cuidado del cuerpo, usando prácticas como el yoga, el canto u otras experiencias sensoriales para tu crecimiento personal. Te atraen el lujo y la calidad, pero también valoras la justicia, la espiritualidad y el significado más profundo de la vida.

Cuando está afligido, puede generar un apego excesivo a lo material, codicia o identificación con las posesiones, lo que bloquea tu flujo natural de abundancia. Debes cuidarte del exceso, especialmente con la comida o el lujo, para mantener la prosperidad.`,

    Géminis: `Tienes una mente expansiva y fomentas la creatividad en la comunicación. Tienes muchas ideas y disfrutas escuchando. Eres selectivo con tu compañía y buscas profundidad en las relaciones.

Sueles viajar, normalmente distancias cortas, explorando las comunidades cercanas y aprendiendo de tu entorno inmediato. Tienes talento para los idiomas y para relacionarte con extranjeros.

Eres intelectual y a menudo autodidacta, curioso y diplomático. Aunque buscas «conquistar el mundo», tu mundo tiende a ser tu entorno cercano.

Cuidado porque puedes volverte un esnob intelectual o apoyarte únicamente en los libros en lugar de en la experiencia directa.`,

    Cáncer: `Das sentido a la vida a través de la seguridad emocional y la conexión con los orígenes, la familia y la ascendencia. Trabajas para expandirte sin limitarte a heredar creencias o valores, pero para hacerlo bien necesitas estabilidad emocional.

El hogar es un espacio que abres para nutrirte a ti mismo y a los demás: eres un anfitrión excelente, capaz de crear un entorno donde los invitados se sientan bienvenidos y cuidados. Puedes ganar dinero a través de ámbitos relacionados con el hogar, como el mobiliario o los bienes raíces, y puedes vivir en el extranjero o en un país muy distinto al de tu nacimiento. Debes cuidarte de los excesos con la comida.

Lo que da sentido a tu vida es la seguridad emocional. Sueles provenir de un entorno familiar sólido, que te inculca valores y una filosofía concreta. Tiendes a ser idealista, moldeado por el amor o su falta y la atención recibida de tus padres o de uno de ellos.

Eres bueno en las relaciones y a menudo tienes hogares llenos de niños, familiares o amigos. Popular y algo conservador, debes cuidarte de mantenerte con los pies en la tierra. La riqueza puede llegar más tarde en la vida, a menudo a través de inversiones inmobiliarias o de herencias de tus padres.

Cuidado con ser excesivamente soñador, sobreprotegido por la madre o emocionalmente dependiente.`,

    Leo: `Generoso, servicial y benévolo, pero a cambio sueles esperar agradecimiento (a veces para alimentar tu vanidad). Intuitivo y carismático, atraes la atención de forma natural. A medida que expandes tu conciencia, descubres que tienes un papel significativo en la sociedad.

Disfrutas de la buena vida y puedes tener una personalidad dramática y colorida, con tendencia al exceso. Sueles ser ambicioso, planificando meticulosamente para alcanzar tus metas.

En esta posición, la carisma se mezcla con el corazón, hay una cualidad mística, inusual u oculta que atrae a los demás. Disfrutas la comodidad y el lujo, pero debes cuidarte del exceso. Sientes que lo que vives es importante, por eso, otorgas relevancia tanto a las experiencias buenas como a las malas, lo que puede impulsar tu ambición.`,

    Virgo: `Tu autoconfianza se basa en los logros y el conocimiento. Tiendes a esperar demasiado de los demás y de la vida en general, con propensión a la exageración.

Destaca la importancia del trabajo; trabajas en exceso y deberías aprender a delegar responsabilidades. Aplicas tus principios éticos y religiosos en tu profesión.

El éxito profesional suele manifestarse en la segunda mitad de la vida.

Cuidado con obsesionarte por la limpieza y el orden, o el extremo opuesto. Pereza si las cosas no se hacen a tu manera.`,

    Libra: `Interés por los principios sociales, morales y matrimoniales. Necesitas una pareja. Necesitas relacionarte para crecer; tu aventura es relacional o romántica. Idealizas la relación con el otro y al otro mismo. Las relaciones íntimas se basan en algo «espiritual» que va más allá de lo sexual.

Eres un buen consejero y tienes mucha influencia sobre tus parejas o socios comerciales. Eres sincero, pero también diplomático. A menudo eres hogareño y posees habilidades artísticas.

Cuidado con prometer más de lo que puedes cumplir, quieres complacer a todo el mundo, y por ello intentas ser todo lo que los demás puedan necesitar. Ten atención en no tomar decisiones morales en nombre de otros.`,

    Escorpio: `Tienes una gran autoconfianza; disfrutas ejerciendo tu voluntad sobre los demás y viviendo bien. Para ti, la crisis es una forma de vida.

Eres intensa y firme en tus creencias y principios. Valiente, abordas la vida con profundidad y te atrae todo lo oculto: la muerte, el misticismo y el ocultismo. Puedes tener capacidades sanadoras y habilidad para comunicarte con otros planos.

Percibes la corrupción de la sociedad. Al identificar lo que es tóxico en el presente, puedes mirar el futuro con optimismo.

Puedes enfrentarte a enemigos poderosos, pero tienes fuertes instintos para navegar situaciones complicadas con éxito. Puedes dar vida a lo que parecía muerto.

Tienes un talento para ver la luz en la oscuridad. Por eso, puedes explorar tus propias profundidades internas y tus «infiernos», facilitándote ver esas dinámicas en otros y abordarlas con sabiduría. En su expresión más baja, puede ser manipulador; en su expresión más alta, puede ser una fuente de guía y transformación para los demás.

Tienes cíclicamente una crisis de identidad que conduce a una comprensión y un sentido más profundos.`,

    Sagitario: `Ilimitado, buscas un significado profundo en todo; todo ocurre por una razón. Estás constantemente en busca de un propósito en tus experiencias de vida. Tienes un fuerte sentido de la justicia y la equidad, queriendo que cada cosa y cada persona ocupen su lugar para que nadie quede en desventaja.

Necesitas profundidad de pensamiento, independientemente de la cultura o la religión. Te preguntas: «¿Cómo puedo ser feliz viviendo la vida que tengo? Si tengo esta vida es por algún propósito; ¿cómo puedo realizarme dentro de ella?». Luchas contra la tristeza, los sentimientos de impotencia y las limitaciones.

Amas a los animales, en especial los salvajes. Cuídate de no actuar con arrogancia o dogmatismo; mantente abierta de mente y humilde.

Esta posición enfatiza el conocimiento y la expansión vital ilimitada: optimismo, libertad y confianza. Tienes un fuerte sentido del humor y puedes encontrar lo divertido en casi cualquier cosa.

Eres una persona fiel, atraída por la filosofía, la educación, las culturas extranjeras y la religión. Buscas la imparcialidad en los principios y eres filosófica y metafísica, con una búsqueda profunda de verdades eternas: el sentido de la vida, cómo ser feliz y cómo vivir mejor. Tu ambiciosa búsqueda de la verdad puede hacerte difícil conectar con las emociones tristes.

Necesitas viajar y aprovechar tus talentos en la escritura, la creación artística o el deporte. Tienes olfato para reconocer las oportunidades. Sociable y amante de los animales, sueles detestar trabajar como subordinada. Disfrutas el lujo y puedes ser indulgente.

Cuidado con tener un pensamiento rígido, moralidad estricta, dogmatismo, superstición, radicalismo, intolerancia y promiscuidad.`,

    Capricornio: `Eres ético, honorable y responsable. Buscas el reconocimiento social y el estatus, creyendo que tu vida solo tiene sentido si alcanzas esos logros. Eres ambicioso y a veces puedes hacerte daño persiguiendo tus metas, pero eres capaz de manifestar tus ambiciones con éxito. Es común que seas muy generoso en ciertas áreas.

Esta posición da ética, autoconfianza, honor y responsabilidad, con un enfoque más fuerte en la ley y el orden que en la espiritualidad. Hay un deseo de poder y estatus social, y necesitas una carrera que te aporte seguridad económica.

Económicamente, puedes ser frugal con las cosas pequeñas y extravagante con los grandes gastos, pero en general detestas el derroche. Te llevas a ti mismo con dignidad e importancia.

Cuidado con ser tacaño, fanático o con tendencias de mártir.`,

    Acuario: `Tienes una visión del mundo desapegada y eres humanitario. Para ti, el crecimiento personal debe implicar una contribución a la humanidad en su conjunto. Buscas verdades objetivas y compartibles.

Tu inspiración te guía y sientes la necesidad de ayudar a los demás. Sueles ser considerado, sociable, y valoras la imparcialidad y la democracia, sin importar la raza, la clase social o el estatus. Puedes asumir naturalmente roles de liderazgo social.

A menudo chocas con los sistemas establecidos, apoyando la renovación o la reforma de las estructuras anticuadas. Puedes destacar en campos como la astrología, los estudios sobre la reencarnación u otras áreas esotéricas o progresistas. Eres abierto a las nuevas ideas y detestas la rutina.

Aunque valoras lo colectivo, también eres muy individualista, a menudo enfocada en el futuro más que en la realidad presente.

Puedes tener falta de tacto, intolerancia, expectativas poco realistas, indisciplina y una actitud revolucionaria o rebelde. Existe el riesgo de estar demasiado centrado en el futuro, descuidando el presente y lo ya establecido.`,

    Piscis: `Amable, tranquilo e introspectivo, buscas una conexión con lo divino y estás ligado a lo trascendente. Periódicamente necesitas retirarte o aislarte para realinearte y encontrar tu lugar en el mundo. Esta posición genera una fuerte intuición y una conexión profunda con los reinos espirituales.

Te atraen naturalmente los hospitales, las prisiones o los retiros espirituales, y necesitas creer en la magia, percibiendo lo extraordinario en lo ordinario, como ver el cielo de un azul intensamente vívido.

Eres dulce, discreto, y tu naturaleza compasiva, especialmente hacia los débiles, suele hacerte muy querido. Tu intuición es fuerte, aunque puede dejarte vulnerable a que se aprovechen de ti.

No eres ambicioso en el sentido material. Tu búsqueda es la fusión con el Uno: una unidad espiritual. Necesitas percibir la magia y el sentido de la vida cotidiana; de lo contrario, puedes frustrarte o aburrirte. A menudo eres defensor de causas perdidas.

En la madurez puedes alcanzar la aceptación a través de la sabiduría espiritual.

Cuidado con la autonegación, la evasión de la responsabilidad, dejarte arrastrar por una emocionalidad excesiva.`,
  },
};

/**
 * Textos por (planeta, casa) — se muestran cuando el usuario ha elegido casa.
 */
export const TEXTOS_CASA: Partial<Record<CuerpoKey, Partial<Record<number, string>>>> = {
  sol: {
    1: `Desde muy pequeño te han apoyado para ser tú mismo y expresar tu individualidad. Viviste acontecimientos importantes en la primera etapa de tu vida y, a menudo, desde joven buscas prestigio. A lo largo de la vida sueles esforzarte por estar en el centro de la atención.

Necesitas que tu vida tenga sentido y propósito, y no te conformas con "lo que ya está hecho", salvo, quizá, para cumplir con las expectativas familiares. Tiendes a romper con las estructuras impuestas por la educación o la sociedad, y prefieres no apoyarte en precedentes familiares para sentirte seguro, importante o construir tu identidad. Necesitas encontrar tu propio lugar en la vida y que se te respete y se te quiera por quien eres y por lo que eres capaz de hacer. Funcionas con autonomía respecto a los demás.

Te identificas fuertemente con tu cuerpo físico y con tu apariencia; puedes tener dificultades para aceptar la enfermedad, la debilidad o el envejecimiento, y obsesionarte con ello.

Eres un líder natural, con una presencia que irradia energía e inspira a otros. Energético, pionero, valiente, voluntarioso, seguro, extrovertido, espontáneo, optimista (según el signo), ambicioso, digno e individualista. Sueles mostrarte tal como eres. Tienes talento para resolver problemas y no funcionas bien bajo la autoridad de otros. Buscas reconocimiento para tener libertad de actuar a tu manera, y puedes tender a no escuchar demasiado a los demás.

Tu energía es casi magnética: atrae a la gente y la influye. De algún modo, ejerces tu autoridad natural casi por instinto, para satisfacer tu deseo de reconocimiento.

Como esta posición amplifica tu sentido de identidad y lo proyecta con fuerza y corazón, tienes que cuidar de no confundir quién eres realmente con lo que proyectas hacia fuera.

El peligro de esta posición es que, si no aprendes a canalizar tu energía, tu forma de expresarte, tus necesidades y tu poder, puedes acabar volviéndote amargo o cínico.`,

    2: `Tu reto heroico aquí es encontrar una sensación de seguridad dentro de ti mismo; tienes que volverte autosuficiente. Necesitas cultivar valores, recursos y habilidades para alcanzar una verdadera sensación de individualidad. Tienes que redefinir qué significa "seguridad" para ti, porque sueles focalizarte mucho en los recursos, las finanzas y la estabilidad material. Es importante que valores tu identidad y no te apoyes en soportes externos para avanzar.

Tu trabajo es convertirte en proveedor para ti mismo y para los demás. Muchas veces vienes de orígenes modestos o humildes, pero al asumir la responsabilidad de tu Sol puedes llegar mucho más lejos que tus antepasados. También puedes orientarte a asegurarles una buena posición social a tus hijos.

Hay un riesgo de obsesionarte con la ganancia material y creer que tu valor depende de lo que poseas, ya sean bienes, ideas o poder sobre otros. Tu sentido de poder y dignidad puede quedar amarrado a tener una base económica sólida, y puede que muestres tus logros de un modo algo ostentoso para reforzar un sentido interno de identidad que, en realidad, no termina de sentirse estable.

Disfrutas compartiendo lo que tienes. Eres generoso con el dinero, aunque sueles esperar alguna forma de reconocimiento a cambio. Necesitas sentirte especial.

Puedes manejar el dinero de otros, y tus propios recursos pueden acabar perteneciendo a otros. Te gusta rodearte de lujo y de gente importante.

Puede haber una pérdida temprana de apoyos o de seres queridos, codicia y, sobre todo, incapacidad para reconocer tu propio valor personal.`,

    3: `Tienes que cultivar y reconocer tus propios pensamientos y puntos de vista, en lugar de limitarte a absorber los del entorno. Estás bien posicionado para brillar en lo intelectual o en cualquier ámbito relacionado con la comunicación.

Mantienes muchas relaciones diversas y positivas con tu entorno. Tu sensación de seguridad y dignidad suele depender del refuerzo intelectual y de sentirte escuchado. Te sientes más vivo cuando aprendes y compartes conocimiento. Te gustan los viajes y tienes interés por lo espiritual o lo filosófico.

Observador, optimista, científico y flexible: necesitas ser escuchado y reconocido, independientemente de lo que piense tu entorno. Estás muy conectado con lo que te rodea, con una inteligencia relacional y verbal marcada. Necesitas aprender y enseñar; el conocimiento te estimula.

Vas de un interés a otro, con muchas actividades diversas. Tienes talento para coordinar contactos y organizar redes de gente. Puedes ser imparcial y confiado, o a veces arrogante y dominante. Es habitual que te preocupes por los hermanos.

No sueles casarte, pero puedes mantener relaciones largas siempre que conserves libertad de movimiento.`,

    4: `Tienes que honrar a tu familia, y la forma de hacerlo es ayudándola a evolucionar a través de tu propia evolución personal. El autoconocimiento es fundamental, porque necesitas definirte en relación con la familia.

La familia pesa mucho, y normalmente uno de los padres es una figura muy importante que pide ser sanada y trascendida; tú mismo tienes que convertirte en ese padre o madre internamente. Es posible que ese progenitor te haya hecho sentir pequeño, inferior, débil o insignificante, o que estuviera ausente, sea como sea, debes buscar esa figura dentro de ti.

Con la madurez te conviertes en alguien seguro, nutritivo y que emana sabiduría. Si no maduras, puedes volverte excesivamente quejica y repetir patrones familiares. Por lo general, tu sentido de identidad se fortalece en la segunda mitad de la vida.

Necesitas definir tu propia identidad para diferenciarte de tu familia y de tu entorno, sin negar que también formas parte de ellos. Si no lo haces, corres el riesgo de convertirte en una prolongación no identificada de tu linaje, o de irte al extremo opuesto y rechazar de plano todo lo que viene de tu entorno y tu familia. El mejor camino es el equilibrio entre los dos extremos.

Tienes una necesidad clara de seguridad y autoprotección. Las mujeres con esta posición suelen buscar la independencia a través de apoyarse en otros. El autoconocimiento profundo es esencial; lo que consigues hacia fuera importa menos que lo que contribuye a tu crecimiento interior.

Hacerte cargo de tu casa te nutre, por eso es muy importante que tengas todo en orden en casa, en lo físico y en lo simbólico, para sentirte bien, aunque encontrar tu verdadero hogar puede llevarte tiempo. Aunque te cueste dejar entrar a otros en tu espacio, cuando lo haces, te aseguras de que no les falte nada.

Cuidado, porque puedes quedarte a la sombra de uno de los padres y trabajar con o para él/ella, o huir de casa muy joven. Las tragedias familiares (muerte parental, divorcios, conflictos por herencias) se viven con mucho dolor. También pueden aparecer estilos de vida poco lícitos, relaciones difíciles o problemas con los suegros.`,

    5: `Necesitas ser amado por aquello que te hace único, sentirte especial y reconocido. Eres creativo, generoso, alegre, juguetón, con sentido del humor, fuerte, popular e indulgente contigo mismo. Vives con pasión y buscas disfrutar de los placeres de la vida.

Necesitas causas o actividades que le den sentido a tu vida y te hagan sentir vivo; sin eso, tu salud física y mental puede resentirse. Alguna forma de expresión creativa te da una base sólida para tu empoderamiento interno. Sueles creer que tú puedes hacer las cosas mejor que como las han hecho otros.

El romance es esencial para sentirte vivo y bien, y además te sube la autoestima, aunque tu tendencia a los enamoramientos fugaces puede dificultarte mantener una relación a largo plazo. En realidad, lo que muchas veces te enamora es tu propio reflejo en el otro.

Los hijos son otra parte fundamental de tu vida, porque te permiten extender tu sentido de identidad de forma creativa y expandir tu influencia y tu poder. Eso sí, corres el riesgo de vivir indirectamente a través de ellos, proyectando en ellos tus sueños y frustraciones.

Necesitas ser el centro de atención y te cuesta tolerar las situaciones en las que pasas desapercibido. Buscas un círculo social de amistades de élite que refuerce tu reputación y tu fama. Eres organizado, excelente anfitrión, y te atraen el teatro, la enseñanza, el arte, el deporte y las actividades especulativas.

Puedes preferir llamar la atención de forma negativa antes que ser ignorado, y puedes explotar a otros para conseguirlo. Cuidado con el juego y la especulación.`,

    6: `Tienes que aprender cómo funcionan las cosas y cómo encaja cada pieza en su sitio en el mundo. Tu camino hacia la sabiduría está en lo cotidiano, con una conciencia casi zen.

Tienes que cuidar tu salud física y mental, aprendiendo que mente y cuerpo no están separados, sino que son uno. La disciplina y el trabajo son fundamentales. Sueles concentrarte profundamente en lo que haces, y necesitas que tu trabajo sea útil y ayude a otros. Eso te hace muy eficaz en profesiones de servicio, medicina, higiene y áreas similares.

Sueles tener tus propios métodos, que se diferencian de los de los demás y pueden generar fricción en el trabajo, pero al final acabas imponiendo tu enfoque con éxito. También tienes que prestar atención a mejorar tu propia calidad de vida, porque esta posición puede empujarte al sobre-sacrificio o a una preocupación excesiva por los demás. La rutina es importante y te ancla.`,

    7: `Necesitas las relaciones para descubrirte a ti mismo, lo que te pone en riesgo de dependencia. Necesitas tener gente alrededor y a menudo eliges profesiones que faciliten las relaciones interpersonales.

Funcionas mejor en asociación y puedes apoyarte en otros para conseguir tus objetivos. Eres popular porque tratas de mantener la armonía allá a donde vas.

Tienes que tener cuidado con proyectar tu Sol en los demás: eso puede llevarte a buscar adoración, a no ser tú mismo y a depender de otros para sentirte apoyado y reconocido. Cuando proyectas tu Sol fuera, te queda una sensación de vacío. Necesitas cultivar una relación fuerte y sana contigo mismo. Recuerda que vales y tu opinión es importante.

Sueles ser pacífico, refinado, indeciso, caprichoso y un punto perezoso. Detrás de una apariencia generosa pueden asomar a veces tendencias egoístas. El matrimonio es importante para ti y muchas veces buscas sacarle algún beneficio, aunque puede llegar tarde en la vida.`,

    8: `Buscas la profundidad y los aspectos ocultos o oscuros de la vida, y sueles ser una persona compleja. Te has encarnado para resolver conflictos con los demás y con tu propia sombra. Buena parte de tu vida se juega en el inconsciente, lo que hace inevitable la transformación, y el proceso es difícil si te resistes.

Tienes que trascender el ego y trabajar en la superación de ti mismo. Anhelas autosuficiencia y, a la vez, atraes de forma natural el apoyo de otros; si no equilibras bien esto, puedes caer en la dependencia o en la proyección. Los traumas de infancia o los encuentros tempranos con la muerte pueden pesarte, y la muerte suele marcar tu vida; esta posición puede indicar viudedad. También puedes vivir miedo u obsesión con la muerte hasta que maduras.

Tiendes a romper con los valores tradicionales y a menudo eres poco compasivo con la debilidad o el fracaso. No te gusta lo ordinario y prefieres una vida interior y reflexiva. Otros te confían secretos, posesiones o finanzas; sueles verte implicado en secretos familiares, y puedes recibir herencias o gestionar recursos ajenos. El sexo es importante para ti, pero puede ser fuente de conflicto por muchas razones.

Eres agudo, magnético, intuitivo, serio, vengativo y obsesivo, con un fuerte interés por todo lo oculto o misterioso. Muchos con esta posición son excelentes investigadores, porque profundizar es natural para vosotros.`,

    9: `Tienes que encontrar tu propia filosofía de vida mientras aprendes de las filosofías de otros. Hay en ti un interés fuerte por entender el "por qué" y el "para qué" de la Vida.

Los viajes largos (literales o simbólicos) son importantes, pero tienes que cuidarte de no perder conexión con el momento presente. Necesitas diferenciarte desarrollando una personalidad ejemplar e inspirando a otros a abrir su mente. Sueles ser un excelente profesor o mentor.

Tienes una mente muy abierta y te atraen el derecho, las lenguas, la filosofía, la espiritualidad, la religión y el conocimiento elevado. Sueles llevarte bien con casi todo el mundo. Entusiasta, optimista, expansivo y honesto, en general te sientes afortunado.

Puedes haber nacido en el extranjero, casarte con alguien extranjero (posiblemente conocido viajando), tener un progenitor de otro país o viajar al extranjero.`,

    10: `Esta posición indica un fuerte ascenso social respecto a tu familia de origen. Sueles ser el miembro más destacado de tu familia, alcanzando reconocimiento por mérito propio en lugar de por apoyo familiar.

Puedes adquirir posesiones, puestos o relaciones que, a primera vista, parecerían imposibles dado tu origen, y a menudo creas negocios o iniciativas que resultan inusuales en relación con tu trasfondo.

Necesitas visibilidad, porque tu identidad se expresa a través de tu vida pública y tu estatus social. Sueles crear tu propia escuela, sistema o forma de hacer las cosas, dejando una huella duradera y despertando admiración. El signo concreto te dirá en qué área buscas ese reconocimiento.

Normalmente te reconocen por tu reputación profesional y te van bien la política, el liderazgo o los roles que requieran autoridad. Necesitas cumplir tu propósito vocacional y que se te reconozca por ello. Los problemas aparecen si persigues todos tus logros solo para ganarte la aprobación parental. En mujeres, esta energía puede proyectarse a veces como ser "la esposa de" en lugar de ser reconocida individualmente.`,

    11: `Sueles trabajar con organizaciones sociales o colectivos, y normalmente consigues lo que te propones. Sociable hacia fuera, pero solitario por dentro, buscas reconocimiento a través de pertenecer a un grupo o de aportar dentro de él.

Eres ambicioso y te mueve la idea de cambiar la sociedad, pero tienes que desarrollar tu individualidad para no acabar diluido en el grupo. Eres recursivo, superas las dificultades y atraes ayuda de los demás con naturalidad. Los amigos, colegas y clientes juegan un papel muy importante en tu vida, y te traen admiración, apoyo y experiencias positivas. Tus conexiones sociales suelen ser amplias y de largo alcance.

Eres excéntrico, revolucionario, progresista y rebelde.

Cuidado porque puede ser que intentes aprovecharte de los amigos o dominar la dinámica del grupo, lo que termina generando conflictos colectivos o frustración cuando los objetivos no se cumplen.`,

    12: `Una parte de ti está encarnada en el mundo material; la otra vive en el plano espiritual. Puedes hacer grandes esfuerzos por mantener una imagen sólida y firme, y volverte hiper-racional, intentando controlar o reprimir el desbordamiento del inconsciente colectivo.

A veces te auto-saboteas para no sentir, y puedes necesitar periodos de aislamiento o retiro para limpiarte. Eres sensible a lo que los demás quieren de ti, lo que puede generarte inseguridad, ya que sus expectativas no siempre coinciden con tus propios deseos.

Aunque seas sociable, sueles sentirte muy solo. Tiendes a brillar de forma silenciosa o en círculos pequeños, y puedes quedarte a la sombra de otros o trabajar de forma anónima, sobre todo antes de los 30. Tu vida a menudo transcurre entre bambalinas o en soledad.

Esta es la casa del sacrificio, así que estás llamado a poner tu Sol al servicio de algo más grande que tu identidad personal, frecuentemente trabajando por el bien de la humanidad. Hay un vínculo psíquico o kármico con el padre, y un compromiso de alma con sanar la línea paterna y el principio masculino.

Buscas tranquilidad y prefieres no complicarte la vida, pero las dificultades suelen aparecer a la hora de alcanzar tus metas. Eres tolerante y humilde, pero puede faltarte autoconocimiento y sentido de tu propio valor. Necesitas explorar y entenderte, y te beneficia conectar con grupos espirituales o esotéricos.

A menudo tienes talento para la actuación o las artes escénicas.

Puedes vivir experiencias de confinamiento o trabajar en instituciones como hospitales, cárceles o centros psiquiátricos. Puedes volverte crédulo, autocompasivo o desarrollar vicios.`,
  },

  luna: {
    1: `Emanas hipersensibilidad y un fuerte apego a tu madre. Tu madre tuvo hijos desde una necesidad de ser querida y valorada, y te crió para responder a sus expectativas emocionales. Por eso, puede costarte verte como alguien independiente de tu madre, tu familia o la opinión social.

Necesitas recibir constantemente la confirmación de que eres amable, bueno y fiable. Que te hayan educado para estar siempre disponible te genera un conflicto interno: te queda poco tiempo para atender tus propias necesidades. Tienes que cultivar conciencia emocional: aprender a pararte, observar y reflexionar sobre lo que se te ha activado por dentro. Vives cambios cíclicos de humor muy marcados, tendencias caprichosas y una subjetividad intensa que puede distorsionarte la percepción de la realidad.

Muy imaginativo e intuitivo, tienes una inteligencia y una sensibilidad que te permiten detectar cambios, peligros u oportunidades en tu entorno. Por naturaleza eres protector, nutricio y disfrutas recibiendo gente en casa o cuidando a otros. Si superas la timidez, puedes tener éxito de cara al público, aunque ese éxito puede aparecer y desaparecer de forma impredecible.

Tienes que dejar de buscar la aprobación de los demás y evitar moldearte solo para encajar, porque eso te lleva a serle desleal a quien realmente eres. La aceptación y el afecto son vitales para tu bienestar emocional, y la pasas mal cuando las personas a tu alrededor no cumplen con esto.

Es probable que vivas lejos de tu lugar de origen. Puedes tener adaptabilidad y capacidad de cambio en cuestiones de hogar o familia.

**Afligida:** inestabilidad emocional, dependencia excesiva de la aprobación, apego al pasado, exceso de subjetividad y capricho.`,

    2: `Estás profundamente apegado a la comodidad, especialmente a la comida, que usas como refugio, como celebración y como fuente de seguridad emocional. Puedes comer en abundancia y disfrutar de comidas ricas y reconfortantes.

La seguridad económica te es esencial, y tienes que aprender a no estar monitorizando tus posesiones todo el tiempo. Necesitas trabajar tu sentido interno de valía, entendiendo que servir a los demás no merma tus propios recursos: siempre habrá suficiente para ti.

Tu vida financiera suele estar marcada por las fluctuaciones: ingresos inestables o épocas de escasez. Tienes que evitar identificar tu valor con tus posesiones materiales ("lo que tengo me define") y revisar críticamente los sistemas de valores familiares, porque adherirte a ellos sin cuestionarlos puede obligarte a una reevaluación dolorosa más adelante.

Puedes ser muy posesivo, sobre todo con las herencias, los objetos ligados al pasado o las cosas vinculadas a seres queridos. A menudo influyes sobre los demás para que ellos cambien de opinión, y así no tener que cambiar tú. También puedes asumir la responsabilidad de cuidar de tu madre.

Esta Luna se sitúa bien para carreras que impliquen contacto con el público, gestión de recursos o roles donde tú aportes seguridad o guía a otros. Las ganancias económicas pueden venirte por herencia materna, a través de la pareja, por exposición pública o gracias a las mujeres en general. La herencia inmobiliaria suele ser fuente de beneficios sustanciales.

**Afligida:** indulgencia excesiva con la comida, posesividad, identificación de tu autoestima con lo material y dificultad para adaptarte al cambio.`,

    3: `Expresas tus emociones principalmente a través de la comunicación. Tienes una imaginación viva y puedes exagerar o adornar lo que cuentas. Tienes buena memoria, pero te cuesta la concentración: necesitas aprender a escuchar y entender, no solo a memorizar.

Tienes lazos kármicos o dhármicos importantes con tus hermanos. Es probable que tu madre haya sido emocionalmente distante, comportándose más como una hermana que como figura parental, o que tú hayas tenido que asumir responsabilidades parentales en la infancia. Las relaciones con hermanos, vecinos o familia extensa pueden ser muy variables en calidad, pero siempre tienen peso en tu vida.

Eres inquieto, intelectualmente curioso y muy sensible a tu entorno. Rechazas la rutina, y son habituales el movimiento constante, los cambios de escuela o los cambios de casa. Tu objetividad y tu racionalidad dependen mucho de tu estado de ánimo, y prosperas en entornos sanos y poco tóxicos. Ansías conocimiento, porque te da sensación de seguridad, pero tus intereses cambian con facilidad.

Tu vida romántica y social puede ser variada y cambiante. Puedes disfrutar teniendo amantes o manteniendo relaciones largas pero poco convencionales. Las herencias o los asuntos de negocios compartidos también pueden jugar un papel en tu vida.

**Afligida:** dificultad para concentrarte, exageración, racionalidad dependiente del humor, inconsistencia en las relaciones, susceptibilidad a la influencia del entorno e inquietud.`,

    4: `Esta Luna refleja un karma familiar fuerte, casi siempre ligado a tu madre o al linaje materno, y a veces canalizado a través del padre. Tienes una naturaleza nutricia, alimentadora y protectora: reúnes a la tribu y mantienes encendido el fuego del hogar. Tienes que vigilar el apego excesivo a tus raíces y la sobredependencia de la seguridad familiar.

Cuando encuentras un lugar de refugio emocional, floreces. Sin él, te sientes flotando, sin raíces, y puedes pasarte buena parte de la vida buscando una sensación de hogar. Muy emocional y sensible, sueles esperar que los demás intuyan lo que sientes. Tienes que aprender conscientemente a expresar y comunicar tus emociones, o acabarás dramatizando situaciones por sentirte incomprendido.

Tienes un apego fuerte a tu madre, y sueles ser la primera persona a la que llamas. Es común coleccionar antigüedades u objetos ligados al pasado, como reflejo de tu apego a la memoria y al linaje.

Buscas paz y tranquilidad, y a menudo deseas vivir cerca del mar. La seguridad emocional y la pertenencia son motivaciones centrales, y puedes seguir buscando en la familia un refugio incluso después de formar tu propia casa. El vínculo afectivo más fuerte suele ser el de tu madre, aunque tu padre puede ser una influencia estabilizadora.

Puedes vagar buscando el hogar o la pertenencia que nunca llegaste a experimentar plenamente. Los últimos años de vida suelen ser tu etapa más gratificante y armónica.

**Afligida:** dependencia emocional, dificultad para expresar lo que sientes, nostalgia excesiva, sobreapego a la familia y problemas con la independencia.`,

    5: `Esta Luna refleja espontaneidad, placer, disfrute y un amor profundo por el romance y el juego. Sueles enamorarte del amor mismo más que de personas concretas. Buscas reconocimiento por lo que haces y disfrutas siendo visto, a veces con despliegues teatrales y a lo grande. La diversión, el entretenimiento y la relajación son esenciales para tu bienestar emocional.

Los hijos te importan especialmente: te dan afecto y son una fuente de orgullo, y puedes acabar proyectando en ellos tus propias necesidades emocionales. Los patrones maternos que viviste en la infancia pueden repetirse, tanto en la relación con tus propios hijos como en tus parejas románticas.

Eres poético, imaginativo, encantador y artístico por naturaleza. Tu carisma y tu presencia poco amenazante te hacen atractivo para el público. Espontáneo expresando afecto, pero cuidado con irte a lo dramático. Caprichoso y juguetón, necesitas admiración y reconocimiento para sentirte emocionalmente seguro.

Tu vida romántica y social suele ser animada; estableces vínculos íntimos con rapidez. Cuidado porque puedes acumular amantes y buscar placer antes que compromiso a largo plazo.

**Afligida:** capricho emocional, drama excesivo, dependencia de la admiración y repetición de los patrones emocionales parentales.

**En mujeres:** encantadora, poética, expresiva, afectuosa; necesitas sentirte admirada para sentirte segura. **En hombres:** romántico, juguetón, socialmente atractivo, puedes tener muchas historias de amor; cariñoso con los niños.`,

    6: `Esta Luna refleja cuestiones kármicas fuertes con tu madre, a veces con la sensación de que ella siempre está presente o de que "te sigue". Estás muy influido por tus emociones y tiendes a somatizar, así que la conciencia sobre la alimentación, la salud y el autocuidado es esencial. Puedes creer que solo se te quiere si eres útil, y eso te lleva a trabajar en exceso para sentirte digno de afecto.

Funcionas mejor cuidando a otros, y eres protector y orientado al servicio por naturaleza. Las mascotas y los animales pueden ayudarte a saciar esa necesidad fuerte de nutrir.

La rutina te da seguridad, y prestarle atención a tu dieta y a tu cuerpo es esencial. Tu entorno laboral suele ser el área que te trae más cambio, incertidumbre y desafío emocional, y puede reflejar dinámicas heredadas o kármicas con tu madre. También puedes heredar sensibilidades de salud, tendencias psicosomáticas o replicar la forma que tenía tu madre de afrontar la vida cotidiana.

Puedes vivir "infecciones" emocionales a través de amigos, clientes, amantes u otros a quienes sirves, así que mantener los límites es importante. Los nervios fuertes o la tensión emocional pueden manifestarse como enfermedad, sobre todo si descuidas el autocuidado. Te sientes más seguro atendiendo a la rutina y cuidando del cuerpo, aunque los signos variables pueden hacer que tus hábitos sean inconsistentes.

**Afligida:** somatización emocional, hipocondría, exceso de trabajo, implicación excesiva en la vida de los demás y vulnerabilidades de salud heredadas.

**En mujeres:** protectora por naturaleza, orientada al servicio y sintonizada con los roles de cuidado. **En hombres:** dedicado al cuidado de los demás, con un fuerte sentido de responsabilidad vocacional o familiar.`,

    7: `Esta Luna refleja una fuerte dependencia emocional de los demás y una hipersensibilidad a sus sentimientos y opiniones. Puedes adaptarte demasiado a tu pareja y perder contacto con tu propia identidad, o hacerte pequeño para que te cuiden. Sueles atraerte a parejas melancólicas o sensibles, y puedes dejarte absorber por el otro de una forma poco sana.

Escribe las formas en las que te dejas absorber por el otro para reconocerlas y poder evitarlas en el futuro.

En tu primera relación seria, normalmente deseas casarte, aunque puede que no funcione la primera vez. Buscas una pareja que te aporte seguridad emocional, a veces proyectando en ella la figura materna o asumiendo tú mismo el rol de "madre". Eso puede impedirte ver al otro con objetividad y generarte dificultades en la intimidad.

Necesitas el vínculo para sentir que la vida tiene sentido. Tu mundo emocional se complica cuando estás soltero, y puedes pasar por cambios frecuentes de humor.

Eres sociable, atento a las necesidades de los demás por naturaleza, y te sueles manejar bien en lo social.

**Afligida:** dependencia excesiva, pérdida de identidad propia en las relaciones, cambios de humor y atracción por parejas melancólicas.

**En mujeres:** puedes asumir un rol de cuidadora en la relación o buscar seguridad a través del matrimonio; la dependencia emocional puede impedirte ver con objetividad. **En hombres:** puedes buscar una pareja nutricia o asumir el rol de cuidador; necesitas cercanía emocional para sentirte pleno.`,

    8: `Eres profundamente sensible y vives tus emociones a un nivel intenso. Necesitas periodos de soledad para desconectar de las influencias externas y procesar emociones que no son tuyas. Estás muy sintonizado con los patrones emocionales heredados de la familia, cargando traumas congelados, duelos no resueltos, abusos de poder o sexuales, y miedos transgeneracionales.

Tu madre cuando te tuvo, estaba emocionalmente no disponible, reviviendo un trauma no sanado, lo que te dejó una necesidad fuerte de seguridad que nunca quedó del todo cubierta. La sensibilidad infantil es extrema; cualquier incomodidad o inestabilidad emocional de tu madre te afectaba y te afecta profundamente, pero puedes hacer un trabajo para desligarte de ella.

Eres muy intuitivo respecto a las necesidades emocionales y sexuales de los demás, y usas la intimidad como forma de sentirte a salvo. Pueden aparecer temas edípicos, y tus primeras experiencias sexuales pueden haber sido traumáticas. Te atraen los temas tabú: sexualidad, muerte, ocultismo, reflejo de una curiosidad natural por la transformación y lo desconocido.

La influencia fuerte de las emociones y opiniones ajenas puede desbordarte, hasta el punto de que no sabes lo que sientes tú. Debes explorar a fondo el pasado para entender la raíz de tus miedos, obsesiones y complejos. Eres propenso a absorber la energía emocional negativa del entorno, lo que puede afectarte el bienestar durante toda la vida.

El matrimonio y las asociaciones pueden mejorar tu seguridad económica, aunque los hombres pueden tener riesgo de viudedad, y los aspectos difíciles pueden indicar divorcios o finales dolorosos. La gestión financiera puede implicar manejar recursos de otros.

En la adultez, tienes que aprender a diferenciar tus propias necesidades emocionales de las de los demás, cultivando desapego y autoconciencia. Tienes un agujero emocional insaciable, pero debes aprender a nutrirte a ti mismo y no pedírselo a los demás.

La nutrición requiere un desarrollo y transformación cuidadosa, porque la comida se siente como veneno.

La última etapa de tu vida suele traer un regreso al contacto social: puedes verte rodeado de mucha gente, o incluso morir en un entorno público.

**Afligida:** desbordamiento emocional, miedos inconscientes, obsesión con la seguridad, sobreidentificación con las necesidades de los demás, complejos intensos y uso de la sexualidad como forma de seguridad emocional.

**En mujeres:** muy sensible, puedes verte profundamente afectada por la pérdida y el trauma; las experiencias sexuales influyen en tu seguridad emocional; fuerte capacidad intuitiva. **En hombres:** vulnerable a la viudedad o a finales difíciles; puedes cargar trauma familiar heredado; sensibilidad emocional y sexual intensa.

**Transgeneracional:** exposición no sanada ni colocada al duelo, al trauma o a la muerte en el linaje materno; dolor familiar o pérdidas no resueltas.`,

    9: `Tienes una comprensión emocional profunda y una conciencia fuerte de lo que sientes, cargando a menudo con creencias y patrones heredados del pasado. Emocionalmente, te puedes sentir atraído por vivir en el extranjero o pasar largas temporadas lejos de tu lugar de origen.

Imaginativo y curioso, te atraen los aspectos profundos de la vida y tiendes a construir tu filosofía personal a partir de tus emociones e ideales. Tienes un don natural para enseñar y compartir conocimiento.

Tu intuición es fuerte y te permite percibir símbolos y comprender verdades que están más allá de lo puramente racional. Sueles tener interés por la filosofía, la religión y la metafísica, y te adaptas con facilidad a nuevas formas de pensar.

Puedes sentirte más en casa en aeropuertos, templos o iglesias que en tu propia casa. Tu camino vital incluye ayudar a otros compartiéndoles tu visión del mundo.

**En hombres:** puedes sentirte atraído por parejas extranjeras o por mujeres que te expanden el conocimiento. **En mujeres:** puedes buscar maestros, guías o figuras "tipo príncipe" que te inspiren.`,

    10: `Tienes un vínculo kármico fuerte con tu madre. Desde pequeño te dijo cómo, quién y cuándo tenías que ser, no te dio un espacio para ser tú mismo. Aunque esté ausente, su influencia sigue moldeando tu comportamiento.

Esta Luna te orienta a menudo a la popularidad: nutres y cuidas al público de forma natural, más al estilo alcalde que presidente. Tienes la capacidad de emocionar a la gente e inspirar lealtad o cariño en grupos grandes. Cuidado con sobrevalorar la reputación a costa de tu salud.

Sueles encontrar refugio en el trabajo, y son habituales las carreras ligadas a la comida, la hostelería, la nutrición o el cuidado. Tu madre marcó fuertemente tus expectativas, y las figuras de autoridad o tus jefes suelen reflejar temas maternales no resueltos.

Escribe sin pensar, cuáles crees que pueden ser estos patrones.

Popular y bien considerado, prosperas cuando se reconoce tu trabajo público, pero tu vida personal a menudo queda en segundo plano. Acuérdate de nutrirte y amarte.`,

    11: `Tus opiniones son emocionalmente neutras y posees una capacidad natural para mantenerte imparcial, sin obsesionarte con agradar a todo el mundo. Las amistades te importan mucho, y prosperas en entornos de equipo o trabajos orientados al grupo.

Tienes amigos muy diversos, sin prejuicios, valorando la lealtad y la conexión por encima del trasfondo, el estatus o la convención. Disfrutas nutriendo a los demás, a menudo cocinándoles o cuidando de ellos. A pesar de tu generosidad, puedes vivir traiciones, y eso te duele profundamente.

Muchos de tus vínculos son con mujeres, y a menudo tienes que asumir un papel maternal con tus amigas y clientas, las cuales tendrás bastante más que hombres.

Tienes la capacidad de movilizar emocionalmente a grandes grupos, porque tus sentimientos y opiniones son objetivos, desapegados e imparciales.

Sueles intentar crear una familia a partir de tus amigos, uniéndote a grupos que defienden ideales y asegurándote de que todo el mundo se sienta incluido y cómodo. Necesitas trabajar el autocuidado, porque puedes dejarte influir demasiado por las opiniones ajenas a la hora de decidir lo que es mejor para ti.`,

    12: `Altamente intuitivo, psíquico, empático y sensible. Absorbes las emociones del entorno aunque no te pertenezcan, y a menudo te cuesta distinguir lo que sientes tú de lo que sienten los demás.

Escribe, dedícate tiempo a sacar lo que no es tuyo de ti. Solo así podrás andar hacia tu sol. No debes cargar con lo que no es tuyo.

Tu madre puede no haber querido ser madre, pero sintió que no tenía elección debido a presión social o familiar o las circunstancias. Esto crea patrones kármicos profundos que pueden repetirse a través de las generaciones, salvo que los resuelvas conscientemente con transformación, terapia o constelaciones familiares.

Te sientes emocionalmente atraído hacia tu madre, idealizando a menudo un vínculo que no fue amor verdadero, y vives conflictos importantes con ella.

Tiendes a esconder tus emociones y vives bajo un velo de secreto o misterio, necesitando periodos de soledad para recargarte emocionalmente y aprender a estar contigo mismo sin escaparte. Esta posición es común en hijos adoptados, en quienes tuvieron una madre emocionalmente ausente o cuando hay memoria de pérdida materna en el parto.

Los sueños y el trabajo con el inconsciente son herramientas esenciales para ti, para entender y ordenar tu historia emocional, ya que los conflictos familiares no resueltos suelen estar en la raíz de tus dificultades.

Puedes vivir amores imposibles, secretos u ocultos, y dificultades con los hijos, con la exposición pública o con la visibilidad social. El embarazo de tu madre suele haber sido difícil, dejándote una huella profunda.

Estás llamado a mirar la vida de frente, aunque a veces te resulte abrumadora. Los miedos, las fobias o los complejos pueden interferir en las relaciones normales, y a menudo cargas con responsabilidades o pesos relacionados con enfermedades parentales o pérdidas tempranas.

En positivo, tienes una intuición poderosa y una capacidad extraordinaria para navegar el inconsciente colectivo. Floreces en trabajos entre bambalinas, ayudando a otros desde una posición sutil y de apoyo.

Si está afligida, puedes vivir en un mundo imaginario, vivir amores secretos o imposibles, y quedarte demasiado atado a influencias maternas pasadas o no resueltas.`,
  },

  mercurio: {
    1: `Eres una persona curiosa, con un impulso fuerte por descubrir, estudiar, hacer preguntas y analizar. Tomas conciencia de ti mismo y de la vida a través de la curiosidad y la indagación. Muy analítico, contigo mismo y con los demás, tienes capacidades mentales sólidas y se te dan excelentemente bien la resolución de problemas. Tu mente es rápida, ágil y capaz de conectar ideas dispares en un instante, aunque puedes hablar sin filtrar demasiado. Adaptable y a menudo nervioso.

Intelectual, ingenioso y de espíritu vivo. Tienes una percepción rápida y clara, con buena atención al detalle. Sueles aparentar menos edad de la que tienes y mantienes una presencia juvenil durante toda la vida.

Te es esencial estar aprendiendo constantemente; así te sientes seguro y confiado. El aprendizaje también te facilita expresarte. Tu comunicación es efectiva y persuasiva, con un talento natural para la argumentación.

Tu pensamiento tiende a estar muy orientado al ego, lo que puede dificultarte entender a los demás de verdad. Cuando no te gusta lo que ves en el mundo externo, tu lección es mirar hacia dentro en lugar de echar la culpa fuera: la raíz del asunto suele estar en tus propias actitudes. Desarrollar empatía es clave.

Puedes ser inconsistente en tus ideas e inseguro a la hora de actuar. La vida suele traerte cambios frecuentes de entorno, especialmente en las primeras etapas, obligándote a adaptarte rápido.

**En negativo:** habla nerviosa o atropellada, posible tartamudez y un autoenfoque excesivo.`,

    2: `Tu curiosidad se centra en entender el mundo físico y material. Saber cómo funcionan las cosas te da una sensación fuerte de seguridad, que necesitas profundamente. Aprendes a través del tiempo, la experiencia corporal y el contacto sensorial, sobre todo si no tienes mucho fuego: el conocimiento tiene que pasar por el cuerpo antes de que confíes en él.

Aplicas tu inteligencia a lo material, las posesiones y la economía. Estás lleno de ideas para crear, aumentar o diversificar recursos, y sueles tener talento para conseguir lo que necesitas. Bien aspectado, manejas el dinero con sensatez y eres muy bueno cerrando tratos.

Valoras la practicidad y la seguridad financiera. Según los aspectos, puedes oscilar entre la austeridad y el derroche. A lo largo de la vida, tu forma de ganar dinero cambia con frecuencia, aunque rara vez te falta de nada; sueles preferir tener más de una fuente de ingresos.

Esta posición es favorable para ganar dinero a través del comercio, la escritura, la enseñanza, las pequeñas negociaciones, el rendimiento de la tierra y el trabajo intelectual práctico. Te van campos como la economía, las ventas, la edición, la escritura, el transporte y los intercambios comerciales.

**En negativo:** avaricia, tacañería y un foco obsesivo en la seguridad material.`,

    3: `Racional, curioso, rápido, ingenioso, hábil y práctico. Tu forma de pensar es certera y precisa; tomas decisiones con rapidez y eres vivaz, observador, ingenioso, irónico y a veces de lengua afilada. Tienes habilidades comunicativas fuertes y un talento natural para los negocios, con buena atención al detalle sin volverte obsesivo.

Eres muy hábil escogiendo los argumentos con los que defiendes tus opiniones. En cualquier caso, siempre tienes algo que decir sobre casi cualquier cosa. Tu dialéctica es fuerte, con una comunicación directa y rápida. Puedes ser muy hablador, y son comunes los viajes cortos a lugares familiares.

Disfrutas experimentando en todas las áreas de la vida y necesitas movimiento constante. Los cambios frecuentes de intereses mentales te llevan a relacionarte con mucha gente diferente y a mantener una red social amplia.

Puedes trabajar para o con un familiar. En general, la familia ocupa un lugar importante en tu mundo mental, y puedes sentirte responsable de uno o varios hermanos.

**En negativo:** ruido mental excesivo, cotilleo o conversación superficial sin profundidad. Cuidado con el tabaco, la firma de documentos y los posibles accidentes en las manos.`,

    4: `Tus padres pueden haber tenido un bagaje cultural o intelectual fuerte, y en casa se enfatizaba ser sensato, racional e intelectualmente capaz, a veces a costa de la ternura, la expresión emocional y el afecto físico. Eso suele producir una mente introvertida.

Uno de los progenitores lo percibes como verbalmente hábil, inteligente, expresivo y un punto esquivo. Puede haber habido más de una figura parental, o un hermano que asumió el rol parental. En algunos casos, uno de los padres se vuelve a casar.

Sientes orgullo por tu familia y tus raíces, junto con un interés fuerte por los antepasados, las antigüedades y la historia familiar. Puedes heredar una "herencia cultural" o un negocio familiar.

El ambiente del hogar tiende a ser mentalmente activo y ajetreado. Son comunes los cambios de residencia, y un miembro de la familia puede convivir contigo en distintos momentos de la vida.

El aprendizaje continúa durante toda tu vida adulta y, en general, te resulta beneficioso y estabilizador.

**Afligido:** nerviosismo, irritabilidad, conflictos domésticos y problemas relacionados con la herencia.`,

    5: `Pasas una gran cantidad de tiempo pensando en el amor, el romance, el placer y el disfrute, buscando experiencias simplemente porque te dan alegría. Te atraen los niños, el arte y el estímulo mental, y la educación te importa mucho. Creativo, expresivo y articulado, tienes un don natural para hablar y sientes la necesidad de comunicar y de rodearte de gente intelectualmente estimulante.

Los hobbies y la creatividad se convierten en una forma primordial para conocerte a ti mismo. Un medio artístico puede acabar transformándose en tu principal vía de comunicación y expresión hacia fuera. Puede haber un miedo o una inhibición inicial alrededor de la expresión artística que luego se convierte en un canal central de tu vida.

En el romance, te atraen las parejas mentalmente estimulantes y puedes mantener más de una relación a la vez, cambiando de pareja con cierta frecuencia. Te ganan con facilidad mediante los elogios, sobre todo si admiran tu mente aguda y la amplitud de tus conocimientos.

Tu relación con los hijos tiende a mejorar a medida que crecen y pueden comunicarse verbalmente; en cualquier caso, el vínculo es rico en intercambio intelectual. A menudo, uno de los hijos llega a ser especialmente significativo en tu vida.

Puedes querer dejar un legado escrito o creativo, y en muchos casos autoeditas tu propio trabajo, expresando tu manera única de ver la vida, el amor y la sexualidad.

**Afligido:** adicción al riesgo o al juego, búsqueda de emociones fuertes y dificultad para comprometerte.`,

    6: `Práctico, sistemático, eficiente y muy observador: eres un "arreglador" nato, capaz de ver cómo organizar, mejorar o reparar las situaciones. Meticuloso y analíticamente afilado, tienes una ética de trabajo fuerte y necesitas estar continuamente ocupado, idealmente en tareas que te enganchen mentalmente. Si no, corres el riesgo de que los detalles innecesarios te consuman.

Adquieres conocimiento a través de la vida diaria y de las actividades de rutina. El cuerpo se convierte en un maestro, y el malestar físico te trae lecciones a menudo. Tu salud está muy ligada al sistema nervioso y a la actividad mental; el estrés excesivo o la falta de descanso pueden manifestarse físicamente. Una imagen propia positiva y un pensamiento constructivo pueden mejorar mucho tu bienestar.

**Afligido:** preocupación excesiva que deriva en problemas de salud y en pequeñas alteraciones mentales.`,

    7: `Las asociaciones y el matrimonio son para ti más mentales que emocionales. Buscas a alguien mentalmente estimulante y avispado, pero a menudo encuentras demasiados candidatos o sientes que ninguno te termina de llenar (aunque acabas "casándote" igual). Puedes ser excesivamente crítico con los pequeños detalles. La comunicación con la pareja te resulta esencial, y necesitas a alguien cuyas opiniones se parezcan a las tuyas.

Puedes tener más de un matrimonio, casarte con alguien más joven o casarte muy joven. Tus uniones suelen ser más verbales que formalizadas en papel.

Te interesan profundamente las personas, porque tienes mucho que aprender de los demás y mucho que enseñar. Te comunicas con todo tipo de gente y siempre intentas entender cómo y qué piensan los otros, manteniendo a menudo un buen rapport con el público.

**Afligido:** discusiones excesivas y sobreanálisis. Conviene que revises a fondo todo antes de firmar contratos o acuerdos.`,

    8: `Apariencia soñadora y melancólica. Mente investigadora y perceptiva, intuitiva, reservada y sarcástica. Pensamiento profundo y penetrante, que puede volverse obsesivo. Una atracción fuerte por todo lo oculto, por lo que está más allá de las apariencias. Te atrae estudiar los intercambios psicológicos entre las personas, sobre todo los que ocurren a puerta cerrada. Siempre fascinado por el sexo y la muerte.

Aunque disfrutas compartiendo conocimientos nuevos o secretos con otros, sueles guardarte para ti los sentimientos y las emociones. Te acercas a las experiencias como algo que hay que digerir y saborear despacio.

Tu primera experiencia sexual puede haber ocurrido muy joven y haber tenido la forma de una experimentación de juego con hermanos o vecinos. La atracción sexual la sientes hacia parejas con apariencia juvenil, inteligencia, esbeltez y agilidad. Tú mismo intentas mantener un porte juvenil.

Tienes que evitar el tabaco, cuidar especialmente tu sistema nervioso y ser extremadamente cauto con los contratos, sobre todo los relacionados con herencias.

**Afligido:** la muerte de un familiar (incluso un hijo) o de un amigo cercano te ha dejado un impacto mental profundo.`,

    9: `Mente orientada al descubrimiento y a comprender las leyes y los principios que rigen la existencia. Tienes cualidades intelectuales profundas. Tu conciencia está ligada a la lógica, y lo que no te parezca lógico puedes descartarlo como irreal. Tienes una urgencia natural por expandir y ampliar la mente, y un deseo fuerte de enseñar lo que has aprendido e inspirar a otros.

Influyes en los demás mediante la convicción y la comunicación sentida. Claro, agudo y perspicaz, transmites con facilidad grandes visiones filosóficas. Persigues metas elevadas en la vida, en el trabajo y en las relaciones. Sueles interesarte por la filosofía, la religión y los viajes.

Un familiar que vive en el extranjero o un viaje largo pueden influirte profundamente en tu visión del mundo.

**Afligido:** terco, demasiado crítico, imprudente y propenso a los conflictos con familiares.`,

    10: `Rápido, agudo, concienzudo, aunque a veces descuidado; exitoso y comunicativo.

Sueles cambiar de trabajo a menudo o desempeñar varios roles a la vez. Tu carrera te importa, y te atraen las profesiones públicas. Mientras persigues tu vocación, sigues aprendiendo, sobre todo sobre ti mismo y tu entorno.

Quieres que se te vea como alguien alerta, inteligente y capaz, igual que en su día veías a uno de tus padres. Buscas reconocimiento por tus ideas. En general, los demás te admiran y sueles alcanzar el éxito. Te mantienes bien informado y aportas información útil a quienes te rodean. Tus hermanos son figuras de referencia significativas.

**Afligido:** problemas de comunicación con los padres, o una sensación de pérdida respecto a un progenitor que estuvo presente físicamente, pero ausente mental o emocionalmente. Puedes actuar de forma amoral para alcanzar tus objetivos, ser muy directo o atrevido.`,

    11: `Activo, original y atraído por gente culta, diversa e intelectualmente estimulante. Las amistades te enriquecen las ideas, las perspectivas y la sensación de quién eres. Sueles unirte a grupos con objetivos intelectuales o creativos compartidos, lo que te apoya el crecimiento personal y refuerza tus intereses.

Te esfuerzas por tomar decisiones de forma lógica y sin sesgo emocional, a menudo por el beneficio del grupo. Tienes un diálogo interno fuerte, y tienes que trabajar la quietud mental para no sobrepensar todo. Los grupos de amigos te son esenciales para el desarrollo intelectual; los hermanos pueden convertirse en amigos cercanos, o los amigos pueden sentirse como hermanos.

La comunicación a veces se te complica: puedes sentirte incomprendido por los demás. Son comunes las conexiones con grupos sociales o intelectuales (escritores, críticos, círculos de opinión). Tus amistades suelen ser más mentales que emocionales. Puedes buscar amigos que asuman la responsabilidad de decidir, o incluso que trabajen en tu nombre.

**Afligido:** crítico, cínico o excéntrico; potenciales escándalos relacionados con las amistades.`,

    12: `Te sientes perdido en un mundo interno difícil de comprender. Introvertido, confuso, nebuloso y muy sensible. Te cuesta expresarte y puedes carecer de seguridad en ti mismo, algo que sueles esconder: no dices abiertamente lo que piensas. El sentido común no siempre es tu fuerte, y puedes tomar decisiones sin lógica aparente.

Tienes un interés fuerte por la psique y por conectar lo consciente con lo inconsciente. Sin entender tu inconsciente, no puedes entenderte del todo ni saber qué te mueve. Tienes que gestionar tu energía mental con cuidado: los pensamientos negativos pueden destruirte, mientras que los positivos pueden salvarte. Eres propenso a patrones de pensamiento obsesivo o perturbador.

El miedo a "perder la cabeza" puede llevarte a volverte hiper-racional y a confiar solo en lo que puedas verificar. Puedes tener dificultades para distinguir tus propios pensamientos de los de los demás, absorbiendo energías mentales y emocionales con demasiada facilidad. Te dejas influir, eres propenso al escapismo mental y puedes usar sustancias o prácticas místicas para sentirte orientado. La reflexión y el autoconocimiento son esenciales para ti.

Las relaciones con tus hermanos pueden implicar elementos de renuncia o lecciones significativas. No soportas sentirte juzgado. Algunas experiencias tempranas pueden enturbiarte la claridad o la neutralidad de la percepción, generando desafíos.

Esta posición puede indicar fuertes capacidades psíquicas y acceso a sabiduría ancestral o de vidas pasadas.

**Afligido:** paranoia, distorsión de la realidad, sospecha de que todo y todos conspiran contra ti, y deficiencias mentales.`,
  },

  venus: {
    1: `Eres naturalmente bello, encantador y atractivo. Eres muy sensible a las apariencias, tanto a la propia como a la de los demás.

Valoras las relaciones, las conexiones sociales y buscas atraer a otros a tu mundo y formar vínculos significativos. Las relaciones son esenciales para tu sentido de identidad, y a menudo atraes parejas que te hacen sentir amado y apreciado.

Sueles ser agradable, dulce y conciliador, pero también puedes depender de la validación constante respecto a tu atractivo, tu inteligencia o tu deseabilidad. Esa tranquilidad se desvanece rápido y necesita renovarse, lo que puede crear un ciclo de búsqueda de aprobación.

Puede haber una obsesión con la belleza, especialmente con la propia. Cuando sientes que no puedes atraer ni obtener afecto, puedes recurrir al encanto, a la diplomacia o incluso a conductas superficiales para ganar reconocimiento, escondiendo a veces tu verdadera personalidad tras una máscara de dulzura o elegancia. Hay una fuerte tendencia a distorsionar la realidad para mantener la armonía o la aceptación.

Tienes sentimientos impulsivos y apasionados, pero pueden ser fugaces. Eres naturalmente generoso y te inclinas a aliviar el sufrimiento de los demás, a menudo con simples gestos o palabras. Tienes una receptividad natural ante la vida, una apreciación por el placer y, en general, disfrutas de una vida agradable y alegre, especialmente si tu infancia fue bonita.

Las inclinaciones artísticas son comunes, aunque a veces poco desarrolladas por pereza o falta de iniciativa.

Debes cultivar valor propio, responsabilidad e independencia emocional. Vales mucho y no necesitas que otros te lo recuerden.`,

    2: `Puedes atraer abundancia y facilidad para crear riqueza: un flujo natural de recursos, a veces con un esfuerzo mínimo. El matrimonio o las asociaciones pueden elevar tu estatus social o económico, y suele haber un fuerte aprecio por la moda, la belleza, el arte y todo lo deseable. Los hombres pueden ganar o perder dinero a través de las relaciones o de asuntos legales.

Puedes tener una percepción positiva de ti mismo y la capacidad de disfrutar las comodidades de la vida sin culpa. Tienes un sentido natural para el valor de los objetos, las inversiones o las búsquedas artísticas, y puedes encontrar ingresos a través de profesiones relacionadas con la belleza, la creatividad o la naturaleza.

Sin embargo, cuando está mal integrada, puedes tener apego, miedo a la carencia o ambición material excesiva. Tu autovalor puede quedar demasiado ligado a tus posesiones o ingresos, y un pensamiento basado en el miedo, «¿y si lo pierdo todo?», puede llevarte a la avaricia, la acumulación o el derroche.

Los hombres pueden experimentar dificultades financieras relacionadas con mujeres o disputas matrimoniales, mientras que las mujeres pueden tener problemas para separar la ganancia material de la seguridad emocional.

Has venido a equilibrar la comodidad material con la generosidad y el disfrute ético de la riqueza. Recompensa a quienes cultivan la autoconciencia y la equidad, y advierte contra el exceso, el apego o la sobreidentificación con el dinero.`,

    3: `Puede haber habido buenas relaciones con los hermanos o rivalidad entre, triangulaciones o incluso dinámicas familiares complejas, lo que requiere precaución para no mentir o adornar la realidad con tal de obtener aprobación.

Amas y seduces a través del lenguaje, usando la diplomacia, el encanto y un estilo de comunicación poco amenazante. Eres sensible a las necesidades de los demás y te adaptas con facilidad a entornos distintos. La gente se abre contigo con facilidad, y aprendes sin esfuerzo.

A menudo existe un gusto por los viajes cortos, las escapadas o las salidas de fin de semana, que pueden ser esenciales para mantener una relación, encontrarte con un amante o conectar con alguien cercano.

En conjunto, tus relaciones enfatizan la atracción intelectual, la interacción social fluida y el arte de encantar a los demás a través de las palabras.`,

    4: `Te importa el hogar, la familia y la seguridad emocional.

Crear un hogar armonioso, nutritivo y estéticamente agradable es una fuente de cuidado para ti. Sientes un fuerte sentido de pertenencia (que en algunos casos puede ser negativa) y tu entorno doméstico te nutre emocionalmente.

Estás fuertemente influenciado por la herencia emocional que te dio tu madre. Puedes idealizar tu infancia, a veces venerando mucho a uno de tus padres mientras infravaloras, entras en conflicto o incluso rechazas al otro. Para ti, el amor y la familia están estrechamente entrelazados: «Si te amo, perteneces a mi familia». Es posible que hayas sido el hijo favorito o que te hayan criado con más libertad.

Tienes una necesidad profunda de seguridad emocional y material, y puedes interesarte por la genealogía o las raíces ancestrales, trabajando a menudo patrones kármicos familiares.

Tiendes a ser conservador con el dinero, te centras en asegurar la estabilidad para la vejez y puedes recibir propiedades o riqueza a través de la familia. Tus relaciones románticas más plenas suelen darse más tarde en la vida, normalmente en el contexto de un hogar compartido o una vida doméstica.`,

    5: `Necesidad natural de expresión artística o creativa, que puede elevarte personalmente y traer armonía interior. Sueles ser atractivo, con estilo y expresiva, y a menudo te enamoras de la idea misma del amor.

El romance, la seducción y la pasión son prioridades centrales: puedes sentir que solo estás verdaderamente vivo cuando vives experiencias románticas intensas.

Los hijos suelen ser importantes y te aportan alegría e inspiración. Al menos uno de ellos puede destacar como especialmente significativo y potenciar tus inclinaciones artísticas o creativas. Debes tener cuidado de no proyectar deseos no cumplidos en tus hijos ni crear rivalidad entre ellos, o entre ellos y tú.

Destacas organizando eventos sociales, teatro, cine u otros ambientes artísticos. Tu presencia es magnética y te atraen naturalmente los entornos elegantes y estimulantes.

Puedes tener necesidades emocionales centradas en el ego, una preocupación excesiva por ser admirado o vista como atractivo, conductas arriesgadas, juego o descuido de los hijos.

Puedes tener dificultades con la monogamia o sentirte atraído por situaciones románticas difíciles de resistir. También existe el riesgo de equiparar la sensación de estar viva con el drama romántico, lo que vuelve tu vida emocional intensa pero potencialmente inestable.`,

    6: `Te sientes cómodo trabajando desde casa y disfrutas de los rituales diarios, que a menudo realizas con elegancia, aunque debes aprender a relajarte y no volverte demasiado rígido.

Tienes un fuerte deseo de cultivar y refinar tus talentos y habilidades; no te basta con completar una tarea: quieres hacerla con belleza, no solo con eficiencia.

Esto suele inclinarte hacia profesiones conectadas de forma práctica con la belleza, la salud, el bienestar y el cuidado, como la educación física, el estilismo, el diseño o campos afines.

Tienes un excelente ojo para el detalle y eres muy apto para tareas que requieren precisión. Sin embargo, existe el riesgo de obsesionarte con detalles pequeños que pueden romper la armonía general de un proyecto. A pesar de esto, te esfuerzas constantemente por llevar armonía al lugar de trabajo y normalmente lo consigues.

Te relacionas bien con compañeros y clientes, y te ganas el respeto de quienes te rodean, incluidos los subordinados, a quienes tratas con justicia y amabilidad, haya o no sentimientos románticos de por medio.

Emocionalmente tiendes a ser tímida, reservada y poco demostrativa, y puedes tener dificultades para recibir expresiones de amor. Tu forma de amar es a través del servicio: muestras cariño siendo útil, dedicada y atenta.

Puedes enamorarte de compañeros de trabajo o personas con quienes colaboras, proyectando tus ideales románticos en las relaciones profesionales. También sientes un amor profundo y genuino por las mascotas y los animales de compañía.

Debes gestionar las dificultades en las relaciones porque si no, pueden manifestarse físicamente, somatizando las cuestiones emocionales en enfermedad. En esos casos, puedes luchar con sentimientos de inutilidad o de no merecimiento, creyendo que no eres valioso o digna de amor.`,

    7: `Te descubres a través de las relaciones, y la vida cobra más sentido cuando estás en pareja. Buscas conexiones hermosas y armoniosas, y valoras la cultura, el refinamiento y los buenos modales. Tienes una fuerte tendencia a proyectar tanto tus virtudes como tus defectos en tu pareja, idealizando a menudo el amor.

Cuando la persona que tienes delante se queda mínimamente por debajo de ese ideal, puedes volverte excesivamente crítica o sentirte profundamente decepcionado.

Puedes tener dificultades para reconocerte o entender realmente tu propia naturaleza. También te cuesta aceptar que las relaciones, más allá de su belleza y sus momentos de alegría, requieren esfuerzo sostenido y trabajo duro. A menudo te enamoras de la idea de la relación más que de la persona en sí, y necesitas las conexiones románticas para sentirte vivo y pleno.`,

    8: `Te enamoras de personas comprometidas con otra persona, no disponibles o inadecuadas. Puedes experimentar pérdidas de seres queridos por muerte, abandono o infidelidad.

El mundo emocional se convierte en terreno fértil para los miedos, las obsesiones y te ofrece oportunidades para confrontar e integrar los aspectos ocultos de ti mismo. Sientes una fuerte atracción por lo misterioso, lo esotérico y los temas tabú, así como por el inconsciente, con el deseo de explorar estos reinos ocultos como camino hacia la plenitud interior.

En esos casos, puedes volverte implacable al perseguir tus deseos, temer la entrega emocional o atraer relaciones intensas, atormentadoras o incluso destructivas. Posees una habilidad natural para la seducción emocional y la influencia psicológica, y tu magnetismo sexual suele ser poderoso, permitiendo que tus parejas se abran y se sientan seguras contigo con relativa facilidad. Tu encanto puede llevar a otros a entregarse emocionalmente, sea de forma intencional o no.

A pesar de estos desafíos, esta posición puede ser muy beneficiosa para la ganancia financiera y material a través de sociedades comerciales, matrimonio o herencia. Valoras los intercambios que son mutuamente beneficiosos y están llenos de belleza, valor y refinamiento.

En última instancia, a través del crecimiento y el autoconocimiento, llegas a darte cuenta de que tienes dentro de ti todo lo que necesitas y ya no deseas nada externo. En la madurez, alcanzas una profunda plenitud interior.`,

    9: `Encuentras paz, estabilidad y sentido a través de tus sistemas de creencias, tu filosofía o tu visión del mundo. Eres naturalmente optimista, generoso, y te atrae la exploración, el viaje y la aventura, buscando placer y crecimiento a través de nuevas experiencias.

Te atraen las personas sabias y cultas, los maestros, los animales y las culturas extranjeras. Es probable que te enamores en el extranjero, te cases con un extranjero, adoptes costumbres de otro país o conozcas a una pareja significativa durante un viaje.

Eres un excelente maestro, capaz de transmitir pasión y entusiasmo por tu materia a tus alumnos. Honesto y justo, a veces puedes carecer de diplomacia, pero sirves de ejemplo a los demás por tu integridad y sinceridad.`,

    10: `Atraído por el poder o por personas en posiciones de autoridad. Naturalmente grácil, encantadora y con estilo, causas una fuerte impresión en quienes te rodean y a menudo te ganas su admiración con facilidad, aunque a veces sea mediante un encanto calculado. Rara vez te cuesta obtener el favor del sexo opuesto.

Profesionalmente, buscas roles que te permitan brillar, expresar creatividad y sentir que tu trabajo es útil y gratificante. Te atraen los entornos laborales armoniosos y agradables, y sueles mantener excelentes relaciones con tus superiores o con quienes ejercen liderazgo.

El reconocimiento y el ascenso pueden llegarte a través de tus talentos, tus modales, tu belleza o el favor de personas influyentes, incluidos padres o parejas.

Pueden darse dinámicas complejas con tu madre: puedes haber tenido una relación cálida y de apoyo, o puedes haber sentido rivalidad, inadecuación o la sensación de no estar nunca a la altura. En los hombres, la madre puede representar un tipo idealizado, influyendo en su elección de esposa.

A menudo deseas una pareja que te aporte estatus social, riqueza o visibilidad. Tu ambición es fuerte y buscas validación para tu creatividad, tu utilidad y tus logros.`,

    11: `Popular y a menudo atraes una clientela femenina fiel o un círculo de amigos que te apoyan, dependiendo de los aspectos. Te atraen naturalmente las personas artísticas y con inquietudes culturales, y disfrutas los viajes en grupo, las actividades sociales y las experiencias culturales. Tienes una fuerte inclinación a conectar con los demás, contribuyes positivamente al grupo y recibes apoyo a cambio.

En las amistades y las relaciones románticas, necesitas lealtad, reciprocidad y una conexión emocional profunda. A menudo necesitas amistad dentro de tus relaciones de pareja, e incluso puedes formar vínculos románticos con amigos o clientes; tus exparejas pueden seguir siendo amigas cercanas (pero cuidado con esto porque hace que te cueste más empezar nuevas relaciones).

Tu sentido de autovalor está estrechamente ligado a la aceptación social y a la validación de los demás: te sientes hermoso y valioso cuando quienes te rodean te reconocen.

Tienes altas expectativas respecto a la amistad y el compromiso, y puedes sentir decepción cuando los demás no están a la altura de tus estándares. Los amigos pueden ser grandes aliados en momentos críticos, o pueden convertirse en fuertes rivales, según las circunstancias.

Cuidado con pasar demasiado tiempo en redes sociales y en cambiar mucho de relación.`,

    12: `El amor, el sufrimiento y las heridas emocionales pueden servirte como caminos de crecimiento en el amor, la belleza y la ternura. Buscas un amor divino, absoluto e inconmensurable, una realización total que a menudo hace que el amor terrenal sea difícil de satisfacer.

Tu anhelo de una unión idealizada y sin límites puede llevarte a enamorarte de quienes no pueden corresponderte o cuyo amor no está disponible, evitando así la dolorosa realidad de que el amor perfecto que buscas no puede existir en forma humana.

Te atrae la soledad, lo sutil y lo invisible, y a menudo sientes compasión por los rechazados, los olvidados o los pasados por alto. Eres capaz de un sacrificio profundo y desinteresado por amor, y puedes involucrarte apasionadamente en relaciones prohibidas o inalcanzables, amando sin esperar nada a cambio.

También puedes «amar» la soledad, encontrando inspiración y descubrimiento en períodos de aislamiento. Pueden emerger talentos ocultos en esos momentos, especialmente cuando trabajas entre bastidores, en hospitales o en entornos tranquilos orientados al servicio.

Te atrae la belleza sutil, esquiva o intangible, y tus afectos suelen ser símbolo de algo más grande o trascendente, lo que hace que te resulte difícil expresar el todo por qué amas lo que amas. Antes de empezar el día, puedes necesitar tiempo de reflexión o meditación para centrarte.

Sueñas con entregarte al amor como si fuera divino, buscando una unión sin límites y encontrando, a veces, que es más fácil soportar el desamor que aceptar las limitaciones del amor humano.`,
  },

  marte: {
    1: `Tienes una personalidad fuerte, abierta y enérgica, a menudo con energía suficiente para dos personas. Eres impulsivo, competitivo y te mueve la necesidad de ser reconocido, tomando con frecuencia la iniciativa y abriéndote tus propios caminos. Destacas como líder, emprendedor o pionero, mostrando coraje, tenacidad, confianza y espíritu combativo.

Eres activo, inquieto e impaciente, sueñas a lo grande y actúas con optimismo. Son comunes los estallidos de ira breves pero intensos, y a menudo discrepas con los demás. Por fuera puedes parecer calmado, pero por dentro eres muy enérgico y difícil de agotar. Persigues tus metas personales por etapas, avanzando con constancia hasta conseguir lo que te has propuesto.

La audacia física te es natural; a menudo desatiendes tu propia seguridad o salud, sobre todo en la juventud, aunque sueles practicar deporte. Tu enfoque es fuerte, pero la disciplina puede ser un desafío, y la interferencia externa no es bienvenida. Tus emociones son intensas e impredecibles; un exceso de sensibilidad puede minar tu autoconfianza. Tienes una alta energía sexual.

Necesitas tomar las riendas de tu propio destino y aprender a canalizar tus impulsos hacia resultados constructivos.

La vida puede ser una lucha, pero posees el impulso para perseguir tus metas con éxito. En la etapa más tardía, a menudo necesitas ajustar tus impulsos y tu conducta para alcanzar la paz interior.`,

    2: `Debes trabajar duro para ganar dinero, a menudo un esfuerzo intenso. La estabilidad financiera rara vez llega con facilidad, y una vez ganado, te gastas muy rápido el dinero, creando patrones cíclicos de ganancia y pérdida.

El dinero simboliza para ti poder, fuerza y control, y deseas con fuerza disfrutar los placeres materiales de la vida. Debes aprender que lo que de verdad te da poder, es tu esencia.

Eres tenaz y proactivo, dispuesto a luchar por lo que quieres. Puedes actuar impulsivamente, esperando que los demás te provean o entreguen lo que deseas de inmediato. El mal genio es común, especialmente ante los pequeños errores de otros. Puedes descargar tu frustración sobre los objetos, rompiendo cosas en un exceso de ira, a menudo sin reparar en tus propios errores.

Puedes sentirte atraído por empresas financieras arriesgadas. Para ti, las dificultades financieras suelen estar ligadas a la seguridad personal y a la independencia inmediata. Las veces que te quedas en bancarrota o lo pierdes todo es una oportunidad para empezar de nuevo.

Las expresiones positivas incluyen coraje, iniciativa y la capacidad de afirmarte para proteger tus recursos o luchar por tus creencias, aunque a veces puedas intentar imponérselas a los demás.`,

    3: `Posees agudeza, pensamiento rápido y facilidad con las palabras. Sueles tener un vocabulario extenso y un intelecto penetrante, pero puedes carecer de tacto, siendo mordaz, irónico o sarcástico. Tus palabras te sirven como herramienta para afirmarte, demostrando vitalidad, autoridad y presencia en tu entorno.

Necesitas movimiento constante y estímulo mental. Si las circunstancias o tu falta de vocabulario emocional reprimen tu capacidad de hablar o expresarte, la tensión acumulada acaba estallando en una expresión verbal contundente.

Puedes disfrutar el debate o defender ambos bandos en una discusión solo por el placer de la agilidad mental. Escribir o hablar sobre tus pensamientos y sentimientos te funciona como una forma efectiva de terapia.

Son comunes los conflictos con hermanos, vecinos o profesores, que suelen provenir de experiencias tempranas de la infancia en las que tuviste que afirmar tus límites y poner a prueba tu poder. Puedes tener un gran número de amantes, aunque esas relaciones pueden ser conflictivas.

Se aconseja precaución con los viajes, los trayectos cortos o la conducción. La velocidad y la emoción suelen resultarte atractivas.

En algunos casos, puede darse dificultad para la concentración, accidentes de coche o de viaje, posibles violaciones de límites sexuales o familiares (incesto o abuso) y elaciones conflictivas con hermanos o familiares cercanos.`,

    4: `Tuviste disputas familiares, luchas de poder y tensión doméstica, a menudo centradas en torno a un progenitor dominante, normalmente el padre. Puedes sentirte en competencia constante con esa figura.

Muchos dejan el hogar parental temprano para intentar crear su propio hogar, buscando autonomía respecto a la crianza recibida, pero los patrones aprendidos se los llevan y hasta que no los sanen, los repiten.

Las experiencias tempranas pueden incluir la pérdida de un progenitor, una separación parental traumática o violencia doméstica. Estos eventos pueden generar un resentimiento invisible y una ira reprimida hacia los padres.

Tienes una fuerte necesidad de autodescubrimiento personal e independencia respecto a la tradición o la herencia familiar, aunque la claridad sobre lo que realmente quieres suele emerger más tarde en la vida.

Cuidado porque existe un riesgo potencial de accidentes en casa, incluidos derrumbes, incendios o peligros durante construcciones o reformas.

Si la energía de Marte no se expresa constructivamente, la ira puede interiorizarse, lo que puede dañar tus logros personales o el entorno del hogar.`,

    5: `Posees vitalidad, entusiasmo y un fuerte espíritu competitivo. Te sientes vivo cuando expresas creativamente, pero cuidado con buscar validación externa a través de tus logros.

Tienes un impulso natural a hacer las cosas de manera espectacular, porque la creación en sí misma te hace sentir más poderoso y auténtico. Hay una fuerte atracción por los deportes competitivos y de riesgo, y tu energía prospera cuando persigues desafíos que ponen a prueba la habilidad y el coraje.

En el amor y el romance, eres seductor y apasionado. Tus relaciones pueden ser intensas, a veces imprudentes y ocasionalmente marcadas por el conflicto o la volatilidad.

En cuanto a los hijos, esta posición puede indicar descendencia fuerte y enérgica o, por el contrario, desafíos y conflictos con ellos. A menudo sientes un impulso profundo de formar una familia, pero también deseas mantener tu libertad, por lo que fomentas independencia y fortaleza en tus hijos, lo que puede hacerles daño. En caso de dudas, es mejor no formar una familia.

En las mujeres, puede sugerir partos muy rápidos, aunque también se indican con frecuencia cesáreas o partos traumáticos.

No se aconseja jugar ni invertir. Las relaciones pueden ser abruptas, egocéntricas o impulsivas, y existe una tendencia a perderte en juegos, placeres o excesos.`,

    6: `Tienes vigor, resistencia y un fuerte impulso para superar enfermedades físicas. Sueles tener una atención muy centrada en tu cuerpo y necesitas independencia y autosuficiencia en tus rutinas diarias.

Prosperas cuando estás activamente comprometido, y tu energía puede ser una herramienta poderosa para mantener la salud, pero cuidado porque puede darse lesiones autoinfligidas o enfermedades relacionadas con el estrés.

Te esfuerzas por destacar en tu trabajo y a menudo te resistes a recibir órdenes. Si gestionas empleados, pueden surgir conflictos por tu naturaleza asertiva y, a veces, intransigente.

Las profesiones típicas incluyen el ámbito militar, la policía, la mecánica, la metalurgia o cualquier rol que requiera acción rápida y decidida, atención meticulosa al detalle o esfuerzo físico directo.

Tu estilo de trabajo varía: algunas trabajan rápido y con decisión, incluso de forma descuidada a veces, mientras que otras son extremadamente meticulosas y vuelcan sus valores personales en cada pequeño acto.

Tu energía y tu enfoque pueden hacerte muy efectiva, pero la falta de disciplina o un perfeccionismo excesivo pueden derivar en accidentes o problemas de salud.

Cuidado con ser hipercrítica, perfeccionista, propensa al exceso de trabajo y obligada a demostrar tu pericia. Pueden surgir accidentes laborales o problemas de salud por estrés o negligencia.`,

    7: `Te defines a través de las relaciones, buscas poder y afirmación dentro de las relaciones. Existe una necesidad constante de validación por parte de los demás, por ello si no la recibes, puedes estancarte y frustrarte.

Sueles ser dominante y puedes actuar como un «conquistador» en el amor y las asociaciones. Esta posición puede atraer parejas intolerantes, irascibles o dominantes, o puede llevarte a proyectar esos rasgos sobre tu cónyuge.

En las sociedades comerciales, puedes tener disputas o batallas legales, ya que a menudo te resulta difícil confiar en otros y puedes terminar cargando con responsabilidades propias y ajenas a la vez.

Cuidado porque liberas tu rabia hacia quienes más te importan. Cuando estás plenamente consciente, puedes fomentar relaciones estimulantes y dinámicas en las que ambas partes se desafían e inspiran mutuamente de forma positiva.

Puede darse que las asociaciones sean impulsivas, competitivas o motivadas por la pasión o la necesidad de escapar. También que los matrimonios o alianzas comerciales sean propensos al conflicto, con mayor agresividad y riesgo de separación o disputas legales.`,

    8: `Fuerte necesidad de independencia y un deseo de afirmar el control sobre los demás. Estás decidido a perseguir lo que quieres, a menudo sin importarte las consecuencias, y posees una fuerza extraordinaria en situaciones de crisis. Debes enfrentarte a los límites, cortar lo que no funciona y regenerarte en circunstancias desafiantes.

Mentalmente, tiendes a ser intenso, con tendencias obsesivas y una agresividad interna que puede volverse autodestructiva si no la gestionas conscientemente. Te atraen las áreas tabú, ocultas o transformadoras, incluyendo el ocultismo, el conocimiento esotérico y el inframundo psicológico, aunque el miedo suele acompañar a esta curiosidad.

Feroz al defender tus creencias, incluso si las adoptaste de otros, irradias una presencia que puede provocar fascinación y miedo a la vez en los demás.

Sexualmente, eres intenso y apasionado, y a menudo usas el sexo como una forma de liberar tensión o expresar deseos ocultos.

En cuestiones de finanzas y recursos compartidos, pueden surgir conflictos, especialmente en torno a herencias conjuntas, y los aspectos negativos pueden indicar inestabilidad o pérdida.

La vida puede presentar finales repentinos, violentos o tempranos, ya sea personalmente o en tu entorno. La agresividad interna y las tendencias obsesivas deben expresarse de forma constructiva; de lo contrario, corres el riesgo de autodestruirte o de dañar a los demás.

Cuidado porque pueden darse conductas implacables o despiadadas, conflictos intensos con parejas o socios, y encuentros con la lujuria, la ira, el odio u otras energías emocionales oscuras.

Expresada positivamente, esta posición te da una resiliencia extraordinaria en situaciones extremas, la capacidad de transformar y poner fin a relaciones o situaciones insanas antes de que se descompongan, y una comprensión profunda de la psicología humana, la intimidad y la transformación personal.`,

    9: `Eres un buscador de conocimiento. Eres aventurero, de mente abierta, y deseas descubrir nuevas filosofías, culturas y significados más profundos en la vida. Sueles ser escéptico y necesitas experimentar de primera mano para creer o entender de verdad.

Te esfuerzas por el desarrollo intelectual y por la maestría, lo que te da confianza y un sentido de poder en tu campo elegido. La actividad física, el viaje o el entrenamiento, a veces a nivel de élite, también pueden ser una salida importante para tu energía.

Actúas con audacia al buscar nuevas experiencias y a menudo te sientes inspirado a desafiar los límites, ya sea mentales, físicos o espirituales.

Cuando está afligido, existe el riesgo de conflictos o accidentes durante los viajes. Puedes abandonarlo todo impulsivamente e irte lejos. Los extremos incluyen el fanatismo, la devoción rígida a una deidad o ideología, o los conflictos con el lugar de trabajo o con los suegros. Puedes sentir que nadie conoce realmente la verdad o, al contrario, culpar a tus ideales superiores o a tus autoridades espirituales cuando las cosas salen mal.

Por encima de todo, eres un explorador valiente, aprendiz de por vida y pensador independiente que inspira a otros a través de su visión, su conocimiento y su acción.`,

    10: `Tu vida está fuertemente asociada al éxito social, y vuelcas tu energía en las ambiciones profesionales, esforzándote por destacar y elevarte por encima de los demás. El liderazgo te surge de manera natural, aunque cuidado porque puedes caer en la tiranía o en despliegues agresivos de autoridad.

Uno de tus padres, a menudo el padre o una figura parental dominante, ejerció una fuerte influencia, enseñándote desde temprano que el mundo es duro y que requiere lucha para evitar la sumisión. En positivo, ese progenitor puede estimular tu ambición y tu impulso, animándote a afirmarte y a buscar la excelencia.

Puedes trabajar de forma autónoma o asumir roles en los que estés al mando. Sueles encontrarte entre atletas de élite, líderes o personas que se elevan a la prominencia a través de la determinación y la acción.

Puede existir el riesgo de ambición excesiva, escándalos, conflictos con la autoridad o luchas de poder. Pueden aparecer la tiranía o la sobrecompetitividad si el impulso por triunfar no se atempera con conciencia.`,

    11: `Enfatiza la participación activa en grupos, amistades y redes sociales. Te mueve buscar reconocimiento por tus logros y afirmar tu influencia dentro de los contextos colectivos. Puede surgir conflicto entre tu individualidad y la necesidad de cooperar con un grupo.

A menudo destacas movilizando equipos, tomando la iniciativa y liderando proyectos, pero también puedes desviar la culpa hacia otros cuando las cosas salen mal. Los roles comunes incluyen el de activista, organizador o militante. Tus relaciones suelen ser con personas fuertes, activas y a veces competitivas.

Esta posición ayuda a clarificar las metas y estrategias de Vida.

Cuando, son comunes las disputas o traiciones con amigos o pares afines, además de tendencias competitivas o fanáticas.`,

    12: `Tienes mucha energía interiorizada y luchas ocultas. Puedes sentirte insatisfecho con la vida, quejarte con frecuencia pero actuar poco. Puedes ser escapista, autodestructivo o pasivo-agresivo.

Puede que te falte el coraje o la franqueza para expresarte abiertamente y aparezcas como esquivado o derrotado. Las salidas físicas como las artes marciales, la esgrima, la natación u otras actividades cuerpo-mente ayudan a descargar esta energía inconsciente.

La sexualidad puede estar reprimida o ser secreta, y las tendencias agresivas inconscientes pueden proyectarse sobre otros o ser absorbidas de ellos. En el mejor de los casos, esta posición puede convertirte en defensora o protectora de los demás, canalizando positivamente la energía reprimida.

Cuidado porque puedes tener enemigos secretos, peligro de encarcelamiento u hospitalización, y enfermedades o cirugías inusuales relacionadas con el signo de la casa.`,
  },

  jupiter: {
    1: `Eres un filósofo natural. Con una actitud jovial y optimista, intentas explicar las grandes preguntas de la existencia; puedes sentir que tienes una misión y, en cualquier caso, buscas el sentido de la vida. Temes la soledad y te orientas hacia el bien y la equidad, aunque puedes creer que tienes demasiado que ofrecer y volverte autoritario.

No eres diplomático, pero sí acogedor, afectuoso y deseoso de agradar, lo que al final te hace querido. Pones mucha pasión en lo que emprendes, pero necesitas moverte más rápido y fijarte metas cada vez más lejanas.

Detestas el trabajo duro (a menos que seas Capricornio) y a menudo te falta concentración para terminar lo que empiezas; si surgen obstáculos, puedes optar por el camino fácil. Disfrutas los viajes, el aire libre, el campo y los deportes (en lugar de cultivar la mente, puedes obsesionarte con ellos). Puedes ser aventurero o juguetón.

Te esfuerzas por ser útil a quienes amas o a quienes lo necesitan. Debes cuidarte de no ser demasiado indulgente contigo mismo, demasiado ostentoso o excesivamente excéntrico en tus gustos.`,

    2: `Buena suerte y generosidad de corazón.

Eres económicamente afortunado, principalmente porque eres capaz de hacer mucho con poco, pero debes cuidarte de no gastar de más. El crecimiento de tus recursos siempre se busca como un medio para aumentar tu alegría. Debes cuidarte de no equiparar el valor del dinero con tu propio autovalor.

Puedes coleccionar objetos con significado. Eres capaz de inspirar a otros, eres entusiasta y sabes darle un propósito práctico a la vida. Tiendes a encontrar justificaciones «más elevadas» para tus deseos insaciables.`,

    3: `Buena expansión mental, pero potenciales problemas en la comunicación (puedes hablar demasiado). Inspiras, pero no siempre actúas.

Puedes concentrarte en algo sin perder de vista lo que ocurre a tu alrededor. En cualquier caso, tienes abundancia de ideas. Necesitas aprender continua e incansablemente, sintiendo que una sola vida no es suficiente para aprenderlo todo.

Sería natural que tuvieras varios hermanos y mantuvieras con ellos buenas relaciones y fructíferas. Sin embargo, tus expectativas hacia los hermanos pueden ser demasiado altas, lo que tarde o temprano lleva a la decepción. Las rivalidades con hermanos mayores pueden convertirse en una lucha silenciosa por demostrar quién es «el mejor».

Esta posición indica a menudo cambios de residencia en la infancia. De adulto, también puedes pasar períodos en el extranjero y a menudo hablas más de un idioma. Animar a estudiar desde temprano es muy beneficioso para los niños con esta posición. También puede indicar amantes.`,

    4: `Una familia respetable y económicamente segura (posiblemente aristocrática o muy religiosa) te proporcionará buena fortuna, especialmente en la segunda mitad de la vida. Esto puede ser cómodo siempre que no te sientas atrapado por la vida doméstica o las obligaciones familiares. Puedes heredar tierras, propiedades o bienes raíces de tus padres u otros familiares, lo que verás como algo natural.

Tu hogar puede ser, o haber sido, un centro de actividades sociales, filosóficas o espirituales. Puedes tener antepasados extranjeros o pasar parte de tu vida en el extranjero. Buscarás un hogar ideal, preferiblemente en el campo, abierto, espacioso y de madera.

Puedes enfocar tu ambición en el desarrollo y crecimiento del alma, y dejar en segundo lugar el reconocimiento social o profesional.

Existe el peligro de equiparar a un progenitor con una deidad. Tienes una gran fe y optimismo ante la vida.`,

    5: `Prefieres hacer las cosas a lo grande. Tu lema podría ser «más es mejor que suficiente».

Necesitas expresarte con estilo y exageración. Al ser creativo, pareces encontrar a «Dios» dentro de ti mismo. Eres audaz, disfrutas los desafíos y te sientes vivo fijándote metas cada vez mayores. Sueles disfrutar los juegos, los deportes y la bolsa. Tienes muchos hobbies, pero rara vez te tomas el tiempo de dominar alguno.

Puedes cooperar, pero solo si lideras. Crees que tus ideas siempre son las mejores y que mejorarán lo que aporten los demás. Eres popular y divertido.

Eres muy romántico, pero la fidelidad y las parejas tradicionales no son para ti: necesitas el cambio y la exploración. A pesar de estar casado, puedes no ser fiel.

Si decides tener hijos, las relaciones suelen ser buenas, pero debes evitar proyectar en ellos tu deseo de libertad o presionarlos para que sean siempre «los mejores». Sueles enseñarles buenos principios y valores.`,

    6: `Puedes sentirte restringido, ya que esta casa se centra en las rutinas diarias, el trabajo, el servicio y la salud, más que en un deseo natural de expansión. Sin embargo, esta posición ofrece la oportunidad de encontrar sentido y crecimiento personal a través del trabajo, el servicio a los demás y las responsabilidades cotidianas. A menudo hay una fuerte vocación relacionada con ayudar, sanar o ser útil, y muchas personas con esta posición se ven atraídas por las profesiones del cuidado o por actividades que benefician a otros.

Puedes buscar el propósito a través de tu trabajo, de la estabilidad financiera o del cuidado de tu cuerpo. Puedes abordar las tareas de dos formas extremas: o haciendo las cosas rápido y de manera algo descuidada porque te aburren las rutinas, o volviéndote extremadamente meticuloso y enfocado en los detalles. Sueles enorgullecerte mucho de tu trabajo, inviertes mucha energía en él y tiendes a creer que haces las cosas mejor que los demás, pero generalmente mantienes buenas relaciones con compañeros y subordinados.

A menudo existe un desequilibrio entre el trabajo y el autocuidado. Algunos se sobrecargan de trabajo y descuidan sus propias necesidades, mientras que otros se obsesionan con la salud, la limpieza o el cuidado físico. Esa tendencia obsesiva puede extenderse a la comida y la dieta, ya sea por exceso o por restricción, motivada por preocupaciones de salud o simplemente por hábito.

Estadísticamente, esta posición se ha asociado con problemas de salud relacionados con el crecimiento celular anormal, como el cáncer, o con condiciones que requieren un control dietético estricto. En algunos casos, la enfermedad se vuelve una forma de volver a ti cuando se da demasiada energía a los demás. Sin embargo, la influencia de Júpiter suele permitir encontrar sentido en la enfermedad y recuperarse aprendiendo de la experiencia.

Por último, suele haber una afición natural por las mascotas y los animales, lo que refuerza los temas del cuidado, el servicio y la responsabilidad cotidiana.`,

    7: `Sueles vivir las relaciones desde una posición elevada o endiosado o con alguien que encarna ese arquetipo. A menudo hay un desequilibrio: uno de los miembros es fiel o complaciente, mientras que el otro busca libertad o actúa de forma inconsistente.

Sueles tener poca dificultad para atraer a la pareja que deseas, y puedes usar el encanto, la estrategia o la persuasión para conseguirlo. Sin embargo, tiendes a idealizar las relaciones y el concepto de la vida en pareja o el matrimonio, lo que con frecuencia lleva a la decepción cuando la realidad no está a la altura de tus altas expectativas. Un tema central aquí es la tensión entre la necesidad de libertad y exploración y el deseo de seguridad y estabilidad dentro de la relación.

En algunos casos, la pareja o los socios comerciales te traen ventajas materiales, oportunidades o crecimiento económico. A pesar de los fracasos románticos o asociativos, una de las mayores fortalezas de esta posición es que rara vez pierdes la fe en el amor o en la posibilidad de encontrar a tu pareja ideal. Sigues creyendo en las relaciones y en la posibilidad de una unión con sentido.

Puede favorecer en general las relaciones con los demás y con el entorno social en su conjunto, y puede traer beneficios a través de asuntos legales o procesos judiciales. A menudo asegura comodidad, protección o bienestar general a través de las asociaciones, no garantiza necesariamente la plenitud emocional o la verdadera felicidad.`,

    8: `Tienes una actitud fundamentalmente positiva y resiliente ante la vida y la muerte. Esta posición sugiere una profunda certeza interior de que, incluso en los momentos más oscuros, hay sentido, luz y un camino para atravesarlo. Eres capaz de entrar en los «infiernos» psicológicos o emocionales permaneciendo protegida por la fe, la perspectiva y una guía interior casi inagotable. Incluso en crisis extremas, tiendes a mantener el optimismo y a extraer sabiduría de la experiencia.

Esta posición apunta tradicionalmente a la longevidad y a un enfoque pacífico o aceptado de la muerte. También favorece las herencias, el apoyo financiero inesperado o los beneficios recibidos a través de otros. A menudo atraes patrocinadores, benefactores o personas que creen en ti y te ayudan a progresar. Suele haber una fuerte capacidad para manejar recursos compartidos o el dinero de otras personas, y, bien aspectada, puede indicar talento para las inversiones y los mercados financieros. En muchos casos, puedes casarte con alguien con medios económicos o experimentar un período en el que otros te sostienen.

La sexualidad es un tema clave y puede vivirse de maneras muy distintas. En su expresión más alta, el sexo se convierte en un camino hacia la trascendencia, la intimidad y la disolución del ego. En el otro extremo, puede haber exceso, búsqueda constante de novedad por aburrimiento, o una fuerte idealización del sexo seguida de decepciones repetidas. Pueden surgir conflictos entre las creencias personales, los dogmas morales o religiosos y las necesidades sexuales.

También hay una inclinación natural a explorar las dimensiones ocultas, psicológicas y ocultistas de la vida. Tu mayor fortaleza reside en la capacidad de enfrentar la pérdida, la transformación y la crisis sin perder la esperanza, comprendiendo que incluso el sufrimiento contiene sentido y la promesa de renovación.`,

    9: `Posición afortunada. Tienes una necesidad profunda, casi compulsiva, de encontrar sentido en todo lo que vives. Posees una fuerte intuición y una capacidad natural para entender la vida a un nivel profundo, buscando a menudo leyes universales, verdades filosóficas o claves espirituales que den propósito a tu viaje personal.

Un desafío clave es mantenerte con los pies en la tierra: tus descubrimientos, intuiciones y ambiciones deben aplicarse de forma práctica en la vida presente, y no perderse en ideales abstractos o distantes. Cuando hay equilibrio, te conviertes en una figura inspiradora cuya filosofía y visión de la vida elevan y guían a los demás. Tu carácter está marcado por la fuerza, la integridad moral, la sinceridad y la capacidad de sostener y guiar a tu entorno.

Esta posición suele llevar al compromiso con la educación superior, la filosofía, la religión, los viajes y otras vías para expandir la conciencia. En la madurez, puedes asumir naturalmente el rol de maestro espiritual o filosófico, ofreciendo guía y dando ejemplo a través de tu sabiduría vivida. Sin embargo, si Júpiter está mal aspectado o no cultivas tu conocimiento, tus tendencias filosóficas o espirituales pueden volverse dogmáticas o manipuladoras, convirtiéndote en una embaucadora o adoctrinadora rígida.`,

    10: `Tienes una necesidad imperiosa de ser visto y reconocido por quién eres y por lo que logras. A menudo buscas el sentido y la realización personal a través de tu carrera, tus logros profesionales y tu estatus social, más que a través de la vida personal o las relaciones.

Esta posición abre puertas en lo vocacional y lo profesional, facilitándote oportunidades de avance y reconocimiento. Las metas ambiciosas suelen estar a tu alcance. El éxito, el prestigio y los puestos de liderazgo te llegan de forma natural. Sin embargo, los ascensos rápidos sin una base sólida pueden conducir a reveses repentinos, por lo que mantenerte «anclado» y con una planificación práctica es esencial.

Sueles destacar en el liderazgo, la enseñanza o los puestos que requieren autoridad y visibilidad pública. Manejas mejor a las personas cuando tienes autonomía e influencia. También hay una fuerte influencia psicológica de la madre, que puede ser positiva —proporcionando inspiración, guía o un modelo de logro— o más desafiante, implicando rivalidad, manipulación o comparación. En algunos casos, la madre puede provenir de un entorno distinguido o extranjero, añadiendo otra capa de influencia sobre tus ambiciones y tu vida pública.`,

    11: `Traes un fuerte enfoque en las redes sociales, las amistades y las actividades grupales. A menudo, los amigos y los grupos te buscan como fuente de inspiración, guía o apoyo, y tú, a tu vez, encuentras crecimiento personal y sentido a través de esas conexiones sociales. Te atraen de forma natural las organizaciones, los proyectos humanitarios y las metas colectivas en las que puedas contribuir y expandirte.

La amistad y los ideales suelen estar muy idealizados. Aunque no siempre logres exactamente lo que imaginabas, tu optimismo y tu fe te mantienen motivado. Eres un pensador progresista, que se fija constantemente nuevas metas y busca un crecimiento más allá de sí mismo, pero debes cuidarte de no sobreexigirte ni dejar proyectos sin terminar por una vida social y socialmente intensa.

Disfrutas ser admirado dentro del grupo y puedes asumir roles de liderazgo o influencia, pero debes evitar convertirte en un miembro pasivo sin voz. Tu vida social es animada y diversa, e incluye a menudo viajes internacionales o experiencias compartidas con amigos. El humor, la lealtad y el apoyo mutuo son rasgos destacados, y, a pesar de las decepciones ocasionales, te mantienes comprometido con tus ideales y amistades.`,

    12: `La posición del «ángel guardián». Experimentas protección y apoyo en las crisis, ya las puertas, tanto literales como existenciales, tienden a abrirse para ti, a menudo guiadas por una fuerza superior. Tu fuerza reside en la fe, no necesariamente religiosa, sino en una conexión profunda con tu esencia, tu alma y tu verdad interior. Esa conexión te permite transformar las experiencias negativas en oportunidades de crecimiento, encontrando sentido incluso en la adversidad.

Tienes una inclinación natural a la introspección, la soledad y el trabajo interior. Tu mayor fuente de inspiración y descubrimiento viene de explorar tu inconsciente, tus sueños y los reinos ocultos. Los períodos de aislamiento, voluntarios o impuestos, como estancias en hospitales o prisiones, suelen marcar etapas importantes de crecimiento personal.

Eres capaz de convertir a tus enemigos en aliados, aunque cualquier adversario al que te enfrentes probablemente sea poderoso o influyente. Puedes ayudar a quienes sufren o están marginados.

Esta posición suele aportar resiliencia en cuestiones de salud, ya que estás bien cuidada y te recuperas eficazmente cuando lo necesitas.

Esta posición fomenta el crecimiento espiritual, la fortaleza interior y la capacidad de elevarte por encima de las dificultades a través de la fe, la autoconciencia y la conexión con una verdad superior.`,
  },
};

export function getTextoSigno(planetaKey: string, signo: string): string | null {
  return TEXTOS_SIGNO[planetaKey as CuerpoKey]?.[signo] ?? null;
}

export function getTextoCasa(planetaKey: string, casa: number): string | null {
  return TEXTOS_CASA[planetaKey as CuerpoKey]?.[casa] ?? null;
}
