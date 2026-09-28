-- Fecha de creación de la cuenta, para ordenar la tabla de /admin/usuarios por
-- las más recientes.
--
-- Va SIN backfill a propósito: las cuentas de antes de esta columna se quedan
-- con NULL («no se sabe cuándo se crearon»), que la tabla enseña como «—» y
-- ordena al final. Rellenarlas con now() les pondría a todas la fecha de la
-- migración, que es mentira. Las cuentas nuevas la cogen solas por el default.
--
-- Ejecútalo una vez en el SQL editor de Supabase.

alter table public."user"
  add column if not exists created_at timestamptz default now();
