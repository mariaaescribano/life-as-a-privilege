-- Tabla del recorrido de PSICOLOGÍA (Línea de Vida · Huellas · Nudos · Heridas ·
-- Integración · Mapa). Ejecútalo una vez en el SQL editor de Supabase.
--
-- Todo el progreso del usuario se guarda en la columna `data` (JSONB). Una sola
-- fila por usuario. El backend (metodoPsicologia.service.ts) hace upsert por
-- user_id y solo permite escribir el campo `data`. Como `data` es JSONB, NO hace
-- falta migrar al añadir campos nuevos: se guardan/leen tal cual.
--
-- Forma de `data`:
--   {
--     "problema-actual": "texto...",            -- pantalla "Problemas"
--     "edad": 22,                                -- se pide una sola vez (popup)
--     "anos": {                                  -- "Línea de Vida": un nodo por año
--       "0":  { "respuestas": { "recuerdas": ["..."], "importante": ["..."], ... },
--               "sinRecuerdos": false,
--               "huellas": ["recuerdo marcado", ...] },  -- marcado en "Huellas" (◈)
--       "1":  { "sinRecuerdos": true },
--       ...
--     },
--     "nudos": ["Miedo al abandono", "Perfeccionismo", ...],   -- "Nudos"
--
--     -- "Heridas": el usuario une huellas (experiencia) con nudos (creencia).
--     "heridas": [
--       { "id": "uuid", "titulo": "...", "texto": "descripción...",
--         "huellas": ["recuerdo...", ...],
--         "nudos":   ["Miedo al abandono", ...] }
--     ],
--
--     -- "Integración": relaciona nudos con arquetipos de la carta astral.
--     "constelaciones": [
--       { "id": "uuid", "titulo": "...", "texto": "frase del usuario...",
--         "nudos": ["...", ...],
--         "arquetipos": [
--           { "cuerpoKey": "saturno", "faceta": "casa",  "signo": null,      "casa": 1 },
--           { "cuerpoKey": "sol",     "faceta": "signo", "signo": "Géminis", "casa": null }
--         ] }
--     ]
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
