-- «Está haciendo sesiones conmigo»: la marca que se enciende en la tabla de
-- usuarios del panel (/admin/usuarios). Con ella encendida, la fila enseña el
-- botón «Diario de terapias» (el diario_sesion de esa persona).
--
-- Solo la escribe la admin (POST /user/admin/sesiones); el usuario no la ve.
--
-- Ejecútalo una vez en el SQL editor de Supabase.

alter table public."user"
  add column if not exists en_sesiones boolean not null default false;
