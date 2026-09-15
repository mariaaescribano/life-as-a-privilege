# 2. Estudio de viabilidad

Antes de escribir una sola línea de código conviene comprobar si el proyecto tiene sentido: si resuelve un problema real, si hay alguien dispuesto a pagar por ello, si se puede sostener con los recursos disponibles y qué puede salir mal por el camino. Este capítulo recoge ese estudio mediante tres herramientas: un análisis DAFO, un lienzo Lean Canvas y un análisis de riesgos con planes de prevención y contingencia.

El estudio se justifica porque *Life as a Privilege* no es un encargo: es una propuesta propia que compite en un mercado ya poblado y que, además, pretende monetizarse. Si el análisis hubiera indicado que el producto no era diferenciable o que el coste de producción del contenido lo hacía inviable, el proyecto habría tenido que reducirse a una sola disciplina.

## 2.1. Análisis DAFO

### Fortalezas (origen interno, positivo)

- **Contenido propio y original.** Los textos, las ilustraciones y los cómics son producción propia. No se depende de licencias de terceros ni de bancos de imágenes, lo que elimina el riesgo legal y proporciona una identidad visual imposible de replicar rápidamente.
- **Profundidad real.** Ocho disciplinas con recorridos largos y encadenados, frente a la sesión suelta de la competencia. Un usuario que complete Psicología habrá recorrido veintiséis pantallas de trabajo personal.
- **Cálculo propio, no delegado.** La carta natal se calcula en el servidor con efemérides reales. Esto evita cuotas de API externas, permite explicar el resultado y hace posible que la plataforma funcione aunque cualquier proveedor externo desaparezca.
- **Independencia de cada disciplina.** Al estar desacopladas, se puede publicar una y seguir desarrollando las demás. El producto es vendible desde la primera disciplina terminada.
- **Coste operativo bajo.** Sin servidores propios, sin licencias de pago y con una base de datos gestionada en capa gratuita, el coste fijo mensual es cercano a cero.

### Debilidades (origen interno, negativo)

- **Proyecto de una sola persona.** Diseño, contenido, ilustración, desarrollo, despliegue y soporte recaen en la misma persona. Es el principal cuello de botella y la primera amenaza para la continuidad.
- **Volumen de contenido enorme.** Ocho disciplinas completas suponen un esfuerzo editorial que supera con mucho al de desarrollo. Cada disciplina nueva multiplica el trabajo de mantenimiento.
- **Peso multimedia elevado.** 275 MB de ilustraciones sitúan al proyecto muy cerca del límite de ancho de banda de los planes gratuitos de despliegue.
- **Curva de entrada alta para el usuario.** Un recorrido largo exige un compromiso que el usuario medio de aplicaciones de bienestar no está acostumbrado a dar.
- **Sin validación con usuarios a gran escala.** Las pruebas se han hecho con un grupo reducido.

### Oportunidades (origen externo, positivo)

- **Mercado en crecimiento sostenido.** El sector del bienestar digital sigue creciendo, y dentro de él el nicho de «autoconocimiento con profundidad» está poco atendido.
- **Desgaste del contenido superficial.** Existe un cansancio creciente frente al contenido de redes sin fundamento, que favorece a las propuestas que explican sus fuentes.
- **Canal institucional.** Los ayuntamientos y centros culturales programan talleres de divulgación; el material de la plataforma —presentaciones, programas, podcasts— encaja directamente en esa oferta y abre una vía de ingresos distinta a la venta al usuario final.
- **Reutilización del contenido en varios formatos.** El mismo material da lugar a recorrido, curso, ilustración, presentación imprimible, PDF y vídeo corto, multiplicando su rentabilidad sin multiplicar su coste.

### Amenazas (origen externo, negativo)

