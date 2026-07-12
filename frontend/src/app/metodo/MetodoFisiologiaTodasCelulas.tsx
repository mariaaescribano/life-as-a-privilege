import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex, Image, Text } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import SpinnerTurquesa from "../../components/global/Spinner";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { DisciplinaBgLayer } from "../../components/global/DisciplinaBgLayer";
import { useTusCelulas } from "../../components/metodo/TusCelulasModal";
import { CelulaCard, CelulaModal, ConsejoModal, type Consejo } from "../../components/metodo/celulasUi";
import { IndiceFisiologia } from "../../components/metodo/IndiceFisiologia";
import { Reveal } from "../../components/global/Reveal";
import { API_URL, fisiologiaBg, fisiologiaNom, fisiologiaTxt, FisiologiaIcon } from "../../GlobalVariables";
import { celulas as CELULAS, type Celula } from "../../hardCoded/espacio/CelulasCuerpoData";

const CAJA_GLOW = `0 0 16px rgba(255,255,255,0.16), 0 0 34px rgba(255,255,255,0.08), 0 0 60px rgba(200,181,209,0.12), 0 0 20px ${fisiologiaTxt}1a, 0 0 48px ${fisiologiaTxt}10`;

// ⚠️ PENDIENTE: la imagen de la silueta con los órganos la pasará María. Cuando
// la tenga, cambia esta ruta y AJUSTA las coordenadas (top/left en %) de cada
// órgano para que cada punto caiga sobre su órgano en la ilustración.
const SILUETA_IMG = "/recorrido/fisiologia/silueta.png";

// Ancho de la silueta. Fijo: en móvil NO se hace más pequeña que en ordenador.
const SILUETA_W = "300px";

// Helper para coger células por id de la lista plana de Fisiología.
const pick = (...ids: string[]): Celula[] =>
  ids.map((id) => CELULAS.find((c) => c.id === id)).filter(Boolean) as Celula[];

// Clave en metodo_fisiologia.data donde guardamos las células ya descubiertas.
const VISTAS_KEY = "celulas_vistas";

interface Organo {
  key: string;
  label: string;
  /** Foto del órgano que aparece en el panel de la derecha al pulsarlo.
   *  ⚠️ PENDIENTE: María pasará todas las fotos de los órganos. */
  foto: string;
  /** Posición del punto pulsable sobre la silueta, en % (0-100). A afinar con
   *  la imagen definitiva. */
  hotspot: { top: number; left: number };
  /** Células de este órgano. */
  celulas: Celula[];
  /** Consejos del órgano (frase titular + texto). Cada uno abre un modal
   *  inmersivo. ⚠️ PENDIENTE: María irá pasando los titulares y sus textos. */
  consejos?: Consejo[];
}

