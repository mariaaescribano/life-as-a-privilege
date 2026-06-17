-- Tabla de cursos para el panel de administración.
-- Ejecútalo una vez en el SQL editor de Supabase.
--
-- El árbol de módulos/lecciones se guarda en `contenido` (JSONB):
--   [
--     {
--       "title": "Introducción",
--       "submodules": [
--         { "id": "leccion-1", "nom": "Orígenes", "tipo": "texto", "contenido": "# ...markdown..." },
--         { "id": "leccion-2", "nom": "Vídeo intro", "tipo": "video", "video": "<youtubeId>" },
--         { "id": "leccion-3", "nom": "Test final", "tipo": "test", "ejercicios": [
--             { "tipo": "opcion", "enunciado": "¿...?", "opciones": ["A","B"], "correcta": 0 },
--             { "tipo": "verdadero", "enunciado": "...", "correcta": true },
--             { "tipo": "relacionar", "enunciado": "Une cada pareja", "pares": [{ "izquierda": "X", "derecha": "Y" }] }
--         ] }
--       ]
--     }
--   ]

create table if not exists public.curso (
  id           uuid primary key default gen_random_uuid(),
  modalidad    text not null,                 -- slug de la disciplina (clave de cursosData)
  titulo       text not null default '',
  foto         text not null default '',      -- ruta/URL de la imagen (la subes tú a /img)
  descripcion  text not null default '',
  descripcion_contenido text not null default '', -- frase bajo "Contenido del curso" (si vacía, se usa descripcion)
  de_pago      boolean not null default false,-- true = precio fijo + link Stripe; false = gratis
  publicado    boolean not null default true,
  completado   boolean not null default false,-- true = terminado por la admin (organización interna)
  orden        integer not null default 0,
  contenido    jsonb not null default '[]'::jsonb,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists curso_modalidad_idx on public.curso (modalidad);
create index if not exists curso_publicado_idx on public.curso (publicado);

-- Si la tabla ya existía, añade las columnas nuevas:
alter table public.curso add column if not exists completado boolean not null default false;
alter table public.curso add column if not exists descripcion_contenido text not null default '';

-- El backend accede con SERVICE_ROLE_KEY (salta RLS), igual que el resto de tablas.
