-- ─────────────────────────────────────────────────────────────────────────
-- RLS · cerrar la puerta de atrás de la base de datos
--
-- EL PROBLEMA (el correo de aviso de Supabase, «rls_disabled_in_public»):
-- Supabase no es solo una base de datos: publica automáticamente una API REST
-- sobre TODAS las tablas del esquema `public`. Quien tenga la URL del proyecto
-- y la clave `anon` puede leer, escribir y borrar en esas tablas SIN pasar por
-- nuestro servidor... salvo que la tabla tenga RLS (Row Level Security)
-- activado. Ninguna de las nuestras lo tenía.
--
-- POR QUÉ ESTE ARREGLO NO ROMPE NADA:
-- Nuestro backend no entra con la clave `anon`, entra con la de servicio
-- (SUPABASE_SERVICE_ROLE_KEY, ver backend/src/database.service.ts). El rol
-- `service_role` SALTA el RLS por diseño, igual que el editor SQL del panel.
-- Es decir: activar RLS sin escribir ninguna política deja la tabla
-- · abierta para el servidor (que es quien decide quién ve qué, con su JWT), y
-- · cerrada a cal y canto para cualquiera que venga por la API pública.
-- Que es exactamente la forma que queremos: TODO pasa por el servidor.
--
-- NO hacen falta políticas (`CREATE POLICY`). Si algún día alguna página
-- hablara con Supabase directamente desde el navegador, ENTONCES esa tabla
-- necesitaría su política; hoy ninguna lo hace.
--
-- Esto NO toca el bucket de imágenes `img`, que es público a propósito (las
-- fotos se sirven por URL directa desde la web).
--
-- CÓMO SE EJECUTA: en el editor SQL del panel de Supabase, de una vez.
-- ─────────────────────────────────────────────────────────────────────────

-- Activa RLS en TODAS las tablas del esquema público, las de hoy y las que
-- se hayan quedado sin apuntar en ningún fichero de este directorio.
do $$
declare t record;
begin
  for t in
    select c.relname
    from pg_class c
    join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'public'
      and c.relkind = 'r'          -- solo tablas de verdad
      and not c.relrowsecurity     -- las que aún no lo tienen
  loop
    execute format('alter table public.%I enable row level security', t.relname);
    raise notice 'RLS activado en %', t.relname;
  end loop;
end $$;

-- COMPROBACIÓN — después de ejecutar lo de arriba, esto tiene que devolver
-- CERO filas. Si devuelve alguna, esa tabla sigue abierta.
select c.relname as tabla_sin_rls
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public' and c.relkind = 'r' and not c.relrowsecurity;
