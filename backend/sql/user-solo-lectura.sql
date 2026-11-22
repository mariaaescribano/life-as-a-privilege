-- «Cuenta solo carta»: la de quien únicamente ha pedido la carta de su lectura (Astrología → Adquirir).
-- Se crea al pagar, SIN acceso: no recibe el correo para elegir contraseña hasta que la admin
-- se lo manda desde /admin/lecturas. Solo la escribe el backend.
--
-- Ejecútalo una vez en el SQL editor de Supabase.

alter table public."user"
  add column if not exists solo_lectura boolean not null default false;
