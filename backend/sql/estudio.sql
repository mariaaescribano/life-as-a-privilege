-- ─────────────────────────────────────────────────────────────────────────────
-- ESTUDIO ESTADÍSTICO SOBRE ASTROLOGÍA
--
-- Dos tablas y una vista. La idea del estudio es poder decir frases como
-- «las personas con Mercurio en Aries han respondido un 90% que sí», así que
-- TODO se guarda ya troceado por la posición exacta del planeta.
--
--   estudio_participante → quién participa: su email y su carta natal calculada.
--   estudio_respuesta    → una fila por pregunta contestada (Sí/No).
--   estudio_stats (vista)→ el recuento agregado que alimenta las estadísticas.
--
-- Cada arquetipo tiene DOS EJES y se pregunta por los dos por separado:
--   eje='signo', posicion='Aries' … 'Piscis'
--   eje='casa',  posicion='1' … '12'
-- Por eso la respuesta no guarda «el signo» sino el par (eje, posicion): así una
-- pregunta de «Sol en Leo» y una de «Sol en la casa 5» se cuentan cada una en su
-- grupo, y añadir ejes nuevos en el futuro no obliga a cambiar la tabla.
--
-- La posición se COPIA en cada respuesta a propósito (no se busca en la carta al
-- consultar): así el agregado es un simple GROUP BY y una respuesta antigua no
-- cambia de grupo si algún día se recalcula la carta con otro algoritmo.
--
-- El backend entra con SERVICE_ROLE_KEY (salta RLS), igual que el resto de tablas.
--
-- SE PUEDE EJECUTAR LAS VECES QUE HAGA FALTA: crea lo que falte y actualiza lo
-- que se quedó con la forma antigua (la primera versión guardaba una columna
-- `signo` en vez del par eje/posición). Pégalo entero en el SQL editor de
-- Supabase (o córrelo por el pooler IPv4).
-- ─────────────────────────────────────────────────────────────────────────────

/* ─────────────────────── 1. Tablas ─────────────────────── */

create table if not exists public.estudio_participante (
  id                uuid primary key default gen_random_uuid(),
  email             text        not null,
  fecha_nacimiento  date        not null,
  hora_nacimiento   text        not null,          -- HH:MM (hora local del lugar)
  pais              text,
  region            text,
  lugar             text,
  latitud           double precision,
  longitud          double precision,
  timezone          text,
  -- Carta natal completa tal cual la calcula cartaNatal.service.ts.
  carta_natal_json  jsonb,
  -- Denormalizado para el estudio, un mapa por eje:
  --   signos = { "sol": "Leo", "luna": "Tauro", … }
  --   casas  = { "sol": 5,     "luna": 11,      … }   (el Ascendente no tiene)
  signos            jsonb       not null default '{}'::jsonb,
  casas             jsonb       not null default '{}'::jsonb,
  -- Si quien participa tenía sesión abierta, se anota (opcional, informativo).
  user_id           text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create table if not exists public.estudio_respuesta (
  participante_id uuid        not null references public.estudio_participante(id) on delete cascade,
  planeta         text        not null,   -- 'sol', 'luna', 'ascendente', …
  eje             text        not null,   -- 'signo' | 'casa'
  posicion        text        not null,   -- 'Leo' | '5'  (la de ESA carta)
  pregunta_id     text        not null,   -- id estable de la pregunta ('sol-leo-1', …)
  respuesta       boolean     not null,   -- true = Sí, false = No
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  primary key (participante_id, planeta, pregunta_id)
);

/* ──────── 2. Puesta al día de una base creada con la forma antigua ────────
 *
 * La primera versión del estudio tenía un solo eje: `estudio_respuesta.signo` y
 * ningún mapa de casas en el participante. Si la base ya se creó así, los
 * `create table if not exists` de arriba no han hecho nada y hay que completarla.
 * En una base recién creada todo esto son no-ops. */

-- LO PRIMERO: la vista antigua lee la columna `signo`, así que mientras exista
-- no se puede borrar esa columna («cannot drop column … other objects depend on
-- it»). Se tira aquí y se vuelve a crear, ya con la forma nueva, al final.
drop view if exists public.estudio_stats;

alter table public.estudio_participante
  add column if not exists casas jsonb not null default '{}'::jsonb;

alter table public.estudio_respuesta add column if not exists eje      text;
alter table public.estudio_respuesta add column if not exists posicion text;

-- Las respuestas que había eran todas del eje de signo: se reetiquetan como tal
-- y su antiguo `signo` pasa a ser la posición. Después, esa columna sobra.
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name   = 'estudio_respuesta'
      and column_name  = 'signo'
  ) then
    update public.estudio_respuesta
       set eje      = coalesce(eje, 'signo'),
           posicion = coalesce(posicion, signo);
    alter table public.estudio_respuesta drop column signo;
  end if;
end $$;

-- Por si quedara alguna fila suelta sin etiquetar (no debería).
update public.estudio_respuesta set eje      = 'signo' where eje is null;
update public.estudio_respuesta set posicion = ''      where posicion is null;

alter table public.estudio_respuesta alter column eje      set not null;
alter table public.estudio_respuesta alter column posicion set not null;

/* ─────────────────────── 3. Índices ─────────────────────── */

-- Un participante por email: si vuelve a entrar con el mismo correo, corrige
-- sus datos en lugar de duplicar la muestra (y sus respuestas se conservan).
create unique index if not exists estudio_participante_email_key
  on public.estudio_participante (lower(email));

-- Índice del agregado: la vista siempre agrupa por estas cuatro columnas.
create index if not exists estudio_respuesta_grupo_idx
  on public.estudio_respuesta (planeta, eje, posicion, pregunta_id);

/* ─────────────────── 4. Vista de estadísticas ───────────────────
 * Se consulta desde el backend con un simple select + filtros; PostgREST no sabe
 * hacer GROUP BY, así que el agrupado vive aquí. Ya se borró arriba: no vale
 * `create or replace` porque cambian sus columnas (donde había `signo` ahora hay
 * `eje` y `posicion`). */

create view public.estudio_stats as
select
  planeta,
  eje,
  posicion,
  pregunta_id,
  count(*)::int                              as total,
  count(*) filter (where respuesta)::int     as si,
  count(*) filter (where not respuesta)::int as no
from public.estudio_respuesta
group by planeta, eje, posicion, pregunta_id;
