-- Columnas de «El Recorrido» en la tabla user.
-- Ejecútalo una vez en el SQL editor de Supabase.
--
-- metodo_*      → primera disciplina (Astrología). Ya en uso.
-- psicologia_*  → segunda disciplina (Psicología). Se marca true tras el pago
--                 (Stripe checkout → /payment/psicologia/verify).

alter table public."user" add column if not exists metodo_suscrito       boolean     not null default false;
alter table public."user" add column if not exists metodo_fecha_compra    timestamptz;
alter table public."user" add column if not exists psicologia_suscrito    boolean     not null default false;
alter table public."user" add column if not exists psicologia_fecha_compra timestamptz;
