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

Este apéndice recoge, objeto a objeto, el esquema completo de la base de datos representado en la Figura 5: **29 tablas y 1 vista** sobre PostgreSQL. Todas viven en el esquema `public`.

Dos convenios recorren el esquema y conviene enunciarlos antes de la enumeración:

- **Una sola clave ajena declarada.** Únicamente `estudio_respuesta.participante_id` referencia formalmente a otra tabla. El resto de las relaciones —todas las que salen de `user`— existen de forma lógica pero no están declaradas: los ficheros SQL del repositorio incluyen la sentencia correspondiente comentada. La consecuencia práctica está documentada en el apartado 8.1.4 y es deliberada: la integridad se mantiene en el servidor, que es el único que escribe, y el borrado en cascada se programa explícitamente al eliminar una cuenta.
- **Dos convenciones de nombres conviviendo.** Las tablas de la primera etapa del proyecto nombran la columna de usuario en estilo *camelCase* (`userId`, `idUser`, `userid`); las posteriores usan `snake_case` (`user_id`). Se documenta tal cual está: renombrarlas habría exigido migrar datos ya en producción sin beneficio funcional. Es una deuda técnica reconocida en el apartado 13.3.

En las tablas siguientes, **PK** marca la clave primaria y *único* una restricción de unicidad.

## IV.1. Identidad y acceso

### `user`

Una fila por cuenta. Además de la identidad, guarda el permiso de acceso a cada una de las ocho disciplinas como un par de columnas: el indicador booleano que consulta el servidor antes de dejar entrar a un recorrido, y la fecha en que se concedió.

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | text | **PK.** Identificador alfanumérico generado por el servidor. |
| `name` | text | Nombre de usuario. Único. |
| `email` | text | Correo electrónico. Único; es también la credencial de acceso. |
| `password` | text | Contraseña cifrada con función de derivación lenta. Las cuentas creadas por identificación federada guardan aquí un valor inservible. |
| `img` | text | Dirección de la fotografía de perfil en el depósito de archivos. |
| `trato` | text | Preferencia de trato (`el`, `ella` o vacío), usada en los textos que se dirigen a la persona. |
| `metodo_suscrito` | bool | Acceso concedido al recorrido de Astrología. |
| `psicologia_suscrito` | bool | Acceso concedido al recorrido de Psicología. |
| `ayurveda_suscrito` | bool | Acceso concedido al recorrido de Ayurveda. |
| `tcm_suscrito` | bool | Acceso concedido al recorrido de Medicina China. |
| `fisiologia_suscrito` | bool | Acceso concedido al recorrido de Fisiología. |
| `nutricion_suscrito` | bool | Acceso concedido al recorrido de Nutrición. |
| `cabala_suscrito` | bool | Acceso concedido al recorrido de Cábala. |
| `cultura_suscrito` | bool | Acceso concedido al recorrido de Cultura. |
| `<disciplina>_fecha_compra` | timestamptz | Ocho columnas, una por disciplina: fecha en que se concedió el acceso. |

## IV.2. El Recorrido

Siete tablas con la misma forma —`user_id`, un documento `data` y la marca de tiempo— más las tres que acompañan al recorrido. La justificación del modelo documental está en el apartado 8.1.2.

Conviene señalar que **son siete y no ocho**: Cultura es la única disciplina que no guarda progreso, porque su recorrido es de lectura y no pide nada al usuario. Su columna de acceso en `user` sí existe, como la de las demás.

### `recorrido_progreso`

Posición alcanzada en cada disciplina. Va en tabla aparte del documento porque se consulta en cada cambio de paso y de forma independiente al contenido.

| Campo | Tipo | Descripción |
|---|---|---|
| `user_id` | text | **PK** (compuesta). Cuenta a la que pertenece el progreso. |
| `disciplina` | text | **PK** (compuesta). Identificador de la disciplina. |
| `paso_max` | int | Número del paso más lejano alcanzado. Nunca decrece. |
| `updated_at` | timestamptz | Última modificación. |

### `metodo_astrologia`

La única de las siete que añade columnas propias, porque la lectura de la carta astral la redacta la administración a mano y su estado hay que consultarlo desde el panel sin abrir el documento.

