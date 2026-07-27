import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex, Image, Text } from "@chakra-ui/react";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { FisiologiaLoading } from "../../components/metodo/comicLoaders";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { DisciplinaBgLayer } from "../../components/global/DisciplinaBgLayer";
import { useTusCelulas } from "../../components/metodo/TusCelulasModal";
import { CelulaCard, CelulaModal, ConsejoModal, type Consejo } from "../../components/metodo/celulasUi";
import { IndiceFisiologia } from "../../components/metodo/IndiceFisiologia";
import { BotonCompania } from "../../components/global/BotonCompania";
import { Reveal, RevealStagger, RevealItem } from "../../components/global/Reveal";
import { precargarImagenes } from "../../hooks/usePrecargarImagenes";
import { API_URL, fisiologiaBg, fisiologiaNom, fisiologiaTxt, FisiologiaIcon, noSelectSx} from "../../GlobalVariables";
import { celulas as CELULAS, type Celula } from "../../hardCoded/espacio/CelulasCuerpoData";

// Glow de las cajas SOLO con el acento de Fisiología (sin halos blancos/menta,
// que sobre el turquesa se veían como un "box clarito" alrededor de la caja).
const CAJA_GLOW = `0 0 16px ${fisiologiaTxt}26, 0 0 40px ${fisiologiaTxt}16`;

// Helper para coger células por id de la lista plana de Fisiología.
const pick = (...ids: string[]): Celula[] =>
  ids.map((id) => CELULAS.find((c) => c.id === id)).filter(Boolean) as Celula[];

// Clave en metodo_fisiologia.data donde guardamos las células ya descubiertas.
const VISTAS_KEY = "celulas_vistas";
// Clave donde guardamos las curiosidades (consejos) ya leídas, por su titular.
const CURIOSIDADES_KEY = "curiosidades_leidas";

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
  /** Descripción del órgano que aparece junto a la foto grande en la ficha. */
  descripcion?: React.ReactNode;
  /** Consejos del órgano (frase titular + texto). Cada uno abre un modal
   *  inmersivo. ⚠️ PENDIENTE: María irá pasando los titulares y sus textos. */
  consejos?: Consejo[];
}

