-- Consentimiento de salud: volver a pedirlo a quien no lo dio de verdad.
--
-- El script anterior (consentimiento-salud-todos.sql, ya borrado) apuntó un «sí»
-- a TODAS las cuentas existentes sin que nadie lo diera, y la casilla del pago
-- iba mezclada con las condiciones de compra. Ninguno de esos «sí» vale como
-- consentimiento explícito (art. 7 y 9.2.a RGPD).
--
-- Esto borra TODAS las filas de consentimiento. A partir de ahí:
--  · quien pague una disciplina marca la casilla de salud, aparte, y queda apuntada;
--  · quien entre en /metodo sin consentimiento ve la ventana «Antes de seguir»;
--  · el servidor no deja guardar datos del recorrido hasta que lo haya dado.
-- Lo ya escrito NO se borra: solo se pide el permiso de nuevo.
--
-- Ejecútalo UNA vez en el SQL editor de Supabase, DESPUÉS de desplegar el cambio
-- (si lo corres antes, la gente tendría que consentir con la casilla antigua).

delete from public.recorrido_progreso where disciplina = 'consentimiento-salud';
