-- Marca de "revisado" por curso. Es un check PERSONAL del admin (para ir
-- marcando qué cursos ya has revisado), no una propiedad pública del curso ni
-- lo mismo que `curso.completado`. Solo lo ve/usa el panel /admin/cursos.
-- Ejecutar en el editor SQL de Supabase (una sola vez).

create table if not exists public.curso_revisado (
  curso_id   uuid primary key references public.curso(id) on delete cascade,
  revisado   boolean not null default true,
  updated_at timestamptz not null default now()
);

-- El backend usa la SERVICE_ROLE_KEY (salta RLS), igual que el resto de tablas.
-- No hace falta habilitar RLS salvo que quieras acceso directo desde el cliente.