// Posiciones PROVISIONALES (se ajustarán sobre la imagen real). Las fotos de
// los órganos están en /recorrido/fisiologia/organos/{key}.png.
const ORGANOS: Organo[] = [
  { key: "cerebro",   label: "Cerebro",   foto: "/recorrido/fisiologia/organos/cerebro.png",   hotspot: { top: 10, left: 47 }, celulas: pick("neuronas", "astrocitos", "microglia", "oligodendrocitos", "ependimarias", "endotelial-cerebral", "pericito", "celula-madre-neural"),
    descripcion: <>Es el centro de mando de todo tu cuerpo. Desde aquí piensas, sientes, recuerdas y controlas cada movimiento y casi cada función, muchas veces sin darte cuenta. Aunque pesa poco más de un kilo, gasta cerca de una quinta parte de toda tu energía.</>,
    consejos: [
      {
        titular: "Dormir te hace más inteligente.",
        claves: ["El cerebro se limpia al dormir", "Consolida los recuerdos", "Refuerza lo aprendido"],
        texto: <>Mientras duermes, el cerebro no descansa: aprovecha para limpiar. Los astrocitos facilitan una limpieza más profunda del tejido cerebral y la microglía patrulla eliminando restos celulares, vigilando posibles amenazas y ayudando a mantener las conexiones en buen estado. Además, durante el sueño se consolidan los recuerdos y se refuerzan los aprendizajes del día gracias a la neuroplasticidad, que ocurre en mayor o menor escala en cada momento de nuestra Vida.</>,
      },
      {
        titular: "El estrés hace que tu cerebro vea amenazas donde no las hay.",
        claves: ["El estrés crónico mantiene alerta", "Ve amenazas donde no las hay", "Agota energía y concentración"],
        texto: <>El estrés es útil cuando el peligro es real. El problema aparece cuando nunca desaparece. Si el cerebro pasa semanas o meses en estado de alerta, empieza a interpretar situaciones normales como si fueran una amenaza. Es como tener una alarma de incendios que salta a la mínima: consume energía, dificulta concentrarse y hace más difícil disfrutar del presente.</>,
      },
      {
        titular: "Mover el cuerpo también entrena el cerebro.",
        claves: ["El ejercicio riega el cerebro", "Crea nuevas conexiones", "Mejora memoria y ánimo"],
        texto: <>Cada vez que haces ejercicio, aumenta el flujo de sangre que llega al cerebro. Con ella llegan más oxígeno y nutrientes, pero también moléculas que favorecen la supervivencia de las neuronas y la formación de nuevas conexiones. Por eso el ejercicio no solo fortalece los músculos: también mejora la memoria, la atención y el estado de ánimo.</>,
      },
      {
        titular: "Cada cosa nueva que aprendes cambia físicamente tu cerebro.",
        claves: ["Aprender reconfigura conexiones", "Cada experiencia lo cambia", "Nunca deja de moldearse"],
        texto: <>Aprender no consiste en «guardar información». Cada experiencia fortalece unas conexiones entre neuronas y debilita otras. Es un cerebro distinto el que empieza a leer un libro y el que lo termina. Tu cerebro está cambiando constantemente en respuesta a lo que haces.</>,
      },
      {
        titular: "Lo que repites se convierte en quien eres.",
        claves: ["Repetir crea hábitos", "Las conexiones se vuelven eficientes", "Aprendes lo que más practicas"],
        texto: <>El cerebro intenta ahorrar energía. Cuando repites una acción una y otra vez, las conexiones que la controlan se vuelven más rápidas y eficientes. Así nacen los hábitos. Da igual si son buenos o malos: el cerebro aprende aquello que más practicas. Cada repetición deja una pequeña huella en el cableado cerebral.</>,
      },
    ] },
  { key: "pulmones",  label: "Pulmones",  foto: "/recorrido/fisiologia/organos/pulmones.png",  hotspot: { top: 27, left: 42 }, celulas: pick("neumocitos-1", "neumocitos-2", "macrofagos-alveolares", "celula-ciliada", "celula-club"),
    descripcion: <>Son el lugar donde tu sangre se encuentra con el aire. Con cada respiración capturan el oxígeno que necesitan tus células y expulsan el dióxido de carbono que les sobra. Trabajan sin descanso, unas 20.000 veces al día, casi siempre sin que tengas que pensar en ello.</>,
    consejos: [
      {
        titular: "Tus pulmones tienen un ejército de limpieza.",
        claves: ["Cilios que empujan el moco", "Atrapan polvo y bacterias", "Limpian antes de los pulmones"],
        texto: <>Las vías respiratorias están cubiertas por millones de cilios, pequeños «pelos» microscópicos que empujan el moco hacia la garganta. En ese moco quedan atrapados polvo, bacterias y otras partículas antes de que lleguen a los pulmones. Cuando te suenes la nariz o expulses ese moco, también estás eliminando muchos de esos intrusos.</>,
      },
      {
        titular: "Fumar apaga el sistema de limpieza.",
        claves: ["El humo paraliza los cilios", "Él sistema inmunitario se vuelve lento", "Daña los alvéolos"],
        texto: <>El humo del tabaco paraliza los cilios y obliga a los pulmones a acumular más moco y suciedad. Además, daña los alvéolos, donde se produce el intercambio de oxígeno. Por eso los fumadores suelen toser más: el cuerpo intenta expulsar mediante la tos lo que ya no puede limpiar de forma eficiente.</>,
      },
      {
        titular: "Fumar confunde a tu sistema inmunitario.",
        claves: ["Miles de irritantes por calada", "Inmunidad siempre en alerta", "Peor defensa ante infecciones"],
        texto: <>Cada calada llena los pulmones de miles de sustancias irritantes. El sistema inmunitario permanece constantemente en alerta, como una alarma que nunca deja de sonar. Con el tiempo responde peor frente a infecciones y elimina con menos eficacia las células que podrían convertirse en un cáncer.</>,
      },
      {
        titular: "Cada paseo fortalece tus pulmones.",
        claves: ["Fortalece los músculos al respirar", "Mejora el intercambio de oxígeno", "Cada respiración más eficaz"],
        texto: <>Los pulmones no son un músculo, pero pueden trabajar de forma mucho más eficiente. El ejercicio fortalece el diafragma y los músculos respiratorios, mejora el intercambio de oxígeno y hace que cada respiración resulte más eficaz.</>,
      },
      {
        titular: "Cada alvéolo cuenta.",
        claves: ["500 millones de alvéolos", "Superficie de una pista de tenis", "Cuidarlos es cuidar tu respirar"],
        texto: <>Tus pulmones contienen alrededor de 500 millones de alvéolos. Son tan pequeños que apenas los vemos, pero juntos forman una superficie de intercambio de gases similar a una pista de tenis. Cuidarlos significa cuidar cada respiración que tomarás durante el resto de tu Vida.</>,
      },
    ] },
  { key: "corazon",   label: "Corazón",   foto: "/recorrido/fisiologia/organos/corazon.png",   hotspot: { top: 29, left: 50 }, celulas: pick("cardiomiocitos", "marcapasos", "purkinje"),
    descripcion: <>Es una bomba incansable, más o menos del tamaño de tu puño. Late unas 100.000 veces al día para empujar la sangre por todo el cuerpo y llevar oxígeno y nutrientes a cada rincón. No ha descansado ni un segundo desde antes de que nacieras.</>,
    consejos: [
      {
        titular: "Tu corazón también aprende a entrenar.",
        claves: ["El corazón es un músculo", "Con ejercicio se hace eficiente", "Late menos en reposo"],
        texto: <>El corazón es un músculo. Cada vez que haces ejercicio tiene que bombear más sangre para llevar oxígeno a todo el cuerpo. Con el tiempo se vuelve más eficiente: puede mover la misma cantidad de sangre con menos esfuerzo e incluso latir menos veces por minuto cuando estás en reposo.</>,
      },
      {
        titular: "La tensión alta desgasta tus arterias en silencio.",
        claves: ["La presión alta lesiona arterias", "Forma placas al repararse", "Sube el riesgo de infarto"],
        texto: <>La sangre ejerce presión sobre las paredes de las arterias en cada latido. Si esa presión es demasiado alta durante años, las lesiona poco a poco. El organismo intenta repararlas, pero esas reparaciones favorecen la formación de placas que estrechan los vasos y aumentan el riesgo de infarto o ictus.</>,
      },
      {
        titular: "Tu corazón también necesita dormir.",
        claves: ["Al dormir baja pulso y presión", "El corazón descansa", "Dormir poco lo sobrecarga"],
        texto: <>Mientras duermes, disminuyen la frecuencia cardíaca y la presión arterial, permitiendo que el corazón trabaje con menos esfuerzo. Dormir poco mantiene al organismo en un estado de alerta constante, obligando al corazón a trabajar más horas a mayor intensidad.</>,
      },
      {
        titular: "Cada cigarrillo envejece tus arterias.",
        claves: ["El tabaco daña el endotelio", "Las arterias pierden protección", "Se acumulan colesterol e inflamación"],
        texto: <>El tabaco no solo afecta a los pulmones. Sus sustancias dañan el endotelio, la fina capa de células que recubre el interior de las arterias. Cuando esta barrera pierde su capacidad protectora, el colesterol y la inflamación encuentran un lugar donde acumularse con mayor facilidad.</>,
      },
      {
        titular: "El corazón solo pide una cosa: que te muevas.",
        claves: ["Evolucionó para el movimiento", "El sedentarismo lo perjudica", "Cada paso es una inversión"],
        texto: <>Nuestro corazón evolucionó para un cuerpo que caminaba, corría y cargaba peso cada día. Pasar muchas horas sentado reduce la circulación, favorece la hipertensión y obliga al corazón a adaptarse a un estilo de Vida para el que nunca fue diseñado. Cada paseo, cada escalera y cada minuto de actividad física son una inversión directa en su salud.</>,
      },
    ] },
  { key: "estomago",  label: "Estómago",  foto: "/recorrido/fisiologia/organos/estomago.png",  hotspot: { top: 37, left: 54 }, celulas: pick("parietal", "principal", "mucosa-gastrica", "enteroendocrinas-gastricas"),
    descripcion: <>Es donde empieza de verdad la digestión. Guarda la comida, la mezcla y la baña en un ácido tan potente que deshace casi todo lo que comes, mientras un escudo de moco protege sus propias paredes para no digerirse a sí mismo.</>,
    consejos: [
      {
        titular: "El estrés deja tu estómago con menos defensas.",
        claves: ["Altera la conexión cerebro-estómago", "Baja la protección de la mucosa", "Sube el riesgo de úlceras"],
        texto: <>El estrés prolongado altera la comunicación entre el cerebro y el estómago. Cambia la producción de ácido, reduce algunos mecanismos de protección de la mucosa y dificulta su reparación. Si además existe una infección por Helicobacter pylori o tomas antiinflamatorios con frecuencia, el riesgo de gastritis y úlceras aumenta.</>,
      },
      {
        titular: "Tu estómago fabrica uno de los ácidos más fuertes del cuerpo.",
        claves: ["Ácido clorhídrico potentísimo", "Deshace alimentos y microbios", "El moco protege sus paredes"],
        texto: <>El ácido clorhídrico del estómago es tan potente que puede deshacer muchos alimentos y eliminar gran parte de los microorganismos que ingerimos. Aun así, el propio estómago no se digiere porque está protegido por una gruesa capa de moco y bicarbonato que actúa como un escudo.</>,
      },
      {
        titular: "Comer demasiado deprisa hace trabajar peor a tu estómago.",
        claves: ["Comer con prisa traga aire", "Llegan trozos más grandes", "Más pesadez y reflujo"],
        texto: <>Cuando comes con prisas, tragas más aire, masticas menos y el estómago recibe trozos de comida más grandes. Esto obliga a producir más ácido y a trabajar durante más tiempo, favoreciendo la pesadez, el reflujo y una digestión más lenta.</>,
      },
      {
        titular: "El alcohol rompe el escudo de tu estómago.",
        claves: ["Irrita la mucosa gástrica", "Debilita la capa de moco", "El ácido inflama y lesiona"],
        texto: <>El alcohol irrita la mucosa gástrica y debilita la capa de moco que la protege. Cuanto más frecuente es el consumo, más fácil resulta que el ácido alcance las células del estómago y produzca inflamación o pequeñas lesiones.</>,
      },
      {
        titular: "El estrés también se digiere.",
        claves: ["El cerebro frena la digestión", "Habla por el nervio vago", "Nervios: náuseas y nudo"],
        texto: <>Cuando estás estresado, el cerebro prioriza la supervivencia frente a la digestión. El cerebro le hace llegar esta orden al estómago a través del nervio vago. El estómago modifica sus movimientos, cambia la producción de ácido y se comunica constantemente con el sistema nervioso. Por eso los nervios pueden provocar náuseas, dolor o la sensación de tener un «nudo en el estómago».</>,
      },
    ] },
  { key: "higado",    label: "Hígado",    foto: "/recorrido/fisiologia/organos/higado.png",    hotspot: { top: 35, left: 43 }, celulas: pick("hepatocitos", "kupffer", "estrelladas"),
    descripcion: <>Es la gran fábrica química de tu cuerpo. Filtra la sangre, transforma los nutrientes, fabrica proteínas y bilis, almacena energía y neutraliza sustancias tóxicas. Hace cientos de trabajos distintos a la vez y, además, es capaz de regenerarse.</>,
    consejos: [
      {
        titular: "Tu hígado trabaja incluso cuando tú descansas.",
        claves: ["No para ni al dormir", "Regula glucosa y fabrica bilis", "Una fábrica que nunca cierra"],
        texto: <>Mientras duermes, el hígado no se detiene. Sigue regulando la glucosa en sangre, fabricando proteínas, produciendo bilis y transformando sustancias para que el organismo pueda utilizarlas o eliminarlas. Es una fábrica que nunca cierra, ni siquiera mientras duermes.</>,
      },
      {
        titular: "Cada copa cambia las prioridades de tu hígado.",
        claves: ["El alcohol es tóxico", "Deja todo por eliminarlo", "Se resiente su trabajo normal"],
        texto: <>El alcohol es una molécula tóxica para nuestras células. Cuando llega al hígado, este deja en segundo plano parte de su trabajo habitual para eliminarlo cuanto antes. Si el consumo es frecuente, funciones como el metabolismo de las grasas, la regulación de la glucosa o la producción de proteínas acaban viéndose afectadas.</>,
      },
      {
        titular: "El azúcar puede quedarse «atascado» en tu hígado.",
        claves: ["El exceso se vuelve grasa", "Puede aparecer hígado graso", "También sin beber alcohol"],
        texto: <>Cuando consumes más energía de la que tu cuerpo necesita, especialmente en forma de azúcares y alimentos muy procesados, el hígado transforma parte de ese exceso en grasa. Si esta se acumula durante años, puede aparecer el hígado graso, una enfermedad cada vez más frecuente incluso en personas que no beben alcohol y, en algunos casos, también en personas con un peso normal.</>,
      },
      {
        titular: "Tu hígado puede volver a crecer… pero no es invencible.",
        claves: ["Se regenera como pocos órganos", "Recupera el tejido perdido", "El daño repetido lo cicatriza"],
        texto: <>Es uno de los pocos órganos con una gran capacidad de regeneración. Puede recuperar parte del tejido perdido tras una lesión. Sin embargo, si el daño se repite durante años, las cicatrices sustituyen a las células sanas y esa regeneración deja de ser suficiente.</>,
      },
      {
        titular: "No todas las toxinas vienen en una botella.",
        claves: ["Procesa fármacos y químicos", "Más no es mejor", "Los suplementos de sobra dañan"],
        texto: <>El hígado transforma medicamentos, alcohol y muchas otras sustancias químicas. Pero «más» no significa «mejor»: tomar fármacos sin necesidad o abusar de suplementos y productos naturales también puede dañarlo. Antes de consumir cualquier producto de forma habitual, asegúrate de que realmente lo necesitas.</>,
      },
      {
        titular: "El colesterol no es tu enemigo.",
        claves: ["El colesterol es esencial", "El hígado lo produce y regula", "El riesgo: años en niveles altos"],
        texto: <>El colesterol es una molécula esencial. Todas tus células lo necesitan para construir sus membranas y fabricar hormonas como la testosterona, los estrógenos o el cortisol. El hígado produce gran parte del colesterol que necesitas y regula cuánto fabricar, reutilizar o eliminar. El problema no es el colesterol en sí, sino mantener durante años niveles elevados de las lipoproteínas que lo transportan, favorecidos por una mala alimentación, el sedentarismo y otros factores.</>,
      },
      {
        titular: "La bilis es el detergente de tu cuerpo.",
        claves: ["Grasa y agua no se mezclan", "La bilis rompe las gotas", "Facilita absorber las grasas"],
        texto: <>Las grasas no se mezclan con el agua, igual que el aceite no se mezcla con el agua del fregadero. Para solucionarlo, el hígado fabrica bilis, un líquido que rompe las grandes gotas de grasa en otras mucho más pequeñas para que el intestino pueda digerirlas y absorberlas con facilidad.</>,
      },
      {
        titular: "Las grasas saludables ayudan a vaciar la vesícula.",
        claves: ["Las grasas buenas vacían la vesícula", "Liberan la bilis guardada", "Poca grasa favorece cálculos"],
        texto: <>Cada vez que comes alimentos ricos en grasas saludables, como aceite de oliva, frutos secos o pescado azul, la vesícula biliar se contrae y libera la bilis almacenada. Si pasas mucho tiempo con dietas extremadamente bajas en grasa o ayunos prolongados, la bilis permanece estancada durante más tiempo y aumenta el riesgo de formar cálculos biliares.</>,
      },
      {
        titular: "Tu fibra también alimenta a tu hígado.",
        claves: ["La fibra atrapa parte de la bilis", "Se elimina en las heces", "Fabricar más gasta colesterol"],
        texto: <>La mayor parte de la bilis se recicla una y otra vez. Sin embargo, la fibra soluble puede atrapar parte de ella en el intestino y favorecer su eliminación en las heces. Para fabricar nueva bilis, el hígado necesita utilizar colesterol, lo que ayuda a reducir sus niveles en sangre con el paso del tiempo.</>,
      },
      {
        titular: "No todo el colesterol hace el mismo trabajo.",
        claves: ["LDL lo lleva a los tejidos", "HDL lo devuelve al hígado", "LDL bajas protegen las arterias"],
        texto: <>El hígado empaqueta el colesterol y los triglicéridos en unas partículas llamadas lipoproteínas. Las LDL lo llevan desde el hígado hacia los tejidos, mientras que las HDL recogen parte del colesterol sobrante y lo devuelven al hígado para reciclarlo o eliminarlo. Mantener unas LDL bajas y unas HDL saludables reduce el riesgo de que el colesterol se acumule en las arterias.</>,
      },
      {
        titular: "Tu hígado decide qué hacer con la energía.",
        claves: ["Recibe los nutrientes del intestino", "Guarda glucosa como glucógeno", "El exceso lo vuelve grasa"],
        texto: <>Después de comer, el hígado recibe casi todos los nutrientes que absorbe el intestino. Si necesitas energía, la distribuye. Si sobra glucosa, la almacena como glucógeno. Y si todavía sobra más, la transforma en triglicéridos, que viajarán por la sangre para almacenarse principalmente en el tejido adiposo.</>,
      },
      {
        titular: "El hígado también fabrica las proteínas de tu sangre.",
        claves: ["Fabrica proteínas de la sangre", "Permiten transportar y coagular", "Si falla, escasean"],
        texto: <>Muchas de las proteínas que transportan hormonas, mantienen el volumen de la sangre o permiten que coagule correctamente se producen en el hígado. Cuando deja de funcionar bien, no solo se acumulan toxinas: también falla la fabricación de componentes esenciales para todo el organismo.</>,
      },
      {
        titular: "Sin hígado, muchas vitaminas no servirían de mucho.",
        claves: ["Almacena vitaminas y minerales", "Los libera cuando hacen falta", "Un almacén estratégico"],
        texto: <>El hígado almacena vitaminas como la A, D, B₁₂ y K, además de minerales como el hierro y el cobre. Actúa como un almacén estratégico que libera estos nutrientes cuando el organismo los necesita, evitando que dependamos únicamente de lo que comemos cada día.</>,
      },
    ] },
  { key: "pancreas",  label: "Páncreas",  foto: "/recorrido/fisiologia/organos/pancreas.png",  hotspot: { top: 40, left: 49 }, celulas: pick("celulas-beta", "celulas-alfa", "celulas-delta", "celulas-acinares", "celulas-ductales", "celulas-pp"),
    descripcion: <>Es un órgano discreto con un doble oficio. Regula el azúcar de tu sangre mediante hormonas como la insulina y el glucagón y, a la vez, fabrica las potentes enzimas que digieren gran parte de lo que comes.</>,
    consejos: [
      {
        titular: "Tu páncreas sabe cuánto azúcar hay en tu sangre.",
        claves: ["Mide la glucosa en sangre", "Sube: libera insulina", "Baja: libera glucagón"],
        texto: <>Cada vez que comes, el páncreas mide continuamente la cantidad de glucosa que circula por la sangre. Si sube demasiado, libera insulina para que las células puedan utilizarla o almacenarla. Si baja, libera glucagón para que el hígado vuelva a liberar glucosa.</>,
      },
      {
        titular: "La diabetes puede dejarte ciego.",
        claves: ["Glucosa alta demasiado tiempo", "Daña nervios, ojos y riñones", "Por eso puede cegar"],
        texto: <>En la diabetes tipo 1, el sistema inmunitario destruye las células que producen insulina. En la tipo 2, las células del cuerpo dejan de responder correctamente a esa hormona. En ambos casos, la glucosa permanece demasiado tiempo en la sangre, haciendo que las arterias se peguen entre ellas, dificultando la llegada de sangre y nutrientes a nervios, ojos y riñones, deteriorándolas y haciendo que pierdan su funcionamiento con el tiempo.</>,
      },
      {
        titular: "Tu páncreas también fabrica tus enzimas digestivas.",
        claves: ["Libera enzimas en cada comida", "Digieren grasas y proteínas", "Sin ellas no se absorbe"],
        texto: <>Cada comida hace que el páncreas libere enzimas capaces de digerir proteínas, grasas y carbohidratos. Sin ellas, gran parte de los nutrientes atravesarían el intestino sin poder ser absorbidos.</>,
      },
      {
        titular: "El exceso de azúcar obliga a tu páncreas a trabajar más.",
        claves: ["Más azúcar, más insulina", "Esfuerzo continuo durante años", "Las células beta se agotan"],
        texto: <>Cuando consumes con frecuencia grandes cantidades de azúcar y calorías, el organismo necesita producir cada vez más insulina para mantener estable la glucosa en sangre. Durante años, ese esfuerzo continuo puede favorecer que las células beta pierdan parte de su capacidad para funcionar correctamente.</>,
      },
      {
        titular: "El alcohol también puede inflamar el páncreas.",
        claves: ["Sus enzimas son muy potentes", "El alcohol las activa antes", "Puede causar pancreatitis"],
        texto: <>El páncreas fabrica enzimas muy potentes que normalmente permanecen inactivas hasta llegar al intestino. El alcohol aumenta el riesgo de que estas enzimas se activen antes de tiempo y empiecen a dañar el propio páncreas, provocando una pancreatitis.</>,
      },
      {
        titular: "El páncreas trabaja en silencio.",
        claves: ["Pasa desapercibido", "Regula glucosa y digestión", "Enferma sin avisar"],
        texto: <>A diferencia del estómago o del intestino, el páncreas suele pasar desapercibido. Sin embargo, regula la glucosa en sangre y produce la mayor parte de las enzimas digestivas. Cuando enferma, puede afectar prácticamente a todo el organismo antes de dar síntomas claros.</>,
      },
    ] },
  { key: "rinones",   label: "Riñones",   foto: "/recorrido/fisiologia/organos/rinones.png",   hotspot: { top: 43, left: 44 }, celulas: pick("podocitos", "celulas-tubulares", "tubulo-proximal", "asa-henle", "tubulo-distal"),
    descripcion: <>Son los filtros de tu cuerpo. Cada día limpian toda tu sangre muchas veces, eliminan lo que sobra en forma de orina y deciden con precisión cuánta agua y sales conservar. Además, regulan la tensión y ayudan a fabricar sangre.</>,
    consejos: [
      {
        titular: "Tus riñones limpian toda tu sangre… una y otra vez.",
        claves: ["Filtran 180 litros al día", "Casi todo se recupera", "Solo eliminan lo que sobra"],
        texto: <>Cada día, tus riñones filtran alrededor de 180 litros de líquido. Puede parecer una barbaridad, pero casi todo se recupera. Solo eliminan lo que el cuerpo no necesita, como sustancias de desecho, exceso de agua o sales.</>,
      },
      {
        titular: "Beber más agua no siempre limpia mejor tus riñones.",
        claves: ["Ahorran o eliminan agua", "Beber de más no limpia mejor", "El exceso no aporta"],
        texto: <>Tus riñones son expertos en ahorrar agua cuando hace falta y eliminarla cuando sobra. Beber suficiente es importante, pero hacerlo en exceso no hace que «se limpien» mejor. De hecho, obligarlos a eliminar grandes cantidades de agua constantemente tampoco aporta beneficios.</>,
      },
      {
        titular: "Tus riñones también controlan tu tensión arterial.",
        claves: ["Liberan renina si baja la presión", "Regulan la tensión arterial", "Su exceso fuerza al corazón"],
        texto: <>Cuando detectan que llega poca sangre o que la presión es baja, liberan una hormona llamada renina. A partir de ella se activa un sistema que ayuda a aumentar la presión arterial para que todos los órganos sigan recibiendo sangre suficiente. Si este mecanismo permanece activado durante mucho tiempo, el corazón tiene que bombear con más fuerza y acaba engrosando sus paredes para adaptarse, aumentando el riesgo de enfermedad cardiovascular.</>,
      },
      {
        titular: "Mucha sal obliga a tus riñones a trabajar más.",
        claves: ["El sodio retiene agua", "Sube el volumen de sangre", "Favorece la hipertensión"],
        texto: <>El sodio es imprescindible para la Vida, pero en exceso hace que el cuerpo retenga más agua. Esto aumenta el volumen de sangre y obliga a los riñones y al corazón a trabajar durante años con una carga mayor, favoreciendo la hipertensión.</>,
      },
      {
        titular: "Tus riñones también fabrican hormonas.",
        claves: ["Producen eritropoyetina", "Estimulan los glóbulos rojos", "Activan la vitamina D"],
        texto: <>No solo producen orina. Fabrican eritropoyetina, una hormona que estimula la producción de glóbulos rojos en la médula ósea, y activan la vitamina D, imprescindible para absorber calcio y mantener unos huesos fuertes.</>,
      },
      {
        titular: "Algunos medicamentos también pueden dañarlos.",
        claves: ["Necesitan flujo constante de sangre", "Los antiinflamatorios lo reducen", "Riesgo si se abusa"],
        texto: <>Los riñones necesitan recibir un flujo constante de sangre para poder filtrar correctamente. Los antiinflamatorios, como el ibuprofeno o el naproxeno, bloquean unas moléculas llamadas prostaglandinas, que ayudan a mantener abiertos los vasos sanguíneos del riñón. Si las tomas con frecuencia, especialmente si estás deshidratado o tienes enfermedad renal, puede llegar menos sangre al riñón y aumentar el riesgo de lesión.</>,
      },
      {
        titular: "El exceso de azúcar también desgasta tus riñones.",
        claves: ["La glucosa pasa por los filtros", "Años altos los sobrecargan", "La diabetes daña los riñones"],
        texto: <>Cada molécula de glucosa que circula por la sangre pasa una y otra vez por los filtros del riñón. Cuando la glucosa permanece elevada durante años, estos filtros trabajan más de lo normal para intentar recuperarla y evitar que se pierda en la orina. Esa sobrecarga acaba dañándolos poco a poco, permitiendo que empiecen a escaparse proteínas y reduciendo su capacidad para filtrar la sangre. Por eso la diabetes es una de las principales causas de insuficiencia renal.</>,
      },
      {
        titular: "Tus riñones deciden qué se queda… y qué se va.",
        claves: ["Filtran casi todo primero", "Recuperan lo útil", "Reciclaje muy eficiente"],
        texto: <>Los riñones no producen la orina simplemente filtrando la sangre. Primero filtran casi todo y después recuperan el agua, la glucosa, los aminoácidos y muchos minerales que el cuerpo todavía necesita. Solo al final eliminan lo que realmente sobra. Son uno de los sistemas de reciclaje más eficientes del organismo.</>,
      },
      {
        titular: "La orina es una ventana a tu salud.",
        claves: ["Color y cantidad informan", "Oscura: bebe más agua", "Sangre o espuma: consulta"],
        texto: <>El color, la cantidad y la frecuencia con la que orinas dicen mucho sobre cómo está funcionando tu organismo. Una orina muy oscura suele indicar que necesitas más agua. La presencia de sangre, espuma persistente o cambios mantenidos en la cantidad de orina pueden ser señales de que algo no funciona bien en los riñones y conviene consultarlo con un profesional sanitario.</>,
      },
    ] },
  { key: "intestino", label: "Intestino", foto: "/recorrido/fisiologia/organos/intestino.png", hotspot: { top: 47, left: 49 }, celulas: pick("enterocitos", "caliciformes", "paneth", "enteroendocrinas", "celula-madre-intestinal"),
    descripcion: <>Es donde tu cuerpo decide qué entra y qué no. Absorbe los nutrientes a través de una superficie enorme y alberga billones de bacterias que te ayudan a digerir, te protegen y hasta se comunican con tu cerebro.</>,
    consejos: [
      {
        titular: "Tu intestino delgado decide qué entra en tu cuerpo.",
        claves: ["Absorbe los nutrientes", "Bloquea lo peligroso", "La mayor superficie del cuerpo"],
        texto: <>Todo lo que comes llega hasta el intestino delgado, pero no todo consigue atravesarlo. Sus células absorben los nutrientes que necesitas y bloquean muchas sustancias potencialmente peligrosas. Es la mayor superficie de intercambio de todo el organismo.</>,
      },
      {
        titular: "No eres lo que comes… eres lo que absorbes.",
        claves: ["Importa lo que absorbes", "Sin absorber no sirve de nada", "Puede afectar a todo el cuerpo"],
        texto: <>Puedes llevar la mejor alimentación del mundo, pero si tu intestino no absorbe correctamente los nutrientes, tus células no podrán utilizarlos. Por eso enfermedades como la celiaquía o la enfermedad de Crohn pueden afectar a todo el organismo.</>,
      },
      {
        titular: "La grasa necesita ayuda para entrar.",
        claves: ["La grasa no se mezcla con agua", "La bilis la divide en gotas", "Las enzimas la terminan"],
        texto: <>A diferencia del azúcar o los aminoácidos, las grasas no pueden absorberse fácilmente porque no se mezclan con el agua. Por eso la bilis las divide en pequeñas gotas y las enzimas pancreáticas terminan de digerirlas antes de que el intestino pueda absorberlas.</>,
      },
      {
        titular: "Tu intestino se renueva constantemente.",
        claves: ["Sus células viven pocos días", "Se renuevan sin cesar", "Barrera siempre joven"],
        texto: <>Las células que recubren el intestino viven solo unos pocos días. Después son sustituidas por otras nuevas para mantener una barrera sana capaz de absorber nutrientes sin dejar pasar microorganismos peligrosos. Por eso se dice que el ayuno es tan saludable, pero depende de tu estilo de Vida. Si eres alguien muy sedentario sí te beneficiarás.</>,
      },
      {
        titular: "Tu sistema inmunitario vigila cada bocado.",
        claves: ["Cada comida trae lo desconocido", "Decide qué es amenaza", "Gran parte de la inmunidad vive aquí"],
        texto: <>Cada comida introduce miles de moléculas nuevas en el organismo. El intestino debe decidir cuáles son inofensivas y cuáles representan una amenaza. Gran parte del sistema inmunitario trabaja en el intestino para mantener ese equilibrio.</>,
      },
      {
        titular: "La fibra alimenta a quienes te cuidan.",
        claves: ["Las bacterias fermentan la fibra", "Nutren las células del intestino", "Reducen la inflamación"],
        texto: <>Nosotros no podemos digerir la fibra, pero las bacterias del colon sí. Al fermentarla producen moléculas que alimentan las células del intestino, reducen la inflamación y ayudan a mantener una microbiota sana.</>,
      },
      {
        titular: "No todas las bacterias son malas.",
        claves: ["Billones de bacterias buenas", "Fabrican vitaminas", "Frenan a las peligrosas"],
        texto: <>En el colon viven billones de microorganismos. Muchos fabrican vitaminas, impiden que crezcan bacterias peligrosas y colaboran con el sistema inmunitario. Sin ellos sería mucho más difícil mantenernos sanos.</>,
      },
      {
        titular: "El colon también recicla el agua.",
        claves: ["Recupera el agua del intestino", "Demasiada: estreñimiento", "Muy poca: diarrea"],
        texto: <>Cuando el contenido intestinal llega al colon todavía contiene mucha agua. Su principal trabajo es recuperarla antes de formar las heces. Si absorbe demasiada aparece estreñimiento; si absorbe muy poca, diarrea.</>,
      },
      {
        titular: "Tu microbiota cambia con cada comida.",
        claves: ["Comen lo que tú comes", "La fibra la diversifica", "Poca fibra la empobrece"],
        texto: <>Las bacterias intestinales se alimentan de lo que tú comes. Una dieta rica en frutas, verduras, legumbres y cereales integrales favorece una microbiota más diversa. En cambio, una alimentación pobre en fibra hace que este ecosistema pierda riqueza y estabilidad.</>,
      },
      {
        titular: "Tu segundo cerebro vive en el intestino.",
        claves: ["Millones de neuronas propias", "Habla con el cerebro", "Emociones e intestino conectan"],
        texto: <>El intestino contiene cientos de millones de neuronas que controlan gran parte de la digestión sin necesidad de consultar continuamente al cerebro. Además, ambos órganos se comunican constantemente a través del nervio vago, hormonas y moléculas producidas por la microbiota. Por eso las emociones pueden afectar al intestino… y el intestino también influye en cómo nos sentimos.</>,
      },
    ] },
  { key: "tiroides",  label: "Tiroides",  foto: "/recorrido/fisiologia/organos/tiroides.png",  hotspot: { top: 20, left: 46 }, celulas: pick("tirocito", "celula-c"),
    descripcion: <>Es una pequeña glándula con forma de mariposa en tu cuello. Marca el ritmo al que funciona todo tu cuerpo: la energía que gastas, la temperatura, el pulso… como un acelerador que trabaja en silencio.</>,
    consejos: [
      {
        titular: "Tu tiroides decide a qué velocidad funciona tu cuerpo.",
        claves: ["El acelerador del cuerpo", "Regula energía y temperatura", "Marca el ritmo del corazón"],
        texto: <>Las hormonas tiroideas actúan como el «acelerador» del organismo. Regulan la cantidad de energía que consumen tus células, la temperatura corporal, el ritmo del corazón y hasta la velocidad con la que funcionan muchos órganos.</>,
      },
      {
        titular: "Sin yodo el metabolismo va más lento.",
        claves: ["El yodo es imprescindible", "El cuerpo no lo fabrica", "Sal yodada y pescado"],
        texto: <>El yodo es una pieza imprescindible para producir las hormonas tiroideas. Como el cuerpo no puede fabricarlo, debe obtenerse a través de la alimentación. Por eso utilizar sal yodada o consumir pescado y marisco de forma habitual ayuda a mantener una tiroides sana.</>,
      },
      {
        titular: "La tiroides habla con el cerebro constantemente.",
        claves: ["El cerebro la controla con TSH", "Pide más o menos hormona", "Un equilibrio muy preciso"],
        texto: <>El cerebro controla la tiroides mediante una hormona llamada TSH. Si detecta que hay pocas hormonas tiroideas, le ordena producir más; si hay demasiadas, reduce la señal. Es un sistema de control muy preciso que mantiene el metabolismo en equilibrio.</>,
      },
      {
        titular: "Demasiado rápido… o demasiado lento.",
        claves: ["Mucha hormona: todo se acelera", "Poca: cansancio y frío", "Dos extremos opuestos"],
        texto: <>Cuando la tiroides produce demasiadas hormonas, todo el organismo se acelera: aumenta el pulso, aparece nerviosismo y se pierde peso con facilidad. Cuando produce pocas, ocurre lo contrario: cansancio, sensación de frío, estreñimiento y dificultad para concentrarse.</>,
      },
      {
        titular: "No siempre es culpa de la tiroides.",
        claves: ["Muchos síntomas, mil causas", "Sueño, estrés o anemia", "Confirma antes de culparla"],
        texto: <>El cansancio, la caída del pelo o el aumento de peso pueden tener muchas causas diferentes. Aunque estos síntomas aparecen en algunas enfermedades tiroideas, también pueden deberse a falta de sueño, estrés, anemia, una mala alimentación o muchos otros problemas. Por eso es importante confirmar el diagnóstico antes de pensar que la tiroides es la responsable.</>,
      },
    ] },
  { key: "piel",      label: "Piel",      foto: "/recorrido/fisiologia/organos/piel.png",      hotspot: { top: 22, left: 32 }, celulas: pick("queratinocitos", "melanocitos", "langerhans", "endoteliales", "merkel"),
    descripcion: <>Es tu órgano más grande y tu primera frontera con el mundo. Te protege de golpes, microbios y del sol, regula tu temperatura y te permite sentir el tacto. Se renueva sin parar y se repara sola cuando se daña.</>,
    consejos: [
      {
        titular: "Tu piel es el órgano más grande de tu cuerpo.",
        claves: ["Casi 2 m² de superficie", "Tu primera barrera", "Frena microbios y golpes"],
        texto: <>La piel puede ocupar cerca de dos metros cuadrados y representa alrededor del 15 % de tu peso corporal. Es la primera barrera que te protege frente a golpes, microorganismos, sustancias químicas y la pérdida de agua.</>,
      },
      {
        titular: "El Sol envejece tu piel… incluso cuando no te quemas.",
        claves: ["La UV daña el ADN sin quemar", "El daño se acumula con los años", "Genera radicales libres"],
        texto: <>La radiación ultravioleta atraviesa la piel y daña el ADN de sus células. Aunque no aparezca una quemadura, ese daño se va acumulando con los años y favorece las arrugas, las manchas y el cáncer de piel.<br /><br />Además, algunos fotones de la radiación ultravioleta aportan tanta energía que alteran las moléculas de tus células y favorecen la formación de radicales libres (ROS). Estas moléculas son muy inestables y «roban» electrones a otras para estabilizarse, desencadenando una reacción en cadena que acelera el envejecimiento y el daño celular.</>,
      },
      {
        titular: "Broncearse también es una señal de alarma.",
        claves: ["Broncearse no es estar sano", "Es defensa ante el daño solar", "La melanina no basta"],
        texto: <>El bronceado no significa que la piel esté más sana. Es la respuesta de los melanocitos al detectar daño por radiación ultravioleta. Fabrican melanina para intentar absorber parte de esa radiación y proteger el ADN de las células, pero esa protección nunca es completa.</>,
      },
      {
        titular: "La luz del Sol no basta para fabricar vitamina D.",
        claves: ["El sol solo la inicia", "Hígado y riñón la activan", "Cuesta obtenerla solo del sol"],
        texto: <>La radiación ultravioleta inicia la producción de vitamina D en la piel, pero esa molécula todavía es inactiva. Después debe viajar al hígado, donde sufre una primera transformación, y finalmente al riñón, donde se activa por completo. Solo entonces puede ayudar a absorber calcio y mantener fuertes los huesos y los músculos. Por eso enfermedades del hígado, como el hígado graso avanzado, o del riñón también pueden reducir los niveles de vitamina D.</>,
      },
      {
        titular: "La piel también tiene su propio sistema inmunitario.",
        claves: ["Células inmunes en la piel", "Detectan microbios al llegar", "Primera línea de defensa"],
        texto: <>Entre las células de la piel viven células inmunitarias que detectan bacterias, virus y otros microorganismos antes de que entren en el organismo. La mayoría de las infecciones nunca llegan más allá gracias a esta primera línea de defensa.</>,
      },
      {
        titular: "Tus heridas se reparan mejor de lo que imaginas.",
        claves: ["Las plaquetas cierran en minutos", "Las defensas evitan infección", "El colágeno reconstruye"],
        texto: <>Cuando te haces un corte, las plaquetas cierran la herida en minutos, creando una barrera junto a un montón de desafortunados glóbulos rojos que pasaban por ahí. Después llegan células inmunitarias para evitar infecciones y, finalmente, los fibroblastos fabrican colágeno para reconstruir el tejido. Una simple herida pone en marcha a millones de células trabajando al mismo tiempo con un único objetivo: protegerte.</>,
      },
      {
        titular: "Tu piel también tiene un ecosistema.",
        claves: ["Millones de microbios viven en ella", "La mayoría son beneficiosos", "Frenan a los peligrosos"],
        texto: <>Sobre ella viven millones de bacterias, hongos y otros microorganismos que forman la microbiota cutánea. La mayoría son beneficiosos: ocupan espacio, dificultan el crecimiento de microbios peligrosos y colaboran con el sistema inmunitario para mantener la piel sana.</>,
      },
    ] },
  { key: "musculo",   label: "Músculo",   foto: "/recorrido/fisiologia/organos/musculo.png",   hotspot: { top: 66, left: 43 }, celulas: pick("miocitos", "musculares-lisas", "satelite"),
    descripcion: <>Es lo que te permite moverte, mantenerte en pie y hasta respirar. Se contrae y se relaja miles de veces al día, quema mucha energía y se vuelve más fuerte cuanto más lo usas. Si lo abandonas, tu cuerpo lo va desmontando.</>,
    consejos: [
      {
        titular: "Tus músculos: o los usas… o tu cuerpo los descompone.",
        claves: ["Gran consumidor de energía", "Captan glucosa al moverte", "El sedentarismo los desmonta"],
        texto: <>Los músculos son uno de los mayores consumidores de energía del organismo. Cuando haces ejercicio, pueden captar glucosa de la sangre con mucha menos dependencia de la insulina y también utilizan grasas y cuerpos cetónicos como combustible. Pero mantener músculo cuesta mucha energía. Si pasas semanas sin usarlo, el organismo empieza a desmontarlo para reutilizar sus proteínas en otros tejidos. El sedentarismo hace que, literalmente, tu cuerpo se «coma» a tu músculo.</>,
      },
      {
        titular: "Si no los usas, tu cuerpo deja de mantenerlos.",
        claves: ["Mantenerlos cuesta energía", "Sin uso, se reducen", "La fuerza se pierde rápido"],
        texto: <>El músculo es muy caro de mantener. Si pasas semanas sin utilizarlo, el organismo interpreta que ya no lo necesita y empieza a reducir su tamaño para ahorrar energía. Por eso perdemos fuerza tan rápidamente tras una lesión, una hospitalización o largos periodos de inactividad.</>,
      },
      {
        titular: "La fuerza también protege tus huesos.",
        claves: ["El músculo tira del hueso", "Lo estimula a reforzarse", "Previene la osteoporosis"],
        texto: <>Cada vez que un músculo se contrae, tira del hueso al que está unido. Ese pequeño esfuerzo estimula a los huesos para fabricar más tejido óseo y hacerse más resistentes. Entrenar fuerza no solo desarrolla músculo: también ayuda a prevenir la osteoporosis.</>,
      },
      {
        titular: "El movimiento alimenta tus articulaciones.",
        claves: ["El cartílago no tiene vasos", "El movimiento lo nutre", "La quietud lo reseca"],
        texto: <>El cartílago no tiene vasos sanguíneos. Obtiene el oxígeno y los nutrientes gracias al líquido sinovial, que entra y sale de él cada vez que una articulación se mueve, como si fuera una esponja. Permanecer inmóvil durante mucho tiempo reduce ese intercambio, mientras que el movimiento moderado ayuda a mantener el cartílago sano y lubricado.</>,
      },
      {
        titular: "Tus músculos también ayudan al corazón.",
        claves: ["Empujan la sangre al corazón", "El «segundo corazón»", "Sentado se hinchan las piernas"],
        texto: <>Al caminar o mover las piernas, los músculos comprimen las venas y empujan la sangre de vuelta hacia el corazón. Por eso se conocen como el «segundo corazón». Permanecer muchas horas sentado dificulta este retorno y favorece la hinchazón de las piernas.</>,
      },
      {
        titular: "Dormir también construye músculo.",
        claves: ["El músculo se repara al dormir", "Suben hormonas reparadoras", "Las satélite arreglan las fibras"],
        texto: <>La mayor parte de la reparación muscular ocurre mientras duermes. Durante el sueño aumenta la liberación de hormonas como la hormona del crecimiento y la testosterona, mientras disminuye el cortisol. Al mismo tiempo, las células satélite reparan las pequeñas lesiones producidas durante el ejercicio y ayudan a que el músculo se vuelva más fuerte. Entrenar sin descansar limita estas adaptaciones.</>,
      },
      {
        titular: "Tus músculos también hablan con el resto del cuerpo.",
        claves: ["Liberan mioquinas al moverse", "Viajan por la sangre", "Benefician a todo el cuerpo"],
        texto: <>Cuando haces ejercicio, los músculos liberan moléculas llamadas mioquinas. Estas viajan por la sangre y ayudan a mejorar el funcionamiento del cerebro, el sistema inmunitario, el hígado y el tejido adiposo. Por eso el ejercicio reduce la inflamación, mejora la memoria, ayuda a controlar la glucosa y protege mucho más que los propios músculos.</>,
      },
    ] },
  { key: "huesos",    label: "Huesos",    foto: "/recorrido/fisiologia/organos/huesos.png",    hotspot: { top: 77, left: 55 }, celulas: pick("osteoblastos", "osteoclastos", "osteocitos", "condrocito"),
    descripcion: <>Son mucho más que un simple armazón. Están vivos: se rompen y se reconstruyen cada día, sostienen tu cuerpo, protegen tus órganos, guardan tu calcio y en su interior fabrican la sangre.</>,
    consejos: [
      {
        titular: "Tus huesos están vivos.",
        claves: ["Se renuevan cada día", "Remodelado continuo", "Se reparan antes de romperse"],
        texto: <>Los huesos no son estructuras rígidas e inertes. Cada día destruyen pequeñas zonas dañadas y construyen hueso nuevo. Gracias a este remodelado continuo pueden adaptarse a los esfuerzos y reparar pequeños desperfectos antes de que se conviertan en fracturas.</>,
      },
      {
        titular: "El ejercicio le dice a tus huesos que se hagan más fuertes.",
        claves: ["La carga los estimula", "Fabrican más hueso", "Previene la osteoporosis"],
        texto: <>Cada salto, cada paseo y cada peso que levantas ejerce una pequeña tensión sobre el hueso. Como respuesta, las células óseas reciben el mensaje de fabricar más tejido óseo. Por eso el ejercicio de fuerza y el impacto moderado ayudan a prevenir la osteoporosis.</>,
      },
      {
        titular: "Sin vitamina D, el calcio sirve de poco.",
        claves: ["Sin vitamina D no se absorbe el calcio", "Mejor por dieta o suplemento", "Del sol cuesta obtenerla"],
        texto: <>Puedes consumir mucho calcio, pero si no tienes suficiente vitamina D absorberás mucho menos en el intestino. Es recomendado obtener la vitamina D con la alimentación o con suplementos, obtenerla del sol es realmente difícil debido a que hace falta 3 activaciones distintas.</>,
      },
      {
        titular: "Tus huesos son los ahorros del calcio.",
        claves: ["El hueso guarda el calcio", "Si falta, lo cede a la sangre", "A la larga se debilita"],
        texto: <>El calcio es imprescindible para que funcionen los músculos, los nervios y el corazón. Si la sangre necesita más calcio y no lo obtiene de la alimentación, el organismo lo extrae de los huesos. Durante años, este proceso puede debilitarlos si no se repone adecuadamente.</>,
      },
      {
        titular: "La osteoporosis empieza mucho antes de la primera fractura.",
        claves: ["Se debilitan sin síntomas", "La fractura avisa tarde", "Prevén desde joven"],
        texto: <>Los huesos pueden perder densidad durante años sin producir ningún síntoma. Cuando aparece la primera fractura, la enfermedad suele llevar mucho tiempo desarrollándose. Algunos estudios aseguran que tiene sus comienzos en la menopausia. Mantener una buena alimentación y hacer ejercicio de fuerza desde joven es la mejor forma de prevenirla.</>,
      },
      {
        titular: "Nunca es tarde para fortalecer tus huesos.",
        claves: ["Máxima masa a los 30", "Responden toda la Vida", "Moverte hoy es invertir"],
        texto: <>Aunque alcanzamos el máximo de masa ósea alrededor de los 30 años, los huesos siguen respondiendo al ejercicio durante toda la Vida. Moverte hoy sigue siendo una inversión para el esqueleto de mañana.</>,
      },
    ] },
  { key: "sangre",    label: "Sangre",    foto: "/recorrido/fisiologia/organos/sangre.png",    hotspot: { top: 40, left: 76 }, celulas: pick("eritrocitos", "plaquetas", "neutrofilos", "eosinofilos", "basofilos", "monocitos", "macrofagos", "linfocitos-b", "linfocitos-t", "dendriticas"),
    descripcion: <>Es un órgano líquido que conecta todo tu cuerpo. Transporta oxígeno, nutrientes y hormonas, retira los desechos y lleva a tu ejército de defensas allí donde haga falta. Es la red que hace que todo funcione como un solo sistema.</>,
    consejos: [
      {
        titular: "Tu sangre es un órgano líquido.",
        claves: ["Transporta oxígeno y nutrientes", "Lleva defensas y hormonas", "Conecta todo el cuerpo"],
        texto: <>La sangre no solo transporta oxígeno. Lleva nutrientes, hormonas, células inmunitarias y recoge los desechos que producen tus órganos. Es la red que conecta todas las partes del cuerpo y permite que trabajen como un solo sistema.</>,
      },
      {
        titular: "Tus glóbulos rojos viven solo cuatro meses.",
        claves: ["Transportan oxígeno con hemoglobina", "No pueden repararse", "Se renuevan cada ~120 días"],
        texto: <>Los eritrocitos transportan oxígeno gracias a una proteína llamada hemoglobina. Como no tienen núcleo, no pueden repararse cuando envejecen. Después de unos 120 días son retirados por el bazo y el hígado y sustituidos por otros nuevos fabricados en la médula ósea.</>,
      },
      {
        titular: "Tus huesos esconden una fábrica de sangre.",
        claves: ["La médula ósea fabrica sangre", "Rojos, blancos y plaquetas", "Trabaja toda la Vida"],
        texto: <>En la infancia, casi todos los huesos contienen médula ósea roja, el tejido que fabrica las células sanguíneas. Con la edad, parte de esa médula se transforma en médula amarilla, rica en grasa. Aun así, la médula roja que permanece en la pelvis, las vértebras, las costillas o el esternón sigue produciendo glóbulos rojos, glóbulos blancos y plaquetas durante toda la Vida.</>,
      },
      {
        titular: "El hierro no da energía… permite fabricarla.",
        claves: ["El hierro forma la hemoglobina", "Transporta el oxígeno", "Sin él llega el cansancio"],
        texto: <>Muchas personas creen que el hierro «da energía». En realidad, su función principal es formar parte de la hemoglobina, la molécula que transporta el oxígeno. Sin suficiente hierro, llega menos oxígeno a las células y estas producen menos energía, por eso aparece el cansancio.</>,
      },
      {
        titular: "Tu sistema inmunitario nunca duerme.",
        claves: ["Los glóbulos blancos patrullan", "Buscan virus y bacterias", "Te defienden sin notarlo"],
        texto: <>Millones de glóbulos blancos patrullan constantemente la sangre y los tejidos buscando virus, bacterias o células dañadas. La mayoría de las veces eliminan estas amenazas sin que llegues a darte cuenta de que estaban ahí.</>,
      },
      {
        titular: "La inflamación también puede ser un problema.",
        claves: ["Sirve para reparar y defender", "Crónica, daña los órganos", "Favorece enfermedades graves"],
        texto: <>La inflamación es una herramienta esencial para reparar tejidos y combatir infecciones. Pero si permanece activada durante meses o años, empieza a dañar los propios órganos y favorece enfermedades como la diabetes, la aterosclerosis o algunos tipos de cáncer.</>,
      },
      {
        titular: "Las plaquetas son los primeros albañiles del cuerpo.",
        claves: ["Llegan a la herida en segundos", "Forman el tapón", "Atraen a las reparadoras"],
        texto: <>Cuando te haces una herida, las plaquetas llegan en segundos y forman un tapón para evitar que sigas perdiendo sangre. Después liberan señales que atraen a otras células encargadas de reparar el tejido dañado.</>,
      },
      {
        titular: "Tu sangre también reparte los mensajes.",
        claves: ["Las hormonas viajan por la sangre", "Solo el receptor las lee", "Coordinan órganos lejanos"],
        texto: <>Las hormonas viajan por la sangre como cartas con una dirección muy concreta. Cuando llegan a un órgano, solo las células que tienen el «buzón» adecuado, llamado receptor, pueden leer el mensaje y responder. Así se coordinan órganos que están muy alejados entre sí.</>,
      },
      {
        titular: "La sangre no siempre es roja.",
        claves: ["El oxígeno cambia su tono", "Arterial brillante, venosa oscura", "Nunca es azul"],
        texto: <>Los glóbulos rojos contienen hemoglobina, una proteína rica en hierro que cambia ligeramente de color según transporte o no oxígeno. Por eso la sangre arterial es de un rojo más brillante y la venosa de un rojo más oscuro. Aunque las venas parezcan azules bajo la piel, la sangre que circula por ellas sigue siendo roja.</>,
      },
      {
        titular: "Donar sangre activa la fábrica.",
        claves: ["Donar avisa a los riñones", "La médula fabrica más", "Se recupera en semanas"],
        texto: <>Después de una donación, el organismo detecta que ha perdido parte de su sangre y los riñones producen más eritropoyetina, una hormona que estimula la médula ósea para fabricar nuevos glóbulos rojos. En pocas semanas, el volumen de sangre y las células perdidas vuelven a recuperarse. Una sola donación puede ayudar a salvar varias Vidas.</>,
      },
    ] },
  { key: "conectivo", label: "Tejido conectivo (colágeno)", foto: "/recorrido/fisiologia/organos/conectivo.png", hotspot: { top: 70, left: 57 }, celulas: pick("fibroblastos", "mastocito"),
    descripcion: <>Es el pegamento y la estructura de tu cuerpo. El colágeno da forma y resistencia a la piel, los tendones, los huesos y los vasos, mientras sus células fabrican y reparan ese andamiaje durante toda la Vida.</>,
    consejos: [
      {
        titular: "El colágeno es el pegamento de tu cuerpo.",
        claves: ["La proteína más abundante", "Forma piel, tendones y vasos", "Sin él, todo se desmonta"],
        texto: <>El colágeno es la proteína más abundante del organismo. Forma la estructura de la piel, los tendones, los ligamentos, los huesos, los vasos sanguíneos e incluso muchos órganos. Sin él, tu cuerpo literalmente se desmontaría.</>,
      },
      {
        titular: "Los péptidos de colágeno despiertan a tus fibroblastos.",
        claves: ["Se digiere en pequeños péptidos", "Avisan a los fibroblastos", "Tu cuerpo fabrica más"],
        texto: <>Cuando digieres colágeno, parte de él se rompe en pequeños péptidos que pueden llegar a la sangre. Algunos de estos péptidos actúan como una señal para los fibroblastos, estimulándolos para fabricar más colágeno… siempre que dispongan de los nutrientes necesarios, especialmente vitamina C. El colágeno que comes no va directamente a tu piel: ayuda a que sea tu propio cuerpo quien produzca más.</>,
      },
      {
        titular: "La vitamina C es imprescindible para fabricar colágeno.",
        claves: ["Los fibroblastos la necesitan", "Sin ella, tejido frágil", "Su falta causa escorbuto"],
        texto: <>Los fibroblastos necesitan vitamina C para unir correctamente las fibras de colágeno. Sin ella, el tejido conectivo pierde resistencia y las heridas cicatrizan peor. De hecho, el escorbuto, una enfermedad causada por la falta de vitamina C, provoca sangrado de encías, heridas que no cicatrizan y una gran fragilidad del tejido conectivo.</>,
      },
      {
        titular: "El azúcar también envejece el colágeno.",
        claves: ["El azúcar se pega al colágeno", "Lo vuelve rígido (glicación)", "Envejece piel y arterias"],
        texto: <>Cuando la glucosa permanece elevada durante mucho tiempo, puede unirse al colágeno formando enlaces que vuelven las fibras más rígidas y menos elásticas. Este proceso, llamado glicación, contribuye al envejecimiento de la piel, las arterias y muchos otros tejidos.</>,
      },
      {
        titular: "Tus fibroblastos trabajan toda la Vida.",
        claves: ["El colágeno se renueva", "Fabrican fibras nuevas", "Un trabajo lento y constante"],
        texto: <>El colágeno no dura para siempre. Los fibroblastos fabrican continuamente nuevas fibras mientras otras células eliminan las viejas o dañadas. Es un proceso lento, pero constante, que permite mantener resistentes los tejidos.</>,
      },
      {
        titular: "El ejercicio también fortalece tu tejido conectivo.",
        claves: ["Tendones que responden al esfuerzo", "Fibras más fuertes", "El reposo largo debilita"],
        texto: <>Los tendones, los ligamentos y otras estructuras de colágeno responden al esfuerzo igual que los músculos. Cuando entrenas de forma progresiva, los fibroblastos producen fibras más fuertes y mejor organizadas. El reposo absoluto prolongado hace justo lo contrario: el tejido conectivo pierde resistencia.</>,
      },
      {
        titular: "Dormir también reconstruye el colágeno.",
        claves: ["Al dormir baja el cortisol", "Sube la hormona reparadora", "Los fibroblastos reconstruyen"],
        texto: <>Mientras duermes, el organismo cambia de un estado de actividad a uno de reparación. Disminuyen hormonas relacionadas con el estrés, como el cortisol, aumenta la liberación de hormona del crecimiento y se activan procesos de reparación en muchos tejidos. Es durante este tiempo cuando los fibroblastos aprovechan para sintetizar parte del nuevo colágeno que necesitarán la piel, los tendones y los ligamentos para recuperarse del desgaste diario.</>,
      },
      {
        titular: "El Sol también rompe el colágeno.",
        claves: ["La UV activa enzimas cortantes", "Destruye más de lo que repones", "Causa arrugas y flacidez"],
        texto: <>La radiación ultravioleta no solo daña el ADN de las células de la piel. También activa unas enzimas llamadas metaloproteinasas, cuya función es cortar las fibras de colágeno dañadas. El problema aparece cuando la exposición solar es excesiva: se destruye colágeno más rápido de lo que los fibroblastos pueden reemplazarlo. Ese desequilibrio es una de las principales causas de las arrugas y la pérdida de firmeza de la piel.</>,
      },
    ] },
  { key: "grasa",     label: "Tejido graso", foto: "/recorrido/fisiologia/organos/grasa.png",   hotspot: { top: 44, left: 60 }, celulas: pick("adipocitos-blancos", "adipocitos-marrones"),
    descripcion: <>No es solo una reserva de energía: es un órgano activo. Protege, aísla del frío y fabrica hormonas que hablan con tu cerebro sobre el hambre y la energía que tienes almacenada. Bien cuidado, es un gran aliado.</>,
    consejos: [
      {
        titular: "La grasa debería ser un aliado.",
        claves: ["Almacena energía", "Protege y aísla del frío", "Fabrica leptina, habla al cerebro"],
        texto: <>El tejido adiposo almacena energía para cuando el cuerpo la necesita. Además, protege órganos, ayuda a mantener la temperatura corporal y fabrica hormonas como la leptina, que informa al hipotálamo de cuánta energía tenemos almacenada y ayuda a regular el apetito. A partir de esa información, el cerebro ajusta el metabolismo, el gasto energético e incluso parte de la respuesta inmunitaria. Sin grasa, simplemente no podríamos vivir.</>,
      },
      {
        titular: "Tus células de grasa también hablan con tu cerebro.",
        claves: ["La leptina informa de las reservas", "Ayuda a controlar el apetito", "El exceso engaña al cerebro"],
        texto: <>Los adipocitos producen una hormona llamada leptina, que informa al cerebro sobre cuánta energía tiene almacenada el organismo. Cuando este sistema funciona bien, ayuda a controlar el apetito. Sin embargo, el exceso de grasa durante años puede hacer que el cerebro deje de responder correctamente a esta señal, un fenómeno conocido como resistencia a la leptina. El resultado es que seguimos sintiendo hambre aunque tengamos reservas de energía de sobra.</>,
      },
      {
        titular: "No toda la grasa es igual.",
        claves: ["Blanca almacena, marrón quema", "La marrón produce calor", "Frío y ejercicio la potencian"],
        texto: <>La grasa blanca almacena energía para el futuro. En cambio, la grasa marrón hace justo lo contrario: quema esa energía para producir calor. Los recién nacidos tienen mucha grasa marrón para mantener su temperatura, aunque los adultos también conservamos pequeñas cantidades. Además, ciertos hábitos pueden hacer que parte de la grasa blanca adquiera características similares a la grasa marrón, un proceso llamado «browning». Estas células desarrollan más mitocondrias, las pequeñas centrales energéticas de la célula. ¿Por qué una célula fabricaría más mitocondrias? Porque necesita producir más energía. La exposición al frío y el ejercicio físico favorecen este proceso y aumentan la capacidad del organismo para generar calor y consumir energía.</>,
      },
      {
        titular: "Adelgazar no elimina tus células de grasa.",
        claves: ["Los adipocitos no desaparecen", "Solo se vacían y encogen", "Se rellenan con facilidad"],
        texto: <>Cuando pierdes peso, los adipocitos no suelen desaparecer: simplemente se vacían y reducen su tamaño. Si vuelves a consumir más energía de la que necesitas, esas mismas células volverán a llenarse con facilidad.</>,
      },
      {
        titular: "El exceso de comida rompe células.",
        claves: ["Adipocitos que crecen y mueren", "Provocan inflamación crónica", "Favorecen resistencia a la insulina"],
        texto: <>Cuando el tejido adiposo acumula mucha más grasa de la que puede almacenar de forma saludable, los adipocitos aumentan tanto de tamaño que algunos dejan de recibir suficiente oxígeno y terminan muriendo. Al romperse, liberan su contenido y desencadenan una respuesta del sistema inmunitario. Los macrófagos acuden para eliminar esos restos, pero si la situación se mantiene durante años, el tejido adiposo permanece inflamado de forma crónica. Esa inflamación favorece la resistencia a la insulina y aumenta el riesgo de enfermedades cardiovasculares. Además, los macrófagos cargados de colesterol y grasas también participan en la formación de las placas de ateroma que estrechan las arterias.</>,
      },
      {
        titular: "Hacer ejercicio también cambia tu grasa.",
        claves: ["Las mioquinas «amarronan» la grasa", "El tejido gasta más energía", "Libera grasa como combustible"],
        texto: <>Cuando haces ejercicio, los músculos liberan moléculas llamadas mioquinas que favorecen que parte de la grasa blanca adquiera características similares a la grasa marrón. Este proceso hace que el tejido adiposo consuma más energía y mejore el metabolismo. Además, durante el ejercicio prolongado, los triglicéridos almacenados en el tejido adiposo se descomponen en ácidos grasos, que sirven como combustible para los músculos y otros órganos. El hígado también puede transformar parte de esos ácidos grasos en cuerpos cetónicos, especialmente durante ayunos prolongados o ejercicios de muy larga duración.</>,
      },
      {
        titular: "Dormir poco también favorece ganar grasa.",
        claves: ["Altera el hambre y la saciedad", "Aumenta el apetito", "Descansar cuida el peso"],
        texto: <>Dormir menos de lo necesario altera hormonas como la leptina y la grelina, aumentando el apetito y haciendo que resulte más difícil sentirse saciado. Además, el cansancio reduce el gasto energético y favorece elegir alimentos más calóricos. Por eso descansar bien también ayuda a mantener un peso saludable.</>,
      },
      {
        titular: "El problema no es la grasa… es dónde se acumula.",
        claves: ["La subcutánea es menos dañina", "La visceral inflama", "Su ubicación importa"],
        texto: <>La grasa situada bajo la piel suele ser mucho menos perjudicial que la grasa que rodea órganos como el hígado, el páncreas o el intestino. Esta grasa visceral libera más moléculas inflamatorias directamente hacia la circulación que llega al hígado, favoreciendo la resistencia a la insulina, el hígado graso y la alteración del metabolismo. Con el tiempo aumenta el riesgo de diabetes tipo 2, hipertensión, enfermedad cardiovascular e incluso algunos tipos de cáncer. No toda la grasa tiene el mismo impacto sobre la salud: su localización importa tanto como su cantidad.</>,
      },
    ] },
  { key: "lengua",    label: "Lengua",         foto: "/recorrido/fisiologia/organos/lengua.png",   hotspot: { top: 16, left: 50 }, celulas: pick("gustativa-tipo2", "gustativa-tipo3", "soporte-gusto", "basal-gusto"),
    descripcion: <>Es un órgano muscular ágil, cubierto de papilas que albergan los botones del gusto. Dentro de ellos, unas células especializadas detectan los cinco sabores —dulce, salado, ácido, amargo y umami— y envían la señal al cerebro. Además de saborear, la lengua mezcla y empuja los alimentos para tragarlos y es esencial para hablar.</>,
    consejos: [
      {
        titular: "Ráspate la lengua: una práctica tradicional del Ayurveda.",
        claves: ["Elimina bacterias y restos", "Mejora el aliento", "Mejor al despertar"],
        texto: <>Raspar la lengua una vez al día ayuda a eliminar bacterias, restos de alimentos y células muertas que se acumulan en su superficie, especialmente al despertar. Esta sencilla rutina puede mejorar el aliento y contribuir a una mejor higiene bucal. La evidencia científica actual indica que sus beneficios se deben principalmente a la eliminación de la placa lingual y los microorganismos acumulados.</>,
      },
      {
        titular: "La lengua tiene huellas únicas.",
        claves: ["Patrón único como una huella", "Posible identificación biométrica", "Única en cada persona"],
        texto: <>Al igual que las huellas dactilares, cada lengua posee un patrón de líneas y surcos exclusivo que la diferencia de cualquier otra. Esta característica ha despertado el interés de los científicos, quienes han investigado su posible uso como método de identificación biométrica. Aunque todavía no se emplea de forma habitual, demuestra lo sorprendente y única que es esta parte de nuestro cuerpo.</>,
      },
      {
        titular: "La lengua es un conjunto de músculos muy potente.",
        claves: ["No es uno, son ocho músculos", "Hablar, tragar y masticar", "Flexible y resistente"],
        texto: <>Aunque muchas personas piensan que la lengua es un solo músculo, en realidad está formada por ocho músculos que trabajan de manera coordinada. Gracias a ellos podemos hablar, masticar, tragar e incluso respirar correctamente. Su gran flexibilidad y resistencia la convierten en una de las partes más importantes del cuerpo para realizar actividades cotidianas.</>,
      },
      {
        titular: "La lengua puede detectar cinco sabores principales.",
        claves: ["Cinco sabores básicos", "Toda la lengua los detecta", "El olfato completa el sabor"],
        texto: <>Las papilas gustativas de la lengua nos permiten reconocer los sabores dulce, salado, ácido, amargo y umami. Durante mucho tiempo se creyó que cada sabor se percibía en una zona específica, pero hoy sabemos que casi toda la lengua puede detectar todos ellos. Además, el olfato juega un papel fundamental para disfrutar plenamente del sabor de los alimentos.</>,
      },
      {
        titular: "La lengua se regenera constantemente.",
        claves: ["Renueva sus células sin parar", "Cicatriza muy rápido", "Protege las papilas"],
        texto: <>La superficie de la lengua renueva sus células de forma continua, lo que permite que pequeñas heridas o irritaciones cicatricen con rapidez. Este proceso de regeneración ayuda a mantener sanas las papilas gustativas y protege la boca frente a bacterias y otros agentes externos. Una buena higiene bucal es esencial para conservar la lengua en buen estado.</>,
      },
      {
        titular: "La lengua es esencial para comunicarnos.",
        claves: ["Forma casi todos los sonidos", "Trabaja con labios y dientes", "Hace posible hablar"],
        texto: <>Hablar sería prácticamente imposible sin la lengua, ya que interviene en la formación de la mayoría de los sonidos del lenguaje. Trabaja junto con los labios, los dientes y el paladar para articular las palabras con claridad. Gracias a su precisión y rapidez de movimiento, podemos expresar ideas, emociones y comunicarnos con las demás personas cada día.</>,
      },
    ] },
  { key: "bazo",      label: "Bazo",           foto: "/recorrido/fisiologia/organos/bazo.png",     hotspot: { top: 38, left: 57 }, celulas: pick("macrofago-esplenico", "pulpa-blanca"),
    descripcion: <>Es el gran filtro de la sangre. En su pulpa roja, los macrófagos retiran los glóbulos rojos viejos o dañados y reciclan su hierro; en su pulpa blanca vigila la sangre en busca de infecciones, como un ganglio linfático conectado directamente al torrente sanguíneo. También guarda una reserva de células defensivas lista para actuar.</>,
    consejos: [
      {
        titular: "El bazo es el mayor órgano del sistema linfático.",
        claves: ["El mayor órgano linfático", "Bajo las costillas izquierdas", "Filtra y defiende"],
        texto: <>Aunque muchas personas apenas saben dónde está, el bazo es el órgano más grande del sistema linfático. Se encuentra en la parte superior izquierda del abdomen, justo debajo de las costillas. Su función principal es ayudar al sistema inmunitario a combatir infecciones y filtrar la sangre. Además, participa en la producción y almacenamiento de algunas células de defensa del organismo.</>,
      },
      {
        titular: "Actúa como un filtro natural de la sangre.",
        claves: ["Retira glóbulos rojos viejos", "Recicla el hierro", "Vigila buscando microbios"],
        texto: <>El bazo revisa constantemente la sangre para eliminar glóbulos rojos envejecidos o dañados y reciclar componentes como el hierro. En él vive parte del sistema inmunitario que revisa el torrente sanguíneo buscando bacterias, virus y otros microorganismos. Gracias a este proceso, ayuda a mantener la sangre en buen estado y refuerza las defensas del cuerpo frente a posibles infecciones.</>,
      },
      {
        titular: "Puede almacenar una reserva de sangre.",
        claves: ["Guarda una reserva de sangre", "La libera en emergencias", "Un depósito de refuerzo"],
        texto: <>Una de las funciones menos conocidas del bazo es que actúa como un pequeño depósito de sangre. En determinadas situaciones, como una hemorragia importante o un esfuerzo físico intenso, puede liberar parte de esa reserva para ayudar al organismo. Esta capacidad es mucho más desarrollada en algunos animales, pero también existe en los seres humanos.</>,
      },
      {
        titular: "Se puede vivir sin bazo.",
        claves: ["Otros órganos lo suplen", "Se puede vivir sin él", "Más riesgo de infecciones"],
        texto: <>Aunque el bazo desempeña funciones muy importantes, es posible vivir sin él. Cuando debe extirparse por una lesión o enfermedad, otros órganos, como el hígado y los ganglios linfáticos, asumen parte de su trabajo. Sin embargo, las personas sin bazo tienen un mayor riesgo de sufrir ciertas infecciones, por lo que suelen necesitar vacunas específicas y algunas precauciones adicionales.</>,
      },
      {
        titular: "El bazo cambia de tamaño según las necesidades del cuerpo.",
        claves: ["Crece cuando trabaja más", "Unos 12 cm normalmente", "Su tamaño varía"],
        texto: <>El tamaño del bazo no siempre es el mismo. Puede aumentar temporalmente durante algunas infecciones, enfermedades de la sangre o problemas hepáticos, ya que trabaja más intensamente para filtrar la sangre y activar la respuesta inmunitaria. En condiciones normales mide alrededor de 12 centímetros, pero su tamaño puede variar según la edad, la constitución física y el estado de salud de cada persona.</>,
      },
    ] },
  { key: "vesicula",  label: "Vesícula biliar", foto: "/recorrido/fisiologia/organos/vesicula.png", hotspot: { top: 36, left: 41 }, celulas: pick("colangiocito-vesicula", "muscular-vesicula"),
    descripcion: <>Es una pequeña bolsa situada bajo el hígado que guarda y concentra la bilis entre comidas. Cuando comes grasa, se contrae y libera esa bilis al intestino para ayudar a digerirla y a absorber las vitaminas liposolubles. Trabaja en equipo con el hígado y el páncreas dentro del sistema digestivo.</>,
    consejos: [
      {
        titular: "La vesícula biliar es un pequeño almacén de bilis.",
        claves: ["Guarda y concentra la bilis", "Situada bajo el hígado", "La suelta al comer grasa"],
        texto: <>Aunque es un órgano pequeño, la vesícula biliar cumple una función muy importante en la digestión. Se encuentra debajo del hígado y su principal tarea es almacenar y concentrar la bilis que este produce. Cuando comemos alimentos, especialmente grasas, libera esa bilis hacia el intestino para facilitar la digestión y la absorción de los nutrientes.</>,
      },
      {
        titular: "La bilis ayuda a digerir las grasas.",
        claves: ["No produce bilis, la almacena", "Rompe las grasas", "Ayuda a absorber vitaminas"],
        texto: <>La vesícula no produce bilis, sino que la guarda hasta que el cuerpo la necesita. La bilis actúa como un detergente natural que descompone las grasas en partículas más pequeñas, permitiendo que las enzimas digestivas las procesen con mayor facilidad. Gracias a este proceso, el organismo puede absorber vitaminas esenciales como la A, D, E y K.</>,
      },
      {
        titular: "Se puede vivir sin vesícula biliar.",
        claves: ["No es indispensable", "El hígado sigue dando bilis", "A veces se adapta la dieta"],
        texto: <>Aunque la vesícula facilita la digestión, no es un órgano indispensable para vivir. Si debe extirparse por cálculos o inflamación, el hígado sigue produciendo bilis, que pasa directamente al intestino. La mayoría de las personas pueden llevar una Vida normal después de la cirugía, aunque algunas necesitan adaptar su alimentación durante un tiempo.</>,
      },
      {
        titular: "Los cálculos biliares son muy frecuentes.",
        claves: ["El colesterol forma «piedras»", "Muchos sin síntomas", "Otros, dolor o cirugía"],
        texto: <>Una de las enfermedades más comunes de la vesícula son los cálculos biliares, también conocidos como «piedras». Se forman cuando algunos componentes de la bilis, como el colesterol, se endurecen y crean pequeñas acumulaciones. Muchas personas nunca presentan síntomas, pero en otros casos pueden provocar dolor intenso, inflamación o la necesidad de una intervención quirúrgica.</>,
      },
      {
        titular: "La vesícula se contrae cada vez que comes grasas.",
        claves: ["La CCK ordena la contracción", "Expulsa la bilis al comer", "Mejor con grasa insaturada"],
        texto: <>Cada vez que ingerimos alimentos ricos en grasa, el intestino libera una hormona llamada colecistoquinina. Esta hormona envía la señal para que la vesícula se contraiga y expulse la bilis almacenada. Es un proceso automático que ocurre varias veces al día y que resulta esencial para que la digestión de las grasas sea eficiente. Se ha demostrado que se contrae mejor cuando dicha grasa es insaturada, una prueba de que el cuerpo responde mejor a las moléculas que mayor beneficio le aportan.</>,
      },
    ] },
];