// Posiciones PROVISIONALES (se ajustarán sobre la imagen real). Las fotos de
// los órganos están en /recorrido/fisiologia/organos/{key}.png.
const ORGANOS: Organo[] = [
  { key: "cerebro",   label: "Cerebro",   foto: "/recorrido/fisiologia/organos/cerebro.png",   hotspot: { top: 9,  left: 50 }, celulas: pick("neuronas", "astrocitos", "microglia", "oligodendrocitos", "ependimarias", "endotelial-cerebral", "pericito", "celula-madre-neural"),
    consejos: [
      {
        titular: "Dormir te hace más inteligente.",
        texto: <>Mientras duermes, el cerebro no descansa: aprovecha para ponerse a punto. Los astrocitos facilitan una limpieza más profunda del tejido cerebral y la microglía patrulla eliminando restos celulares, vigilando posibles amenazas y ayudando a mantener las conexiones en buen estado. Además, durante el sueño se consolidan los recuerdos y se refuerzan los aprendizajes del día gracias a la neuroplasticidad, que ocurre en mayor o menor escala en cada momento de nuestra vida.</>,
      },
      {
        titular: "El estrés hace que tu cerebro vea amenazas donde no las hay.",
        texto: <>El estrés es útil cuando el peligro es real. El problema aparece cuando nunca desaparece. Si el cerebro pasa semanas o meses en estado de alerta, empieza a interpretar situaciones normales como si fueran una amenaza. Es como tener una alarma de incendios que salta a la mínima: consume energía, dificulta concentrarse y hace más difícil disfrutar del presente.</>,
      },
      {
        titular: "Mover el cuerpo también entrena el cerebro.",
        texto: <>Cada vez que haces ejercicio, aumenta el flujo de sangre que llega al cerebro. Con ella llegan más oxígeno y nutrientes, pero también moléculas que favorecen la supervivencia de las neuronas y la formación de nuevas conexiones. Por eso el ejercicio no solo fortalece los músculos: también mejora la memoria, la atención y el estado de ánimo.</>,
      },
      {
        titular: "Cada cosa nueva que aprendes cambia físicamente tu cerebro.",
        texto: <>Aprender no consiste en «guardar información». Cada experiencia fortalece unas conexiones entre neuronas y debilita otras. Es un cerebro distinto el que empieza a leer un libro y el que lo termina. Tu cerebro está cambiando constantemente en respuesta a lo que haces.</>,
      },
      {
        titular: "Lo que repites se convierte en quien eres.",
        texto: <>El cerebro intenta ahorrar energía. Cuando repites una acción una y otra vez, las conexiones que la controlan se vuelven más rápidas y eficientes. Así nacen los hábitos. Da igual si son buenos o malos: el cerebro aprende aquello que más practicas. Cada repetición deja una pequeña huella en el cableado cerebral.</>,
      },
    ] },
  { key: "pulmones",  label: "Pulmones",  foto: "/recorrido/fisiologia/organos/pulmones.png",  hotspot: { top: 33, left: 40 }, celulas: pick("neumocitos-1", "neumocitos-2", "macrofagos-alveolares", "celula-ciliada", "celula-club"),
    consejos: [
      {
        titular: "Tus pulmones tienen un ejército de limpieza.",
        texto: <>Las vías respiratorias están cubiertas por millones de cilios, pequeños «pelos» microscópicos que empujan el moco hacia la garganta. En ese moco quedan atrapados polvo, bacterias y otras partículas antes de que lleguen a los pulmones. Cuando te suenes la nariz o expulses ese moco, también estás eliminando muchos de esos intrusos.</>,
      },
      {
        titular: "Fumar apaga el sistema de limpieza.",
        texto: <>El humo del tabaco paraliza los cilios y obliga a los pulmones a acumular más moco y suciedad. Además, daña los alvéolos, donde se produce el intercambio de oxígeno. Por eso los fumadores suelen toser más: el cuerpo intenta expulsar mediante la tos lo que ya no puede limpiar de forma eficiente.</>,
      },
      {
        titular: "Fumar confunde a tu sistema inmunitario.",
        texto: <>Cada calada llena los pulmones de miles de sustancias irritantes. El sistema inmunitario permanece constantemente en alerta, como una alarma que nunca deja de sonar. Con el tiempo responde peor frente a infecciones y elimina con menos eficacia las células que podrían convertirse en un cáncer.</>,
      },
      {
        titular: "Cada paseo fortalece tus pulmones.",
        texto: <>Los pulmones no son un músculo, pero pueden trabajar de forma mucho más eficiente. El ejercicio fortalece el diafragma y los músculos respiratorios, mejora el intercambio de oxígeno y hace que cada respiración resulte más eficaz.</>,
      },
      {
        titular: "Cada alvéolo cuenta.",
        texto: <>Tus pulmones contienen alrededor de 500 millones de alvéolos. Son tan pequeños que apenas los vemos, pero juntos forman una superficie de intercambio de gases similar a una pista de tenis. Cuidarlos significa cuidar cada respiración que tomarás durante el resto de tu vida.</>,
      },
    ] },
  { key: "corazon",   label: "Corazón",   foto: "/recorrido/fisiologia/organos/corazon.png",   hotspot: { top: 35, left: 55 }, celulas: pick("cardiomiocitos", "marcapasos", "purkinje"),
    consejos: [
      {
        titular: "Tu corazón también aprende a entrenar.",
        texto: <>El corazón es un músculo. Cada vez que haces ejercicio tiene que bombear más sangre para llevar oxígeno a todo el cuerpo. Con el tiempo se vuelve más eficiente: puede mover la misma cantidad de sangre con menos esfuerzo e incluso latir menos veces por minuto cuando estás en reposo.</>,
      },
      {
        titular: "La tensión alta desgasta tus arterias en silencio.",
        texto: <>La sangre ejerce presión sobre las paredes de las arterias en cada latido. Si esa presión es demasiado alta durante años, las lesiona poco a poco. El organismo intenta repararlas, pero esas reparaciones favorecen la formación de placas que estrechan los vasos y aumentan el riesgo de infarto o ictus.</>,
      },
      {
        titular: "Tu corazón también necesita dormir.",
        texto: <>Mientras duermes, disminuyen la frecuencia cardíaca y la presión arterial, permitiendo que el corazón trabaje con menos esfuerzo. Dormir poco mantiene al organismo en un estado de alerta constante, obligando al corazón a trabajar más horas a mayor intensidad.</>,
      },
      {
        titular: "Cada cigarrillo envejece tus arterias.",
        texto: <>El tabaco no solo afecta a los pulmones. Sus sustancias dañan el endotelio, la fina capa de células que recubre el interior de las arterias. Cuando esta barrera pierde su capacidad protectora, el colesterol y la inflamación encuentran un lugar donde acumularse con mayor facilidad.</>,
      },
      {
        titular: "El corazón solo pide una cosa: que te muevas.",
        texto: <>Nuestro corazón evolucionó para un cuerpo que caminaba, corría y cargaba peso cada día. Pasar muchas horas sentado reduce la circulación, favorece la hipertensión y obliga al corazón a adaptarse a un estilo de vida para el que nunca fue diseñado. Cada paseo, cada escalera y cada minuto de actividad física son una inversión directa en su salud.</>,
      },
    ] },
  { key: "estomago",  label: "Estómago",  foto: "/recorrido/fisiologia/organos/estomago.png",  hotspot: { top: 43, left: 55 }, celulas: pick("parietal", "principal", "mucosa-gastrica", "enteroendocrinas-gastricas"),
    consejos: [
      {
        titular: "El estrés deja tu estómago con menos defensas.",
        texto: <>El estrés prolongado altera la comunicación entre el cerebro y el estómago. Cambia la producción de ácido, reduce algunos mecanismos de protección de la mucosa y dificulta su reparación. Si además existe una infección por Helicobacter pylori o tomas antiinflamatorios con frecuencia, el riesgo de gastritis y úlceras aumenta.</>,
      },
      {
        titular: "Tu estómago fabrica uno de los ácidos más fuertes del cuerpo.",
        texto: <>El ácido clorhídrico del estómago es tan potente que puede deshacer muchos alimentos y eliminar gran parte de los microorganismos que ingerimos. Aun así, el propio estómago no se digiere porque está protegido por una gruesa capa de moco y bicarbonato que actúa como un escudo.</>,
      },
      {
        titular: "Comer demasiado deprisa hace trabajar peor a tu estómago.",
        texto: <>Cuando comes con prisas, tragas más aire, masticas menos y el estómago recibe trozos de comida más grandes. Esto obliga a producir más ácido y a trabajar durante más tiempo, favoreciendo la pesadez, el reflujo y una digestión más lenta.</>,
      },
      {
        titular: "El alcohol rompe el escudo de tu estómago.",
        texto: <>El alcohol irrita la mucosa gástrica y debilita la capa de moco que la protege. Cuanto más frecuente es el consumo, más fácil resulta que el ácido alcance las células del estómago y produzca inflamación o pequeñas lesiones.</>,
      },
      {
        titular: "El estrés también se digiere.",
        texto: <>Cuando estás estresado, el cerebro prioriza la supervivencia frente a la digestión. El cerebro le hace llegar esta orden al estómago a través del nervio vago. El estómago modifica sus movimientos, cambia la producción de ácido y se comunica constantemente con el sistema nervioso. Por eso los nervios pueden provocar náuseas, dolor o la sensación de tener un «nudo en el estómago».</>,
      },
    ] },
  { key: "higado",    label: "Hígado",    foto: "/recorrido/fisiologia/organos/higado.png",    hotspot: { top: 45, left: 43 }, celulas: pick("hepatocitos", "kupffer", "estrelladas"),
    consejos: [
      {
        titular: "Tu hígado trabaja incluso cuando tú descansas.",
        texto: <>Mientras duermes, el hígado no se detiene. Sigue regulando la glucosa en sangre, fabricando proteínas, produciendo bilis y transformando sustancias para que el organismo pueda utilizarlas o eliminarlas. Es una fábrica que nunca cierra, ni siquiera mientras duermes.</>,
      },
      {
        titular: "Cada copa cambia las prioridades de tu hígado.",
        texto: <>El alcohol es una molécula tóxica para nuestras células. Cuando llega al hígado, este deja en segundo plano parte de su trabajo habitual para eliminarlo cuanto antes. Si el consumo es frecuente, funciones como el metabolismo de las grasas, la regulación de la glucosa o la producción de proteínas acaban viéndose afectadas.</>,
      },
      {
        titular: "El azúcar puede quedarse «atascado» en tu hígado.",
        texto: <>Cuando consumes más energía de la que tu cuerpo necesita, especialmente en forma de azúcares y alimentos muy procesados, el hígado transforma parte de ese exceso en grasa. Si esta se acumula durante años, puede aparecer el hígado graso, una enfermedad cada vez más frecuente incluso en personas que no beben alcohol y, en algunos casos, también en personas con un peso normal.</>,
      },
      {
        titular: "Tu hígado puede volver a crecer… pero no es invencible.",
        texto: <>Es uno de los pocos órganos con una gran capacidad de regeneración. Puede recuperar parte del tejido perdido tras una lesión. Sin embargo, si el daño se repite durante años, las cicatrices sustituyen a las células sanas y esa regeneración deja de ser suficiente.</>,
      },
      {
        titular: "No todas las toxinas vienen en una botella.",
        texto: <>El hígado transforma medicamentos, alcohol y muchas otras sustancias químicas. Pero «más» no significa «mejor»: tomar fármacos sin necesidad o abusar de suplementos y productos naturales también puede dañarlo. Antes de consumir cualquier producto de forma habitual, asegúrate de que realmente lo necesitas.</>,
      },
      {
        titular: "El colesterol no es tu enemigo.",
        texto: <>El colesterol es una molécula esencial. Todas tus células lo necesitan para construir sus membranas y fabricar hormonas como la testosterona, los estrógenos o el cortisol. El hígado produce gran parte del colesterol que necesitas y regula cuánto fabricar, reutilizar o eliminar. El problema no es el colesterol en sí, sino mantener durante años niveles elevados de las lipoproteínas que lo transportan, favorecidos por una mala alimentación, el sedentarismo y otros factores.</>,
      },
      {
        titular: "La bilis es el detergente de tu cuerpo.",
        texto: <>Las grasas no se mezclan con el agua, igual que el aceite no se mezcla con el agua del fregadero. Para solucionarlo, el hígado fabrica bilis, un líquido que rompe las grandes gotas de grasa en otras mucho más pequeñas para que el intestino pueda digerirlas y absorberlas con facilidad.</>,
      },
      {
        titular: "Las grasas saludables ayudan a vaciar la vesícula.",
        texto: <>Cada vez que comes alimentos ricos en grasas saludables, como aceite de oliva, frutos secos o pescado azul, la vesícula biliar se contrae y libera la bilis almacenada. Si pasas mucho tiempo con dietas extremadamente bajas en grasa o ayunos prolongados, la bilis permanece estancada durante más tiempo y aumenta el riesgo de formar cálculos biliares.</>,
      },
      {
        titular: "Tu fibra también alimenta a tu hígado.",
        texto: <>La mayor parte de la bilis se recicla una y otra vez. Sin embargo, la fibra soluble puede atrapar parte de ella en el intestino y favorecer su eliminación en las heces. Para fabricar nueva bilis, el hígado necesita utilizar colesterol, lo que ayuda a reducir sus niveles en sangre con el paso del tiempo.</>,
      },
      {
        titular: "No todo el colesterol hace el mismo trabajo.",
        texto: <>El hígado empaqueta el colesterol y los triglicéridos en unas partículas llamadas lipoproteínas. Las LDL lo llevan desde el hígado hacia los tejidos, mientras que las HDL recogen parte del colesterol sobrante y lo devuelven al hígado para reciclarlo o eliminarlo. Mantener unas LDL bajas y unas HDL saludables reduce el riesgo de que el colesterol se acumule en las arterias.</>,
      },
      {
        titular: "Tu hígado decide qué hacer con la energía.",
        texto: <>Después de comer, el hígado recibe casi todos los nutrientes que absorbe el intestino. Si necesitas energía, la distribuye. Si sobra glucosa, la almacena como glucógeno. Y si todavía sobra más, la transforma en triglicéridos, que viajarán por la sangre para almacenarse principalmente en el tejido adiposo.</>,
      },
      {
        titular: "El hígado también fabrica las proteínas de tu sangre.",
        texto: <>Muchas de las proteínas que transportan hormonas, mantienen el volumen de la sangre o permiten que coagule correctamente se producen en el hígado. Cuando deja de funcionar bien, no solo se acumulan toxinas: también falla la fabricación de componentes esenciales para todo el organismo.</>,
      },
      {
        titular: "Sin hígado, muchas vitaminas no servirían de mucho.",
        texto: <>El hígado almacena vitaminas como la A, D, B₁₂ y K, además de minerales como el hierro y el cobre. Actúa como un almacén estratégico que libera estos nutrientes cuando el organismo los necesita, evitando que dependamos únicamente de lo que comemos cada día.</>,
      },
    ] },
  { key: "pancreas",  label: "Páncreas",  foto: "/recorrido/fisiologia/organos/pancreas.png",  hotspot: { top: 47, left: 57 }, celulas: pick("celulas-beta", "celulas-alfa", "celulas-delta", "celulas-acinares", "celulas-ductales", "celulas-pp"),
    consejos: [
      {
        titular: "Tu páncreas sabe cuánto azúcar hay en tu sangre.",
        texto: <>Cada vez que comes, el páncreas mide continuamente la cantidad de glucosa que circula por la sangre. Si sube demasiado, libera insulina para que las células puedan utilizarla o almacenarla. Si baja, libera glucagón para que el hígado vuelva a liberar glucosa.</>,
      },
      {
        titular: "La diabetes puede dejarte ciego.",
        texto: <>En la diabetes tipo 1, el sistema inmunitario destruye las células que producen insulina. En la tipo 2, las células del cuerpo dejan de responder correctamente a esa hormona. En ambos casos, la glucosa permanece demasiado tiempo en la sangre, haciendo que las arterias se peguen entre ellas, dificultando la llegada de sangre y nutrientes a nervios, ojos y riñones, deteriorándolas y haciendo que pierdan su funcionamiento con el tiempo.</>,
      },
      {
        titular: "Tu páncreas también fabrica tus enzimas digestivas.",
        texto: <>Cada comida hace que el páncreas libere enzimas capaces de digerir proteínas, grasas y carbohidratos. Sin ellas, gran parte de los nutrientes atravesarían el intestino sin poder ser absorbidos.</>,
      },
      {
        titular: "El exceso de azúcar obliga a tu páncreas a trabajar más.",
        texto: <>Cuando consumes con frecuencia grandes cantidades de azúcar y calorías, el organismo necesita producir cada vez más insulina para mantener estable la glucosa en sangre. Durante años, ese esfuerzo continuo puede favorecer que las células beta pierdan parte de su capacidad para funcionar correctamente.</>,
      },
      {
        titular: "El alcohol también puede inflamar el páncreas.",
        texto: <>El páncreas fabrica enzimas muy potentes que normalmente permanecen inactivas hasta llegar al intestino. El alcohol aumenta el riesgo de que estas enzimas se activen antes de tiempo y empiecen a dañar el propio páncreas, provocando una pancreatitis.</>,
      },
      {
        titular: "El páncreas trabaja en silencio.",
        texto: <>A diferencia del estómago o del intestino, el páncreas suele pasar desapercibido. Sin embargo, regula la glucosa en sangre y produce la mayor parte de las enzimas digestivas. Cuando enferma, puede afectar prácticamente a todo el organismo antes de dar síntomas claros.</>,
      },
    ] },
  { key: "rinones",   label: "Riñones",   foto: "/recorrido/fisiologia/organos/rinones.png",   hotspot: { top: 52, left: 50 }, celulas: pick("podocitos", "celulas-tubulares", "tubulo-proximal", "asa-henle", "tubulo-distal"),
    consejos: [
      {
        titular: "Tus riñones limpian toda tu sangre… una y otra vez.",
        texto: <>Cada día, tus riñones filtran alrededor de 180 litros de líquido. Puede parecer una barbaridad, pero casi todo se recupera. Solo eliminan lo que el cuerpo no necesita, como sustancias de desecho, exceso de agua o sales.</>,
      },
      {
        titular: "Beber más agua no siempre limpia mejor tus riñones.",
        texto: <>Tus riñones son expertos en ahorrar agua cuando hace falta y eliminarla cuando sobra. Beber suficiente es importante, pero hacerlo en exceso no hace que «se limpien» mejor. De hecho, obligarlos a eliminar grandes cantidades de agua constantemente tampoco aporta beneficios.</>,
      },
      {
        titular: "Tus riñones también controlan tu tensión arterial.",
        texto: <>Cuando detectan que llega poca sangre o que la presión es baja, liberan una hormona llamada renina. A partir de ella se activa un sistema que ayuda a aumentar la presión arterial para que todos los órganos sigan recibiendo sangre suficiente. Si este mecanismo permanece activado durante mucho tiempo, el corazón tiene que bombear con más fuerza y acaba engrosando sus paredes para adaptarse, aumentando el riesgo de enfermedad cardiovascular.</>,
      },
      {
        titular: "Mucha sal obliga a tus riñones a trabajar más.",
        texto: <>El sodio es imprescindible para la vida, pero en exceso hace que el cuerpo retenga más agua. Esto aumenta el volumen de sangre y obliga a los riñones y al corazón a trabajar durante años con una carga mayor, favoreciendo la hipertensión.</>,
      },
      {
        titular: "Tus riñones también fabrican hormonas.",
        texto: <>No solo producen orina. Fabrican eritropoyetina, una hormona que estimula la producción de glóbulos rojos en la médula ósea, y activan la vitamina D, imprescindible para absorber calcio y mantener unos huesos fuertes.</>,
      },
      {
        titular: "Algunos medicamentos también pueden dañarlos.",
        texto: <>Los riñones necesitan recibir un flujo constante de sangre para poder filtrar correctamente. Los antiinflamatorios, como el ibuprofeno o el naproxeno, bloquean unas moléculas llamadas prostaglandinas, que ayudan a mantener abiertos los vasos sanguíneos del riñón. Si las tomas con frecuencia, especialmente si estás deshidratado o tienes enfermedad renal, puede llegar menos sangre al riñón y aumentar el riesgo de lesión.</>,
      },
      {
        titular: "El exceso de azúcar también desgasta tus riñones.",
        texto: <>Cada molécula de glucosa que circula por la sangre pasa una y otra vez por los filtros del riñón. Cuando la glucosa permanece elevada durante años, estos filtros trabajan más de lo normal para intentar recuperarla y evitar que se pierda en la orina. Esa sobrecarga acaba dañándolos poco a poco, permitiendo que empiecen a escaparse proteínas y reduciendo su capacidad para filtrar la sangre. Por eso la diabetes es una de las principales causas de insuficiencia renal.</>,
      },
      {
        titular: "Tus riñones deciden qué se queda… y qué se va.",
        texto: <>Los riñones no producen la orina simplemente filtrando la sangre. Primero filtran casi todo y después recuperan el agua, la glucosa, los aminoácidos y muchos minerales que el cuerpo todavía necesita. Solo al final eliminan lo que realmente sobra. Son uno de los sistemas de reciclaje más eficientes del organismo.</>,
      },
      {
        titular: "La orina es una ventana a tu salud.",
        texto: <>El color, la cantidad y la frecuencia con la que orinas dicen mucho sobre cómo está funcionando tu organismo. Una orina muy oscura suele indicar que necesitas más agua. La presencia de sangre, espuma persistente o cambios mantenidos en la cantidad de orina pueden ser señales de que algo no funciona bien en los riñones y conviene consultarlo con un profesional sanitario.</>,
      },
    ] },
  { key: "intestino", label: "Intestino", foto: "/recorrido/fisiologia/organos/intestino.png", hotspot: { top: 62, left: 50 }, celulas: pick("enterocitos", "caliciformes", "paneth", "enteroendocrinas", "celula-madre-intestinal"),
    consejos: [
      {
        titular: "Tu intestino delgado decide qué entra en tu cuerpo.",
        texto: <>Todo lo que comes llega hasta el intestino delgado, pero no todo consigue atravesarlo. Sus células absorben los nutrientes que necesitas y bloquean muchas sustancias potencialmente peligrosas. Es la mayor superficie de intercambio de todo el organismo.</>,
      },
      {
        titular: "No eres lo que comes… eres lo que absorbes.",
        texto: <>Puedes llevar la mejor alimentación del mundo, pero si tu intestino no absorbe correctamente los nutrientes, tus células no podrán utilizarlos. Por eso enfermedades como la celiaquía o la enfermedad de Crohn pueden afectar a todo el organismo.</>,
      },
      {
        titular: "La grasa necesita ayuda para entrar.",
        texto: <>A diferencia del azúcar o los aminoácidos, las grasas no pueden absorberse fácilmente porque no se mezclan con el agua. Por eso la bilis las divide en pequeñas gotas y las enzimas pancreáticas terminan de digerirlas antes de que el intestino pueda absorberlas.</>,
      },
      {
        titular: "Tu intestino se renueva constantemente.",
        texto: <>Las células que recubren el intestino viven solo unos pocos días. Después son sustituidas por otras nuevas para mantener una barrera sana capaz de absorber nutrientes sin dejar pasar microorganismos peligrosos. Por eso se dice que el ayuno es tan saludable, pero depende de tu estilo de vida. Si eres alguien muy sedentario sí te beneficiarás.</>,
      },
      {
        titular: "Tu sistema inmunitario vigila cada bocado.",
        texto: <>Cada comida introduce miles de moléculas nuevas en el organismo. El intestino debe decidir cuáles son inofensivas y cuáles representan una amenaza. Gran parte del sistema inmunitario trabaja en el intestino para mantener ese equilibrio.</>,
      },
      {
        titular: "La fibra alimenta a quienes te cuidan.",
        texto: <>Nosotros no podemos digerir la fibra, pero las bacterias del colon sí. Al fermentarla producen moléculas que alimentan las células del intestino, reducen la inflamación y ayudan a mantener una microbiota sana.</>,
      },
      {
        titular: "No todas las bacterias son malas.",
        texto: <>En el colon viven billones de microorganismos. Muchos fabrican vitaminas, impiden que crezcan bacterias peligrosas y colaboran con el sistema inmunitario. Sin ellos sería mucho más difícil mantenernos sanos.</>,
      },
      {
        titular: "El colon también recicla el agua.",
        texto: <>Cuando el contenido intestinal llega al colon todavía contiene mucha agua. Su principal trabajo es recuperarla antes de formar las heces. Si absorbe demasiada aparece estreñimiento; si absorbe muy poca, diarrea.</>,
      },
      {
        titular: "Tu microbiota cambia con cada comida.",
        texto: <>Las bacterias intestinales se alimentan de lo que tú comes. Una dieta rica en frutas, verduras, legumbres y cereales integrales favorece una microbiota más diversa. En cambio, una alimentación pobre en fibra hace que este ecosistema pierda riqueza y estabilidad.</>,
      },
      {
        titular: "Tu segundo cerebro vive en el intestino.",
        texto: <>El intestino contiene cientos de millones de neuronas que controlan gran parte de la digestión sin necesidad de consultar continuamente al cerebro. Además, ambos órganos se comunican constantemente a través del nervio vago, hormonas y moléculas producidas por la microbiota. Por eso las emociones pueden afectar al intestino… y el intestino también influye en cómo nos sentimos.</>,
      },
    ] },
  { key: "tiroides",  label: "Tiroides",  foto: "/recorrido/fisiologia/organos/tiroides.png",  hotspot: { top: 27, left: 50 }, celulas: pick("tirocito", "celula-c"),
    consejos: [
      {
        titular: "Tu tiroides decide a qué velocidad funciona tu cuerpo.",
        texto: <>Las hormonas tiroideas actúan como el «acelerador» del organismo. Regulan la cantidad de energía que consumen tus células, la temperatura corporal, el ritmo del corazón y hasta la velocidad con la que funcionan muchos órganos.</>,
      },
      {
        titular: "Sin yodo el metabolismo va más lento.",
        texto: <>El yodo es una pieza imprescindible para producir las hormonas tiroideas. Como el cuerpo no puede fabricarlo, debe obtenerse a través de la alimentación. Por eso utilizar sal yodada o consumir pescado y marisco de forma habitual ayuda a mantener una tiroides sana.</>,
      },
      {
        titular: "La tiroides habla con el cerebro constantemente.",
        texto: <>El cerebro controla la tiroides mediante una hormona llamada TSH. Si detecta que hay pocas hormonas tiroideas, le ordena producir más; si hay demasiadas, reduce la señal. Es un sistema de control muy preciso que mantiene el metabolismo en equilibrio.</>,
      },
      {
        titular: "Demasiado rápido… o demasiado lento.",
        texto: <>Cuando la tiroides produce demasiadas hormonas, todo el organismo se acelera: aumenta el pulso, aparece nerviosismo y se pierde peso con facilidad. Cuando produce pocas, ocurre lo contrario: cansancio, sensación de frío, estreñimiento y dificultad para concentrarse.</>,
      },
      {
        titular: "No siempre es culpa de la tiroides.",
        texto: <>El cansancio, la caída del pelo o el aumento de peso pueden tener muchas causas diferentes. Aunque estos síntomas aparecen en algunas enfermedades tiroideas, también pueden deberse a falta de sueño, estrés, anemia, una mala alimentación o muchos otros problemas. Por eso es importante confirmar el diagnóstico antes de pensar que la tiroides es la responsable.</>,
      },
    ] },
  { key: "piel",      label: "Piel",      foto: "/recorrido/fisiologia/organos/piel.png",      hotspot: { top: 24, left: 22 }, celulas: pick("queratinocitos", "melanocitos", "langerhans", "endoteliales", "merkel"),
    consejos: [
      {
        titular: "Tu piel es el órgano más grande de tu cuerpo.",
        texto: <>La piel puede ocupar cerca de dos metros cuadrados y representa alrededor del 15 % de tu peso corporal. Es la primera barrera que te protege frente a golpes, microorganismos, sustancias químicas y la pérdida de agua.</>,
      },
      {
        titular: "El Sol envejece tu piel… incluso cuando no te quemas.",
        texto: <>La radiación ultravioleta atraviesa la piel y daña el ADN de sus células. Aunque no aparezca una quemadura, ese daño se va acumulando con los años y favorece las arrugas, las manchas y el cáncer de piel.<br /><br />Además, algunos fotones de la radiación ultravioleta aportan tanta energía que alteran las moléculas de tus células y favorecen la formación de radicales libres (ROS). Estas moléculas son muy inestables y «roban» electrones a otras para estabilizarse, desencadenando una reacción en cadena que acelera el envejecimiento y el daño celular.</>,
      },
      {
        titular: "Broncearse también es una señal de alarma.",
        texto: <>El bronceado no significa que la piel esté más sana. Es la respuesta de los melanocitos al detectar daño por radiación ultravioleta. Fabrican melanina para intentar absorber parte de esa radiación y proteger el ADN de las células, pero esa protección nunca es completa.</>,
      },
      {
        titular: "La luz del Sol no basta para fabricar vitamina D.",
        texto: <>La radiación ultravioleta inicia la producción de vitamina D en la piel, pero esa molécula todavía es inactiva. Después debe viajar al hígado, donde sufre una primera transformación, y finalmente al riñón, donde se activa por completo. Solo entonces puede ayudar a absorber calcio y mantener fuertes los huesos y los músculos. Por eso enfermedades del hígado, como el hígado graso avanzado, o del riñón también pueden reducir los niveles de vitamina D.</>,
      },
      {
        titular: "La piel también tiene su propio sistema inmunitario.",
        texto: <>Entre las células de la piel viven células inmunitarias que detectan bacterias, virus y otros microorganismos antes de que entren en el organismo. La mayoría de las infecciones nunca llegan más allá gracias a esta primera línea de defensa.</>,
      },
      {
        titular: "Tus heridas se reparan mejor de lo que imaginas.",
        texto: <>Cuando te haces un corte, las plaquetas cierran la herida en minutos, creando una barrera junto a un montón de desafortunados glóbulos rojos que pasaban por ahí. Después llegan células inmunitarias para evitar infecciones y, finalmente, los fibroblastos fabrican colágeno para reconstruir el tejido. Una simple herida pone en marcha a millones de células trabajando al mismo tiempo con un único objetivo: protegerte.</>,
      },
      {
        titular: "Tu piel también tiene un ecosistema.",
        texto: <>Sobre ella viven millones de bacterias, hongos y otros microorganismos que forman la microbiota cutánea. La mayoría son beneficiosos: ocupan espacio, dificultan el crecimiento de microbios peligrosos y colaboran con el sistema inmunitario para mantener la piel sana.</>,
      },
    ] },
  { key: "musculo",   label: "Músculo",   foto: "/recorrido/fisiologia/organos/musculo.png",   hotspot: { top: 58, left: 72 }, celulas: pick("miocitos", "musculares-lisas", "satelite"),
    consejos: [
      {
        titular: "Tus músculos: o los usas… o tu cuerpo los descompone.",
        texto: <>Los músculos son uno de los mayores consumidores de energía del organismo. Cuando haces ejercicio, pueden captar glucosa de la sangre con mucha menos dependencia de la insulina y también utilizan grasas y cuerpos cetónicos como combustible. Pero mantener músculo cuesta mucha energía. Si pasas semanas sin usarlo, el organismo empieza a desmontarlo para reutilizar sus proteínas en otros tejidos. El sedentarismo hace que, literalmente, tu cuerpo se «coma» a tu músculo.</>,
      },
      {
        titular: "Si no los usas, tu cuerpo deja de mantenerlos.",
        texto: <>El músculo es muy caro de mantener. Si pasas semanas sin utilizarlo, el organismo interpreta que ya no lo necesita y empieza a reducir su tamaño para ahorrar energía. Por eso perdemos fuerza tan rápidamente tras una lesión, una hospitalización o largos periodos de inactividad.</>,
      },
      {
        titular: "La fuerza también protege tus huesos.",
        texto: <>Cada vez que un músculo se contrae, tira del hueso al que está unido. Ese pequeño esfuerzo estimula a los huesos para fabricar más tejido óseo y hacerse más resistentes. Entrenar fuerza no solo desarrolla músculo: también ayuda a prevenir la osteoporosis.</>,
      },
      {
        titular: "El movimiento alimenta tus articulaciones.",
        texto: <>El cartílago no tiene vasos sanguíneos. Obtiene el oxígeno y los nutrientes gracias al líquido sinovial, que entra y sale de él cada vez que una articulación se mueve, como si fuera una esponja. Permanecer inmóvil durante mucho tiempo reduce ese intercambio, mientras que el movimiento moderado ayuda a mantener el cartílago sano y lubricado.</>,
      },
      {
        titular: "Tus músculos también ayudan al corazón.",
        texto: <>Al caminar o mover las piernas, los músculos comprimen las venas y empujan la sangre de vuelta hacia el corazón. Por eso se conocen como el «segundo corazón». Permanecer muchas horas sentado dificulta este retorno y favorece la hinchazón de las piernas.</>,
      },
      {
        titular: "Dormir también construye músculo.",
        texto: <>La mayor parte de la reparación muscular ocurre mientras duermes. Durante el sueño aumenta la liberación de hormonas como la hormona del crecimiento y la testosterona, mientras disminuye el cortisol. Al mismo tiempo, las células satélite reparan las pequeñas lesiones producidas durante el ejercicio y ayudan a que el músculo se vuelva más fuerte. Entrenar sin descansar limita estas adaptaciones.</>,
      },
      {
        titular: "Tus músculos también hablan con el resto del cuerpo.",
        texto: <>Cuando haces ejercicio, los músculos liberan moléculas llamadas mioquinas. Estas viajan por la sangre y ayudan a mejorar el funcionamiento del cerebro, el sistema inmunitario, el hígado y el tejido adiposo. Por eso el ejercicio reduce la inflamación, mejora la memoria, ayuda a controlar la glucosa y protege mucho más que los propios músculos.</>,
      },
    ] },
  { key: "huesos",    label: "Huesos",    foto: "/recorrido/fisiologia/organos/huesos.png",    hotspot: { top: 82, left: 44 }, celulas: pick("osteoblastos", "osteoclastos", "osteocitos", "condrocito"),
    consejos: [
      {
        titular: "Tus huesos están vivos.",
        texto: <>Los huesos no son estructuras rígidas e inertes. Cada día destruyen pequeñas zonas dañadas y construyen hueso nuevo. Gracias a este remodelado continuo pueden adaptarse a los esfuerzos y reparar pequeños desperfectos antes de que se conviertan en fracturas.</>,
      },
      {
        titular: "El ejercicio le dice a tus huesos que se hagan más fuertes.",
        texto: <>Cada salto, cada paseo y cada peso que levantas ejerce una pequeña tensión sobre el hueso. Como respuesta, las células óseas reciben el mensaje de fabricar más tejido óseo. Por eso el ejercicio de fuerza y el impacto moderado ayudan a prevenir la osteoporosis.</>,
      },
      {
        titular: "Sin vitamina D, el calcio sirve de poco.",
        texto: <>Puedes consumir mucho calcio, pero si no tienes suficiente vitamina D absorberás mucho menos en el intestino. Es recomendado obtener la vitamina D con la alimentación o con suplementos, obtenerla del sol es realmente difícil debido a que hace falta 3 activaciones distintas.</>,
      },
      {
        titular: "Tus huesos son los ahorros del calcio.",
        texto: <>El calcio es imprescindible para que funcionen los músculos, los nervios y el corazón. Si la sangre necesita más calcio y no lo obtiene de la alimentación, el organismo lo extrae de los huesos. Durante años, este proceso puede debilitarlos si no se repone adecuadamente.</>,
      },
      {
        titular: "La osteoporosis empieza mucho antes de la primera fractura.",
        texto: <>Los huesos pueden perder densidad durante años sin producir ningún síntoma. Cuando aparece la primera fractura, la enfermedad suele llevar mucho tiempo desarrollándose. Algunos estudios aseguran que tiene sus comienzos en la menopausia. Mantener una buena alimentación y hacer ejercicio de fuerza desde joven es la mejor forma de prevenirla.</>,
      },
      {
        titular: "Nunca es tarde para fortalecer tus huesos.",
        texto: <>Aunque alcanzamos el máximo de masa ósea alrededor de los 30 años, los huesos siguen respondiendo al ejercicio durante toda la vida. Moverte hoy sigue siendo una inversión para el esqueleto de mañana.</>,
      },
    ] },
  { key: "sangre",    label: "Sangre",    foto: "/recorrido/fisiologia/organos/sangre.png",    hotspot: { top: 40, left: 80 }, celulas: pick("eritrocitos", "plaquetas", "neutrofilos", "eosinofilos", "basofilos", "monocitos", "macrofagos", "linfocitos-b", "linfocitos-t", "dendriticas"),
    consejos: [
      {
        titular: "Tu sangre es un órgano líquido.",
        texto: <>La sangre no solo transporta oxígeno. Lleva nutrientes, hormonas, células inmunitarias y recoge los desechos que producen tus órganos. Es la red que conecta todas las partes del cuerpo y permite que trabajen como un solo sistema.</>,
      },
      {
        titular: "Tus glóbulos rojos viven solo cuatro meses.",
        texto: <>Los eritrocitos transportan oxígeno gracias a una proteína llamada hemoglobina. Como no tienen núcleo, no pueden repararse cuando envejecen. Después de unos 120 días son retirados por el bazo y el hígado y sustituidos por otros nuevos fabricados en la médula ósea.</>,
      },
      {
        titular: "Tus huesos esconden una fábrica de sangre.",
        texto: <>En la infancia, casi todos los huesos contienen médula ósea roja, el tejido que fabrica las células sanguíneas. Con la edad, parte de esa médula se transforma en médula amarilla, rica en grasa. Aun así, la médula roja que permanece en la pelvis, las vértebras, las costillas o el esternón sigue produciendo glóbulos rojos, glóbulos blancos y plaquetas durante toda la vida.</>,
      },
      {
        titular: "El hierro no da energía… permite fabricarla.",
        texto: <>Muchas personas creen que el hierro «da energía». En realidad, su función principal es formar parte de la hemoglobina, la molécula que transporta el oxígeno. Sin suficiente hierro, llega menos oxígeno a las células y estas producen menos energía, por eso aparece el cansancio.</>,
      },
      {
        titular: "Tu sistema inmunitario nunca duerme.",
        texto: <>Millones de glóbulos blancos patrullan constantemente la sangre y los tejidos buscando virus, bacterias o células dañadas. La mayoría de las veces eliminan estas amenazas sin que llegues a darte cuenta de que estaban ahí.</>,
      },
      {
        titular: "La inflamación también puede ser un problema.",
        texto: <>La inflamación es una herramienta esencial para reparar tejidos y combatir infecciones. Pero si permanece activada durante meses o años, empieza a dañar los propios órganos y favorece enfermedades como la diabetes, la aterosclerosis o algunos tipos de cáncer.</>,
      },
      {
        titular: "Las plaquetas son los primeros albañiles del cuerpo.",
        texto: <>Cuando te haces una herida, las plaquetas llegan en segundos y forman un tapón para evitar que sigas perdiendo sangre. Después liberan señales que atraen a otras células encargadas de reparar el tejido dañado.</>,
      },
      {
        titular: "Tu sangre también reparte los mensajes.",
        texto: <>Las hormonas viajan por la sangre como cartas con una dirección muy concreta. Cuando llegan a un órgano, solo las células que tienen el «buzón» adecuado, llamado receptor, pueden leer el mensaje y responder. Así se coordinan órganos que están muy alejados entre sí.</>,
      },
      {
        titular: "La sangre no siempre es roja.",
        texto: <>Los glóbulos rojos contienen hemoglobina, una proteína rica en hierro que cambia ligeramente de color según transporte o no oxígeno. Por eso la sangre arterial es de un rojo más brillante y la venosa de un rojo más oscuro. Aunque las venas parezcan azules bajo la piel, la sangre que circula por ellas sigue siendo roja.</>,
      },
      {
        titular: "Donar sangre activa la fábrica.",
        texto: <>Después de una donación, el organismo detecta que ha perdido parte de su sangre y los riñones producen más eritropoyetina, una hormona que estimula la médula ósea para fabricar nuevos glóbulos rojos. En pocas semanas, el volumen de sangre y las células perdidas vuelven a recuperarse. Una sola donación puede ayudar a salvar varias vidas.</>,
      },
    ] },
  { key: "conectivo", label: "Tejido conectivo (colágeno)", foto: "/recorrido/fisiologia/organos/conectivo.png", hotspot: { top: 70, left: 28 }, celulas: pick("fibroblastos", "mastocito") },
  { key: "grasa",     label: "Tejido graso", foto: "/recorrido/fisiologia/organos/grasa.png",   hotspot: { top: 50, left: 34 }, celulas: pick("adipocitos-blancos", "adipocitos-marrones") },
];

