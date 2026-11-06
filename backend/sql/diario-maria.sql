-- DIARIO de María: lo que apunta de sí misma (solo ella lo lee y lo escribe, desde el backend).
-- No lleva user_id: no pertenece a ninguna persona.
create table if not exists public.diario_maria (
  id uuid default gen_random_uuid() not null,
  contenido text not null,
  created_at timestamptz default now() not null,
  primary key (id)
);
-- RLS activado SIN políticas (el backend entra con service_role): nadie más la ve.
alter table public.diario_maria enable row level security;
