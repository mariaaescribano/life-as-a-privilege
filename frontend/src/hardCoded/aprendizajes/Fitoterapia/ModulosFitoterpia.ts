import type { Detalles, ModuloContenido } from "../../../dtos/aprendizaje.type";
import { RecursosIconFitoterpia, fitoterapiaBg, FitoterapiaIcon, fitoterapiaTxt, fitoterapiaNom } from "../../../GlobalVariables";

const detalles: Detalles = { color: fitoterapiaTxt, icon: FitoterapiaIcon, bgColor: fitoterapiaBg };

const basePath = "/aprendizaje/videoLessonPage/" + fitoterapiaNom;

export const modulosFitoterapia: ModuloContenido[] = [
  {
    title: "Recursos",
    icon: RecursosIconFitoterpia,
    submodules: [
      {
        id:"ft1",
        nom: "Recursos a tu disposición",
        link:`/recursos/`+fitoterapiaNom,
        linkAnterior:"",
        linkNext:"",
        descripcion:"",
        video:"-w67yUcj_SM",
        letra: "",
        cursoId: "fito-curso-1",
      detalles: detalles,
        icon: null
      },
    ],
  },
  {
  title: "Plantas",
  icon: FitoterapiaIcon,
  submodules: [
    {
      id: "ftP1",
      nom: "Perejil",
      link: `${basePath}/ftP1`,
      linkAnterior: "",
      linkNext: `${basePath}/ftP2`,
      descripcion: "Planta depurativa rica en vitaminas que apoya la salud renal, circulatoria e inmunitaria.",
      letra: "El perejil no solo está delicioso, sino que es una de las plantas más depurativas que existen, por ello nos ayuda al funcionamiento del riñón y al proceso natural de eliminación de toxinas del cuerpo. Está lleno de nutrientes, especialmente vitamina C, vitamina K y antioxidantes, lo que ayuda a fortalecer el sistema inmunitario y a proteger las células del daño oxidativo. Se ha visto que puede favorecer la circulación y la salud cardiovascular, por lo que puede ser un excelente complemento en la alimentación diaria.",
      video: "tUB4apNjgcY",
      cursoId: "fito-curso-1",
      detalles: detalles,
      icon: FitoterapiaIcon
    },
    {
      id: "ftP2",
      nom: "Manzanilla",
      link: `${basePath}/ftP2`,
      linkAnterior: `${basePath}/ftP1`,
      linkNext: `${basePath}/ftP3`,
      descripcion: "Planta digestiva y calmante con propiedades antiinflamatorias y relajantes.",
      letra: "La Manzanilla ha sido usada a lo largo de la historia como remedio natural para ayudar en las digestiones, además de como ofrenda para Dioses como Isis y Ra. La Manzanilla es especialmente beneficiosa para cualquier tipo de dolor, gracias a sus propiedades antiinflamatorias y relajantes musculares, lo que la hace muy útil para molestias digestivas, menstruales o tensionales. Es rica en antioxidantes naturales, lo que ayuda a proteger a las células del envejecimiento prematuro y a reforzar las defensas del organismo de forma suave y constante. No solo esto, sino que es cicatrizante y calma irritaciones, también actúa como calmante del sistema nervioso, ayudando a reducir el estrés y favoreciendo el descanso nocturno, aunque al ser tan versátil, se puede usar todos los días como infusión o como parte del cuidado de la piel.",
      video: "uuFbrCorj7Y",
      cursoId: "fito-curso-1",
      detalles: detalles,
      icon: FitoterapiaIcon
    },
    {
      id: "ftP3",
      nom: "Orégano",
      link: `${basePath}/ftP3`,
      linkAnterior: `${basePath}/ftP2`,
      linkNext: `${basePath}/ftP4`,
      descripcion: "Antibacteriano natural que mejora la digestión y fortalece el sistema inmunitario.",
      letra: "El orégano no sólo da un sabor increíble a los platos, sino que tiene propiedades que pueden transformar nuestro estado físico. Los griegos ya sabían esto, dado que la palabra orégano viene de su vocabulario, y significa \"alegría de oro\". El orégano es un potente antibacteriano y antifúngico, ayuda en la digestión, reduce la inflamación intestinal y favorece el equilibrio de la microbiota, lo que significa que fortalece a nuestras células y refuerza al sistema inmunitario. Incluso se ha visto que puede bajar el colesterol LDL, conocido como colesterol malo, y ayuda a incrementar el bueno, el HDL, lo que contribuye a la salud cardiovascular. También contiene compuestos fenólicos y aceites esenciales que ayudan a proteger el organismo contra virus y bacterias, además de estimular el metabolismo de forma natural.",
      video: "NFft0FeeVnE",
      cursoId: "fito-curso-1",
      detalles: detalles,
      icon: FitoterapiaIcon
    },
    {
      id: "ftP4",
      nom: "Tomillo",
      link: `${basePath}/ftP4`,
      linkAnterior: `${basePath}/ftP3`,
      linkNext: `${basePath}/ftP5`,
      descripcion: "Potente antibacteriano que apoya la digestión, la inmunidad y la energía natural.",
      letra: "El tomillo es la planta más antibacteriana de todas, no solo eso, sino que también nos ayuda en la digestión y en el cuidado de la piel. Al ser tan protector es capaz de inhibir el crecimiento de la candidiasis y del helicobacter pylori, la bacteria asociada a las úlceras. El tomillo está lleno de antioxidantes, entre ellos polifenoles, lo que hace que refuerce al sistema inmunitario y proteja a nuestras células del estrés oxidativo. Se ha visto que es capaz de estimular tanto como el café o el té, por lo que puede ser un buen sustituto natural para aumentar la energía de forma más equilibrada.",
      video: "xF0HvXVkMYY",
      cursoId: "fito-curso-1",
      detalles: detalles,
      icon: FitoterapiaIcon
    },
    {
      id: "ftP5",
      nom: "Laurel",
      link: `${basePath}/ftP5`,
      linkAnterior: `${basePath}/ftP4`,
      linkNext: `${basePath}/ftP6`,
      descripcion: "Planta digestiva y protectora con propiedades antimicrobianas y respiratorias.",
      letra: "El laurel es una planta muy valorada que desde la antigüedad era símbolo de victoria y protección, además se usaba en la cocina y en remedios naturales para la digestión. El laurel ayuda a mejorar la digestión de las comidas pesadas y a reducir la inflamación abdominal. No solo esto, sino que también tiene propiedades antimicrobianas y antioxidantes, lo que ayuda a proteger al organismo de bacterias y del desgaste celular. También se usa para despejar las vías respiratorias, ayudando así a calmar nuestra mente y a recuperarnos antes de un resfriado.",
      video: "YY2EP3FoBj0",
      cursoId: "fito-curso-1",
      detalles: detalles,
      icon: FitoterapiaIcon
    },
    {
      id: "ftP6",
      nom: "Canela",
      link: `${basePath}/ftP6`,
      linkAnterior: `${basePath}/ftP5`,
      linkNext: `${basePath}/ftP7`,
      descripcion: "Especia reguladora del azúcar en sangre con efecto antiinflamatorio y estimulante.",
      letra: "La canela es una de las especias más antiguas y apreciadas del mundo, no solo por su sabor dulce y cálido, sino también por sus potentes propiedades medicinales. La canela dado su alto contenido en fibra, ayuda a regular los niveles de azúcar en sangre, mejorando la sensibilidad a la insulina. Además, es antiinflamatoria y antibacteriana, lo que contribuye a la protección del sistema inmunitario y al equilibrio de la microbiota. También se ha visto que puede estimular la circulación sanguínea, ayudando así a mantener una buena temperatura corporal. Se ha demostrado que su aroma tiene efectos estimulantes en el estado de ánimo, ayudándonos así a estar más concentrados y contentos.",
      video: "-4PgvcvE_k0",
      cursoId: "fito-curso-1",
      detalles: detalles,
      icon: FitoterapiaIcon
    },
    {
      id: "ftP7",
      nom: "Jengibre",
      link: `${basePath}/ftP7`,
      linkAnterior: `${basePath}/ftP6`,
      linkNext: `${basePath}/ftP8`,
      descripcion: "Raíz antiinflamatoria que mejora la digestión, la circulación y la energía natural.",
      letra: "El jengibre es una de las raíces más poderosas de la naturaleza, usada desde hace miles de años en medicina para tratar problemas digestivos y respiratorios. El jengibre mejora la digestión, favoreciendo el movimiento natural del intestino y aliviando la sensación de pesadez estomacal. También es un potente antiinflamatorio, lo que lo hace útil para el dolor muscular y articular, además de reducir nuestra inflamación interna. Está lleno de antioxidantes y compuestos bioactivos, lo que ayuda a reforzar el sistema inmunitario y a proteger a las células del daño oxidativo. Incluso se ha visto que puede mejorar la circulación sanguínea y aportarnos energía natural. Es un versátil complemento para cualquier comida, pruébalo y verás qué rápido te encuentras mejor.",
      video: "Fprj4svcHOc",
      cursoId: "fito-curso-1",
      detalles: detalles,
      icon: FitoterapiaIcon
    },
    {
      id: "ftP8",
      nom: "Pimienta",
      link: `${basePath}/ftP8`,
      linkAnterior: `${basePath}/ftP6`,
      linkNext: `${basePath}/ftP9`,
      descripcion: "Especia antioxidante que activa el metabolismo y mejora la absorción de nutrientes.",
      letra: "La pimienta tiene un sabor delicioso, pero además mejora y activa nuestro metabolismo, incrementa nuestra capacidad cognitiva y nos ayuda a mejorar la digestión, favoreciendo la absorción de nutrientes. Está llena de compuestos antioxidantes y antimicrobianos, lo que ayuda a proteger las células del daño oxidativo. Úsalo diariamente y verás como tu bienestar solo va en aumento.",
      video: "HXqVq14MM6U",
      cursoId: "fito-curso-1",
      detalles: detalles,
      icon: FitoterapiaIcon
    },
    {
      id: "ftP9",
      nom: "Cúrcuma",
      link: `${basePath}/ftP9`,
      linkAnterior: `${basePath}/ftP8`,
      linkNext: "",
      descripcion: "Especia antiinflamatoria y antioxidante que apoya la salud hepática y cognitiva.",
      letra: "La cúrcuma es una de las especias más estudiadas, valorada por su potente acción antiinflamatoria. La cúrcuma ayuda a reducir la inflamación crónica del organismo, lo que contribuye a que nuestro cuerpo funcione eficientemente, aportando bienestar en todos los sistemas. También es un potente antioxidante, ayudando a proteger las células del desgaste. Favorece a la salud del hígado, ayudando en los procesos naturales de desintoxicación del cuerpo. Además, se ha visto que aumenta nuestro rendimiento cognitivo, ayudándonos a ser más productivos y felices. Su sabor no es muy fuerte, lo que permite que la puedas incluir hasta en la sopa! Pruébala y prepárate para mejorar tu bienestar.",
      video: "QRgp0yhtCoc",
      cursoId: "fito-curso-1",
      detalles: detalles,
      icon: FitoterapiaIcon
    }
  ]
}
];
