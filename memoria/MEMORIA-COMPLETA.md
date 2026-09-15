<!--
  ─────────────────────────────────────────────────────────────────────────
  MEMORIA DEL TRABAJO FIN DE GRADO · Life as a Privilege
  Estructura según el «Libro de Estilos para la presentación de memorias del
  TFG/TFM» de la EPS (Universidad de Alicante) y la Guía para el desarrollo
  de TFG de José Vicente Berná (v. 2022.08.30).

  CÓMO USAR ESTE FICHERO
  · Cada apartado de nivel 1 («# Título») empieza en PÁGINA NUEVA al pasarlo
    a Word. Los de nivel 2 van seguidos, sin salto.
  · Los bloques marcados «[FIGURA n]» y «[TABLA n]» son los huecos donde hay
    que insertar la imagen o la tabla; el pie ya está escrito.
  · Los textos entre corchetes en MAYÚSCULAS son datos que hay que completar
    (nombre, tutor, fechas de convocatoria).
  ─────────────────────────────────────────────────────────────────────────
-->

# Portada

**Life as a Privilege**

Diseño y desarrollo de una plataforma web de autoconocimiento guiado a través de ocho disciplinas

Grado en Ingeniería Multimedia

Trabajo Fin de Grado

Autor: [NOMBRE Y APELLIDOS]

Tutor/es: [NOMBRE DEL TUTOR]

Universitat d'Alacant · Universidad de Alicante

[MES] [AÑO]

---

# Resumen

Vivimos rodeados de contenido sobre bienestar y autoconocimiento y, sin embargo, cada vez es más difícil aprender algo con orden. Las redes sociales ofrecen fragmentos sin contexto; las aplicaciones de meditación ofrecen sesiones sueltas; las aplicaciones de astrología ofrecen predicciones automáticas que nadie explica. Falta lo intermedio: un camino largo, guiado y honesto en el que una persona no consuma contenido, sino que construya su propio material a partir de lo que va descubriendo sobre sí misma.

*Life as a Privilege* es una plataforma web que responde a esa carencia. Está organizada en ocho disciplinas —Astrología, Psicología, Ayurveda, Medicina Tradicional China, Fisiología, Nutrición, Cábala y Cultura— y cada una de ellas contiene un «Recorrido»: una secuencia de pasos encadenados en los que el usuario lee, responde, se pone a prueba y obtiene al final un documento propio. No es un curso que se ve: es un mapa que se rellena.

El resultado técnico es una aplicación de una sola página (*Single Page Application*) construida con React y TypeScript, con una API REST desarrollada sobre NestJS y persistencia en PostgreSQL a través de Supabase. La aplicación calcula en el servidor la carta natal completa de cada usuario a partir de efemérides astronómicas reales, genera documentos PDF personalizados en el propio navegador, gestiona el cobro independiente de cada disciplina mediante Stripe y sirve un catálogo multimedia de casi dos mil ilustraciones propias organizadas en cómics, galerías y presentaciones imprimibles.

El trabajo aborda además tres problemas de ingeniería que no eran evidentes al principio y que han condicionado buena parte del diseño. El primero es la **persistencia de recorridos largos**: cada disciplina guarda un único documento JSONB por usuario, lo que permite añadir pasos nuevos sin migrar la base de datos, pero obliga a blindar la lectura frente a datos guardados con formas antiguas. El segundo es el **peso multimedia**: el proyecto maneja 275 MB de ilustraciones, lo que ha exigido una canalización propia de conversión a WebP y de compresión de vídeo para no agotar el ancho de banda del servicio de despliegue. El tercero es la **responsabilidad sobre el contenido**: cuatro de las ocho disciplinas pertenecen a tradiciones que no son ciencia, y la plataforma se diseñó desde el principio para presentarlas como historia y como herramienta de introspección, nunca como diagnóstico ni como alternativa a la atención sanitaria.

A fecha de entrega, el sistema suma 541 versiones registradas, algo más de 218 000 líneas de código propio repartidas en 839 ficheros TypeScript, 187 rutas públicas y privadas y ocho recorridos completos con 114 pantallas de contenido guiado. La aplicación está desplegada y en funcionamiento.

**Palabras clave:** autoconocimiento, aplicación web, React, NestJS, Supabase, carta natal, contenido multimedia, aprendizaje guiado.

## Abstract

We are surrounded by content about wellbeing and self-knowledge and yet learning anything in an orderly way has never been harder. Social media offers fragments without context; meditation apps offer isolated sessions; astrology apps offer automated predictions that nobody explains. What is missing is the middle ground: a long, guided, honest path in which a person does not consume content but builds their own material out of what they discover about themselves.

*Life as a Privilege* is a web platform that answers that gap. It is organised into eight disciplines —Astrology, Psychology, Ayurveda, Traditional Chinese Medicine, Physiology, Nutrition, Kabbalah and Culture— and each one contains a "Journey": a chained sequence of steps in which the user reads, answers, is tested and finally obtains a document of their own. It is not a course to be watched: it is a map to be filled in.

The technical outcome is a Single Page Application built with React and TypeScript, backed by a REST API developed on NestJS with PostgreSQL persistence through Supabase. The application computes each user's complete natal chart on the server from real astronomical ephemerides, generates personalised PDF documents in the browser itself, handles payment for each discipline through Stripe, and serves a multimedia catalogue of nearly two thousand original illustrations arranged as comics, galleries and printable presentations.

The work also tackles three engineering problems that were not obvious at the outset and that have shaped much of the design: the persistence of long journeys, the weight of the multimedia catalogue, and the ethical responsibility of the content itself, since four of the eight disciplines belong to traditions that are not science and were deliberately framed as history and as tools for introspection, never as diagnosis.

At the time of submission the system comprises 541 recorded versions, over 218,000 lines of original code across 839 TypeScript files, 187 public and private routes, and eight complete journeys with 114 guided content screens. The application is deployed and running.

**Keywords:** self-knowledge, web application, React, NestJS, Supabase, natal chart, multimedia content, guided learning.

<!-- RECOMENDADO: añadir también la versión en valenciano (Resum). El Libro de
     Estilos de la EPS recomienda las tres lenguas oficiales de la UA. -->

---

# Motivación, justificación y objetivo general

La idea de este Trabajo de Fin de Grado no nació de una asignatura ni de una lista de temas ofertados, sino de una frustración muy concreta: la de haber pasado años leyendo sobre disciplinas muy distintas —astrología, psicología, nutrición, medicina china, fisiología— y no haber encontrado nunca un sitio donde todo eso estuviera junto, ordenado y contado con honestidad.

Lo que hay disponible se reparte en dos extremos. En uno están las aplicaciones comerciales de bienestar, muy pulidas visualmente, que entregan resultados automáticos sin explicar de dónde salen: se abre la aplicación, aparece un texto sobre tu día y se cierra. En el otro extremo están los manuales académicos, rigurosos pero inabordables para quien solo quiere entenderse un poco mejor. Entre ambos no hay casi nada. Y lo que falta en ese hueco no es más contenido: es **estructura**. Un camino que empiece en algún sitio, que avance en un orden que tenga sentido y que termine con algo en la mano.

Esa es la razón de ser del proyecto. *Life as a Privilege* no pretende enseñar ocho asignaturas: pretende que alguien pueda recorrerlas y salir de cada una con un documento propio —su carta natal explicada, su línea de vida, su mapa de constitución, su día alimentario diseñado— que antes no existía. El título del proyecto resume la tesis: estar vivo y poder dedicar tiempo a entenderse es un privilegio, y merece la pena usarlo con orden.

A eso se suma la motivación técnica. Durante el grado se aprende desarrollo web repartido en piezas: una asignatura de front-end, otra de bases de datos, otra de diseño de interfaces, otra de gestión de proyectos. Rara vez se tiene la ocasión de montar **un sistema entero**, desde la primera consulta a la base de datos hasta el cobro real de un producto y el despliegue en producción. Quería enfrentarme a un proyecto lo bastante grande como para que las decisiones de arquitectura tuvieran consecuencias: que elegir mal un modelo de datos doliera dos meses después, que no pensar el peso de las imágenes se pagara en el ancho de banda del servidor, que no separar bien los componentes obligara a repetir el mismo trabajo ocho veces. Todas esas cosas han pasado, y están documentadas en el capítulo de implementación.

El objetivo general, por tanto, es doble. Por un lado, **diseñar y desarrollar una plataforma web completa, desplegada y utilizable por personas reales**, que permita recorrer ocho disciplinas de autoconocimiento y obtener de cada una un resultado personal y descargable. Por otro, **demostrar la capacidad de llevar un proyecto de gran tamaño de principio a fin**: investigación previa, análisis, diseño, implementación, pruebas, despliegue y mantenimiento, incluyendo las decisiones incómodas —qué se queda fuera, qué se pospone, qué se rehace— que forman parte del oficio y que rara vez aparecen en un ejercicio de clase.

<!-- NOTA PARA LA AUTORÍA: este apartado es, según la guía de la EPS, el único
     que se escribe en primera persona y el único abiertamente personal.
     Está redactado como borrador: conviene reescribir al menos un párrafo con
     la voz propia (la anécdota real de cómo surgió la idea) para que no suene
     a texto de plantilla. -->

---

# Agradecimientos

<!-- Apartado voluntario y completamente personal: no debe pasar de una página.
     Se deja este esqueleto como guía, pero conviene reescribirlo entero. -->

En primer lugar, a mi tutor, [NOMBRE DEL TUTOR], por acompañar un proyecto que durante meses fue demasiado grande para explicarlo en una reunión, y por señalar cada vez que hizo falta la diferencia entre lo que quería hacer y lo que podía terminar.

A mi familia, por sostener los meses en los que este trabajo ocupó todas las horas que había.

A las personas que probaron la aplicación antes de que estuviera lista y que dijeron en voz alta lo que no funcionaba.

Y a todo lo que he leído durante estos años y que aquí, por fin, ha encontrado un sitio donde ordenarse.

---

# Citas

> No sabemos qué hacer con esta vida corta y, sin embargo, queremos otra que sea eterna.
>
> — Anatole France

> Conocerse a uno mismo es el principio de toda sabiduría.
>
> — Atribuido a Aristóteles

> La perfección se alcanza no cuando no hay nada más que añadir, sino cuando no hay nada más que quitar.
>
> — Antoine de Saint-Exupéry

<!-- Sustituir por las citas que de verdad representen el trabajo. La guía pide
     una o varias que demuestren el carácter del proyecto y de quien lo firma. -->

---

# Dedicatoria

A quien encuentre aquí un sitio donde empezar.

---

# Índice de contenidos

<!-- GENERAR EN WORD: Referencias > Tabla de contenido. Requiere que todos los
     títulos usen los estilos «Título 1», «Título 2» y «Título 3». -->

# Índice de figuras

<!-- GENERAR EN WORD: Referencias > Insertar tabla de ilustraciones > rótulo «Figura». -->

# Índice de tablas

<!-- GENERAR EN WORD: Referencias > Insertar tabla de ilustraciones > rótulo «Tabla». -->
# 1. Introducción

El mercado del bienestar digital mueve hoy más dinero que nunca. Las aplicaciones de salud mental, meditación, hábitos y autoconocimiento se cuentan por decenas de miles en las tiendas de aplicaciones, y algunas de ellas —Calm, Headspace, Co–Star— han alcanzado valoraciones de cientos de millones de euros. Al mismo tiempo, y a pesar de esa abundancia, las encuestas sobre bienestar subjetivo no mejoran. Hay más contenido disponible que nunca y, sin embargo, la sensación generalizada es la de estar consumiendo fragmentos sueltos que no llegan a formar nada.

La razón es, en buena medida, estructural. El contenido sobre autoconocimiento se distribuye hoy por tres canales, y los tres empujan hacia la fragmentación:

- **Las redes sociales.** El formato dominante —un vídeo corto, una imagen con texto— premia la frase que se recuerda, no el razonamiento que la sostiene. Una persona puede pasar meses viendo contenido sobre apego, doshas o índice glucémico sin llegar nunca a entender de dónde salen esos conceptos ni cómo se relacionan entre sí.
- **Las aplicaciones comerciales de bienestar.** Funcionan por sesiones sueltas: una meditación de diez minutos, un horóscopo diario, un ejercicio de respiración. Están diseñadas para la visita recurrente y breve, no para el recorrido largo. Y en el caso concreto de las aplicaciones de astrología, la mayoría entrega textos generados automáticamente sin explicar en ningún momento qué es una casa astrológica, qué es un aspecto o por qué el resultado dice lo que dice.
- **La formación reglada y los manuales.** Son rigurosos, pero están pensados para quien va a dedicarse profesionalmente a la materia. Su puerta de entrada es demasiado alta para quien simplemente quiere entenderse mejor.

Entre el vídeo de treinta segundos y el manual de seiscientas páginas hay un hueco enorme, y ese hueco es el que ocupa este Trabajo de Fin de Grado.

## 1.1. Qué es Life as a Privilege

*Life as a Privilege* es una plataforma web de autoconocimiento guiado. Su unidad básica no es la lección ni la sesión: es **el Recorrido**, una secuencia larga de pasos encadenados dentro de una disciplina, en la que el usuario avanza leyendo, respondiendo y poniéndose a prueba, y de la que sale con un documento propio.

La plataforma contiene ocho disciplinas, que el usuario puede abrir en el orden que quiera:

1. **Astrología** — la carta natal propia, calculada a partir de la fecha, hora y lugar de nacimiento, y explicada planeta a planeta, casa a casa y aspecto a aspecto.
2. **Psicología** — la línea de vida, el genograma familiar, los cuestionarios ACE y DES-II, y el mapa personal de huellas, nudos y heridas.
3. **Ayurveda** — el test de constitución (*doṣha*), el recorrido del doṣha resultante y los siete chakras.
4. **Medicina Tradicional China** — los cinco elementos, el test de constitución, los ciclos, la lectura de la lengua, el taoísmo y el qigong.
5. **Fisiología** — el viaje desde la partícula hasta el organismo, pasando por átomos, moléculas, células y sistemas.
6. **Nutrición** — los nutrientes, el plato, el cálculo de necesidades calóricas y el diseño del día alimentario propio.
7. **Cábala** — el Árbol de la Vida, las diez sefirot, los senderos y el diagnóstico personal.
8. **Cultura** — la historia universal, la historia de las religiones, de la filosofía y de la medicina, organizadas en eras y sub-hitos.

Cada disciplina se adquiere por separado y de forma independiente: no hay un camino obligatorio ni una suscripción global, como refleja la página de bienvenida de la Figura 1, donde las ocho aparecen como iguales alrededor del usuario. A esto se suma una capa pública —ilustraciones, cursos, materiales descargables, programas, un estudio estadístico abierto sobre astrología— accesible sin necesidad de haber comprado nada.

![Página de bienvenida con los ocho círculos de disciplina](figuras/fig01-bienvenida-ocho-disciplinas.png)

*Figura 1. Página de bienvenida: las ocho disciplinas, sin orden obligatorio. Los candados indican las disciplinas todavía no adquiridas.*
*(Fuente propia)*

## 1.2. Qué lo diferencia

Tres decisiones de producto separan esta plataforma de lo que ya existe y condicionan todo el desarrollo posterior:

**El usuario produce, no consume.** Al final de cada recorrido hay un artefacto que antes no existía: un PDF con la carta natal explicada, una línea de vida cronológica, un mapa de constitución, un día alimentario diseñado. El valor no está en el contenido que se lee, sino en el documento que queda.

**Se explica de dónde salen las cosas.** La carta natal no se descarga de un servicio externo: se calcula en el servidor a partir de efemérides astronómicas reales, con tablas de orbes documentadas y con el sistema de casas explicitado. La historia de cada disciplina —quién la inventó, en qué siglo, qué afirmaba y qué de eso ha resistido— forma parte del recorrido y no de un anexo.

**Se dice lo que cada cosa es.** Cuatro de las ocho disciplinas —astrología, cábala, ayurveda y medicina china— no son ciencia. La plataforma las trata como lo que son: sistemas simbólicos con miles de años de historia, útiles como espejo y como vocabulario para hablar de uno mismo, y en ningún caso sustitutos de un diagnóstico médico. Las otras cuatro —psicología, fisiología, nutrición y cultura— se apoyan en literatura científica y se presentan como tales. Esta distinción no es un descargo legal añadido al final: es un criterio de diseño que aparece en el capítulo 12 y que llegó a modificar el material comercial del proyecto.

## 1.3. Alcance del trabajo

Este Trabajo de Fin de Grado cubre el ciclo completo de desarrollo de la plataforma: la investigación previa sobre el sector y las tecnologías disponibles, el análisis y especificación de requisitos, el diseño de la persistencia, la arquitectura, la interacción y la interfaz, la implementación iterativa a lo largo de ocho meses, las pruebas, el despliegue en producción y el análisis de resultados.

Queda fuera del alcance la creación del contenido textual e ilustrado de las ocho disciplinas en tanto que obra editorial —aunque su producción, organización y encaje técnico sí forman parte del trabajo, y de hecho constituyen uno de los problemas de ingeniería más costosos del proyecto, como se detalla en los capítulos 9 y 11.

## 1.4. Estructura de la memoria

El capítulo 2 estudia la viabilidad del proyecto mediante un análisis DAFO, un lienzo Lean Canvas y un análisis de riesgos con sus planes de prevención y contingencia. El capítulo 3 presenta la planificación temporal. El capítulo 4 recoge el estado del arte: el análisis de las soluciones existentes y la comparativa de tecnologías candidatas. El capítulo 5 fija los objetivos siguiendo el principio SMART y el capítulo 6 describe la metodología de trabajo. El capítulo 7 contiene el análisis y la especificación de requisitos según el estándar IEEE 830. El capítulo 8, el más extenso, recoge todo el diseño del sistema. El capítulo 9 documenta la implementación, organizada en las ocho iteraciones reales del proyecto. Los capítulos 10 y 11 presentan las pruebas y los resultados. El capítulo 12 aborda las consideraciones éticas y el 13 las conclusiones y las líneas de trabajo futuro.
# 2. Estudio de viabilidad

Antes de escribir una sola línea de código conviene comprobar si el proyecto tiene sentido: si resuelve un problema real, si hay alguien dispuesto a pagar por ello, si se puede sostener con los recursos disponibles y qué puede salir mal por el camino. Este capítulo recoge ese estudio mediante tres herramientas: un análisis DAFO, un lienzo Lean Canvas y un análisis de riesgos con planes de prevención y contingencia.

El estudio se justifica porque *Life as a Privilege* no es un encargo: es una propuesta propia que compite en un mercado ya poblado y que, además, pretende monetizarse. Si el análisis hubiera indicado que el producto no era diferenciable o que el coste de producción del contenido lo hacía inviable, el proyecto habría tenido que reducirse a una sola disciplina.

## 2.1. Análisis DAFO

### Fortalezas (origen interno, positivo)

- **Contenido propio y original.** Los textos, las ilustraciones y los cómics son producción propia. No se depende de licencias de terceros ni de bancos de imágenes, lo que elimina el riesgo legal y proporciona una identidad visual imposible de replicar rápidamente.
- **Profundidad real.** Ocho disciplinas con recorridos largos y encadenados, frente a la sesión suelta de la competencia. Un usuario que complete Psicología habrá recorrido veintiséis pantallas de trabajo personal.
- **Cálculo propio, no delegado.** La carta natal se calcula en el servidor con efemérides reales. Esto evita cuotas de API externas, permite explicar el resultado y hace posible que la plataforma funcione aunque cualquier proveedor externo desaparezca.
- **Independencia de cada disciplina.** Al estar desacopladas, se puede publicar una y seguir desarrollando las demás. El producto es vendible desde la primera disciplina terminada.
- **Coste operativo bajo.** Sin servidores propios, sin licencias de pago y con una base de datos gestionada en capa gratuita, el coste fijo mensual es cercano a cero.

### Debilidades (origen interno, negativo)

- **Proyecto de una sola persona.** Diseño, contenido, ilustración, desarrollo, despliegue y soporte recaen en la misma persona. Es el principal cuello de botella y la primera amenaza para la continuidad.
- **Volumen de contenido enorme.** Ocho disciplinas completas suponen un esfuerzo editorial que supera con mucho al de desarrollo. Cada disciplina nueva multiplica el trabajo de mantenimiento.
- **Peso multimedia elevado.** 275 MB de ilustraciones sitúan al proyecto muy cerca del límite de ancho de banda de los planes gratuitos de despliegue.
- **Curva de entrada alta para el usuario.** Un recorrido largo exige un compromiso que el usuario medio de aplicaciones de bienestar no está acostumbrado a dar.
- **Sin validación con usuarios a gran escala.** Las pruebas se han hecho con un grupo reducido.

### Oportunidades (origen externo, positivo)

- **Mercado en crecimiento sostenido.** El sector del bienestar digital sigue creciendo, y dentro de él el nicho de «autoconocimiento con profundidad» está poco atendido.
- **Desgaste del contenido superficial.** Existe un cansancio creciente frente al contenido de redes sin fundamento, que favorece a las propuestas que explican sus fuentes.
- **Canal institucional.** Los ayuntamientos y centros culturales programan talleres de divulgación; el material de la plataforma —presentaciones, programas, podcasts— encaja directamente en esa oferta y abre una vía de ingresos distinta a la venta al usuario final.
- **Reutilización del contenido en varios formatos.** El mismo material da lugar a recorrido, curso, ilustración, presentación imprimible, PDF y vídeo corto, multiplicando su rentabilidad sin multiplicar su coste.

### Amenazas (origen externo, negativo)

- **Competencia con gran capacidad de inversión.** Calm o Headspace pueden replicar una funcionalidad en semanas y promocionarla con presupuestos inalcanzables.
- **Escrutinio sobre contenidos de pseudociencia.** Ofrecer astrología o ayurveda junto a nutrición expone a críticas legítimas si la distinción no es explícita, y en el caso extremo a problemas legales si algún texto pudiera leerse como consejo sanitario.
- **Dependencia de proveedores externos.** Supabase, Stripe y el proveedor de despliegue pueden cambiar precios o condiciones.
- **Normativa de protección de datos.** El recorrido de Psicología recoge información sensible (experiencias adversas en la infancia, síntomas disociativos), lo que sitúa al proyecto en la categoría más exigente del RGPD.

La Figura 2 resume los cuatro cuadrantes. El cruce más revelador es el que forman la debilidad «proyecto de una sola persona» y la oportunidad «reutilización del contenido en varios formatos»: la única forma de que una persona sostenga ocho disciplinas es que cada pieza de contenido sirva para varias cosas a la vez.

[FIGURA 2: matriz DAFO resumida en los cuatro cuadrantes]

*Figura 2. Resumen del análisis DAFO del proyecto.*
*(Fuente propia)*

## 2.2. Lean Canvas

**Problema.** Quien quiere entenderse mejor solo encuentra fragmentos sin contexto o manuales inabordables. Las aplicaciones existentes entregan resultados automáticos sin explicar de dónde salen, y ninguna deja al usuario un material propio al terminar.

*Alternativas actuales:* aplicaciones de horóscopo automático (Co–Star, The Pattern), aplicaciones de meditación por sesiones (Calm, Headspace), cursos en plataformas generalistas (Udemy, Domestika), contenido gratuito de redes sociales y libros de divulgación.

**Segmentos de cliente.** Personas adultas, mayoritariamente entre 25 y 50 años, con interés previo en el autoconocimiento y disposición a dedicarle tiempo. Dentro de ese grupo, los *usuarios visionarios* —quienes adoptan primero— son quienes ya consumen contenido de estas disciplinas y se han quedado con la sensación de no haber aprendido nada ordenado.

Un segundo segmento, secundario pero relevante, lo forman las **entidades públicas y centros culturales** que programan actividades de divulgación y para los que el material ya producido resulta directamente aprovechable.

**Proposición de valor única.** *Un recorrido largo por ocho disciplinas del que sales con un documento tuyo, no con una frase.* La plataforma explica siempre de dónde sale cada resultado y dice con claridad qué es ciencia y qué es tradición.

**Solución.** Ocho recorridos guiados paso a paso, con progreso guardado, tests que producen resultados personales, cómics ilustrados que sustituyen a los muros de texto, y generación de PDF descargables al final de cada tramo.

**Canales.** Web propia, redes sociales con material ilustrado del propio catálogo, boletín de correo para suscriptores, códigos QR impresos en carteles que llevan a la presentación pública de cada disciplina, y propuesta directa a entidades públicas mediante dosier.

**Flujos de ingresos.** Venta independiente de cada recorrido (30 € por disciplina), venta de libros en PDF (5 €), llamadas de acompañamiento individuales (20 € la sesión estándar, 60 € la de acompañamiento del recorrido completo) y, como vía institucional, programas para ayuntamientos.

**Estructura de costes.** Despliegue y base de datos en capas de bajo coste, comisión de la pasarela de pago por transacción, dominio, y el coste real dominante: el **tiempo de producción del contenido**, que es varias veces superior al del desarrollo.

**Métricas clave.** Usuarios registrados, tasa de conversión de registro a compra, porcentaje de usuarios que terminan un recorrido empezado, número de PDF generados y disciplinas compradas por usuario.

**Ventaja especial.** El catálogo de contenido propio ilustrado. Un competidor con más presupuesto puede copiar la funcionalidad en semanas, pero no puede copiar dos mil ilustraciones originales ni la voz con la que están escritos los textos sin volver a producirlos desde cero.

La Figura 3 recoge el lienzo completo.

[FIGURA 3: lienzo Lean Canvas completo del proyecto]

*Figura 3. Lienzo Lean Canvas de Life as a Privilege.*
*(Fuente propia)*

## 2.3. Análisis de riesgos

Un proyecto individual de ocho meses está expuesto a contratiempos que pueden detenerlo por completo. Identificarlos antes de empezar permite preparar respuestas en lugar de improvisarlas.

**Escala de probabilidad**

| Nivel | Significado |
|---|---|
| Alta | Es razonable esperar que ocurra al menos una vez al mes durante el proyecto. |
| Media | Es razonable esperar que ocurra una o dos veces a lo largo del proyecto. |
| Baja | Podría no ocurrir; se estima menos de una vez cada varios años. |

**Escala de gravedad**

| Nivel | Significado |
|---|---|
| Alta | Detiene el proyecto más de una semana o compromete la entrega. |
| Media | Detiene el proyecto entre uno y tres días o exige rehacer trabajo ya hecho. |
| Baja | Supone unas horas de trabajo adicional, sin afectar a la planificación. |

[TABLA 1: análisis de riesgos]

*Tabla 1. Riesgos identificados, planes de prevención y planes de contingencia.*

| ID | Riesgo | Prob. | Grav. | Plan de prevención | Plan de contingencia |
|---|---|---|---|---|---|
| R-01 | Pérdida de código o de la memoria | Baja | Alta | Repositorio Git remoto con envío diario; memoria versionada en el mismo repositorio | Recuperar la última versión del repositorio remoto |
| R-02 | Rotura del equipo de desarrollo | Baja | Alta | Todo el estado del proyecto vive en el repositorio y en servicios gestionados, nada crítico en local | Clonar el repositorio en otro equipo y reinstalar el entorno |
| R-03 | Subestimación del volumen de contenido | **Alta** | **Alta** | Contabilizar el contenido en unidades antes de empezar cada disciplina; scripts propios que listan qué falta | Reducir el alcance: publicar la disciplina con menos pasos y ampliarla después |
| R-04 | Superar el ancho de banda del plan de despliegue | Media | Alta | Conversión sistemática de imágenes a WebP y compresión de vídeo antes de publicar | Servir el material pesado desde almacenamiento externo; subir de plan |
| R-05 | Cambio de condiciones de un proveedor externo | Baja | Media | Aislar cada proveedor tras un módulo propio; no usar funcionalidades exclusivas cuando hay alternativa | Sustituir el proveedor tocando solo su módulo |
| R-06 | Fallo en la pasarela de pago que deje ventas sin acreditar | Media | Alta | Verificación doble: webhook y comprobación explícita al volver del pago; panel de administración con concesión manual de acceso | Conceder el acceso manualmente desde el panel y auditar los pagos |
| R-07 | Desconocimiento de tecnologías nuevas | **Alta** | Media | Dedicar la primera iteración íntegra a montar el entorno y validar la pila tecnológica | Sustituir la pieza problemática por otra conocida antes de que se integre en el resto |
| R-08 | Datos guardados con una forma antigua que rompen la aplicación | **Alta** | Media | Formato JSONB flexible; blindaje defensivo al leer (comprobación de tipos de todos los campos) | Barrera de error global que muestra una pantalla de fallo en lugar de una página en blanco |
| R-09 | Solapamiento con otras asignaturas o con trabajo remunerado | Media | Media | Planificación por iteraciones con margen; trabajo diario constante en lugar de sprints intensivos | Reordenar la planificación y mover disciplinas a trabajo futuro |
| R-10 | Contenido que pueda interpretarse como consejo sanitario | Media | **Alta** | Criterio editorial explícito desde el inicio; revisión de todos los textos de disciplinas no científicas | Retirar o reescribir el texto; el criterio ya está documentado en el capítulo 12 |

Cuatro de estos riesgos llegaron a materializarse durante el desarrollo: R-03, R-04, R-07 y R-08. Su impacto real y la eficacia de los planes previstos se analizan en el capítulo 9.
# 3. Planificación

El proyecto se planteó para la convocatoria de [CONVOCATORIA], con inicio efectivo en febrero de [AÑO]. Eso da un margen de siete meses de trabajo, que a primera vista parece holgado pero que deja de serlo en cuanto se tiene en cuenta un dato del capítulo anterior: en un proyecto como este, el contenido cuesta más que el código.

Por eso la planificación no se organizó por capítulos de la memoria, sino por **iteraciones de producto**. Cada iteración termina con algo que se puede enseñar y, en la mayoría de los casos, con una disciplina entera publicada. La memoria se escribe en paralelo, al cierre de cada iteración, y no al final: es la única forma de poder documentar decisiones intermedias que de otro modo se olvidan.

## 3.1. Criterios de planificación

Tres criterios ordenaron el reparto del tiempo:

**Primero lo que da miedo.** Las piezas con más incertidumbre técnica —el cálculo de la carta natal, la pasarela de pago, la persistencia de recorridos largos— se colocaron lo más pronto posible. Si algo iba a obligar a cambiar de tecnología, era mejor descubrirlo en marzo que en agosto.

**Una disciplina, una iteración.** Al estar desacopladas, cada disciplina podía desarrollarse, publicarse y darse por cerrada de forma independiente. Esto convierte el proyecto en incremental de verdad: en cualquier momento a partir de abril existía una versión entregable.

**Margen para lo imprevisto.** Se reservó explícitamente un mes final sin funcionalidad nueva, dedicado a pruebas, pulido, despliegue y redacción. Ese mes era, de hecho, el plan de contingencia del riesgo R-09.

## 3.2. Planificación temporal

[TABLA 2: planificación temporal]

*Tabla 2. Planificación temporal del Trabajo Fin de Grado.*

| Iteración | Contenidos | Duración | Fecha límite |
|---|---|---|---|
| **0** | Preparación del entorno, validación de la pila tecnológica, esqueleto de la aplicación, autenticación y modelo de usuario. Memoria: motivación, introducción, estudio de viabilidad | 3 semanas | Finales de febrero |
| **1** | Capa pública: portada, páginas informativas, catálogo de cursos, materiales descargables, panel de administración básico. Memoria: estado del arte | 3 semanas | Mediados de marzo |
| **2** | Disciplina 1 · Astrología: cálculo de la carta natal, recorrido completo, PDF de la carta. Memoria: objetivos, metodología, análisis y especificación | 4 semanas | Mediados de abril |
| **3** | Disciplina 2 · Psicología: línea de vida, genograma, cuestionarios ACE y DES-II, mapa personal. Pasarela de pago. Memoria: diseño de la persistencia y de la arquitectura | 5 semanas | Finales de mayo |
| **4** | Disciplina 3 · Ayurveda y disciplina 4 · Medicina China. Sistema común de recorridos, índices y desbloqueo secuencial. Memoria: diseño de interacción e interfaz | 5 semanas | Principios de julio |
| **5** | Disciplinas 5, 6 y 7 · Fisiología, Nutrición y Cábala. Taller común de generación de PDF | 6 semanas | Mediados de agosto |
| **6** | Disciplina 8 · Cultura. Internacionalización, estudio estadístico, programas y presentaciones imprimibles | 3 semanas | Finales de agosto |
| **7** | Pruebas, validación con usuarios, optimización de rendimiento y peso, despliegue definitivo. Memoria: implementación, pruebas, resultados, consideraciones éticas y conclusiones | 3 semanas | Mediados de septiembre |

Cada fecha límite marca el momento en el que la versión correspondiente de la memoria se entrega al tutor para su revisión, de modo que la corrección llegue mientras el trabajo asociado todavía está fresco y se pueda rectificar.

## 3.3. Desviaciones previstas

La planificación anterior contiene dos apuestas conscientes que convenía dejar por escrito antes de empezar, para poder contrastarlas después.

La primera es que las iteraciones 4 y 5 agrupan varias disciplinas cada una. Eso solo es posible si la iteración 3 consigue extraer un **sistema común de recorridos** lo bastante bueno como para que añadir una disciplina nueva sea, sobre todo, escribir contenido. Si esa abstracción fallaba, cada disciplina habría costado lo mismo que la primera y el proyecto habría terminado con cuatro, no con ocho.

La segunda es que el tiempo de producción del contenido está repartido dentro de cada iteración, y no aislado. Es una decisión discutible: mantiene la motivación, porque cada semana se ve avanzar algo visible, pero hace muy difícil estimar cuánto se tarda realmente en cada cosa.

El contraste entre esta planificación y lo que ocurrió de verdad —incluido un mes que concentró casi un tercio de todo el trabajo del proyecto— se analiza en el apartado 11.2.
# 4. Estado del arte

Este capítulo recoge la investigación previa al desarrollo. Se divide en tres partes: el análisis del sector del autoconocimiento digital y de cómo se aprende en él, el estudio detallado de las soluciones existentes más relevantes, y la comparativa de las tecnologías candidatas para construir la plataforma.

El objetivo no es hacer un inventario, sino extraer decisiones. Cada apartado termina en una conclusión que condiciona el diseño posterior.

## 4.1. El sector del autoconocimiento digital

### 4.1.1. Tamaño y forma del mercado

El bienestar digital es hoy una de las categorías más pobladas de las tiendas de aplicaciones. Dentro de ella conviven productos muy distintos que conviene separar, porque compiten por la misma atención pero resuelven problemas diferentes:

- **Meditación y relajación** (Calm, Headspace, Insight Timer). Contenido en audio, consumido por sesiones cortas, con modelo de suscripción mensual.
- **Registro y hábitos** (Daylio, Habitica, Finch). El usuario introduce datos sobre sí mismo y la aplicación se los devuelve agregados.
- **Astrología automatizada** (Co–Star, The Pattern, Chani, Sanctuary). Calculan la carta natal y generan texto a partir de ella, normalmente a diario.
- **Terapia y acompañamiento** (BetterHelp, Meditopia). Ponen en contacto con profesionales o guían ejercicios de corte clínico.
- **Formación** (Udemy, Domestika, Coursera). Cursos en vídeo, comprados por unidades, sin ninguna personalización.

Ninguna de estas categorías cubre el caso concreto de este proyecto: **aprender una disciplina completa aplicándola sobre uno mismo y terminar con un material propio**. Las de formación enseñan pero no personalizan; las de astrología personalizan pero no enseñan; las de meditación y hábitos ni enseñan ni producen nada duradero.

### 4.1.2. Cómo se aprende algo largo en una pantalla

Dado que el producto es un recorrido largo, la investigación se extendió a la pregunta pedagógica: qué hace que alguien termine un camino de veinte pantallas en lugar de abandonarlo en la tercera. De la literatura sobre aprendizaje móvil y del análisis de los productos que mejor retienen se extrajeron cuatro mecanismos aplicables:

**Progreso visible y guardado.** El usuario tiene que poder irse y volver sin perder nada, y tiene que ver cuánto lleva. La sensación de avance es el principal combustible de un recorrido largo.

**Desbloqueo secuencial, no bloqueo arbitrario.** Duolingo popularizó el camino de lecciones encadenadas, pero su implementación clásica —no puedes avanzar hasta aprobar— genera abandono cuando el usuario se atasca. La alternativa, adoptada en este proyecto, es encadenar por *lectura* y no por *acierto*: un paso se desbloquea cuando el anterior se ha recorrido, no cuando se ha superado una nota.

**Contenido que produce un resultado propio.** Los tests de personalidad tienen tasas de finalización muy altas por una razón concreta: al final hay un resultado que habla de ti. Trasladar ese mecanismo al final de cada tramo, y no solo al final del recorrido, mantiene el interés.

**Ruptura del muro de texto.** Un recorrido de veinte pantallas de párrafos no se termina. La solución adoptada —el cómic ilustrado a pantalla completa— se apoya en el mismo principio que usa la divulgación en vídeo corto: el texto avanza al ritmo de la imagen y el usuario controla el paso.

### 4.1.3. Consideraciones sobre disciplinas no científicas

Una parte de la investigación previa se dedicó a algo que no es habitual en un TFG técnico: **cómo presentar contenido que no es ciencia sin engañar a nadie**.

La conclusión, que se convirtió en criterio de producto, es que existe una diferencia sustancial entre tres cosas: afirmar que la astrología predice acontecimientos (falso y potencialmente dañino), usar el vocabulario astrológico como sistema simbólico para hablar de uno mismo (legítimo, del mismo modo que lo es usar el vocabulario de los arquetipos junguianos), y explicar qué es la astrología, de dónde viene y qué papel ha jugado en la historia del pensamiento (divulgación histórica sin más). La plataforma se sitúa deliberadamente en las dos últimas. Esta decisión se desarrolla en el capítulo 12.

## 4.2. Soluciones existentes

Se analizaron en detalle cuatro productos, elegidos porque cada uno domina una de las dimensiones que este proyecto necesita combinar.

### 4.2.1. Co–Star

Es la aplicación de astrología más conocida del mercado. Calcula la carta natal a partir de los datos de nacimiento y entrega textos diarios generados automáticamente, con un lenguaje deliberadamente cortante que ha sido su principal seña de identidad.

*Lo que hace bien:* el cálculo es riguroso —usa efemérides de la NASA— y la entrada de datos está muy cuidada, con búsqueda de lugar de nacimiento y resolución automática de la zona horaria.

*Lo que no resuelve:* el usuario nunca aprende nada. La aplicación no explica qué es una casa, qué es un aspecto ni por qué el texto dice lo que dice. Después de un año de uso, una persona sabe exactamente lo mismo de astrología que el primer día. Tampoco produce ningún material: no hay nada que descargar, imprimir ni conservar.

*Qué se toma de aquí:* el rigor del cálculo y el cuidado en la entrada de los datos de nacimiento. *Qué se hace distinto:* explicar cada resultado y entregar un documento al final.

[FIGURA 4: pantalla de carta natal de Co–Star]

*Figura 4. Entrega de resultados sin explicación en Co–Star.*
*(Fuente: aplicación Co–Star)*

### 4.2.2. Calm y Headspace

Las dos grandes aplicaciones de meditación. Comparten arquitectura de producto: catálogo de sesiones de audio, series temáticas, racha diaria y suscripción mensual.

*Lo que hacen bien:* el diseño de interfaz es excelente y la entrada al producto es inmediata; en menos de un minuto el usuario ya está haciendo algo. La progresión por series da sensación de camino sin obligar a nada.

*Lo que no resuelven:* el contenido es genérico. Todos los usuarios escuchan lo mismo. No hay ningún dato del usuario que modifique lo que la aplicación entrega, más allá de las preferencias de tema. Y, de nuevo, no queda nada material al terminar.

*Qué se toma de aquí:* la inmediatez de la entrada y el cuidado visual. *Qué se hace distinto:* que lo que se entrega dependa de lo que el usuario ha respondido.

### 4.2.3. Duolingo

No es competencia directa, pero es la referencia pedagógica obligada de cualquier producto de aprendizaje largo. Su camino de unidades encadenadas, su gestión del progreso y su capacidad para convertir el estudio en algo que se hace a diario son el estándar del sector.

*Lo que hace bien:* la progresión es legible de un vistazo; el usuario siempre sabe dónde está y qué es lo siguiente. El progreso se guarda con absoluta fiabilidad.

*Lo que no resuelve para este caso:* su modelo se apoya en la corrección automática —hay una respuesta correcta y una incorrecta— y eso es inaplicable a la mayoría de este proyecto. Cuando alguien escribe qué recuerda de su infancia a los siete años, no hay nada que corregir. El sistema de aciertos y fallos de Duolingo tenía que sustituirse por un sistema de *lectura y elaboración*.

*Qué se toma de aquí:* el índice del recorrido y el desbloqueo encadenado. *Qué se hace distinto:* el criterio de desbloqueo.

### 4.2.4. The Pattern

Aplicación de introspección que combina astrología con lenguaje psicológico. Es, de las analizadas, la más cercana en intención a este proyecto.

*Lo que hace bien:* trata los contenidos como material de introspección, no como predicción, y su lenguaje es notablemente más honesto que el de la competencia directa.

*Lo que no resuelve:* sigue sin enseñar el sistema subyacente, y mezcla sin distinguir lo que procede de la tradición astrológica y lo que procede de la psicología, algo que este proyecto separa de forma explícita.

### 4.2.5. Conclusiones del análisis

[TABLA 3: comparativa de soluciones existentes]

*Tabla 3. Comparativa de las soluciones existentes frente a la propuesta.*

| Característica | Co–Star | Calm / Headspace | Duolingo | The Pattern | **Life as a Privilege** |
|---|---|---|---|---|---|
| Personaliza según datos del usuario | Sí | No | Parcial | Sí | **Sí** |
| Enseña la disciplina subyacente | No | No | Sí | No | **Sí** |
| Recorrido largo con progreso guardado | No | Parcial | Sí | No | **Sí** |
| Entrega un documento propio al terminar | No | No | No | No | **Sí** |
| Distingue explícitamente ciencia de tradición | No | — | — | No | **Sí** |
| Varias disciplinas relacionadas entre sí | No | No | No | Parcial | **Sí** |
| Contenido ilustrado propio | Parcial | Sí | Sí | Parcial | **Sí** |
| Modelo de pago | Suscripción | Suscripción | Freemium | Suscripción | **Compra por disciplina** |

Del análisis se extraen cuatro decisiones que se trasladan directamente a los objetivos del capítulo 5:

1. La plataforma **debe explicar**, no solo entregar. Cada resultado va acompañado del razonamiento que lo produce.
2. El recorrido **debe dejar un artefacto**. Sin PDF descargable, el producto se parecería demasiado a lo que ya existe.
3. El desbloqueo **debe ser por lectura y no por acierto**, porque la mayoría de los pasos no admiten corrección.
4. El modelo de pago **debe ser por disciplina y no por suscripción**, porque el producto es un camino que se termina, no un servicio que se consume indefinidamente. Esta decisión, además, hace el proyecto viable para una sola persona: se puede vender la primera disciplina mientras se construye la segunda.

## 4.3. Antecedentes

El proyecto parte de cero en cuanto a código: no existe un trabajo previo de asignatura ni un repositorio anterior sobre el que se construya. Sí existe, en cambio, un antecedente de contenido: buena parte del material textual de las disciplinas procede de años de estudio y de notas personales previas, que durante el proyecto se reordenaron, se contrastaron y se reescribieron para encajar en el formato de recorrido. Esa reescritura forma parte del trabajo; la investigación original que la precede, no.

## 4.4. Tecnologías para el desarrollo

La elección de tecnologías se hizo contra tres criterios: que permitieran construir rápido siendo una sola persona, que no obligaran a pagar nada mientras el proyecto no facturase, y que no encerraran el proyecto en un proveedor del que después fuera imposible salir.

### 4.4.1. Interfaz: React frente a Angular y Vue

**Angular** ofrece una estructura muy completa —enrutado, inyección de dependencias, formularios, cliente HTTP— dentro del propio marco de trabajo. Esa misma completitud es su inconveniente aquí: impone una curva de entrada alta y una verbosidad que penaliza a un equipo de una persona que necesita iterar rápido sobre la interfaz.

**Vue** tiene la curva de entrada más suave de los tres y una documentación excelente, pero su ecosistema de bibliotecas de componentes y de gráficos tridimensionales es notablemente menor.

**React** se eligió por tres razones concretas. La primera es el ecosistema: para cada necesidad de este proyecto —animación, tres dimensiones, pasarela de pago, generación de PDF— existe una biblioteca madura y mantenida. La segunda es que el modelo de composición por componentes encaja de forma natural con la estructura del producto: ocho disciplinas que comparten el noventa por ciento de sus piezas (cabecera de paso, botón de avance, marca de leído, visor de cómic) y se diferencian en el contenido. La tercera es el peso en el mercado laboral, relevante en un trabajo que también sirve como carta de presentación.

Se acompaña de **TypeScript**. En un proyecto de más de doscientas mil líneas escrito por una sola persona a lo largo de ocho meses, el tipado estático no es un lujo: es la única forma de poder cambiar la forma de un dato en agosto y que el compilador señale los once sitios de marzo que hay que actualizar.

### 4.4.2. Herramienta de construcción: Vite

Frente a las alternativas basadas en empaquetado completo, **Vite** ofrece arranque casi instantáneo en desarrollo y sustitución de módulos en caliente sin recargar la página. Con una aplicación de este tamaño, la diferencia entre esperar quince segundos o medio segundo por cada cambio de una línea se acumula en horas a lo largo del proyecto.

### 4.4.3. Biblioteca de componentes: Chakra UI

Se compararon tres opciones:

- **Tailwind CSS** ofrece máxima libertad, pero no aporta componentes: cada modal, cada menú desplegable y cada control de formulario hay que construirlo o traerlo de otro sitio.
- **Material UI** aporta un catálogo enorme de componentes, pero con una identidad visual muy marcada —la de Google— que habría costado mucho trabajo disimular en un producto cuya identidad visual es precisamente su diferencial.
- **Chakra UI** ofrece componentes accesibles por defecto, un sistema de estilos por propiedades que evita saltar constantemente entre el componente y su hoja de estilos, y una neutralidad visual que permite construir una identidad propia encima.

Se eligió Chakra UI. La accesibilidad por defecto pesó especialmente: gestiona el foco en los modales, las etiquetas de los controles y la navegación por teclado sin trabajo adicional.

### 4.4.4. Animación y tres dimensiones

**Framer Motion** para las animaciones de entrada y las transiciones. Su modelo declarativo y su integración con el observador de intersección permiten que los elementos se animen al aparecer en pantalla sin escribir lógica de desplazamiento manual.

**Three.js**, a través de *React Three Fiber* y *Drei*, para la representación tridimensional de la carta astral. Es la única opción realista en el ecosistema web para esta necesidad.

### 4.4.5. Servidor: NestJS frente a Express

**Express** es más ligero y más rápido de arrancar, pero no impone ninguna estructura: en un servidor con treinta módulos funcionales, esa libertad se convierte en desorden.

**NestJS** se eligió porque aporta exactamente lo que este proyecto necesita: una estructura de módulos, controladores y servicios que obliga a separar responsabilidades, inyección de dependencias, y decoradores que hacen que la definición de las rutas sea legible de un vistazo. Está construido sobre Express, de modo que no se renuncia a nada de su ecosistema, y comparte lenguaje con la interfaz: TypeScript en ambos extremos permite reutilizar los tipos de los datos que viajan entre ellos.

### 4.4.6. Persistencia: Supabase frente a Firebase y a una base de datos propia

**Firebase** ofrece una base de datos documental con sincronización en tiempo real y una capa gratuita generosa, pero su modelo no relacional complica las consultas agregadas —necesarias para el panel de administración y para el estudio estadístico— y su dependencia del proveedor es prácticamente total.

**Una base de datos propia** (PostgreSQL o MySQL en un servidor alquilado) da control absoluto, pero obliga a administrar copias de seguridad, actualizaciones y seguridad, que es tiempo que no se dedica al producto.

**Supabase** se eligió porque ofrece PostgreSQL de verdad —con SQL estándar, tipos JSONB y consultas agregadas— gestionado por el proveedor, con capa gratuita suficiente para la fase inicial y, sobre todo, **sin encierro**: si mañana hiciera falta migrar a un PostgreSQL propio, sería un volcado y una restauración. Se aprovechan además su almacenamiento de ficheros para las imágenes subidas por los usuarios y por el panel de administración.

El tipo **JSONB** resultó ser determinante y merece mención aparte: permite guardar todo el progreso de un recorrido en una sola columna, de forma que añadir un paso nuevo a una disciplina no requiere ninguna migración de esquema. Esta decisión se desarrolla en el apartado 8.1.

### 4.4.7. Cálculo astronómico: astronomy-engine frente a Swiss Ephemeris

**Swiss Ephemeris** es el estándar de facto del sector: es la biblioteca que usan los programas profesionales de astrología y su precisión es máxima. Su inconveniente es la licencia: es de pago para uso comercial cerrado, y su alternativa libre obliga a publicar el código bajo licencia GPL.

**astronomy-engine** es una biblioteca libre bajo licencia MIT, disponible directamente en JavaScript y TypeScript, con una precisión de aproximadamente un minuto de arco para los planetas del sistema solar. Esa precisión es varios órdenes de magnitud superior a la que este producto necesita: la diferencia entre un cálculo y otro nunca cambia el signo ni la casa en que cae un planeta, que es lo único que la plataforma interpreta.

Se eligió astronomy-engine. Se acompaña de **Luxon** para el tratamiento de fechas y zonas horarias, y de **geo-tz** para resolver la zona horaria histórica a partir de las coordenadas del lugar de nacimiento —un detalle que resulta crítico, porque una hora de error desplaza el ascendente unos quince grados.

### 4.4.8. Pagos: Stripe

**Stripe** se eligió por tres razones: su modo de pruebas permite desarrollar todo el flujo de compra sin mover dinero real; su página de pago alojada evita que los datos de tarjeta pasen en ningún momento por el servidor propio, lo que reduce drásticamente las obligaciones de cumplimiento; y su sistema de avisos automáticos (*webhooks*) permite acreditar la compra de forma fiable aunque el usuario cierre el navegador al terminar de pagar.

### 4.4.9. Generación de documentos: jsPDF

La generación del PDF se hace **en el navegador del usuario**, no en el servidor, mediante **jsPDF**. La decisión tiene dos motivos: el servidor no tiene que cargar con la composición de documentos pesados, y el usuario obtiene el fichero de forma inmediata sin esperar una ida y vuelta. El inconveniente —que hay que medir el texto y pintarlo a mano, sin motor de maquetación— se resolvió construyendo un taller propio de composición que se describe en el apartado 8.6.

### 4.4.10. Despliegue

La aplicación se despliega en **Render**: la interfaz como sitio estático y el servidor como servicio web, ambos conectados al repositorio de forma que cada envío a la rama principal publica automáticamente. La capa gratuita incluye un límite mensual de ancho de banda que, con 275 MB de material multimedia, obligó a construir la canalización de optimización de imágenes descrita en el capítulo 9.

### 4.4.11. Resumen de la pila tecnológica

[TABLA 4: pila tecnológica]

*Tabla 4. Pila tecnológica del proyecto y justificación resumida.*

| Capa | Tecnología | Motivo principal de la elección |
|---|---|---|
| Interfaz | React 19 + TypeScript | Ecosistema, composición por componentes, tipado en un proyecto grande |
| Construcción | Vite | Velocidad de iteración en desarrollo |
| Componentes | Chakra UI | Accesibilidad por defecto y neutralidad visual |
| Animación | Framer Motion | Animaciones declarativas ligadas a la aparición en pantalla |
| Tres dimensiones | Three.js (React Three Fiber) | Única opción madura para la carta astral tridimensional |
| Enrutado | React Router | Estándar del ecosistema; carga diferida por ruta |
| Servidor | NestJS sobre Node.js | Estructura modular, mismo lenguaje que la interfaz |
| Base de datos | PostgreSQL (Supabase) | SQL real con JSONB, gestionado, sin encierro de proveedor |
| Almacenamiento | Supabase Storage | Integrado con la base de datos |
| Autenticación | JWT propio + Google OAuth | Control del modelo de usuario y entrada rápida |
| Astronomía | astronomy-engine + Luxon + geo-tz | Licencia libre y precisión suficiente |
| Pagos | Stripe | Modo de pruebas, página alojada, avisos automáticos |
| Documentos | jsPDF | Generación en el cliente, entrega inmediata |
| Correo | Nodemailer | Avisos de registro, compra y recuperación de contraseña |
| Despliegue | Render | Publicación automática desde el repositorio |
| Control de versiones | Git + GitHub | Historial y copia de seguridad remota |
# 5. Objetivos

Los objetivos de este trabajo se formulan siguiendo el principio SMART: cada uno debe ser específico, medible, alcanzable, realista y acotado en el tiempo. Se distinguen dos bloques: los objetivos de producto, que describen qué tiene que hacer la plataforma, y los objetivos de aprendizaje, que describen qué se pretende adquirir durante el proceso.

## 5.1. Objetivo principal

> **Diseñar, desarrollar y desplegar en producción una plataforma web de autoconocimiento guiado que permita a un usuario recorrer, de forma independiente, al menos ocho disciplinas, y obtener de cada una un documento personal descargable generado a partir de sus propias respuestas.**

El objetivo se considera alcanzado si, en la fecha de entrega, la plataforma está accesible en una dirección pública, un usuario puede registrarse, adquirir una disciplina, completar su recorrido de principio a fin y descargar el documento resultante.

## 5.2. Subobjetivos de producto

**SO-1. Calcular la carta natal en el propio sistema.** Obtener las posiciones de los diez planetas del sistema solar, los puntos angulares y los aspectos entre ellos a partir de la fecha, hora y lugar de nacimiento, resolviendo automáticamente las coordenadas y la zona horaria histórica del lugar. *Medible:* el resultado debe coincidir en signo y casa con el de una herramienta astrológica de referencia para un conjunto de al menos diez fechas de prueba repartidas por el siglo XX y XXI.

**SO-2. Construir un sistema común de recorridos reutilizable.** Diseñar la navegación, la persistencia, el índice, el desbloqueo secuencial y los componentes de paso una sola vez, de forma que añadir una disciplina nueva consista fundamentalmente en escribir su contenido. *Medible:* a partir de la tercera disciplina, el código específico de cada nueva disciplina debe ser sustancialmente menor que el de la primera.

**SO-3. No perder nunca el progreso del usuario.** Garantizar que el avance de un recorrido se guarda de forma fiable, que sobrevive al cierre del navegador y que no se pierde al navegar entre pasos. *Medible:* ninguna de las pruebas de recorrido completo debe terminar con datos perdidos.

**SO-4. Entregar un documento propio al final de cada tramo.** Generar documentos PDF personalizados a partir de las respuestas del usuario, con portada, identidad visual de la disciplina y contenido real, sin dependencias de servidor. *Medible:* al menos ocho generadores de documento distintos, uno por disciplina.

**SO-5. Permitir la compra independiente de cada disciplina.** Integrar una pasarela de pago real que acredite el acceso de forma fiable, con verificación redundante para que ninguna compra quede sin acreditar. *Medible:* el flujo completo de compra funciona en modo de pruebas y en producción, y existe un mecanismo de concesión manual como respaldo.

**SO-6. Sostener un catálogo multimedia grande sin degradar el rendimiento.** Servir cerca de dos mil ilustraciones propias manteniendo tiempos de carga aceptables y sin agotar el ancho de banda disponible. *Medible:* la aplicación debe cargar la primera pantalla sin descargar el conjunto completo del código ni de las imágenes.

**SO-7. Preparar la plataforma para más de un idioma.** Construir un sistema de traducción propio que permita servir el contenido en español e inglés, con respaldo automático al idioma original en lo que no esté traducido. *Medible:* la interfaz completa y al menos una disciplina disponibles en ambos idiomas, sin que falte ningún texto en ninguno de los dos.

**SO-8. Distinguir de forma explícita el contenido científico del tradicional.** Asegurar que las disciplinas que no son ciencia se presentan como historia y como herramienta de introspección, y que en ningún punto del producto se ofrece información que pueda leerse como consejo sanitario. *Medible:* revisión completa de los textos de las cuatro disciplinas afectadas y del material comercial asociado.

## 5.3. Subobjetivos de aprendizaje

**SA-1. Construir un sistema completo de principio a fin**, incluyendo las fases que rara vez se practican en las asignaturas: el despliegue en producción, la integración de un cobro real, la gestión de datos personales y el mantenimiento de una aplicación viva durante meses.

**SA-2. Aprender a diseñar para el cambio.** Enfrentarse a un proyecto lo bastante largo como para que las decisiones de arquitectura tengan consecuencias medibles meses después, y aprender a distinguir qué conviene abstraer y qué conviene dejar concreto.

**SA-3. Profundizar en tecnologías no cubiertas por el grado**, en particular el trabajo con documentos PDF generados por código, la representación tridimensional en la web y el cálculo astronómico aplicado.

**SA-4. Asumir la responsabilidad editorial de lo que se publica**, entendiendo que en un producto de este tipo las decisiones sobre qué se dice y cómo se dice son tan propias de la ingeniería como las decisiones sobre qué base de datos se usa.

## 5.4. Fuera de alcance

Se declara explícitamente fuera del alcance de este trabajo, para evitar ambigüedad en la evaluación:

- La publicación en tiendas de aplicaciones móviles. La plataforma es una aplicación web adaptada a móvil, no una aplicación nativa.
- El desarrollo de un segundo proyecto («Nace una madre») cuya página de entrada está preparada en el código pero cuya ruta permanece desactivada.
- La campaña de captación de usuarios y la explotación comercial sostenida, más allá de la validación del flujo de compra.
- La traducción completa de las ocho disciplinas al inglés: se construye el sistema y se traduce una parte representativa.
# 6. Metodología

## 6.1. Enfoque general

El trabajo se ha desarrollado siguiendo un **proceso iterativo e incremental de inspiración ágil**, adaptado a la realidad de un proyecto individual. No se aplica Scrum en sentido estricto —no hay equipo, luego no hay reuniones diarias, ni dueño de producto, ni revisión de sprint con terceros—, pero sí se conservan sus mecanismos útiles: iteraciones acotadas en el tiempo, un objetivo concreto por iteración, un incremento entregable al final de cada una y una revisión de lo hecho antes de empezar la siguiente.

La elección frente al modelo en cascada no fue estética. En un proyecto de esta naturaleza, el análisis completo por adelantado es imposible: cuando se empezó no se sabía cuántos pasos iba a tener el recorrido de psicología, ni si el sistema de recorridos podría compartirse entre disciplinas, ni cuánto pesaría el catálogo de ilustraciones. Esos datos solo aparecen construyendo. El modelo iterativo permite que el diseño se corrija a medida que aparece la información, algo que ocurrió en varias ocasiones documentadas en el capítulo 9 —de forma señalada, con el modelo de persistencia, que se rehízo por completo tras la segunda disciplina.

Sí se aplicaron, en cambio, **fases formales de análisis y diseño previas a cada iteración grande**. El capítulo 7 (especificación de requisitos según IEEE 830) y el capítulo 8 (diseño) no son documentos escritos a posteriori: se elaboraron antes de construir y se ampliaron al principio de cada iteración. Iterativo no significa improvisado.

## 6.2. Estructura de una iteración

Cada iteración siguió el mismo ciclo de cuatro pasos:

1. **Definición del objetivo.** Una frase que describe qué existirá al final de la iteración y que no existe ahora. Por ejemplo: «el usuario puede completar el recorrido de Ayurveda y descargar su PDF de constitución».
2. **Diseño del incremento.** Modelo de datos del tramo nuevo, pantallas necesarias, componentes que se pueden reutilizar y componentes que hay que crear.
3. **Construcción.** Implementación y producción del contenido, alternando ambas para mantener visible el avance.
4. **Cierre.** Prueba manual del recorrido completo de principio a fin, despliegue, y redacción de la parte de memoria correspondiente.

El paso 4 es el que con más frecuencia se descuida en un proyecto individual y el que más valor aportó: recorrer entera la disciplina recién terminada, como lo haría un usuario, sacó a la luz la mayoría de los fallos que se documentan en el capítulo 10.

## 6.3. Herramientas de gestión y seguimiento

### 6.3.1. Git como bitácora del proyecto

El repositorio de control de versiones no se usó solo como copia de seguridad, sino como **registro real del trabajo**. Cada cambio significativo se registró con un mensaje descriptivo en lenguaje natural que explica qué se hizo y por qué, y no un identificador de tarea. Ejemplos reales del historial:

> `Las ilustraciones de la Historia de la medicina, ya en su sitio`
> `Un mini cómic de los aspectos antes de ver los propios`
> `La galería de ilustraciones abre con El Origen`
> `Los programas se leen en el móvil: título corto y la diapositiva a lo grande`

Esta decisión tuvo una consecuencia práctica que no se había previsto: el historial de 541 versiones se convirtió en la fuente principal para reconstruir la implementación del capítulo 9 y para medir el esfuerzo real por fases en el capítulo 11. Un registro de tareas convencional habría dado menos información.

El repositorio remoto cumple además el plan de prevención de los riesgos R-01 y R-02: el estado completo del proyecto —código, contenido, memoria y esquemas de base de datos— vive fuera del equipo de desarrollo.

### 6.3.2. Bitácora de contenido y listas de pendientes

Además del historial de versiones, el proyecto mantiene dos ficheros vivos en la raíz del repositorio que funcionan como pila de trabajo pendiente:

- Una **bitácora de contenido** donde se acumulan los textos en elaboración, las ideas de material nuevo y las decisiones editoriales tomadas.
- Un **inventario de material gráfico pendiente**, generado además de forma automática por un guion propio que recorre el código buscando referencias a imágenes que todavía no existen en el sistema de ficheros. Esta herramienta resultó ser una de las más rentables del proyecto: con casi dos mil ilustraciones, saber cuáles faltan no es algo que pueda llevarse en la cabeza.

### 6.3.3. Contabilización del esfuerzo

El esfuerzo se contabilizó de forma indirecta, a partir del historial de versiones —fecha y volumen de cada cambio— en lugar de mediante un cronómetro de tareas. Esta elección tiene una ventaja y un inconveniente que conviene declarar: la ventaja es que el dato es objetivo y no depende de acordarse de arrancar y parar un temporizador; el inconveniente es que mide *productividad registrada* y no *tiempo invertido*, de modo que las horas dedicadas a investigar, a escribir contenido en borrador o a resolver un problema sin llegar a escribir código quedan infrarrepresentadas. El análisis del capítulo 11 tiene en cuenta esa limitación.

## 6.4. Prácticas de desarrollo

Durante el proyecto se fijaron algunas reglas de trabajo propias que conviene documentar, porque explican buena parte de la forma del código:

**Comentarios que explican el porqué, no el qué.** El código de este proyecto está densamente comentado, pero los comentarios no describen lo que la línea siguiente hace —eso ya se lee— sino por qué está hecha así y qué pasaría si se cambiara. Se comentan especialmente las decisiones contraintuitivas, como el uso de una propiedad de escalado concreta en el panel de administración en lugar de otra aparentemente equivalente, o el motivo por el que ciertas rutas deben declararse en un orden determinado.

**Un solo sitio para cada decisión visual.** Cuando una regla de estilo se repite en ocho disciplinas —el botón de avance de página, la marca de leído, la caja con ilustración, la pantalla de carga— se extrae a un componente común. Este criterio se aplicó de forma sistemática a partir de la tercera disciplina y es la razón por la que las últimas costaron una fracción de lo que costó la primera.

**Ninguna funcionalidad se da por terminada sin recorrerla como usuario.** El desarrollo por partes tiende a producir piezas que funcionan por separado y fallan juntas, sobre todo en un producto cuya unidad es una secuencia de veinte pantallas encadenadas.

**El contenido es código.** Los textos, los pasos de cada recorrido y los índices viven en ficheros TypeScript tipados, no en una base de datos ni en un gestor de contenidos externo. Esto tiene un coste —cambiar un texto exige publicar— y una ventaja decisiva: el compilador avisa cuando un paso referencia contenido que no existe, y el historial de versiones registra también los cambios editoriales.
# 7. Análisis y especificación

Este capítulo define la audiencia del producto, los actores que intervienen en él y el conjunto completo de requisitos funcionales, no funcionales y restricciones. Se toma como referencia el estándar internacional **IEEE 830** para la especificación de requisitos software.

La identificación de cada requisito sigue el formato «tipo-número»: **RF** para requisitos funcionales, **RNF** para no funcionales y **R** para restricciones. Cada uno indica además su **prioridad**: *Alta* si su desarrollo es obligatorio para considerar el proyecto terminado, y *Deseada* si es opcional y se abordará solo si el tiempo lo permite.

## 7.1. Audiencia

El producto está dirigido a **personas adultas con interés previo en el autoconocimiento y disposición a dedicarle tiempo de forma sostenida**. No se exige ningún conocimiento previo de las disciplinas: cada recorrido empieza por su historia y sus fundamentos y da por supuesto que quien entra no sabe nada de la materia.

Sí se exige, en cambio, algo que conviene declarar con claridad porque condiciona el diseño: **disposición a escribir**. Buena parte del valor del producto procede de las respuestas que el propio usuario redacta —su línea de vida, sus nudos, sus compromisos— y una persona que solo quiere consumir contenido pasivamente no encontrará aquí lo que busca. El recorrido de Psicología, en particular, exige recorrer año a año la propia biografía, lo que puede suponer varias horas de trabajo repartidas en varias sesiones.

En cuanto al perfil técnico, se asume el de un usuario medio de aplicaciones móviles: sabe registrarse, sabe pagar en línea y espera que la aplicación funcione igual en el teléfono que en el ordenador. No se asume familiaridad con conceptos técnicos de ningún tipo.

Existe un segundo perfil de usuario, minoritario pero con necesidades muy distintas: la **administración de la plataforma**, que gestiona contenidos, revisa el trabajo de los usuarios que solicitan acompañamiento y concede accesos.

## 7.2. Actores del sistema

[TABLA 5: actores del sistema]

*Tabla 5. Actores del sistema y su relación con la plataforma.*

| Actor | Descripción | Acceso |
|---|---|---|
| **Visitante** | Persona no registrada. Puede ver la parte pública: portada, presentaciones de disciplina, galería de ilustraciones, materiales gratuitos, programas y el estudio estadístico | Público |
| **Usuario registrado** | Tiene cuenta. Puede gestionar su perfil, guardar notas y acceder a las disciplinas que haya adquirido | Sesión iniciada |
| **Usuario con disciplina** | Usuario registrado que ha comprado (o recibido) el acceso a una o varias disciplinas. Puede recorrerlas y generar sus documentos | Sesión + acceso concedido |
| **Administración** | Gestiona el catálogo de cursos, los textos editables, los vídeos, los accesos, los suscriptores y el estudio. Revisa el trabajo de los usuarios que han comprado acompañamiento | Sesión + rol de administración |
| **Pasarela de pago** | Sistema externo que procesa el cobro y notifica al servidor el resultado de la operación | Automático (avisos firmados) |
| **Proveedor de identidad** | Servicio externo de autenticación mediante cuenta de Google | Automático (OAuth 2.0) |

## 7.3. Requisitos funcionales

### 7.3.1. Cuentas y acceso

[TABLA 6: requisitos funcionales de cuentas y acceso]

*Tabla 6. Requisitos funcionales del subsistema de cuentas y acceso.*

| ID | Nombre | Prioridad | Actor | Descripción |
|---|---|---|---|---|
| RF-01 | Registro de cuenta | Alta | Visitante | Crear una cuenta con correo y contraseña. La contraseña se almacena cifrada, nunca en claro |
| RF-02 | Inicio de sesión | Alta | Usuario | Autenticarse con correo y contraseña, obteniendo una credencial de sesión con caducidad |
| RF-03 | Acceso con Google | Deseada | Visitante | Registrarse e iniciar sesión mediante cuenta de Google, sin crear contraseña |
| RF-04 | Recuperación de contraseña | Alta | Usuario | Solicitar por correo un enlace de un solo uso para fijar una contraseña nueva |
| RF-05 | Gestión del perfil | Alta | Usuario | Consultar y modificar los datos propios, incluida la fotografía de perfil |
| RF-06 | Eliminación de cuenta | Alta | Usuario | Eliminar la cuenta y todos los datos personales asociados, incluidos los de todos los recorridos |
| RF-07 | Protección de rutas privadas | Alta | Sistema | Impedir el acceso a cualquier pantalla de recorrido o de administración sin sesión válida |

### 7.3.2. Capa pública y catálogo

[TABLA 7: requisitos funcionales de la capa pública]

*Tabla 7. Requisitos funcionales de la capa pública.*

| ID | Nombre | Prioridad | Actor | Descripción |
|---|---|---|---|---|
| RF-08 | Portada con las disciplinas | Alta | Visitante | Presentar las ocho disciplinas y dar acceso a la portada individual de cada una |
| RF-09 | Portada de disciplina | Alta | Visitante | Mostrar, para cada disciplina, tres puertas: ilustraciones, cursos y el recorrido |
| RF-10 | Galería de ilustraciones | Alta | Visitante | Mostrar el catálogo ilustrado, con posibilidad de filtrar por disciplina y de ampliar cada pieza |
| RF-11 | Catálogo de cursos | Alta | Visitante | Consultar los cursos disponibles, agrupados por disciplina, con sus lecciones en vídeo o texto |
| RF-12 | Materiales descargables | Alta | Visitante | Ofrecer material gratuito descargable y libros en PDF de pago |
| RF-13 | Programas | Deseada | Visitante | Consultar cada programa como visor de diapositivas acompañado de su pódcast |
| RF-14 | Presentación imprimible | Deseada | Visitante | Servir, en una dirección corta pensada para imprimir en un código QR, la presentación pública de cada disciplina |
| RF-15 | Suscripción al boletín | Deseada | Visitante | Dejar el correo para recibir novedades, y poder darse de baja desde un enlace del propio correo |
| RF-16 | Formulario de contacto | Alta | Visitante | Enviar un mensaje que llegue por correo a la administración |
| RF-17 | Opiniones | Deseada | Usuario | Dejar y consultar valoraciones sobre la plataforma |
| RF-18 | Páginas legales | Alta | Visitante | Publicar aviso legal, política de privacidad, política de cookies y condiciones de uso |
| RF-19 | Consentimiento de cookies | Alta | Visitante | Solicitar consentimiento antes de cargar cualquier recurso de analítica, y recordar la elección |

### 7.3.3. El Recorrido

[TABLA 8: requisitos funcionales del recorrido]

*Tabla 8. Requisitos funcionales del subsistema de recorridos.*

| ID | Nombre | Prioridad | Actor | Descripción |
|---|---|---|---|---|
| RF-20 | Recorrido guiado por pasos | Alta | Usuario con disciplina | Avanzar por una secuencia ordenada de pantallas, con un único botón de avance y otro de retroceso siempre en el mismo sitio |
| RF-21 | Guardado del progreso | Alta | Usuario con disciplina | Guardar automáticamente cada respuesta y cada avance, de forma que se pueda abandonar y retomar el recorrido sin pérdida |
| RF-22 | Prerrelleno de respuestas | Alta | Usuario con disciplina | Al volver a una pantalla ya visitada, mostrar rellenado lo que el usuario contestó, sin pedírselo otra vez |
| RF-23 | Índice del recorrido | Alta | Usuario con disciplina | Consultar el índice de la disciplina y saltar a cualquier paso ya alcanzable |
| RF-24 | Desbloqueo secuencial | Alta | Sistema | Habilitar cada paso solo cuando se ha completado el anterior, con puertas obligatorias en los pasos que dependen de un test previo |
| RF-25 | Marca de lectura | Alta | Usuario con disciplina | Señalar como leído el contenido ya recorrido, y conservar esa marca entre sesiones |
| RF-26 | Cómics ilustrados | Alta | Usuario con disciplina | Presentar el contenido narrativo como visor a pantalla completa de ilustración y texto, saltable en cualquier momento |
| RF-27 | Notas personales | Deseada | Usuario con disciplina | Escribir y consultar notas propias desde cualquier pantalla del recorrido |
| RF-28 | Contenido dependiente de otra disciplina | Alta | Sistema | Cuando una pantalla necesita datos de otra disciplina no adquirida, mostrar un bloqueo que explique qué se hace allí y ofrezca ir a esa disciplina |

### 7.3.4. Contenido específico por disciplina

[TABLA 9: requisitos funcionales por disciplina]

*Tabla 9. Requisitos funcionales del contenido específico de cada disciplina.*

| ID | Nombre | Prioridad | Descripción |
|---|---|---|---|
| RF-29 | Cálculo de la carta natal | Alta | Calcular posiciones planetarias, puntos angulares, casas y aspectos a partir de fecha, hora y lugar de nacimiento, resolviendo coordenadas y zona horaria histórica automáticamente |
| RF-30 | Lectura guiada de la carta | Alta | Recorrer la carta por tramos —puntos clave, casas, aspectos— desbloqueando cada uno al leer el anterior |
| RF-31 | Representación visual de la carta | Deseada | Mostrar la carta astral de forma gráfica, incluida una versión tridimensional |
| RF-32 | Línea de vida | Alta | Reconstruir la biografía año a año mediante preguntas evocadoras, permitiendo marcar años sin recuerdos |
| RF-33 | Genograma familiar | Alta | Construir el mapa de la familia y sus vínculos, con fotografía o representación de cada miembro |
| RF-34 | Cuestionarios validados | Alta | Administrar los cuestionarios ACE (experiencias adversas en la infancia) y DES-II (experiencias disociativas) y presentar su resultado con la interpretación adecuada |
| RF-35 | Mapa de huellas, nudos y heridas | Alta | Relacionar recuerdos marcados con creencias identificadas y construir con ellos el mapa personal |
| RF-36 | Test de constitución ayurvédica | Alta | Determinar el doṣha predominante y encaminar el recorrido correspondiente |
| RF-37 | Diagnóstico de Medicina China | Alta | Calcular, a partir de tres cuestionarios, un único estado por elemento como diferencia entre carga y recursos, con un umbral configurado |
| RF-38 | Cálculo de necesidades nutricionales | Alta | Calcular las necesidades calóricas y de macronutrientes a partir de los datos del usuario y permitirle diseñar su día alimentario |
| RF-39 | Árbol de la Vida | Alta | Recorrer las diez sefirot y los senderos, con diagnóstico personal asociado |
| RF-40 | Línea temporal histórica | Alta | Recorrer la historia universal en dos niveles: eras y sub-hitos dentro de cada era |
| RF-41 | Estudio estadístico abierto | Deseada | Permitir a cualquier visitante participar en un estudio sobre correspondencias astrológicas y consultar los resultados agregados |

### 7.3.5. Documentos y resultados

[TABLA 10: requisitos funcionales de generación de documentos]

*Tabla 10. Requisitos funcionales de generación de documentos.*

| ID | Nombre | Prioridad | Actor | Descripción |
|---|---|---|---|---|
| RF-42 | Generación de PDF personalizado | Alta | Usuario con disciplina | Generar un documento descargable con las respuestas y los resultados propios, con portada e identidad visual de la disciplina |
| RF-43 | Identidad visual por documento | Alta | Sistema | Aplicar a cada documento la tipografía, el color y los elementos gráficos de su disciplina |
| RF-44 | Generación sin servidor | Alta | Sistema | Componer el documento en el navegador del usuario, sin enviar sus respuestas a un servicio de composición externo |

### 7.3.6. Pagos y accesos

[TABLA 11: requisitos funcionales de pagos]

*Tabla 11. Requisitos funcionales del subsistema de pagos y accesos.*

| ID | Nombre | Prioridad | Actor | Descripción |
|---|---|---|---|---|
| RF-45 | Compra de una disciplina | Alta | Usuario | Adquirir el acceso a una disciplina mediante pasarela de pago externa, con el importe fijado siempre por el servidor |
| RF-46 | Acreditación fiable de la compra | Alta | Sistema | Conceder el acceso mediante aviso firmado de la pasarela y, de forma redundante, mediante verificación explícita al volver del pago |
| RF-47 | Compra de otros productos | Deseada | Usuario | Adquirir libros en PDF y reservar llamadas de acompañamiento, con precio fijado por el servidor según el tipo |
| RF-48 | Reserva de llamada | Deseada | Usuario | Elegir un hueco libre de agenda dentro del margen permitido y reservarlo |
| RF-49 | Concesión manual de acceso | Alta | Administración | Conceder o revocar el acceso a una disciplina sin pago, desde el panel de administración |
| RF-50 | Aviso de operaciones | Alta | Sistema | Notificar por correo a la administración cada registro nuevo y cada compra completada |

### 7.3.7. Administración

[TABLA 12: requisitos funcionales de administración]

*Tabla 12. Requisitos funcionales del panel de administración.*

| ID | Nombre | Prioridad | Descripción |
|---|---|---|---|
| RF-51 | Gestión de usuarios | Alta | Consultar todos los usuarios, su estado de acceso y su progreso; eliminar cuentas |
| RF-52 | Gestión del catálogo de cursos | Alta | Crear, editar, marcar como revisado y eliminar cursos y sus lecciones |
| RF-53 | Edición de textos de arquetipos | Alta | Editar desde el panel los textos interpretativos de la astrología sin necesidad de publicar código |
| RF-54 | Revisión del trabajo del usuario | Alta | Consultar el recorrido completado por un usuario que ha contratado acompañamiento, y escribir sobre él |
| RF-55 | Gestión de suscriptores | Deseada | Consultar y exportar la lista de personas suscritas al boletín |
| RF-56 | Gestión del estudio | Deseada | Consultar participantes y respuestas agregadas del estudio estadístico |

## 7.4. Requisitos no funcionales

[TABLA 13: requisitos no funcionales]

*Tabla 13. Requisitos no funcionales del sistema.*

| ID | Nombre | Prioridad | Descripción |
|---|---|---|---|
| RNF-01 | Usabilidad | Alta | La interacción debe ser coherente en toda la plataforma: el botón de avance siempre en el mismo sitio, la marca de lectura siempre igual, el mismo componente para la misma acción en las ocho disciplinas |
| RNF-02 | Diseño adaptativo | Alta | Toda la plataforma debe funcionar en teléfono, tableta y ordenador. Ninguna pantalla puede producir desplazamiento horizontal |
| RNF-03 | Rendimiento de carga | Alta | La primera pantalla no puede exigir la descarga del conjunto completo del código de la aplicación: cada página viaja en su propio fragmento y se descarga al entrar en ella |
| RNF-04 | Peso del material multimedia | Alta | Todas las imágenes deben servirse en formato comprimido moderno; los vídeos deben recomprimirse antes de publicarse |
| RNF-05 | Tolerancia a fallos de datos | Alta | Un dato guardado con una forma antigua no puede dejar la aplicación en blanco: la lectura debe blindarse y debe existir una barrera de error global |
| RNF-06 | Seguridad del transporte | Alta | Toda comunicación cifrada; cabeceras de seguridad activas; origen de las peticiones restringido a los dominios autorizados |
| RNF-07 | Seguridad de las credenciales | Alta | Las contraseñas se almacenan con función de derivación con sal. Ningún dato de tarjeta pasa por el servidor propio |
| RNF-08 | Límite de peticiones | Alta | El servidor debe limitar el número de peticiones por dirección de origen para resistir abusos, respetando la dirección real tras el proxy |
| RNF-09 | Protección de datos | Alta | Cumplimiento del RGPD: consentimiento informado, derecho de supresión efectivo, y tratamiento especialmente cuidadoso de los datos de salud recogidos en Psicología |
| RNF-10 | Mantenibilidad | Alta | El código debe estructurarse en módulos y componentes reutilizables; una decisión visual repetida debe vivir en un único sitio |
| RNF-11 | Escalabilidad del contenido | Alta | Añadir una disciplina o un paso nuevo no debe exigir migraciones de base de datos |
| RNF-12 | Accesibilidad | Deseada | Contraste suficiente, navegación por teclado, foco visible y etiquetado correcto de los controles |
| RNF-13 | Internacionalización | Deseada | La plataforma debe poder servirse en más de un idioma, con respaldo automático al idioma original en lo no traducido |
| RNF-14 | Legalidad de los recursos | Alta | Todo el material gráfico y sonoro debe ser propio o disponer de licencia válida |
| RNF-15 | Disponibilidad | Deseada | La plataforma debe estar publicada en una dirección pública y accesible de forma continuada |

## 7.5. Restricciones

[TABLA 14: restricciones]

*Tabla 14. Restricciones del proyecto.*

| ID | Nombre | Prioridad | Descripción |
|---|---|---|---|
| R-01 | Sin ficheros en el servidor | Alta | El servicio de despliegue borra el disco en cada publicación. Ningún dato que deba sobrevivir puede guardarse como fichero en el servidor: todo va a base de datos o a almacenamiento gestionado |
| R-02 | Presupuesto nulo | Alta | El proyecto debe construirse sobre capas gratuitas o de coste mínimo. Esto restringe el ancho de banda disponible y condiciona el tratamiento del material multimedia |
| R-03 | Licencias libres | Alta | No pueden utilizarse bibliotecas cuya licencia obligue a abrir el código del proyecto o exija pago para uso comercial |
| R-04 | Tecnología web | Alta | El producto es una aplicación web; no se desarrolla aplicación nativa ni se publica en tiendas de aplicaciones |
| R-05 | Un solo desarrollador | Alta | Todo el trabajo —diseño, contenido, ilustración, desarrollo y despliegue— recae en una persona, lo que impone priorizar de forma agresiva |
| R-06 | Contenido no sanitario | Alta | Ningún texto de la plataforma puede presentarse como diagnóstico, tratamiento ni sustituto de la atención sanitaria. Las disciplinas no científicas se presentan como historia e introspección |
| R-07 | El precio lo fija el servidor | Alta | Ningún importe puede viajar desde el navegador: el cliente envía únicamente el identificador del producto y el servidor determina cuánto cuesta |
# 8. Diseño

Este capítulo recoge el diseño completo del sistema: cómo se guardan los datos, cómo se organizan los bloques funcionales, qué expone el servidor, qué tecnologías ocupan cada capa, cómo se ha diseñado la interacción y la interfaz, cuál es la guía de estilos y cómo se ha planificado la validación.

Cada apartado se relaciona con los requisitos del capítulo anterior, indicando entre paréntesis los identificadores que resuelve.

## 8.1. Diseño de la persistencia

### 8.1.1. El problema: recorridos que crecen

El primer diseño de la base de datos, el que se usó durante las dos primeras disciplinas, era el convencional: una tabla por concepto, una columna por dato. La tabla de astrología tenía columnas para el signo solar, el lunar, el ascendente, las casas… y la de psicología iba a tener columnas para cada pregunta de la línea de vida.

Ese diseño se rompió en la tercera semana de la segunda disciplina. El motivo es la naturaleza del producto: **un recorrido no es un formulario cerrado, es una estructura que crece**. Añadir un paso nuevo a Psicología —y se añadieron veintiséis— habría significado una migración de esquema cada vez; permitir que un usuario añada un número indeterminado de heridas, cada una de ellas relacionada con un número indeterminado de recuerdos y de creencias, no encaja en columnas fijas sin construir cinco tablas de relación; y el recorrido de Fisiología ni siquiera existía todavía cuando había que decidir la forma de sus datos.

### 8.1.2. La solución: un documento por disciplina y por usuario

El modelo definitivo separa dos cosas que antes estaban mezcladas:

**Lo que el sistema necesita consultar y agregar** —quién es cada usuario, qué ha comprado, qué cursos existen, quién está suscrito— vive en **tablas relacionales normales**, con columnas, tipos e índices, porque sobre eso hay que hacer consultas.

**Lo que solo tiene sentido para un usuario concreto** —todo su progreso dentro de una disciplina— vive en **una única fila y una única columna de tipo JSONB**, con el identificador del usuario como clave primaria.

```
metodo_psicologia
├── user_id     text        primary key
├── data        jsonb       not null default '{}'
└── updated_at  timestamptz not null default now()
```

El servidor solo permite escribir el campo `data`, y lo hace mediante una operación de inserción o actualización (*upsert*) por identificador de usuario. Hay una tabla con esta misma forma para cada disciplina.

Las ventajas de este diseño resultaron ser decisivas para que el proyecto pudiera terminar con ocho disciplinas:

- **Añadir un paso no requiere migrar nada.** Los campos nuevos se guardan y se leen tal cual (RNF-11).
- **Estructuras anidadas de profundidad variable** —un año de la línea de vida que contiene respuestas, que contienen huellas marcadas— se representan de forma natural.
- **Borrar los datos de un usuario es borrar ocho filas**, lo que simplifica enormemente el ejercicio del derecho de supresión (RNF-09).

Y una desventaja, que costó cara y que se documenta en el capítulo 9: **la base de datos ya no valida la forma del dato**. Si una versión antigua guardó un campo como texto y una versión nueva espera una lista, la base de datos lo acepta sin protestar y el fallo aparece al pintar la pantalla. La respuesta a este problema fue triple: blindar la lectura comprobando el tipo de cada campo antes de usarlo, documentar la forma esperada del documento como comentario dentro del propio fichero de esquema, y añadir una barrera de error global que muestra una pantalla de fallo en lugar de dejar la página en blanco (RNF-05).

### 8.1.3. Modelo de datos

El esquema resultante, representado en la Figura 5, tiene por tanto dos mitades bien diferenciadas: un núcleo relacional sobre el que se consulta y se agrega, y ocho documentos que solo se leen enteros y solo para un usuario.

[FIGURA 5: esquema del modelo de datos completo]

*Figura 5. Esquema del modelo de datos: tablas relacionales y documentos JSONB.*
*(Fuente propia)*

**Núcleo relacional**

- **`user`** — identidad, credenciales, datos de perfil y, para cada una de las ocho disciplinas, un par de columnas: un indicador booleano de acceso concedido y la fecha de compra. Este par es lo que consulta el sistema para decidir si deja entrar a un recorrido (RF-45, RF-49).
- **`curso`** — catálogo de cursos con su disciplina, portada, modalidad y lecciones (RF-11, RF-52).
- **`video`** — piezas de vídeo con su portada y su disciplina (RF-52).
- **`suscriptor`** — personas suscritas al boletín, con su fecha de alta y su estado (RF-15, RF-55).
- **`astrologia_arquetipos`** — textos interpretativos editables desde el panel sin publicar código (RF-53).
- **`estudio_participante`** y **`estudio_respuesta`** — datos del estudio estadístico abierto, separados en dos tablas porque sobre las respuestas hay que hacer agregaciones por planeta, signo y pregunta (RF-41).
- **`recorrido_progreso`** — posición alcanzada por cada usuario en cada disciplina, en tabla aparte porque se consulta con frecuencia y de forma independiente al contenido (RF-21, RF-24).

**Documentos por disciplina**

Ocho tablas de la forma descrita —`metodo_astrologia`, `metodo_psicologia`, `metodo_ayurveda`, `metodo_tcm`, `metodo_fisiologia`, `metodo_nutricion`, `metodo_cabala` y la de cultura— más `psicologia_des` para el cuestionario DES-II, separado del resto por tratarse de un instrumento con estructura propia y estable.

A modo de ejemplo, esta es la forma del documento de Psicología, el más complejo del sistema:

```
data {
  "problema-actual": "texto libre",
  "edad": 22,
  "anos": {
    "0": { "respuestas": { … }, "sinRecuerdos": false,
           "huellas": ["recuerdo marcado", …] },
    "1": { "sinRecuerdos": true },
    …
  },
  "nudos":   ["Miedo al abandono", "Perfeccionismo", …],
  "heridas": [ { "id", "titulo", "texto",
                 "huellas": […], "nudos": […] } ],
  "constelaciones": [ { "id", "titulo", "texto",
                        "nudos": […],
                        "arquetipos": [ { "cuerpoKey": "saturno",
                                          "faceta": "casa", "casa": 1 } ] } ]
}
```

El último campo ilustra por qué el modelo documental era necesario: una *constelación* relaciona creencias identificadas por el usuario en Psicología con arquetipos procedentes de su carta natal en Astrología. Representar esa relación entre dos disciplinas en un modelo estrictamente relacional habría exigido tres tablas más y consultas con varias uniones, para un dato que solo se consulta entero y solo para un usuario.

### 8.1.4. Seguridad e integridad

El servidor accede a la base de datos con una clave de servicio que omite las reglas de seguridad por fila, de modo que **la autorización se decide íntegramente en el servidor**: cada petición comprueba la credencial de sesión y el indicador de acceso a la disciplina antes de leer o escribir nada. Esta decisión centraliza el control en un solo sitio, que es más fácil de auditar que un conjunto de reglas declarativas repartidas por tablas.

Las imágenes subidas por los usuarios —fotografías de perfil y de genograma— y por la administración se guardan en un único depósito público de almacenamiento gestionado, cuya dirección se registra en la base de datos. Es importante señalar que **ese depósito debe seguir siendo público**: como las direcciones se almacenan directamente en los registros, restringirlo dejaría todas las imágenes rotas. Para material que sí deba ser privado —como los libros en PDF vendidos— la solución correcta es un depósito distinto con acceso restringido.

Las copias de seguridad quedan cubiertas por el servicio gestionado de base de datos; el esquema completo, con sus comentarios, está versionado en el repositorio como ficheros SQL ejecutables, de forma que el sistema puede reconstruirse desde cero.

## 8.2. Diseño de la arquitectura conceptual

El sistema se organiza en tres niveles, con servicios externos acoplados en los bordes, según el reparto que muestra la Figura 6.

[FIGURA 6: diagrama de la arquitectura conceptual]

*Figura 6. Arquitectura conceptual del sistema.*
*(Fuente propia)*

**Nivel de presentación.** Aplicación de una sola página que se ejecuta íntegramente en el navegador. Contiene el enrutado, las pantallas, los componentes reutilizables, el sistema de traducción, el taller de generación de documentos PDF y el motor de representación tridimensional. Se comunica con el nivel de negocio exclusivamente por HTTP.

**Nivel de negocio.** Servidor de API REST organizado en módulos independientes, uno por área funcional. Es el único que conoce las credenciales de la base de datos, las claves de la pasarela de pago y las del servicio de correo. Aquí viven las tres piezas de lógica que **no pueden estar en el cliente** bajo ningún concepto: la autorización de acceso a cada disciplina, la fijación de los precios y el cálculo de la carta natal.

**Nivel de persistencia.** Base de datos relacional gestionada y almacenamiento de ficheros.

**Servicios externos.** Pasarela de pago, proveedor de identidad, servicio de geocodificación para resolver las coordenadas del lugar de nacimiento y servicio de correo saliente.

Una decisión de arquitectura merece destacarse: **el cálculo de la carta natal se hace en el servidor y no en el cliente**, aunque la biblioteca astronómica funcionaría igual de bien en el navegador. El motivo es que el resultado es el producto que el usuario ha comprado: si se calculara en el cliente, cualquiera podría obtenerlo sin pagar leyendo el código de la propia página.

## 8.3. Diseño de la API REST

El servidor expone alrededor de **treinta módulos** y un centenar largo de puntos de acceso. La convención seguida es la habitual de REST: el recurso en la ruta, la acción en el método HTTP, y el identificador del usuario como último segmento en los recursos personales.

[TABLA 15: resumen de la API REST]

*Tabla 15. Resumen de los módulos de la API REST y sus operaciones principales.*

| Módulo | Ruta base | Operaciones principales |
|---|---|---|
| Usuarios | `/user` | Registro, inicio de sesión, recuperación de contraseña, perfil, baja; operaciones de administración sobre accesos y usuarios |
| Autenticación externa | `/auth` | Inicio y retorno del flujo OAuth de Google |
| Carta natal | `/metodo-astrologia` | Obtener y recalcular la carta natal, actualizar datos de nacimiento, solicitar lectura, operaciones de administración sobre textos |
| Recorridos | `/metodo-<disciplina>` | Dos operaciones por disciplina: obtener el documento del usuario y actualizarlo parcialmente |
| Progreso | `/recorrido-progreso` | Consultar la posición alcanzada y avanzar |
| Notas | `/notas` | Crear, listar y eliminar notas personales |
| Pagos | `/payment` | Crear sesión de pago y verificar el resultado, por disciplina y por tipo de producto; recepción del aviso firmado de la pasarela |
| Cursos | `/cursos` | Listado público, listado completo de administración, detalle, alta, edición y baja |
| Vídeos | `/videos` | Listado, detalle y operaciones de administración |
| Estudio | `/estudio` | Alta de participante, envío de respuestas, resultados agregados y estadísticas |
| Suscripción | `/subscribe` | Alta, baja y listado de administración |
| Reservas | `/booking` | Consultar huecos ocupados y reservar |
| Contacto | `/contact` | Envío del formulario |
| Opiniones | `/opinion` | Alta y listado |
| Subida de ficheros | `/upload` | Fotografía de perfil, imágenes de genograma y portadas |

Dos criterios de diseño gobiernan toda la API:

**Los recorridos comparten interfaz.** Las ocho disciplinas exponen exactamente las mismas dos operaciones: una lectura y una actualización parcial del documento. Esto permite que el cliente use un único mecanismo de guardado para todas, y es la contrapartida en el servidor del sistema común de recorridos del apartado 8.5.

**El cliente nunca envía dinero.** En todas las operaciones de pago, el cuerpo de la petición contiene únicamente el identificador del producto; el importe lo determina el servidor a partir de tablas propias (R-07). El aviso de la pasarela se verifica criptográficamente sobre los bytes exactos recibidos, para lo cual el servidor conserva el cuerpo sin procesar de esa petición concreta.

## 8.4. Diseño de la arquitectura tecnológica

Las tecnologías comparadas en el apartado 4.4 se reparten sobre la arquitectura anterior como muestra la Figura 7.

[FIGURA 7: pila tecnológica por niveles]

*Figura 7. Pila tecnológica repartida sobre la arquitectura conceptual.*
*(Fuente propia)*

**Cliente.** React 19 con TypeScript, construido con Vite. El enrutado se resuelve con React Router y, de forma deliberada, **cada página se carga de manera diferida**: cada pantalla viaja en su propio fragmento de código y se descarga solo al entrar en ella. Esta decisión no es un adorno de rendimiento, sino la respuesta a un problema real descrito en el capítulo 9: la aplicación llegó a producir un único paquete de 6 MB que había que descargar entero para ver la portada.

**Servidor.** NestJS sobre Node.js, con módulos por área funcional. Incorpora cabeceras de seguridad, restricción de orígenes configurable por variable de entorno —para poder estrenar dominio sin volver a publicar— y limitación de peticiones por dirección de origen. El servidor declara explícitamente que confía en el proxy del proveedor de despliegue: sin esa configuración, todas las peticiones parecerían venir de la misma dirección y el límite se aplicaría a todos los usuarios en común, lo que dejaría la plataforma fuera de servicio con apenas unas pocas personas dentro.

**Persistencia.** PostgreSQL gestionado y almacenamiento de objetos.

**Despliegue.** Sitio estático para el cliente y servicio web para el servidor, ambos publicados automáticamente desde la rama principal del repositorio.

## 8.5. Diseño de la interacción

### 8.5.1. El mapa: ocho puertas sin orden obligatorio

La primera decisión de interacción fue **no imponer un camino entre disciplinas**. La página de bienvenida presenta las ocho como iguales, y cada una se abre cuando el usuario quiere. Existe un orden recomendado —el que sigue la numeración— pero es un consejo, no una puerta cerrada.

El motivo es comercial y pedagógico a la vez: obligar a comprar Astrología para poder acceder a Nutrición convertiría el producto en una escalera, y quien llega interesado en nutrición se iría. Dentro de cada disciplina, en cambio, el orden sí es obligatorio, porque cada paso se apoya en el anterior.

Al pulsar una disciplina se llega a su **portada común**, con tres puertas: *Ilustraciones*, *Cursos* y *El Recorrido*. Las dos primeras son públicas; la tercera exige haber adquirido la disciplina.

### 8.5.2. El Recorrido: la unidad de diseño

Todo el producto gira alrededor de una misma estructura, que se diseñó una vez y se reutiliza ocho veces (SO-2):

**Cabecera de paso.** Siempre en el mismo sitio: el icono de la disciplina —con un movimiento suave de flotación—, el título del paso, y a los lados los botones de navegación: anterior, índice y siguiente.

**Cuerpo del paso.** El contenido, que puede ser texto, un test, un mapa interactivo, un formulario o una ilustración.

**Botones de final de página.** Fuera de la caja de contenido, siempre en la misma posición: **avanzar abajo a la derecha, volver abajo a la izquierda**. Esta regla se rompió al principio en varias pantallas y producía una desorientación constante; unificarla en un único componente fue una de las mejoras de usabilidad más rentables del proyecto (RNF-01).

**Índice.** Accesible desde la cabecera. Muestra todos los pasos de la disciplina e indica hasta dónde puede llegar el usuario. Un detalle de diseño importante: el índice **no** ofrece únicamente los pasos ya visitados, sino todos los *alcanzables* —aquellos cuyas condiciones previas se cumplen—, de forma que quien vuelve tras varios días pueda saltar directamente a donde lo dejó sin recorrer de nuevo lo leído.

**Desbloqueo por lectura.** Un paso se habilita cuando el anterior se ha recorrido, no cuando se ha superado con una nota. Las únicas puertas duras del sistema son los tests cuyo resultado determina el resto del recorrido —el de constitución ayurvédica y el de constitución en Medicina China—, que son obligatorios porque sin ellos los pasos siguientes no tendrían qué mostrar (RF-24).

La Figura 8 muestra estas cuatro piezas funcionando juntas en un paso real del recorrido de Astrología: la cabecera con el icono de la disciplina y el contador de posición, los botones de navegación a los lados y, a la derecha, el botón de avance todavía deshabilitado con el motivo escrito en él —«Lee los tres para continuar»—. Decir *por qué* no se puede avanzar, en lugar de limitarse a desactivar el botón, evita que el usuario se quede bloqueado sin saber qué le falta.

![Paso del recorrido de Astrología con la cabecera, los botones de navegación y el avance bloqueado](figuras/fig08-cabecera-paso-desbloqueo.png)

*Figura 8. Cabecera de paso y desbloqueo por lectura: el botón de avance indica qué falta para habilitarse.*
*(Fuente propia)*

[FIGURA 9: mapa de interacciones del recorrido]

*Figura 9. Mapa de interacciones de un recorrido tipo.*
*(Fuente propia)*

### 8.5.3. El cómic: cómo se lee lo que hay que leer

Un recorrido de veinte pantallas de párrafos no se termina. La solución adoptada es el **cómic inmersivo**: un visor a pantalla completa con la ilustración a la izquierda y el texto a la derecha, que el usuario hace avanzar a su ritmo y que puede abandonar en cualquier momento.

Los cómics aparecen en tres situaciones:

- **Al entrar en una disciplina** (el cómic del Origen), como introducción a la materia.
- **Intercalados entre dos pasos**, cuando hay contexto que conviene dar antes de continuar.
- **Como contenido en sí mismo**, en los casos en que el texto es narrativo: cada chakra, por ejemplo, se lee dentro de su propio cómic y no en una página.

Todo lo que contiene una ilustración de fondo —no solo los cómics— sigue la misma estructura visual: imagen a la izquierda, texto grande a la derecha con desplazamiento propio. La coherencia de ese patrón en las ocho disciplinas es lo que hace que el producto se perciba como una sola cosa (RF-26).

### 8.5.4. Guardado y recuperación

El progreso se guarda de forma continua y automática. El usuario nunca pulsa «guardar». Dos reglas de diseño sostienen esta promesa (RF-21, RF-22, SO-3):

**Siempre se prerrellena.** Al entrar en cualquier pantalla se consulta lo que el usuario ya contestó y se muestra rellenado. No se le pregunta dos veces por lo mismo.

**Se espera al guardado antes de navegar.** Si la pantalla siguiente comprueba un indicador que acaba de escribirse, navegar antes de que el guardado llegue al servidor produce un rebote: la aplicación devuelve al usuario al paso anterior porque, para el servidor, todavía no lo ha completado. El sistema incorpora por ello un mecanismo de vaciado de la cola de guardado que se invoca antes de cambiar de pantalla.

### 8.5.5. Animación y percepción de velocidad

Las animaciones de entrada están ligadas a la aparición del elemento en pantalla, no al montaje de la página: nada que esté por debajo del pliegue se anima hasta que el usuario llega a ello. Los elementos de una misma fila aparecen con un desfase de aproximadamente un tercio de segundo, lo que produce una cascada legible sin resultar lenta.

Las pantallas de carga son propias de cada disciplina —la manzana en Nutrición, la estrella en Astrología— y fuera del recorrido se usa el mandala de la marca. La pantalla de carga se muestra mientras se descarga el fragmento de código de la página y mientras se precargan las ilustraciones necesarias, de modo que el contenido nunca aparece a medias.

## 8.6. Diseño de las interfaces

### 8.6.1. Proceso seguido

El diseño de interfaz se abordó con **prototipos de fidelidad creciente**: bocetos rápidos para decidir la disposición de cada pantalla nueva, y prototipos de alta fidelidad únicamente para las pantallas que se repiten (la cabecera de paso, la caja con ilustración, la tarjeta de disciplina, el visor de cómic), porque esas se construyen una vez y se usan cientos.

Para el resto de pantallas se optó deliberadamente por **prototipar en el propio código**. Con una sola persona en el proyecto, dibujar una pantalla en una herramienta de diseño y después construirla supone hacer el mismo trabajo dos veces; teniendo ya construidos los componentes comunes, montar una pantalla nueva con ellos es casi tan rápido como dibujarla y produce algo que funciona.

### 8.6.2. Catálogo de componentes comunes

El sistema se apoya en un catálogo de componentes que resuelven, cada uno, una decisión visual que se repite (RNF-10):

[TABLA 16: componentes comunes]

*Tabla 16. Componentes comunes reutilizados en las ocho disciplinas.*

| Componente | Función |
|---|---|
| Cabecera de paso | Icono flotante, título y botones de navegación del recorrido |
| Botón de paso | Avanzar (abajo derecha) y volver (abajo izquierda), fuera de la caja de contenido |
| Marca de leído | Círculo con el color de fondo de la disciplina y tick con su color de texto, arriba a la derecha del elemento |
| Visor de cómic | Ilustración, texto con desplazamiento propio, barra de desplazamiento propia y botones de saltar y continuar |
| Caja con ilustración | Imagen a la izquierda, texto grande a la derecha; misma estructura que el cómic, sin separador |
| Tarjeta con fotografía | Imagen arriba, línea, título abajo a la izquierda; la tarjeta entera es el botón, sin botón «ver» |
| Índice de recorrido | Lista de pasos con indicación de hasta dónde se puede llegar |
| Pantalla de carga | Animación propia de cada disciplina durante la descarga del fragmento y la precarga de imágenes |
| Panel animado | Caja con balanceo en reposo y realce al pasar por encima, usada en las páginas de doṣha |
| Ficha modal | Ventana común para células, consejos y sistemas en Fisiología |

### 8.6.3. El taller de documentos PDF

La generación de los documentos personales (RF-42 a RF-44) exigió construir una pieza propia que merece un apartado, porque es uno de los componentes más delicados del sistema.

La biblioteca elegida dibuja en el documento, pero **no maqueta**: no hay saltos de línea automáticos, ni saltos de página, ni control de viudas. Todo eso hay que calcularlo. El taller construido resuelve ese problema con una arquitectura de dos pasadas: primero se **mide** el contenido para saber cuánto espacio ocupa y dónde hay que partir la página, y después se **pinta**. La clave del diseño es que ambas pasadas ejecutan exactamente el mismo código, con un indicador que decide si se dibuja o solo se acumulan medidas; cualquier otra solución produce documentos en los que la medida y el resultado se desincronizan.

El taller se compone de un módulo de composición de apuntes, uno de formas geométricas, uno de imágenes, uno de glifos dibujados y uno de temas visuales, y da servicio a los generadores de las ocho disciplinas.

Dos limitaciones del formato, descubiertas durante el desarrollo y documentadas para quien continúe el proyecto: la tipografía serif embebida **no incluye** algunos caracteres que se usan habitualmente en los textos —flechas, marcas de verificación, diacríticos de la transliteración sánscrita, alfabeto hebreo—, que desaparecen sin dar ningún error; y la gestión de transparencia solo afecta a los rellenos, no a los trazos.

## 8.7. Guía de estilos

### 8.7.1. Color

La identidad visual se apoya en un **fondo turquesa** (`#008080`) que es constante en toda la plataforma. Es la regla más estricta del sistema: el fondo de página es siempre ese color, y **nunca** una imagen a pantalla completa. Las ilustraciones aparecen dentro de cajas, nunca detrás del contenido.

Sobre ese fondo, cada disciplina aporta su propio par de colores: uno de fondo, para cajas, líneas y botones, y otro de texto, exclusivamente para la letra dentro de esas cajas.

[TABLA 17: paleta por disciplina]

*Tabla 17. Paleta de color de cada disciplina.*

| Disciplina | Color de fondo | Color de texto |
|---|---|---|
| Astrología | `#1e296b` | `#feffe4` |
| Psicología | `#daa889` | `#5e2d10` |
| Ayurveda | `#ffffff` | `#853e0b` |
| Medicina China | `#6b0404` | `#ffa2a2` |
| Fisiología | `#331c35` | `#c8b5d1` |
| Nutrición | `#e4f8e1` | `#2b362a` |
| Cábala | `#3b2612` | `#bd814d` |
| Cultura | `#0c3c3c` | `#79dcd4` |

Tres reglas gobiernan el uso del color y se aplican sin excepción:

**El color de texto de una disciplina solo se usa para letra.** Todo lo demás —cajas, bordes, líneas, botones— usa el color de fondo. Confundir ambos produce composiciones ilegibles.

**Fuera de las cajas, el texto es blanco y sin sombra.** Sobre el turquesa, el color de disciplina no contrasta lo suficiente.

**Ningún halo claro.** Los realces y sombras usan únicamente el color de acento de la disciplina; los halos blancos o claros producen sobre el turquesa un efecto de caja desvaída que rompe la unidad visual.

Para la legibilidad sobre ilustración se usa, por defecto, sombra de texto negra; el velo oscurecedor sobre la imagen se reserva a los dos casos donde la ilustración es demasiado clara para que la sombra baste.

### 8.7.2. Tipografía

La plataforma usa una **tipografía serif** como cuerpo de texto, en coherencia con el carácter del producto —un camino largo que se lee, no una aplicación de consumo rápido— y frente a la tendencia dominante de tipografías de palo seco. Los documentos PDF usan una serif clásica embebida.

### 8.7.3. Interacción visual

- **Nada azul al pulsar.** El resaltado nativo del navegador al tocar, el anillo de foco por defecto de la biblioteca de componentes y el color de selección de texto se sustituyen por los de la marca.
- **El pie de página siempre abajo.** Toda página de ruta usa una altura mínima de pantalla completa con el contenido en crecimiento, para que el pie no suba cuando el contenido es corto.
- **Sin adornos en los títulos.** No se usan símbolos decorativos en titulares ni viñetas; como mucho, una línea fina.
- **Modo oscuro del navegador desactivado.** El sistema declara explícitamente esquema de color claro, porque el ajuste automático de algunos navegadores altera los iconos e imágenes de la interfaz.

### 8.7.4. Adaptación a móvil

Toda la plataforma es adaptativa (RNF-02). Dos decisiones concretas merecen mención: las barras de desplazamiento dentro de los cómics son **propias y no del navegador**, porque en móvil las nativas no se ven y el usuario no sabe que el texto continúa; y los visores de ilustración a pantalla completa desactivan el desplazamiento vertical de la página desde un único punto del código, para que no aparezca nunca una segunda barra detrás del visor.

## 8.8. Diseño de las pruebas y la validación

Dado que el objetivo del proyecto no es el diseño de un sistema de pruebas, la estrategia se centró en obtener garantías suficientes con un coste proporcionado, combinando cuatro niveles.

**Pruebas de la API.** Colección de peticiones mantenida durante el desarrollo, con un caso correcto y un caso erróneo por cada operación relevante, que permite comprobar de una pasada que un cambio no ha roto nada. La atención se concentra en los tres puntos críticos: la autorización de acceso a cada disciplina, la verificación del aviso de pago y la lectura y escritura de los documentos de recorrido.

**Pruebas de recorrido completo.** Cada disciplina se recorre entera, de principio a fin, antes de darse por terminada, comprobando en cada paso que el progreso se guarda, que las respuestas se prerrellenan al volver y que el documento final se genera con los datos correctos. Esta es la prueba que más defectos ha detectado.

**Pruebas con usuarios reales.** Un grupo reducido de personas ajenas al proyecto recorre una disciplina completa y responde después un cuestionario sobre claridad de la navegación, comprensión del contenido, utilidad del documento obtenido y dificultades encontradas. El cuestionario se diseñó para responder a preguntas concretas del producto y no de forma genérica: dónde se atascan, si entienden qué es cada disciplina antes de comprarla, y si el documento final les parece valioso.

**Indicadores de rendimiento y peso.** Se fijan umbrales medibles: tamaño del fragmento inicial de código, peso total del material servido por pantalla y consumo mensual de ancho de banda frente al límite del plan de despliegue. Estos indicadores existen porque el riesgo R-04 se consideró probable desde el principio.

El diseño y los resultados concretos de estas pruebas se detallan en el capítulo 10.
# 9. Implementación

Este capítulo documenta el desarrollo real del proyecto, organizado en las ocho fases en que efectivamente se produjo. No coincide del todo con la planificación del capítulo 3, y esa diferencia es en sí misma un resultado: se analiza en el apartado 11.2.

El historial de control de versiones registra **541 versiones** entre febrero y septiembre, repartidas de forma muy desigual: hay un mes que concentra casi un tercio de todo el trabajo registrado del proyecto. Cada fase se documenta con su objetivo, lo que se construyó, los problemas que aparecieron y las decisiones que se tomaron.

## 9.1. Fase 0 — Entorno y esqueleto (febrero)

**Objetivo:** tener una aplicación que arranque, se despliegue y guarde algo.

Se creó el repositorio, se montó la estructura de carpetas y se validó la pila tecnológica completa antes de construir nada de producto, en aplicación directa del plan de prevención del riesgo R-07.

La primera decisión que hubo que rectificar fue la base de datos. El proyecto arrancó contra una base de datos MySQL local servida por XAMPP —la configuración habitual del entorno de aprendizaje— y llegó a funcionar. El problema apareció al pensar en el despliegue: una base de datos local no sirve para una aplicación publicada, y alquilar un servidor propio contradecía la restricción de presupuesto (R-02). Se migró a PostgreSQL gestionado. La migración costó poco porque se hizo pronto, que es exactamente el motivo por el que la fase 0 existe.

Se construyeron en esta fase el registro y el inicio de sesión con credencial de sesión firmada, el modelo de usuario, la subida de fotografía de perfil, la portada, el logotipo y la identidad visual base, y las primeras páginas informativas.

**Lo que se aprendió:** validar el despliegue en la primera semana, y no en la última, habría sido aún mejor. Varias decisiones de la fase 1 se tomaron sin saber todavía qué limitaciones imponía el entorno de publicación.

## 9.2. Fase 1 — La capa pública (marzo–abril)

**Objetivo:** que la plataforma tenga algo que enseñar antes de tener recorridos.

Esta fase construyó todo lo que se ve sin haber comprado nada: el catálogo de cursos con sus lecciones en vídeo y en texto, las páginas de materiales descargables, la sección de productos, las opiniones, el formulario de contacto y el primer panel de administración.

Se añadió también el acceso mediante cuenta de Google, que reduce la fricción del registro. Su implementación obligó a resolver el retorno del flujo de autorización en una aplicación de una sola página, donde el proveedor redirige a una dirección que la aplicación debe interceptar para recoger la credencial.

Abril fue el mes de menor actividad registrada de todo el proyecto: 27 versiones frente a las 67 de marzo. La razón no fue una parada, sino un cambio de naturaleza del trabajo: buena parte de abril se dedicó a **producir contenido** —cursos, textos, ilustraciones— que no genera código y, por tanto, no aparece en el historial. Es la limitación de medir el esfuerzo por versiones registradas que ya se advertía en el apartado 6.3.3.

## 9.3. Fase 2 — Astrología: la primera disciplina (mayo)

**Objetivo:** el primer recorrido completo, de principio a fin, con su documento final.

Esta es la fase que definió la forma del producto. Todo lo que después se reutilizó ocho veces se inventó aquí.

### 9.3.1. El cálculo de la carta natal

La pieza técnicamente más exigente del proyecto. El servicio recibe fecha, hora y lugar de nacimiento y devuelve la carta completa. El proceso tiene cuatro pasos:

1. **Resolver el lugar.** El nombre del lugar de nacimiento se convierte en coordenadas mediante un servicio de geocodificación abierto.
2. **Resolver la hora real.** A partir de las coordenadas se determina la zona horaria **histórica** —no la actual— y se convierte la hora local a tiempo universal. Este paso es crítico: una hora de error desplaza el ascendente unos quince grados, lo que en muchos casos cambia el signo. Los cambios de huso y de horario de verano a lo largo del siglo XX hacen que este cálculo no sea trivial.
3. **Calcular posiciones.** Se obtienen las longitudes eclípticas de los diez cuerpos del sistema solar, más los puntos angulares y las cúspides de las casas.
4. **Calcular aspectos.** Se comparan todos los pares de cuerpos buscando las siete separaciones angulares consideradas —conjunción, semisextil, sextil, cuadratura, trígono, quincuncio y oposición— dentro de un margen de tolerancia.

El cuarto paso obligó a una decisión de diseño que no era evidente. El margen de tolerancia (el *orbe*) no es una constante: depende del aspecto y de la categoría del cuerpo. Se implementó una tabla completa de orbes por categoría —planetas, nodos, asteroides, puntos angulares, cúspides— siguiendo el criterio de una referencia establecida del sector, y una regla para los casos mixtos: cuando dos cuerpos de categorías distintas forman un aspecto, se usa el **menor** de los dos orbes. Toda la tabla está aislada en constantes documentadas, de forma que cambiar el criterio sea editar unos números y no reescribir el algoritmo.

### 9.3.2. El recorrido y el desbloqueo por lectura

Sobre la carta calculada se construyó el recorrido: puntos clave, planetas, casas y aspectos, cada tramo desbloqueado por la lectura del anterior, con el estado de lectura guardado en la base de datos para que sobreviva al cambio de dispositivo.

Aquí se estableció el patrón de desbloqueo que después se aplicó a todo el producto (RF-24), y aquí apareció también el primer cómic: una introducción ilustrada a la historia de la astrología que se muestra al entrar en la disciplina. Funcionó tan bien como recurso de lectura que el cómic pasó de ser un añadido a ser un componente estructural del sistema.

### 9.3.3. El documento en PDF

El generador de la carta astral en PDF fue el primer contacto con el problema descrito en el apartado 8.6.3: la biblioteca dibuja pero no maqueta. La primera versión calculaba las posiciones de forma aproximada y producía documentos con texto cortado y páginas desequilibradas. La reescritura introdujo la arquitectura de dos pasadas —medir y pintar con el mismo código— que después se convirtió en el taller común.

## 9.4. Fase 3 — Psicología y la reescritura de la persistencia (junio)

**Objetivo:** la segunda disciplina; y, sin haberlo previsto, rehacer cómo se guarda todo.

Psicología es el recorrido más largo del producto: veintiséis pantallas que incluyen la línea de vida año a año, el genograma familiar, dos cuestionarios validados y la construcción del mapa personal de huellas, nudos y heridas.

La pieza central es la línea de vida. El usuario indica su edad y el sistema genera una línea temporal con un nodo por año; al pulsar cada nodo se abre la página de ese año con preguntas evocadoras, como muestra la Figura 10. El diseño es deliberadamente el de una página de libro y no el de un formulario: la metáfora —escribir el propio libro autobiográfico— es lo que hace que alguien esté dispuesto a recorrer veintidós años uno a uno. Cualquier año puede marcarse como «sin recuerdos» y continuar, decisión de diseño que se justifica en el apartado 12.3.

![Página de un año de la línea de vida con sus preguntas evocadoras](figuras/fig10-linea-de-vida-ano.png)

*Figura 10. Página de un año dentro de la línea de vida, con las preguntas evocadoras del recorrido de Psicología.*
*(Fuente propia)*

### 9.4.1. El modelo de datos se rompió

Al llegar a las heridas —relaciones entre un número indeterminado de recuerdos y un número indeterminado de creencias, todas creadas por el usuario— quedó claro que el modelo de columnas fijas no aguantaba. La alternativa era construir cinco tablas de relación más, sabiendo que la disciplina siguiente traería otras cinco.

Se tomó la decisión descrita en el apartado 8.1: **un único documento JSONB por disciplina y usuario**. Migrar lo ya construido costó unos días. No haberlo hecho habría hecho imposible terminar seis disciplinas más.

### 9.4.2. Los cuestionarios validados

Se implementaron los cuestionarios ACE —experiencias adversas en la infancia— y DES-II —experiencias disociativas. Ambos son instrumentos reconocidos, y su implementación planteó un problema que no era técnico sino de responsabilidad: **qué se le dice al usuario con el resultado**. La decisión, que se desarrolla en el capítulo 12, fue presentar siempre el resultado acompañado de su interpretación correcta, dejando explícito que se trata de un instrumento de cribado y en ningún caso de un diagnóstico.

El cuestionario DES-II se guardó en tabla propia y no en el documento general, por tratarse de un instrumento con estructura fija y estable sobre el que sí conviene poder consultar de forma agregada.

### 9.4.3. El problema del rebote

Apareció aquí un fallo recurrente que costó tiempo entender: al terminar un paso y avanzar, la aplicación devolvía al usuario al paso anterior. La causa era una condición de carrera: la pantalla siguiente comprobaba en el servidor un indicador que el guardado de la pantalla anterior todavía no había llegado a escribir. La solución fue un mecanismo explícito de vaciado de la cola de guardado, que se invoca antes de navegar (apartado 8.5.4).

## 9.5. Fase 4 — Ayurveda y la extracción del sistema común (finales de junio)

**Objetivo:** la tercera disciplina; y comprobar si el producto era replicable.

Esta fase fue la prueba de la apuesta declarada en el apartado 3.3. Se construyó el test de constitución, el recorrido del doṣha resultante y sus pantallas —cuerpo, desequilibrio, cuidados, estilo de vida, rutina diaria, respiración—, pero el trabajo principal no fue ese, sino **extraer a componentes comunes todo lo que ya se había escrito dos veces**: la cabecera de paso, los botones de avance, la marca de leído, el índice, el visor de cómic, la pantalla de carga.

El resultado confirmó la hipótesis: a partir de esta fase, construir una disciplina nueva pasó a ser mayoritariamente escribir contenido y colocar componentes ya existentes. Sin esta extracción el proyecto habría terminado con cuatro disciplinas, no con ocho.

Se introdujo también aquí el test como **puerta obligatoria**: sin constitución determinada, los pasos siguientes no tienen qué mostrar, así que el sistema impide avanzar. Es una de las dos únicas puertas duras del producto.

## 9.6. Fase 5 — El lanzamiento público (julio)

**Objetivo:** convertir un proyecto en un producto publicado.

Julio concentra **174 versiones registradas**, casi un tercio del total del proyecto. Fue el mes en que todo lo que faltaba para poder abrir la puerta al público se construyó a la vez.

### 9.6.1. Pagos

Se integró la pasarela de pago con tres decisiones de diseño que resultaron acertadas:

**El precio lo fija el servidor.** El navegador envía únicamente el identificador del producto. Un cliente manipulado no puede comprar una disciplina por un céntimo (R-07).

**Acreditación redundante.** El acceso se concede por dos caminos independientes: el aviso firmado que la pasarela envía al servidor, y una verificación explícita cuando el usuario vuelve del pago. Si uno falla, el otro acredita la compra. Y si fallan los dos, existe un tercer recurso: la concesión manual desde el panel de administración.

**Verificación criptográfica sobre el cuerpo sin procesar.** La firma del aviso se calcula sobre los bytes exactos que envía la pasarela, de modo que el servidor debe conservar el cuerpo original de esa petición concreta además del objeto ya interpretado. Es un detalle fácil de pasar por alto que invalida silenciosamente toda la verificación.

Durante el desarrollo existió un mecanismo de «pago de prueba» que concedía el acceso sin cobrar. Antes de la publicación se **eliminó por completo del código**, tanto del cliente como del servidor, y se sustituyó por dos vías legítimas de acceso gratuito: una lista de correos con acceso concedido y el panel de concesión manual. Dejar un atajo de desarrollo en una aplicación publicada es una de las formas más habituales de regalar un producto sin darse cuenta.

### 9.6.2. Cuentas, legales y consentimiento

Se completó la recuperación de contraseña por correo, la eliminación de cuenta con borrado efectivo de todos los datos asociados, las cuatro páginas legales y el aviso de cookies con consentimiento previo: no se carga ningún recurso de analítica hasta que el usuario acepta, y la elección se recuerda entre visitas (RF-19, RNF-09).

El borrado de cuenta planteó un problema concreto: la base de datos no borra en cascada, de modo que eliminar la fila del usuario dejaba huérfanos sus ocho documentos de recorrido, sus notas y sus imágenes. Se implementó un borrado explícito con una lista de tablas relacionadas mantenida en un único punto del código, con una advertencia documentada: **toda tabla nueva que guarde un identificador de usuario debe añadirse a esa lista**.

### 9.6.3. Seguridad del servidor

Se añadieron cabeceras de seguridad, restricción de orígenes configurable mediante variable de entorno —para poder estrenar dominio sin volver a publicar— y limitación de peticiones por dirección de origen.

Esta última tenía un fallo grave que se detectó antes de publicar: en el entorno de despliegue, las peticiones llegan a través de un balanceador, de modo que sin configurar explícitamente la confianza en el proxy **todas las peticiones parecían venir de la misma dirección**. El límite se habría aplicado a todos los usuarios en común y la plataforma se habría bloqueado con cuatro personas dentro.

### 9.6.4. Robustez de los datos

Con usuarios reales a la vista, apareció la contrapartida del modelo documental: **los datos guardados con formas antiguas rompían el pintado de la pantalla**, dejando la página en blanco. El caso típico: un campo que en una versión anterior era un texto y que la versión nueva recorre como lista.

Se abordó en dos frentes. Primero, **blindar la lectura**: comprobar el tipo de cada campo antes de usarlo, y no solo el que dio problemas la primera vez, porque el siguiente fallo siempre viene de otro campo. Segundo, **una barrera de error global** que captura cualquier fallo de pintado y muestra una pantalla de error legible en lugar de una página vacía. Un error que se ve es un error que se puede contar; una página en blanco no.

### 9.6.5. Rendimiento: el paquete de 6 MB

Al preparar la publicación se descubrió que la aplicación producía **un único paquete de código de 6 MB** que el navegador tenía que descargar entero antes de poder pintar la portada.

La solución fue la **carga diferida por ruta**: cada pantalla viaja en su propio fragmento y se descarga solo al entrar en ella. Se dejaron deliberadamente fuera de la carga diferida las piezas que deben poder pintarse antes de que llegue todo lo demás, empezando por la propia pantalla de carga. Este es uno de esos casos en que la solución es de una línea por pantalla, pero solo funciona si la arquitectura lo permitía desde el principio.

## 9.7. Fase 6 — Fisiología, Nutrición, Cábala y el resto del contenido (agosto)

**Objetivo:** completar el catálogo de disciplinas y resolver el peso del material.

Agosto registra 108 versiones y es la fase en que la inversión de la fase 4 rindió: tres disciplinas nuevas —Fisiología, con su viaje de la partícula al organismo; Nutrición, con el cálculo de necesidades y el diseño del día alimentario; Cábala, con el Árbol de la Vida— más ampliaciones sustanciales de las existentes (los chakras en Ayurveda, la rueda de las emociones en Psicología).

### 9.7.1. Adelgazar el proyecto

El riesgo R-04 se materializó: el material público del proyecto alcanzó **459 MB**, muy por encima de lo que el plan de despliegue permite servir cómodamente cada mes.

Se construyeron dos herramientas propias de línea de comandos, una para imágenes y otra para vídeo, que recomprimen el material aplicando conversión a formato moderno y ajuste de calidad. El resultado fue reducir el material de **459 MB a 265 MB**, algo más del 40 %, sin pérdida perceptible de calidad. Ambas herramientas quedaron incorporadas al flujo de trabajo: todo material nuevo pasa por ellas antes de publicarse.

### 9.7.2. Internacionalización

Se construyó un sistema de traducción propio en lugar de adoptar una biblioteca externa. La razón es la forma del contenido: no son cadenas cortas de interfaz, sino textos largos, cómics y recorridos enteros, para los que el modelo de una biblioteca convencional resulta incómodo.

El sistema adoptado tiene una regla central: **el español es la fuente de verdad y el inglés es parcial con respaldo automático**. Lo que no esté traducido se sirve en español en lugar de aparecer vacío o como una clave sin resolver. Se decidió además que los nombres de las disciplinas **no se traducen**, porque forman parte de las direcciones de las páginas y traducirlos rompería todos los enlaces existentes.

### 9.7.3. El taller común de PDF

Con seis generadores de documento escritos, las coincidencias eran evidentes. Se extrajo un taller común con los módulos descritos en el apartado 8.6.3 y se reescribieron los generadores existentes sobre él.

Durante esa reescritura se documentaron las dos limitaciones del formato que más tiempo habían costado: que la tipografía embebida se come silenciosamente ciertos caracteres —flechas, marcas de verificación, diacríticos sánscritos, hebreo—, y que el ajuste de transparencia solo afecta a los rellenos y no a los trazos. Ambas están ahora anotadas en el código, que es donde sirven.

## 9.8. Fase 7 — Cultura, Medicina China y pulido final (septiembre)

**Objetivo:** cerrar las dos disciplinas pendientes y dejar el producto presentable.

### 9.8.1. El rediseño del diagnóstico de Medicina China

El diagnóstico por elementos se había implementado inicialmente como dos estados posibles —exceso y deficiencia—, siguiendo la presentación habitual de la materia. Al recorrerlo entero quedó claro que el resultado era confuso: un mismo usuario podía salir con exceso y deficiencia del mismo elemento, lo que no ayudaba a nadie.

Se rediseñó por completo: **un único estado por elemento**, calculado como la diferencia entre la carga que arrojan dos cuestionarios y los recursos que arroja un tercero, con un umbral configurado por debajo del cual el elemento se considera equilibrado. El resultado es una sola cifra por elemento, interpretable de un vistazo.

Este rediseño ilustra algo que se repitió a lo largo del proyecto: **los fallos de diseño no aparecen construyendo, aparecen recorriendo**. Ninguna prueba unitaria habría detectado que el resultado era confuso.

### 9.8.2. Cultura y el material gráfico

La octava disciplina organiza la historia universal, de las religiones, de la filosofía y de la medicina en dos niveles: eras y sub-hitos dentro de cada era. Es la disciplina con más volumen de texto y la que más ilustración necesitó.

La colocación de casi dos mil ilustraciones en sus sitios correspondientes se resolvió con herramientas propias: un guion que recorre el código buscando referencias a imágenes que todavía no existen y produce la lista de lo que falta, y otro que reconoce y coloca automáticamente el material nuevo. Sin ellas, mantener el inventario al día habría sido inviable.

### 9.8.3. Pulido de móvil

La última semana se dedicó íntegramente a la experiencia en teléfono: tarjetas de la misma altura dentro de una fila, títulos que no parten en dos líneas, eliminación del resaltado azul nativo al tocar, ajuste del visor de programas y de la página de libros. Son cambios pequeños uno a uno, y determinantes en conjunto: la mayoría de los usuarios de prueba entraron desde el teléfono.

## 9.9. Herramientas propias desarrolladas

Un resultado colateral del proyecto es un conjunto de utilidades de línea de comandos construidas para resolver problemas que aparecían de forma repetida:

[TABLA 18: herramientas propias]

*Tabla 18. Herramientas de apoyo desarrolladas durante el proyecto.*

| Herramienta | Función |
|---|---|
| Inventario de material gráfico | Recorre el código buscando referencias a imágenes inexistentes y produce la lista de lo que falta |
| Optimizador de imágenes | Convierte y recomprime el material gráfico a formato moderno por lotes |
| Optimizador de vídeo | Recomprime el material audiovisual antes de publicarlo |
| Colocador de ilustraciones | Reconoce el material nuevo y lo coloca en su ruta correspondiente |
| Volcado y carga del catálogo de cursos | Sincroniza el catálogo entre el código y la base de datos |
| Conversor de programas | Transforma las presentaciones exportadas en las diapositivas que sirve el visor |
| Generador de cierre de vídeo | Produce la animación de marca para los vídeos cortos |
| Detector de traducciones pendientes | Localiza los textos que faltan por traducir |
# 10. Pruebas y validación

<!-- AVISO IMPORTANTE PARA LA AUTORÍA
     Este capítulo describe el plan de pruebas realmente aplicado durante el
     desarrollo (apartados 10.1 a 10.3), que sí está documentado en el proyecto.
     El apartado 10.4 (validación con usuarios reales) contiene el DISEÑO del
     cuestionario y los huecos marcados donde deben ir los datos obtenidos.
     NO inventar cifras: si la prueba con usuarios no llega a hacerse a tiempo,
     lo correcto es declararlo así y trasladarla a trabajo futuro. Un tribunal
     valora más una limitación reconocida que un dato sin respaldo. -->

El objetivo de este capítulo es doble: comprobar que el sistema hace lo que debe hacer (verificación) y comprobar que lo que hace resuelve el problema planteado (validación). Se aplicaron cuatro niveles de prueba, de menor a mayor coste y de menor a mayor valor.

## 10.1. Pruebas de la API

Durante todo el desarrollo se mantuvo una colección de peticiones contra la API, con al menos un caso correcto y un caso erróneo por cada operación relevante. Ejecutarla completa tras un cambio permite detectar en un par de minutos si algo ha dejado de funcionar.

La atención se concentró en los tres puntos donde un fallo tiene consecuencias graves:

**Autorización de acceso.** Se comprobó de forma sistemática que un usuario sin la disciplina adquirida recibe una respuesta de acceso denegado en todas las operaciones de esa disciplina, y no solo en la pantalla. Es la prueba más importante del sistema: si el servidor devolviera los datos, ocultar la pantalla en el cliente no protegería nada.

**Verificación del pago.** Se validó el flujo completo en modo de pruebas, incluyendo los casos anómalos: aviso de la pasarela con firma inválida (debe rechazarse), aviso duplicado (no debe conceder el acceso dos veces ni cobrar dos veces) y usuario que cierra el navegador antes de volver del pago (el acceso debe concederse igualmente por el aviso del servidor).

**Lectura y escritura de recorridos.** Se comprobó que la actualización parcial del documento no borra el resto del contenido —el fallo más peligroso de este modelo de datos— y que un usuario no puede escribir en el documento de otro.

## 10.2. Pruebas de recorrido completo

Cada disciplina se recorrió entera, de principio a fin, antes de darse por terminada, con una lista de comprobación fija en cada paso:

- El progreso se guarda y aparece reflejado al volver a entrar.
- Las respuestas previas se muestran prerrellenadas (RF-22).
- El botón de avance solo aparece cuando corresponde.
- El índice refleja correctamente hasta dónde se puede llegar (RF-23).
- El documento final se genera con los datos correctos y sin texto cortado.
- Nada produce desplazamiento horizontal en pantalla de teléfono (RNF-02).

**Este nivel de prueba es el que más defectos ha detectado del proyecto**, y con diferencia. Los fallos que encuentra no son errores de programación aislados, sino problemas de diseño que solo se manifiestan al encadenar pantallas: el rebote por condición de carrera del apartado 9.4.3, la incoherencia en la posición de los botones de avance, y el diagnóstico confuso de Medicina China que obligó a rediseñar el cálculo entero (apartado 9.8.1).

La conclusión metodológica es clara y conviene dejarla escrita: en un producto cuya unidad es una secuencia larga de pantallas encadenadas, **ninguna prueba de componente aislado sustituye a recorrer el camino completo como lo haría un usuario**.

## 10.3. Pruebas de robustez y rendimiento

**Robustez frente a datos antiguos.** Se probó de forma deliberada la carga de documentos guardados con formas anteriores, comprobando que el blindaje de lectura y la barrera de error global evitan la página en blanco (RNF-05).

**Peso y carga.** Se midió el tamaño del fragmento inicial de código antes y después de aplicar la carga diferida, y el peso total del material público antes y después de la optimización. Ambas cifras se recogen en el capítulo 11.

**Compatibilidad.** Se comprobó el funcionamiento en navegadores de escritorio basados en los dos motores principales y en navegador móvil, tanto en teléfono real como en emulación, con especial atención a las pantallas estrechas.

[FIGURA 11: comparación del peso del paquete antes y después de la carga diferida]

*Figura 11. Efecto de la carga diferida sobre el tamaño de descarga inicial.*
*(Fuente propia)*

## 10.4. Validación con usuarios reales

### 10.4.1. Diseño de la prueba

La validación con usuarios se diseñó para responder a preguntas concretas del producto, y no de forma genérica. Las cuatro cuestiones que interesaba resolver eran:

1. ¿Se entiende qué es cada disciplina **antes** de comprarla?
2. ¿Dónde se atasca la gente dentro de un recorrido?
3. ¿El documento final se percibe como valioso?
4. ¿Se entiende que unas disciplinas son ciencia y otras tradición?

La cuarta pregunta es tan importante como las otras tres: si el usuario no capta esa distinción, el criterio del capítulo 12 no está funcionando por muy bien redactado que esté el texto.

**Perfil de los participantes.** Personas ajenas al desarrollo, con distinto grado de familiaridad previa con las disciplinas, usando su propio dispositivo.

**Tarea.** Entrar en la plataforma sin instrucciones previas, elegir una disciplina, recorrerla completa y descargar el documento final.

**Instrumento.** Cuestionario posterior en línea, combinando escalas numéricas y respuesta abierta.

### 10.4.2. Cuestionario

[TABLA 19: cuestionario de validación con usuarios]

*Tabla 19. Cuestionario de validación con usuarios reales.*

| Nº | Pregunta | Tipo |
|---|---|---|
| 1 | ¿Desde qué dispositivo has usado la plataforma? | Abierta |
| 2 | Valoración general de la plataforma | 1 a 5 |
| 3 | Antes de entrar en una disciplina, ¿entendías qué ibas a encontrar dentro? | Sí / No / Más o menos |
| 4 | ¿En algún momento no supiste cómo continuar? ¿Dónde? | Abierta |
| 5 | ¿Te has perdido algún contenido por no encontrarlo? | Sí / No |
| 6 | El documento PDF que has descargado, ¿te parece útil? | 1 a 5 |
| 7 | ¿Volverías a abrirlo pasado un tiempo? | Sí / No / No lo sé |
| 8 | ¿Has entendido qué disciplinas se basan en evidencia científica y cuáles son tradiciones históricas? | Sí / No / No me he fijado |
| 9 | ¿Has terminado el recorrido completo? Si no, ¿dónde lo dejaste y por qué? | Abierta |
| 10 | ¿Qué es lo que más te ha gustado? | Abierta |
| 11 | ¿Qué es lo que menos te ha gustado o cambiarías? | Abierta |
| 12 | ¿Pagarías por una disciplina? ¿Cuánto te parecería razonable? | Abierta |

### 10.4.3. Resultados

<!-- COMPLETAR CON LOS DATOS REALES una vez realizada la prueba.
     Estructura recomendada para este apartado:
       · Número de participantes y perfil.
       · Una figura por cada pregunta cerrada (gráfico de barras del formulario).
       · Transcripción agrupada de las respuestas abiertas, separando en dos
         listas: puntos fuertes confirmados y problemas detectados.
       · Tabla final que relacione cada problema detectado con la acción tomada
         (corregido / trasladado a trabajo futuro / descartado y por qué).
     Si la prueba NO llega a realizarse antes de la entrega, sustituir este
     apartado por una declaración honesta de la limitación y trasladar la
     validación al capítulo 13 como primera línea de trabajo futuro. -->

[PENDIENTE DE COMPLETAR CON LOS DATOS DE LA PRUEBA]

[FIGURA 12: resultados agregados del cuestionario de validación]

*Figura 12. Resultados del cuestionario de validación con usuarios.*
*(Fuente propia)*

### 10.4.4. Limitaciones de la validación

Conviene declarar con claridad las limitaciones del diseño de prueba empleado, porque condicionan hasta dónde pueden extenderse sus conclusiones:

- **Tamaño de muestra reducido.** Los resultados son indicativos y no estadísticamente significativos.
- **Sesgo de proximidad.** Los participantes proceden del entorno cercano, lo que tiende a producir valoraciones más favorables de lo que serían las de un usuario que llega sin conocer a nadie.
- **Ausencia de prueba de conversión real.** Se pregunta si pagarían, que no es lo mismo que observar si pagan.
- **Recorridos largos, sesión única.** Algunos recorridos —singularmente el de Psicología— están pensados para varias sesiones a lo largo de días, y una prueba concentrada en una sola sesión no reproduce el uso real.
# 11. Resultados

## 11.1. El producto final

El resultado del trabajo es una plataforma web desplegada y en funcionamiento, con las ocho disciplinas completas, el flujo de compra operativo y el catálogo público accesible sin registro.

### 11.1.1. Cifras del sistema

[TABLA 20: métricas del proyecto]

*Tabla 20. Métricas del sistema desarrollado.*

| Métrica | Valor |
|---|---|
| Versiones registradas en el control de versiones | 541 |
| Periodo de desarrollo | Febrero – septiembre (7 meses) |
| Ficheros TypeScript propios | 839 |
| Líneas de código propio | ≈ 218 200 |
| — de las cuales, en el cliente | ≈ 208 500 (727 ficheros) |
| — de las cuales, en el servidor | ≈ 9 700 (112 ficheros) |
| Rutas declaradas en la aplicación | 187 |
| — de ellas, pantallas de recorrido | 114 |
| Páginas completas | 190 |
| Componentes reutilizables | 205 |
| Módulos del servidor | 30 |
| Controladores / servicios | 28 / 31 |
| Puntos de acceso de la API | 129 |
| Tablas y documentos de base de datos | 17 |
| Generadores de documentos PDF | 9 |
| Visores de cómic ilustrado | 56 |
| Ficheros del sistema de traducción | 46 |
| Ilustraciones y fotografías propias | 1 907 |
| Peso del material público servido | 275 MB |

La proporción entre cliente y servidor —más del 95 % del código en el cliente— es en sí misma un resultado: refleja con precisión la naturaleza del producto, en el que la complejidad está en el recorrido, el contenido y la presentación, mientras que el servidor se limita a guardar documentos, autorizar accesos y hacer los tres cálculos que no pueden estar en el navegador.

### 11.1.2. Reparto por disciplina

[TABLA 21: pantallas por disciplina]

*Tabla 21. Pantallas de recorrido implementadas por disciplina.*

| Disciplina | Pantallas | Contenido característico |
|---|---|---|
| Psicología | 26 | Línea de vida, genograma, ACE, DES-II, mapa de huellas y nudos, rueda de emociones |
| Nutrición | 17 | Nutrientes, plato, cálculo de calorías y macros, diseño del día, microbiota |
| Fisiología | 16 | De la partícula al organismo, sistemas, nivel de profundización |
| Ayurveda | 15 | Test de constitución, recorrido del doṣha, chakras |
| Medicina China | 13 | Cinco elementos, constitución, ciclos, lengua, taoísmo, qigong |
| Astrología | 11 | Carta natal, puntos clave, casas, aspectos, lectura, PDF |
| Cábala | 10 | Árbol de la Vida, sefirot, senderos, diagnóstico |
| Cultura | 6 | Historia universal, de las religiones, de la filosofía y de la medicina |
| **Total** | **114** | |

### 11.1.3. Cumplimiento de los objetivos

[TABLA 22: cumplimiento de objetivos]

*Tabla 22. Grado de cumplimiento de los objetivos planteados en el capítulo 5.*

| Objetivo | Estado | Observación |
|---|---|---|
| Objetivo principal | **Cumplido** | Plataforma desplegada, ocho disciplinas completas, flujo de compra operativo |
| SO-1 · Cálculo de la carta natal | **Cumplido** | Cálculo propio en el servidor con resolución automática de coordenadas y zona horaria histórica |
| SO-2 · Sistema común de recorridos | **Cumplido** | Confirmado empíricamente: las cinco últimas disciplinas costaron una fracción de la primera |
| SO-3 · No perder el progreso | **Cumplido** | Guardado continuo, prerrelleno y vaciado de cola antes de navegar |
| SO-4 · Documento propio por disciplina | **Cumplido** | Nueve generadores sobre un taller común |
| SO-5 · Compra independiente | **Cumplido** | Acreditación redundante y concesión manual de respaldo |
| SO-6 · Catálogo multimedia sin degradar rendimiento | **Cumplido** | Carga diferida por ruta y reducción del material del 40 % |
| SO-7 · Preparación multiidioma | **Cumplido parcialmente** | Sistema construido y funcionando; la traducción al inglés está incompleta por volumen de contenido |
| SO-8 · Distinción ciencia / tradición | **Cumplido** | Criterio aplicado a los textos y al material comercial (capítulo 12) |
| SA-1 a SA-4 · Objetivos de aprendizaje | **Cumplidos** | Se analizan en el capítulo 13 |

De los quince requisitos no funcionales y los cincuenta y seis funcionales especificados, quedan sin completar tres, todos ellos de prioridad *Deseada*: la traducción completa al inglés (RNF-13, parcial), la sección pública de vídeos —construida pero con la ruta desactivada a la espera de contenido suficiente— y la revisión sistemática de accesibilidad (RNF-12), que se ha atendido de forma indirecta al usar una biblioteca de componentes accesible por defecto, pero que no se ha auditado.

## 11.2. Costes temporales y desviaciones

### 11.2.1. Esfuerzo registrado por mes

[TABLA 23: esfuerzo por mes]

*Tabla 23. Versiones registradas por mes y fase asociada.*

| Mes | Versiones | % del total | Fase |
|---|---|---|---|
| Febrero | 44 | 8,1 % | 0 · Entorno y esqueleto |
| Marzo | 67 | 12,4 % | 1 · Capa pública |
| Abril | 27 | 5,0 % | 1 · Capa pública (producción de contenido) |
| Mayo | 55 | 10,2 % | 2 · Astrología |
| Junio | 46 | 8,5 % | 3 y 4 · Psicología y Ayurveda |
| **Julio** | **174** | **32,2 %** | 5 · Lanzamiento público |
| Agosto | 108 | 20,0 % | 6 · Fisiología, Nutrición, Cábala, optimización |
| Septiembre | 20 | 3,7 % | 7 · Cultura, Medicina China, pulido |
| **Total** | **541** | **100 %** | |

La Figura 13 representa esa distribución, que es cualquier cosa menos regular.

[FIGURA 13: gráfico de barras de versiones registradas por mes]

*Figura 13. Distribución del esfuerzo registrado a lo largo del proyecto.*
*(Fuente propia)*

### 11.2.2. Análisis de las desviaciones

El contraste entre la planificación del capítulo 3 y lo que ocurrió deja cuatro conclusiones que conviene analizar con honestidad, porque son el aprendizaje más transferible del proyecto.

**El pico de julio.** Un tercio del trabajo registrado del proyecto se concentra en un solo mes. La causa está identificada: julio fue el mes del lanzamiento público, y **todo lo que no es funcionalidad de producto se había ido aplazando**. Pagos, páginas legales, consentimiento de cookies, borrado efectivo de cuenta, límites de peticiones, rendimiento de carga: ninguna de esas cosas produce una pantalla nueva que enseñar, y por eso ninguna se hizo cuando tocaba. Aplazarlas no las hizo desaparecer; las amontonó.

La lección es concreta: **en la planificación de un producto que va a publicarse, el trabajo de "poder publicarlo" debe tener su propia iteración desde el principio**, y no ser lo que queda por hacer cuando ya no queda tiempo.

**El valle de abril.** La cifra más baja del proyecto, y la más engañosa. Abril no fue un mes vacío: fue un mes dedicado a producir contenido, que no genera código. Confirma la limitación del método de medición declarada en el apartado 6.3.3 y, sobre todo, confirma el riesgo R-03: **el contenido cuesta más de lo que se estima y no se ve en ninguna métrica de desarrollo**.

**La apuesta de la fase 4 salió bien.** Se planificó que las disciplinas 5 a 8 pudieran construirse mucho más rápido que las primeras si se extraía a tiempo un sistema común de recorridos. La comparación lo confirma: Astrología ocupó un mes entero para once pantallas, mientras que agosto produjo tres disciplinas completas más ampliaciones de las existentes. La inversión en abstracción, hecha en el momento adecuado —ni antes, cuando no se sabía todavía qué abstraer, ni después, cuando ya habría cinco copias— fue la decisión técnica más rentable del proyecto.

**El orden de las disciplinas cambió.** La planificación situaba Medicina China en la cuarta posición; terminó siendo la última. El motivo es que su diagnóstico exigía un rediseño conceptual (apartado 9.8.1) que se prefirió abordar con el sistema común ya maduro. La capacidad de reordenar el trabajo sin romper nada es la contrapartida favorable de haber diseñado las disciplinas desacopladas.

## 11.3. Resultados de rendimiento y peso

[TABLA 24: mejoras de rendimiento]

*Tabla 24. Efecto de las optimizaciones aplicadas.*

| Aspecto | Antes | Después | Mejora |
|---|---|---|---|
| Descarga inicial de código | Paquete único de ≈ 6 MB | Fragmento inicial + carga por ruta | La portada ya no exige descargar toda la aplicación |
| Peso del material público | 459 MB | 265 MB | ≈ 42 % |

La primera cifra es la más relevante: antes de la carga diferida, **ver la portada exigía descargar el código de las 187 pantallas de la aplicación**, incluidas las ocho disciplinas que el visitante quizá no hubiera comprado nunca. Después del cambio, cada pantalla viaja en su propio fragmento y se descarga al entrar en ella.

## 11.4. Relación con las competencias del grado

El proyecto ha puesto en práctica, de forma integrada, contenidos repartidos a lo largo de la titulación:

- **Desarrollo web en cliente y en servidor**: toda la arquitectura de la aplicación, el enrutado, la gestión de estado y la API REST.
- **Bases de datos**: el modelo de persistencia, con la particularidad de haber tenido que rectificarlo en producción, y el uso de un tipo documental dentro de una base relacional.
- **Diseño de interfaces y experiencia de usuario**: la guía de estilos, el catálogo de componentes, el mapa de interacción y el diseño adaptativo.
- **Gestión de proyectos**: la planificación por iteraciones, el análisis de riesgos y el contraste posterior entre lo planificado y lo real.
- **Gráficos por computador**: la representación tridimensional de la carta astral y la composición de documentos PDF dibujando primitivas.
- **Producción multimedia**: la creación, organización, optimización y publicación de un catálogo de casi dos mil piezas gráficas.
- **Seguridad y aspectos legales**: autenticación, autorización, cabeceras de seguridad, límite de peticiones, protección de datos personales y cumplimiento del RGPD.
# 12. Consideraciones éticas

Este capítulo no es un trámite. En un proyecto que recoge la biografía de sus usuarios, les administra cuestionarios sobre experiencias adversas en la infancia y les ofrece a la vez contenidos científicos y tradiciones milenarias, las decisiones éticas son decisiones de ingeniería: condicionan el modelo de datos, la redacción de los textos y hasta el material comercial.

Se abordan cuatro frentes.

## 12.1. Qué es ciencia y qué no lo es

Cuatro de las ocho disciplinas de la plataforma —astrología, cábala, ayurveda y medicina tradicional china— **no son ciencia**. No lo son en el sentido estricto: sus afirmaciones centrales no han superado la contrastación experimental. En el caso de la astrología existe literatura específica al respecto, incluido un estudio doble ciego clásico publicado en *Nature* que no encontró capacidad predictiva por encima del azar [7], y revisiones posteriores que llegan a la misma conclusión [8].

Ofrecerlas en una plataforma junto a nutrición, fisiología y psicología plantea un problema real: el usuario puede concluir que todo lo que hay dentro tiene el mismo estatus. Esa confusión sería, además de intelectualmente deshonesta, potencialmente dañina.

La respuesta del proyecto fue establecer un **criterio editorial explícito antes de escribir el contenido**, distinguiendo tres usos posibles de una tradición:

1. **Como divulgación histórica.** Explicar qué es la astrología, de dónde viene, qué papel jugó en el nacimiento de la astronomía y por qué dejó de considerarse conocimiento válido. Esto es historia de las ideas, y es legítimo sin matices.
2. **Como sistema simbólico para la introspección.** Usar el vocabulario de una tradición como espejo para hablar de uno mismo, igual que se usan los arquetipos o las cartas de un test proyectivo. Legítimo, siempre que se diga que es lo que es.
3. **Como fuente de predicciones o de diagnósticos.** Afirmar que una carta natal predice acontecimientos o que un desequilibrio de elementos explica una enfermedad. **Ilegítimo**, y excluido del producto.

La plataforma se sitúa deliberadamente en los dos primeros usos. Esto se traduce en decisiones concretas:

- El recorrido de cada disciplina **empieza por su historia**: quién la formuló, en qué siglo, qué afirmaba y qué de eso se sostiene hoy.
- Los textos interpretativos están redactados como **preguntas y espejos**, no como afirmaciones sobre el usuario ni sobre su futuro.
- Ningún texto de la plataforma relaciona una disciplina tradicional con una enfermedad, un síntoma o un tratamiento.
- El estudio estadístico abierto sobre astrología, lejos de contradecir esto, lo refuerza: invita a los usuarios a aportar datos y a mirar los resultados agregados, lo que es exactamente lo contrario de pedir fe.

Este criterio llegó a modificar material que ya estaba escrito. El dosier preparado para ofrecer los programas a entidades públicas se reescribió para presentar astrología, cábala, ayurveda y medicina china **únicamente como contenido histórico y cultural**, nunca como propuesta de salud: una administración pública no puede programar una actividad que sugiera alternativas a la atención sanitaria, y este proyecto tampoco debe ofrecérsela.

## 12.2. Datos personales y datos sensibles

### 12.2.1. Qué se recoge

La plataforma recoge tres niveles de información, con exigencias muy distintas:

**Datos identificativos.** Correo, nombre, contraseña cifrada y, opcionalmente, fotografía de perfil.

**Datos personales no sensibles.** Fecha, hora y lugar de nacimiento; respuestas a cuestionarios de constitución; datos antropométricos para el cálculo de necesidades nutricionales.

**Datos de categoría especial.** Aquí está el punto crítico. El recorrido de Psicología recoge **la biografía completa del usuario año a año**, un mapa de su familia con fotografías de terceros, y los resultados de dos cuestionarios de cribado: el de experiencias adversas en la infancia (ACE) [5] y el de experiencias disociativas (DES-II) [6]. Esta información es, a efectos del Reglamento General de Protección de Datos, **dato relativo a la salud**, y pertenece a la categoría de tratamiento más exigente.

### 12.2.2. Cómo se trata

Las decisiones tomadas al respecto son las siguientes:

- **Nadie más lo lee.** El contenido del recorrido de Psicología es privado por diseño. La administración solo accede al trabajo de un usuario cuando este ha contratado explícitamente una llamada de acompañamiento, y ese acceso queda restringido a las pantallas de revisión.
- **Nada sale del sistema.** Los documentos PDF se componen **en el navegador del usuario**, no en un servidor de composición externo. Las respuestas sobre su biografía nunca viajan a un tercero.
- **El borrado es real.** La eliminación de cuenta borra explícitamente los ocho documentos de recorrido, las notas, las imágenes subidas y el registro de progreso, no solo la fila del usuario. La base de datos no borra en cascada, de modo que esto es responsabilidad del código y está documentado como tal en el proyecto.
- **Consentimiento previo para la analítica.** No se carga ningún recurso de analítica hasta que el usuario acepta el aviso de cookies.
- **Minimización.** No se recoge ningún dato que no se use para producir un resultado concreto que el usuario recibe.

### 12.2.3. Qué queda pendiente

Por honestidad, conviene declarar también lo que no está resuelto y debe abordarse antes de una explotación comercial sostenida:

- **No hay cifrado en reposo específico** para los documentos de Psicología, más allá del que proporciona el proveedor de base de datos. Dado el nivel de sensibilidad, es una mejora que debería priorizarse.
- **No existe registro de auditoría de accesos** al contenido de un usuario por parte de la administración.
- **Las imágenes de genograma incluyen fotografías de terceros** —familiares del usuario— que no han prestado consentimiento. El aviso al usuario al respecto debería ser más explícito que el actual.

## 12.3. Responsabilidad en el contenido psicológico

Administrar cuestionarios de cribado a una persona sola frente a una pantalla, sin ningún profesional presente, exige cuidado. Un resultado alto en el cuestionario de experiencias adversas en la infancia o en el de experiencias disociativas puede ser una información difícil de recibir.

Las decisiones tomadas son tres. Primero, **el resultado nunca se entrega solo**: va siempre acompañado de la explicación de qué mide el instrumento, qué significa una puntuación alta y, sobre todo, qué **no** significa. Segundo, **se dice explícitamente que no es un diagnóstico**: son instrumentos de cribado, diseñados para orientar, y su interpretación clínica corresponde a un profesional. Tercero, **el recorrido no fuerza**: en la línea de vida, cualquier año puede marcarse como «sin recuerdos» y continuar; nadie está obligado a escribir sobre lo que no quiere escribir.

La decisión de diseño que subyace a todo esto es la del apartado 8.5.2: **el desbloqueo es por lectura y no por acierto**. En un recorrido que trata sobre la propia biografía, no hay respuestas correctas, y un sistema que evaluara al usuario sería no solo inútil sino dañino.

## 12.4. Impacto del proyecto

**A quién beneficia.** A personas que quieren entender disciplinas sobre las que solo encuentran fragmentos sueltos, y que salen del recorrido con un material propio. Y, en el caso del contenido histórico y cultural, a entidades públicas que pueden programar divulgación con material ya producido.

**A quién puede perjudicar.** El riesgo principal es que alguien tome el contenido tradicional por lo que no es y posponga una consulta médica. El criterio del apartado 12.1 está dirigido precisamente a ese riesgo, y es la razón por la que ningún texto de la plataforma relaciona una disciplina tradicional con un síntoma.

Existe un segundo riesgo, menor pero real: que el contenido de Psicología remueva algo que el usuario no esperaba. Es inherente a la materia —cualquier ejercicio de introspección lo comparte— y se mitiga con la ausencia de obligación y con la claridad sobre lo que cada instrumento es.

**Sostenibilidad.** El proyecto depende de una sola persona, lo que es su principal vulnerabilidad ética: si deja de mantenerse, los usuarios que han pagado pierden el acceso al material que construyeron. Una salvaguarda razonable, y una de las líneas de trabajo futuro, es garantizar que **todo lo que un usuario produce pueda descargarse como documento propio**, de modo que su trabajo sobreviva a la plataforma. El taller de generación de PDF va exactamente en esa dirección.

**Accesibilidad.** Se ha atendido de forma indirecta mediante la elección de una biblioteca de componentes accesible por defecto, pero no se ha auditado. Es una carencia que se reconoce y que figura en el capítulo siguiente.
# 13. Conclusiones y trabajo futuro

## 13.1. Comprobación de los objetivos

El objetivo principal se ha alcanzado: existe una plataforma web desplegada y en funcionamiento, con ocho disciplinas completas, en la que un usuario puede registrarse, adquirir un recorrido, completarlo de principio a fin y descargar el documento generado a partir de sus propias respuestas.

De los ocho subobjetivos de producto, siete se han cumplido íntegramente y uno —la preparación multiidioma— se ha cumplido parcialmente: el sistema está construido y funcionando, pero la traducción del contenido está incompleta por volumen. La causa no es técnica sino editorial, y es coherente con el hallazgo que atraviesa todo el proyecto: el contenido cuesta más que el código.

De los cincuenta y seis requisitos funcionales especificados, quedan sin completar dos de prioridad *Deseada*: la sección pública de vídeos, construida pero con la ruta desactivada a la espera de material suficiente, y la auditoría de accesibilidad.

Los cuatro objetivos de aprendizaje se han cumplido, y merecen un comentario porque han resultado más formativos de lo previsto. Construir un sistema completo de principio a fin (SA-1) ha significado enfrentarse a las partes que no aparecen en las asignaturas: el cumplimiento legal, la acreditación fiable de un pago, el borrado efectivo de datos personales y el mantenimiento de una aplicación viva durante meses. Diseñar para el cambio (SA-2) se ha aprendido de la manera que se aprende de verdad: rehaciendo el modelo de datos en producción.

## 13.2. Conclusiones técnicas

Cinco conclusiones concentran lo aprendido, y las cinco son transferibles a otros proyectos.

**El modelo de datos hay que elegirlo pensando en cómo va a crecer, no en cómo es hoy.** El diseño relacional inicial era correcto para lo que existía en mayo y se rompió en junio. La sustitución por un documento flexible por disciplina y usuario es la decisión que hizo posible terminar ocho disciplinas y no tres. Su coste —perder la validación que da el esquema— se paga en robustez del código de lectura, y conviene saberlo de antemano.

**La abstracción tiene un momento correcto, y no es el principio.** El sistema común de recorridos se extrajo en la tercera disciplina. Hacerlo en la primera habría producido una abstracción equivocada, porque aún no se sabía qué era común y qué era específico; hacerlo en la sexta habría dejado cinco copias del mismo código. La regla práctica que se deduce es sencilla: abstraer cuando algo se ha escrito dos veces y se está a punto de escribir una tercera.

**Lo que hace falta para publicar debe planificarse como trabajo, no como remate.** El pico de julio —un tercio del proyecto en un mes— es la factura de haber aplazado todo lo que no producía una pantalla nueva: pagos, legalidad, consentimiento, rendimiento, seguridad. Ninguna de esas tareas desapareció por aplazarla.

**Los fallos de diseño no aparecen construyendo: aparecen recorriendo.** El diagnóstico confuso de Medicina China, el rebote entre pantallas y la incoherencia de los botones de avance los detectó siempre la misma prueba: recorrer la disciplina entera como usuario. Ninguna prueba de componente aislado los habría encontrado.

**El peso del material multimedia es una decisión de arquitectura, no de diseño gráfico.** 275 MB de ilustraciones condicionan la elección del plan de despliegue, obligan a construir herramientas propias de optimización y determinan si la aplicación se puede servir o no. Tratarlo como un detalle estético al final es llegar tarde.

## 13.3. Lo que se haría distinto

Tres cosas se harían de otra manera si el proyecto empezara hoy.

**Publicar en producción desde la primera semana**, aunque solo se vea una página. Varias decisiones de las fases 0 y 1 se tomaron sin conocer las limitaciones del entorno de publicación —singularmente, la de que el disco del servidor se borra en cada despliegue— y hubo que rectificarlas después.

**Medir el tiempo de contenido aparte del de código.** El método de seguimiento empleado invisibiliza precisamente la parte más costosa del proyecto, y eso hace imposible estimar bien la disciplina siguiente.

**Reservar la accesibilidad como requisito de prioridad alta y no deseada.** Haberla dejado en segundo plano significa que ahora hay 190 páginas que auditar, en lugar de un criterio aplicado desde el principio.

## 13.4. Trabajo futuro

### 13.4.1. Corto plazo

- **Completar la validación con usuarios** conforme al diseño del capítulo 10, e incorporar sus resultados.
- **Auditoría de accesibilidad** sobre las pantallas más usadas, con verificación de contraste, navegación por teclado y lectura por sintetizador de voz.
- **Cifrado en reposo específico** para los documentos del recorrido de Psicología y registro de auditoría de los accesos de administración a contenido de usuario.
- **Completar la traducción al inglés** de las disciplinas, apoyándose en la herramienta de detección de textos pendientes ya construida.
- **Terminar el material gráfico pendiente**: las fotografías de los sub-hitos de Cultura y de las sefirot de Cábala, que la herramienta de inventario mantiene listadas.

### 13.4.2. Medio plazo

- **Exportación completa de los datos del usuario**, en un formato legible, como garantía de que su trabajo sobrevive a la plataforma. Es, además de una buena práctica de protección de datos, la salvaguarda ética señalada en el apartado 12.4.
- **Activar la sección de vídeos**, ya construida, cuando haya material suficiente.
- **Activar la página de entrada de dos proyectos**, preparada en el código y a la espera de que exista el segundo proyecto.
- **Panel de seguimiento propio**: cuántos usuarios empiezan un recorrido, dónde lo abandonan y cuántos lo terminan. Hoy esa información no se recoge, y es exactamente la que hace falta para decidir qué mejorar.
- **Pruebas automatizadas de recorrido**, que ejecuten en un navegador sin interfaz el camino completo de cada disciplina. Es el nivel de prueba que más defectos detecta y el único que hoy se hace a mano.

### 13.4.3. Largo plazo

- **Novena disciplina y siguientes.** La arquitectura lo permite sin cambios estructurales: una tabla documental, un fichero de recorrido y su contenido.
- **Relaciones entre disciplinas.** El mecanismo existe ya —las constelaciones de Psicología usan arquetipos de la carta natal— pero está explotado solo en un caso. Un mapa personal que cruzase las ocho disciplinas sería el resultado más singular que la plataforma puede ofrecer y es algo que ninguna alternativa del mercado hace.
- **Vía institucional.** Los programas y presentaciones ya producidos permiten ofrecer el contenido histórico y cultural a entidades públicas, con un modelo de ingresos distinto al de la venta directa y sin la estacionalidad de esta.

## 13.5. Impresión personal

<!-- NOTA PARA LA AUTORÍA: la guía de la EPS admite aquí un tono personal.
     Este apartado está redactado como borrador y conviene reescribirlo con la
     voz propia: es lo último que lee un tribunal y lo que más se recuerda. -->

De este trabajo me llevo, sobre todo, la experiencia de haber sostenido algo grande durante siete meses. Un proyecto de este tamaño no se termina por saber programar: se termina por decidir bien qué se hace cada semana, y por aceptar que algunas decisiones tomadas en marzo habrá que deshacerlas en junio.

Lo más difícil no fue ninguna de las piezas que parecían difíciles. El cálculo de la carta natal, que era lo que más respeto daba al empezar, resultó ser un problema acotado con una solución clara. Lo verdaderamente costoso fue lo contrario: mantener la coherencia de ocho disciplinas distintas, con ocho paletas, ocho recorridos y casi dos mil ilustraciones, sin que el conjunto se desmontara. Esa es una batalla que no se gana con una técnica, sino con disciplina: extraer un componente cada vez que algo se repite, y no dejar nunca que la novena pantalla invente su propia forma de hacer lo que ya hacían las ocho anteriores.

También me llevo una conclusión que no esperaba encontrar en un trabajo técnico: que decidir **qué se dice y cómo se dice** forma parte de la ingeniería tanto como decidir qué base de datos se usa. El criterio sobre qué es ciencia y qué es tradición no fue un añadido legal al final; condicionó la estructura de los recorridos, el orden del contenido y hasta el material comercial del proyecto.

Y, por último, me llevo un producto que existe, que está publicado y que alguien puede usar mañana. Que es, en el fondo, lo único que de verdad quería al empezar.
# Referencias

Las referencias se presentan en una lista numerada según su orden de aparición en el texto, citándose en él mediante el número entre corchetes. El formato sigue el estilo APA recomendado por la Escuela Politécnica Superior.

<!-- COMPROBAR antes de entregar: que todas las referencias listadas están
     citadas en el texto y que todas las citas del texto existen en esta lista.
     Las fechas de consulta de los recursos en línea deben actualizarse. -->

## Normativa académica y metodología

1. Universidad de Alicante, Escuela Politécnica Superior. (2014). *Libro de Estilos para la presentación de memorias del Trabajo Fin de Grado / Trabajo Fin de Máster*. Recuperado de https://maktub.eps.ua.es/servicios/gestorContenidos/contenidos/normativaEPS/Pdf/9910.pdf

2. Berná Martínez, J. V. (2022). *Guía para el desarrollo de TFG*. Grado en Ingeniería Multimedia, Universidad de Alicante.

3. IEEE. (1998). *IEEE Recommended Practice for Software Requirements Specifications* (IEEE Std 830-1998). Institute of Electrical and Electronics Engineers.

4. Doran, G. T. (1981). There's a S.M.A.R.T. way to write management's goals and objectives. *Management Review, 70*(11), 35–36.

## Instrumentos y literatura de las disciplinas

5. Felitti, V. J., Anda, R. F., Nordenberg, D., Williamson, D. F., Spitz, A. M., Edwards, V., Koss, M. P. y Marks, J. S. (1998). Relationship of childhood abuse and household dysfunction to many of the leading causes of death in adults: The Adverse Childhood Experiences (ACE) Study. *American Journal of Preventive Medicine, 14*(4), 245–258.

6. Carlson, E. B. y Putnam, F. W. (1993). An update on the Dissociative Experiences Scale. *Dissociation, 6*(1), 16–27. [Escala original: Bernstein, E. M. y Putnam, F. W. (1986). Development, reliability, and validity of a dissociation scale. *Journal of Nervous and Mental Disease, 174*(12), 727–735.]

7. Carlson, S. (1985). A double-blind test of astrology. *Nature, 318*(6045), 419–425.

8. Dean, G. y Kelly, I. W. (2003). Is astrology relevant to consciousness and psi? *Journal of Consciousness Studies, 10*(6–7), 175–198.

<!-- AÑADIR AQUÍ las referencias de las fuentes utilizadas para redactar el
     contenido de cada disciplina (manuales de nutrición, fisiología,
     historia de la medicina, etc.). Un tribunal las va a buscar, porque el
     contenido es una parte sustancial del trabajo. -->

## Protección de datos

9. Parlamento Europeo y Consejo de la Unión Europea. (2016). *Reglamento (UE) 2016/679 relativo a la protección de las personas físicas en lo que respecta al tratamiento de datos personales y a la libre circulación de estos datos* (Reglamento General de Protección de Datos). Diario Oficial de la Unión Europea, L 119.

10. Jefatura del Estado. (2018). *Ley Orgánica 3/2018, de 5 de diciembre, de Protección de Datos Personales y garantía de los derechos digitales*. Boletín Oficial del Estado, núm. 294.

## Tecnologías del cliente

11. Meta Open Source. *React — The library for web and native user interfaces*. https://react.dev

12. Microsoft. *TypeScript Documentation*. https://www.typescriptlang.org/docs/

13. Vite. *Vite — Next Generation Frontend Tooling*. https://vitejs.dev

14. Chakra UI. *Chakra UI — Simple, modular and accessible component library for React*. https://chakra-ui.com

15. Framer. *Motion — Production-ready animation library for React*. https://motion.dev

16. Three.js. *Three.js — JavaScript 3D Library*. https://threejs.org — y Poimandres, *React Three Fiber*. https://docs.pmnd.rs/react-three-fiber

17. Remix. *React Router*. https://reactrouter.com

18. Parallax. *jsPDF — Client-side JavaScript PDF generation*. https://github.com/parallax/jsPDF

## Tecnologías del servidor y persistencia

19. Myśliwiec, K. *NestJS — A progressive Node.js framework*. https://docs.nestjs.com

20. Supabase. *Supabase Documentation*. https://supabase.com/docs

21. PostgreSQL Global Development Group. *PostgreSQL Documentation: JSON Types*. https://www.postgresql.org/docs/current/datatype-json.html

22. Stripe. *Stripe API Reference* y *Checkout Documentation*. https://docs.stripe.com

23. Render. *Render Documentation*. https://render.com/docs

## Cálculo astronómico

24. Cross, D. *astronomy-engine — Astronomy calculation engine for multiple programming languages*. https://github.com/cosinekitty/astronomy

25. Moment.js team. *Luxon — A powerful, modern, and friendly wrapper for JavaScript dates and times*. https://moment.github.io/luxon/

26. Evans, E. *geo-tz — Lookup timezone by geographic coordinates*. https://github.com/evansiroky/node-geo-tz

27. OpenStreetMap Foundation. *Nominatim — Geocoding service*. https://nominatim.org

## Diseño, usabilidad y rendimiento

28. Nielsen, J. (1994). *10 Usability Heuristics for User Interface Design*. Nielsen Norman Group. https://www.nngroup.com/articles/ten-usability-heuristics/

29. W3C. (2023). *Web Content Accessibility Guidelines (WCAG) 2.2*. https://www.w3.org/TR/WCAG22/

30. Google Developers. *WebP — A new image format for the web*. https://developers.google.com/speed/webp
# Apéndice I — Recursos en línea

Todo apéndice debe estar citado en el cuerpo de la memoria. Estos recursos se referencian desde los capítulos 9 y 11.

## A.I.1. Repositorio del proyecto

El código completo del proyecto —cliente, servidor, esquemas de base de datos y herramientas de apoyo— está publicado en:

**https://github.com/mariaaescribano/life-as-a-privilege**

<!-- COMPROBAR antes de entregar:
     · Que el repositorio es PÚBLICO y accesible sin cuenta.
     · Que la rama principal contiene la versión final entregada.
     · Que existe un README.md en la raíz explicando cómo instalar y arrancar
       el proyecto: requisitos, variables de entorno necesarias y comandos.
       Hoy el repositorio NO tiene README propio en la raíz, y es lo primero
       que abre un tribunal. -->

[FIGURA 14: repositorio del proyecto]

*Figura 14. Repositorio del proyecto en GitHub.*
*(Fuente propia)*

## A.I.2. Plataforma desplegada

La plataforma está publicada y accesible en:

**[DIRECCIÓN DE LA PLATAFORMA EN PRODUCCIÓN]**

Para que el tribunal pueda recorrer una disciplina completa sin necesidad de realizar un pago, se facilitan credenciales de acceso con disciplinas concedidas mediante el panel de administración:

- Usuario: `[CORREO DE PRUEBA]`
- Contraseña: `[CONTRASEÑA DE PRUEBA]`

<!-- IMPORTANTE: crear esta cuenta y concederle acceso a las ocho disciplinas
     desde /admin/accesos antes de entregar. Rellenarla además con datos de
     ejemplo en al menos dos recorridos, para que el tribunal vea el producto
     con contenido y no vacío. -->

## A.I.3. Vídeo de demostración

<!-- MUY RECOMENDABLE: grabar un recorrido completo de una disciplina
     (Astrología es la más demostrativa: entrada de datos de nacimiento →
     cálculo de la carta → lectura → PDF descargado) y publicarlo como vídeo
     no listado. Es lo que se proyecta en la defensa. -->

**[ENLACE AL VÍDEO DE DEMOSTRACIÓN]**

## A.I.4. Cuestionario de validación

**[ENLACE AL FORMULARIO DE VALIDACIÓN CON USUARIOS]**

---

# Apéndice II — Guía de despliegue y arranque del proyecto

Este apéndice recoge los pasos necesarios para poner el sistema en marcha desde cero, tanto en un entorno local como en producción.

## A.II.1. Requisitos previos

- Node.js (versión 20 o superior) y npm.
- Una cuenta en el proveedor de base de datos gestionada, con un proyecto creado.
- Una cuenta en la pasarela de pago, con las claves en modo de pruebas.
- Una cuenta de correo saliente para las notificaciones.

## A.II.2. Base de datos

El esquema completo está versionado en el repositorio, en la carpeta `backend/sql`, como ficheros SQL ejecutables y comentados. Deben ejecutarse una vez en el editor SQL del proveedor. Cada fichero documenta, además del `CREATE TABLE`, la forma esperada del documento JSONB que la tabla almacena.

<!-- NOTA TÉCNICA que conviene incluir en la memoria porque costó tiempo
     descubrirla: las migraciones deben ejecutarse a través del conector
     agrupado (pooler) del proveedor, porque la conexión directa solo está
     disponible sobre IPv6. Si una tabla `metodo_*` no se ha creado, el
     recorrido correspondiente no guarda y devuelve al usuario al paso
     anterior, sin ningún mensaje de error evidente. -->

## A.II.3. Variables de entorno

El servidor requiere, como mínimo, las variables correspondientes a: conexión a la base de datos y clave de servicio, secreto de firma de la credencial de sesión, credenciales del proveedor de identidad externo, claves de la pasarela de pago y del secreto de verificación de sus avisos, credenciales del correo saliente, dirección del cliente para las direcciones de retorno del pago, lista de orígenes permitidos y lista de correos con acceso concedido.

<!-- COMPLETAR con la lista literal de nombres de variables, tomándola del
     código. Conviene incluir también un fichero `.env.example` en el
     repositorio, sin valores reales. NUNCA incluir claves en la memoria. -->

## A.II.4. Arranque local

```
# Servidor
cd backend
npm install
npm run start:dev

# Cliente
cd frontend
npm install
npm run dev
```

## A.II.5. Publicación

El cliente se publica como sitio estático y el servidor como servicio web, ambos conectados al repositorio de forma que cada envío a la rama principal desencadena una publicación automática.

**Punto crítico documentado:** al estrenar dominio hay que actualizar cuatro sitios, y olvidar uno deja la plataforma cargando pero con todas sus peticiones rechazadas: la lista de orígenes permitidos del servidor, la dirección del cliente usada en los retornos de pago, las etiquetas de la página principal del cliente, y el mapa del sitio junto con el fichero de exclusión de rastreadores. A ello se añade la redirección configurada en el panel de la pasarela de pago.

---

# Apéndice III — Herramientas de apoyo

El repositorio incluye, en la carpeta `scripts`, las herramientas de línea de comandos desarrolladas durante el proyecto y descritas en el apartado 9.9. Este apéndice documenta su uso.

<!-- COMPLETAR con la sintaxis de invocación de cada herramienta. Basta con
     una tabla de dos columnas: comando y qué hace. -->

---

# Apéndice IV — Diccionario de datos

<!-- OPCIONAL pero muy valorado. Recoge, para cada tabla y para cada documento
     JSONB, el nombre de cada campo, su tipo y su significado. Buena parte de
     esta información ya está escrita como comentarios en los ficheros SQL del
     repositorio, así que es en gran medida un trabajo de copiar y ordenar. -->
