# Memoria del TFG · cómo usar esta carpeta

Borrador completo de la memoria, escrito siguiendo la estructura de la *Guía para el desarrollo de TFG* de la EPS y el ejemplo de referencia (Twenglish).

**Estado:** 114 páginas, ~27 500 palabras, 13 capítulos, 26 tablas y 14 figuras (3 ya puestas, 11 por preparar).

## Ficheros

| Fichero | Contenido |
|---|---|
| **`MEMORIA.docx`** | **El documento de Word, editable. Es con el que hay que trabajar.** 114 páginas |
| `MEMORIA.pdf` | Vista previa en PDF, para leerla de un tirón o enviársela al tutor |
| `md-a-docx.py` | Script que genera el `.docx` a partir del Markdown |
| `figuras/` | Las 3 capturas ya insertadas como figuras |
| `MEMORIA-COMPLETA.md` | El texto fuente: los 16 ficheros unidos en uno |
| `00-preliminares.md` | Portada, resumen (ES/EN), motivación, agradecimientos, citas, dedicatoria, índices |
| `01-introduccion.md` … `13-conclusiones.md` | Un fichero por capítulo |
| `14-referencias.md` | Referencias en formato APA |
| `15-apendices.md` | Apéndices: recursos en línea, despliegue, herramientas, diccionario de datos |

## Cómo trabajar a partir de aquí

**Lo normal: edita `MEMORIA.docx` directamente en Word** y olvídate del Markdown. El documento ya trae los estilos de la EPS (hereda los de la plantilla oficial), los títulos con su nivel, las 26 tablas y las 3 figuras puestas.

Solo si prefieres escribir en Markdown y regenerar el Word:

```bash
cd memoria
cat 0*.md 1*.md > MEMORIA-COMPLETA.md    # rehace el texto fuente unido
python md-a-docx.py                      # rehace MEMORIA.docx
```

⚠️ **Ojo: regenerar pisa `MEMORIA.docx` y se pierde lo que hayas editado en Word.** En cuanto empieces a tocar el Word, no vuelvas a ejecutar el script.

El script necesita `pip install python-docx` y busca la plantilla de la EPS en `Descargas`. Si la mueves:

```bash
python md-a-docx.py --plantilla "C:\ruta\plantilla.docx"
```

## Qué hay que hacer dentro del Word

1. **Borrar las 20 notas en gris** («NOTA (borrar antes de entregar): …»). Son avisos para ti.
2. **Sustituir los 11 recuadros en rojo** por las figuras que faltan (tabla más abajo).
3. **Numeración automática de los títulos.** Ahora los números están escritos en el texto («3. Planificación»). Si el tutor la quiere automática: quitar los números a mano y usar **Inicio > Numeración**.
4. **Pies de figura y títulos de tabla.** Están con el estilo `Caption`, pero escritos a mano. Para que los índices se generen solos hay que rehacerlos con **Referencias > Insertar título** y las menciones del texto con **Referencias > Referencia cruzada**.
5. **Generar los tres índices** al final del todo (contenidos, figuras, tablas).
6. **Ajustar el ancho de las columnas** de las tablas largas: salen todas iguales y algunas quedan estrechas.
7. **Exportar a PDF** al terminar: Archivo > Guardar como > PDF.

## Lo que falta por hacer

### Obligatorio antes de entregar

- [ ] **Datos personales**: nombre, tutor, mes y año en la portada (`[NOMBRE Y APELLIDOS]`, `[NOMBRE DEL TUTOR]`, `[MES]`, `[AÑO]`, `[CONVOCATORIA]`).
- [ ] **Las 11 figuras que faltan.** De las 14, tres ya están puestas con capturas reales del proyecto; las demás están marcadas con `[FIGURA n]` y el pie ya escrito. Ver la tabla de figuras más abajo.
- [ ] **Resultados de la validación con usuarios** (apartado 10.4.3). Si no da tiempo a hacer la prueba, declararlo como limitación y pasarlo a trabajo futuro — es lo honesto y un tribunal lo valora más que un dato inventado.
- [ ] **Dirección de la plataforma en producción** y **cuenta de prueba** con las ocho disciplinas concedidas y datos de ejemplo cargados (apéndice I).
- [ ] **README en la raíz del repositorio.** Ahora mismo no hay ninguno, y es lo primero que abre un tribunal.
- [ ] Comprobar que el **repositorio es público** y que la rama principal tiene la versión entregada.

