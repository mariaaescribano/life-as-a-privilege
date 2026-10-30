-- Contenido premium (/premium/espacio: Podcasts y Reels). Correr UNA vez en Supabase.
--
-- Pago de 5 € por mes, SIN guardar la tarjeta: cada pago da un mes de acceso
-- (`premium_hasta`) y unos días antes de que acabe se manda un correo para renovar.

-- 1. Lo que cuelga de la cuenta.
alter table public."user" add column if not exists premium_hasta                 timestamptz;
alter table public."user" add column if not exists premium_avisos_elegidos       boolean not null default false;
alter table public."user" add column if not exists premium_aviso_email           boolean not null default true;
alter table public."user" add column if not exists premium_aviso_whatsapp             boolean not null default false;
-- El `premium_hasta` del que ya se mandó el aviso de renovación (para no repetirlo).
alter table public."user" add column if not exists premium_renovacion_avisada    timestamptz;

-- 2. Cada pago de Stripe, para poder pagar ANTES de tener cuenta y reclamarlo después.
create table if not exists public.premium_pago (
  session_id  text primary key,
  email       text,
  user_id     uuid,           -- null = pagado, aún sin reclamar por ninguna cuenta
  created_at  timestamptz not null default now(),
  reclamado_at timestamptz
);

-- 3. Los podcasts y reels que publica María (enlaces de YouTube).
create table if not exists public.premium_contenido (
  id          uuid primary key default gen_random_uuid(),
  tipo        text not null check (tipo in ('podcast', 'reel')),
  titulo      text not null,
  archivo     text not null,  -- ID del vídeo de YouTube (se pega el enlace; no se sube nada)
  mensaje     text,           -- lo que se mandó a quien quiso aviso
  avisados    integer not null default 0,
  created_at  timestamptz not null default now()
);

-- RLS sin políticas: el backend entra con service_role.
alter table public.premium_pago      enable row level security;
alter table public.premium_contenido enable row level security;