- **Competencia con gran capacidad de inversión.** Calm o Headspace pueden replicar una funcionalidad en semanas y promocionarla con presupuestos inalcanzables.
- **Escrutinio sobre contenidos de pseudociencia.** Ofrecer astrología o ayurveda junto a nutrición expone a críticas legítimas si la distinción no es explícita, y en el caso extremo a problemas legales si algún texto pudiera leerse como consejo sanitario.
- **Dependencia de proveedores externos.** Supabase, Stripe y el proveedor de despliegue pueden cambiar precios o condiciones.
- **Normativa de protección de datos.** El recorrido de Psicología recoge información sensible (experiencias adversas en la infancia, síntomas disociativos), lo que sitúa al proyecto en la categoría más exigente del RGPD.

La Figura 2 resume los cuatro cuadrantes. El cruce más revelador es el que forman la debilidad «proyecto de una sola persona» y la oportunidad «reutilización del contenido en varios formatos»: la única forma de que una persona sostenga ocho disciplinas es que cada pieza de contenido sirva para varias cosas a la vez.

[FIGURA 2: matriz DAFO resumida en los cuatro cuadrantes]

*Figura 2. Resumen del análisis DAFO del proyecto.*
*(Fuente propia)*

## 2.2. Lean Canvas

**Problema.** Quien quiere entenderse mejor solo encuentra fragmentos sin contexto o manuales inabordables. Las aplicaciones existentes entregan resultados automáticos sin explicar de dónde salen, y ninguna deja al usuario un material propio al terminar.

*Alternativas actuales:* aplicaciones de horóscopo automático (Co–Star, The Pattern), aplicaciones de meditación por sesiones (Calm, Headspace), cursos en plataformas generalistas (Udemy, Domestika), contenido gratuito de redes sociales y libros de divulgación.

**Segmentos de cliente.** Personas adultas, mayoritariamente entre 25 y 50 años, con interés previo en el autoconocimiento y disposición a dedicarle tiempo. Dentro de ese grupo, los *usuarios visionarios* —quienes adoptan primero— son quienes ya consumen contenido de estas disciplinas y se han quedado con la sensación de no haber aprendido nada ordenado.

Un segundo segmento, secundario pero relevante, lo forman las **entidades públicas y centros culturales** que programan actividades de divulgación y para los que el material ya producido resulta directamente aprovechable.

**Proposición de valor única.** *Un recorrido largo por ocho disciplinas del que sales con un documento tuyo, no con una frase.* La plataforma explica siempre de dónde sale cada resultado y dice con claridad qué es ciencia y qué es tradición.

**Solución.** Ocho recorridos guiados paso a paso, con progreso guardado, tests que producen resultados personales, cómics ilustrados que sustituyen a los muros de texto, y generación de PDF descargables al final de cada tramo.

**Canales.** Web propia, redes sociales con material ilustrado del propio catálogo, boletín de correo para suscriptores, códigos QR impresos en carteles que llevan a la presentación pública de cada disciplina, y propuesta directa a entidades públicas mediante dosier.

**Flujos de ingresos.** Venta independiente de cada recorrido (30 € por disciplina), venta de libros en PDF (5 €), llamadas de acompañamiento individuales (20 € la sesión estándar, 60 € la de acompañamiento del recorrido completo) y, como vía institucional, programas para ayuntamientos.

**Estructura de costes.** Despliegue y base de datos en capas de bajo coste, comisión de la pasarela de pago por transacción, dominio, y el coste real dominante: el **tiempo de producción del contenido**, que es varias veces superior al del desarrollo.

**Métricas clave.** Usuarios registrados, tasa de conversión de registro a compra, porcentaje de usuarios que terminan un recorrido empezado, número de PDF generados y disciplinas compradas por usuario.

**Ventaja especial.** El catálogo de contenido propio ilustrado. Un competidor con más presupuesto puede copiar la funcionalidad en semanas, pero no puede copiar dos mil ilustraciones originales ni la voz con la que están escritos los textos sin volver a producirlos desde cero.

La Figura 3 recoge el lienzo completo.

[FIGURA 3: lienzo Lean Canvas completo del proyecto]

