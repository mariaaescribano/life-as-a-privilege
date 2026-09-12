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
| Cultura | 48 |
| Fisiología | 6 |
| Nutrición | 9 |
| Medicina China | 5 |
| **TOTAL** | **68** |

## Cultura — faltan 48

Están una a una, con su momento, en `CULTURA-fotos-que-faltan.md`.

## Fisiología — faltan 6

### `frontend/public/recorrido/fisiologia/colageno/`

- `tipo6.webp` — la pide `frontend/src/app/metodo/MetodoFisiologiaTodasCelulas.tsx`

### `frontend/public/recorrido/fisiologia/pre/`

- `celula.png` — la pide `frontend/src/app/metodo/MetodoFisiologiaTejidos.tsx`
- `cuerpo.png` — la pide `frontend/src/app/metodo/MetodoFisiologiaOrganismo.tsx`
- `organo.png` — la pide `frontend/src/app/metodo/MetodoFisiologiaOrganos.tsx`
- `proteina.png` — la pide `frontend/src/app/metodo/MetodoFisiologiaEstructuras.tsx`
- `tejido.png` — la pide `frontend/src/app/metodo/MetodoFisiologiaOrganos.tsx`, `frontend/src/app/metodo/MetodoFisiologiaTejidos.tsx`

## Nutrición — faltan 9

### `frontend/public/recorrido/nutricion/ultraprocesados/`

- `acrilamida.webp` — la pide `frontend/src/hardCoded/espacio/UltraprocesadosNutricion.ts`
- `bpa-ftalatos.webp` — la pide `frontend/src/hardCoded/espacio/UltraprocesadosNutricion.ts`
- `colorantes-azoicos.webp` — la pide `frontend/src/hardCoded/espacio/UltraprocesadosNutricion.ts`
- `dioxido-titanio.webp` — la pide `frontend/src/hardCoded/espacio/UltraprocesadosNutricion.ts`
- `edulcorantes.webp` — la pide `frontend/src/hardCoded/espacio/UltraprocesadosNutricion.ts`
- `emulgentes.webp` — la pide `frontend/src/hardCoded/espacio/UltraprocesadosNutricion.ts`
- `fosfatos.webp` — la pide `frontend/src/hardCoded/espacio/UltraprocesadosNutricion.ts`
- `grasas-trans.webp` — la pide `frontend/src/hardCoded/espacio/UltraprocesadosNutricion.ts`
- `nitritos.webp` — la pide `frontend/src/hardCoded/espacio/UltraprocesadosNutricion.ts`

## Medicina China — faltan 5

### `frontend/public/recorrido/tcm/constitucion/`

Todavía no las pide el código: las cinco tarjetas de constitución reutilizan la pintura de fondo de su elemento. Cuando estén, hay que cambiar `FOTO_CONSTITUCION` en `components/metodo/tcmConstitucion.ts` (es el único sitio que las nombra).

- `agua.webp`
- `fuego.webp`
- `madera.webp`
- `metal.webp`
- `tierra.webp`

