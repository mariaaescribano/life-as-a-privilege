-- Tabla del recorrido de FISIOLOGÍA (De las partículas al milagro de ser un
-- cuerpo). Ejecútalo una vez en el SQL editor de Supabase.
--
-- Todo el progreso del usuario se guarda en la columna `data` (JSONB). Una sola
-- fila por usuario. El backend (metodoFisiologia.service.ts) hace upsert por
-- user_id y solo permite escribir `data` e `intro_visto`. Como `data` es JSONB,
-- NO hace falta migrar al añadir campos nuevos: se guardan/leen tal cual.
--
-- Forma de `data` (se irá ampliando con cada paso del recorrido):
--   {
--     -- Paso "Construye una partícula": marca la actividad como completada.
--     "particulas_hecho": true,
--     -- Paso "Construye un átomo" (protones/neutrones al núcleo + electrones a la órbita).
--     "atomos_hecho": true,
--     -- Paso "Moléculas": juntar dos átomos de H para crear el enlace (H₂).
--     "moleculas_hecho": true
--   }

create table if not exists public.metodo_fisiologia (
  user_id     text        primary key,
  data        jsonb       not null default '{}'::jsonb,
  intro_visto boolean     not null default false,
  updated_at  timestamptz not null default now()
);

-- (Opcional) integridad referencial con la tabla de usuarios. Quítalo si el
-- tipo/clave de public."user" no coincide o no quieres la restricción.
-- alter table public.metodo_fisiologia
--   add constraint metodo_fisiologia_user_fk
--   foreign key (user_id) references public."user"(id) on delete cascade;

-- El backend accede con SERVICE_ROLE_KEY (salta RLS), igual que el resto de tablas.

-- ── Flags de acceso a la disciplina en la tabla user (5ª disciplina) ──
-- Se marca true tras el pago (Stripe checkout → /payment/fisiologia/verify).
alter table public."user" add column if not exists fisiologia_suscrito     boolean     not null default false;
alter table public."user" add column if not exists fisiologia_fecha_compra  timestamptz;
