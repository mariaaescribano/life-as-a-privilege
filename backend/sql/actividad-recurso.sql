-- Qué recursos GRATUITOS abre cada persona con cuenta (ilustraciones, cursos,
-- lecciones, libros, tests, presentaciones…). Sirve para saber qué le interesa
-- y mandarle los emails semanales con lo que más le puede tocar.
--
-- Una fila por (persona, recurso). `recurso` es la ruta de la página
-- (p.ej. '/aprendizaje/modulosPage/Astrología/12') o, para lo que se abre
-- dentro de una página, la ruta + '#' + id (una ilustración de la galería).
--
-- `veces` cuenta VISITAS, no recargas: el backend solo suma si la última vez
-- fue hace más de 30 minutos (actividad.service.ts).
--
-- Solo se apunta con sesión iniciada: a quien no tiene cuenta no hay a quién
-- escribirle, y así no hace falta cookie ninguna.
--
-- Ejecútalo una vez en el SQL editor de Supabase (o por el pooler).

create table if not exists public.actividad_recurso (
  user_id      text        not null,
  recurso      text        not null,
  tipo         text        not null,   -- 'curso' | 'leccion' | 'ilustracion' | 'libro' | …
  disciplina   text,                   -- 'astrologia' | 'psicologia' | … | null (galería general)
  titulo       text,                   -- cuando la página lo sabe (una ilustración)
  veces        int         not null default 1,
  primera_vez  timestamptz not null default now(),
  ultima_vez   timestamptz not null default now(),
  primary key (user_id, recurso)
);

create index if not exists actividad_recurso_ultima_vez_idx
  on public.actividad_recurso (ultima_vez desc);

-- Como todas: RLS activado y SIN políticas (el backend va con service_role).
alter table public.actividad_recurso enable row level security;