| Campo | Tipo | Descripción |
|---|---|---|
| `user_id` | text | **PK.** Cuenta propietaria del recorrido. |
| `data` | jsonb | Documento con todo el progreso de la disciplina. |
| `intro_visto` | bool | Si ya se ha visto el cómic de entrada. |
| `solicitud_enviada_at` | timestamptz | Momento en que se pidió la lectura de la carta. |
| `link_carta` | text | Dirección del documento con la carta calculada. |
| `casas_texto` | text | Interpretación de las casas, redactada a mano. |
| `aspectos_texto` | text | Interpretación de los aspectos, redactada a mano. |
| `updated_at` | timestamptz | Última modificación. |

### `metodo_psicologia`, `metodo_ayurveda`, `metodo_tcm`, `metodo_fisiologia`, `metodo_nutricion`

Cinco tablas idénticas en forma.

| Campo | Tipo | Descripción |
|---|---|---|
| `user_id` | text | **PK.** Cuenta propietaria del recorrido. |
| `data` | jsonb | Documento con todo el progreso de la disciplina. |
| `intro_visto` | bool | Si ya se ha visto el cómic de entrada. |
| `updated_at` | timestamptz | Última modificación. |

### `metodo_cabala`

Igual que las anteriores, sin la marca de introducción.

| Campo | Tipo | Descripción |
|---|---|---|
| `user_id` | text | **PK.** Cuenta propietaria del recorrido. |
| `data` | jsonb | Documento con las dimensiones del Árbol ya visitadas. |
| `updated_at` | timestamptz | Última modificación. |

### `psicologia_des`

Resultado del cuestionario de experiencias disociativas. Se separa del documento de Psicología por ser un instrumento con estructura propia y estable, sobre el que además hay que poder ordenar y filtrar.

| Campo | Tipo | Descripción |
|---|---|---|
| `user_id` | text | **PK.** Cuenta que realizó el cuestionario. |
| `score` | smallint | Media de las 28 respuestas, de 0 a 100. |
| `banda` | text | Franja en que cae el resultado, por su etiqueta numérica estable (`0–9`, `10–19`, `20–29`, `30+`) y no por su título, para que el registro no dependa del idioma ni de retoques de redacción. |
| `amnesia` | smallint | Subescala de lagunas de memoria, de 0 a 100. |
| `despersonalizacion` | smallint | Subescala de despersonalización, de 0 a 100. |
| `absorcion` | smallint | Subescala de absorción, de 0 a 100. |
| `alto` | bool | Indicador derivado: el resultado aconseja mostrar un aviso de cuidado antes de los ejercicios que remueven. |
| `fecha` | timestamptz | Momento en que se obtuvo este resultado. |
| `updated_at` | timestamptz | Última modificación del registro. |

Índice descendente sobre `score`, para poder listar de mayor a menor sin recorrer la tabla entera.

### `notas`

Diario breve disponible dentro del recorrido.

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | uuid | **PK.** |
| `user_id` | text | Cuenta autora de la nota. |
| `contenido` | text | Texto libre. |
| `categoria` | text | Etiqueta opcional, de un conjunto cerrado validado en el servidor. |
| `created_at` | timestamptz | Fecha de creación; ordena el listado. |

## IV.3. Tests y resultados

Nueve tablas en forma estrictamente relacional, anteriores al modelo documental del Recorrido. Guardan por separado el **resultado** de cada prueba y las **respuestas crudas** que lo produjeron, de modo que un cambio en el algoritmo de puntuación pueda recalcularse sobre los datos originales.

### `astrologia`

| Campo | Tipo | Descripción |
|---|---|---|
| `userId` | text | **PK.** |
| `sol`, `luna`, `ascendente` | text | Signo de cada uno de los tres puntos principales de la carta. |

### `ayurveda` y `ayurveda_respuestas`

| Campo | Tipo | Descripción |
|---|---|---|
| `userId` | text | **PK** de `ayurveda`. |
| `dosha` | text | Constitución resultante. |
| `vata_score`, `pitta_score`, `kapha_score` | int | Puntuación de cada constitución. |
| `fecha` | date | Día en que se hizo la prueba. |

