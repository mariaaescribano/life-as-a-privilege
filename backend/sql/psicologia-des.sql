-- ─────────────────────────────────────────────────────────────────────────────
-- RESULTADO DEL TEST DES-II (DESCONEXIÓN) · recorrido de Psicología, pasos 5 y 6
--
-- Escala de Experiencias Disociativas (Carlson & Putnam): 28 frases y, en cada
-- una, el porcentaje de tiempo que le pasa a la persona. La puntuación es la
-- MEDIA de las 28, de 0 a 100.
--
-- ¿Por qué una tabla y no el JSONB del recorrido?
--   Las RESPUESTAS siguen donde todo lo demás: `metodo_psicologia.data.des`
--   (es material del recorrido, se lee y se escribe con el resto del blob).
--   El RESULTADO es otra cosa: es un dato clínico, con fecha, que interesa poder
--   consultar y comparar entre personas sin abrir el blob de cada una. Va en su
--   propia tabla, igual que el resultado del test de Ayurveda (`ayurveda`) y el
--   de Medicina China (`tcm`).
--
-- Una fila por usuario (upsert por user_id): el resultado que vale es el último.
-- Si algún día se quiere el HISTORIAL de cada vez que se hace el test, hay que
-- quitar la primary key de `user_id`, añadir un `id uuid` y cambiar el upsert de
-- metodoPsicologia.service.ts por un insert.
--
-- Las tres subescalas van en columnas y no en un JSONB porque son fijas y son
-- justo lo que se va a querer filtrar («quién tiene amnesia por encima de 30»).
-- Seis de los 28 ítems no cargan en ninguna de las tres: cuentan para `score` y
-- no para las subescalas (ver DES_SUBESCALAS en psicologiaRecorrido.ts).
--
-- El backend entra con SERVICE_ROLE_KEY (salta RLS), igual que el resto de tablas.
--
-- SE PUEDE EJECUTAR LAS VECES QUE HAGA FALTA. Pégalo en el SQL editor de
-- Supabase (o córrelo por el pooler IPv4).
-- ─────────────────────────────────────────────────────────────────────────────

create table if not exists public.psicologia_des (
  user_id            text        primary key,
  -- Media de las 28 respuestas (0–100).
  score              smallint    not null,
  -- Banda en la que cae, por su etiqueta ESTABLE: '0–9' | '10–19' | '20–29' | '30+'.
  -- Se guarda la etiqueta y no el título («Te desconectas mucho») para que el
  -- registro no dependa del idioma en que se hizo el test ni de retoques de texto.
  banda              text        not null,
  -- Las tres caras de la desconexión, cada una 0–100.
  amnesia            smallint    not null,   -- lagunas de memoria
  despersonalizacion smallint    not null,   -- estar fuera de ti
  absorcion          smallint    not null,   -- irte con la mente
  -- ¿Pide cuidado antes de los ejercicios que remueven? (media o una subescala
  -- que no sea absorción ≥ 30). Es lo que saca el aviso del paso «Narra».
  alto               boolean     not null default false,
  -- Cuándo salió ESTE resultado. No se refresca si se reescribe lo mismo.
  fecha              timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

-- Para poder listar de mayor a menor desconexión sin recorrer la tabla entera.
create index if not exists psicologia_des_score_idx
  on public.psicologia_des (score desc);

-- (Opcional) integridad referencial con la tabla de usuarios. Quítalo si el
-- tipo/clave de public."user" no coincide o no quieres la restricción.
-- alter table public.psicologia_des
--   add constraint psicologia_des_user_fk
--   foreign key (user_id) references public."user"(id) on delete cascade;
