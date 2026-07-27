# Cómo revertir la conversión a WebP

Cada lote convertido deja un registro `lote-<n>.csv` con **todos** los archivos
que se tocaron: ruta del PNG original, ruta del WebP nuevo, tamaño antes y
después, y las medidas originales.

Los PNG **no se han perdido**: siguen en el historial de git (estaban los 1265
commiteados). Revertir es sacarlos de ahí otra vez.

## Revertir el lote entero

Desde la raíz del repo, con `<REF>` = el commit anterior a la conversión
(si aún no has commiteado nada, `<REF>` es simplemente `HEAD`):

```bash
# 1. Recuperar los PNG originales
git checkout <REF> -- frontend/public/recorrido/cultura/historiageneral \
                      frontend/public/recorrido/cultura/historiareligion \
                      frontend/public/recorrido/cultura/historiafilosofia \
                      frontend/public/recorrido/nutricion/moleculas \
                      frontend/public/recorrido/nutricion/mitos \
                      frontend/public/recorrido/nutricion/portadas \
                      frontend/public/recorrido/nutricion/alimentos \
                      frontend/public/recorrido/fisiologia/pre \
                      "frontend/public/viñetas/fisiologia/celulas"

# 2. Deshacer los cambios de ruta en el código
git checkout <REF> -- frontend/src frontend/index.html

# 3. Borrar los WebP que dejó la conversión
node scripts/webp/revertir.mjs --lote=1
```

El **lote 2** son solo los fondos, así que es más corto:

```bash
git checkout <REF> -- frontend/public/img/fondos
git checkout <REF> -- frontend/src
node scripts/webp/revertir.mjs --lote=2
```

## Revertir una sola imagen

```bash
git checkout <REF> -- "frontend/public/<ruta del CSV>"
```

…y en el código, cambiar esa ruta de `.webp` a `.png` a mano. Búscala con el
nombre del archivo; solo aparece en uno o dos sitios.

## Qué se hizo exactamente

- **Redimensionado**: lado mayor máximo 1000 px en el lote 1 (nunca se amplió
  nada). Las ilustraciones se muestran a 400-600 px, así que sigue sobrando
  resolución para pantallas retina. Los fondos del lote 2 van a 1280 px porque
  son los únicos que se ven a ancho de panel completo.
- **Formato**: WebP calidad 80. En las pruebas a tamaño de pantalla no se
  distingue del PNG original.
- **Nunca a peor**: si el WebP salía igual o más grande que el PNG, el archivo
  se dejaba como estaba.
- **Carpetas completas**: se convierten carpetas enteras, nunca archivos
  sueltos, para que las rutas dinámicas del código (`/carpeta/${clave}.png`)
  se puedan reescribir sin dejar media carpeta en cada formato.

## Los scripts

| script | para qué |
|---|---|
| `convertir.mjs` | convierte un lote (`--prueba` saca 3 muestras sin tocar nada) |
| `rutas.mjs` | reescribe las rutas del código (`--revisar` informa sin escribir) |
| `manifiesto.mjs` | rehace el CSV desde disco + git, si la conversión se cortó a medias |
| `revertir.mjs` | borra los WebP de un lote (paso 3 de arriba) |

## Lotes hechos y lo que queda

| lote | qué | archivos | antes | ahora |
|---|---|---|---|---|
| 1 | las 9 carpetas más pesadas del recorrido | 552 | 356,3 MB | 96,4 MB |
| 2 | `img/fondos` (fondos de disciplina) | 15 | 5,5 MB | 1,4 MB |

Quedan **698 PNG, unos 275 MB**: el resto de `viñetas/` (astrología, tcm,
hinduismo, nutrición…), `recorrido/cabala`, `recorrido/tcm`, `capturasRecorrido`,
`cursos`, `libros`, `miniaturas` y los iconos de `img/`.

Para el siguiente lote basta con añadir un `3: { ladoMax, carpetas }` a la
constante `LOTES` de `convertir.mjs` y repetir los mismos pasos.
