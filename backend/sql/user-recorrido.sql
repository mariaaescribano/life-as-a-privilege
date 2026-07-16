-- Columnas de «El Recorrido» en la tabla user.
-- Ejecútalo una vez en el SQL editor de Supabase.
--
-- metodo_*      → primera disciplina (Astrología).
-- psicologia_*  → segunda disciplina (Psicología).
-- ayurveda_*    → tercera disciplina (Ayurveda).
-- tcm_*         → cuarta disciplina (Medicina China).
-- fisiologia_*  → quinta disciplina (Fisiología).
-- nutricion_*   → sexta disciplina (Nutrición).
-- cabala_*      → séptima disciplina (Cábala).
-- Cada una se marca true tras el pago (Stripe checkout → /payment/<disc>/verify).

alter table public."user" add column if not exists metodo_suscrito         boolean     not null default false;
alter table public."user" add column if not exists metodo_fecha_compra      timestamptz;
alter table public."user" add column if not exists psicologia_suscrito      boolean     not null default false;
alter table public."user" add column if not exists psicologia_fecha_compra  timestamptz;
alter table public."user" add column if not exists ayurveda_suscrito        boolean     not null default false;
alter table public."user" add column if not exists ayurveda_fecha_compra    timestamptz;
alter table public."user" add column if not exists tcm_suscrito             boolean     not null default false;
alter table public."user" add column if not exists tcm_fecha_compra         timestamptz;
alter table public."user" add column if not exists fisiologia_suscrito      boolean     not null default false;
alter table public."user" add column if not exists fisiologia_fecha_compra  timestamptz;
alter table public."user" add column if not exists nutricion_suscrito       boolean     not null default false;
alter table public."user" add column if not exists nutricion_fecha_compra   timestamptz;
alter table public."user" add column if not exists cabala_suscrito          boolean     not null default false;
alter table public."user" add column if not exists cabala_fecha_compra      timestamptz;