// Universo de células alcanzables desde la galería (para el contador de progreso).
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

// Tarjeta de órgano (estilo «Pokédex»): ilustración, nombre, "3/8 células" y
// barra de progreso. Se resalta cuando el ratón pasa por su punto en el cuerpo
// (y al revés) para que ambas formas de navegar estén sincronizadas.
function OrganoCard({
  organo,
  vistas,
  onClick,
}: {
  organo: Organo;
  vistas: Set<string>;
  onClick: () => void;
}) {
  const [imgErr, setImgErr] = useState(false);
  const total = organo.celulas.length;
  const hechas = organo.celulas.filter((c) => vistas.has(c.id)).length;
  const completo = total > 0 && hechas === total;
  const pct = total ? Math.round((hechas / total) * 100) : 0;

  return (
    <Box
      as="button"
      onClick={onClick}
      textAlign="left"
      position="relative"
      overflow="hidden"
      display="flex"
      flexDirection="column"
      w="100%"
      h="100%"
      borderRadius="2xl"
      border={completo ? `1px solid ${fisiologiaTxt}aa` : `1px solid ${fisiologiaTxt}33`}
      cursor="pointer"
      fontFamily="'EB Garamond', serif"
      boxShadow={completo
        ? `0 4px 18px rgba(0,0,0,0.22), 0 0 22px ${fisiologiaTxt}66`
        : `0 4px 18px rgba(0,0,0,0.22), 0 0 16px ${fisiologiaTxt}26`}
      transition="all 0.22s ease"
      _hover={{
        transform: "translateY(-4px)",
        borderColor: `${fisiologiaTxt}88`,
        boxShadow: `0 10px 30px rgba(0,0,0,0.3), 0 0 26px ${fisiologiaTxt}55`,
      }}
      _active={{ transform: "translateY(-1px)" }}
    >
      <DisciplinaBgLayer nom={fisiologiaNom} borderRadius="2xl" />

      {/* Sello de "órgano completo" */}
      {completo && (
        <Flex position="absolute" top="9px" right="9px" zIndex={2} align="center" justify="center"
              w="24px" h="24px" borderRadius="full" bg={fisiologiaTxt}
              boxShadow={`0 0 10px ${fisiologiaTxt}, 0 1px 4px rgba(0,0,0,0.5)`}>
          <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" w="14px" h="14px" fill="#1a1226">
            <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
          </Box>
        </Flex>
      )}

      {/* Foto del órgano a sangre en la parte de arriba (como en Sistemas). */}
      <Box position="relative" zIndex={1} w="100%" aspectRatio={1} overflow="hidden" flexShrink={0}
           bg={`${fisiologiaTxt}14`}>
        {!imgErr && (
          <Image src={encodeURI(organo.foto)} alt={organo.label} w="100%" h="100%" objectFit="cover"
                 onError={() => setImgErr(true)} />
        )}
      </Box>

      {/* Línea separadora a todo el ancho. */}
      <Box position="relative" zIndex={1} h="1px" bg={`${fisiologiaTxt}33`} flexShrink={0} />

      {/* Pie: nombre + progreso. */}
      <Flex direction="column" position="relative" zIndex={1} flex="1" gap={{ base: 2, md: 2.5 }}
            px={{ base: 3.5, md: 4 }} py={{ base: 3, md: 3.5 }}>
        <Text color={fisiologiaTxt} fontWeight="700" fontSize={{ base: "md", md: "xl" }} textAlign="center"
              lineHeight="1.2" letterSpacing="0.02em"
              style={{ textShadow: "0 1px 4px rgba(0,0,0,0.6)" }}>
          {organo.label}
        </Text>
        <Flex direction="column" gap={2} mt="auto">
          <Text color={`${fisiologiaTxt}cc`} fontSize={{ base: "2xs", md: "sm" }} fontWeight={700}
                textAlign="center" letterSpacing="0.04em"
                style={{ textShadow: "0 1px 3px rgba(0,0,0,0.6)" }}>
            {total > 0 ? `${hechas}/${total} células` : "próximamente"}
          </Text>
          {total > 0 && (
            <Box w="100%" h="7px" borderRadius="full" bg="rgba(255,255,255,0.18)" overflow="hidden">
              <Box h="100%" borderRadius="full" w={`${pct}%`} transition="width 0.5s ease"
                   bgGradient={`linear(to-r, ${fisiologiaTxt}, #ffffff)`} boxShadow={`0 0 10px ${fisiologiaTxt}`} />
            </Box>
          )}
        </Flex>
      </Flex>
    </Box>
  );
}

