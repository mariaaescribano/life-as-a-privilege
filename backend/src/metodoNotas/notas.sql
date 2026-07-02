-- Tabla del mini-diario de notas.
-- Ejecutar en el editor SQL de Supabase (una sola vez).

create table if not exists public.notas (
  id         uuid primary key default gen_random_uuid(),
  user_id    text not null,   -- id del usuario dueño de la nota (mismo tipo que public."user".id: text/nanoid, NO uuid)
  contenido  text not null,
  categoria  text,            -- key de la disciplina (astrologia, psicologia, ...) o null
  created_at timestamptz not null default now()
);

-- Si ya creaste la tabla con user_id uuid (fallará con «invalid input syntax
-- for type uuid: ...»), corrige el tipo con:
--   alter table public.notas alter column user_id type text using user_id::text;

-- Búsqueda rápida de "las notas de un usuario, más recientes primero"
create index if not exists notas_user_created_idx
  on public.notas (user_id, created_at desc);

-- El backend usa la SERVICE_ROLE_KEY (salta RLS), igual que el resto de tablas
-- metodo_*. No hace falta habilitar RLS salvo que quieras acceso directo desde
-- el cliente; en ese caso, añade políticas por user_id.
