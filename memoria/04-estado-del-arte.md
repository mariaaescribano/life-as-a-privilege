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
