-- Tabla del recorrido de CÁBALA (Árbol de la Vida · las 10 sefirot/dimensiones).
-- Ejecútalo una vez en el SQL editor de Supabase.
--
-- Todo el progreso del usuario se guarda en la columna `data` (JSONB). Una sola
-- fila por usuario. El backend (metodoCabala.service.ts) hace upsert por user_id
-- y solo permite escribir el campo `data`. Como `data` es JSONB, NO hace falta
-- migrar al añadir campos nuevos.
--
-- Forma de `data`:
--   {
--     -- Sefirot (dimensiones) que el usuario ya ha visto. Al ver todas (10),
--     -- el recorrido del árbol se marca como completado (tick).
--     "sefirotVistas": ["kether", "chokmah", ...]
--   }

create table if not exists public.metodo_cabala (
  user_id     text        primary key,
  data        jsonb       not null default '{}'::jsonb,
  updated_at  timestamptz not null default now()
);

-- El backend accede con SERVICE_ROLE_KEY (salta RLS), igual que el resto de tablas.

-- Nota: los flags de acceso a la disciplina (cabala_suscrito / cabala_fecha_compra)
-- se crean en backend/sql/user-recorrido.sql (7ª disciplina).
