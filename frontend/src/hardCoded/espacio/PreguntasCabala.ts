import type { Pregunta } from "../../dtos/espacio.type";
import type { SefiraKey } from "../../components/global/ArbolDeLaVida";

export const preguntasCabala: Record<SefiraKey, Pregunta[]> = {
  kether: [
    {
      idPregunta: "cab_kether_1",
      pregunta: "¿Sientes que hay un propósito detrás de lo que te ocurre en la vida, o lo vives como algo aleatorio y sin sentido?",
      consejo: "Keter nos recuerda que existe una voluntad mayor detrás de cada experiencia.",
    },
    // {
    //   idPregunta: "cab_kether_2",
    //   pregunta: "¿Hay algo en ti que sientes que es tuyo de verdad, más allá de los roles que cumples, de lo que otros esperan de ti o de lo que has vivido?",
    // },
    // {
    //   idPregunta: "cab_kether_3",
    //   pregunta: "¿Cómo es tu relación con lo sagrado, con algo más grande que tú? ¿Te conectas con ello o lo rechazas? ¿Por qué?",
    // },
  ],
  chokmah: [
    {
      idPregunta: "cab_chokmah_1",
      pregunta: "¿Confías en tu intuición?",
      consejo: "Chokmah es el destello de sabiduría que precede al pensamiento. Tu primer impulso suele saber más de lo que crees.",
    },
    {
      idPregunta: "cab_chokmah_2",
      pregunta: "¿Qué ideas o proyectos llevas tiempo sintiendo que deberías comenzar y no comienzas? ¿Qué te lo impide?",
    },
    {
      idPregunta: "cab_chokmah_3",
      pregunta: "¿De qué manera expresas tu creatividad o tu impulso creativo en la vida cotidiana? ¿Lo reprimes?",
    },
  ],
  binah: [
    {
      idPregunta: "cab_binah_1",
      pregunta: "¿Puedes dar estructura a lo que aprendes?",
      consejo: "Cuando no somos capaces de aprender de nuestras experiencias, significa que algo nos lo está impidiendo.",
    },
    // {
    //   idPregunta: "cab_binah_2",
    //   pregunta: "¿Cómo vives la paciencia? ¿Puedes esperar que algo madure, o necesitas resultados inmediatos?",
    // },
    // {
    //   idPregunta: "cab_binah_3",
    //   pregunta: "¿Hay algo que entiendes con la cabeza pero que aún no has integrado en tu vida? ¿Qué sería necesario para que ocurra?",
    // },
  ],
  chesed: [
    {
      idPregunta: "cab_chesed_1",
      pregunta: "¿Das con libertad o das esperando algo a cambio, aunque sea reconocimiento o afecto?",
      consejo: "Chesed es la generosidad que fluye sin condiciones. Observa si al dar sientes ligereza o expectativa.",
    },
    {
      idPregunta: "cab_chesed_2",
      pregunta: "¿Eres tan generoso contigo mismo como lo eres con los demás? ¿En qué áreas de tu vida te niegas lo que sí le darías a otro?",
    },
    {
      idPregunta: "cab_chesed_3",
      pregunta: "¿Puedes recibir? ¿Qué sientes cuando alguien te da algo: un cumplido, un favor, un regalo?",
    },
  ],
  geburah: [
    {
      idPregunta: "cab_geburah_1",
      pregunta: "¿Qué necesitas eliminar de tu Vida que sabes que ya no te sirve y que sigues manteniendo por miedo o costumbre?",
      consejo: "Gevurah no destruye por destruir. Poda lo que agota para que pueda crecer lo que nutre.",
    },
    {
      idPregunta: "cab_geburah_2",
      pregunta: "¿Tienes dificultad para poner límites? ¿O tus límites son demasiado rígidos? ¿Dónde está el desequilibrio?",
    },
    {
      idPregunta: "cab_geburah_3",
      pregunta: "¿Dónde ejerces el juicio o la crítica de forma excesiva, ya sea hacia ti mismo o hacia los demás?",
    },
  ],
  tipharet: [
    {
      idPregunta: "cab_tiferet_1",
      pregunta: "¿Hay armonía entre lo que piensas, lo que sientes y lo que haces en tu Vida cotidiana? ¿Dónde hay más desconexión?",
      consejo: "A veces pensamos una cosa, sentimos otra y hacemos una diferente.",
    },
    // {
    //   idPregunta: "cab_tiferet_2",
    //   pregunta: "¿Qué te produce una sensación genuina de belleza o de significado? ¿Con qué frecuencia lo tienes en tu vida?",
    // },
    // {
    //   idPregunta: "cab_tiferet_3",
    //   pregunta: "¿Eres capaz de estar en el centro sin ser arrastrado por los extremos? ¿Cuándo pierdes ese centro y qué lo provoca?",
    // },
  ],
  netzach: [
    {
      idPregunta: "cab_netzach_1",
      pregunta: "¿Qué emociones te resultan más difíciles de sostener? ¿Las reprimes, las desbordas o las niegas?",
      consejo: "Netzach nos invita a sentir sin perdernos en lo que sentimos. Las emociones son mensajeras, no verdades absolutas.",
    },
    {
      idPregunta: "cab_netzach_2",
      pregunta: "¿Qué deseas profundamente? No lo que crees que deberías desear, sino lo que realmente anhelas.",
    },
    {
      idPregunta: "cab_netzach_3",
      pregunta: "¿Tienes espacio en tu vida para el placer, el juego y la belleza sensorial? ¿O lo has eliminado como algo secundario?",
    },
  ],
  hod: [
    {
      idPregunta: "cab_hod_1",
      pregunta: "¿Hay coherencia entre lo que dices y lo que haces? ¿O usas las palabras para evitar la realidad?",
      consejo: "Hod es el poder del lenguaje. Lo que nombramos, lo reforzamos. Observa qué historia te cuentas sobre ti mismo.",
    },
    {
      idPregunta: "cab_hod_2",
      pregunta: "¿Cómo te comunicas cuando algo te duele o te incomoda? ¿Lo expresas, lo callas o lo distorsionas?",
    },
  ],
  yesod: [
    {
      idPregunta: "cab_yesod_1",
      pregunta: "¿Qué patrones se repiten en tu Vida una y otra vez, aunque cambien los escenarios o las personas?",
      consejo: "Lo que se repite no es mala suerte: es un patrón que pide ser visto.",
    },
    {
      idPregunta: "cab_yesod_2",
      pregunta: "¿Qué imagen tienes de ti mismo que no te pertenece pero que has adoptado como real? ¿De dónde viene?",
    },
  ],
  malkuth: [
    {
      idPregunta: "cab_malkuth_1",
      pregunta: "¿Cómo es tu relación con tu cuerpo? ¿Lo cuidas, lo ignoras, lo castigas? ¿Lo escuchas?",
      consejo: "Malkhut es el cuerpo, la tierra, lo concreto. Lo espiritual se manifiesta aquí o no se manifiesta en ningún sitio.",
    },
    {
      idPregunta: "cab_malkuth_2",
      pregunta: "¿Tu entorno físico —tu casa, tu espacio, tu orden o desorden— refleja cómo te sientes por dentro?",
    },
    {
      idPregunta: "cab_malkuth_3",
      pregunta: "¿Qué estás manifestando en tu vida material en este momento? ¿Es lo que realmente quieres crear?",
    },
  ],
};
