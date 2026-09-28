-- Consentimiento de salud: darlo por dado a TODAS las cuentas que ya existen.
--
-- La puerta que lo pedía dentro de /metodo (PuertaConsentimientoSalud) se ha
-- quitado: el permiso viene ahora de la casilla del pago («Acepto las
-- condiciones de compra», cuyo apartado 5 de /terminos incluye el guardado de
-- lo que se escriba para personalizar las sesiones). A las cuentas anteriores
-- se les apunta aquí la fila para que nada vuelva a pedírselo.
--
-- Es idempotente: se puede correr dos veces sin duplicar nada.
-- Ejecútalo una vez en el SQL editor de Supabase.

insert into public.recorrido_progreso (user_id, disciplina, paso_max, updated_at)
select u.id, 'consentimiento-salud', 1, now()
from public."user" u
where not exists (
  select 1
  from public.recorrido_progreso rp
  where rp.user_id = u.id
    and rp.disciplina = 'consentimiento-salud'
);
