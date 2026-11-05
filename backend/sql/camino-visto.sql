-- Páginas del camino que la persona YA HA VISTO (el tick de las cajitas de /camino/<slug>).
-- Una fila por (persona, disciplina, ruta). Ejecútalo una vez en el SQL editor de Supabase.
-- Mientras no exista, el servidor devuelve lista vacía y el navegador recuerda los ticks
-- en su localStorage (no se pierde nada, pero no viaja entre dispositivos).
--
-- Va con RLS activado y SIN políticas (como el resto): solo entra el backend con service_role.
-- Se borra con la cuenta (relatedTables de deleteUser en user.service.ts).

create table if not exists public.camino_visto (
  user_id     text        not null,
  disciplina  text        not null,
  ruta        text        not null,
  created_at  timestamptz not null default now(),
  primary key (user_id, disciplina, ruta)
);

alter table public.camino_visto enable row level security;