| Campo | Tipo | Descripción |
|---|---|---|
| `user_id` | text | Cuenta que respondió. |
| `pregunta_idx` | int | Posición de la pregunta en el cuestionario. |
| `pregunta` | text | Enunciado copiado en el momento de responder, para que el registro siga siendo legible aunque el cuestionario se reescriba. |
| `dosha_elegida` | text | Opción marcada. |

### `tcm` y `tcm_respuestas`

| Campo | Tipo | Descripción |
|---|---|---|
| `userId` | text | **PK** de `tcm`. |
| `constitucion` | text | Constitución resultante. |
| `elemento` | text | Elemento predominante. |
| `desequilibrio` | text | Desequilibrio detectado. |

| Campo | Tipo | Descripción |
|---|---|---|
| `user_id` | text | Cuenta que respondió. |
| `test_num` | int | Cuál de los tres cuestionarios del elemento. |
| `seccion` | text | Sección dentro del cuestionario. |
| `pregunta_idx` | int | Posición de la pregunta. |
| `pregunta` | text | Enunciado copiado en el momento de responder. |
| `respuesta` | int | Valor marcado en la escala de 0 a 4. |

### `nutricion`

Datos antropométricos y objetivo calórico calculado.

| Campo | Tipo | Descripción |
|---|---|---|
| `userId` | text | **PK.** |
| `peso`, `altura`, `edad` | numeric, numeric, int | Medidas declaradas. |
| `genero` | text | Dato necesario para la fórmula de gasto energético. |
| `actividadIdx` | int | Nivel de actividad física, como índice de una escala cerrada. |
| `tdee` | numeric | Gasto energético total diario calculado. |
| `protG`, `carbG`, `fatG` | numeric | Reparto de macronutrientes en gramos. |

### `cabala`, `neuroPsicologia`, `fitoterapia`

Tres tablas de respuestas sueltas y favoritos, una fila por elemento marcado.

| Tabla | Campos | Descripción |
|---|---|---|
| `cabala` | `idUser`, `idPregunta`, `respuesta` | Respuesta a una pregunta del árbol. |
| `neuroPsicologia` | `userid`, `pregid`, `respuesta` | Respuesta a una pregunta del cuestionario de neuropsicología. |
| `fitoterapia` | `idUser`, `idPlanta` | Planta marcada como favorita. |

## IV.4. Estudio estadístico abierto

El diseño de este bloque es el único del esquema pensado para **agregar sobre muchas personas** en vez de leer los datos de una sola, y de ahí que sea también el único con clave ajena declarada y con una vista de apoyo.

### `estudio_participante`

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | uuid | **PK.** |
| `email` | text | Correo de la persona participante. Único: volver a participar actualiza su ficha en vez de duplicarla. |
| `fecha_nacimiento` | date | Fecha de nacimiento. |
| `hora_nacimiento` | text | Hora local del lugar, en formato `HH:MM`. |
| `pais`, `region`, `lugar` | text | Lugar de nacimiento. |
| `latitud`, `longitud` | float8 | Coordenadas resueltas del lugar. |
| `timezone` | text | Huso horario aplicado al calcular la carta. |
| `carta_natal_json` | jsonb | Carta natal completa tal como la devolvió el cálculo. |
| `signos` | jsonb | Signo de cada punto de la carta, extraído para consultar sin abrir la carta entera. |
| `casas` | jsonb | Casa de cada punto de la carta, con el mismo propósito. |
| `user_id` | text | Cuenta de la plataforma, si la persona tenía una. Es opcional: al estudio se puede entrar sin registrarse. |

### `estudio_respuesta`

Una fila por pregunta contestada. La clave primaria es compuesta, de forma que responder dos veces a la misma pregunta actualiza la fila en lugar de añadir otra.

| Campo | Tipo | Descripción |
|---|---|---|
| `participante_id` | uuid | **FK** → `estudio_participante(id)`, con borrado en cascada. Parte de la clave primaria. |
| `planeta` | text | Punto de la carta al que se refiere la pregunta. Parte de la clave primaria. |
| `pregunta_id` | text | Identificador estable de la pregunta. Parte de la clave primaria. |
| `eje` | text | `signo` o `casa`: cada punto se pregunta por los dos ejes por separado. |
| `posicion` | text | Posición concreta en ese eje (`Leo`, `5`…). **Se copia aquí a propósito** en vez de buscarla en la carta al consultar: así el agregado es una simple agrupación, y una respuesta antigua no cambia de grupo si algún día la carta se recalcula con otro algoritmo. |
| `respuesta` | bool | Verdadero es «sí»; falso, «no». |

