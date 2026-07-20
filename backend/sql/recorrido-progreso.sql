-- Progreso SECUENCIAL del recorrido, por usuario y disciplina. Guarda el paso
-- MÁXIMO desbloqueado: el Índice bloquea (candado, no navega) cualquier paso
-- posterior. Cada disciplina usa su propia clave (p.ej. 'psicologia').
-- Ejecútalo una vez en el SQL editor de Supabase.
--
-- El backend (recorridoProgreso.service.ts) hace upsert por (user_id, disciplina)
-- y solo AVANZA el paso (nunca lo baja): paso_max = max(actual, nuevo).
--
-- El backend accede con SERVICE_ROLE_KEY (salta RLS), igual que el resto de tablas.

create table if not exists public.recorrido_progreso (
  user_id     text        not null,
  disciplina  text        not null,
  paso_max    int         not null default 1,
  updated_at  timestamptz not null default now(),
  primary key (user_id, disciplina)
);
