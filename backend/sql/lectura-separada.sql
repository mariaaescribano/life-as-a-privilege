-- ─────────────────────────────────────────────────────────────────────────────
-- LAS PERSONAS DE LECTURA ASTRAL, EN SUS PROPIAS TABLAS (nov-2026)
--
-- Hay DOS tipos de persona y no comparten tabla:
--   · cuenta real («en sesión»)  → tabla `user` (+ metodo_astrologia, recorrido_progreso…)
--   · lectura astral (sin cuenta) → `lectura_cliente` (quién es) + `lectura_astrologia` (su carta y sus textos)
-- Las de lectura NO tienen contraseña ni fila en `user`: entran con el enlace del correo, que se firma con `clave`.
-- Su id lleva el prefijo `lec_` (así el backend sabe en qué tabla mirar).
--
-- Ejecútalo UNA vez en el SQL editor de Supabase (es idempotente: se puede repetir sin romper nada).
-- Hace tres cosas: crea las tablas, MUEVE a las personas de lectura que ya existen (Josep) con su carta y sus
-- textos, y borra sus filas viejas de `user` (y lo que colgaba de ellas). Solo la lee y la escribe el backend.
-- ─────────────────────────────────────────────────────────────────────────────

-- 1 · Quién es cada persona de lectura.
create table if not exists public.lectura_cliente (
  id text primary key,                          -- 'lec_xxxxxxxx'
  created_at timestamptz not null default now(),
  nombre text not null,
  email text not null,
  -- Secreto propio que firma el enlace de acceso del correo (no es una contraseña que elija nadie).
  clave text not null,
  acceso_enviado_at timestamptz,                -- cuándo se le mandó el correo con el enlace
  ultimo_acceso_at timestamptz                  -- la última vez que entró
);
create unique index if not exists lectura_cliente_email_idx on public.lectura_cliente (lower(email));
alter table public.lectura_cliente enable row level security;

-- 2 · Su carta y sus textos: las MISMAS columnas que `metodo_astrologia`, pero sin colgar de `user`.
create table if not exists public.lectura_astrologia (like public.metodo_astrologia including all);
alter table public.lectura_astrologia enable row level security;

-- 3 · El pedido apunta a su persona de lectura (antes apuntaba a una cuenta de `user`).
alter table public.lectura_pedido add column if not exists cliente_id text;
create index if not exists lectura_pedido_cliente_idx on public.lectura_pedido (cliente_id);

-- 4 · Mover a las personas de lectura que ya existían como «cuenta solo carta» (user.solo_lectura = true) y tienen
--     algún pedido. Conservan su enlace de acceso: `clave` = el secreto que ya firmaba sus enlaces.
insert into public.lectura_cliente (id, created_at, nombre, email, clave)
select 'lec_' || u.id, now(), u.name, u.email, u.password
from public."user" u
where u.solo_lectura = true
  and exists (select 1 from public.lectura_pedido p where p.user_id = u.id)
on conflict (id) do nothing;

insert into public.lectura_astrologia
  (user_id, aviso_visto, fecha_nacimiento, hora_nacimiento, pais, lugar, region, solicitud_enviada_at, link_carta,
   data, updated_at, latitud, longitud, timezone, carta_natal_json, casas_texto, aspectos_texto, retos, intro_visto)
select 'lec_' || m.user_id, m.aviso_visto, m.fecha_nacimiento, m.hora_nacimiento, m.pais, m.lugar, m.region,
       m.solicitud_enviada_at, m.link_carta, m.data, m.updated_at, m.latitud, m.longitud, m.timezone,
       m.carta_natal_json, m.casas_texto, m.aspectos_texto, m.retos, m.intro_visto
from public.metodo_astrologia m
where m.user_id in (select substr(id, 5) from public.lectura_cliente where id like 'lec\_%')
on conflict (user_id) do nothing;

update public.lectura_pedido
set cliente_id = 'lec_' || user_id
where user_id is not null
  and cliente_id is null
  and ('lec_' || user_id) in (select id from public.lectura_cliente);

-- 5 · Fuera las cuentas viejas «solo carta» de `user` y todo lo que colgaba de ellas (si una tabla no existe, se salta).
do $$
declare
  ids text[];
  t record;
begin
  select array_agg(id) into ids from public."user" where solo_lectura = true;
  if ids is null then return; end if;

  for t in
    select * from (values
      ('metodo_psicologia','user_id'), ('psicologia_des','user_id'), ('metodo_astrologia','user_id'),
      ('metodo_ayurveda','user_id'), ('metodo_tcm','user_id'), ('metodo_fisiologia','user_id'),
      ('metodo_nutricion','user_id'), ('metodo_cabala','user_id'), ('notas','user_id'), ('nota_pagina','user_id'),
      ('diario_sesion','user_id'), ('recorrido_progreso','user_id'), ('camino_visto','user_id'),
      ('actividad_recurso','user_id'), ('astrologia','userId'), ('ayurveda','userId'),
      ('ayurveda_respuestas','user_id'), ('nutricion','userId'), ('tcm','userId'), ('tcm_respuestas','user_id'),
      ('cabala','idUser'), ('fitoterapia','idUser'), ('neuroPsicologia','userid')
    ) as v(tabla, col)
  loop
    begin
      execute format('delete from public.%I where %I = any($1)', t.tabla, t.col) using ids;
    exception when undefined_table or undefined_column then
      null;
    end;
  end loop;

  update public.lectura_pedido set user_id = null where user_id = any(ids);
  delete from public."user" where id = any(ids);
end $$;
