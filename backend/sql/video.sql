-- Tabla de los VÍDEOS (shorts de YouTube, TikTok, reels de Instagram) de «Vídeos».
-- Ejecútalo una vez en el SQL editor de Supabase.
--
-- Aquí no se aloja ningún vídeo: solo el enlace, la portada que subes
-- desde /admin/videos y la disciplina a la que pertenece (el mismo slug que
-- usa `curso.modalidad`, para poder pintar su icono y su color).

create table if not exists public.video (
  id          uuid primary key default gen_random_uuid(),
  disciplina  text not null,                  -- slug de la disciplina
  titulo      text not null default '',
  portada     text not null default '',       -- URL de la portada (bucket 'img')
  url         text not null default '',       -- enlace al vídeo (YouTube/TikTok/Instagram)
  publicado   boolean not null default true,
  orden       integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists video_disciplina_idx on public.video (disciplina);
create index if not exists video_publicado_idx on public.video (publicado);

-- El backend accede con SERVICE_ROLE_KEY (salta RLS), igual que el resto de tablas.
