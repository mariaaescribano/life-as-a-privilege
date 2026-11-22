-- Pedidos de «carta de la lectura» (el servicio de Astrología que se paga en la web).
-- Cada fila nace cuando Stripe confirma el pago; guarda los datos de nacimiento (todos obligatorios, de ahí
-- sale la carta), el servicio elegido, quién es la persona y en qué punto está la carta.
--
-- Solo la lee y la escribe el backend (service_role); con RLS activado y sin políticas no entra nadie más.
-- Ejecútalo una vez en el SQL editor de Supabase. (También está en 00-esquema-completo.sql.)

create table if not exists public.lectura_pedido (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  nombre text not null,
  email text not null,
  -- 'pdf_parcial' | 'pdf_completo' | 'plataforma'
  servicio text not null,
  precio_centimos integer not null,
  fecha_nacimiento date not null,
  hora_nacimiento text not null,   -- HH:MM
  lugar_nacimiento text not null,
  -- El id de la sesión de Stripe: evita crear dos veces el pedido (webhook + verify).
  stripe_session_id text unique,
  pagado boolean not null default true,
  -- La cuenta «solo carta» de la persona (columna user.solo_lectura). Sin acceso hasta que la admin lo envíe.
  user_id text,
  -- 'recibido' | 'en_proceso' | 'lista'
  estado text not null default 'recibido',
  acceso_enviado_at timestamptz
);

create index if not exists lectura_pedido_created_at_idx on public.lectura_pedido (created_at desc);
alter table public.lectura_pedido enable row level security;
