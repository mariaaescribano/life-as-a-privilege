-- Reemplaza «dosha/doshas» → «Doṣha/Doṣhas» en el contenido de los cursos.
-- (La «s» lleva punto debajo: ṣ = U+1E63; el término va siempre capitalizado.)
--
-- Ejecútalo una vez en el SQL editor de Supabase.
--
-- Solo reemplaza la PALABRA COMPLETA (límite de palabra \y), en prosa: títulos,
-- descripciones, nombres de lección, markdown y enunciados. NO afecta a ids,
-- claves, slugs de modalidad ni identificadores (no hay URLs con la palabra
-- «dosha» dentro de `contenido`). Se reemplaza el plural primero.

begin;

-- ── Columnas de texto plano ──────────────────────────────────────────────
update public.curso set
  titulo = regexp_replace(
             regexp_replace(titulo, '\ydoshas\y', 'Doṣhas', 'gi'),
             '\ydosha\y', 'Doṣha', 'gi'),
  descripcion = regexp_replace(
             regexp_replace(descripcion, '\ydoshas\y', 'Doṣhas', 'gi'),
             '\ydosha\y', 'Doṣha', 'gi'),
  descripcion_contenido = regexp_replace(
             regexp_replace(descripcion_contenido, '\ydoshas\y', 'Doṣhas', 'gi'),
             '\ydosha\y', 'Doṣha', 'gi')
where titulo ~* '\ydoshas?\y'
   or descripcion ~* '\ydoshas?\y'
   or descripcion_contenido ~* '\ydoshas?\y';

-- ── Árbol de módulos/lecciones (JSONB) ────────────────────────────────────
-- Se serializa el JSON, se reemplaza la palabra en la prosa y se vuelve a JSON.
update public.curso set
  contenido = regexp_replace(
                regexp_replace(contenido::text, '\ydoshas\y', 'Doṣhas', 'gi'),
                '\ydosha\y', 'Doṣha', 'gi'
              )::jsonb
where contenido::text ~* '\ydoshas?\y';

commit;

-- Comprobación (opcional): no debería quedar ninguna «dosha» suelta sin el punto.
-- select id, modalidad, titulo from public.curso
-- where titulo ~* '\ydoshas?\y' or descripcion ~* '\ydoshas?\y'
--    or descripcion_contenido ~* '\ydoshas?\y' or contenido::text ~* '\ydoshas?\y';
