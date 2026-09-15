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
