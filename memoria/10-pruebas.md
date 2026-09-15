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
