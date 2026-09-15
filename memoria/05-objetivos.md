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