### Muy recomendable

- [ ] **Resumen en valenciano** (la EPS recomienda las tres lenguas).
- [ ] **Reescribir con voz propia** los apartados personales: motivación, agradecimientos, citas, dedicatoria e impresión personal (13.5). Están redactados como borrador y se nota.
- [ ] **Vídeo de demostración** de un recorrido completo (Astrología es el más demostrativo: datos de nacimiento → carta → lectura → PDF). Es lo que se proyecta en la defensa.
- [ ] **Referencias del contenido** de las disciplinas en el capítulo de referencias (manuales de nutrición, fisiología, historia de la medicina…). Un tribunal las va a buscar.
- [ ] Completar los apéndices II, III y IV (variables de entorno, sintaxis de las herramientas, diccionario de datos).

## Figuras

Son **14**. Tres ya están puestas (las capturas que ya existían en el repo, copiadas a `memoria/figuras/`); las otras once están marcadas con `[FIGURA n]` y el pie escrito.

| Nº | Capítulo | Qué es | Estado |
|---|---|---|---|
| 1 | 1.1 | Página de bienvenida con los ocho círculos | ✅ `figuras/fig01-bienvenida-ocho-disciplinas.png` |
| 2 | 2.1 | Matriz DAFO | ⬜ Diagrama (Canva, Figma o Word) |
| 3 | 2.2 | Lienzo Lean Canvas | ⬜ Diagrama |
| 4 | 4.2.1 | Pantalla de carta natal de Co–Star | ⬜ Captura de la app (citar la fuente) |
| 5 | 8.1.3 | Esquema del modelo de datos | ⬜ Diagrama a partir de `backend/sql/*.sql` |
| 6 | 8.2 | Arquitectura conceptual (3 niveles) | ⬜ Diagrama |
| 7 | 8.4 | Pila tecnológica sobre la arquitectura | ⬜ Diagrama con los logos por capa |
| 8 | 8.5.2 | Cabecera de paso y desbloqueo por lectura | ✅ `figuras/fig08-cabecera-paso-desbloqueo.png` |
| 9 | 8.5.2 | Mapa de interacciones de un recorrido | ⬜ Diagrama de flujo entre pantallas |
| 10 | 9.4 | Página de un año de la línea de vida | ✅ `figuras/fig10-linea-de-vida-ano.png` |
| 11 | 10.3 | Peso del paquete antes/después de la carga diferida | ⬜ Gráfico de barras |
| 12 | 10.4.3 | Resultados del cuestionario | ⬜ Gráficos del formulario |
| 13 | 11.2.1 | Versiones registradas por mes | ⬜ Gráfico de barras (datos en la tabla 23) |
| 14 | A.I.1 | Repositorio en GitHub | ⬜ Captura de pantalla |

**Todas las figuras están citadas en el texto** («como muestra la Figura n»), que es requisito de la guía de la EPS. Si añades o quitas alguna, mantén las citas.

Un detalle de la Figura 1: la captura dice «Te damos la bienvenida al Recorrido, **sandra**», que era una cuenta de prueba. Si prefieres otro nombre, vuelve a hacer la captura con la cuenta que dejes preparada para el tribunal.

### Más capturas disponibles sin hacer nada

En `frontend/public/capturasRecorrido/` hay **66 capturas ya hechas** que puedes usar para añadir figuras extra si quieres ilustrar más el capítulo 9:

- `astro/` — 20 capturas del recorrido de Astrología (carta, casas, aspectos, modales)
- `psico/` — 20 del recorrido de Psicología (línea de vida, edad, preguntas)
- `hinduismo/` — 26 del recorrido de Ayurveda

Si añades alguna, **renumera las siguientes y sus citas en el texto**. En `frontend/public/miniaturas/` hay además 10 portadas de curso.

## Sobre los datos del capítulo 11

Todas las cifras de la tabla 20 están medidas sobre el repositorio real (541 versiones, 839 ficheros, ~218 200 líneas, 187 rutas, 129 endpoints, 1 907 imágenes, 275 MB). Si sigues desarrollando antes de entregar, vuelve a medirlas:

```bash
git log --oneline | wc -l                                             # versiones
find frontend/src backend/src -name "*.ts" -o -name "*.tsx" | wc -l   # ficheros
grep -c "<Route " frontend/src/App.tsx                                # rutas
du -sh frontend/public                                                # peso
```
