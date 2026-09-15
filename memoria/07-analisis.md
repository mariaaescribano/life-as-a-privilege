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
