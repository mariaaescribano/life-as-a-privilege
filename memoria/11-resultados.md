# 11. Resultados

## 11.1. El producto final

El resultado del trabajo es una plataforma web desplegada y en funcionamiento, con las ocho disciplinas completas, el flujo de compra operativo y el catálogo público accesible sin registro.

### 11.1.1. Cifras del sistema

[TABLA 20: métricas del proyecto]

*Tabla 20. Métricas del sistema desarrollado.*

| Métrica | Valor |
|---|---|
| Versiones registradas en el control de versiones | 541 |
| Periodo de desarrollo | Febrero – septiembre (7 meses) |
| Ficheros TypeScript propios | 839 |
| Líneas de código propio | ≈ 218 200 |
| — de las cuales, en el cliente | ≈ 208 500 (727 ficheros) |
| — de las cuales, en el servidor | ≈ 9 700 (112 ficheros) |
| Rutas declaradas en la aplicación | 187 |
| — de ellas, pantallas de recorrido | 114 |
| Páginas completas | 190 |
| Componentes reutilizables | 205 |
| Módulos del servidor | 30 |
| Controladores / servicios | 28 / 31 |
| Puntos de acceso de la API | 129 |
| Tablas y documentos de base de datos | 17 |
| Generadores de documentos PDF | 9 |
| Visores de cómic ilustrado | 56 |
| Ficheros del sistema de traducción | 46 |
| Ilustraciones y fotografías propias | 1 907 |
| Peso del material público servido | 275 MB |

La proporción entre cliente y servidor —más del 95 % del código en el cliente— es en sí misma un resultado: refleja con precisión la naturaleza del producto, en el que la complejidad está en el recorrido, el contenido y la presentación, mientras que el servidor se limita a guardar documentos, autorizar accesos y hacer los tres cálculos que no pueden estar en el navegador.

### 11.1.2. Reparto por disciplina

[TABLA 21: pantallas por disciplina]

*Tabla 21. Pantallas de recorrido implementadas por disciplina.*

| Disciplina | Pantallas | Contenido característico |
|---|---|---|
| Psicología | 26 | Línea de vida, genograma, ACE, DES-II, mapa de huellas y nudos, rueda de emociones |
| Nutrición | 17 | Nutrientes, plato, cálculo de calorías y macros, diseño del día, microbiota |
| Fisiología | 16 | De la partícula al organismo, sistemas, nivel de profundización |
| Ayurveda | 15 | Test de constitución, recorrido del doṣha, chakras |
| Medicina China | 13 | Cinco elementos, constitución, ciclos, lengua, taoísmo, qigong |
| Astrología | 11 | Carta natal, puntos clave, casas, aspectos, lectura, PDF |
| Cábala | 10 | Árbol de la Vida, sefirot, senderos, diagnóstico |
| Cultura | 6 | Historia universal, de las religiones, de la filosofía y de la medicina |
| **Total** | **114** | |

### 11.1.3. Cumplimiento de los objetivos

[TABLA 22: cumplimiento de objetivos]

*Tabla 22. Grado de cumplimiento de los objetivos planteados en el capítulo 5.*

| Objetivo | Estado | Observación |
|---|---|---|
| Objetivo principal | **Cumplido** | Plataforma desplegada, ocho disciplinas completas, flujo de compra operativo |
| SO-1 · Cálculo de la carta natal | **Cumplido** | Cálculo propio en el servidor con resolución automática de coordenadas y zona horaria histórica |
| SO-2 · Sistema común de recorridos | **Cumplido** | Confirmado empíricamente: las cinco últimas disciplinas costaron una fracción de la primera |
| SO-3 · No perder el progreso | **Cumplido** | Guardado continuo, prerrelleno y vaciado de cola antes de navegar |
| SO-4 · Documento propio por disciplina | **Cumplido** | Nueve generadores sobre un taller común |
| SO-5 · Compra independiente | **Cumplido** | Acreditación redundante y concesión manual de respaldo |
| SO-6 · Catálogo multimedia sin degradar rendimiento | **Cumplido** | Carga diferida por ruta y reducción del material del 40 % |
| SO-7 · Preparación multiidioma | **Cumplido parcialmente** | Sistema construido y funcionando; la traducción al inglés está incompleta por volumen de contenido |
| SO-8 · Distinción ciencia / tradición | **Cumplido** | Criterio aplicado a los textos y al material comercial (capítulo 12) |
| SA-1 a SA-4 · Objetivos de aprendizaje | **Cumplidos** | Se analizan en el capítulo 13 |

De los quince requisitos no funcionales y los cincuenta y seis funcionales especificados, quedan sin completar tres, todos ellos de prioridad *Deseada*: la traducción completa al inglés (RNF-13, parcial), la sección pública de vídeos —construida pero con la ruta desactivada a la espera de contenido suficiente— y la revisión sistemática de accesibilidad (RNF-12), que se ha atendido de forma indirecta al usar una biblioteca de componentes accesible por defecto, pero que no se ha auditado.

## 11.2. Costes temporales y desviaciones

### 11.2.1. Esfuerzo registrado por mes

[TABLA 23: esfuerzo por mes]

*Tabla 23. Versiones registradas por mes y fase asociada.*

