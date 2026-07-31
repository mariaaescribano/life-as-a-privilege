-- Overrides de las INTERPRETACIONES de la carta (arquetipos del recorrido),
-- los que se editan en /admin/astrologia-textos.
--
-- Por qué existe esta tabla: antes el editor solo reescribía el archivo del
-- proyecto (frontend/src/components/metodo/astrologiaTextos.overrides.ts), así
-- que en producción no se podía guardar nada — el bundle ya está construido y
-- el disco del servidor es de usar y tirar. Con la tabla, guardar desde el
-- panel funciona en producción y los textos se leen en caliente.
--
-- Una sola fila, id = 'overrides', con TODO el conjunto en `data`:
--   { "signo": { "sol": { "Aries": "…" } }, "casa": { "sol": { "1": "…" } } }
-- El editor manda siempre el conjunto completo, así que la fila es la verdad:
-- si una celda no está en `data`, cae al texto original del proyecto (y borrar
-- un override desde el panel se propaga de verdad).
--
-- Ejecútalo una vez en el SQL editor de Supabase.
-- El backend accede con SERVICE_ROLE_KEY (salta RLS), igual que el resto.

create table if not exists public.astrologia_arquetipos (
  id          text        primary key,
  data        jsonb       not null default '{}'::jsonb,
  updated_at  timestamptz not null default now()
);
