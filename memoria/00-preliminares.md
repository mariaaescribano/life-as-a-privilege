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
