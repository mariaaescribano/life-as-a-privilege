-- Intro del recorrido: cómic del Origen que se muestra la PRIMERA vez que el
-- usuario entra en cada disciplina (tras pagar). Al terminarlo, pulsa «Gracias,
-- no volver a ver» y se marca esta columna a true para no volver a mostrarlo.
--
-- Ejecútalo una vez en el SQL editor de Supabase.
--
--   · Astrología → cómic del Origen «según la espiritualidad»
--   · Psicología → cómic de intro (nuestra historia / apego)
--   · Ayurveda   → cómic del Origen (ilustraciones de hinduismo)
--   · Medicina China → cómic del Origen «según el taoísmo»
--
-- El backend (metodo*.service.ts) permite escribir `intro_visto` vía PATCH.

alter table public.metodo_astrologia  add column if not exists intro_visto boolean not null default false;
alter table public.metodo_psicologia  add column if not exists intro_visto boolean not null default false;
alter table public.metodo_ayurveda    add column if not exists intro_visto boolean not null default false;
alter table public.metodo_tcm          add column if not exists intro_visto boolean not null default false;
