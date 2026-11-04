-- ─────────────────────────────────────────────────────────────────────────────
-- NOTA DE MARÍA EN CADA PÁGINA DEL RECORRIDO — lo que María escribe PARA una
-- persona en una página concreta (/metodo/...). Tiene dos textos:
--   · `borrador`  — lo que María escribe; la persona NO lo ve.
--   · `publicada` — lo que la persona ve. Se copia del borrador al pulsar
--                   «Publicar»; null = la persona no ve nada.
--
-- OJO, no confundir con `notas` (el mini-diario que escribe la PROPIA persona) ni
-- con `diario_sesion` (las notas de después de cada sesión).
--
-- Ejecutar en el editor SQL de Supabase (una sola vez). Si se corre desde
-- fuera, por el POOLER (el host directo es solo IPv6).
-- ─────────────────────────────────────────────────────────────────────────────

create table if not exists public.nota_pagina (
  -- text, igual que public."user".id (nanoid, NO uuid).
  user_id       text not null,
  -- La ruta de la página, sin barra final ni parámetros: «/metodo/psicologia/problema».
  pagina        text not null,
  borrador      text not null default '',
  publicada     text,
  publicada_at  timestamptz,
  updated_at    timestamptz not null default now(),
  primary key (user_id, pagina)
);

-- RLS activado SIN políticas: el backend usa la service_role (salta RLS) y nadie
-- más debe poder leer estas notas directamente.
alter table public.nota_pagina enable row level security;
