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
