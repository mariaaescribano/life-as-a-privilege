# Los cursos, en español y en inglés

Los cursos viven en la tabla `curso` de Supabase y **el español de la BD sigue
siendo la fuente de verdad**. Esta carpeta guarda dos cosas:

```
es/                 copia de respaldo del español (la app NO la lee)
en/                 traducción al inglés (la app SÍ la lee)
catalogo-en.json    índice ligero del inglés, generado a partir de en/
```

## Cómo se lee el inglés

`catalogo-en.json` es pequeño (títulos de curso, de módulo y de lección) y se
carga entero en cuanto el idioma activo es inglés: con eso ya salen traducidos
el catálogo de cursos y el índice de módulos.

El cuerpo de las lecciones (el markdown y los tests, que son casi 900.000
caracteres) **no** se carga hasta que abres una lección: entonces se pide el
fichero `en/<curso>.json` de ese curso y nada más.

Si a una lección le falta la traducción, se muestra en español. Igual que el
resto del `i18n`: el inglés es parcial y el español es el respaldo.

## Flujo de trabajo

1. `node scripts/cursos-volcar.mjs` — trae el español de la BD a `es/`.
2. Se traduce `es/<curso>.json` → `en/<curso>.json`, **mismo nombre de fichero**
   y misma estructura: se traducen los textos y no se tocan los `id`, ni
   `tipo`, ni `video`, ni `correcta`.
3. `node scripts/cursos-catalogo.mjs` — regenera `catalogo-en.json`.

Si un curso cambia en la BD, se vuelve a volcar y se retraduce lo que cambió.
