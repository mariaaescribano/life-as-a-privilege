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