### `estudio_stats` *(vista)*

Recuento agregado que alimenta las estadísticas públicas. Vive como vista y no como consulta del servidor porque la capa de acceso a datos utilizada no sabe agrupar: el agrupado tiene que estar del lado de la base de datos.

| Campo | Tipo | Descripción |
|---|---|---|
| `planeta`, `eje`, `posicion` | text | Grupo al que corresponde el recuento. |
| `pregunta_id` | text | Pregunta contada. |
| `total` | int | Respuestas recibidas en ese grupo. |
| `si` | int | Cuántas fueron afirmativas. |
| `no` | int | Cuántas fueron negativas. |

## IV.5. Relación con el público

Tres tablas de personas que **no necesitan cuenta**: se identifican por su correo electrónico.

| Tabla | Campos | Descripción |
|---|---|---|
| `suscriptor` | `id` (PK, uuid), `email` (único), `origen`, `created_at` | Lista de correo. `origen` registra desde dónde se apuntó la persona. La baja borra la fila; el enlace que la provoca va firmado y no caduca. |
| `opinion` | `id` (PK), `nombre`, `texto`, `email`, `aprobada` | Testimonios enviados desde la web. No se publican hasta que `aprobada` pasa a verdadero. |
| `bookings` | `id` (PK, uuid), `nombre`, `email`, `fecha`, `slot`, `tema` | Reservas de llamada. Se relacionan con la cuenta por el correo, no por identificador. |

## IV.6. Catálogo y contenido

Cuatro tablas que permiten **cambiar el contenido publicado sin volver a desplegar la aplicación**, gestionadas desde el panel de administración.

| Tabla | Campos | Descripción |
|---|---|---|
| `curso` | `id` (PK, uuid), `modalidad`, `titulo`, `foto`, `descripcion`, `descripcion_contenido`, `de_pago`, `publicado`, `completado`, `orden`, `contenido` (jsonb) | Catálogo de cursos. `modalidad` es la disciplina; `contenido` guarda el árbol completo de módulos y lecciones; `completado` es una marca de organización interna, distinta de `publicado`. Índices sobre `modalidad` y `publicado`. |
| `curso_revisado` | `curso_id` (PK, uuid), `revisado`, `updated_at` | Control de revisión editorial, separado de `curso` para que marcar una revisión no toque la fila del curso publicado. |
| `video` | `id` (PK, uuid), `disciplina`, `titulo`, `portada`, `url`, `publicado`, `orden` | Piezas de vídeo con su portada. Índices sobre `disciplina` y `publicado`. |
| `astrologia_arquetipos` | `id` (PK, text), `data` (jsonb), `updated_at` | Textos interpretativos de Astrología, editables desde el panel. Muy pocas filas y un documento muy grande en cada una. |

## IV.7. Los documentos JSONB

El campo `data` de las siete tablas del Recorrido no tiene esquema declarado: cada disciplina guarda ahí la estructura que necesita, y añadir un paso nuevo no exige migración alguna. La forma de cada documento está documentada como comentario de cabecera en su fichero SQL correspondiente, dentro de `backend/sql`. A modo de muestra, la del recorrido de Medicina China:

```
data {
  "testInicial": {
    "respuestas": { "energia": "opcionId", "emocion": "opcionId", … },
    "puntos": { "madera": 3, "fuego": 1, "tierra": 5, "metal": 2, "agua": 4 }
  },
  "elementos": {
    "madera": { "leido": true,  "miniTest": { "respuestas": {…}, "puntos": {…} } },
    "fuego":  { "leido": false, "miniTest": null },
    …
  },
  "observarte": { "lengua": "texto…", "rostro": "…", "voz": "…", … },
  "compromiso": "texto…"
}
```

El precio de esta libertad es que **la validación de la forma recae enteramente en la aplicación**. Un documento guardado con una estructura anterior no produce ningún error en la base de datos, sino una página en blanco al leerlo; la respuesta adoptada —comprobar el tipo de cada campo al cargar y envolver la interfaz en una barrera de errores— se describe en el apartado 9.6.
