-- La cuenta creada con email y contraseña no se puede usar hasta pulsar el
-- enlace del correo de bienvenida (/logIn?confirmar=...).
--
-- El default es TRUE a propósito: así todas las cuentas que ya existen (y las
-- de Google, que ya vienen con el email comprobado) quedan confirmadas. Solo el
-- registro con contraseña inserta FALSE.
--
-- Ejecútalo una vez en el SQL editor de Supabase. Hasta entonces el registro
-- sigue funcionando, pero sin exigir la confirmación.

alter table public."user"
  add column if not exists email_confirmado boolean not null default true;
