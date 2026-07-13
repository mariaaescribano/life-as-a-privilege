-- Tabla del recorrido de NUTRICIÓN (6ª disciplina de «El Recorrido»).
-- Ejecútalo una vez en el SQL editor de Supabase.
--
-- Todo el progreso del usuario se guarda en la columna `data` (JSONB). Una sola
-- fila por usuario. El backend (metodoNutricion.service.ts) hace upsert por
-- user_id y solo permite escribir `data` e `intro_visto`. Como `data` es JSONB,
-- NO hace falta migrar al añadir campos nuevos: se guardan/leen tal cual.

create table if not exists public.metodo_nutricion (
  user_id     text        primary key,
  data        jsonb       not null default '{}'::jsonb,
  intro_visto boolean     not null default false,
  updated_at  timestamptz not null default now()
);

-- (Opcional) integridad referencial con la tabla de usuarios. Quítalo si el
-- tipo/clave de public."user" no coincide o no quieres la restricción.
-- alter table public.metodo_nutricion
--   add constraint metodo_nutricion_user_fk
--   foreign key (user_id) references public."user"(id) on delete cascade;

-- El backend accede con SERVICE_ROLE_KEY (salta RLS), igual que el resto de tablas.

-- ── Flags de acceso a la disciplina en la tabla user (6ª disciplina) ──
-- Se marca true tras el pago (Stripe checkout → /payment/nutricion/verify) o en
-- modo test (/payment/test/unlock con scope 'nutricion').
alter table public."user" add column if not exists nutricion_suscrito     boolean     not null default false;
alter table public."user" add column if not exists nutricion_fecha_compra  timestamptz;