const pulse = keyframes`
  0%   { transform: translate(-50%, -50%) scale(1);   box-shadow: 0 0 0 0 rgba(255,255,255,0.55); }
  70%  { transform: translate(-50%, -50%) scale(1.1); box-shadow: 0 0 0 12px rgba(255,255,255,0); }
  100% { transform: translate(-50%, -50%) scale(1);   box-shadow: 0 0 0 0 rgba(255,255,255,0); }
`;

// Punto pulsable sobre un órgano.
function Hotspot({ organo, active, onClick }: { organo: Organo; active: boolean; onClick: () => void }) {
  return (
    <Box
      as="button"
      onClick={onClick}
      position="absolute"
      top={`${organo.hotspot.top}%`}
      left={`${organo.hotspot.left}%`}
      transform="translate(-50%, -50%)"
      zIndex={2}
      display="flex"
      alignItems="center"
      gap={2}
      cursor="pointer"
      aria-label={`Ver células de ${organo.label}`}
      sx={{ "&:hover .organo-label": { opacity: 1, transform: "translateX(0)" } }}
    >
      {/* Punto latiendo */}
      <Box
        w={{ base: "16px", md: "18px" }}
        h={{ base: "16px", md: "18px" }}
        borderRadius="full"
        bg={active ? "white" : fisiologiaTxt}
        border={`2px solid ${active ? fisiologiaTxt : "white"}`}
        animation={active ? undefined : `${pulse} 2.4s ease-out infinite`}
        boxShadow={active ? `0 0 12px ${fisiologiaTxt}, 0 0 4px #fff` : undefined}
        flexShrink={0}
      />
      {/* Etiqueta del órgano */}
      <Box
        className="organo-label"
        px={2.5}
        py={1}
        borderRadius="full"
        bg={`${fisiologiaBg}e6`}
        border={`1px solid ${fisiologiaTxt}77`}
        opacity={{ base: 1, md: active ? 1 : 0 }}
        transform={{ base: "none", md: active ? "translateX(0)" : "translateX(-6px)" }}
        transition="all 0.2s ease"
        pointerEvents="none"
        whiteSpace="nowrap"
      >
        <Text color={fisiologiaTxt} fontSize={{ base: "2xs", md: "xs" }} fontWeight={700} letterSpacing="0.06em"
              style={{ textShadow: `0 1px 3px ${fisiologiaBg}` }}>
          {organo.label}
        </Text>
      </Box>
    </Box>
  );
}

