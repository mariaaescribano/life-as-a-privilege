-- Tabla del recorrido de PSICOLOGÍA ("Línea de Vida", "Las Huellas", "Los Nudos").
-- Ejecútalo una vez en el SQL editor de Supabase.
--
-- Todo el progreso del usuario se guarda en la columna `data` (JSONB). Una sola
-- fila por usuario. El backend (metodoPsicologia.service.ts) hace upsert por
-- user_id y solo permite escribir el campo `data`.
--
-- Forma de `data`:
--   {
--     "problema-actual": "texto...",            -- pantalla "Problemas"
--     "edad": 22,                                -- se pide una sola vez (popup)
--     "anos": {                                  -- "Línea de Vida": un nodo por año
--       "0":  { "respuestas": { "recuerdas": "...", "importante": "...", ... },
--               "sinRecuerdos": false,
--               "huella": true },                -- marcado en "Las Huellas"
--       "1":  { "sinRecuerdos": true },
--       ...
--     },
--     "nudos": ["Miedo al abandono", "Perfeccionismo", ...]  -- "Los Nudos"
--   }

create table if not exists public.metodo_psicologia (
  user_id     text        primary key,
  data        jsonb       not null default '{}'::jsonb,
  updated_at  timestamptz not null default now()
);

-- (Opcional) integridad referencial con la tabla de usuarios. Quítalo si el
-- tipo/clave de public."user" no coincide o no quieres la restricción.
-- alter table public.metodo_psicologia
--   add constraint metodo_psicologia_user_fk
--   foreign key (user_id) references public."user"(id) on delete cascade;

-- El backend accede con SERVICE_ROLE_KEY (salta RLS), igual que el resto de tablas.
