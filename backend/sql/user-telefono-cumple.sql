-- Teléfono, fecha de nacimiento y el regalo de cumpleaños.
--
--   telefono                   opcional, se pide al crear la cuenta.
--   fecha_nacimiento           opcional. Darla ES el consentimiento para la
--                              felicitación con el 50 % (así se explica junto
--                              al campo); quitarla en «Mi cuenta» la apaga.
--   cumple_enviado_anio        año en que ya se mandó la felicitación: el cron
--                              diario no la repite.
--   cumple_descuento_usado_anio año en que ya se usó el 50 %: vale para UNA
--                              disciplina por cumpleaños.
--   comunidad_popup_visto      el popup de la comunidad sale una sola vez, la
--                              primera vez que entra. Default TRUE para que no
--                              les salte a las cuentas que ya existen; el
--                              registro inserta FALSE.
--
-- Ejecútalo una vez en el SQL editor de Supabase.

alter table public."user"
  add column if not exists telefono text,
  add column if not exists fecha_nacimiento date,
  add column if not exists cumple_enviado_anio integer,
  add column if not exists cumple_descuento_usado_anio integer,
  add column if not exists comunidad_popup_visto boolean not null default true;
