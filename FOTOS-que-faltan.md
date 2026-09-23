# Fotos que faltan — todas las disciplinas

Generado con `node scripts/fotos-que-faltan.mjs`: reúne todas las rutas de
imagen que pide el frontend y las compara con `frontend/public`.

Cada línea es la **ruta exacta** donde hay que dejar el archivo, con el nombre
tal cual. La carpeta se crea si no existe.
Formato: `.webp` salvo que la ruta diga otra cosa.

De Cultura solo va el recuento: el detalle —qué momento es cada archivo— está
en `CULTURA-fotos-que-faltan.md`, que además trae el título de cada hueco.

## Resumen

| Disciplina | Faltan |
| --- | --- |
| Cultura | 1 |
| Fisiología | 3 |
| Medicina China | 5 |
| **TOTAL** | **9** |

## Cultura — faltan 1

Están una a una, con su momento, en `CULTURA-fotos-que-faltan.md`.

## Fisiología — faltan 3

### `frontend/public/recorrido/fisiologia/colageno/`

- `tipo6.webp` — la pide `frontend/src/app/metodo/MetodoFisiologiaTodasCelulas.tsx`

### `frontend/public/recorrido/fisiologia/pre/`

- `cuerpo.png` — la pide `frontend/src/app/metodo/MetodoFisiologiaOrganismo.tsx`
- `proteina.png` — la pide `frontend/src/app/metodo/MetodoFisiologiaEstructuras.tsx`

## Medicina China — faltan 5

### `frontend/public/recorrido/tcm/constitucion/`

Todavía no las pide el código: las cinco tarjetas de constitución reutilizan la pintura de fondo de su elemento. Cuando estén, hay que cambiar `FOTO_CONSTITUCION` en `components/metodo/tcmConstitucion.ts` (es el único sitio que las nombra).

- `agua.webp`
- `fuego.webp`
- `madera.webp`
- `metal.webp`
- `tierra.webp`