| Mes | Versiones | % del total | Fase |
|---|---|---|---|
| Febrero | 44 | 8,1 % | 0 · Entorno y esqueleto |
| Marzo | 67 | 12,4 % | 1 · Capa pública |
| Abril | 27 | 5,0 % | 1 · Capa pública (producción de contenido) |
| Mayo | 55 | 10,2 % | 2 · Astrología |
| Junio | 46 | 8,5 % | 3 y 4 · Psicología y Ayurveda |
| **Julio** | **174** | **32,2 %** | 5 · Lanzamiento público |
| Agosto | 108 | 20,0 % | 6 · Fisiología, Nutrición, Cábala, optimización |
| Septiembre | 20 | 3,7 % | 7 · Cultura, Medicina China, pulido |
| **Total** | **541** | **100 %** | |

La Figura 13 representa esa distribución, que es cualquier cosa menos regular.

[FIGURA 13: gráfico de barras de versiones registradas por mes]

*Figura 13. Distribución del esfuerzo registrado a lo largo del proyecto.*
*(Fuente propia)*

### 11.2.2. Análisis de las desviaciones

El contraste entre la planificación del capítulo 3 y lo que ocurrió deja cuatro conclusiones que conviene analizar con honestidad, porque son el aprendizaje más transferible del proyecto.

**El pico de julio.** Un tercio del trabajo registrado del proyecto se concentra en un solo mes. La causa está identificada: julio fue el mes del lanzamiento público, y **todo lo que no es funcionalidad de producto se había ido aplazando**. Pagos, páginas legales, consentimiento de cookies, borrado efectivo de cuenta, límites de peticiones, rendimiento de carga: ninguna de esas cosas produce una pantalla nueva que enseñar, y por eso ninguna se hizo cuando tocaba. Aplazarlas no las hizo desaparecer; las amontonó.

La lección es concreta: **en la planificación de un producto que va a publicarse, el trabajo de "poder publicarlo" debe tener su propia iteración desde el principio**, y no ser lo que queda por hacer cuando ya no queda tiempo.

**El valle de abril.** La cifra más baja del proyecto, y la más engañosa. Abril no fue un mes vacío: fue un mes dedicado a producir contenido, que no genera código. Confirma la limitación del método de medición declarada en el apartado 6.3.3 y, sobre todo, confirma el riesgo R-03: **el contenido cuesta más de lo que se estima y no se ve en ninguna métrica de desarrollo**.

**La apuesta de la fase 4 salió bien.** Se planificó que las disciplinas 5 a 8 pudieran construirse mucho más rápido que las primeras si se extraía a tiempo un sistema común de recorridos. La comparación lo confirma: Astrología ocupó un mes entero para once pantallas, mientras que agosto produjo tres disciplinas completas más ampliaciones de las existentes. La inversión en abstracción, hecha en el momento adecuado —ni antes, cuando no se sabía todavía qué abstraer, ni después, cuando ya habría cinco copias— fue la decisión técnica más rentable del proyecto.

**El orden de las disciplinas cambió.** La planificación situaba Medicina China en la cuarta posición; terminó siendo la última. El motivo es que su diagnóstico exigía un rediseño conceptual (apartado 9.8.1) que se prefirió abordar con el sistema común ya maduro. La capacidad de reordenar el trabajo sin romper nada es la contrapartida favorable de haber diseñado las disciplinas desacopladas.

## 11.3. Resultados de rendimiento y peso

[TABLA 24: mejoras de rendimiento]

*Tabla 24. Efecto de las optimizaciones aplicadas.*

| Aspecto | Antes | Después | Mejora |
|---|---|---|---|
| Descarga inicial de código | Paquete único de ≈ 6 MB | Fragmento inicial + carga por ruta | La portada ya no exige descargar toda la aplicación |
| Peso del material público | 459 MB | 265 MB | ≈ 42 % |

La primera cifra es la más relevante: antes de la carga diferida, **ver la portada exigía descargar el código de las 187 pantallas de la aplicación**, incluidas las ocho disciplinas que el visitante quizá no hubiera comprado nunca. Después del cambio, cada pantalla viaja en su propio fragmento y se descarga al entrar en ella.

## 11.4. Relación con las competencias del grado

El proyecto ha puesto en práctica, de forma integrada, contenidos repartidos a lo largo de la titulación:

- **Desarrollo web en cliente y en servidor**: toda la arquitectura de la aplicación, el enrutado, la gestión de estado y la API REST.
- **Bases de datos**: el modelo de persistencia, con la particularidad de haber tenido que rectificarlo en producción, y el uso de un tipo documental dentro de una base relacional.
- **Diseño de interfaces y experiencia de usuario**: la guía de estilos, el catálogo de componentes, el mapa de interacción y el diseño adaptativo.
- **Gestión de proyectos**: la planificación por iteraciones, el análisis de riesgos y el contraste posterior entre lo planificado y lo real.
- **Gráficos por computador**: la representación tridimensional de la carta astral y la composición de documentos PDF dibujando primitivas.
- **Producción multimedia**: la creación, organización, optimización y publicación de un catálogo de casi dos mil piezas gráficas.
- **Seguridad y aspectos legales**: autenticación, autorización, cabeceras de seguridad, límite de peticiones, protección de datos personales y cumplimiento del RGPD.
