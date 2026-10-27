-- El formulario de la portada pide nombre y email. Ejecútalo una vez en el SQL editor de Supabase.
alter table public.suscriptor add column if not exists nombre text;