// Flecha redonda del carrusel de células. Cuando no hay más hacia ese lado se
// muestra desactivada (atenuada y sin click), para no engañar al usuario.
function CarouselArrow({ dir, onClick, disabled }: { dir: "left" | "right"; onClick: () => void; disabled: boolean }) {
  const left = dir === "left";
  return (
    <Box
      as="button"
      aria-label={left ? "Anterior" : "Siguiente"}
      aria-disabled={disabled}
      onClick={disabled ? undefined : onClick}
      flexShrink={0}
      display="flex"
      alignItems="center"
      justifyContent="center"
      w={{ base: "34px", md: "40px" }}
      h={{ base: "34px", md: "40px" }}
      borderRadius="full"
      bg="rgba(0,0,0,0.42)"
      border={`1px solid ${fisiologiaTxt}${disabled ? "44" : "aa"}`}
      color="#fff"
      cursor={disabled ? "default" : "pointer"}
      opacity={disabled ? 0.35 : 1}
      pointerEvents={disabled ? "none" : "auto"}
      transition="all 0.18s"
      sx={{ backdropFilter: "blur(4px)" }}
      _hover={disabled ? undefined : { bg: "rgba(0,0,0,0.62)", borderColor: fisiologiaTxt }}
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

// Flecha para navegar entre los consejos (uno visible cada vez).
function ConsejoArrow({ dir, onClick }: { dir: "left" | "right"; onClick: () => void }) {
  const left = dir === "left";
  return (
    <Box
      as="button"
      aria-label={left ? "Consejo anterior" : "Consejo siguiente"}
      onClick={onClick}
      flexShrink={0}
      display="flex"
      alignItems="center"
      justifyContent="center"
      w={{ base: "32px", md: "38px" }}
      h={{ base: "32px", md: "38px" }}
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
           w={{ base: "18px", md: "22px" }} h={{ base: "18px", md: "22px" }} fill="#fff"
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
  // Si aún queda contenido a izq/der (para activar/desactivar cada flecha).
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  const update = () => {
    const el = scroller.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 2);
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 2);
  };

  // Recalcular al montar, al cambiar de órgano y al redimensionar la ventana.
  useEffect(() => { update(); }, [celulas]);
  useEffect(() => {
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const scrollByCard = (dir: number) => {
    const el = scroller.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-celula-card]");
    const step = card ? card.offsetWidth + GAP : el.clientWidth;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  const hasOverflow = canLeft || canRight; // si no hay scroll posible, no hay flechas

  return (
    <Flex align="center" gap={{ base: 1.5, md: 3 }} w="100%">
      {hasOverflow && <CarouselArrow dir="left" disabled={!canLeft} onClick={() => scrollByCard(-1)} />}
      <Flex
        ref={scroller}
        onScroll={update}
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
      {hasOverflow && <CarouselArrow dir="right" disabled={!canRight} onClick={() => scrollByCard(1)} />}
    </Flex>
  );
}

// Ficha de detalle del órgano a pantalla completa (sustituye a la galería al
// pulsar una tarjeta). Apilado: (0) volver, (1) foto + título + descripción,
// (2) sus células en línea (carrusel), (3) un consejo a la vez.
function OrganoDetalle({
  organo,
  vistas,
  onCelula,
  onConsejo,
  consejosLeidos,
  onBack,
}: {
  organo: Organo;
  vistas: Set<string>;
  onCelula: (c: Celula) => void;
  onConsejo: (c: Consejo) => void;
  consejosLeidos: Set<string>;
  onBack: () => void;
}) {
  const [imgErr, setImgErr] = useState(false);
  // Índice del consejo visible (se ve uno cada vez y se navega con flechas).
  const [consejoIdx, setConsejoIdx] = useState(0);
  useEffect(() => { setImgErr(false); setConsejoIdx(0); }, [organo.key]);

  const vistasOrgano = organo.celulas.filter((c) => vistas.has(c.id)).length;
  const organoCompleto = organo.celulas.length > 0 && vistasOrgano === organo.celulas.length;

  const consejos = organo.consejos ?? [];
  const idx = consejos.length ? Math.min(consejoIdx, consejos.length - 1) : 0;
  const consejoActual = consejos.length ? consejos[idx] : null;
  const consejoLeido = !!consejoActual && consejosLeidos.has(consejoActual.titular);
  const prevConsejo = () => setConsejoIdx((i) => (i - 1 + consejos.length) % consejos.length);
  const nextConsejo = () => setConsejoIdx((i) => (i + 1) % consejos.length);

  return (
    /* Los tres boxes de la ficha se limitan al mismo ancho que la cabecera
       (850px), a diferencia de la cuadrícula de tarjetas, que llega a 1100px. */
    <Flex direction="column" gap={{ base: 5, md: 6 }} w="100%" maxW="850px" mx="auto">
      {/* 0 · Volver a la galería — fondo con la foto de Fisiología */}
      <Box as="button" onClick={onBack} alignSelf="flex-start"
           position="relative" overflow="hidden"
           display="inline-flex" alignItems="center" gap={2}
           px={{ base: 4, md: 5 }} py={2} borderRadius="full"
           border="none"
           cursor="pointer" transition="all 0.2s"
           boxShadow={CAJA_GLOW}
           _hover={{ transform: "translateY(-1px)", boxShadow: `0 0 22px ${fisiologiaTxt}3a, 0 0 52px ${fisiologiaTxt}20` }}>
        <DisciplinaBgLayer nom={fisiologiaNom} borderRadius="full" overlay={`${fisiologiaBg}66`} />
        <Box as="svg" position="relative" zIndex={1} xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"
             w={{ base: "18px", md: "20px" }} h={{ base: "18px", md: "20px" }} fill={fisiologiaTxt}>
          <path d="M560-240 320-480l240-240 56 56-184 184 184 184-56 56Z" />
        </Box>
        <Text position="relative" zIndex={1} color={fisiologiaTxt} fontSize={{ base: "sm", md: "md" }} fontWeight={700} letterSpacing="0.04em"
              style={{ textShadow: `0 1px 4px ${fisiologiaBg}, 0 0 8px ${fisiologiaBg}` }}>
          Volver
        </Text>
      </Box>

      {/* 1 · Foto (izquierda) + título + descripción (derecha) */}
      <FisioBox>
        <Flex direction={{ base: "column", md: "row" }} align="center" gap={{ base: 4, md: 7 }}
              px={{ base: 6, md: 8 }} py={{ base: 6, md: 8 }}>
          <Box
            flexShrink={0}
            w={{ base: "190px", md: "240px" }}
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
            <Text color={fisiologiaTxt} fontSize={{ base: "sm", md: "md" }} lineHeight="1.7"
                  mt={{ base: 1, md: 2 }} fontStyle={organo.descripcion ? "normal" : "italic"}
                  style={{ textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}>
              {organo.descripcion ?? `Descripción del ${organo.label.toLowerCase()} (próximamente).`}
            </Text>
          </Flex>
        </Flex>
      </FisioBox>

      {/* 2 · Células en línea (carrusel, sin caja ni título) */}
      {organo.celulas.length > 0 ? (
        <CelulasCarousel celulas={organo.celulas} vistas={vistas} onCelula={onCelula} />
      ) : (
        <Text color={`${fisiologiaTxt}dd`} fontSize={{ base: "md", md: "lg" }} fontStyle="italic"
              textAlign="center" style={{ textShadow: "0 1px 6px rgba(0,0,0,0.5)" }}>
          Pronto podrás explorar las células de este órgano.
        </Text>
      )}

      {/* 3 · Consejos: un titular a la vez (sin título de sección), con flechas */}
      <FisioBox>
        <Box px={{ base: 4, md: 6 }} py={{ base: 6, md: 8 }}>
          {consejoActual && (
            <Flex justify="space-between" align="center" mb={{ base: 2, md: 3 }} minH="20px">
              {/* Marca de curiosidad ya leída */}
              {consejoLeido ? (
                <Flex align="center" gap={1.5} color={fisiologiaTxt}
                      style={{ textShadow: "0 1px 4px rgba(0,0,0,0.6)" }}>
                  <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"
                       w="15px" h="15px" fill="currentColor">
                    <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
                  </Box>
                  <Text fontSize={{ base: "2xs", md: "xs" }} fontWeight={700} letterSpacing="0.08em" textTransform="uppercase">
                    Leída
                  </Text>
                </Flex>
              ) : <Box />}
              {consejos.length > 1 && (
                <Text color={`${fisiologiaTxt}bb`} fontSize={{ base: "2xs", md: "xs" }} fontWeight={700} letterSpacing="0.06em">
                  {idx + 1} / {consejos.length}
                </Text>
              )}
            </Flex>
          )}

          {consejoActual ? (
            <Flex align="center" gap={{ base: 2, md: 4 }}>
              {consejos.length > 1 && <ConsejoArrow dir="left" onClick={prevConsejo} />}

              <Flex flex="1" minW={0} direction="column" align="center" gap={{ base: 4, md: 5 }} textAlign="center">
                <Flex align="center" justify="center" minH={{ base: "64px", md: "76px" }}>
                  <Text color={fisiologiaTxt} fontSize={{ base: "xl", md: "2xl" }} fontWeight="700"
                        lineHeight="1.35" style={{ textShadow: "0 1px 6px rgba(0,0,0,0.55)" }}>
                    {consejoActual.titular}
                  </Text>
                </Flex>
                <Box as="button" onClick={() => onConsejo(consejoActual)} flexShrink={0}
                     display="inline-flex" alignItems="center" gap={1.5}
                     px={{ base: 6, md: 7 }} py={2.5} borderRadius="full"
                     bg={fisiologiaTxt} color={fisiologiaBg}
                     fontFamily="'EB Garamond', serif" fontWeight="700" fontSize={{ base: "sm", md: "md" }}
                     letterSpacing="0.04em" cursor="pointer" transition="all 0.2s"
                     boxShadow={`0 0 14px ${fisiologiaTxt}55`}
                     _hover={{ transform: "translateY(-1px)", boxShadow: `0 0 22px ${fisiologiaTxt}88` }}>
                  {consejoLeido ? "Leer de nuevo →" : "Leer más →"}
                </Box>
              </Flex>

              {consejos.length > 1 && <ConsejoArrow dir="right" onClick={nextConsejo} />}
            </Flex>
          ) : (
            <Box w="100%" minH={{ base: "80px", md: "96px" }}
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
    </Flex>
  );
}

export default function MetodoFisiologiaTodasCelulas() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  // Mientras precargamos las fotos del órgano que se acaba de abrir (foto grande
  // + todas las fotos de sus células), mostramos el spinner: la ficha del órgano
  // no aparece hasta que TODO esté descargado.
  const [organoLoading, setOrganoLoading] = useState(false);
  // "galeria" = cuerpo-navegador + cuadrícula de órganos; "detalle" = ficha del
  // órgano a pantalla completa (como una Pokédex).
  const [vista, setVista] = useState<"galeria" | "detalle">("galeria");
  const [organo, setOrgano] = useState<Organo>(ORGANOS[0]);
  const [celula, setCelula] = useState<Celula | null>(null);
  const [consejo, setConsejo] = useState<Consejo | null>(null);
  const [vistas, setVistas] = useState<Set<string>>(new Set());
  const [curiosidadesLeidas, setCuriosidadesLeidas] = useState<Set<string>>(new Set());
  const { extra: celulasBtn, modal: celulasModal } = useTusCelulas();
  const dataRef = useRef<Record<string, any>>({});

  // Abre la ficha de un órgano (pantalla completa). No la mostramos hasta que
  // TODAS sus fotos (la del órgano + la de cada una de sus células) estén
  // descargadas: mientras tanto, spinner a pantalla completa.
  const abrirOrgano = async (o: Organo) => {
    setOrganoLoading(true);
    setOrgano(o);
    window.scrollTo({ top: 0, behavior: "auto" });
    await precargarImagenes([
      encodeURI(o.foto),
      ...o.celulas.map((c) => encodeURI(c.foto)),
    ]);
    setVista("detalle");
    setOrganoLoading(false);
    window.scrollTo({ top: 0, behavior: "auto" });
  };
  const volverGaleria = () => {
    setVista("galeria");
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");
    if (!userId || !token) { navigate("/welcome"); return; }
    (async () => {
      try {
        const me = await axios.get(`${API_URL}/user/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!me.data?.fisiologia_suscrito) { navigate("/metodo/fisiologia"); return; }

        // Cargamos las células ya descubiertas para retomar el camino.
        try {
          const r = await axios.get(`${API_URL}/metodo-fisiologia/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          dataRef.current = r.data?.data ?? {};
          const guardadas: string[] = dataRef.current?.[VISTAS_KEY] ?? [];
          if (Array.isArray(guardadas) && guardadas.length) setVistas(new Set(guardadas));
          const leidas: string[] = dataRef.current?.[CURIOSIDADES_KEY] ?? [];
          if (Array.isArray(leidas) && leidas.length) setCuriosidadesLeidas(new Set(leidas));
        } catch { /* sin fila todavía */ }

        // No mostramos la página hasta que TODAS las fotos de los órganos estén
        // descargadas, para que la cuadrícula no se rellene de golpe después.
        await precargarImagenes(ORGANOS.map((o) => encodeURI(o.foto)));
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

  // Abre una curiosidad y la marca como leída (se guarda en BD). Se usa tanto al
  // pulsar «Leer más» como al navegar con las flechas dentro del modal.
  const verConsejo = (c: Consejo) => {
    setConsejo(c);
    if (curiosidadesLeidas.has(c.titular)) return;
    const next = new Set(curiosidadesLeidas);
    next.add(c.titular);
    setCuriosidadesLeidas(next);
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");
    if (!userId || !token) return;
    const data = { ...dataRef.current, [CURIOSIDADES_KEY]: Array.from(next) };
    dataRef.current = data;
    axios.patch(`${API_URL}/metodo-fisiologia/${userId}`, { data }, {
      headers: { Authorization: `Bearer ${token}` },
    }).catch(() => { /* se reintenta la próxima vez */ });
  };

  const vistasTotal = UNIVERSO.filter((id) => vistas.has(id)).length;
  const pct = TOTAL_CELULAS ? Math.round((vistasTotal / TOTAL_CELULAS) * 100) : 0;

  if (loading || organoLoading) {
    return <FisiologiaLoading />;
  }

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif" sx={noSelectSx}>
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 12, md: 16 }}>
        <Flex direction="column" align="center" w="100%" maxW="1100px" gap={7}>

          <Reveal direction="down" distance={16} duration={0.6} w="100%" display="flex" justifyContent="center">
            <MetodoStepHeader
              icon={<FisiologiaIcon size={{ base: "40px", md: "56px" }} />}
              title="Las células de tus órganos"
              pageLabel="2/4"
              compact
              bgColor={`${fisiologiaBg}dd`}
              color={fisiologiaTxt}
              nom={fisiologiaNom}
              mb={0}
              prev={{ label: "← Célula", onClick: () => navigate("/metodo/fisiologia/celula") }}
              extra={celulasBtn}
              next={{ label: "Sistemas →", onClick: () => navigate("/metodo/fisiologia/sistemas") }}
            />
          </Reveal>

          {vista === "galeria" ? (
            <>

              {/* Barra de progreso global: el usuario siente que recorre un camino que se guarda */}
              <Reveal direction="up" distance={14} delay={0.12} duration={0.55} w="100%" display="flex" justifyContent="center">
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

              {/* ── Cuadrícula de tarjetas de órgano (Pokédex) — entran en cascada ── */}
              <RevealStagger
                stagger={0.06}
                delayChildren={0.15}
                w="100%"
                display="grid"
                gridTemplateColumns={{ base: "repeat(2, 1fr)", md: "repeat(3, 1fr)" }}
                gap={{ base: 4, md: 6 }}
              >
                {ORGANOS.map((o) => (
                  <RevealItem key={o.key} direction="up" distance={22} scaleFrom={0.97} display="flex">
                    <OrganoCard organo={o} vistas={vistas} onClick={() => abrirOrgano(o)} />
                  </RevealItem>
                ))}
              </RevealStagger>
            </>
          ) : (
            /* ── Ficha del órgano a pantalla completa ── */
            <Reveal key={organo.key} direction="up" distance={18} duration={0.5} w="100%">
              <OrganoDetalle organo={organo} vistas={vistas} onCelula={verCelula}
                             onConsejo={verConsejo} consejosLeidos={curiosidadesLeidas}
                             onBack={volverGaleria} />
            </Reveal>
          )}
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
          consejos={organo.consejos}
          onSelect={verConsejo}
        />
      )}

      {celulasModal}
      <IndiceFisiologia />
      <BotonCompania color={fisiologiaTxt} bgColor={fisiologiaBg} disciplinaNom={fisiologiaNom} />
      <SiteFooter />
    </Box>
  );
}
