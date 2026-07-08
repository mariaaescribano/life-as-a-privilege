-- Tabla del recorrido de MEDICINA CHINA (Los 5 Elementos · Equilibrio · Ciclos
-- Sheng/Ke · Auto-observación). Ejecútalo una vez en el SQL editor de Supabase.
--
-- Todo el progreso del usuario se guarda en la columna `data` (JSONB). Una sola
-- fila por usuario. El backend (metodoTcm.service.ts) hace upsert por user_id y
-- solo permite escribir el campo `data`. Como `data` es JSONB, NO hace falta
-- migrar al añadir campos nuevos: se guardan/leen tal cual.
--
-- Forma de `data` (ver también frontend/src/components/metodo/tcmRecorrido.ts):
--   {
--     -- Paso 1 "¿Cómo está tu equilibrio hoy?": test inicial. Guardamos las
--     -- respuestas crudas (por `key` estable) y las puntuaciones derivadas por
--     -- elemento. La puntuación FINAL del recorrido = testInicial + los 5 mini-tests.
--     "testInicial": {
--       "respuestas": { "energia": "opcionId", "emocion": "opcionId", ... },
--       "puntos": { "madera": 3, "fuego": 1, "tierra": 5, "metal": 2, "agua": 4 }
--     },
--
--     -- Pasos 4-8 "El viaje": un bloque por elemento. `leido` gobierna el
--     -- desbloqueo secuencial (Madera→Fuego→Tierra→Metal→Agua). `miniTest`
--     -- aporta más puntos al perfil final.
--     "elementos": {
--       "madera": { "leido": true,  "miniTest": { "respuestas": {...}, "puntos": {...} } },
--       "fuego":  { "leido": false, "miniTest": null },
--       "tierra": { ... }, "metal": { ... }, "agua": { ... }
--     },
--
--     -- Paso 12 "Aprende a escucharte": notas libres de auto-observación.
--     "observarte": {
--       "lengua": "texto...", "rostro": "...", "voz": "...", "postura": "...",
--       "sensaciones": "...", "sueno": "...", "digestion": "...",
--       "eliminacion": "...", "emociones": "..."
--     },
--
--     -- Paso 13 "Cierre": compromiso final del usuario.
--     "compromiso": "texto..."
--   }

create table if not exists public.metodo_tcm (
  user_id     text        primary key,
  data        jsonb       not null default '{}'::jsonb,
  updated_at  timestamptz not null default now()
);

-- (Opcional) integridad referencial con la tabla de usuarios. Quítalo si el
-- tipo/clave de public."user" no coincide o no quieres la restricción.
-- alter table public.metodo_tcm
--   add constraint metodo_tcm_user_fk
--   foreign key (user_id) references public."user"(id) on delete cascade;

-- El backend accede con SERVICE_ROLE_KEY (salta RLS), igual que el resto de tablas.

-- ── Flags de acceso a la disciplina en la tabla user (4ª disciplina) ──
-- Se marca true tras el pago (Stripe checkout → /payment/tcm/verify).
alter table public."user" add column if not exists tcm_suscrito       boolean     not null default false;
alter table public."user" add column if not exists tcm_fecha_compra    timestamptz;
