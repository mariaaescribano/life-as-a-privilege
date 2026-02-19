import type { Bloque } from "../../dtos/espacio.type";
import { AdultIcon, ChildhoodIcon, ChildIcon, CoupleIcon, FamilyIcon, FriendsIcon, MadreIcon } from "../../GlobalVariables";

export const preguntasNeuroPsicologia: Bloque[] = [
  {
    title: "1. La relación con tu Madre",
    icon: MadreIcon,
    subPreguntas: [
      { 
        idPregunta:"npmn1",
        pregunta: "¿Qué vínculo percibes que hay formado entre tu madre y tú?",
      },
      { 
        idPregunta:"npmn2",
        pregunta: "¿Qué es lo que más te molesta o enfada de tu madre?",
        consejo: "Aquello que más nos molesta de ella, es lo que más nos duele reconocer en nosotros"
      },
      { 
        idPregunta:"npmn3",
        pregunta: "¿Qué crees que puedes haber heredado de ella que no te corresponde actualmente tener?",
        consejo: "Todo lo heredado ha sido por resonancia para que aprendamos algo, nuestras células han sido formadas con eso heredado, pero si eres capaz de verlo y lo reconoce como viejo, es porque ya ha hecho su función y es hora de que sea liberado."
      },
      { 
        idPregunta:"npmn4",
        pregunta: "¿Cómo fue el embarazo de tu madre? ¿Tuvo apoyo? ¿Se sintió sola, frustrada...?",
      },
      { 
        idPregunta:"npmn4",
        pregunta: "¿Cómo fue el embarazo de tu madre? ¿Tuvo apoyo? ¿Se sintió sola, frustrada...?",
      },
      { 
        idPregunta:"npmn5",
        pregunta: "¿Te percibes como insuficiente?",
      },
      { 
        idPregunta:"npmn6",
        pregunta: "¿Tu Madre se vive como alguien insuficiente? ¿Tu Madre se ama y se valora todos los días de su vida?",
      },
    ],
  },
  {
    title: "2. Tu familia",
    icon: FamilyIcon,
    subPreguntas: [
      { 
        idPregunta:"npf1",
        pregunta: "¿Cómo fueron tus figuras de apego? ¿Podías contar con ellas?",
      },
      { 
        idPregunta:"npf2",
        pregunta: "¿Qué crees que esperaban tus padres de ti?",
      },
      { 
        idPregunta:"npf3",
        pregunta: "¿Qué papel se te asignó que no correspondía?",
      },
      { 
        idPregunta:"npf4",
        pregunta: "¿En tu familia se podía hablar de emociones? ¿Podías estar triste? ¿Podías estar feliz?",
      },
      { 
        idPregunta:"npf5",
        pregunta: "¿Tus figuras de apego eran infelices? ¿Sentiste que podías hacer algo para que fuesen felices?",
      },
      { 
        idPregunta:"npf6",
        pregunta: "¿Tu figura de apego de energía femenina (Madre) te hizo sentir como alguien querible y bello? ¿Qué te detiene de recordar estas cualidades?",
        consejo: "La mayoría de las veces no recordamos que somos queribles para que mantenernos en el sufrimiento junto a ella"
      },
      { 
        idPregunta:"npf7",
        pregunta: "¿Tu figura de apego de energía masculina (Padre) fue capaz de poner un suelo bajo tus pies para que andaras tu camino? ¿Qué te detiene de ponerte un suelo a ti mismo?",
      },
       { 
        idPregunta:"npf8",
        pregunta: "¿Tu figura de apego de energía masculina (Padre) te transmitió que tienes derecho a la existencia, que eres valioso y que tienes las herramientas necesarias para lo que la Vida requiere?",
      },
    ],
  },
  {
    title: "3. Tu infancia",
    icon: ChildhoodIcon,
    subPreguntas: [
      { 
        idPregunta:"npi1",
        pregunta: "¿Tus padres fueron capaces de legitimar tus necesidades? Estas pueden ser preguntar, correr, sonreir, llorar, jugar...",
        consejo: "A un niño no se le puede negar que sienta la emoción, sino dejar que la sienta y explicarle qué siente y por qué es probable que se le haya despertado esa emoción en ese momento concreto"
      },
      { 
        idPregunta:"npi2",
        pregunta: "¿Qué necesidad tienes que crees que no merece la pena legitimar?",
      },
      { 
        idPregunta:"npi3",
        pregunta: "¿Cómo fue tu infancia? Escribe lo que te parezca más relevante o absolutamente todo lo que quieras",
      },
      { 
        idPregunta:"npi4",
        pregunta: "¿Cuáles son tus primeros recuerdos?",
      },
      { 
        idPregunta:"npi5",
        pregunta: "¿Eres capaz de reconocer a tu niño interno? ¿Eres capaz de decirle que tiene derecho a la existencia? ",
      },
      { 
        idPregunta:"npi6",
        pregunta: "¿Qué comportamientos cambiaste para que tus padres fuesen menos infelices?",
      },
       { 
        idPregunta:"npi7",
        pregunta: "¿Qué frase tienes grabada que no es tuya?",
      },
      { 
        idPregunta:"npi8",
        pregunta: "¿Justificas tus errores o fallos insultándote? ¿Te llamas tonto, estúpido...?",
      },
    ],
  },
  {
    title: "4. Tu adolescencia",
    icon: ChildIcon,
    subPreguntas: [
      { 
        idPregunta:"npa1",
        pregunta: "¿Tus padres fueron capaces de legitimar tus necesidades? Estas pueden ser preguntar, correr, sonreir, llorar, jugar...",
        consejo: "A un niño no se le puede negar que sienta la emoción, sino dejar que la sienta y explicarle qué siente y por qué es probable que se le haya despertado esa emoción en ese momento concreto"
      },
      { 
        idPregunta:"npa2",
        pregunta: "¿Qué supuesto trastorno te diagnosticaron en la adolescencia?",
      },
      { 
        idPregunta:"npa3",
        pregunta: "¿De qué se quejaban tus padres? ¿Cómo cambió tu comportamiento?",
      },
      { 
        idPregunta:"npa4",
        pregunta: "¿De qué te arrepientes?",
      },
        { 
        idPregunta:"npa5",
        pregunta: "¿Qué era lo que más te dolía?",
      },
    ],
  },
  {
    title: "5. Tus parejas",
    icon: CoupleIcon,
    subPreguntas: [
      { 
        idPregunta:"npp1",
        pregunta: "¿Tuviste buenas relaciones de pareja? ¿Tienes sobretodo buenos o malos recuerdos?",
      },
      { 
        idPregunta:"npp2",
        pregunta: "¿Eres capaz de ver algún aprendizaje en tus pasadas relaciones?",
      },
      { 
        idPregunta:"npp3",
        pregunta: "¿Has guardado o guardaste rencor o apego? ¿Sabrías ver la razón oculta?",
      },
      { 
        idPregunta:"npp4",
        pregunta: "¿Qué es lo peor que has permitido que te hagan? ¿Qué encontraste?",
      },
        { 
        idPregunta:"npp5",
        pregunta: "¿Qué es para ti una pareja? ¿Cuál es su finalidad?",
      },
       { 
        idPregunta:"npp6",
        pregunta: "¿Qué es para ti una pareja? ¿Cuál es su finalidad?",
        consejo: "Recuerda que si buscas que alguien externo se haga cargo de tu felicidad, lo único que vas a hacer es culpar al otro de tu infelicidad."
      },
    ],
  },
  {
    title: "6. Tus amigos",
    icon: FriendsIcon,
    subPreguntas: [
      { 
        idPregunta:"npla1",
        pregunta: "¿Eres una persona sociable? ¿Por qué? ¿Qué encuentras en tus amigos o en la gente?",
      },
      { 
        idPregunta:"npla2",
        pregunta: "¿Qué es lo que más te molesta de tus amigos? ¿Y de las personas en general?",
      },
      { 
        idPregunta:"npla3",
        pregunta: "¿Eres capaz de hacer cosas por ti mismo o necesitas gente que te anime? ¿Qué poder les cedes?",
      },
      { 
        idPregunta:"npla4",
        pregunta: "¿Te quejas cuando estás con tus amigos? ¿Cómo te sientes después? ¿De verdad soluciona algo?",
      },
        { 
        idPregunta:"npla5",
        pregunta: "¿Buscas reconocimiento externo o eres capaz de validar todo lo que haces?",
      },
    ],
  },
  {
    title: "7. Tu adultez",
    icon: AdultIcon,
    subPreguntas: [
      { 
        idPregunta:"npta1",
        pregunta: "¿Cómo empezaste tu etapa adulta? ¿Tuviste apoyos, tus padres colaboraron, te mudaste con tu pareja...? ",
      },
      { 
        idPregunta:"npta2",
        pregunta: "¿Te valoras y respetas todos los días de tu Vida? Si no es así, ¿de verdad esperas que alguien lo haga? ",
      },
      { 
        idPregunta:"npta3",
        pregunta: "¿Valoras tu sabiduría y tu experiencia? ¿Has aprendido de ella o te sigues dando contra el mismo muro?",
      },
      { 
        idPregunta:"npta4",
        pregunta: "¿Estás cansado de tu Vida? ¿Estás cansado de ti? ",
      },
      { 
        idPregunta:"npta5",
        pregunta: "¿Buscas reconocimiento externo o eres capaz de validar todo lo que haces?",
      },
      { 
        idPregunta:"npta6",
        pregunta: "¿Estás fatigado aunque parezca que no hayas hecho mucho? ¿Te quejas de tu vejez?",
      },
      { 
        idPregunta:"npta7",
        pregunta: "¿Qué patrones se te repiten cada día? ¿De verdad los quieres en tu Vida? SI no es así, ¿qué te detiene para quitarlos, de qué tienes miedo?",
      },
      { 
        idPregunta:"npta8",
        pregunta: "¿Eres capaz de meditar, es decir, de estar contigo más de 10 minutos sin hacerte daño?",
      },
      { 
        idPregunta:"npta9",
        pregunta: "¿Hay algo de tu Vida que te gustaría olvidar?",
      },
      { 
        idPregunta:"npta10",
        pregunta: "¿Vives el paso del tiempo como una condena a la decadencia?",
      },
    ],
  },
];






