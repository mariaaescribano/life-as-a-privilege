-- Tabla de los SUSCRIPTORES (el formulario de «déjame tu correo» y los voluntarios).
-- Ejecútalo una vez en el SQL editor de Supabase.
--
-- Antes esto se guardaba en backend/data/subscribers.txt, un fichero DENTRO del
-- servidor. Como el disco de Render es de usar y tirar, cada despliegue se
-- llevaba por delante los correos nuevos y además nunca llegaban a tu ordenador
-- (el .txt del repositorio es una copia vieja de mayo). Por eso «faltaban» los
-- últimos suscriptores. Ahora van a esta tabla, igual que el resto de los datos.

create table if not exists public.suscriptor (
  id          uuid primary key default gen_random_uuid(),
  email       text not null unique,
  origen      text,                                -- 'voluntario', la página desde la que se apuntó…
  created_at  timestamptz not null default now()
);

create index if not exists suscriptor_created_at_idx on public.suscriptor (created_at desc);

-- ── Los que ya había en subscribers.txt, para no perder a nadie ──
insert into public.suscriptor (email) values
  ('mariaescribanoarce3@gmail.com'),
  ('nickreal03@gmail.com'),
  ('xeniags.2007@gmail.com'),
  ('alessandro20rlchess@gmail.com'),
  ('valentunaandrade08@gmail.com'),
  ('maanllpl@gmail.com'),
  ('andllor055@gmail.com'),
  ('derekmartroz@gmail.com'),
  ('asunarce@gmail.com'),
  ('evelynmontano20@gmail.com'),
  ('susana.izquierdo.danot@gmail.com'),
  ('ekaterina.artamonova.korneeva@gmail.com'),
  ('mariagb71@hotmail.com'),
  ('cristianburgos2004@gmail.com'),
  ('antoniogolmar@yahoo.com'),
  ('lmengibarmartinez@gmail.com'),
  ('jmr.vadillo@gmail.com'),
  ('miscomprasyolanda@gmail.com')
on conflict (email) do nothing;

-- El backend accede con SERVICE_ROLE_KEY (salta RLS), igual que el resto de tablas.
