-- ─────────────────────────────────────────────────────────────────────────────
-- DIARIO DE SESIONES — las notas que María escribe DESPUÉS de una sesión y que
-- la persona lee en su Home (/diario).
--
-- OJO, no confundir con la tabla `notas` (backend/src/metodoNotas/notas.sql):
-- aquella es el mini-diario que escribe el PROPIO usuario dentro del recorrido.
-- Esta la escribe la admin PARA él.
--
-- Ejecutar en el editor SQL de Supabase (una sola vez). Si se corre desde
-- fuera, por el POOLER (el host directo es solo IPv6).
-- ─────────────────────────────────────────────────────────────────────────────

create table if not exists public.diario_sesion (
  id          uuid primary key default gen_random_uuid(),
  -- A quién va dirigida. text, igual que public."user".id (nanoid, NO uuid).
  user_id     text not null,
  -- Fecha de la SESIÓN, no la de escritura: se puede apuntar días después.
  fecha       date not null default current_date,
  -- key de disciplina (astrologia, psicologia, ayurveda, tcm, fisiologia,
  -- nutricion, cabala, cultura) o null si la sesión no fue de ninguna.
  disciplina  text,
  titulo      text,
  -- Lo que se habló o se trabajó en la sesión.
  contenido   text not null,
  -- El PORQUÉ: por qué le digo esto, qué sentido tiene. Va en su propio bloque
  -- destacado en la página, así que se guarda aparte del contenido.
  porque      text,
  -- Borrador (false) o visible para la persona (true). Sin esto, una nota a
  -- medias se vería en su Home en cuanto se guarda.
  publicada   boolean not null default false,
  -- Cuándo la abrió. null = no la ha leído → marca de «nuevo» en su Home.
  leida_at    timestamptz,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Si la tabla se creó antes con user_id uuid («invalid input syntax for type
-- uuid: ...»), corrige el tipo con:
--   alter table public.diario_sesion alter column user_id type text using user_id::text;

-- «Las entradas de esta persona, de la más reciente a la más antigua».
create index if not exists diario_sesion_user_fecha_idx
  on public.diario_sesion (user_id, fecha desc, created_at desc);

-- El backend usa la SERVICE_ROLE_KEY (salta RLS), igual que el resto de tablas.
-- No hace falta habilitar RLS salvo que quieras acceso directo desde el cliente.
