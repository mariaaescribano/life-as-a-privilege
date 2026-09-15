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