// Universo de células alcanzables desde la silueta (para el contador de progreso).
const UNIVERSO = Array.from(new Set(ORGANOS.flatMap((o) => o.celulas.map((c) => c.id))));
const TOTAL_CELULAS = UNIVERSO.length;

// Caja con el fondo y el brillo característicos de Fisiología (chrome reutilizable).
function FisioBox({ children, ...rest }: React.ComponentProps<typeof Box>) {
  return (
    <Box position="relative" w="100%" borderRadius="2xl" overflow="hidden" boxShadow={CAJA_GLOW} {...rest}>
      <DisciplinaBgLayer nom={fisiologiaNom} borderRadius="2xl" />
      <Box position="relative" zIndex={1} h="100%">
        {children}
      </Box>
    </Box>
  );
}

// Flecha redonda del carrusel de células.
function CarouselArrow({ dir, onClick, celulas }: { dir: "left" | "right"; onClick: () => void; celulas: Celula[] }) {
  const left = dir === "left";
  return (
    <Box
      as="button"
      aria-label={left ? "Anterior" : "Siguiente"}
      onClick={onClick}
      flexShrink={0}
      display={{ base: celulas.length > 1 ? "flex" : "none", md: celulas.length > 3 ? "flex" : "none" }}
      alignItems="center"
      justifyContent="center"
      w={{ base: "34px", md: "40px" }}
      h={{ base: "34px", md: "40px" }}
      borderRadius="full"
      bg="rgba(0,0,0,0.42)"
      border={`1px solid ${fisiologiaTxt}aa`}
      color="#fff"
      cursor="pointer"
      transition="all 0.18s"
      sx={{ backdropFilter: "blur(4px)" }}
      _hover={{ bg: "rgba(0,0,0,0.62)", borderColor: fisiologiaTxt }}
    >
      <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"
           w={{ base: "20px", md: "24px" }} h={{ base: "20px", md: "24px" }} fill="#fff"
           style={{ filter: `drop-shadow(0 0 4px ${fisiologiaTxt})` }}>
        {left
          ? <path d="M560-240 320-480l240-240 56 56-184 184 184 184-56 56Z" />
          : <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" />}
      </Box>
    </Box>
  );
}

// Carrusel de células: en ordenador se ven 3 y se desliza con las flechas / scroll;
// en móvil se ve 1 de golpe y se pasa deslizando (scroll-snap).
function CelulasCarousel({
  celulas,
  vistas,
  onCelula,
}: {
  celulas: Celula[];
  vistas: Set<string>;
  onCelula: (c: Celula) => void;
}) {
  const scroller = useRef<HTMLDivElement>(null);
  const GAP = 16; // px — debe coincidir con el gap del contenedor
  const many = celulas.length > 3; // solo entonces hay scroll en ordenador

  const scrollByCard = (dir: number) => {
    const el = scroller.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-celula-card]");
    const step = card ? card.offsetWidth + GAP : el.clientWidth;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  return (
    <Flex align="center" gap={{ base: 1.5, md: 3 }} w="100%">
      <CarouselArrow dir="left" celulas={celulas} onClick={() => scrollByCard(-1)} />
      <Flex
        ref={scroller}
        gap={`${GAP}px`}
        overflowX="auto"
        flex="1"
        minW={0}
        py={2}
        sx={{
          scrollSnapType: "x mandatory",
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": { display: "none" },
        }}
      >
        {celulas.map((c) => (
          <Box
            key={c.id}
            data-celula-card
            flex={{ base: "0 0 100%", md: many ? `0 0 calc((100% - ${2 * GAP}px) / 3)` : "1 1 0" }}
            minW={0}
            scrollSnapAlign="start"
          >
            <CelulaCard celula={c} visto={vistas.has(c.id)} onClick={() => onCelula(c)} />
          </Box>
        ))}
      </Flex>
      <CarouselArrow dir="right" celulas={celulas} onClick={() => scrollByCard(1)} />
    </Flex>
  );
}

// Panel de la derecha (o columna inferior en móvil): al pulsar un órgano se apilan
// tres cajas → (1) foto (izq) + título (der), (2) consejos, (3) carrusel de sus células.
function PanelDerecha({
  organo,
  vistas,
  onCelula,
  onConsejo,
}: {
  organo: Organo;
  vistas: Set<string>;
  onCelula: (c: Celula) => void;
  onConsejo: (c: Consejo) => void;
}) {
  const [imgErr, setImgErr] = useState(false);
  useEffect(() => { setImgErr(false); }, [organo.key]);

  const vistasOrgano = organo.celulas.filter((c) => vistas.has(c.id)).length;
  const organoCompleto = organo.celulas.length > 0 && vistasOrgano === organo.celulas.length;

  return (
    <Flex direction="column" gap={{ base: 5, md: 6 }} w="100%">
      {/* 1 · Foto (izquierda) + título (derecha) */}
      <FisioBox>
        <Flex direction={{ base: "column", md: "row" }} align="center" gap={{ base: 4, md: 7 }}
              px={{ base: 6, md: 8 }} py={{ base: 6, md: 8 }}>
          <Box
            flexShrink={0}
            w={{ base: "170px", md: "210px" }}
            aspectRatio={1}
            borderRadius="2xl"
            overflow="hidden"
            bg={`${fisiologiaTxt}14`}
            boxShadow={`0 8px 30px rgba(0,0,0,0.3), 0 0 18px ${fisiologiaTxt}26`}
          >
            {!imgErr ? (
              <Image src={encodeURI(organo.foto)} alt={organo.label} w="100%" h="100%" objectFit="cover"
                     onError={() => setImgErr(true)} />
            ) : (
              <Flex w="100%" h="100%" align="center" justify="center" textAlign="center" px={3}>
                <Text color={`${fisiologiaTxt}aa`} fontSize="xs" fontStyle="italic">
                  Foto del órgano (próximamente)
                </Text>
              </Flex>
            )}
          </Box>

          <Flex direction="column" gap={{ base: 2, md: 3 }} flex="1" minW={0}
                align={{ base: "center", md: "flex-start" }} textAlign={{ base: "center", md: "left" }}>
            <Text color={fisiologiaTxt} fontSize={{ base: "2xl", md: "3xl" }} fontWeight="700"
                  letterSpacing="0.03em" lineHeight="1.15"
                  style={{ textShadow: `0 0 14px ${fisiologiaBg}cc, 0 2px 6px rgba(0,0,0,0.55)` }}>
              {organo.label}
            </Text>
            {organo.celulas.length > 0 && (
              <Text color={`${fisiologiaTxt}cc`} fontSize={{ base: "xs", md: "sm" }} fontStyle="italic"
                    style={{ textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}>
                {organoCompleto
                  ? "✓ Has descubierto todas sus células"
                  : `${vistasOrgano} de ${organo.celulas.length} células descubiertas`}
              </Text>
            )}
          </Flex>
        </Flex>
      </FisioBox>

      {/* 2 · Consejos del órgano: cada titular abre un modal inmersivo */}
      <FisioBox>
        <Box px={{ base: 5, md: 7 }} py={{ base: 5, md: 6 }}>
          <Text color={fisiologiaTxt} fontSize={{ base: "lg", md: "xl" }} fontWeight="700"
                letterSpacing="0.03em" mb={{ base: 3, md: 4 }} px={{ base: 2, md: 1 }}
                style={{ textShadow: `0 0 12px ${fisiologiaBg}cc, 0 2px 6px rgba(0,0,0,0.5)` }}>
            Consejos
          </Text>

          {organo.consejos && organo.consejos.length > 0 ? (
            <Flex direction="column" gap={{ base: 3, md: 3.5 }}>
              {organo.consejos.map((c, i) => (
                <Flex key={i} align="center" justify="space-between" gap={{ base: 3, md: 5 }} wrap="wrap"
                      borderRadius="xl" bg="rgba(0,0,0,0.2)" border={`1px solid ${fisiologiaTxt}2a`}
                      px={{ base: 4, md: 5 }} py={{ base: 3.5, md: 4 }}>
                  <Text color="rgba(255,255,255,0.95)" flex="1" minW={{ base: "100%", sm: "0" }}
                        fontSize={{ base: "md", md: "lg" }} fontWeight="600" lineHeight="1.4"
                        style={{ textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}>
                    {c.titular}
                  </Text>
                  <Box as="button" onClick={() => onConsejo(c)} flexShrink={0}
                       display="inline-flex" alignItems="center" gap={1.5}
                       px={{ base: 4, md: 5 }} py={2} borderRadius="full"
                       bg={fisiologiaTxt} color={fisiologiaBg}
                       fontFamily="'EB Garamond', serif" fontWeight="700" fontSize={{ base: "xs", md: "sm" }}
                       letterSpacing="0.04em" cursor="pointer" transition="all 0.2s"
                       boxShadow={`0 0 14px ${fisiologiaTxt}55`}
                       _hover={{ transform: "translateY(-1px)", boxShadow: `0 0 22px ${fisiologiaTxt}88` }}>
                    Saber más →
                  </Box>
                </Flex>
              ))}
            </Flex>
          ) : (
            <Box w="100%" minH={{ base: "90px", md: "110px" }}
                 border={`1.5px dashed ${fisiologiaTxt}55`} borderRadius="xl"
                 display="flex" alignItems="center" justifyContent="center" textAlign="center" px={4} py={5}>
              <Text color={`${fisiologiaTxt}cc`} fontSize={{ base: "sm", md: "md" }} fontStyle="italic"
                    style={{ textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}>
                Consejos para cuidar tu {organo.label.toLowerCase()} (próximamente)
              </Text>
            </Box>
          )}
        </Box>
      </FisioBox>

      {/* 3 · Carrusel de células del órgano */}
      <FisioBox>
        <Box px={{ base: 3, md: 5 }} py={{ base: 5, md: 6 }}>
          <Text color={fisiologiaTxt} fontSize={{ base: "lg", md: "xl" }} fontWeight="700"
                letterSpacing="0.03em" mb={{ base: 3, md: 4 }} px={{ base: 2, md: 1 }}
                style={{ textShadow: `0 0 12px ${fisiologiaBg}cc, 0 2px 6px rgba(0,0,0,0.5)` }}>
            Sus células
          </Text>
          {organo.celulas.length > 0 ? (
            <CelulasCarousel celulas={organo.celulas} vistas={vistas} onCelula={onCelula} />
          ) : (
            <Text color={`${fisiologiaTxt}dd`} fontSize={{ base: "md", md: "lg" }} fontStyle="italic"
                  px={{ base: 2, md: 1 }} style={{ textShadow: "0 1px 6px rgba(0,0,0,0.5)" }}>
              Pronto podrás explorar las células de este órgano.
            </Text>
          )}
        </Box>
      </FisioBox>
    </Flex>
  );
}

export default function MetodoFisiologiaTodasCelulas() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [organo, setOrgano] = useState<Organo>(ORGANOS[0]);
  const [celula, setCelula] = useState<Celula | null>(null);
  const [consejo, setConsejo] = useState<Consejo | null>(null);
  const [vistas, setVistas] = useState<Set<string>>(new Set());
  const { extra: celulasBtn, modal: celulasModal } = useTusCelulas();
  const dataRef = useRef<Record<string, any>>({});

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");
    if (!userId || !token) { navigate("/welcome"); return; }
    (async () => {
      try {
        let testEnabled = false;
        try {
          const t = await axios.get(`${API_URL}/payment/test/enabled`);
          testEnabled = !!t.data?.enabled;
        } catch { /* sin modo test */ }

        const me = await axios.get(`${API_URL}/user/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!me.data?.fisiologia_suscrito && !testEnabled) { navigate("/metodo/fisiologia"); return; }

        // Cargamos las células ya descubiertas para retomar el camino.
        try {
          const r = await axios.get(`${API_URL}/metodo-fisiologia/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          dataRef.current = r.data?.data ?? {};
          const guardadas: string[] = dataRef.current?.[VISTAS_KEY] ?? [];
          if (Array.isArray(guardadas) && guardadas.length) setVistas(new Set(guardadas));
        } catch { /* sin fila todavía */ }
      } catch {
        navigate("/metodo/fisiologia");
        return;
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  // Abre la ficha de una célula y la marca como descubierta (se guarda en BD).
  const verCelula = (c: Celula) => {
    setCelula(c);
    if (vistas.has(c.id)) return;
    const next = new Set(vistas);
    next.add(c.id);
    setVistas(next);
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");
    if (!userId || !token) return;
    const data = { ...dataRef.current, [VISTAS_KEY]: Array.from(next) };
    dataRef.current = data;
    axios.patch(`${API_URL}/metodo-fisiologia/${userId}`, { data }, {
      headers: { Authorization: `Bearer ${token}` },
    }).catch(() => { /* se reintenta la próxima vez */ });
  };

  const vistasTotal = UNIVERSO.filter((id) => vistas.has(id)).length;
  const pct = TOTAL_CELULAS ? Math.round((vistasTotal / TOTAL_CELULAS) * 100) : 0;

  if (loading) {
    return <Box minH="100vh" bg="#008080"><SpinnerTurquesa /></Box>;
  }

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 12, md: 16 }}>
        <Flex direction="column" align="center" w="100%" maxW="1100px" gap={7}>

          <MetodoStepHeader
            icon={<FisiologiaIcon size={{ base: "40px", md: "56px" }} />}
            title="Todas tus células"
            pageLabel="2/2"
            compact
            bgColor={`${fisiologiaBg}dd`}
            color={fisiologiaTxt}
            nom={fisiologiaNom}
            mb={0}
            prev={{ label: "← Célula", onClick: () => navigate("/metodo/fisiologia/celula") }}
            extra={celulasBtn}
            next={{ label: "Sistemas →", onClick: () => navigate("/metodo/fisiologia/sistemas") }}
          />

          <Reveal direction="up" distance={18} duration={0.6} w="100%" display="flex" justifyContent="center">
            <Text color="rgba(255,255,255,0.9)" fontSize={{ base: "md", md: "lg" }} fontStyle="italic"
                  textAlign="center" lineHeight="1.8" maxW="640px"
                  style={{ textShadow: "0 1px 10px rgba(0,0,0,0.35)" }}>
              Tu cuerpo entero está hecho de células. Pulsa en cada órgano para descubrir las suyas.
            </Text>
          </Reveal>

          {/* Barra de progreso: el usuario siente que va recorriendo un camino que se guarda */}
          <Reveal direction="up" distance={14} duration={0.55} w="100%" display="flex" justifyContent="center">
            <Flex direction="column" align="center" gap={2} w="100%" maxW="440px">
              <Flex align="center" justify="space-between" w="100%">
                <Text color={fisiologiaTxt} fontSize={{ base: "xs", md: "sm" }} fontWeight={700} letterSpacing="0.06em"
                      style={{ textShadow: `0 1px 4px ${fisiologiaBg}` }}>
                  {vistasTotal === TOTAL_CELULAS && TOTAL_CELULAS > 0
                    ? "✓ Has recorrido todas tus células"
                    : `${vistasTotal} de ${TOTAL_CELULAS} células descubiertas`}
                </Text>
                <Text color={`${fisiologiaTxt}bb`} fontSize={{ base: "xs", md: "sm" }} fontWeight={700}>
                  {pct}%
                </Text>
              </Flex>
              <Box w="100%" h="7px" borderRadius="full" bg="rgba(255,255,255,0.18)" overflow="hidden">
                <Box h="100%" borderRadius="full" w={`${pct}%`} transition="width 0.5s ease"
                     bgGradient={`linear(to-r, ${fisiologiaTxt}, #ffffff)`}
                     boxShadow={`0 0 12px ${fisiologiaTxt}`} />
              </Box>
            </Flex>
          </Reveal>

          {/* ── Dos columnas: box de la silueta (abraza la foto) + panel dinámico ── */}
          <Reveal direction="up" distance={22} duration={0.65} w="100%">
            <Flex direction={{ base: "column", md: "row" }} align={{ base: "center", md: "stretch" }}
                  justify="center" gap={{ base: 8, md: 8 }} w="100%">

              {/* Box de la silueta: apenas más grande que la foto */}
              <Box position="relative" flexShrink={0} borderRadius="2xl" overflow="hidden"
                   boxShadow={CAJA_GLOW} p={{ base: 4, md: 5 }} alignSelf={{ base: "center", md: "flex-start" }}>
                <DisciplinaBgLayer nom={fisiologiaNom} borderRadius="2xl" />
                <Box position="relative" zIndex={1} w={SILUETA_W} maxW="100%">
                  <Box position="relative" w="100%" sx={{ aspectRatio: "1 / 2" }}>
                    <Image
                      src={SILUETA_IMG}
                      alt="Silueta humana con órganos"
                      w="100%" h="100%" objectFit="contain"
                      fallback={
                        <Flex w="100%" h="100%" align="center" justify="center" direction="column" gap={2}
                              border={`1px dashed ${fisiologiaTxt}55`} borderRadius="2xl" textAlign="center" px={4}>
                          <Text color={`${fisiologiaTxt}cc`} fontSize="sm" fontStyle="italic">
                            Silueta con los órganos (próximamente)
                          </Text>
                        </Flex>
                      }
                    />
                    {/* Puntos pulsables (posiciones provisionales) */}
                    {ORGANOS.map((o) => (
                      <Hotspot key={o.key} organo={o} active={organo.key === o.key} onClick={() => setOrgano(o)} />
                    ))}
                  </Box>
                </Box>
              </Box>

              {/* Panel derecho: el órgano pulsado → foto+título, consejos y sus células */}
              <Box flex="1" minW={0} w="100%">
                <PanelDerecha organo={organo} vistas={vistas} onCelula={verCelula} onConsejo={setConsejo} />
              </Box>
            </Flex>
          </Reveal>
        </Flex>
      </Flex>

      {/* Ficha inmersiva de la célula pulsada (foto a la izquierda, texto a la derecha) */}
      {celula && (
        <CelulaModal
          celula={celula}
          celulas={organo.celulas}
          onSelect={verCelula}
          onClose={() => setCelula(null)}
        />
      )}

      {/* Modal inmersivo del consejo: titular arriba, foto (izq) + texto (der) */}
      {consejo && (
        <ConsejoModal
          consejo={consejo}
          foto={organo.foto}
          label={organo.label}
          onClose={() => setConsejo(null)}
        />
      )}

      {celulasModal}
      <IndiceFisiologia />
      <SiteFooter />
    </Box>
  );
}