*Figura 3. Lienzo Lean Canvas de Life as a Privilege.*
*(Fuente propia)*

## 2.3. Análisis de riesgos

Un proyecto individual de ocho meses está expuesto a contratiempos que pueden detenerlo por completo. Identificarlos antes de empezar permite preparar respuestas en lugar de improvisarlas.

**Escala de probabilidad**

| Nivel | Significado |
|---|---|
| Alta | Es razonable esperar que ocurra al menos una vez al mes durante el proyecto. |
| Media | Es razonable esperar que ocurra una o dos veces a lo largo del proyecto. |
| Baja | Podría no ocurrir; se estima menos de una vez cada varios años. |

**Escala de gravedad**

| Nivel | Significado |
|---|---|
| Alta | Detiene el proyecto más de una semana o compromete la entrega. |
| Media | Detiene el proyecto entre uno y tres días o exige rehacer trabajo ya hecho. |
| Baja | Supone unas horas de trabajo adicional, sin afectar a la planificación. |

[TABLA 1: análisis de riesgos]

*Tabla 1. Riesgos identificados, planes de prevención y planes de contingencia.*

| ID | Riesgo | Prob. | Grav. | Plan de prevención | Plan de contingencia |
|---|---|---|---|---|---|
| R-01 | Pérdida de código o de la memoria | Baja | Alta | Repositorio Git remoto con envío diario; memoria versionada en el mismo repositorio | Recuperar la última versión del repositorio remoto |
| R-02 | Rotura del equipo de desarrollo | Baja | Alta | Todo el estado del proyecto vive en el repositorio y en servicios gestionados, nada crítico en local | Clonar el repositorio en otro equipo y reinstalar el entorno |
| R-03 | Subestimación del volumen de contenido | **Alta** | **Alta** | Contabilizar el contenido en unidades antes de empezar cada disciplina; scripts propios que listan qué falta | Reducir el alcance: publicar la disciplina con menos pasos y ampliarla después |
| R-04 | Superar el ancho de banda del plan de despliegue | Media | Alta | Conversión sistemática de imágenes a WebP y compresión de vídeo antes de publicar | Servir el material pesado desde almacenamiento externo; subir de plan |
| R-05 | Cambio de condiciones de un proveedor externo | Baja | Media | Aislar cada proveedor tras un módulo propio; no usar funcionalidades exclusivas cuando hay alternativa | Sustituir el proveedor tocando solo su módulo |
| R-06 | Fallo en la pasarela de pago que deje ventas sin acreditar | Media | Alta | Verificación doble: webhook y comprobación explícita al volver del pago; panel de administración con concesión manual de acceso | Conceder el acceso manualmente desde el panel y auditar los pagos |
| R-07 | Desconocimiento de tecnologías nuevas | **Alta** | Media | Dedicar la primera iteración íntegra a montar el entorno y validar la pila tecnológica | Sustituir la pieza problemática por otra conocida antes de que se integre en el resto |
| R-08 | Datos guardados con una forma antigua que rompen la aplicación | **Alta** | Media | Formato JSONB flexible; blindaje defensivo al leer (comprobación de tipos de todos los campos) | Barrera de error global que muestra una pantalla de fallo en lugar de una página en blanco |
| R-09 | Solapamiento con otras asignaturas o con trabajo remunerado | Media | Media | Planificación por iteraciones con margen; trabajo diario constante en lugar de sprints intensivos | Reordenar la planificación y mover disciplinas a trabajo futuro |
| R-10 | Contenido que pueda interpretarse como consejo sanitario | Media | **Alta** | Criterio editorial explícito desde el inicio; revisión de todos los textos de disciplinas no científicas | Retirar o reescribir el texto; el criterio ya está documentado en el capítulo 12 |

Cuatro de estos riesgos llegaron a materializarse durante el desarrollo: R-03, R-04, R-07 y R-08. Su impacto real y la eficacia de los planes previstos se analizan en el capítulo 9.
