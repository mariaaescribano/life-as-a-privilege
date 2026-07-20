import type { Bloque } from "../../dtos/espacio.type";
import { AdultIcon, ChildhoodIcon, ChildIcon, CoupleIcon, FamilyIcon, FriendsIcon, MadreIcon } from "../../GlobalVariables";

export const preguntasNeuroPsicologia: Bloque[] = [
  {
    title: "1. Tu madre",
    icon: MadreIcon,
    subPreguntas: [
      { 
        idPregunta:"npmn1",
        pregunta: "¿Qué vínculo percibes que hay formado entre tu madre y tú? ¿Estás cómodo con tu papel en ese vínculo?",
      },
      { 
        idPregunta:"npmn2",
        pregunta: "¿Qué es lo que más te molesta o enfada de tu madre?",
        consejo: "Lo que más nos molesta nos da la oportunidad de saber exactamente cómo NO queremos vivir."
      },
      { 
        idPregunta:"npmn3",
        pregunta: "¿Qué crees que puedes haber heredado de ella que no te corresponde actualmente tener?",
        consejo: "Todo lo heredado puede ser liberado una vez que hayamos aprendido lo que tenía que enseñarnos."
      },
      { 
        idPregunta:"npmn4",
        pregunta: "¿Cómo fue el embarazo de tu madre? ¿Vivió algo negativo? ¿Tuvo apoyo? ¿Se sintió sola, frustrada...?",
      },
      { 
        idPregunta:"npmn5",
        pregunta: "¿Te percibes como insuficiente? ¿Cuándo y qué te dice esa voz exactamente? ¿Para qué lo permites?",
      },
      { 
        idPregunta:"npmn6",
        pregunta: "¿Tu madre se vive como alguien insuficiente? ¿Tu madre se ama y se valora todos los días de su Vida? Si no es así, ¿cómo se autodestruye?",
      },
    ],
  },
  {
    title: "2. Tu familia",
    icon: FamilyIcon,
    subPreguntas: [
      { 
        idPregunta:"npf1",
        pregunta: "¿Cómo fueron tus figuras de apego? ¿Podías contar con ellas? Pon un ejemplo y cómo crees que te afectó o te sigue afectando.",
      },
      { 
        idPregunta:"npf2",
        pregunta: "¿Qué crees que esperaban tus padres de ti? ¿Lo has cumplido? ¿Qué esperas tú de tus padres? ¿Lo han cumplido?",
      },
      { 
        idPregunta:"npf3",
        pregunta: "¿Qué papel se te asignó o te asignaste que no correspondía?",
      },
      { 
        idPregunta:"npf4",
        pregunta: "¿En tu familia se podía hablar de emociones? ¿Podías estar triste? ¿Podías estar feliz?",
      },
      { 
        idPregunta:"npf5",
        pregunta: "¿Tus figuras de apego eran infelices? ¿Sentiste o sientes que puedes hacer algo para cambiarlo? En el caso de que lo consiguieras, ¿de verdad crees que no encontrarían otra forma de hacerse infelices?",
      },
      { 
        idPregunta:"npf6",
        pregunta: "¿Tu figura de apego de energía femenina (madre) te hizo sentir como alguien querible y bello? Si no es así, ¿qué te detiene de hacerte sentir a ti mismo así?",
        consejo: "Nos mantenemos en el sufrimiento para poder pertenecer y quejarnos."
      },
      { 
        idPregunta:"npf7",
        pregunta: "¿Tu figura de apego de energía masculina (padre) fue capaz de poner un suelo bajo tus pies para que andaras tu camino? ¿Te recordó que el mundo es lo que tú quieres que sea?",
      },
       { 
        idPregunta:"npf8",
        pregunta: "¿Tu figura de apego de energía masculina (padre) te transmitió que tienes derecho a la existencia, que eres valioso y que estás a la altura de la Vida?",
      },
      { 
        idPregunta:"npf9",
        pregunta: "¿Qué es lo más bonito que han hecho tus padres por ti? ¿Qué buenos momentos existieron?",
        consejo: "No olvides todo lo bueno que han hecho por ti. No te pierdas en revivir los malos momentos, aprende de ellos."
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
        consejo: "A un niño hay que permitirle que sienta, acompañarle y ayudarle a ponerle palabras a las experiencias."
      },
      { 
        idPregunta:"npi2",
        pregunta: "¿Qué necesidad tienes que crees que no merece la pena legitimar?",
      },
      { 
        idPregunta:"npi3",
        pregunta: "¿Cómo fue tu infancia? Escribe lo que te parezca más relevante o absolutamente todo lo que quieras.",
      },
      { 
        idPregunta:"npi4",
        pregunta: "¿Cuáles son tus primeros recuerdos?",
      },
      { 
        idPregunta:"npi5",
        pregunta: "¿Eres capaz de reconocer a tu niño interior? ¿Eres capaz de decirle que tiene derecho a la existencia y que solo se debe lealtad a sí mismo?",
        consejo: "La mayoría de los niños entierran su Amor bajo la frustración de sus padres."
      },
      { 
        idPregunta:"npi6",
        pregunta: "¿Qué comportamientos cambiaste para creer que así tus padres serían más felices?",
      },
       { 
        idPregunta:"npi7",
        pregunta: "¿Qué frase tienes grabada que no es tuya? ¿Cuándo aparece? ¿En qué circunstancia?",
        consejo: "Fíjate bien el tono que es usado, esa voz no es tuya."
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
        pregunta: "¿Cómo recuerdas tu adolescencia?",
      },
      { 
        idPregunta:"npa2",
        pregunta: "¿Qué supuesto trastorno te diagnosticaron en la adolescencia?",
      },
      { 
        idPregunta:"npa3",
        pregunta: "¿De qué se quejaban tus padres? ¿Cómo influenció tu comportamiento?",
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
        pregunta: "¿Qué es lo peor que has permitido que te hagan? ¿Eres capaz de saber para qué? ¿Qué descubriste de ti mismo?",
      },
       { 
        idPregunta:"npp5",
        pregunta: "¿Qué es para ti una pareja? ¿Cuál es su finalidad?",
        consejo: "Si buscas a alguien que te saque de la monotonía que tú has construido para ti y te des cuenta de que no puede, le vas a culpar de tu infelicidad."
      },
    ],
  },
  {
    title: "6. Tus amigos",
    icon: FriendsIcon,
    subPreguntas: [
      { 
        idPregunta:"npla1",
        pregunta: "¿Eres una persona sociable? ¿Para qué? ¿Qué encuentras en tus amigos o en la gente?",
      },
      { 
        idPregunta:"npla2",
        pregunta: "¿Qué es lo que más te molesta de tus amigos? ¿Y de las personas en general?",
        consejo: "Lo que nos molesta del otro, es lo que más habla de nosotros."
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
        pregunta: "¿Valoras tu sabiduría y tu experiencia? ¿Usas el conocimiento adquirido para mejorar tu Vida día tras dia?",
      },
      { 
        idPregunta:"npta4",
        pregunta: "¿Estás cansado de tu Vida? ¿Estás cansado de ti? ",
      },
      { 
        idPregunta:"npta5",
        pregunta: "¿Buscas reconocimiento externo o eres capaz de validar todo lo que haces? ¿Por qué tu propia validación no es suficiente?",
      },
      { 
        idPregunta:"npta6",
        pregunta: "¿Estás fatigado aunque parezca que no hayas hecho mucho? ¿Te quejas de tu vejez?",
      },
      { 
        idPregunta:"npta7",
        pregunta: "¿Qué patrones se te repiten cada día? ¿De verdad los quieres en tu Vida? Si no es así, ¿qué te detiene para quitarlos, de qué tienes miedo?",
      },
      { 
        idPregunta:"npta8",
        pregunta: "¿Eres capaz de meditar, es decir, de estar contigo más de 10 minutos sin hacerte daño?",
      },
      { 
        idPregunta:"npta9",
        pregunta: "¿Hay algo de tu Vida que te gustaría olvidar? ¿Eres capaz de acordarte de qué hiciste ayer? ¿Y antesdeayer?",
        consejo: "Vivimos muy desconectados del presente, por esto, antes de dormir, repasa todo lo que has hecho a lo largo del día."
      },
      { 
        idPregunta:"npta10",
        pregunta: "¿Ves el paso del tiempo equivalente a la decadencia?",
        consejo: "Cada etapa de la Vida tiene sus retos, la pregunta que importa es: ¿eres capaz de ser tu mejor versión ahora mismo?"
      },
    ],
  },
];






