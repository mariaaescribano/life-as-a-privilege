-- Tabla de INTERPRETACIONES de arquetipos de la carta astral.
-- Ejecútalo una vez en el SQL editor de Supabase.
--
-- Sustituye al archivo hardcodeado del frontend (astrologiaTextos.ts): así los
-- textos se pueden editar en cualquier momento desde el panel de admin, sin
-- redeploy.
--
-- Cada fila es la interpretación de UNA faceta de un cuerpo:
--   · faceta = 'signo' → valor = nombre del signo ("Aries", "Tauro", …)
--   · faceta = 'casa'  → valor = número de casa como texto ("1" … "12")
--
-- La clave primaria (cuerpo, faceta, valor) permite hacer upsert por celda.

create table if not exists public.astrologia_textos (
  cuerpo     text not null,               -- clave del cuerpo (sol, luna, ascendente, quiron, …)
  faceta     text not null,               -- 'signo' | 'casa'
  valor      text not null,               -- nombre de signo, o número de casa (1..12)
  texto      text not null default '',
  updated_at timestamptz not null default now(),
  primary key (cuerpo, faceta, valor)
);

create index if not exists astrologia_textos_cuerpo_idx on public.astrologia_textos (cuerpo);

-- El backend accede con SERVICE_ROLE_KEY (salta RLS), igual que el resto de tablas.
